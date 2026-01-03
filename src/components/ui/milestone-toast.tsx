'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Target, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '@/lib/sound-manager';

interface MilestoneToastProps {
  progress: number; // 0-1
  onComplete?: () => void;
}

const MILESTONES = [
  { threshold: 0.25, message: 'Getting started!', icon: Target, color: 'text-blue-500' },
  { threshold: 0.5, message: 'Halfway there!', icon: Trophy, color: 'text-amber-500' },
  { threshold: 0.75, message: 'Almost done!', icon: CheckCircle, color: 'text-emerald-500' },
];

export function MilestoneToast({ progress, onComplete }: MilestoneToastProps) {
  const [triggeredMilestones, setTriggeredMilestones] = useState<Set<number>>(new Set());
  const [currentMilestone, setCurrentMilestone] = useState<typeof MILESTONES[0] | null>(null);

  useEffect(() => {
    // Check if we've hit a new milestone
    for (const milestone of MILESTONES) {
      if (
        progress >= milestone.threshold &&
        !triggeredMilestones.has(milestone.threshold)
      ) {
        setTriggeredMilestones((prev) => new Set(prev).add(milestone.threshold));
        setCurrentMilestone(milestone);
        playSound('milestone');
        
        // Smaller confetti burst than perfect answer
        confetti({
          particleCount: 50,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#3b82f6', '#f59e0b', '#10b981'],
        });

        // Hide after 3 seconds
        setTimeout(() => {
          setCurrentMilestone(null);
          onComplete?.();
        }, 3000);
        break;
      }
    }
  }, [progress, triggeredMilestones, onComplete]);

  const Icon = currentMilestone?.icon;

  return (
    <AnimatePresence>
      {currentMilestone && Icon && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{
            type: 'spring',
            damping: 20,
            stiffness: 300,
          }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className={`
              bg-white rounded-2xl shadow-2xl border-2 border-slate-200
              px-6 py-4 flex items-center gap-3
            `}
          >
            <motion.div
              animate={{
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 0.5,
              }}
            >
              <Icon className={`w-6 h-6 ${currentMilestone.color}`} />
            </motion.div>
            <div>
              <p className="font-bold text-slate-900 text-lg">
                {currentMilestone.message}
              </p>
              <p className="text-sm text-slate-500">
                {Math.round(progress * 100)}% complete
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

