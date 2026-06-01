// @ts-nocheck
import { NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Returns, grouped by song, who voted at this venue (name + avatar)
// so the venue page can show the community behind each track.
// Reads from the public_profiles view (id, name, avatar only) so it never
// exposes sensitive user data even without an authenticated session.
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const venueId = params.id;

  if (!SUPABASE_URL) {
    return NextResponse.json({ voters: {} });
  }

  try {
    const { createServerSupabaseClient } = await import('../../../../../lib/supabase');
    const supabase = await createServerSupabaseClient();

    // 1) Read all votes for this venue
    const { data: votes, error: votesError } = await supabase
      .from('votes')
      .select('songId, userId, createdAt')
      .eq('venueId', venueId)
      .order('createdAt', { ascending: false });

    if (votesError) {
      console.error('[/api/venues/[id]/votes] votes error:', votesError);
      return NextResponse.json({ voters: {} });
    }

    if (!votes || votes.length === 0) {
      return NextResponse.json({ voters: {} });
    }

    // 2) Resolve the distinct users via the public_profiles view (safe fields only)
    const userIds = [...new Set(votes.map((v) => v.userId))];
    const { data: profiles } = await supabase
      .from('public_profiles')
      .select('id, name, avatar')
      .in('id', userIds);

    const userById = {};
    for (const u of profiles ?? []) userById[u.id] = u;

    // 3) Group voters by songId -> [{ id, name, avatar }]
    const voters = {};
    for (const v of votes) {
      const u = userById[v.userId] || {};
      if (!voters[v.songId]) voters[v.songId] = [];
      voters[v.songId].push({
        id: v.userId,
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
