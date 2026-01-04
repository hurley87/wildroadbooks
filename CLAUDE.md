# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wild Road Books is a Next.js 14 application for "Catching Unicorns" by David and Bill Hurley. It provides an interactive learning platform with AI-powered features including RAG-based chat, adaptive quizzes, and a gamified learning experience with leaderboards.

## Development Commands

```bash
# Development
yarn dev                  # Start Next.js dev server on localhost:3000
yarn build                # Build for production
yarn start                # Run production build
yarn lint                 # Run ESLint

# Content Management
yarn extract              # Extract content from PDF (tsx content/extract.ts)
yarn convert              # Convert extracted content to markdown (tsx content/convert-to-markdown.ts)
yarn ingest               # Ingest content into Supabase with embeddings (tsx scripts/ingest.ts)
```

## Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router with React Server Components)
- **AI/ML**: Vercel AI SDK v6, Google Gemini 2.5 Flash, Cohere Rerank
- **Database**: Supabase (PostgreSQL + pgvector for embeddings)
- **Auth**: Privy (EVM/Base wallet authentication)
- **Styling**: Tailwind CSS, Radix UI, Framer Motion
- **Audio**: Howler.js for sound effects

### Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── chat/route.ts         # RAG-based Q&A with retrieval
│   │   ├── quiz/route.ts         # Socratic quiz interviewer
│   │   ├── game/route.ts         # Gamified quiz with tool calling
│   │   ├── teacher/route.ts      # Teacher interface with response search
│   │   └── leaderboard/route.ts  # Leaderboard data & rank preview
│   ├── game/                     # Gamified learning mode
│   ├── quiz/                     # Standard quiz mode
│   ├── chat/                     # RAG chat interface
│   ├── teacher/                  # Teacher dashboard
│   └── leaderboard/              # Leaderboard view
├── components/
│   ├── ui/                       # Reusable UI components
│   ├── navigation.tsx            # Main navigation
│   ├── auth-gate.tsx             # Auth wrapper for protected routes
│   └── privy-provider.tsx        # Privy auth provider
└── lib/
    ├── retrieval.ts              # Hybrid search (semantic + BM25 + rerank)
    ├── supabase.ts               # Supabase client & types
    ├── sound-manager.ts          # Sound effects management
    ├── use-speech-recognition.ts # Speech-to-text hook
    └── utils.ts                  # Utility functions

content/                          # Content processing scripts
├── extract.ts                    # PDF text extraction
├── convert-to-markdown.ts        # Convert to markdown format
└── chunks.json                   # Processed content chunks

scripts/
└── ingest.ts                     # Embed & upload chunks to Supabase
```

### Key Architecture Patterns

#### 1. RAG Pipeline (Chat & Teacher APIs)
The retrieval system uses a 3-stage pipeline:
1. **Hybrid Search**: Combines semantic search (pgvector cosine similarity) with full-text search (BM25) using Reciprocal Rank Fusion (RRF) in `src/lib/retrieval.ts:hybrid_search()`
2. **Reranking**: Uses Cohere's rerank-english-v3.0 to reorder top candidates
3. **Context Injection**: Retrieved chunks are injected into the system prompt

See `src/lib/retrieval.ts:retrieveContext()` for the full pipeline.

#### 2. Adaptive Quiz System
Two quiz modes with different prompting strategies:

**Standard Quiz** (`/api/quiz?style=classic`):
- Gentler, more encouraging interviewer
- 10-15 questions from Week 1 Notebook Questions
- Grading: 0/0.5/1 per question, normalized to /10

**Game Mode** (`/api/game`):
- Adaptive interviewer that challenges weak areas
- Uses AI tool calling to save responses with embeddings
- Tracks: XP, streaks, response time, session completion
- Calls `saveResponse` and `completeSession` tools

Both modes use the same question bank in `src/app/api/quiz/constants.ts:WEEK_1_QUESTIONS`.

#### 3. Database Schema (Supabase)

**Tables**:
- `chunks`: RAG content with vector(768) embeddings + full-text search
- `student_responses`: Individual question responses with embeddings
- `game_sessions`: Completed game sessions with scores
- `user_profiles`: User data (display name, avatar, leaderboard opt-in)
- `leaderboard_view`: Materialized view for leaderboard rankings

**Key Functions**:
- `hybrid_search()`: RRF-based semantic + full-text search
- `refresh_leaderboard()`: Update materialized view
- `preview_rank()`: Calculate user's rank with hypothetical score

Schema lives in `supabase-schema.sql`.

#### 4. Authentication Flow
- Uses Privy for EVM wallet authentication (Base network)
- `<AuthGate>` component wraps protected routes
- User ID from Privy token passed via `Authorization: Bearer <user_id>` header
- Session tracking via `x-session-id` header in game API

#### 5. AI SDK v6 Patterns
All API routes use Vercel AI SDK v6:
- Messages use `parts` pattern: `message.parts.filter(p => p.type === 'text')`
- Tool calling in game API for structured data capture
- Streaming responses with `streamText().toUIMessageStreamResponse()`

#### 6. Content Processing Pipeline
1. `yarn extract` → Extract text from PDF → `content/extracted.json`
2. `yarn convert` → Convert to markdown → `content/chunks.json`
3. `yarn ingest` → Generate embeddings → Upload to Supabase `chunks` table

### Environment Variables

Required in `.env.local`:
```bash
# Supabase
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# AI APIs
GOOGLE_GENERATIVE_AI_API_KEY=   # Gemini + text-embedding-004
COHERE_API_KEY=                 # Rerank API

# Auth
NEXT_PUBLIC_PRIVY_APP_ID=
```

### Important Implementation Notes

1. **Embedding Workaround**: Google's text-embedding-004 uses REST API directly (not AI SDK) due to v1 API compatibility issues. See `src/lib/retrieval.ts:embedQuery()` and `scripts/ingest.ts:generateSingleEmbedding()`.

2. **Message Extraction**: All code that reads message content must use the parts pattern:
   ```typescript
   const text = message.parts
     ?.filter(part => part.type === 'text')
     ?.map(part => part.text)
     ?.join(' ') ?? '';
   ```

3. **Quiz Grading Logic**: Game mode uses strict grading:
   - 1 point: accurate + specific + grounded in text
   - 0.5 points: partially correct or correct but vague
   - 0 points: incorrect or "I don't know"

4. **Webpack Config**: Next.js config ignores Solana dependencies from Privy SDK since only EVM wallets are used.

5. **Path Aliases**: Uses `@/*` for `./src/*` imports (defined in `tsconfig.json`).

6. **Leaderboard Refresh**: Game API calls `refresh_leaderboard()` non-blocking after session completion.

## Testing the System

1. **Test RAG Pipeline**:
   - Navigate to `/chat`
   - Ask questions about the book content
   - Check that responses cite relevant passages

2. **Test Quiz System**:
   - Standard: `/quiz`
   - Game mode: `/game` (requires auth)
   - Verify grading, XP, streaks work correctly

3. **Test Leaderboard**:
   - Complete a game session
   - Check `/leaderboard` for updated rankings
   - Verify rank preview shows during gameplay

4. **Test Content Ingestion**:
   - Update `content/chunks.json`
   - Run `yarn ingest`
   - Verify chunks appear in Supabase `chunks` table with embeddings
