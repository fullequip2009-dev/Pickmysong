'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type QueueStatus = 'pending' | 'playing' | 'played' | 'skipped';

interface QueueItem {
  id: string;
  venue_id: string;
  song_id: string;
  requested_by: string | null;
  puja_count: number;
  status: QueueStatus;
  requested_at: string;
  played_at: string | null;
  last_pujaed_at: string;
  song?: {
    id: string;
    title: string;
    artist: string;
    cover?: string;
    duration?: number;
  };
}

interface NowPlaying {
  playing: boolean;
  track?: {
    id: string;
    name: string;
    artists: string[];
    album: string;
    image?: string;
    duration_ms: number;
    progress_ms: number;
  };
}

const STATUS_LABELS: Record<QueueStatus, string> = {
  pending: 'En espera',
  playing: 'Sonando',
  played: 'Tocada',
  skipped: 'Saltada',
};

const STATUS_COLORS: Record<QueueStatus, string> = {
  pending: 'bg-gray-700 text-gray-200',
  playing: 'bg-green-600 text-white animate-pulse',
  played: 'bg-gray-600 text-gray-400',
  skipped: 'bg-red-900 text-red-300',
};

export default function VenueDashboard() {
  const [venueId, setVenueId] = useState<string | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [blockingNext, setBlockingNext] = useState(false);
  const blockCheckRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const vid = params.get('venue_id');
    const connected = params.get('spotify_connected');
    const error = params.get('spotify_error');
    if (vid) setVenueId(vid);
    if (connected === 'true') {
      setSpotifyConnected(true);
      setMessage('Spotify conectado correctamente!');
    }
    if (error) setMessage(`Error Spotify: ${error}`);
  }, []);

  // Fetch queue_items ordered by puja_count DESC, requested_at ASC
  const fetchQueue = useCallback(async () => {
    if (!venueId) return;
    const { data, error } = await supabase
      .from('queue_items')
      .select('*')
      .eq('venue_id', venueId)
      .in('status', ['pending', 'playing'])
      .order('puja_count', { ascending: false })
      .order('requested_at', { ascending: true })
      .limit(50);
    if (!error && data) {
      setQueue(data as QueueItem[]);
    }
    setLoading(false);
  }, [venueId]);

  const fetchNowPlaying = useCallback(async () => {
    if (!venueId) return;
    try {
      const res = await fetch(`/api/spotify/now-playing?venue_id=${venueId}`);
      const data = await res.json();
      setNowPlaying(data);
      // Check 20-second block rule
      if (data?.track?.duration_ms && data?.track?.progress_ms) {
        const remaining = data.track.duration_ms - data.track.progress_ms;
        setBlockingNext(remaining < 20000);
        // Schedule recheck when block should lift
        if (remaining < 20000 && remaining > 0) {
          if (blockCheckRef.current) clearTimeout(blockCheckRef.current);
          blockCheckRef.current = setTimeout(() => {
            setBlockingNext(false);
            fetchNowPlaying();
          }, remaining + 500);
        }
      } else {
        setBlockingNext(false);
      }
    } catch {
      // ignore
    }
  }, [venueId]);

  useEffect(() => {
    if (!venueId) return;
    fetchQueue();
    fetchNowPlaying();

    // Realtime subscription to queue_items filtered by venue_id
    const channel = supabase
      .channel(`queue_items-${venueId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'queue_items',
          filter: `venue_id=eq.${venueId}`,
        },
        () => {
          fetchQueue();
        }
      )
      .subscribe();

    // Poll now-playing every 10s
    const interval = setInterval(fetchNowPlaying, 10000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
      if (blockCheckRef.current) clearTimeout(blockCheckRef.current);
    };
  }, [venueId, fetchQueue, fetchNowPlaying]);

  const connectSpotify = async () => {
    if (!venueId) return;
    const res = await fetch('/api/spotify/authorize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ venue_id: venueId }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };


  const updateStatus = async (itemId: string, newStatus: QueueStatus) => {
    if (newStatus === 'playing' && blockingNext) {
      setMessage('No se puede cambiar la cancion: quedan menos de 20 segundos para que acabe la actual.');
      setTimeout(() => setMessage(''), 4000);
      return;
    }
    const updates: Partial<QueueItem> = { status: newStatus };
    if (newStatus === 'playing' || newStatus === 'played' || newStatus === 'skipped') {
      updates.played_at = new Date().toISOString();
    }
    // If setting to playing, mark current playing as played first
    if (newStatus === 'playing') {
      await supabase
        .from('queue_items')
        .update({ status: 'played', played_at: new Date().toISOString() })
        .eq('venue_id', venueId!)
        .eq('status', 'playing');
    }
    await supabase.from('queue_items').update(updates).eq('id', itemId);
    fetchQueue();
  };

  const playingItem = queue.find(i => i.status === 'playing');
  const pendingItems = queue.filter(i => i.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold text-purple-400 mb-2">Panel del Local</h1>
      {venueId && (
        <p className="text-gray-500 text-sm mb-4">Venue ID: {venueId}</p>
      )}
      {message && (
        <div className="bg-yellow-800 text-yellow-200 px-4 py-2 rounded mb-4 text-sm">
          {message}
        </div>
      )}

      {/* Spotify Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-300 mb-3">Spotify</h2>
        {!spotifyConnected ? (
          <button
            onClick={connectSpotify}
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded"
          >
            Conectar Spotify
          </button>
      ) : (
                    <button
                onClick={disconnectSpotify}
                className="mt-3 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-6 rounded"
              >
                Desconectar Spotify
              </button>
      )}
        ) : nowPlaying?.playing && nowPlaying.track ? (
          <div className="flex items-center gap-4 bg-gray-900 rounded-xl p-4">
            {nowPlaying.track.image && (
              <img src={nowPlaying.track.image} alt="album" className="w-16 h-16 rounded" />
            )}
            <div className="flex-1">
              <p className="font-bold text-white">{nowPlaying.track.name}</p>
              <p className="text-gray-400 text-sm">{nowPlaying.track.artists.join(', ')}</p>
              <p className="text-gray-500 text-xs">{nowPlaying.track.album}</p>
              {blockingNext && (
                <p className="text-yellow-400 text-xs mt-1 font-semibold">
                  Bloqueo activo: menos de 20s para que acabe
                </p>
                          <button
                onClick={disconnectSpotify}
                className="mt-3 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-6 rounded"
              >
                Desconectar Spotify
              </button>
              )}
            </div>
            <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
              EN DIRECTO
            </span>
          </div>
        ) : (
          <p className="text-gray-500">Spotify conectado &mdash; No hay nada reproduciendose</p>
                  <button
              onClick={disconnectSpotify}
              className="mt-3 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-6 rounded"
            >
              Desconectar Spotify
            </button>
        )}
      </section>

      {/* Now Playing in Queue */}
      {playingItem && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-300 mb-3">Sonando ahora</h2>
          <div className="bg-green-950 border border-green-700 rounded-xl p-4 flex items-center gap-4">
            <div className="flex-1">
              <p className="font-bold text-green-300">{playingItem.song_id}</p>
              <p className="text-gray-400 text-sm">Pedido por {playingItem.requested_by || 'Anonimo'}</p>
              <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${STATUS_COLORS['playing']}`}>
                {STATUS_LABELS['playing']}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => updateStatus(playingItem.id, 'played')}
                className="bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold py-1 px-3 rounded"
              >
                Marcar Tocada
              </button>
              <button
                onClick={() => updateStatus(playingItem.id, 'skipped')}
                className="bg-red-800 hover:bg-red-700 text-white text-xs font-bold py-1 px-3 rounded"
              >
                Saltar
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Queue Section */}
      <section>
        <h2 className="text-xl font-semibold text-gray-300 mb-3">
          Cola de Canciones ({pendingItems.length} pendientes)
        </h2>
        {loading ? (
          <p className="text-gray-500">Cargando cola...</p>
        ) : pendingItems.length === 0 ? (
          <p className="text-gray-500">La cola esta vacia</p>
        ) : (
          <div className="space-y-3">
            {pendingItems.map((item, index) => (
              <div
                key={item.id}
                className="bg-gray-900 rounded-xl p-4 flex items-center gap-4"
              >
                <span className="text-gray-500 font-bold w-6 text-center">{index + 1}</span>
                <div className="flex-1">
                  <p className="font-semibold text-white">{item.song_id}</p>
                  <p className="text-gray-400 text-xs">Pedido por {item.requested_by || 'Anonimo'}</p>
                  <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mt-1 ${STATUS_COLORS[item.status]}`}>
                    {STATUS_LABELS[item.status]}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-purple-400 font-bold text-lg">{item.puja_count}</span>
                  <span className="text-gray-500 text-xs">pujas</span>
                </div>
                <button
                  onClick={() => updateStatus(item.id, 'playing')}
                  disabled={blockingNext}
                  className="bg-purple-700 hover:bg-purple-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold py-1 px-3 rounded"
                >
                  Poner ahora
                </button>
                <button
                  onClick={() => updateStatus(item.id, 'skipped')}
                  className="bg-red-900 hover:bg-red-800 text-white text-xs font-bold py-1 px-3 rounded"
                >
                  Saltar
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
