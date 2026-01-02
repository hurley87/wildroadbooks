'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface FeedbackBurstProps {
  grade: 0 | 0.5 | 1;
  feedback?: string;
  onComplete?: () => void;
}

export function FeedbackBurst({ grade, feedback, onComplete }: FeedbackBurstProps) {
  const [show, setShow] = useState(true);
  const [shouldShake, setShouldShake] = useState(false);

  useEffect(() => {
    // Shake on incorrect answer
    if (grade === 0) {
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 600);
    }
    
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(() => onComplete?.(), 500);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete, grade]);

  const config = {
    1: {
      icon: CheckCircle2,
      text: 'Perfect!',
      color: 'text-green-500',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-500/50',
      glowColor: 'shadow-[0_0_40px_hsl(160_70%_45%_/0.5)]',
    },
    0.5: {
      icon: AlertCircle,
      text: 'Almost!',
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/20',
      borderColor: 'border-amber-500/50',
      glowColor: 'shadow-[0_0_40px_hsl(38_90%_55%_/0.5)]',
    },
    0: {
      icon: XCircle,
      text: 'Try again',
      color: 'text-red-500',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/50',
      glowColor: 'shadow-[0_0_40px_hsl(0_70%_55%_/0.5)]',
    },
  };

  const configData = config[grade];
  const Icon = configData.icon;

  // Particle positions for burst effect
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i * 360) / 12,
    distance: grade === 1 ? 80 : grade === 0.5 ? 60 : 40,
  }));

  return (
    <AnimatePresence>
      {show && (
        <div className="relative">
          {/* Screen flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: grade === 1 ? 0.1 : grade === 0.5 ? 0.05 : 0.08 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'fixed inset-0 pointer-events-none z-40',
              grade === 1 && 'bg-green-500',
              grade === 0.5 && 'bg-amber-500',
              grade === 0 && 'bg-red-500'
            )}
          />

          {/* Particle burst - positioned relative to card */}
          {particles.map((particle) => {
            const radian = (particle.angle * Math.PI) / 180;
            const x = Math.cos(radian) * particle.distance;
            const y = Math.sin(radian) * particle.distance;

            return (
              <motion.div
                key={particle.id}
                initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                animate={{
                  opacity: 0,
                  scale: 0,
                  x,
                  y,
                }}
                transition={{
                  duration: 0.8,
                  ease: 'easeOut',
                }}
                className={cn(
                  'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full z-40',
                  grade === 1 && 'bg-green-500',
                  grade === 0.5 && 'bg-amber-500',
                  grade === 0 && 'bg-red-500'
                )}
                style={{
                  filter: 'blur(2px)',
                }}
              />
            );
          })}

          {/* Main feedback card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              x: shouldShake ? [0, -10, 10, -10, 10, 0] : 0,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              type: 'spring',
              damping: 15,
              stiffness: 200,
              x: shouldShake ? { duration: 0.6 } : undefined,
            }}
            className={cn(
              'relative z-50',
              'bg-white border-2 rounded-2xl p-8 shadow-xl',
              configData.borderColor,
              configData.glowColor
            )}
          >
            <div className="flex flex-col items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
              >
                <Icon className={cn('w-16 h-16', configData.color)} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <h3 className={cn('text-2xl font-bold mb-2', configData.color)}>
                  {configData.text}
                </h3>
                {feedback && (
                  <p className="text-sm text-slate-600 max-w-md">
                    {feedback}
                  </p>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

