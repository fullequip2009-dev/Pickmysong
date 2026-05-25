'use client';

import { useState } from 'react';
import Link from 'next/link';

const ARTISTS = [
  {
    id: '1',
    name: 'DJ KL Jay',
    handle: '@djkljay',
    bio: 'Pionero del funk electr\u00f3nico. S\u00e3o Paulo, Brasil.',
    genre: 'Funk / Electronic',
    followers: 48200,
    songs: 34,
    plays: 1240000,
    avatar: '\uD83C\uDFB5',
    color: 'from-purple-600 to-pink-600',
    trending: true,
    verified: true,
  },
  {
    id: '2',
    name: 'Future Classic',
    handle: '@futureclassic',
    bio: 'R&B con alma de neo-soul y ciudad de noche.',
    genre: 'R&B / Neo-soul',
    followers: 31500,
    songs: 22,
    plays: 890000,
    avatar: '\uD83C\uDF19',
    color: 'from-blue-600 to-cyan-500',
    trending: false,
    verified: true,
  },
  {
    id: '3',
    name: 'Kaytranada',
    handle: '@kaytranada',
    bio: 'Montreal en el dancefloor. House con sabor propio.',
    genre: 'Electronic / House',
    followers: 95100,
    songs: 67,
    plays: 4100000,
    avatar: '\uD83C\uDFB6',
    color: 'from-emerald-600 to-teal-500',
    trending: true,
    verified: true,
  },
  {
    id: '4',
    name: 'MC Lan',
    handle: '@mclan',
    bio: 'Funk carioca al mundo. Voz del asfalto.',
    genre: 'Funk / Rave',
    followers: 72300,
    songs: 89,
    plays: 6700000,
    avatar: '\uD83D\uDD25',
    color: 'from-orange-600 to-red-600',
    trending: true,
    verified: false,
  },
  {
    id: '5',
    name: 'Cleo',
    handle: '@cleomusicofficial',
    bio: 'Pop con raz\u00f3n y fuerza. Voz de su generaci\u00f3n.',
    genre: 'Brazilian Pop',
    followers: 29800,
    songs: 18,
    plays: 540000,
    avatar: '\uD83C\uDF03',
    color: 'from-indigo-600 to-purple-500',
    trending: false,
    verified: false,
  },
  {
    id: '6',
    name: 'Skepta',
    handle: '@skepta',
    bio: 'El grime no tiene l\u00edmites. North London forever.',
    genre: 'Grime / Trap',
    followers: 183000,
    songs: 112,
    plays: 12400000,
    avatar: '\uD83D\uDC51',
    color: 'from-yellow-500 to-amber-600',
    trending: false,
    verified: true,
  },
];

const GENRES = ['Todos', 'Funk', 'R&B', 'Electronic', 'Pop', 'Grime', 'Trap'];

function fmtNum(n: number) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K';
  return String(n);
}

export default function ArtistsPage() {
  const [followed, setFollowed] = useState<Set<string>>(new Set());
  const [activeGenre, setActiveGenre] = useState('Todos');
  const [search, setSearch] = useState('');

  const toggleFollow = (id: string) => {
    setFollowed((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = ARTISTS.filter(
    (a) =>
      (activeGenre === 'Todos' || a.genre.includes(activeGenre)) &&
      (a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.handle.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <main className="min-h-screen bg-black text-white pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">\uD83C\uDFB5</span>
            <span className="font-black tracking-tighter text-white">
              Pick<span className="text-purple-400">my</span>song
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {[['/', 'Inicio'], ['/discover', 'Descubrir'], ['/playlists', 'Playlists'], ['/artists', 'Artistas'], ['/venues', 'Locales']].map(([href, label]) => (
              <Link key={href} href={href} className="px-3 py-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all">{label}</Link>
            ))}
          </nav>
          <button className="rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500 transition-colors">
            Iniciar sesi\u00f3n
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tighter text-white md:text-4xl">Artistas</h1>
          <p className="mt-1 text-gray-400">Los creadores que definen el sonido. Sigue a tus favoritos.</p>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar artista..."
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
          />
        </div>

        {/* Genre filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setActiveGenre(genre)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                activeGenre === genre
                  ? 'bg-purple-600 text-white'
                  : 'border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Trending banner */}
        <div className="mb-6 flex items-center gap-2">
          <span className="text-sm font-semibold text-purple-400">\uD83D\uDD25 En tendencia ahora</span>
          <div className="flex gap-2">
            {ARTISTS.filter((a) => a.trending).map((a) => (
              <span key={a.id} className="rounded-full border border-purple-500/30 bg-purple-600/10 px-3 py-0.5 text-xs text-purple-300">
                {a.name}
              </span>
            ))}
          </div>
        </div>

        {/* Artists grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((artist) => (
            <div
              key={artist.id}
              className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/3 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:scale-[1.01]"
            >
              {/* Top gradient banner */}
              <div className={`h-20 bg-gradient-to-br ${artist.color} relative`}>
                {artist.trending && (
                  <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-0.5 text-xs font-bold text-white backdrop-blur-sm">
                    \uD83D\uDD25 Trending
                  </span>
                )}
              </div>

              {/* Avatar */}
              <div className="relative px-4 pb-4">
                <div className={`-mt-8 flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-black bg-gradient-to-br text-3xl ${artist.color}`}>
                  {artist.avatar}
                </div>

                {/* Name row */}
                <div className="mt-2 flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-white">{artist.name}</h3>
                      {artist.verified && (
                        <span className="text-purple-400 text-sm" title="Verificado">\u2713</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{artist.handle}</p>
                  </div>
                  <button
                    onClick={() => toggleFollow(artist.id)}
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                      followed.has(artist.id)
                        ? 'bg-white/10 text-gray-300 border border-white/10'
                        : 'bg-purple-600 text-white hover:bg-purple-500'
                    }`}
                  >
                    {followed.has(artist.id) ? 'Siguiendo' : 'Seguir'}
                  </button>
                </div>

                <p className="mt-2 text-xs text-gray-400">{artist.bio}</p>

                <span className="mt-2 inline-block rounded-full border border-white/10 px-2 py-0.5 text-xs text-gray-500">
                  {artist.genre}
                </span>

                {/* Stats */}
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 border-t border-white/5 pt-3">
                  <div>
                    <span className="font-bold text-white">{fmtNum(followed.has(artist.id) ? artist.followers + 1 : artist.followers)}</span> seguidores
                  </div>
                  <div>
                    <span className="font-bold text-white">{artist.songs}</span> canciones
                  </div>
                  <div>
                    <span className="font-bold text-white">{fmtNum(artist.plays)}</span> plays
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center text-gray-600">No se encontraron artistas</div>
        )}
      </div>
    </main>
  );
}
