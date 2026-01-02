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

/**
 * Type definitions for student responses
 */
export interface StudentResponse {
  id: string;
  user_id: string;
  session_id: string;
  question_number: number;
  question_topic: string;
  question_text: string;
  response_text: string;
  grade: number | null;
  feedback: string | null;
  response_time_ms: number | null;
  xp_earned: number;
  streak_at_time: number;
  embedding?: number[];
  created_at?: string;
}

/**
 * Type definitions for game sessions
 */
export interface GameSession {
  id: string;
  user_id: string;
  final_score: number | null;
  total_questions: number | null;
  total_xp: number | null;
  max_streak: number | null;
  completed_at?: string;
}

/**
 * Type definitions for user profiles
 */
export interface UserProfile {
  user_id: string;
  display_name: string | null;
  email: string | null;
  avatar_seed: string | null;
  show_on_leaderboard: boolean | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Type definitions for leaderboard entries
 */
export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  display_name: string;
  avatar_seed: string | null;
  total_xp: number;
  total_games: number;
  best_score: number | null;
  avg_score: number | null;
  longest_streak: number | null;
  weekly_xp?: number;
  games_played?: number;
}

/**
 * Type definitions for teacher search results
 */
export interface TeacherSearchResult {
  id: string;
  user_id: string;
  question_topic: string;
  question_text: string;
  response_text: string;
  grade: number | null;
  feedback: string | null;
  response_time_ms: number | null;
  similarity: number;
}

