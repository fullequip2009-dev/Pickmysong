'use client';

// Reproductor del venue — equivale al "reproductor maestro" de 5Beats que ejecutaba
// PlaySpotifySongsJob. Carga el Spotify Web Playback SDK, registra su device en el venue,
// arranca la cola y, al acabar cada canción (margen 3s), llama a /api/queue/advance.
import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';

// --- Tipos mínimos del Spotify Web Playback SDK (no hay @types oficiales) ---
interface SpotifyPlayer {
  connect(): Promise<boolean>;
  disconnect(): void;
  addListener(event: string, cb: (payload: any) => void): boolean;
  removeListener(event: string): boolean;
}
interface SpotifyPlayerConstructorOptions {
  name: string;
  getOAuthToken: (cb: (token: string) => void) => void;
  volume?: number;
}
declare global {
  interface Window {
    Spotify?: {
      Player: new (options: SpotifyPlayerConstructorOptions) => SpotifyPlayer;
    };
    onSpotifyWebPlaybackSDKReady?: () => void;
  }
}

interface QueueRow {
  id: string;
  venue_id: string;
  song_id: string;
  bids: number;
  position: number;
  playing: boolean;
  played: boolean;
  started_at: string | null;
  created_at: string;
  title: string;
  artist: string;
  cover: string;
  duration: string | null;
  spotify_id: string | null;
}

export default function VenuePlayerPage() {
  const params = useParams();
  const venueId = String(params.id);

  const [status, setStatus] = useState('Cargando reproductor…');
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [queue, setQueue] = useState<QueueRow[]>([]);
  const playerRef = useRef<SpotifyPlayer | null>(null);
  // Debounce para no llamar a advance dos veces por el mismo final de canción (margen 3s de 5Beats).
  const advancingRef = useRef(false);

  // Relee la vista ordenada (equivale al scope :ordered de 5Beats).
  const reloadQueue = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('venue_queue_ordered')
      .select('*')
      .eq('venue_id', venueId);
    if (data) setQueue(data as unknown as QueueRow[]);
  }, [venueId]);

  // Llama al motor para avanzar la cola.
  const advance = useCallback(async () => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    try {
      await fetch('/api/queue/advance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ venue_id: venueId, device_id: deviceId }),
      });
    } catch (err) {
      console.error('[player] advance error:', err);
    } finally {
      // Pequeña ventana anti-doble-disparo; Spotify tarda en cambiar de pista.
      setTimeout(() => {
        advancingRef.current = false;
      }, 5000);
    }
  }, [venueId, deviceId]);

  // Realtime sobre `queue`: cualquier cambio relee la vista ordenada.
  useEffect(() => {
    reloadQueue();
    const supabase = createClient();
    const channel = supabase
      .channel(`venue-queue-${venueId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'queue', filter: `venue_id=eq.${venueId}` },
        () => reloadQueue()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [venueId, reloadQueue]);

  // Carga del SDK + creación del player.
  useEffect(() => {
    const scriptId = 'spotify-web-playback-sdk';
    let player: SpotifyPlayer | null = null;

    const initPlayer = () => {
      if (!window.Spotify) return;
      player = new window.Spotify.Player({
        name: `PicMySong · ${venueId}`,
        // getOAuthToken pide el token al endpoint protegido (solo owner).
        getOAuthToken: (cb) => {
          fetch(`/api/spotify/token?venue_id=${encodeURIComponent(venueId)}`)
            .then((r) => r.json())
            .then((j) => {
              if (j.access_token) cb(j.access_token);
              else setStatus('No autorizado para reproducir en este local.');
            })
            .catch(() => setStatus('Error obteniendo el token de Spotify.'));
        },
        volume: 0.8,
      });
      playerRef.current = player;

      // ready: registramos device y arrancamos la cola (equivale al primer encolado del job).
      player.addListener('ready', async ({ device_id }: { device_id: string }) => {
        setDeviceId(device_id);
        setStatus('Reproductor listo. Iniciando cola…');
        await fetch(`/api/venues/${venueId}/register-device`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ device_id }),
        });
        await fetch('/api/queue/advance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ venue_id: venueId, device_id }),
        });
      });

      player.addListener('not_ready', () => setStatus('Reproductor desconectado.'));
      player.addListener('initialization_error', ({ message }: { message: string }) =>
        setStatus(`Error de inicialización: ${message}`)
      );
      player.addListener('authentication_error', ({ message }: { message: string }) =>
        setStatus(`Error de autenticación: ${message}`)
      );
      player.addListener('account_error', ({ message }: { message: string }) =>
        setStatus(`Cuenta no compatible (¿Premium?): ${message}`)
      );

      // player_state_changed: si la canción está a <3s del final, avanzamos (margen 3s de 5Beats).
      player.addListener('player_state_changed', (state: any) => {
        if (!state) return;
        const { paused, duration, position } = state;
        if (!paused && duration > 0 && duration - position < 3000) {
          advance();
        }
      });

      player.connect();
    };

    if (window.Spotify) {
      initPlayer();
    } else {
      window.onSpotifyWebPlaybackSDKReady = initPlayer;
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);
      }
    }

    return () => {
      playerRef.current?.disconnect();
    };
  }, [venueId, advance]);

  const nowPlaying = queue.find((q) => q.playing);
  const upNext = queue.filter((q) => !q.playing);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-black text-white p-6">
      <h1 className="text-2xl font-bold mb-1">Reproductor del local</h1>
      <p className="text-sm text-purple-300 mb-6">{status}</p>

      {/* Now Playing */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Sonando ahora</h2>
        {nowPlaying ? (
          <div className="flex items-center gap-4 bg-white/5 rounded-xl p-4">
            <div className="text-4xl">{nowPlaying.cover || '🎵'}</div>
            <div>
              <p className="font-bold">{nowPlaying.title}</p>
              <p className="text-purple-300 text-sm">{nowPlaying.artist}</p>
              <p className="text-xs text-purple-400 mt-1">{nowPlaying.bids} pujas</p>
            </div>
          </div>
        ) : (
          <p className="text-purple-400 text-sm">Nada en reproducción.</p>
        )}
      </section>

      {/* Cola en vivo */}
      <section>
        <h2 className="text-lg font-semibold mb-3">A continuación</h2>
        <ul className="space-y-2">
          {upNext.map((q) => (
            <li key={q.id} className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
              <span className="text-2xl">{q.cover || '🎵'}</span>
              <div className="flex-1">
                <p className="font-medium text-sm">{q.title}</p>
                <p className="text-purple-300 text-xs">{q.artist}</p>
              </div>
              <span className="text-xs text-purple-400">{q.bids} pujas</span>
            </li>
          ))}
          {upNext.length === 0 && (
            <li className="text-purple-400 text-sm">Cola vacía.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
