import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const querySchema = z.object({
  type: z.enum(['weekly', 'alltime']).default('alltime'),
  limit: z.coerce.number().min(1).max(100).default(50),
});

export async function GET(req: NextRequest) {
  try {
    const params = querySchema.parse(
      Object.fromEntries(req.nextUrl.searchParams)
    );

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

