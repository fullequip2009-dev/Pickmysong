// GET /api/spotify/search?q=song+name&venue_id=xxx - Issue #27
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getVenueSpotifyToken(venueId: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from('spotify_tokens')
    .select('access_token, refresh_token, expires_at')
    .eq('venue_id', venueId)
    .single();

  if (!data) return null;
  if (new Date(data.expires_at) > new Date()) return data.access_token;

  // Refresh token
  const basic = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: data.refresh_token,
    }),
  });

  if (!res.ok) return null;
  const refreshed = await res.json();
  const expiresAt = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();

  await supabaseAdmin.from('spotify_tokens').update({
    access_token: refreshed.access_token,
    expires_at: expiresAt,
    updated_at: new Date().toISOString(),
  }).eq('venue_id', venueId);

  return refreshed.access_token;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const venueId = searchParams.get('venue_id');

    if (!q || !venueId)
      return NextResponse.json({ error: 'q and venue_id required' }, { status: 400 });

    const accessToken = await getVenueSpotifyToken(venueId);
    if (!accessToken)
      return NextResponse.json({ error: 'No valid Spotify token for venue' }, { status: 401 });

    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=10`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!spotifyRes.ok)
      return NextResponse.json({ error: 'Spotify search failed' }, { status: spotifyRes.status });

    const data = await spotifyRes.json();
    const tracks = data.tracks.items.map((track: any) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((a: any) => a.name),
      album: track.album.name,
      image: track.album.images?.[0]?.url,
      duration_ms: track.duration_ms,
      uri: track.uri,
    }));

    return NextResponse.json({ tracks });
  } catch (error) {
    console.error('Spotify search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
