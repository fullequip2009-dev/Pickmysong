'use client';

import { useState } from 'react';
import Link from 'next/link';

const SONGS = [
  { id: '1', title: 'MONTAGEM CYBERPUNK', artist: 'DJ KL Jay', genre: 'Funk / Electronic', votes: 2847, trend: '+12%', bpm: 138, cover: '\uD83C\uDFB5', color: 'from-purple-600 to-pink-600' },
  { id: '2', title: 'RAVE DE FAVELA', artist: 'MC Lan & Diplo', genre: 'Funk / Rave', votes: 2341, trend: '+8%', bpm: 150, cover: '\uD83D\uDD25', color: 'from-orange-600 to-red-600' },
  { id: '3', title: 'NEON NIGHTS', artist: 'Future Classic', genre: 'R&B / Neo-soul', votes: 1987, trend: '+5%', bpm: 94, cover: '\uD83C\uDF19', color: 'from-blue-600 to-cyan-500' },
  { id: '4', title: 'ASPHALT GOLD', artist: 'Skepta feat. Young Thug', genre: 'Grime / Trap', votes: 1654, trend: '+3%', bpm: 140, cover: '\uD83D\uDC51', color: 'from-yellow-500 to-amber-600' },
  { id: '5', title: 'MADRUGADA', artist: 'Cleo & Biel', genre: 'Brazilian Pop', votes: 1432, trend: '+2%', bpm: 110, cover: '\uD83C\uDF03', color: 'from-indigo-600 to-purple-500' },
  { id: '6', title: 'SILK ROAD', artist: 'Kaytranada', genre: 'Electronic / House', votes: 1201, trend: '+1%', bpm: 122, cover: '\uD83C\uDFB6', color: 'from-emerald-600 to-teal-500' },
];

const GENRES = ['Todos', 'Funk', 'Trap', 'R&B', 'Electronic', 'Pop', 'Grime'];

export default function DiscoverPage() {
  const [votes, setVotes] = useState(new Set());
  const [activeGenre, setActiveGenre] = useState('Todos');
  const [search, setSearch] = useState('');
  const [songs, setSongs] = useState(SONGS);

  const handleVote = (id) => {
    const hasVote = votes.has(id);
    setVotes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
    setSongs((prev) =>
      prev.map((s) => s.id === id ? { ...s, votes: hasVote ? s.votes - 1 : s.votes + 1 } : s)
    );
  };

  const filtered = songs
    .filter((s) => (activeGenre === 'Todos' || s.genre.includes(activeGenre)) && (s.title.toLowerCase().includes(search.toLowerCase()) || s.artist.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => b.votes - a.votes);

  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">\uD83C\uDFB5</span>
            <span className="font-black tracking-tighter text-white">Pick<span className="text-purple-400">my</span>song</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-500 sm:block">{votes.size} votos emitidos</span>
            <button className="rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500 transition-colors">Iniciar sesi\u00f3n</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-1 text-3xl font-black tracking-tighter text-white md:text-4xl">Descubre</h1>
          <p className="text-gray-400">Las canciones que est\u00e1n definiendo el momento. Vota las tuyas.</p>
        </div>

        <div className="mb-6 flex gap-3">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar canci\u00f3n o artista..." className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-600 outline-none transition-all focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50" />
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {GENRES.map((genre) => (
            <button key={genre} onClick={() => setActiveGenre(genre)} className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${activeGenre === genre ? 'bg-purple-600 text-white' : 'border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}>{genre}</button>
          ))}
        </div>

        <div className="mb-4 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
          </span>
          <span className="text-xs text-gray-500">En vivo \u2014 {filtered.length} canciones</span>
        </div>

        <div className="flex flex-col gap-3">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-600">No se encontraron canciones</div>
          ) : (
            filtered.map((song, i) => (
              <div key={song.id} className="group relative flex items-center gap-4 rounded-2xl border border-white/5 bg-white/3 p-4 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:bg-white/5">
                <span className="w-6 shrink-0 text-center text-sm font-bold text-gray-600">{i + 1}</span>
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-2xl ${song.color}`}>{song.cover}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">{song.title}</p>
                  <p className="truncate text-sm text-gray-400">{song.artist}</p>
                  <span className="mt-1 inline-block rounded-full border border-white/10 px-2 py-0.5 text-xs text-gray-500">{song.genre}</span>
                </div>
                <div className="hidden shrink-0 text-center sm:block">
                  <p className="text-xs text-gray-600">BPM</p>
                  <p className="text-sm font-semibold text-gray-400">{song.bpm}</p>
                </div>
                <div className="hidden shrink-0 text-center md:block">
                  <p className="text-xs text-gray-600">Trend</p>
                  <p className="text-sm font-semibold text-green-400">{song.trend}</p>
                </div>
                <button onClick={() => handleVote(song.id)} className={`shrink-0 flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-sm font-bold transition-all duration-200 ${votes.has(song.id) ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50' : 'border border-white/10 bg-white/5 text-white hover:border-purple-500/50 hover:bg-purple-600/20 hover:text-purple-300'}`}>
                  <span className="text-lg leading-none">{votes.has(song.id) ? '\uD83D\uDC9C' : '\uD83E\uDD0D'}</span>
                  <span>{song.votes.toLocaleString()}</span>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
