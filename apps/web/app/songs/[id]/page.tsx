'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { songs, artists } from '@/lib/db';
import type { Song } from '@/lib/types';

export default function SongDetailPage() {
  const params = useParams();
  const [song, setSong] = useState<Song | null>(null);
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState(0);
  const [loading, setLoading] = useState(false);
  const [shareMsg, setShareMsg] = useState('');

  useEffect(() => {
    const found = songs.find((s) => s.id === params.id);
    if (found) {
      setSong(found);
      setVotes(found.votes);
    }
  }, [params.id]);

  const handleVote = async () => {
    if (!song) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/songs/${song.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'guest-user' }),
      });
      if (res.ok) {
        const data = await res.json();
        setVotes(data.votes);
        setVoted(data.userVoted);
      }
    } catch {
      setVoted(!voted);
      setVotes((v) => voted ? v - 1 : v + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({ title: song?.title, text: `Escucha ${song?.title} en Pickmysong`, url: window.location.href });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      setShareMsg('¡Link copiado!');
      setTimeout(() => setShareMsg(''), 2000);
    }
  };

  if (!song) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎵</div>
          <p className="text-gray-400">Canción no encontrada</p>
          <Link href="/discover" className="mt-4 inline-block text-purple-400 hover:underline">
            ← Volver a Discover
          </Link>
        </div>
      </main>
    );
  }

  const relatedSongs = songs.filter((s) => s.genre === song.genre && s.id !== song.id).slice(0, 3);
  const artist = artists.find((a) => a.name === song.artist || song.artist.includes(a.name.split(' ')[0]));

  return (
    <main className="min-h-screen bg-black pb-24 md:pb-0">
      {/* Hero */}
      <div className={`relative h-72 bg-gradient-to-br ${song.color} overflow-hidden`}>
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <div className="max-w-4xl mx-auto flex items-end gap-6">
            {/* Cover */}
            <div className={`w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-gradient-to-br ${song.color} flex items-center justify-center text-5xl md:text-6xl shadow-2xl border-4 border-white/10 flex-shrink-0`}>
              {song.cover}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Canción</span>
                {song.trend > 5 && (
                  <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30">
                    🔥 Trending
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none mb-1">{song.title}</h1>
              <p className="text-white/70 text-lg">{song.artist}</p>
              <div className="flex items-center gap-3 mt-2 text-sm text-white/50">
                <span>{song.genre}</span>
                <span>·</span>
                <span>{song.bpm} BPM</span>
                <span>·</span>
                <span>{song.plays.toLocaleString()} plays</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Actions */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          {/* Vote */}
          <button
            onClick={handleVote}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg ${
              voted
                ? 'bg-purple-600 text-white shadow-purple-500/25'
                : 'bg-white/10 hover:bg-white/20 border border-white/10 text-white'
            } disabled:opacity-50`}
          >
            <span className="text-lg">{voted ? '💜' : '🤍'}</span>
            <span>{votes.toLocaleString()} votos</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-semibold rounded-xl transition-all"
          >
            <span>🔗</span>
            <span>{shareMsg || 'Compartir'}</span>
          </button>

          {/* Add to playlist */}
          <button className="flex items-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-semibold rounded-xl transition-all">
            <span>➕</span>
            <span>Playlist</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="md:col-span-2 space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Votos', value: votes.toLocaleString(), icon: '🗳️', color: 'text-purple-400' },
                { label: 'Reproducciones', value: (song.plays / 1000).toFixed(1) + 'K', icon: '▶️', color: 'text-blue-400' },
                { label: 'Tendencia', value: '+' + song.trend + '%', icon: '📈', color: 'text-green-400' },
              ].map((s) => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                  <div className="text-gray-500 text-xs">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Player placeholder */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <span>🎧</span> Reproductor
              </h3>
              <div className="relative bg-black/40 rounded-xl h-16 flex items-center gap-4 px-4">
                <button className={`w-10 h-10 rounded-full bg-gradient-to-br ${song.color} flex items-center justify-center text-white text-lg shadow-lg flex-shrink-0`}>
                  ▶
                </button>
                {/* Waveform placeholder */}
                <div className="flex-1 flex items-center gap-0.5 h-8 overflow-hidden">
                  {Array.from({length: 40}).map((_, i) => (
                    <div
                      key={i}
                      className={`bg-purple-500/40 rounded-full w-1 flex-shrink-0`}
                      style={{height: Math.random() * 100 + '%'}}
                    />
                  ))}
                </div>
                <span className="text-gray-500 text-xs flex-shrink-0">3:24</span>
              </div>
              <p className="text-gray-600 text-xs mt-3 text-center">Integración con Spotify / SoundCloud próximamente</p>
            </div>

            {/* Related Songs */}
            {relatedSongs.length > 0 && (
              <div>
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                  <span>🎵</span> Canciones relacionadas
                </h3>
                <div className="space-y-2">
                  {relatedSongs.map((rs, i) => (
                    <Link key={rs.id} href={`/songs/${rs.id}`} className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-3 transition-all">
                      <span className="text-gray-600 text-sm w-4">{i + 1}</span>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${rs.color} flex items-center justify-center text-xl flex-shrink-0`}>{rs.cover}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold text-sm truncate">{rs.title}</div>
                        <div className="text-gray-500 text-xs">{rs.artist}</div>
                      </div>
                      <div className="text-purple-400 text-sm font-bold">{rs.votes.toLocaleString()}</div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Artist card */}
            {artist && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4">Artista</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${artist.color} flex items-center justify-center text-3xl flex-shrink-0`}>{artist.avatar}</div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-white font-bold">{artist.name}</span>
                      {artist.verified && <span className="text-blue-400 text-xs">✓</span>}
                    </div>
                    <div className="text-gray-500 text-xs">{artist.genre}</div>
                  </div>
                </div>
                <p className="text-gray-400 text-xs mb-4">{artist.bio}</p>
                <div className="grid grid-cols-2 gap-2 text-center mb-4">
                  <div>
                    <div className="text-white font-bold">{(artist.followers / 1000).toFixed(1)}K</div>
                    <div className="text-gray-500 text-xs">Seguidores</div>
                  </div>
                  <div>
                    <div className="text-white font-bold">{artist.songs}</div>
                    <div className="text-gray-500 text-xs">Canciones</div>
                  </div>
                </div>
                <Link href={`/artists`} className="block w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl text-center transition-all">
                  Ver perfil
                </Link>
              </div>
            )}

            {/* Tags */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-3">Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Género</span>
                  <span className="text-white font-semibold">{song.genre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">BPM</span>
                  <span className="text-white font-semibold">{song.bpm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tendencia</span>
                  <span className="text-green-400 font-semibold">+{song.trend}%</span>
                </div>
              </div>
            </div>

            {/* Back link */}
            <Link href="/discover" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
              ← Volver a Discover
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
