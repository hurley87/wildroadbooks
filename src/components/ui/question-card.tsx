'use client';

import { cn } from '@/lib/utils';
import { motion } from 'motion/react';

interface QuestionCardProps {
  question: string;
  questionNumber: number;
  totalQuestions: number;
  className?: string;
}

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  className,
}: QuestionCardProps) {
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
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div className="relative z-10">
        {/* Question header - high contrast */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-600 uppercase tracking-wide">
            <span className="text-emerald-600">✦</span>
            <span>QUESTION {questionNumber} of {totalQuestions}</span>
            <span className="text-emerald-600">✦</span>
          </div>
        </div>
        {/* Question text - high contrast, better line-height */}
        <p className="text-lg md:text-xl lg:text-2xl font-serif leading-relaxed text-slate-900 max-w-none">
          {question}
        </p>
      </div>
    </motion.div>
  );
}

