import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

async function getValidSpotifyToken(supabase: any, venueId: string): Promise<string | null> {
  const { data } = await supabase
    .from('spotify_tokens')
    .select('access_token, refresh_token, expires_at')
    .eq('venue_id', venueId)
    .single();

  if (!data) return null;
  if (new Date(data.expires_at) > new Date()) return data.access_token;

  const basic = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: data.refresh_token }),
  });
  if (!res.ok) return null;
  const refreshed = await res.json();
  const expiresAt = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();
  await supabase.from('spotify_tokens').upsert(
    { venue_id: venueId, access_token: refreshed.access_token, expires_at: expiresAt, updated_at: new Date().toISOString() },
    { onConflict: 'venue_id' }
  );
  return refreshed.access_token;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const venueId = searchParams.get('venue_id');
    if (!venueId) return NextResponse.json({ error: 'venue_id required' }, { status: 400 });

    const supabase = await createServerSupabaseClient();
    const accessToken = await getValidSpotifyToken(supabase, venueId);
    if (!accessToken) return NextResponse.json({ error: 'No valid Spotify token' }, { status: 401 });

    const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (res.status === 204 || res.status === 202) {
      return NextResponse.json({ playing: false, track: null });
    }

    if (!res.ok) return NextResponse.json({ error: 'Spotify API error' }, { status: 502 });

    const data = await res.json();
    if (!data || !data.item) return NextResponse.json({ playing: false, track: null });

    const track = {
      id: data.item.id,
      name: data.item.name,
      artist: data.item.artists.map((a: any) => a.name).join(', '),
      album: data.item.album.name,
      image: data.item.album.images?.[0]?.url || null,
      duration_ms: data.item.duration_ms,
      progress_ms: data.progress_ms,
      is_playing: data.is_playing,
    };

    return NextResponse.json({ playing: data.is_playing, track });
  } catch (error) {
    console.error('Now playing error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
