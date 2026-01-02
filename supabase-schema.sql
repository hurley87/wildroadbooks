-- Enable pgvector extension
create extension if not exists vector;

-- Create chunks table (if not exists)
create table if not exists chunks (
  id text primary key,
  content text not null,
  metadata jsonb not null default '{}',
  embedding vector(768),
  created_at timestamptz default now()
);

-- Add missing columns to existing chunks table
do $$
begin
  -- Add fts column if it doesn't exist
  if not exists (
    select 1 from information_schema.columns 
    where table_name = 'chunks' and column_name = 'fts'
  ) then
    alter table chunks add column fts tsvector 
      generated always as (to_tsvector('english', content)) stored;
  end if;
  
  -- Add other columns if missing (for future migrations)
  -- Example: if not exists (select 1 from information_schema.columns where table_name = 'chunks' and column_name = 'new_column')
  --   then alter table chunks add column new_column text;
  -- end if;
end $$;

-- Create HNSW index for fast similarity search (if not exists)
create index if not exists chunks_embedding_idx on chunks using hnsw (embedding vector_cosine_ops);

-- Create GIN index for full-text search (BM25-style)
create index if not exists chunks_fts_idx on chunks using gin (fts);

-- Hybrid search function with RRF (Reciprocal Rank Fusion)
create or replace function hybrid_search(
  query_embedding vector(768),
  query_text text,
  match_count int default 10,
  rrf_k int default 60
)
returns table (
  id text,
  content text,
  metadata jsonb,
  similarity float,
  rrf_score float
)
language sql
as $$
  with semantic as (
    select id, content, metadata,
           1 - (embedding <=> query_embedding) as similarity,
           row_number() over (order by embedding <=> query_embedding) as rank
    from chunks
    where embedding is not null
    order by embedding <=> query_embedding
    limit match_count * 2
  ),
  fulltext as (
    select id, content, metadata,
           ts_rank_cd(fts, websearch_to_tsquery('english', query_text)) as rank_score,
           row_number() over (order by ts_rank_cd(fts, websearch_to_tsquery('english', query_text)) desc) as rank
    from chunks
    where fts @@ websearch_to_tsquery('english', query_text)
    limit match_count * 2
  ),
  rrf as (
    select 
      coalesce(s.id, f.id) as id,
      coalesce(s.content, f.content) as content,
      coalesce(s.metadata, f.metadata) as metadata,
      coalesce(s.similarity, 0) as similarity,
      (coalesce(1.0 / (rrf_k + s.rank), 0) + coalesce(1.0 / (rrf_k + f.rank), 0)) as rrf_score
    from semantic s
    full outer join fulltext f on s.id = f.id
  )
  select id, content, metadata, similarity, rrf_score
  from rrf
  order by rrf_score desc
  limit match_count;
$$;

-- Student responses table
create table if not exists student_responses (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  session_id uuid not null,
  question_number int not null,
  question_topic text not null,
  question_text text not null,
  response_text text not null,
  grade decimal(2,1) check (grade in (0, 0.5, 1)),
  feedback text,
  response_time_ms int,
  xp_earned int default 0,
  streak_at_time int default 0,
  embedding vector(768),
  created_at timestamptz default now()
);

-- Indexes for student_responses
create index if not exists idx_responses_user on student_responses(user_id);
create index if not exists idx_responses_session on student_responses(session_id);
create index if not exists idx_responses_topic on student_responses(question_topic);
create index if not exists student_responses_embedding_idx on student_responses using hnsw (embedding vector_cosine_ops);

-- Game sessions table
create table if not exists game_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  final_score decimal(3,1),
  total_questions int,
  total_xp int,
  max_streak int,
  completed_at timestamptz default now()
);

-- Index for game_sessions
create index if not exists idx_sessions_user on game_sessions(user_id);
create index if not exists idx_sessions_completed on game_sessions(completed_at desc);

-- User profiles table
create table if not exists user_profiles (
  user_id text primary key,
  display_name text,
  email text,
  avatar_seed text default gen_random_uuid()::text,
  show_on_leaderboard boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Leaderboard stats materialized view
-- Drop if exists and recreate to ensure it's up to date
drop materialized view if exists leaderboard_stats cascade;

create materialized view leaderboard_stats as
select 
  gs.user_id,
  coalesce(up.display_name, 
    'Player ' || substring(gs.user_id from 1 for 6)) as display_name,
  up.avatar_seed,
  up.show_on_leaderboard,
  count(gs.id) as total_games,
  sum(gs.total_xp) as total_xp,
  max(gs.final_score) as best_score,
  avg(gs.final_score)::decimal(3,1) as avg_score,
  max(gs.max_streak) as longest_streak,
  max(gs.completed_at) as last_played
from game_sessions gs
left join user_profiles up on gs.user_id = up.user_id
group by gs.user_id, up.display_name, up.avatar_seed, up.show_on_leaderboard;

-- Indexes for leaderboard_stats
-- Unique index on user_id is REQUIRED for CONCURRENT refresh
create unique index if not exists idx_leaderboard_user_id on leaderboard_stats(user_id);
create index if not exists idx_leaderboard_xp on leaderboard_stats(total_xp desc);
create index if not exists idx_leaderboard_score on leaderboard_stats(best_score desc);

-- Refresh function for leaderboard
create or replace function refresh_leaderboard()
returns void as $$
begin
  refresh materialized view concurrently leaderboard_stats;
end;
$$ language plpgsql;

-- Weekly leaderboard function
create or replace function get_weekly_leaderboard(week_offset int default 0)
returns table (
  rank bigint,
  user_id text,
  display_name text,
  avatar_seed text,
  weekly_xp bigint,
  games_played bigint,
  best_score decimal
)
language sql
as $$
  with weekly as (
    select 
      gs.user_id,
      coalesce(up.display_name, 'Player ' || substring(gs.user_id from 1 for 6)) as display_name,
      up.avatar_seed,
      sum(gs.total_xp) as weekly_xp,
      count(*) as games_played,
      max(gs.final_score) as best_score
    from game_sessions gs
    left join user_profiles up on gs.user_id = up.user_id
    where gs.completed_at >= date_trunc('week', now()) - (week_offset || ' weeks')::interval
      and gs.completed_at < date_trunc('week', now()) - ((week_offset - 1) || ' weeks')::interval
      and (up.show_on_leaderboard is null or up.show_on_leaderboard = true)
    group by gs.user_id, up.display_name, up.avatar_seed
  )
  select 
    row_number() over (order by weekly_xp desc) as rank,
    user_id,
    display_name,
    avatar_seed,
    weekly_xp,
    games_played,
    best_score
  from weekly
  order by weekly_xp desc
  limit 100;
$$;

-- All-time leaderboard function
create or replace function get_alltime_leaderboard(result_limit int default 50)
returns table (
  rank bigint,
  user_id text,
  display_name text,
  avatar_seed text,
  total_xp bigint,
  total_games bigint,
  best_score decimal,
  avg_score decimal,
  longest_streak int
)
language sql
as $$
  select 
    row_number() over (order by total_xp desc) as rank,
    user_id,
    display_name,
    avatar_seed,
    total_xp,
    total_games,
    best_score,
    avg_score,
    longest_streak
  from leaderboard_stats
  where show_on_leaderboard = true or show_on_leaderboard is null
  order by total_xp desc
  limit result_limit;
$$;

-- Teacher search function for student responses
create or replace function search_student_responses(
  query_embedding vector(768),
  topic_filter text default null,
  grade_filter decimal default null,
  match_count int default 20
)
returns table (
  id uuid,
  user_id text,
  question_topic text,
  question_text text,
  response_text text,
  grade decimal,
  feedback text,
  response_time_ms int,
  similarity float
)
language sql
as $$
  select 
    id, user_id, question_topic, question_text, response_text, grade, feedback, response_time_ms,
    1 - (embedding <=> query_embedding) as similarity
  from student_responses
  where embedding is not null
    and (topic_filter is null or question_topic = topic_filter)
    and (grade_filter is null or grade <= grade_filter)
  order by embedding <=> query_embedding
  limit match_count;
$$;

