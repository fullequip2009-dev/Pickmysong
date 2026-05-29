// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';
import { getPlaylists, createPlaylist } from '../../../lib/db';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const venueId = searchParams.get('venueId') || undefined;
  const userId = searchParams.get('userId') || undefined;
  const search = searchParams.get('search') || undefined;

  if (SUPABASE_URL) {
    try {
      const { createServerSupabaseClient } = await import('../../../lib/supabase');
      const supabase = await createServerSupabaseClient();

      let query = supabase
        .from('playlists')
        .select('*, playlist_songs ( id, position, songs ( id, title, artist, cover_url, votes, duration ) )')
        .order('created_at', { ascending: false });

      if (venueId) query = query.eq('venue_id', venueId);
      if (userId) query = query.eq('user_id', userId);
      if (search) query = query.ilike('name', `%${search}%`);

      const { data, error } = await query;
      if (error) throw error;

      return NextResponse.json({ playlists: data ?? [], total: data?.length ?? 0 });
    } catch (err) {
      console.error('[/api/playlists] Supabase error, falling back:', err);
    }
  }

  const playlists = getPlaylists({ venueId, userId });
  return NextResponse.json({ playlists, total: playlists.length });
