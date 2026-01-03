'use client';

import { Mic, Square } from 'lucide-react';
import { useRef, useEffect, useState, useMemo } from 'react';
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
  voiceOnly?: boolean;
  onVoiceSubmit?: (transcript: string) => void;
}

// Sound wave bars component with memoized random heights
function SoundWaveBars() {
  // Pre-calculate random heights for each bar to avoid re-evaluation on every render
  const barHeights = useMemo(() => {
    return Array.from({ length: 5 }, () => ({
      heights: [
        `${Math.random() * 20 + 10}px`,
        `${Math.random() * 30 + 20}px`,
        `${Math.random() * 20 + 10}px`,
      ],
    }));
  }, []);

  return (
    <div className="absolute -top-16 left-1/2 -translate-x-1/2 flex items-end gap-1 h-12">
      {barHeights.map((bar, i) => (
        <motion.div
          key={i}
          className="w-1 bg-cyan-500 rounded-full"
          animate={{
            height: bar.heights,
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: i * 0.1,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export function MicroInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  placeholder = 'Type your answer...',
  onSpeechResult,
  showHelper = true,
  voiceOnly = false,
  onVoiceSubmit,
}: MicroInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  const { isListening, isSupported, transcript, toggleListening, stopListening } = useSpeechRecognition({
    onResult: (transcript) => {
      onSpeechResult?.(transcript);
    },
    onStopComplete: (finalTranscript) => {
      // Submit the final transcript when speech recognition fully completes
      if (voiceOnly && onVoiceSubmit && finalTranscript) {
        onVoiceSubmit(finalTranscript);
      }
    },
  });

  // Handle stop button click - stop listening and trigger submit via onStopComplete callback
  const handleStopClick = () => {
    if (isListening) {
      // Stop listening and request submission when complete
      // The onStopComplete callback will fire after the final transcript is ready
      const shouldSubmit = voiceOnly && !!onVoiceSubmit;
      stopListening(shouldSubmit);
    } else {
      toggleListening();
    }
  };

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

  // Voice-only mode: centered large microphone button
  if (voiceOnly) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
        <div className="w-full flex items-center justify-center px-4 pb-8 sm:pb-12">
          <div className="relative">
            {/* Ripple effect rings */}
            {isListening && (
              <>
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-full border-2"
                    style={{
                      borderColor: isListening ? 'rgb(34, 211, 238)' : 'rgb(16, 185, 129)',
                    }}
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{
                      scale: [1, 1.5, 2],
                      opacity: [0.6, 0.3, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: 'easeOut',
                    }}
                  />
                ))}
              </>
            )}
            
            {/* Sound wave bars */}
            {isListening && (
              <SoundWaveBars />
            )}
            
            <motion.div
              animate={{
                scale: isListening ? [1, 1.05, 1] : 1,
              }}
              transition={{
                duration: 1.5,
                repeat: isListening ? Infinity : 0,
                ease: 'easeInOut',
              }}
            >
              <Button
                type="button"
                onClick={handleStopClick}
                disabled={isLoading}
                size="icon"
                variant={isListening ? 'destructive' : 'default'}
                className={cn(
                  "h-20 w-20 rounded-full transition-all duration-300 relative z-10",
                  "bg-white shadow-xl border-2",
                  "hover:scale-110 active:scale-95",
                  isListening 
                    ? "border-cyan-500 bg-cyan-50" 
                    : "border-emerald-500 hover:border-emerald-600",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
                aria-label={isListening ? 'Stop recording and submit' : 'Start voice input'}
              >
                {isListening ? (
                  <Square className="h-10 w-10 text-cyan-600 transition-colors" />
                ) : (
                  <Mic className="h-10 w-10 text-emerald-600 transition-colors" />
                )}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  // Regular mode: text input with optional mic button
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
              onClick={handleStopClick}
              disabled={isLoading}
              size="icon"
              variant={isListening ? 'destructive' : 'ghost'}
              className={cn(
                "absolute left-2 h-10 w-10 rounded-full transition-all duration-300 z-10",
                "hover:scale-110 bg-white/80 backdrop-blur-sm",
                "border border-slate-200",
                isListening && "animate-pulse bg-red-50 border-red-300"
              )}
              aria-label={isListening ? 'Stop recording' : 'Start voice input'}
            >
              {isListening ? (
                <Square className="h-4 w-4" />
              ) : (
                <Mic className="h-4 w-4" />
              )}
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

