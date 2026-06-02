// POST /api/queue/advance — Motor de reproducción.
// Equivale a PlaySpotifySongsJob#perform de 5Beats: marca la canción actual como
// reproducida, elige la siguiente más pujada y la lanza en Spotify.
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getValidSpotifyToken, playTrackOnDevice } from '@/lib/spotify';

// Service role: modifica el orden de la cola y debe saltarse RLS.
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { venue_id, device_id } = body as { venue_id?: string; device_id?: string };

    if (!venue_id) {
      return NextResponse.json({ error: 'venue_id required' }, { status: 400 });
    }

    // 1) Leer venue. Si está offline, no avanzamos (equivale a `return unless venue.online?`).
    const { data: venue, error: venueErr } = await supabaseAdmin
      .from('venues')
      .select('id, online, spotify_device_id')
      .eq('id', venue_id)
      .single();

    if (venueErr || !venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
    }
    if (venue.online === false) {
      return NextResponse.json({ stopped: true });
    }

    // 2) Avanzar la cola atómicamente (equivale a la transacción del job).
    const { data: next, error: rpcErr } = await supabaseAdmin.rpc('advance_queue', {
      p_venue_id: venue_id,
    });

    if (rpcErr) {
      console.error('[queue/advance] advance_queue error:', rpcErr);
      return NextResponse.json({ error: 'advance_queue failed' }, { status: 500 });
    }

    // 3) Cola vacía -> apagamos el venue (equivale a `venue.update(online:false)` cuando no hay más canciones).
    if (!next) {
      await supabaseAdmin.from('venues').update({ online: false }).eq('id', venue_id);
      return NextResponse.json({ empty: true });
    }

    // 4) Resolver el spotify_id real de la canción para reproducirla.
    const { data: song } = await supabaseAdmin
      .from('songs')
      .select('spotify_id')
      .eq('id', next.song_id)
      .single();

    // 5) Resolver token y dispositivo.
    const token = await getValidSpotifyToken(venue_id);
    const device = device_id || venue.spotify_device_id;

    let playback: { ok: boolean; status: number } | null = null;
    if (token && device && song?.spotify_id) {
      // Lanzar la pista en Spotify (equivale a player.play_track). El cambio en `queue`
      // ya disparó Realtime, así que las pantallas se actualizan aunque esto falle.
      playback = await playTrackOnDevice(token, device, song.spotify_id);
    } else {
      console.warn('[queue/advance] sin token/device/spotify_id; se avanza la cola sin reproducir', {
        hasToken: !!token,
        hasDevice: !!device,
        hasSpotifyId: !!song?.spotify_id,
      });
    }

    return NextResponse.json({ nowPlaying: next, playback });
  } catch (err) {
    console.error('[queue/advance] error:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
