'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface QueueEntry {
  id: string;
  bids: number;
  position: number;
  created_at: string;
  songs: { id: string; title: string; artist: string; cover?: string; duration?: number };
  profiles: { id: string; name: string; avatar?: string };
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

export default function VenueDashboard() {
  const [venueId, setVenueId] = useState<string | null>(null);
  const [queue, setQueue] = useState<QueueEntry[]>([]);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

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

  const fetchQueue = useCallback(async () => {
    if (!venueId) return;
    const res = await fetch(`/api/queue?venue_id=${venueId}`);
    const data = await res.json();
    setQueue(data.queue || []);
    setLoading(false);
  }, [venueId]);

  const fetchNowPlaying = useCallback(async () => {
    if (!venueId) return;
    const res = await fetch(`/api/spotify/now-playing?venue_id=${venueId}`);
    const data = await res.json();
    setNowPlaying(data);
  }, [venueId]);

  useEffect(() => {
    if (!venueId) return;
    fetchQueue();
    fetchNowPlaying();

    // Real-time queue subscription
    const channel = supabase
      .channel(`queue-${venueId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'queue', filter: `venue_id=eq.${venueId}` }, () => {
        fetchQueue();
      })
      .subscribe();

    // Poll now-playing every 10s
    const interval = setInterval(fetchNowPlaying, 10000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
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

  const markPlayed = async (queueId: string) => {
    await supabase.from('queue').update({ played: true, played_at: new Date().toISOString() }).eq('id', queueId);
    fetchQueue();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Panel del Local</h1>
        {venueId && <p className="text-gray-400 mb-6 text-sm">Venue ID: {venueId}</p>}

        {message && (
          <div className="bg-green-600 text-white px-4 py-2 rounded mb-6">{message}</div>
        )}

        {/* Spotify Section */}
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Spotify</h2>
          {!spotifyConnected ? (
            <button
              onClick={connectSpotify}
              className="bg-green-500 hover:bg-green-400 text-black font-bold py-2 px-4 rounded"
            >
              Conectar Spotify
            </button>
          ) : nowPlaying?.playing && nowPlaying.track ? (
            <div className="flex items-center gap-4">
              {nowPlaying.track.image && (
                <img src={nowPlaying.track.image} alt="album" className="w-16 h-16 rounded" />
              )}
              <div>
                <p className="font-semibold">{nowPlaying.track.name}</p>
                <p className="text-gray-400 text-sm">{nowPlaying.track.artists.join(', ')}</p>
                <p className="text-gray-500 text-xs">{nowPlaying.track.album}</p>
              </div>
              <div className="ml-auto">
                <span className="bg-green-500 text-black text-xs font-bold px-2 py-1 rounded animate-pulse">
                  EN DIRECTO
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Spotify conectado - No hay nada reproduciéndose</p>
          )}
        </div>

        {/* Queue Section */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Cola de Canciones ({queue.length})
          </h2>
          {loading ? (
            <p className="text-gray-400">Cargando cola...</p>
          ) : queue.length === 0 ? (
            <p className="text-gray-400">La cola está vacía</p>
          ) : (
            <div className="space-y-3">
              {queue.map((entry, index) => (
                <div key={entry.id} className="flex items-center gap-4 bg-gray-700 rounded-lg p-3">
                  <span className="text-2xl font-bold text-gray-500 w-8 text-center">{index + 1}</span>
                  {entry.songs?.cover && (
                    <img src={entry.songs.cover} alt="cover" className="w-12 h-12 rounded" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{entry.songs?.title}</p>
                    <p className="text-gray-400 text-sm">{entry.songs?.artist}</p>
                    <p className="text-gray-500 text-xs">Pedido por {entry.profiles?.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded">
                      {entry.bids} pujas
                    </span>
                    <button
                      onClick={() => markPlayed(entry.id)}
                      className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold py-1 px-3 rounded"
                    >
                      Marcar Tocada
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
