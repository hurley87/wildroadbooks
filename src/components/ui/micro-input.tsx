'use client';

import { Mic } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useSpeechRecognition } from '@/lib/use-speech-recognition';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

interface MicroInputProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  placeholder?: string;
  onSpeechResult?: (transcript: string) => void;
  showHelper?: boolean;
}

export function MicroInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  placeholder = 'Type your answer...',
  onSpeechResult,
  showHelper = true,
}: MicroInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const { isListening, isSupported, toggleListening } = useSpeechRecognition({
    onResult: (transcript) => {
      onSpeechResult?.(transcript);
    },
  });

  const isEmpty = !input.trim();
  const showMicButton = isEmpty && isSupported;

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Pulse animation when ready to type
  useEffect(() => {
    if (!hasInteracted && !isLoading && isEmpty) {
      const timer = setTimeout(() => setHasInteracted(true), 500);
      return () => clearTimeout(timer);
    }
  }, [hasInteracted, isLoading, isEmpty]);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto px-4 pb-4 sm:pb-6">
        {/* Helper text */}
        {showHelper && isEmpty && !isFocused && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-slate-500 text-center mb-2"
          >
            Press Enter to submit
          </motion.p>
        )}
        
        <div className="relative flex items-center gap-2">
          {showMicButton && (
            <Button
              type="button"
              onClick={toggleListening}
              disabled={isLoading}
              size="icon"
              variant={isListening ? 'destructive' : 'ghost'}
              className={cn(
                "absolute left-2 h-10 w-10 rounded-full transition-all duration-300 z-10",
                "hover:scale-110 bg-white/80 backdrop-blur-sm",
                "border border-slate-200",
                isListening && "animate-pulse bg-red-50 border-red-300"
              )}
              aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            >
              <Mic className="h-4 w-4" />
            </Button>
          )}
          <motion.input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={isListening ? 'Listening...' : placeholder}
            disabled={isLoading}
            animate={{
              scale: isFocused ? 1.02 : 1,
            }}
            transition={{ duration: 0.2 }}
            className={cn(
              "w-full h-14 rounded-full bg-white border-2 px-6 text-center text-base sm:text-lg",
              "shadow-lg transition-all duration-300",
              "focus:border-emerald-500 focus:shadow-xl focus:shadow-emerald-500/20",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 focus-visible:ring-offset-2",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:scale-100",
              "placeholder:text-slate-400",
              "text-slate-900",
              isListening && "border-red-400 ring-2 ring-red-400/20",
              showMicButton && "pl-12",
              !isFocused && !isEmpty && hasInteracted && "border-slate-300",
              isEmpty && !isFocused && hasInteracted && "animate-pulse-slow border-emerald-300"
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
      </form>
    </div>
  );
}

