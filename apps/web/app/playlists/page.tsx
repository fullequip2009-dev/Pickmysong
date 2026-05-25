'use client';

import { useState } from 'react';
import Link from 'next/link';

const PLAYLISTS = [
  { id: '1', name: 'Noches de Neón', description: 'Para cuando la ciudad no duerme', songs: 24, likes: 847, cover: '\uD83C\uDF19', color: 'from-blue-900 to-purple-900', tags: ['Electronic', 'Ambient'] },
  { id: '2', name: 'Trap Moda', description: 'Los beats que visten mejor', songs: 18, likes: 623, cover: '\uD83D\uDC8E', color: 'from-gray-900 to-zinc-800', tags: ['Trap', 'Hip-hop'] },
  { id: '3', name: 'Funk do Futuro', description: 'El funk que viene del ma\u00f1ana', songs: 31, likes: 1240, cover: '\uD83D\uDD25', color: 'from-orange-900 to-red-900', tags: ['Funk', 'Electronic'] },
  { id: '4', name: 'Soul & Seda', description: 'Suavidad con actitud', songs: 15, likes: 512, cover: '\uD83C\uDF38', color: 'from-pink-900 to-rose-900', tags: ['R&B', 'Soul'] },
  { id: '5', name: 'Concreto y Oro', description: 'Del asfalto al podio', songs: 22, likes: 934, cover: '\uD83C\uDFC6', color: 'from-yellow-900 to-amber-900', tags: ['Grime', 'Trap'] },
  { id: '6', name: 'Verde Selva', description: 'Naturaleza y ritmo', songs: 19, likes: 421, cover: '\uD83C\uDF3F', color: 'from-emerald-900 to-green-900', tags: ['Afrobeat', 'World'] },
];

export default function PlaylistsPage() {
  const [liked, setLiked] = useState(new Set());

  const toggleLike = (id) => {
    setLiked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-black text-white pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">\uD83C\uDFB5</span>
            <span className="font-black tracking-tighter text-white">Pick<span className="text-purple-400">my</span>song</span>
          </Link>
          <button className="rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500 transition-colors">
            Iniciar sesi\u00f3n
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Page header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white md:text-4xl">Playlists</h1>
            <p className="mt-1 text-gray-400">Curadas por la comunidad. Escogidas por el estilo.</p>
          </div>
          <button className="rounded-full border border-purple-500/50 bg-purple-600/20 px-4 py-2 text-sm font-semibold text-purple-300 hover:bg-purple-600/30 transition-all">
            + Crear playlist
          </button>
        </div>

        {/* Stats bar */}
        <div className="mb-8 flex gap-6 rounded-2xl border border-white/5 bg-white/3 p-4">
          {[
            { label: 'Playlists', value: '128' },
            { label: 'Canciones', value: '2.4K' },
            { label: 'Oyentes', value: '18K' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-xl font-black text-white">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PLAYLISTS.map((playlist) => (
            <div
              key={playlist.id}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/3 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:scale-[1.02]"
            >
              {/* Cover */}
              <div className={`flex h-40 items-center justify-center bg-gradient-to-br text-6xl ${playlist.color}`}>
                {playlist.cover}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white">{playlist.name}</h3>
                    <p className="mt-0.5 text-xs text-gray-400">{playlist.description}</p>
                  </div>
                  <button
                    onClick={() => toggleLike(playlist.id)}
                    className="shrink-0 text-xl transition-transform hover:scale-110"
                  >
                    {liked.has(playlist.id) ? '\uD83D\uDC9C' : '\uD83E\uDD0D'}
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {playlist.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-gray-500">{tag}</span>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>{playlist.songs} canciones</span>
                  <span>{(liked.has(playlist.id) ? playlist.likes + 1 : playlist.likes).toLocaleString()} me gusta</span>
                </div>

                <Link
                  href={`/playlists/${playlist.id}`}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 py-2 text-sm font-medium text-white hover:bg-white/10 transition-all border border-white/5"
                >
                  <span>\uD83C\uDFB5</span> Escuchar
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
