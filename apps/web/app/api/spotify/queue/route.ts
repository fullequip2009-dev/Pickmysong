// POST /api/spotify/queue — Issue #27: Add song to venue Spotify queue
// GET  /api/spotify/queue?venue_id=xxx — Get current Spotify playback queue
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

  // Refresh expired token
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

// POST — Add a track to the venue's Spotify playback queue
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { venue_id, track_uri, track_id } = body;

    if (!venue_id || (!track_uri && !track_id)) {
      return NextResponse.json(
        { error: 'venue_id and track_uri (or track_id) required' },
        { status: 400 }
      );
    }

    // Check venue_rules for vetoes
    const uri = track_uri || `spotify:track:${track_id}`;
    const spotifyId = track_id || track_uri?.split(':').pop();

    const { data: rules } = await supabaseAdmin
      .from('venue_rules')
      .select('rule_type, value')
      .eq('venue_id', venue_id)
      .in('rule_type', ['veto_track', 'veto_artist']);

    if (rules && rules.length > 0) {
      const vetoTracks = rules
        .filter(r => r.rule_type === 'veto_track')
        .map(r => r.value);
      if (vetoTracks.includes(spotifyId)) {
        return NextResponse.json(
          { error: 'Esta cancion esta vetada en este local' },
          { status: 403 }
        );
      }
    }

    const accessToken = await getVenueSpotifyToken(venue_id);
    if (!accessToken) {
      return NextResponse.json(
        { error: 'No valid Spotify token for venue. Please reconnect Spotify.' },
        { status: 401 }
      );
    }

    // Add to Spotify queue via Web API
    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/me/player/queue?uri=${encodeURIComponent(uri)}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (spotifyRes.status === 204) {
      return NextResponse.json({ success: true, uri });
    }

    if (spotifyRes.status === 403) {
      return NextResponse.json(
        { error: 'Se requiere cuenta Spotify Premium para controlar la reproduccion' },
        { status: 403 }
      );
    }

    if (spotifyRes.status === 404) {
      return NextResponse.json(
        { error: 'No hay dispositivo Spotify activo en este local' },
        { status: 404 }
      );
    }

    const errorData = await spotifyRes.json().catch(() => ({}));
    return NextResponse.json(
      { error: errorData?.error?.message || 'Spotify queue error' },
      { status: spotifyRes.status }
    );
  } catch (error) {
    console.error('Spotify queue error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET — Disconnect Spotify (DELETE tokens) or verify connection
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const venueId = searchParams.get('venue_id');
    if (!venueId) {
      return NextResponse.json({ error: 'venue_id required' }, { status: 400 });
    }
    await supabaseAdmin.from('spotify_tokens').delete().eq('venue_id', venueId);
    return NextResponse.json({ success: true, message: 'Spotify desconectado' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
