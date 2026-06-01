'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase';

interface QueueItem {
  id: string;
  song_title: string;
  song_artist: string;
  song_image: string | null;
  spotify_id: string;
  bid_amount: number;
  status: 'pending' | 'played' | 'skipped';
  user_id: string;
  created_at: string;
  profiles?: { display_name: string };
}

interface QueueRealtimeProps {
  venueId: string;
  isAdmin?: boolean;
  onPlay?: (item: QueueItem) => void;
}

export default function QueueRealtime({ venueId, isAdmin = false, onPlay }: QueueRealtimeProps) {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchQueue = useCallback(async () => {
    const { data, error } = await supabase
      .from('queue')
      .select('*, profiles(display_name)')
      .eq('venue_id', venueId)
      .eq('status', 'pending')
      .order('bid_amount', { ascending: false })
      .order('created_at', { ascending: true });
    if (!error) setQueue(data || []);
    setLoading(false);
  }, [venueId]);

  useEffect(() => {
    fetchQueue();
    const channel = supabase
      .channel(`queue-${venueId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'queue',
        filter: `venue_id=eq.${venueId}`,
      }, () => { fetchQueue(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [venueId, fetchQueue]);

  const markAsPlayed = async (item: QueueItem) => {
    await supabase.from('queue')
      .update({ status: 'played', played_at: new Date().toISOString() })
      .eq('id', item.id);
    if (onPlay) onPlay(item);
  };

  const skipItem = async (id: string) => {
    await supabase.from('queue').update({ status: 'skipped' }).eq('id', id);
  };

  if (loading) return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500" />
    </div>
  );

  if (queue.length === 0) return (
    <div className="text-center py-12 text-gray-400">
      <p className="text-lg font-medium">No hay canciones en cola</p>
      <p className="text-sm mt-1">¡Sé el primero en añadir una!</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {queue.map((item, index) => (
        <div key={item.id}
          className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
            index === 0
              ? 'bg-purple-900/30 border-purple-500/50 shadow-lg shadow-purple-500/10'
              : 'bg-gray-800/50 border-gray-700/50'
          }`}
        >
          <div className="text-2xl font-bold text-gray-500 w-8 text-center">
            {index === 0 ? '▶️' : index + 1}
          </div>
          {item.song_image ? (
            <img src={item.song_image} alt={item.song_title} className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center text-2xl">🎵</div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white truncate">{item.song_title}</p>
            <p className="text-sm text-gray-400 truncate">{item.song_artist}</p>
            {item.profiles && <p className="text-xs text-gray-500">por {item.profiles.display_name}</p>}
          </div>
          <div className="text-right">
            <p className="font-bold text-yellow-400">{item.bid_amount}</p>
            <p className="text-xs text-gray-500">créditos</p>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <button onClick={() => markAsPlayed(item)}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg">
                Reproducir
              </button>
              <button onClick={() => skipItem(item.id)}
                className="px-3 py-1 bg-red-600/20 hover:bg-red-600/40 text-red-400 text-xs rounded-lg border border-red-500/20">
                Saltar
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
