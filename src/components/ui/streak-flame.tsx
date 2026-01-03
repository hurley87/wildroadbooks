'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Flame } from 'lucide-react';
import { playSound } from '@/lib/sound-manager';

interface StreakFlameProps {
  streak: number;
  className?: string;
}

export function StreakFlame({ streak, className }: StreakFlameProps) {
  const [prevStreak, setPrevStreak] = useState(streak);
  const [showMultiplier, setShowMultiplier] = useState(false);
  const [multiplierValue, setMultiplierValue] = useState<2 | 3 | null>(null);

  // Detect multiplier milestones
  useEffect(() => {
    if (streak === 3 && prevStreak < 3) {
      setMultiplierValue(2);
      setShowMultiplier(true);
      playSound('streak');
      setTimeout(() => setShowMultiplier(false), 2000);
    } else if (streak === 5 && prevStreak < 5) {
      setMultiplierValue(3);
      setShowMultiplier(true);
      playSound('streak');
      setTimeout(() => setShowMultiplier(false), 2000);
    }
    setPrevStreak(streak);
  }, [streak, prevStreak]);

  if (streak === 0) return null;

  // Determine flame intensity
  const intensity = streak >= 5 ? 'blazing' : streak >= 3 ? 'flickering' : 'subtle';
  
  const sizeConfig = {
    subtle: { icon: 16, container: 'w-8 h-8' },
    flickering: { icon: 20, container: 'w-10 h-10' },
    blazing: { icon: 24, container: 'w-12 h-12' },
  };

  const config = sizeConfig[intensity];

  // Fire particles for high streaks
  const particleCount = streak >= 5 ? 5 : streak >= 3 ? 3 : 0;

  return (
    <div className={cn('relative flex items-center gap-2', className)}>
      <motion.div
        className={cn(
          'relative flex items-center justify-center rounded-full',
          'bg-gradient-to-br from-amber-50 to-orange-50',
          'border-2 border-amber-300',
          config.container,
          intensity === 'blazing' && 'shadow-lg shadow-amber-500/30',
        )}
        animate={{
          scale: intensity === 'blazing' ? [1, 1.05, 1] : 1,
          rotate: intensity === 'blazing' ? [0, -2, 2, -1, 1, 0] : 0,
        }}
        transition={{
          duration: 2,
          repeat: intensity === 'blazing' ? Infinity : 0,
          repeatDelay: 0.5,
        }}
      >
        <Flame
          className={cn(
            'text-amber-600',
            intensity === 'blazing' && 'drop-shadow-[0_0_8px_hsl(38_92%_50%)]',
            intensity === 'flickering' && 'drop-shadow-[0_0_4px_hsl(38_92%_50%)]',
          )}
          size={config.icon}
        />
        {/* Glow effect */}
        <div
          className={cn(
            'absolute inset-0 rounded-full blur-sm',
            intensity === 'blazing' && 'bg-amber-400/40',
            intensity === 'flickering' && 'bg-amber-400/25',
            intensity === 'subtle' && 'bg-amber-400/15',
          )}
          style={{
            animation: intensity === 'blazing' ? 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' : undefined,
          }}
        />
        
        {/* Fire particle trail */}
        {particleCount > 0 && Array.from({ length: particleCount }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-orange-500"
            initial={{ opacity: 0, y: 0, scale: 1 }}
            animate={{
              opacity: [1, 0.5, 0],
              y: [0, -20, -40],
              scale: [1, 0.5, 0],
              x: [0, (Math.random() - 0.5) * 10],
            }}
            transition={{
              duration: 0.8,
              delay: i * 0.1,
              repeat: Infinity,
              repeatDelay: 1,
            }}
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </motion.div>
      
      <div className="flex flex-col relative">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">STREAK</span>
        <span className="text-lg font-bold text-amber-600 leading-none">
          {streak}
        </span>
        
        {/* Multiplier pop animation */}
        <AnimatePresence>
          {showMultiplier && multiplierValue && (
            <motion.div
              initial={{ scale: 3, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{
                type: 'spring',
                damping: 10,
                stiffness: 300,
              }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 pointer-events-none z-10"
            >
              <span className="text-4xl font-black text-amber-500 drop-shadow-lg">
                ×{multiplierValue}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Static multiplier display */}
        {streak >= 3 && streak < 5 && !showMultiplier && (
          <span className="text-sm font-bold text-amber-500">×2</span>
        )}
        {streak >= 5 && !showMultiplier && (
          <span className="text-sm font-bold text-amber-500">×3</span>
        )}
      </div>
    </div>
  );
}

