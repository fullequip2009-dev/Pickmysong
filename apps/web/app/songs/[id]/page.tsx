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

// Demo songs for fallback
const DEMO_SONGS: Song[] = [
  { id: 'song-1', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', genre: 'Pop', votes: 234, plays: 1820, duration: 200, cover_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300' },
  { id: 'song-2', title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', genre: 'Pop', votes: 198, plays: 1540, duration: 203, cover_url: 'https://images.unsplash.com/photo-1571266752821-e2ceec3e9a92?w=300' },
  { id: 'song-3', title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', album: 'F*CK LOVE 3', genre: 'Hip-Hop', votes: 187, plays: 1320, duration: 141, cover_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300' },
  { id: 'song-4', title: 'Peaches', artist: 'Justin Bieber', album: 'Justice', genre: 'R&B', votes: 156, plays: 1150, duration: 198, cover_url: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=300' },
  { id: 'song-5', title: 'Montero', artist: 'Lil Nas X', album: 'Montero', genre: 'Pop', votes: 143, plays: 980, duration: 137, cover_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300' },
];

export default function SongDetailPage() {
  const params = useParams();
  const [song, setSong] = useState<Song | null>(null);
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shareMsg, setShareMsg] = useState('');

  useEffect(() => {
    const found = DEMO_SONGS.find((s) => s.id === params.id);
    if (found) {
      setSong(found);
      setVotes(found.votes);
    }
  }, [params.id]);

  const handleVote = async () => {
    if (voted || !song) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/songs/${song.id}/vote`, { method: 'POST' });
      if (res.ok) {
        setVoted(true);
        setVotes((v) => v + 1);
      }
    } catch {
      setVoted(true);
      setVotes((v) => v + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setShareMsg('¡Enlace copiado!');
      setTimeout(() => setShareMsg(''), 2000);
    });
  };

  const formatDuration = (s?: number) => {
    if (!s) return '--:--';
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (!song) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Cargando canción...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <span>←</span> Volver
        </Link>

        <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
          <div className="relative h-64 bg-gradient-to-br from-purple-900 to-pink-900">
            {song.cover_url && (
              <img src={song.cover_url} alt={song.title} className="w-full h-full object-cover opacity-60" />
            )}
            <div className="absolute inset-0 flex items-end p-6">
              <div>
                <h1 className="text-3xl font-bold text-white">{song.title}</h1>
                <p className="text-gray-200 text-lg">{song.artist}</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">{votes}</div>
                <div className="text-gray-400 text-sm">Votos</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-pink-400">{song.plays}</div>
                <div className="text-gray-400 text-sm">Reproducciones</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">{song.genre || 'N/A'}</div>
                <div className="text-gray-400 text-sm">Género</div>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-400">{formatDuration(song.duration)}</div>
                <div className="text-gray-400 text-sm">Duración</div>
              </div>
            </div>

            {song.album && (
              <p className="text-gray-400">Álbum: <span className="text-white">{song.album}</span></p>
            )}

            <div className="flex gap-4 flex-wrap">
              <button
                onClick={handleVote}
                disabled={voted || loading}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  voted
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white cursor-pointer'
                }`}
              >
                {voted ? '✓ Votado' : loading ? 'Votando...' : '🎵 Votar'}
              </button>

              <button
                onClick={handleShare}
                className="px-6 py-3 rounded-xl font-semibold bg-gray-700 hover:bg-gray-600 text-white transition-colors"
              >
                {shareMsg || '🔗 Compartir'}
              </button>

              {song.spotify_url && (
                <a
                  href={song.spotify_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl font-semibold bg-green-600 hover:bg-green-500 text-white transition-colors"
                >
                  🎧 Escuchar en Spotify
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
