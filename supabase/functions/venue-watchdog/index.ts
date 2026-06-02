// ============================================================
//  venue-watchdog (Supabase Edge Function, Deno)
//  Red de seguridad del motor de reproducción: equivale al re-encolado
//  defensivo de PlaySpotifySongsJob en 5Beats. Si una pestaña reproductora
//  se cae, el player_state_changed nunca dispara /api/queue/advance y la cola
//  se queda colgada. Este cron (cada minuto) detecta canciones cuyo started_at
//  ya superó su duración + margen y fuerza el avance vía Spotify.
// ============================================================
// deno-lint-ignore-file no-explicit-any
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const SPOTIFY_CLIENT_ID = Deno.env.get('SPOTIFY_CLIENT_ID')!;
const SPOTIFY_CLIENT_SECRET = Deno.env.get('SPOTIFY_CLIENT_SECRET')!;

// Margen sobre la duración antes de considerar la canción "colgada" (5Beats usa 3s; aquí 5s).
const STUCK_MARGIN_MS = 5000;
const DEFAULT_DURATION_MS = 210_000; // 3:30 fallback si duration no es parseable.

const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

// Refresh de token equivalente a getValidSpotifyToken del lado Next.
async function getValidSpotifyToken(venueId: string): Promise<string | null> {
  const { data } = await admin
    .from('spotify_tokens')
    .select('access_token, refresh_token, expires_at')
    .eq('venue_id', venueId)
    .single();
  if (!data) return null;
  if (new Date(data.expires_at) > new Date()) return data.access_token;

  const basic = btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`);
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
  await admin.from('spotify_tokens').upsert(
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

// La columna duration es text; intentamos sacar segundos. Acepta "210", "3:30" o null.
function durationToMs(duration: string | null): number {
  if (!duration) return DEFAULT_DURATION_MS;
  if (duration.includes(':')) {
    const [m, s] = duration.split(':').map((n) => parseInt(n, 10));
    if (!isNaN(m) && !isNaN(s)) return (m * 60 + s) * 1000;
  }
  const secs = parseInt(duration, 10);
  if (!isNaN(secs)) return secs * 1000;
  return DEFAULT_DURATION_MS;
}

async function playTrackOnDevice(token: string, deviceId: string, trackId: string) {
  const url = `https://api.spotify.com/v1/me/player/play?device_id=${encodeURIComponent(deviceId)}`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ uris: [`spotify:track:${trackId}`] }),
  });
  return res.ok || res.status === 204;
}

Deno.serve(async () => {
  const results: any[] = [];

  // 1) Venues online (equivale a Venue.where(online:true) de 5Beats).
  const { data: venues } = await admin
    .from('venues')
    .select('id, spotify_device_id')
    .eq('online', true);

  for (const venue of venues ?? []) {
    // 2) Canción que suena ahora + su duración (vista ordenada).
    const { data: current } = await admin
      .from('venue_queue_ordered')
      .select('id, started_at, duration, spotify_id')
      .eq('venue_id', venue.id)
      .eq('playing', true)
      .maybeSingle();

    if (!current || !current.started_at) continue;

    const elapsed = Date.now() - new Date(current.started_at).getTime();
    const durationMs = durationToMs(current.duration);

    // 3) Si ya debería haber terminado (heurística started_at viejo), forzar avance.
    if (elapsed > durationMs + STUCK_MARGIN_MS) {
      const { data: next } = await admin.rpc('advance_queue', { p_venue_id: venue.id });
      if (!next) {
        await admin.from('venues').update({ online: false }).eq('id', venue.id);
        results.push({ venue: venue.id, action: 'emptied' });
        continue;
      }
      const { data: song } = await admin
        .from('songs')
        .select('spotify_id')
        .eq('id', next.song_id)
        .single();
      const token = await getValidSpotifyToken(venue.id);
      if (token && venue.spotify_device_id && song?.spotify_id) {
        const ok = await playTrackOnDevice(token, venue.spotify_device_id, song.spotify_id);
        results.push({ venue: venue.id, action: 'advanced', played: ok });
      } else {
        results.push({ venue: venue.id, action: 'advanced', played: false });
      }
    }
  }

  return new Response(JSON.stringify({ checked: venues?.length ?? 0, results }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
