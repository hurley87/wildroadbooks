# RAG Chunking Pipeline for Catching Unicorns

This directory contains the Semantic Hierarchical Chunking pipeline for extracting and processing the "Catching Unicorns" PDF into chunks optimized for RAG (Retrieval-Augmented Generation).

## Setup

1. Install dependencies:
```bash
npm install
```

2. Ensure the PDF is located at `public/catching-unicorns.pdf`

## Usage

Run the extraction pipeline:

```bash
npm run extract
```

This will:
1. Extract text from the PDF with page boundaries
2. Segment into chapters (Level 1)
3. Create semantic chunks within chapters (Level 2)
4. Extract key concepts from each chunk (Level 3)
5. Generate enriched chunks with metadata
6. Output to `content/chunks.json`

## Output Format

The `chunks.json` file contains:
- `meta`: Extraction metadata (source, timestamp, counts)
- `system_prompt_context`: Core definitions to inject into LLM prompts
- `chunks`: Array of chunk objects with:
  - `id`: Unique identifier
  - `content`: The actual text (300-600 words target)
  - `metadata`: Chapter, key concepts, page range, etc.
  - `word_count`: Word count for the chunk

## Chunking Strategy

- **Level 1**: Chapter segmentation using TOC patterns
- **Level 2**: Semantic splitting at logical boundaries (headers, paragraph breaks, transitions)
- **Level 3**: Key concept extraction via glossary matching

Chunks are optimized to:
- Keep logical concepts together
- Target 300-600 words per chunk
- Maintain minimum 150 words (merged if smaller)
- Cap at 800 words maximum (force split if larger)

## Supabase Integration

The output JSON is ready for insertion into a Supabase table. See the plan document for the recommended schema.





