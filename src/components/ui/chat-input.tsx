'use client';

import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  placeholder = 'Ask a question about Catching Unicorns...',
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const MIN_TEXTAREA_HEIGHT_PX = 56;
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto';
      const nextHeight = Math.max(textarea.scrollHeight, MIN_TEXTAREA_HEIGHT_PX);
      textarea.style.height = `${nextHeight}px`;
    }
  }, [input, MIN_TEXTAREA_HEIGHT_PX]);
  
  return (
    <form onSubmit={handleSubmit} className="border-t border-border bg-background/95 backdrop-blur-sm">
      <div 
        className="flex w-full items-center gap-3 p-4 sm:p-5"
        style={{
          background: 'linear-gradient(180deg, rgba(251, 250, 249, 1) 0%, rgba(251, 250, 249, 1) 50%, rgba(242, 240, 237, 0.3) 100%)'
        }}
      >
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={isLoading}
            rows={1}
            className={cn(
              "w-full min-h-[56px] max-h-[200px] resize-none rounded-md border border-input bg-background px-4 py-4 text-sm leading-5",
              "ring-offset-background placeholder:text-muted-foreground",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-all duration-300",
              "focus-visible:border-primary/50 focus-visible:shadow-lg focus-visible:shadow-primary/10",
              // Gilt-edge effect on focus
              "focus-visible:gilt-edge"
            )}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!isLoading && input.trim()) {
                  handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
                }
              }
            }}
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          size="icon"
          className="flex-shrink-0 h-14 w-14 transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
}

