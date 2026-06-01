import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

// GET /api/songs/veto?venue_id=xxx - List vetoed songs and genres for a venue
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const venueId = searchParams.get('venue_id');
    if (!venueId) return NextResponse.json({ error: 'venue_id required' }, { status: 400 });

    const supabase = await createServerSupabaseClient();

    const { data: songs, error: songsErr } = await supabase
      .from('songs')
      .select('id, spotify_id, title, artist, genre, vetoed')
      .eq('venue_id', venueId);

    const { data: genres, error: genresErr } = await supabase
      .from('venue_genre_rules')
      .select('*')
      .eq('venue_id', venueId);

    if (songsErr || genresErr) {
      return NextResponse.json({ error: 'Failed to fetch rules' }, { status: 500 });
    }

    return NextResponse.json({ songs: songs || [], genres: genres || [] });
  } catch (error) {
    console.error('GET veto error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/songs/veto - Veto or un-veto a song
export async function POST(request: Request) {
  try {
    const { venue_id, spotify_id, title, artist, genre, vetoed } = await request.json();
    if (!venue_id || !spotify_id) {
      return NextResponse.json({ error: 'venue_id and spotify_id required' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('songs')
      .upsert(
        { venue_id, spotify_id, title, artist, genre, vetoed: vetoed !== false, updated_at: new Date().toISOString() },
        { onConflict: 'venue_id,spotify_id' }
      )
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ song: data });
  } catch (error) {
    console.error('POST veto error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE /api/songs/veto?song_id=xxx - Remove veto rule
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const songId = searchParams.get('song_id');
    if (!songId) return NextResponse.json({ error: 'song_id required' }, { status: 400 });

    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('songs').delete().eq('id', songId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE veto error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
