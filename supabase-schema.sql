-- Enable pgvector extension
create extension if not exists vector;

-- Create chunks table
create table chunks (
  id text primary key,
  content text not null,
  metadata jsonb not null default '{}',
  embedding vector(768),
  created_at timestamptz default now()
);

-- Create HNSW index for fast similarity search
create index on chunks using hnsw (embedding vector_cosine_ops);

-- Create GIN index for full-text search (BM25-style)
alter table chunks add column fts tsvector 
  generated always as (to_tsvector('english', content)) stored;
create index on chunks using gin (fts);

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




