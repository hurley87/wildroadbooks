import fs from 'fs';
import path from 'path';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import {
  Chunk,
  ChunkMetadata,
  ChunkOutput,
} from './types';
import { extractKeyConcepts } from './glossary';
import { CORE_DEFINITIONS } from './system-prompt';

// Constants for chunking strategy
const TARGET_CHUNK_CHARS = 2000; // ~400 words - tighter chunks for better retrieval precision
const CHUNK_OVERLAP = 300; // ~60 words - better context preservation for dense arguments
const MIN_CHUNK_CHARS = 200; // ~40 words - filter out tiny remnants

/**
 * Chapter definition with line numbers
 */
interface ChapterDef {
  title: string;
  displayTitle: string;
  startLine: number;
  endLine?: number;
}

/**
 * Parse markdown headings to detect chapters
 * Matches: # Preface, # Introduction, ## Chapter N: Title
 */
const parseMarkdownChapters = (content: string): Omit<ChapterDef, 'endLine'>[] => {
  const chapters: Omit<ChapterDef, 'endLine'>[] = [];
  const lines = content.split('\n');
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Match: # Preface, # Introduction
    if (/^#\s+(Preface|Introduction)$/.test(line)) {
      const title = line.replace(/^#+\s+/, '');
      chapters.push({
        title,
        displayTitle: title,
        startLine: i + 1, // 1-indexed
      });
    }
    // Match: ## Chapter N: Title
    else if (/^##\s+Chapter\s+\d+:/.test(line)) {
      const title = line.replace(/^##\s+/, '');
      // Extract chapter number for display title
      const match = line.match(/^##\s+Chapter\s+(\d+):\s*(.+)$/);
      const displayTitle = match ? `${match[1]} ${match[2]}` : title;
      chapters.push({
        title,
        displayTitle,
        startLine: i + 1, // 1-indexed
      });
    }
  }
  
  return chapters;
};

/**
 * Clean paragraph text - removes excessive whitespace while preserving readability
 * Also removes footnote references and definitions
 */
const cleanParagraph = (text: string): string => {
  // Remove footnote references like [^1], [^ch1-1], etc.
  let cleaned = text.replace(/\[\^[^\]]+\]/g, '');
  
  // Remove footnote definitions at end of text (lines starting with [^...]:)
  cleaned = cleaned.replace(/^\s*\[\^[^\]]+\]:\s*.+$/gm, '');
  
  // Fix hyphenation from line breaks (e.g., "mathe- matics" -> "mathematics")
  cleaned = cleaned.replace(/(\w+)-\s+(\w+)/g, '$1$2');
  
  // Normalize whitespace: collapse multiple spaces and newlines
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  // Fix spacing around punctuation
  cleaned = cleaned.replace(/\s+([.,;:!?])/g, '$1');
  cleaned = cleaned.replace(/([.!?])([A-Z])/g, '$1 $2');
  
  return cleaned.trim();
};

/**
 * Count words in text
 */
const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter((word) => word.length > 0).length;
};


/**
 * Calculate end lines for chapters based on next chapter starts
 */
const calculateChapterEndLines = (
  chapters: Omit<ChapterDef, 'endLine'>[],
  totalLines: number,
  bibliographyLine: number
): ChapterDef[] => {
  return chapters.map((chapter, index) => {
    const nextChapter = chapters[index + 1];
    // End at next chapter or at bibliography (whichever comes first)
    const endLine = nextChapter 
      ? Math.min(nextChapter.startLine - 1, bibliographyLine - 1)
      : bibliographyLine - 1;
    
    return {
      ...chapter,
      endLine,
    };
  });
};

/**
 * Find bibliography line number in markdown
 * Look for Bibliography heading or end of document
 */
const findBibliographyLine = (lines: string[]): number => {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Match # Bibliography or ## Bibliography
    if (/^#+\s+Bibliography/.test(line)) {
      return i + 1; // Convert to 1-indexed
    }
  }
  return lines.length;
};

/**
 * Extract chapter content from markdown lines
 * Markdown is already clean, so we just extract between headings
 */
const extractChapterContent = (
  lines: string[],
  startLine: number,
  endLine: number
): string => {
  // Lines are 1-indexed, array is 0-indexed
  // startLine is the heading line, so we start from the next line (startLine)
  // endLine is exclusive (line before next chapter), so we slice to endLine - 1
  const chapterLines = lines.slice(startLine, endLine - 1);
  
  // Join lines - markdown is already clean
  const rawContent = chapterLines.join('\n');
  
  // Remove figure captions (lines starting with "Figure X.Y:")
  let cleaned = rawContent.replace(/^Figure\s+\d+\.\d+:.*$/gm, '');
  
  // Remove footnote definitions at end of chapter (lines starting with [^...]:)
  cleaned = cleaned.replace(/^\s*\[\^[^\]]+\]:\s*.+$/gm, '');
  
  // Remove excessive blank lines but keep paragraph breaks
  cleaned = cleaned.replace(/\n{4,}/g, '\n\n');
  
  return cleaned.trim();
};

/**
 * Estimate page number based on line position in markdown
 * Using approximation: ~50 lines per page (markdown is more compact)
 */
const estimatePageFromLine = (lineNumber: number): number => {
  const LINES_PER_PAGE = 50;
  
  // Rough estimate: each line in markdown roughly corresponds to a page
  // Front matter (title, preface, introduction) is roughly pages 1-10
  if (lineNumber < 100) {
    return Math.max(1, Math.ceil(lineNumber / LINES_PER_PAGE));
  }
  
  // Main content starts around line 100 (page 3-4)
  return Math.ceil(3 + (lineNumber - 100) / LINES_PER_PAGE);
};

/**
 * Level 2: Semantic chunking within a chapter using LangChain
 */
const semanticChunk = async (
  content: string
): Promise<string[]> => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: TARGET_CHUNK_CHARS,
    chunkOverlap: CHUNK_OVERLAP,
    separators: [
      '\n\n\n',    // Triple newlines (major section breaks)
      '\n\n',      // Double newlines (paragraph breaks)
      '\n',        // Single newlines
      '. ',        // Sentence endings
      '! ', '? ',  // Other sentence endings
      '; ', ': ',  // Clause boundaries
      ', ',        // Phrases
      ' ',         // Words
      ''           // Characters (last resort)
    ],
  });
  
  const splits = await splitter.splitText(content);
  
  // Clean each split and filter out tiny chunks
  return splits.map(split => cleanParagraph(split)).filter(s => s.length > MIN_CHUNK_CHARS);
};

/**
 * Generate unique chunk ID
 */
const generateChunkId = (
  chapterIndex: number,
  chunkIndex: number
): string => {
  return `catching-unicorns-ch${chapterIndex + 1}-chunk-${String(
    chunkIndex + 1
  ).padStart(3, '0')}`;
};

/**
 * Enrich chunk with metadata
 */
  const enrichChunk = (
  content: string,
  chapter: ChapterDef,
  chapterIndex: number,
  chunkIndex: number,
  totalChunksInChapter: number
): Chunk => {
  // Estimate page range from chapter lines
  const startPage = estimatePageFromLine(chapter.startLine);
  const endPage = estimatePageFromLine(chapter.endLine || chapter.startLine);
  const pageRange = startPage === endPage ? `${startPage}` : `${startPage}-${endPage}`;

  const keyConcepts = extractKeyConcepts(content);

  const metadata: ChunkMetadata = {
    source: 'Catching Unicorns',
    chapter: chapter.displayTitle,
    key_concepts: keyConcepts,
    page_range: pageRange,
    chunk_index: chunkIndex + 1,
    total_chunks_in_chapter: totalChunksInChapter,
  };

  return {
    id: generateChunkId(chapterIndex, chunkIndex),
    content,
    metadata,
    word_count: countWords(content),
  };
};

/**
 * Main extraction pipeline
 */
const extractChunks = async (markdownFilePath: string): Promise<ChunkOutput> => {
  console.log('Reading markdown file...');
  const content = fs.readFileSync(markdownFilePath, 'utf-8');
  const lines = content.split('\n');
  console.log(`  Total lines: ${lines.length}`);

  console.log('Parsing markdown chapters...');
  const chapterDefs = parseMarkdownChapters(content);
  console.log(`  Found ${chapterDefs.length} chapters`);

  console.log('Finding bibliography line...');
  const bibliographyLine = findBibliographyLine(lines);
  console.log(`  Bibliography at line: ${bibliographyLine}`);

  console.log('Calculating chapter boundaries...');
  const chapters = calculateChapterEndLines(chapterDefs, lines.length, bibliographyLine);
  console.log(`  Processed ${chapters.length} chapters`);

  console.log('Chunking chapters semantically...');
  const allChunks: Chunk[] = [];

  for (let chapterIndex = 0; chapterIndex < chapters.length; chapterIndex++) {
    const chapter = chapters[chapterIndex];
    console.log(
      `  Processing: ${chapter.displayTitle} (lines ${chapter.startLine}-${chapter.endLine})`
    );

    const content = extractChapterContent(lines, chapter.startLine, chapter.endLine!);
    console.log(`    Content length: ${content.length} chars`);

    const chunks = await semanticChunk(content);
    console.log(`    Created ${chunks.length} chunks`);

    for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
      const enrichedChunk = enrichChunk(
        chunks[chunkIndex],
        chapter,
        chapterIndex,
        chunkIndex,
        chunks.length
      );
      allChunks.push(enrichedChunk);
    }
  }

  const output: ChunkOutput = {
    meta: {
      source: 'Catching Unicorns',
      extracted_at: new Date().toISOString(),
      total_chunks: allChunks.length,
      total_chapters: chapters.length,
    },
    system_prompt_context: CORE_DEFINITIONS,
    chunks: allChunks,
  };

  return output;
};

/**
 * Main execution
 */
const run = async () => {
  // Use the markdown file
  const markdownPath = path.resolve(
    __dirname || process.cwd(),
    'catching-unicorns.md'
  );

  if (!fs.existsSync(markdownPath)) {
    console.error(`Markdown file not found at: ${markdownPath}`);
    console.error('Make sure catching-unicorns.md exists in the content directory');
    process.exit(1);
  }

  try {
    console.log('Starting extraction pipeline...');
    const output = await extractChunks(markdownPath);

    const outputPath = path.resolve(
      __dirname || process.cwd(),
      'chunks.json'
    );
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

    console.log(`\n✅ Extraction complete!`);
    console.log(`   Total chapters: ${output.meta.total_chapters}`);
    console.log(`   Total chunks: ${output.meta.total_chunks}`);
    console.log(`   Output saved to: ${outputPath}`);

    // Print summary statistics
    const avgWords =
      output.chunks.reduce((sum, chunk) => sum + chunk.word_count, 0) /
      output.chunks.length;
    const minWords = Math.min(...output.chunks.map((c) => c.word_count));
    const maxWords = Math.max(...output.chunks.map((c) => c.word_count));

    console.log(`\n📊 Chunk Statistics:`);
    console.log(`   Average words: ${avgWords.toFixed(0)}`);
    console.log(`   Min words: ${minWords}`);
    console.log(`   Max words: ${maxWords}`);
    
    // Show first chunk of each chapter
    console.log(`\n📖 Chapter Previews:`);
    const seenChapters = new Set<string>();
    for (const chunk of output.chunks) {
      if (!seenChapters.has(chunk.metadata.chapter) && chunk.metadata.chunk_index === 1) {
        seenChapters.add(chunk.metadata.chapter);
        console.log(`\n   ${chunk.metadata.chapter}:`);
        console.log(`   "${chunk.content.substring(0, 100)}..."`);
      }
    }
  } catch (error) {
    console.error('Error during extraction:', error);
    process.exit(1);
  }
};

// Run if executed directly
if (require.main === module) {
run();
}

export { extractChunks, run };
