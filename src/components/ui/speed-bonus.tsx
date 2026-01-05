'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SpeedBonusProps {
  responseTimeMs: number;
  className?: string;
}

export function SpeedBonus({ responseTimeMs, className }: SpeedBonusProps) {
  // Calculate speed bonus
  const getSpeedBonus = (timeMs: number): number => {
    if (timeMs < 5000) return 50;  // Lightning fast
    if (timeMs < 10000) return 25; // Quick
    if (timeMs < 15000) return 10; // Good
    return 0;
  };

  const bonus = getSpeedBonus(responseTimeMs);
  const show = bonus > 0;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: 50, opacity: 0, scale: 0.8 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: 50, opacity: 0, scale: 0.8 }}
          transition={{
            type: 'spring',
            damping: 15,
            stiffness: 200,
          }}
          className={cn('flex items-center gap-2', className)}
        >
          <motion.div
            animate={{
              rotate: [0, -10, 10, -10, 10, 0],
            }}
            transition={{
              duration: 0.5,
              repeat: 2,
            }}
          >
            <Zap className="w-5 h-5 text-cyan-500 fill-cyan-500" />
          </motion.div>
          <span className="text-cyan-500 font-bold text-lg">
            +{bonus} Speed Bonus!
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


