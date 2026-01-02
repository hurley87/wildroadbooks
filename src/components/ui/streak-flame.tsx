'use client';

import { cn } from '@/lib/utils';
import { Flame } from 'lucide-react';

interface StreakFlameProps {
  streak: number;
  className?: string;
}

export function StreakFlame({ streak, className }: StreakFlameProps) {
  if (streak === 0) return null;

  // Determine flame intensity
  const intensity = streak >= 5 ? 'blazing' : streak >= 3 ? 'flickering' : 'subtle';
  
  const sizeConfig = {
    subtle: { icon: 16, container: 'w-8 h-8' },
    flickering: { icon: 20, container: 'w-10 h-10' },
    blazing: { icon: 24, container: 'w-12 h-12' },
  };

  const config = sizeConfig[intensity];

  return (
    <div className={cn('relative flex items-center gap-2', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center rounded-full',
          'bg-gradient-to-br from-amber-50 to-orange-50',
          'border-2 border-amber-300',
          config.container,
          intensity === 'blazing' && 'animate-pulse shadow-lg shadow-amber-500/30',
        )}
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
            intensity === 'blazing' && 'bg-amber-400/40 animate-pulse',
            intensity === 'flickering' && 'bg-amber-400/25',
            intensity === 'subtle' && 'bg-amber-400/15',
          )}
        />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">STREAK</span>
        <span className="text-lg font-bold text-amber-600 leading-none">
          {streak}
          {streak >= 3 && streak < 5 && ' ×2'}
          {streak >= 5 && ' ×3'}
        </span>
      </div>
    </div>
  );
}

