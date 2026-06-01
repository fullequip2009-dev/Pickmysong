// @ts-nocheck
// GET /api/spotify/search?q=song+name&venue_id=xxx - Issue #27
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

async function getVenueSpotifyToken(venueId: string, supabase: any) {
  const { data } = await supabase
    .from('spotify_tokens')
    .select('access_token, refresh_token, expires_at')
    .eq('venue_id', venueId).single();
  if (!data) return null;
  if (new Date(data.expires_at) > new Date()) return data.access_token;
  // Refresh
  const basic = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: data.refresh_token }),
  });
  const refreshed = await res.json();
  if (!res.ok) return null;
  const expiresAt = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();
  await supabase.from('spotify_tokens').update({ access_token: refreshed.access_token, expires_at: expiresAt }).eq('venue_id', venueId);
  return refreshed.access_token;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  const venueId = searchParams.get('venue_id');
  if (!q) return NextResponse.json({ error: 'q required' }, { status: 400 });
  try {
    const supabase = await createServerSupabaseClient();
    let bannedSongs: string[] = [], bannedGenres: string[] = [];
    if (venueId) {
      const { data: rules } = await supabase.from('venue_music_rules').select('banned_genres,banned_songs').eq('venue_id', venueId).single();
      if (rules) { bannedSongs = rules.banned_songs ?? []; bannedGenres = rules.banned_genres ?? []; }
      const token = await getVenueSpotifyToken(venueId, supabase);
      if (token) {
        const r = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=20&market=ES`, { headers: { Authorization: `Bearer ${token}` } });
        if (r.ok) {
          const d = await r.json();
          const tracks = (d.tracks?.items ?? []).filter((t: any) => !bannedSongs.includes(t.id));
          return NextResponse.json({ tracks, source: 'spotify' });
        }
      }
    }
    const { data: songs } = await supabase.from('songs').select('id,title,artist,cover,duration,genre').or(`title.ilike.%${q}%,artist.ilike.%${q}%`).limit(20);
    return NextResponse.json({ tracks: (songs ?? []).filter((s: any) => !bannedGenres.includes(s.genre)), source: 'local' });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
