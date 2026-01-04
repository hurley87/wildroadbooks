'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, AlertCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '@/lib/sound-manager';
import { triggerHaptic } from '@/lib/haptic-utils';
import { Button } from './button';

interface FeedbackBurstProps {
  grade: 0 | 0.5 | 1;
  feedback?: string;
  onComplete?: () => void;
}

export function FeedbackBurst({ grade, feedback, onComplete }: FeedbackBurstProps) {
  const [show, setShow] = useState(true);
  const [shouldShake, setShouldShake] = useState(false);
  const [victoryShake, setVictoryShake] = useState(false);

  useEffect(() => {
    // Play sound and trigger haptic feedback
    if (grade === 1) {
      playSound('correct');
      triggerHaptic('medium');
      // Confetti explosion
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#6ee7b7'],
      });
      // Victory shake animation
      setVictoryShake(true);
      setTimeout(() => setVictoryShake(false), 600);
    } else if (grade === 0.5) {
      playSound('partial');
      triggerHaptic('light');
    } else {
      playSound('wrong');
      triggerHaptic('medium');
      setShouldShake(true);
      setTimeout(() => setShouldShake(false), 600);
    }
  }, [grade]);

  const handleContinue = () => {
    setShow(false);
    setTimeout(() => onComplete?.(), 300);
  };

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
              x: shouldShake
                ? [0, -10, 10, -10, 10, 0]
                : victoryShake
                ? [0, -4, 4, -2, 2, 0]
                : 0,
              rotate: victoryShake ? [0, -2, 2, -1, 1, 0] : 0,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              type: 'spring',
              damping: 15,
              stiffness: 200,
              x: shouldShake || victoryShake ? { duration: 0.6 } : undefined,
              rotate: victoryShake ? { duration: 0.6 } : undefined,
            }}
            className={cn(
              'relative z-50 w-full max-w-2xl mx-4',
              'bg-white border-2 rounded-2xl p-8 shadow-xl',
              configData.borderColor,
              configData.glowColor
            )}
          >
            <div className="flex flex-col items-center gap-6">
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
                className="text-center w-full"
              >
                <h3 className={cn('text-2xl font-bold mb-4', configData.color)}>
                  {configData.text}
                </h3>
                {feedback && (
                  <div 
                    className="max-h-[50vh] overflow-y-auto px-2"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#cbd5e1 #f1f5f9'
                    }}
                  >
                    <p className="text-base text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {feedback}
                    </p>
                  </div>
                )}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="w-full"
              >
                <Button
                  onClick={handleContinue}
                  size="lg"
                  className="w-full text-base"
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

