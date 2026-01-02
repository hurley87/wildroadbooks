'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface ScoreOrbProps {
  xp: number;
  level: number;
  onXpGain?: (amount: number) => void;
  className?: string;
}

export function ScoreOrb({ xp, level, onXpGain, className }: ScoreOrbProps) {
  const [floatingXp, setFloatingXp] = useState<Array<{ id: number; amount: number }>>([]);
  const [lastXp, setLastXp] = useState(xp);

  const [isPopping, setIsPopping] = useState(false);

  useEffect(() => {
    if (xp > lastXp) {
      const gain = xp - lastXp;
      const newFloating = { id: Date.now(), amount: gain };
      setFloatingXp((prev) => [...prev, newFloating]);
      onXpGain?.(gain);
      
      // Pop animation
      setIsPopping(true);
      setTimeout(() => setIsPopping(false), 400);
      
      // Remove after animation
      setTimeout(() => {
        setFloatingXp((prev) => prev.filter((item) => item.id !== newFloating.id));
      }, 2000);
    }
    setLastXp(xp);
  }, [xp, lastXp, onXpGain]);

  // Calculate level from XP (500 per level)
  const xpInCurrentLevel = xp % 500;
  const progress = xpInCurrentLevel / 500;

  return (
    <div className={cn('relative', className)}>
      {/* XP Orb */}
      <motion.div
        animate={{
          scale: isPopping ? 1.15 : 1,
        }}
        transition={{
          type: 'spring',
          damping: 12,
          stiffness: 400,
        }}
        className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 border-2 border-emerald-300 flex items-center justify-center shadow-lg"
      >
        {/* Pulsing glow */}
        <motion.div
          animate={{
            opacity: isPopping ? 0.4 : 0.2,
            scale: isPopping ? 1.2 : 1,
          }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 rounded-full bg-emerald-400/20"
        />
        
        {/* Progress ring */}
        <svg className="absolute inset-0 w-24 h-24 transform -rotate-90">
          <circle
            cx="48"
            cy="48"
            r="44"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-slate-200"
          />
          <motion.circle
            cx="48"
            cy="48"
            r="44"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="276 276"
            className="text-emerald-600"
            initial={false}
            animate={{
              strokeDashoffset: 276 - progress * 276,
            }}
            transition={{
              duration: 0.6,
              ease: 'easeOut',
            }}
            style={{
              filter: isPopping ? 'drop-shadow(0 0 8px hsl(160 70% 40% / 0.6))' : 'drop-shadow(0 0 4px hsl(160 70% 40% / 0.3))',
            }}
          />
        </svg>

        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-xs text-slate-600 font-medium">Level</span>
          <motion.span
            key={level}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-2xl font-bold text-slate-900 leading-none"
          >
            {level}
          </motion.span>
        </div>
      </motion.div>

      {/* XP Counter */}
      <div className="mt-2 text-center">
        <div className="text-sm font-medium text-slate-600">XP</div>
        <motion.div
          key={xp}
          initial={{ scale: 1.2, opacity: 0.7 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-lg font-bold text-slate-900"
        >
          {xp}
        </motion.div>
      </div>

      {/* Floating XP text */}
      <AnimatePresence>
        {floatingXp.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -60, scale: 1 }}
            exit={{ opacity: 0, y: -80 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-20"
          >
            <span className="text-xl font-bold text-emerald-600 drop-shadow-lg">
              +{item.amount} XP
            </span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

