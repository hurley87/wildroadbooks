import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env.local file explicitly (Next.js convention)
// MUST be done before any imports that depend on environment variables
config({ path: resolve(process.cwd(), '.env.local') });

import { readFileSync } from 'fs';
import { join } from 'path';

interface Chunk {
  id: string;
  content: string;
  metadata: Record<string, unknown>;
  word_count?: number;
}

interface ChunksData {
  meta: {
    source: string;
    extracted_at: string;
    total_chunks: number;
    total_chapters: number;
  };
  chunks: Chunk[];
}

/**
 * Load chunks data from JSON file
 */
function loadChunksData(): ChunksData {
  const filePath = join(process.cwd(), 'content', 'chunks.json');
  const fileContents = readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContents) as ChunksData;
}

/**
 * Generate a single embedding using Google's text-embedding-004 model via REST API
 */
async function generateSingleEmbedding(text: string): Promise<number[]> {
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
        parts: [{ text }],
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
 * Generate embeddings using Google's text-embedding-004 model via REST API
 * This is a workaround for the AI SDK 6 compatibility issue with Google's v1 embedding model
 * Uses individual API calls (Google's batch endpoint may not be available for embeddings)
 */
async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  // Process embeddings in parallel with a concurrency limit
  const CONCURRENCY = 5;
  const embeddings: number[][] = [];
  
  for (let i = 0; i < texts.length; i += CONCURRENCY) {
    const batch = texts.slice(i, i + CONCURRENCY);
    const batchEmbeddings = await Promise.all(
      batch.map(text => generateSingleEmbedding(text))
    );
    embeddings.push(...batchEmbeddings);
  }
  
  return embeddings;
}

/**
 * Ingestion script to embed chunks and store them in Supabase
 * Handles batching, rate limits, and idempotent upserts
 */
async function ingestChunks() {
  // Import supabase after env vars are loaded
  const { supabase } = await import('../src/lib/supabase');
  
  const data = loadChunksData();
  const chunks = data.chunks;
  const totalChunks = chunks.length;
  
  console.log(`Starting ingestion of ${totalChunks} chunks...`);
  console.log(`Source: ${data.meta.source}`);
  
  const BATCH_SIZE = 20;
  const DELAY_MS = 1000; // 1 second delay between batches
  
  let processed = 0;
  let errors = 0;
  
  // Process chunks in batches
  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batch = chunks.slice(i, i + BATCH_SIZE);
    const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(totalChunks / BATCH_SIZE);
    
    try {
      console.log(`\nProcessing batch ${batchNumber}/${totalBatches} (${batch.length} chunks)...`);
      
      // Generate embeddings for the batch using Google's REST API directly
      const texts = batch.map(chunk => chunk.content);
      const embeddings = await generateEmbeddings(texts);
      
      if (embeddings.length !== batch.length) {
        throw new Error(`Expected ${batch.length} embeddings, got ${embeddings.length}`);
      }
      
      // Prepare data for upsert
      const rows = batch.map((chunk, idx) => ({
        id: chunk.id,
        content: chunk.content,
        metadata: {
          ...chunk.metadata,
          word_count: chunk.word_count,
        },
        embedding: embeddings[idx],
      }));
      
      // Upsert to Supabase (idempotent - will update if exists)
      const { error } = await supabase
        .from('chunks')
        .upsert(rows, {
          onConflict: 'id',
        });
      
      if (error) {
        throw error;
      }
      
      processed += batch.length;
      console.log(`✓ Successfully processed ${batch.length} chunks (${processed}/${totalChunks} total)`);
      
      // Delay between batches to respect rate limits (except for last batch)
      if (i + BATCH_SIZE < chunks.length) {
        await new Promise(resolve => setTimeout(resolve, DELAY_MS));
      }
    } catch (error) {
      errors += batch.length;
      console.error(`✗ Error processing batch ${batchNumber}:`, error);
      
      // If it's a rate limit error, wait longer before retrying
      if (error instanceof Error && error.message.includes('rate limit')) {
        console.log('Rate limit detected, waiting 5 seconds...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        // Retry this batch
        i -= BATCH_SIZE;
        continue;
      }
      
      // For other errors, continue with next batch
      console.log('Continuing with next batch...');
    }
  }
  
  console.log(`\n=== Ingestion Complete ===`);
  console.log(`Processed: ${processed}/${totalChunks}`);
  console.log(`Errors: ${errors}`);
  
  if (errors > 0) {
    console.warn(`\nWarning: ${errors} chunks failed to process. You may need to re-run the script.`);
    process.exit(1);
  }
}

// Run ingestion
ingestChunks().catch((error) => {
  console.error('Fatal error during ingestion:', error);
  process.exit(1);
});

