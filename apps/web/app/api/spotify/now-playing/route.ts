import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getValidSpotifyToken(venueId: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from('spotify_tokens')
    .select('access_token, refresh_token, expires_at')
    .eq('venue_id', venueId)
    .single();

  if (!data) return null;
  if (new Date(data.expires_at) > new Date()) return data.access_token;

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

  await supabaseAdmin
    .from('spotify_tokens')
    .upsert(
      {
        venue_id: venueId,
        access_token: refreshed.access_token,
        expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'venue_id' }
    );

  return refreshed.access_token;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const venueId = searchParams.get('venue_id');

    if (!venueId)
      return NextResponse.json({ error: 'venue_id required' }, { status: 400 });

    const accessToken = await getValidSpotifyToken(venueId);
    if (!accessToken)
      return NextResponse.json({ error: 'No valid Spotify token' }, { status: 401 });

    const spotifyRes = await fetch(
      'https://api.spotify.com/v1/me/player/currently-playing',
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (spotifyRes.status === 204)
      return NextResponse.json({ playing: false });

    if (!spotifyRes.ok)
      return NextResponse.json({ error: 'Spotify error' }, { status: spotifyRes.status });

    const track = await spotifyRes.json();
    return NextResponse.json({
      playing: track.is_playing,
      track: {
        id: track.item?.id,
        name: track.item?.name,
        artists: track.item?.artists?.map((a: any) => a.name),
        album: track.item?.album?.name,
        image: track.item?.album?.images?.[0]?.url,
        duration_ms: track.item?.duration_ms,
        progress_ms: track.progress_ms,
      },
    });
  } catch (error) {
    console.error('now-playing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
