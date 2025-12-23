import { cohere } from '@ai-sdk/cohere';
import { rerank } from 'ai';
import { supabase, type HybridSearchResult } from './supabase';

export interface RetrievedChunk {
  id: string;
  content: string;
  metadata: Record<string, unknown>;
  similarity: number;
  rrf_score: number;
}

/**
 * Embed a user query using Google's text-embedding-004 model via REST API
 * This is a workaround for the AI SDK 6 compatibility issue with Google's v1 embedding model
 */
async function embedQuery(query: string): Promise<number[]> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GOOGLE_GENERATIVE_AI_API_KEY environment variable');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'models/text-embedding-004',
      content: {
        parts: [{ text: query }],
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  
  if (!data.embedding || !data.embedding.values) {
    throw new Error('Invalid response from Google embedding API');
  }

  return data.embedding.values;
}

/**
 * Perform hybrid search (semantic + full-text) using Supabase pgvector
 * Uses Reciprocal Rank Fusion (RRF) to combine results
 */
async function hybridSearch(
  queryEmbedding: number[],
  queryText: string,
  topK: number = 10
): Promise<HybridSearchResult[]> {
  const { data, error } = await supabase.rpc('hybrid_search', {
    query_embedding: queryEmbedding,
    query_text: queryText,
    match_count: topK,
    rrf_k: 60,
  });
  
  if (error) {
    console.error('Hybrid search error:', error);
    throw new Error(`Hybrid search failed: ${error.message}`);
  }
  
  return (data || []) as HybridSearchResult[];
}

/**
 * Rerank search results using Cohere rerank API
 * Falls back to original order if reranking fails
 */
async function rerankResults(
  query: string,
  candidates: HybridSearchResult[],
  topK: number = 5
): Promise<RetrievedChunk[]> {
  if (candidates.length === 0) {
    return [];
  }
  
  // If we have fewer candidates than requested, return all
  if (candidates.length <= topK) {
    return candidates.map(c => ({
      id: c.id,
      content: c.content,
      metadata: c.metadata,
      similarity: c.similarity,
      rrf_score: c.rrf_score,
    }));
  }
  
  try {
    // Prepare documents for reranking
    const documents = candidates.map(c => c.content);
    
    // Rerank using Cohere
    const { ranking } = await rerank({
      model: cohere.reranking('rerank-english-v3.0'),
      query,
      documents,
      topN: topK,
    });
    
    // Map reranked results back to chunks
    const rerankedChunks = ranking.map(result => {
      const originalIndex = result.originalIndex;
      const candidate = candidates[originalIndex];
      return {
        id: candidate.id,
        content: candidate.content,
        metadata: candidate.metadata,
        similarity: candidate.similarity,
        rrf_score: candidate.rrf_score,
      };
    });
    
    return rerankedChunks;
  } catch (error) {
    console.warn('Reranking failed, using original order:', error);
    // Fallback to original order (top K by RRF score)
    return candidates
      .slice(0, topK)
      .map(c => ({
        id: c.id,
        content: c.content,
        metadata: c.metadata,
        similarity: c.similarity,
        rrf_score: c.rrf_score,
      }));
  }
}

/**
 * Main retrieval function: embed query, perform hybrid search, and rerank results
 * 
 * @param query - User's search query
 * @param topK - Number of chunks to retrieve (default: 5)
 * @returns Array of retrieved chunks ordered by relevance
 */
export async function retrieveContext(
  query: string,
  topK: number = 5
): Promise<RetrievedChunk[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }
  
  try {
    // Step 1: Embed the query
    const queryEmbedding = await embedQuery(query);
    
    // Step 2: Perform hybrid search (get more candidates than needed for reranking)
    const candidates = await hybridSearch(queryEmbedding, query, topK * 2);
    
    if (candidates.length === 0) {
      console.warn('No chunks found for query:', query);
      return [];
    }
    
    // Step 3: Rerank results using Cohere
    const reranked = await rerankResults(query, candidates, topK);
    
    return reranked;
  } catch (error) {
    console.error('Retrieval error:', error);
    // Return empty array on error rather than throwing
    // This allows the chat to continue even if retrieval fails
    return [];
  }
}

