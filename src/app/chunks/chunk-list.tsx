'use client';

import { useState, useMemo } from 'react';
import { Chunk } from '../../../content/types';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

interface ChunkListProps {
  chunks: Chunk[];
}

export default function ChunkList({ chunks }: ChunkListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapter, setSelectedChapter] = useState<string>('all');
  const [expandedChunks, setExpandedChunks] = useState<Set<string>>(new Set());

  // Get unique chapters
  const chapters = useMemo(() => {
    const chapterSet = new Set(chunks.map((chunk) => chunk.metadata.chapter));
    return Array.from(chapterSet).sort();
  }, [chunks]);

  // Filter chunks based on search and chapter filter
  const filteredChunks = useMemo(() => {
    return chunks.filter((chunk) => {
      // Chapter filter
      if (selectedChapter !== 'all' && chunk.metadata.chapter !== selectedChapter) {
        return false;
      }

      // Search filter
      if (!searchQuery.trim()) {
        return true;
      }

      const query = searchQuery.toLowerCase();
      return (
        chunk.content.toLowerCase().includes(query) ||
        chunk.metadata.chapter.toLowerCase().includes(query) ||
        chunk.metadata.key_concepts.some((concept) =>
          concept.toLowerCase().includes(query)
        )
      );
    });
  }, [chunks, searchQuery, selectedChapter]);

  const toggleExpand = (chunkId: string) => {
    setExpandedChunks((prev) => {
      const next = new Set(prev);
      if (next.has(chunkId)) {
        next.delete(chunkId);
      } else {
        next.add(chunkId);
      }
      return next;
    });
  };

  const previewLength = 300;

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search chunks by content, chapter, or key concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        <select
          value={selectedChapter}
          onChange={(e) => setSelectedChapter(e.target.value)}
          className="px-4 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="all">All Chapters</option>
          {chapters.map((chapter) => (
            <option key={chapter} value={chapter}>
              {chapter}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="text-sm text-muted-foreground">
        Showing <strong className="text-foreground">{filteredChunks.length}</strong> of{' '}
        <strong className="text-foreground">{chunks.length}</strong> chunks
      </div>

      {/* Chunk Cards */}
      <div className="space-y-4">
        {filteredChunks.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No chunks found matching your criteria.
          </div>
        ) : (
          filteredChunks.map((chunk) => {
            const isExpanded = expandedChunks.has(chunk.id);
            const contentPreview =
              chunk.content.length > previewLength && !isExpanded
                ? chunk.content.substring(0, previewLength) + '...'
                : chunk.content;

            return (
              <div
                key={chunk.id}
                className="border border-border rounded-lg p-6 bg-card hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded">
                        {chunk.metadata.chapter}
                      </span>
                      <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                        Pages {chunk.metadata.page_range}
                      </span>
                      <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                        {chunk.word_count} words
                      </span>
                      <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">
                        Chunk {chunk.metadata.chunk_index}/{chunk.metadata.total_chunks_in_chapter}
                      </span>
                    </div>
                    {chunk.metadata.key_concepts.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {chunk.metadata.key_concepts.map((concept) => (
                          <span
                            key={concept}
                            className="px-2 py-0.5 text-xs bg-accent/20 text-accent-foreground rounded"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => toggleExpand(chunk.id)}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        <span>Collapse</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        <span>Expand</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Content */}
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {contentPreview}
                  </p>
                </div>

                {/* Chunk ID (for debugging) */}
                <div className="mt-4 pt-4 border-t border-border">
                  <code className="text-xs text-muted-foreground">{chunk.id}</code>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

