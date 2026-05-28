'use client';

import { useEffect, useState, useCallback } from 'react';

interface VoteUpdate {
  songId: string;
  votes: number;
  delta: number; // +1 or -1
}

interface Props {
  songIds: string[];
  onVoteUpdate: (update: VoteUpdate) => void;
}

const SUPABASE_URL = typeof window !== 'undefined'
  ? process.env.NEXT_PUBLIC_SUPABASE_URL
  : undefined;

/**
 * RealtimeVotes — subscribes to Supabase Realtime for live vote count updates.
 * Falls back to polling every 10s when Supabase is not configured.
 */
export default function RealtimeVotes({ songIds, onVoteUpdate }: Props) {
  const [connected, setConnected] = useState(false);

  const pollVotes = useCallback(async () => {
    if (songIds.length === 0) return;
    try {
      const params = songIds.map(id => `id=${id}`).join('&');
      const res = await fetch(`/api/songs?${params}&limit=${songIds.length}`);
      if (res.ok) {
        const data = await res.json();
        (data.songs ?? []).forEach((song: any) => {
          onVoteUpdate({ songId: song.id, votes: song.votes, delta: 0 });
        });
      }
    } catch (err) {
      // Silently fail on polling errors
    }
  }, [songIds, onVoteUpdate]);

  useEffect(() => {
    if (!SUPABASE_URL) {
      // Fallback: poll every 15 seconds
      const interval = setInterval(pollVotes, 15000);
      return () => clearInterval(interval);
    }

    let channel: any = null;

    async function subscribe() {
      try {
        const { createClient } = await import('../lib/supabase');
        const supabase = createClient();

        channel = supabase
          .channel('votes-realtime')
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'songs',
              filter: songIds.length > 0
                ? `id=in.(${songIds.join(',')})`
                : undefined,
            },
            (payload: any) => {
              const { new: newRow, old: oldRow } = payload;
              if (newRow && oldRow) {
                onVoteUpdate({
                  songId: newRow.id,
                  votes: newRow.votes,
                  delta: newRow.votes - (oldRow.votes ?? newRow.votes),
                });
              }
            }
          )
          .subscribe((status: string) => {
            setConnected(status === 'SUBSCRIBED');
          });
      } catch (err) {
        console.error('[RealtimeVotes] Subscription error:', err);
        // Fallback to polling
        const interval = setInterval(pollVotes, 15000);
        return () => clearInterval(interval);
      }
    }

    subscribe();
    return () => {
      if (channel) channel.unsubscribe();
    };
  }, [songIds.join(','), onVoteUpdate, pollVotes]);

  // This component renders nothing — it's a "headless" data hook component
  // The connected indicator is optional, shown as a tiny dot
  return (
    <span
      title={connected ? 'Votos en tiempo real activos' : 'Actualizando votos...'}
      className={`inline-flex items-center ${connected ? 'text-green-400' : 'text-gray-600'}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
    </span>
  );
}
