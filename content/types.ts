/**
 * Type definitions for the RAG chunking pipeline
 */

export interface ChunkMetadata {
  source: "Catching Unicorns";
  chapter: string;
  section?: string;
  key_concepts: string[];
  page_range: string;
  chunk_index: number;
  total_chunks_in_chapter: number;
}

export interface Chunk {
  id: string;
  content: string;
  metadata: ChunkMetadata;
  word_count: number;
}

export interface ChunkOutput {
  meta: {
    source: string;
    extracted_at: string;
    total_chunks: number;
    total_chapters: number;
  };
  system_prompt_context: string;
  chunks: Chunk[];
}

export interface ChapterWithPages {
  title: string;
  content: string;
  startPage: number;
  endPage: number;
  startIndex: number; // Position in the full cleaned text
  endIndex: number;   // Position in the full cleaned text
}

export interface TextWithPages {
  text: string;
  pages: Array<{
    pageNumber: number;
    startIndex: number;
    endIndex: number;
  }>;
}

