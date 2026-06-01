// @ts-nocheck
// GET /api/spotify/callback - Issue #26: Spotify OAuth for venues
import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  if (error || !code) return NextResponse.redirect(new URL('/venue-dashboard?spotify_error=access_denied', request.url));
  try {
    const basic = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/spotify/callback`;
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: redirectUri }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) return NextResponse.redirect(new URL('/venue-dashboard?spotify_error=token_failed', request.url));
    const venueId = state;
    if (!venueId) return NextResponse.redirect(new URL('/venue-dashboard?spotify_error=missing_venue', request.url));
    const supabase = await createServerSupabaseClient();
    await supabase.from('spotify_tokens').upsert({
      venue_id: venueId,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
      scope: tokenData.scope,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'venue_id' });
    return NextResponse.redirect(new URL(`/venue-dashboard?spotify_connected=true&venue_id=${venueId}`, request.url));
  } catch { return NextResponse.redirect(new URL('/venue-dashboard?spotify_error=server_error', request.url)); }
}

export async function POST(request: Request) {
  const { venue_id } = await request.json();
  if (!venue_id) return NextResponse.json({ error: 'venue_id required' }, { status: 400 });
  const scopes = 'user-modify-playback-state user-read-playback-state user-read-currently-playing playlist-read-private playlist-modify-public';
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/spotify/callback`;
  const authUrl = new URL('https://accounts.spotify.com/authorize');
  authUrl.searchParams.set('client_id', process.env.SPOTIFY_CLIENT_ID!);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('scope', scopes);
  authUrl.searchParams.set('state', venue_id);
  return NextResponse.json({ auth_url: authUrl.toString() });
}
