// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  votes: number;
  plays: number;
  duration?: number;
  cover_url?: string;
  spotify_url?: string;
  venueId?: string;
  playlistId?: string;
}

const DEMO_SONGS: Song[] = [
  { id: 'song-1', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', genre: 'Pop', votes: 1250, plays: 5420, duration: 200 },
  { id: 'song-2', title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', genre: 'Pop', votes: 980, plays: 4210, duration: 203 },
  { id: 'song-3', title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', album: 'F*CK LOVE', genre: 'Pop', votes: 870, plays: 3980, duration: 141 },
  { id: 'song-4', title: 'Peaches', artist: 'Justin Bieber', album: 'Justice', genre: 'R&B', votes: 760, plays: 3650, duration: 198 },
  { id: 'song-5', title: 'Montero', artist: 'Lil Nas X', album: 'Montero', genre: 'Pop', votes: 720, plays: 3420, duration: 137 },
];

export default function SongPage() {
  const params = useParams();
  const id = params?.id as string;
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchSong(id);
  }, [id]);

  async function fetchSong(songId: string) {
    setLoading(true);
    try {
      const res = await fetch('/api/songs/' + songId);
      if (res.ok) {
        const data = await res.json();
        setSong(data.song);
      } else {
        // Fallback to demo data
        const demo = DEMO_SONGS.find(s => s.id === songId);
        setSong(demo || null);
      }
    } catch {
      const demo = DEMO_SONGS.find(s => s.id === songId);
      setSong(demo || null);
    } finally {
      setLoading(false);
    }
  }

  async function handleVote() {
    if (voted || !song) return;
    try {
      await fetch('/api/songs/' + song.id + '/vote', { method: 'POST' });
      setSong({ ...song, votes: song.votes + 1 });
      setVoted(true);
    } catch {
      setSong({ ...song, votes: song.votes + 1 });
      setVoted(true);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading song...</div>
      </div>
    );
  }

  if (!song) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-2xl mb-4">Song not found</h1>
          <Link href="/songs" className="text-purple-400 hover:text-purple-300">Browse Songs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link href="/songs" className="text-purple-400 hover:text-purple-300 mb-8 inline-block">
          &larr; Back to Songs
        </Link>
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <div className="flex items-start gap-8">
            <div className="w-48 h-48 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center text-6xl flex-shrink-0">
              {song.cover_url ? (
                <img src={song.cover_url} alt={song.title} className="w-full h-full object-cover rounded-xl" />
              ) : '🎵'}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{song.title}</h1>
              <p className="text-xl text-purple-400 mb-1">{song.artist}</p>
              {song.album && <p className="text-gray-400 mb-1">{song.album}</p>}
              {song.genre && <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">{song.genre}</span>}
              <div className="flex gap-6 mt-6 text-gray-400">
                <span>🏵 {song.votes.toLocaleString()} votes</span>
                <span>🎶 {song.plays.toLocaleString()} plays</span>
              </div>
              <button
                onClick={handleVote}
                disabled={voted}
                className={`mt-6 px-8 py-3 rounded-full font-semibold transition-all ${
                  voted
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white'
                }`}
              >
                {voted ? '✓ Voted!' : 'Vote for this song'}
              </button>
            </div>
              {song.spotifyId && (
                <div className="mt-8">
                  <iframe
                    title="Spotify player"
                    src={`https://open.spotify.com/embed/track/${song.spotifyId}`}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    style={{ borderRadius: 12 }}
                  />
                </div>
              )}
              {!song.spotifyId && song.previewUrl && (
                <audio controls src={song.previewUrl} className="mt-8 w-full" />
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
