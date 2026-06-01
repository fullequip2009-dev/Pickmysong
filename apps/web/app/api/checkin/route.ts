// @ts-nocheck
// POST /api/checkin  — Issue #6: Check-in en local
// DELETE /api/checkin  — Check-out
// GET /api/checkin?venue_id=xxx — Visitantes activos
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const venueId = searchParams.get('venue_id');
  if (!venueId) return NextResponse.json({ error: 'venue_id required' }, { status: 400 });

  try {
    const supabase = await createServerSupabaseClient();
    const { count } = await supabase
      .from('checkins')
      .select('*', { count: 'exact', head: true })
      .eq('venue_id', venueId)
      .eq('active', true);

    // Get queue for this venue
    const { data: queue } = await supabase
      .from('queue')
      .select('id, bids, position, songs ( id, title, artist, cover, duration )')
      .eq('venue_id', venueId)
      .eq('played', false)
      .order('bids', { ascending: false })
      .order('created_at', { ascending: true })
      .limit(20);

    // Get currently playing (most recently played)
    const { data: nowPlaying } = await supabase
      .from('queue')
      .select('id, played_at, songs ( id, title, artist, cover, duration )')
      .eq('venue_id', venueId)
      .eq('played', true)
      .order('played_at', { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json({
      visitors: count ?? 0,
      now_playing: nowPlaying ?? null,
      queue: queue ?? [],
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { venue_id } = body;
    if (!venue_id) return NextResponse.json({ error: 'venue_id required' }, { status: 400 });

    // Close any existing active checkin for this user
    await supabase
      .from('checkins')
      .update({ active: false, checked_out_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('active', true);

    // Create new checkin
    const { data, error } = await supabase
      .from('checkins')
      .insert({ user_id: user.id, venue_id })
      .select()
      .single();

    if (error) throw error;

    // Update venue visitor count
    const { count } = await supabase
      .from('checkins')
      .select('*', { count: 'exact', head: true })
      .eq('venue_id', venue_id)
      .eq('active', true);

    await supabase
      .from('venues')
      .update({ current_visitors: count ?? 1 })
      .eq('id', venue_id);

    return NextResponse.json({ success: true, checkin: data }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: checkin } = await supabase
      .from('checkins')
      .update({ active: false, checked_out_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('active', true)
      .select()
      .single();

    if (checkin?.venue_id) {
      const { count } = await supabase
        .from('checkins')
        .select('*', { count: 'exact', head: true })
        .eq('venue_id', checkin.venue_id)
        .eq('active', true);

      await supabase
        .from('venues')
        .update({ current_visitors: count ?? 0 })
        .eq('id', checkin.venue_id);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
