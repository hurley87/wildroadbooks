import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const querySchema = z.object({
  type: z.enum(['weekly', 'alltime']).default('alltime'),
  limit: z.coerce.number().min(1).max(100).default(50),
  previewScore: z.coerce.number().optional(), // XP value to preview rank for
});

export async function GET(req: NextRequest) {
  try {
    const params = querySchema.parse(
      Object.fromEntries(req.nextUrl.searchParams)
    );

    // Rank preview mode
    if (params.previewScore !== undefined) {
      // Get all-time leaderboard to find rank
      const { data, error } = await supabase.rpc('get_alltime_leaderboard', {
        result_limit: 1000, // Get enough to find rank
      });
      
      if (error) {
        console.error('Error fetching leaderboard for rank preview:', error);
        throw error;
      }
      
      // Find rank: count how many users have more XP (lower rank number = better)
      // Leaderboard is sorted descending by XP, so we find first entry with <= XP
      const rankIndex = (data || []).findIndex(
        (entry: any) => entry.total_xp <= params.previewScore!
      );
      
      // If found, rank is index + 1 (1-indexed)
      // If not found, they'd rank higher than everyone shown (rank 1)
      // If score is lower than all, they rank after everyone
      const finalRank = rankIndex >= 0 
        ? rankIndex + 1 
        : params.previewScore! > (data?.[0]?.total_xp || 0)
        ? 1
        : (data?.length || 0) + 1;
      
      return NextResponse.json({ rank: finalRank });
    }

    if (params.type === 'weekly') {
      const { data, error } = await supabase.rpc('get_weekly_leaderboard', {
        week_offset: 0,
      });
      
      if (error) {
        console.error('Error fetching weekly leaderboard:', error);
        throw error;
      }
      
      return NextResponse.json({ 
        leaderboard: data || [], 
        period: 'weekly' 
      });
    }

    // All-time leaderboard
    const { data, error } = await supabase.rpc('get_alltime_leaderboard', {
      result_limit: params.limit,
    });
    
    if (error) {
      console.error('Error fetching all-time leaderboard:', error);
      throw error;
    }
    
    return NextResponse.json({ 
      leaderboard: data || [], 
      period: 'alltime' 
    });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}

