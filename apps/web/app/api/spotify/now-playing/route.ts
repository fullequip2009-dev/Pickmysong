import { NextResponse } from 'next/server';
// getValidSpotifyToken vive ahora en lib/spotify.ts (helper compartido del motor de reproducción).
import { getValidSpotifyToken } from '@/lib/spotify';

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
