import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { venue_id } = await request.json();
    if (!venue_id) {
      return NextResponse.json({ error: 'venue_id required' }, { status: 400 });
    }

    const scopes = [
      'user-modify-playback-state',
      'user-read-playback-state',
      'user-read-currently-playing',
      'playlist-read-private',
      'playlist-modify-public',
      'playlist-modify-private',
    ].join(' ');

    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/spotify/callback`;
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.set('client_id', process.env.SPOTIFY_CLIENT_ID!);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', scopes);
    authUrl.searchParams.set('state', venue_id);

    return NextResponse.json({ url: authUrl.toString() });
  } catch (error) {
    console.error('Spotify authorize error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
