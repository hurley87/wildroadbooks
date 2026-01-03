'use client';

import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { motion } from 'motion/react';

interface RankPreviewProps {
  xp: number; // Total XP to preview rank for
  className?: string;
}

export function RankPreview({ xp, className }: RankPreviewProps) {
  const [rank, setRank] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRank() {
      try {
        const res = await fetch(`/api/leaderboard?previewScore=${xp}`);
        if (!res.ok) {
          throw new Error('Failed to fetch rank');
        }
        const data = await res.json();
        setRank(data.rank || null);
      } catch (error) {
        console.error('Failed to fetch rank preview:', error);
        setRank(null);
      } finally {
        setIsLoading(false);
      }
    }

    if (xp !== null && xp > 0) {
      fetchRank();
    }
  }, [xp]);

  if (isLoading || rank === null) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={`flex items-center gap-2 justify-center ${className}`}
    >
      <Trophy className="w-5 h-5 text-amber-500" />
      <p className="text-slate-600">
        This score would rank you{' '}
        <span className="font-bold text-slate-900">#{rank}</span> on the leaderboard!
      </p>
    </motion.div>
  );
}

