'use client';

import { cn } from '@/lib/utils';
import { type UIMessage } from 'ai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Button } from './button';

interface ChatMessageProps {
  message: UIMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  
  // Extract text content from message parts
  const textParts = message.parts.filter((part) => part.type === 'text');
  const textContent = textParts.map((part) => part.text).join('');
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div
      className={cn(
        'group flex w-full gap-4 py-4 px-6 animate-fade-in relative',
        isUser 
          ? 'bg-background' 
          : 'bg-muted/30'
      )}
    >
      {/* Paper texture overlay for AI messages */}
      {!isUser && (
        <div className="pointer-events-none absolute inset-0 paper-texture" />
      )}
      <div className="flex w-full max-w-3xl mx-auto gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {isUser ? (
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium bg-primary/10 text-primary border border-primary/20">
              You
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium bg-gradient-to-br from-primary/20 to-accent/20 text-primary border border-primary/30 relative overflow-hidden">
              <Sparkles className="h-5 w-5 text-primary" />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
            </div>
          )}
        </div>
        
        {/* Message content */}
        <div className="flex-1 min-w-0 relative">
          {!isUser && (
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={handleCopy}
                aria-label="Copy message"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-primary" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          )}
          
          <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-serif prose-p:text-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-strong:font-semibold prose-code:text-primary prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-md prose-pre:p-3 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {textContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

