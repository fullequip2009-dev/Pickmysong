// GET /api/spotify/token?venue_id=xxx — Entrega un access_token válido al Web Playback SDK.
// SOLO el dueño del venue puede obtenerlo. Nunca expone el refresh_token.
// Equivale al endpoint que alimenta getOAuthToken del reproductor en 5Beats.
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { getValidSpotifyToken } from '@/lib/spotify';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function getServerClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const venueId = searchParams.get('venue_id');
    if (!venueId) {
      return NextResponse.json({ error: 'venue_id required' }, { status: 400 });
    }

    // Comprobar sesión Supabase + propiedad del venue antes de soltar el token.
    const supabase = getServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: venue } = await supabaseAdmin
      .from('venues')
      .select('id, owner_id')
      .eq('id', venueId)
      .single();

    if (!venue) return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
    if (venue.owner_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const accessToken = await getValidSpotifyToken(venueId);
    if (!accessToken) {
      return NextResponse.json({ error: 'No valid Spotify token' }, { status: 401 });
    }

    // Solo el access_token: jamás devolvemos el refresh_token al cliente.
    return NextResponse.json({ access_token: accessToken });
  } catch (err) {
    console.error('[spotify/token] error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
