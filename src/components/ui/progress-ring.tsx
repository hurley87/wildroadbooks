'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  current: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function ProgressRing({
  current,
  total,
  size = 120,
  strokeWidth = 8,
  className,
}: ProgressRingProps) {
  const [prevCurrent, setPrevCurrent] = useState(current);
  const [isPulsing, setIsPulsing] = useState(false);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = current / total;
  const offset = circumference - progress * circumference;

  // Pulse when progress advances
  useEffect(() => {
    if (current > prevCurrent) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 600);
      setPrevCurrent(current);
      return () => clearTimeout(timer);
    }
  }, [current, prevCurrent]);

  return (
    <motion.div
      className={cn('relative inline-flex items-center justify-center', className)}
      animate={{
        scale: isPulsing ? 1.1 : 1,
      }}
      transition={{
        type: 'spring',
        damping: 15,
        stiffness: 300,
      }}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-emerald-600"
          initial={false}
          animate={{
            strokeDashoffset: offset,
          }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
          }}
          style={{
            filter: isPulsing ? 'drop-shadow(0 0 12px hsl(160 70% 40% / 0.6))' : 'drop-shadow(0 0 4px hsl(160 70% 40% / 0.3))',
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <motion.span
          key={current}
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-bold text-slate-900 leading-none"
        >
          {current}
        </motion.span>
        <span className="text-xs text-slate-500 font-medium mt-1">
          / {total}
        </span>
      </div>
    </motion.div>
  );
}

