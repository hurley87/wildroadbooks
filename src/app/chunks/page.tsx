import { ChunkOutput } from '../../../content/types';
import ChunkList from './chunk-list';
import fs from 'fs';
import path from 'path';

async function getChunks(): Promise<ChunkOutput> {
  const chunksPath = path.join(process.cwd(), 'content', 'chunks.json');
  
  if (!fs.existsSync(chunksPath)) {
    throw new Error('chunks.json not found. Please run npm run extract first.');
  }
  
  const fileContents = fs.readFileSync(chunksPath, 'utf8');
  return JSON.parse(fileContents) as ChunkOutput;
}

export default async function ChunksPage() {
  const chunkData = await getChunks();

  return (
    <main className="flex min-h-screen flex-col">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-serif tracking-tight mb-2">
            RAG Chunks Viewer
          </h1>
          <p className="text-muted-foreground">
            Browse and search through extracted chunks from Catching Unicorns
          </p>
          <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
            <span>Total Chunks: <strong className="text-foreground">{chunkData.meta.total_chunks}</strong></span>
            <span>Total Chapters: <strong className="text-foreground">{chunkData.meta.total_chapters}</strong></span>
            <span>Extracted: <strong className="text-foreground">{new Date(chunkData.meta.extracted_at).toLocaleDateString()}</strong></span>
          </div>
        </div>
        
        <ChunkList chunks={chunkData.chunks} />
      </div>
    </main>
  );
}

