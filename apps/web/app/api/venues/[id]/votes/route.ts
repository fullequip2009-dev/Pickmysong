// @ts-nocheck
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Returns, grouped by song, who voted at this venue (name + avatar)
// so the venue page can show the community behind each track.
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const venueId = params.id;

  if (!SUPABASE_URL) {
    return NextResponse.json({ voters: {} });
  }

  try {
    const { createServerSupabaseClient } = await import('../../../../../lib/supabase');
    const supabase = await createServerSupabaseClient();

    const { data: votes, error } = await supabase
      .from('votes')
      .select('songId, userId, createdAt, users:userId ( id, name, avatar )')
      .eq('venueId', venueId)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('[/api/venues/[id]/votes] error:', error);
      return NextResponse.json({ voters: {} });
    }

    // Group voters by songId -> [{ id, name, avatar }]
    const voters: Record<string, any[]> = {};
    for (const v of votes ?? []) {
      const u = v.users || {};
      if (!voters[v.songId]) voters[v.songId] = [];
      voters[v.songId].push({
        id: u.id ?? v.userId,
        name: u.name ?? 'Anónimo',
        avatar: u.avatar ?? null,
      });
    }

    return NextResponse.json({ voters });
  } catch (err: any) {
    console.error('[/api/venues/[id]/votes] error:', err);
    return NextResponse.json({ voters: {} });
  }
}
