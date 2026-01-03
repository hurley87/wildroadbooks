'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { useTypewriter } from 'react-simple-typewriter';
import { X } from 'lucide-react';

interface QuestionCardProps {
  question: string;
  streak?: number;
  className?: string;
}

export function QuestionCard({
  question,
  streak = 0,
  className,
}: QuestionCardProps) {
  const [showFullText, setShowFullText] = useState(false);
  
  // Reset showFullText when question changes to restart typewriter animation
  useEffect(() => {
    setShowFullText(false);
  }, [question]);
  
  const [displayedText] = useTypewriter({
    words: [question],
    loop: 1,
    typeSpeed: 30,
    deleteSpeed: 0,
    onLoopDone: () => setShowFullText(true),
  });

  // Calculate streak-based glow
  const getGlowStyle = (streak: number) => {
    if (streak >= 5) {
      return '0 0 40px rgba(251, 191, 36, 0.3), 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
    } else if (streak >= 3) {
      return '0 0 20px rgba(251, 191, 36, 0.2), 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
    }
    return '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
  };

  const textToShow = showFullText ? question : displayedText;
  const isTyping = !showFullText && displayedText.length < question.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        damping: 25,
        stiffness: 200,
        duration: 0.5,
      }}
      className={cn(
        'relative bg-white border-2 border-slate-200 rounded-2xl p-8 md:p-10 shadow-lg',
        'hover:shadow-xl transition-shadow duration-300',
        className
      )}
      style={{
        boxShadow: getGlowStyle(streak),
      }}
    >
      <div className="relative z-10">
        {/* Skip button - only show while typing */}
        {isTyping && (
          <button
            onClick={() => setShowFullText(true)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Skip typewriter animation"
          >
            <X className="w-4 h-4 text-slate-500" />
          </button>
        )}
        
        {/* Question text - high contrast, better line-height */}
        <p className="text-lg md:text-xl lg:text-2xl font-serif leading-relaxed text-slate-900 max-w-none">
          {textToShow}
          {isTyping && (
            <span className="inline-block w-0.5 h-6 bg-slate-900 ml-1 animate-pulse" />
          )}
        </p>
      </div>
    </motion.div>
  );
}

