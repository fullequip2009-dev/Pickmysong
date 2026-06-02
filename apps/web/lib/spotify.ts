// ============================================================
//  Helper compartido de Spotify (motor de reproducción 5Beats → PicMySong)
//  Centraliza el refresh de token y el control del reproductor.
//  Equivale a la capa RSpotify / SpotifyClient de 5Beats.
// ============================================================
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Devuelve un access_token válido para el venue, refrescándolo si caducó.
// Extraído de /api/spotify/now-playing para reutilizarlo en el motor.
// Equivale a SpotifyToken#refresh_if_needed de 5Beats.
export async function getValidSpotifyToken(venueId: string): Promise<string | null> {
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

export interface PlayResult {
  ok: boolean;
  status: number;
}

// Reproduce una pista concreta en un dispositivo (equivale a RSpotify::Player#play_track).
// Traga los errores típicos (401/403/404/429) con log, como los rescue de 5Beats,
// y devuelve {ok,status} para que el caller decida.
export async function playTrackOnDevice(
  token: string,
  deviceId: string,
  spotifyTrackId: string
): Promise<PlayResult> {
  try {
    const url = `https://api.spotify.com/v1/me/player/play?device_id=${encodeURIComponent(deviceId)}`;
    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ uris: [`spotify:track:${spotifyTrackId}`] }),
    });

    // 204 = éxito sin contenido. Cualquier otro 2xx también vale.
    if (res.ok || res.status === 204) {
      return { ok: true, status: res.status };
    }

    // Errores conocidos: token, permisos, sin dispositivo activo, rate-limit.
    if ([401, 403, 404, 429].includes(res.status)) {
      console.warn(`[spotify] play_track no aplicado (status ${res.status}) device=${deviceId} track=${spotifyTrackId}`);
      return { ok: false, status: res.status };
    }

    console.warn(`[spotify] play_track error inesperado status ${res.status}`);
    return { ok: false, status: res.status };
  } catch (err) {
    console.error('[spotify] play_track excepción:', err);
    return { ok: false, status: 0 };
  }
}

export interface SpotifyDevice {
  id: string;
  is_active: boolean;
  name: string;
  type: string;
  volume_percent: number | null;
}

// Lista los dispositivos disponibles (GET /v1/me/player/devices).
export async function getDevices(token: string): Promise<SpotifyDevice[]> {
  try {
    const res = await fetch('https://api.spotify.com/v1/me/player/devices', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      console.warn(`[spotify] getDevices status ${res.status}`);
      return [];
    }
    const json = await res.json();
    return (json.devices ?? []) as SpotifyDevice[];
  } catch (err) {
    console.error('[spotify] getDevices excepción:', err);
    return [];
  }
}
