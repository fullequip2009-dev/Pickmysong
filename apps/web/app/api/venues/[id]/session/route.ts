// POST /api/venues/[id]/session — Arranque/parada de la sesión de reproducción.
// Equivale a "encender/apagar el venue" de 5Beats (venue.online + el primer encolado del job).
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { getValidSpotifyToken, playTrackOnDevice } from '@/lib/spotify';

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

// Comprueba que el caller autenticado es el dueño del venue (venues.owner_id == auth.uid()).
async function requireOwner(venueId: string) {
  const supabase = getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized', status: 401 as const };

  const { data: venue } = await supabaseAdmin
    .from('venues')
    .select('id, owner_id, spotify_device_id')
    .eq('id', venueId)
    .single();

  if (!venue) return { error: 'Venue not found', status: 404 as const };
  if (venue.owner_id !== user.id) return { error: 'Forbidden', status: 403 as const };

  return { venue };
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const venueId = params.id;
    const guard = await requireOwner(venueId);
    if ('error' in guard) {
      return NextResponse.json({ error: guard.error }, { status: guard.status });
    }

    const body = await request.json().catch(() => ({}));
    const { action, device_id } = body as { action?: 'start' | 'stop'; device_id?: string };

    if (action !== 'start' && action !== 'stop') {
      return NextResponse.json({ error: "action must be 'start' or 'stop'" }, { status: 400 });
    }

    if (action === 'stop') {
      // Apagar el venue y limpiar la canción que sonaba (equivale a venue.update(online:false)).
      await supabaseAdmin.from('venues').update({ online: false }).eq('id', venueId);
      await supabaseAdmin
        .from('queue')
        .update({ playing: false })
        .eq('venue_id', venueId)
        .eq('playing', true);
      return NextResponse.json({ stopped: true });
    }

    // action === 'start': encender el venue y, si llega, registrar el device.
    const update: { online: boolean; spotify_device_id?: string } = { online: true };
    if (device_id) update.spotify_device_id = device_id;
    await supabaseAdmin.from('venues').update(update).eq('id', venueId);

    // Primer avance de la cola (equivale al primer encolado de PlaySpotifySongsJob al encender).
    const { data: next, error: rpcErr } = await supabaseAdmin.rpc('advance_queue', {
      p_venue_id: venueId,
    });
    if (rpcErr) {
      console.error('[venues/session] advance_queue error:', rpcErr);
      return NextResponse.json({ started: true, nowPlaying: null });
    }

    if (!next) {
      return NextResponse.json({ started: true, empty: true, nowPlaying: null });
    }

    const { data: song } = await supabaseAdmin
      .from('songs')
      .select('spotify_id')
      .eq('id', next.song_id)
      .single();

    const token = await getValidSpotifyToken(venueId);
    const device = device_id || guard.venue.spotify_device_id;
    let playback = null;
    if (token && device && song?.spotify_id) {
      playback = await playTrackOnDevice(token, device, song.spotify_id);
    }

    return NextResponse.json({ started: true, nowPlaying: next, playback });
  } catch (err) {
    console.error('[venues/session] error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
