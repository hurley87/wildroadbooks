'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { motion } from 'motion/react';
import { Trophy, Flame, Star, Medal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  display_name: string;
  avatar_seed: string | null;
  total_xp: number;
  total_games: number;
  best_score: number | null;
  avg_score?: number | null;
  longest_streak?: number | null;
  weekly_xp?: number;
  games_played?: number;
}

type Period = 'weekly' | 'alltime';

export function LeaderboardView() {
  const { user } = usePrivy();
  const [period, setPeriod] = useState<Period>('alltime');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/leaderboard?type=${period}`);
        if (!res.ok) {
          throw new Error('Failed to fetch leaderboard');
        }
        const data = await res.json();
        setEntries(data.leaderboard || []);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
        setEntries([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLeaderboard();
  }, [period]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="w-5 text-center text-slate-500 font-mono text-sm">{rank}</span>;
  };

  const getAvatarGradient = (seed: string | null) => {
    if (!seed) return 'linear-gradient(135deg, hsl(200, 70%, 60%), hsl(240, 70%, 50%))';
    // Generate consistent colors from seed
    const hash = seed.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
    const hue1 = Math.abs(hash % 360);
    const hue2 = (hue1 + 40) % 360;
    return `linear-gradient(135deg, hsl(${hue1}, 70%, 60%), hsl(${hue2}, 70%, 50%))`;
  };

  return (
    <div>
      {/* Period Toggle */}
      <div className="flex justify-center gap-2 mb-8">
        <Button
          variant={period === 'weekly' ? 'default' : 'outline'}
          onClick={() => setPeriod('weekly')}
          size="sm"
        >
          This Week
        </Button>
        <Button
          variant={period === 'alltime' ? 'default' : 'outline'}
          onClick={() => setPeriod('alltime')}
          size="sm"
        >
          All Time
        </Button>
      </div>

      {/* Leaderboard Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12 text-slate-500">
          No scores yet. Be the first to play!
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {entries.map((entry, idx) => {
            const isCurrentUser = user?.id === entry.user_id;
            return (
              <motion.div
                key={entry.user_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className={`flex items-center gap-4 px-4 py-3 border-b border-slate-100 last:border-0 ${
                  isCurrentUser ? 'bg-emerald-50' : ''
                }`}
              >
                {/* Rank */}
                <div className="w-8 flex justify-center">
                  {getRankIcon(entry.rank)}
                </div>

                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex-shrink-0"
                  style={{ background: getAvatarGradient(entry.avatar_seed || entry.user_id) }}
                />

                {/* Name & Stats */}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-900 truncate">
                    {entry.display_name}
                    {isCurrentUser && (
                      <span className="ml-2 text-xs text-emerald-600 font-normal">(You)</span>
                    )}
                  </div>
                  <div className="text-sm text-slate-500 flex items-center gap-3">
                    <span>{period === 'weekly' ? entry.games_played || 0 : entry.total_games} games</span>
                    {entry.longest_streak && entry.longest_streak > 0 && (
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-500" />
                        {entry.longest_streak}
                      </span>
                    )}
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="font-bold text-lg text-emerald-600">
                    {(period === 'weekly' ? entry.weekly_xp : entry.total_xp)?.toLocaleString()} XP
                  </div>
                  {entry.best_score !== null && (
                    <div className="text-sm text-slate-500 flex items-center justify-end gap-1">
                      <Star className="w-3 h-3" />
                      Best: {entry.best_score}/10
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}


