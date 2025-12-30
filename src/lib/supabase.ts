import { createClient } from '@supabase/supabase-js';

if (!process.env.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL environment variable');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');
}

/**
 * Supabase client with service role key for server-side operations
 * This client bypasses RLS policies and should only be used server-side
 */
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

/**
 * Type definitions for chunk data
 */
export interface ChunkRow {
  id: string;
  content: string;
  metadata: Record<string, unknown>;
  embedding?: number[];
  created_at?: string;
}

/**
 * Type definitions for hybrid search results
 */
export interface HybridSearchResult {
  id: string;
  content: string;
  metadata: Record<string, unknown>;
  similarity: number;
  rrf_score: number;
}




