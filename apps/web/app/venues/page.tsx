'use client';

import { useState } from 'react';
import Link from 'next/link';

const VENUES = [
  { id: '1', name: 'Club Nocturno BRLND', type: 'Club', city: 'Barcelona', address: 'Carrer de la Marina, 19', vibe: 'Dark Techno / Industrial', currentSong: 'MONTAGEM CYBERPUNK', currentArtist: 'DJ KL Jay', visitors: 340, capacity: 500, rating: 4.8, tags: ['Techno', 'Dark', 'Industrial'], avatar: '\uD83C\uDF0C', color: 'from-purple-900 to-black', open: true },
  { id: '2', name: 'Terraza del Sol', type: 'Bar', city: 'Madrid', address: 'Gran V\u00eda, 45', vibe: 'R&B / Neo-soul', currentSong: 'NEON NIGHTS', currentArtist: 'Future Classic', visitors: 120, capacity: 200, rating: 4.5, tags: ['R&B', 'Chill', 'Rooftop'], avatar: '\u2600\uFE0F', color: 'from-orange-900 to-amber-900', open: true },
  { id: '3', name: "Raver's Paradise", type: 'Rave', city: 'Berlin', address: 'Revaler Str. 99', vibe: 'Rave / Hardcore', currentSong: 'RAVE DE FAVELA', currentArtist: 'MC Lan', visitors: 800, capacity: 1200, rating: 4.9, tags: ['Rave', 'Hardcore', 'Underground'], avatar: '\uD83D\uDD25', color: 'from-red-900 to-orange-900', open: true },
  { id: '4', name: 'Gold Lounge', type: 'Lounge', city: 'Miami', address: 'Ocean Drive, 1201', vibe: 'Hip-hop / Trap', currentSong: 'ASPHALT GOLD', currentArtist: 'Skepta', visitors: 90, capacity: 150, rating: 4.3, tags: ['Hip-hop', 'VIP', 'Premium'], avatar: '\uD83D\uDC8E', color: 'from-yellow-900 to-amber-800', open: false },
  { id: '5', name: 'Casa do Funk', type: 'Club', city: 'S\u00e3o Paulo', address: 'Av. Paulista, 900', vibe: 'Funk / Electronic', currentSong: 'FUNK DO FUTURO', currentArtist: 'MC Lan', visitors: 650, capacity: 800, rating: 4.7, tags: ['Funk', 'Carioca', 'Electronic'], avatar: '\uD83C\uDF03', color: 'from-green-900 to-emerald-900', open: true },
  { id: '6', name: 'Silk Garden', type: 'Rooftop', city: 'Londres', address: 'Shoreditch High St, 7', vibe: 'House / Electronic', currentSong: 'SILK ROAD', currentArtist: 'Kaytranada', visitors: 200, capacity: 250, rating: 4.6, tags: ['House', 'Rooftop', 'Sunset'], avatar: '\uD83C\uDF3F', color: 'from-teal-900 to-cyan-900', open: true },
];

const TYPES = ['Todos', 'Club', 'Bar', 'Rave', 'Lounge', 'Rooftop'];

function OccupancyBar({ current, capacity }) {
  const pct = Math.round((current / capacity) * 100);
  const color = pct > 80 ? 'bg-red-500' : pct > 50 ? 'bg-yellow-500' : 'bg-green-500';
  return (
    <div className="mt-2">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Aforo</span><span>{current}/{capacity} ({pct}%)</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/10">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function VenuesPage() {
  const [activeType, setActiveType] = useState('Todos');
  const [showOpen, setShowOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = VENUES.filter(
    (v) =>
      (activeType === 'Todos' || v.type === activeType) &&
      (!showOpen || v.open) &&
      (v.name.toLowerCase().includes(search.toLowerCase()) || v.city.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <main className="min-h-screen bg-black text-white pb-20 md:pb-0">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">\uD83C\uDFB5</span>
            <span className="font-black tracking-tighter text-white">Pick<span className="text-purple-400">my</span>song</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {[['/', 'Inicio'], ['/discover', 'Descubrir'], ['/playlists', 'Playlists'], ['/artists', 'Artistas'], ['/venues', 'Locales']].map(([href, label]) => (
              <Link key={href} href={href} className="px-3 py-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-all">{label}</Link>
            ))}
          </nav>
          <button className="rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500 transition-colors">Iniciar sesi\u00f3n</button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-white md:text-4xl">Locales</h1>
            <p className="mt-1 text-gray-400">Descubre d\u00f3nde suena la m\u00fasica que importa.</p>
          </div>
          <button className="rounded-full border border-purple-500/50 bg-purple-600/20 px-4 py-2 text-sm font-semibold text-purple-300 hover:bg-purple-600/30 transition-all">+ Registrar local</button>
        </div>

        <div className="mb-6 flex gap-3">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar local o ciudad..." className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all" />
          <button onClick={() => setShowOpen(!showOpen)} className={`rounded-xl px-4 py-3 text-sm font-medium border transition-all ${showOpen ? 'border-green-500/50 bg-green-600/20 text-green-300' : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'}`}>
            {showOpen ? '\uD83D\uDFE2 Abiertos' : 'Todos'}
          </button>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button key={t} onClick={() => setActiveType(t)} className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${activeType === t ? 'bg-purple-600 text-white' : 'border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}>{t}</button>
          ))}
        </div>

        <div className="mb-4 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
          </span>
          <span className="text-xs text-gray-500">{filtered.filter((v) => v.open).length} locales abiertos ahora</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((venue) => (
            <div key={venue.id} className="group overflow-hidden rounded-2xl border border-white/5 bg-white/3 backdrop-blur-sm transition-all duration-300 hover:border-white/10 hover:scale-[1.01]">
              <div className={`relative flex h-24 items-end bg-gradient-to-br p-4 ${venue.color}`}>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{venue.avatar}</span>
                  <div>
                    <h3 className="font-bold text-white">{venue.name}</h3>
                    <p className="text-xs text-white/60">{venue.type} \u2022 {venue.city}</p>
                  </div>
                </div>
                <div className="absolute right-3 top-3">
                  {venue.open ? (
                    <span className="rounded-full bg-green-500/20 border border-green-500/40 px-2 py-0.5 text-xs text-green-300">Abierto</span>
                  ) : (
                    <span className="rounded-full bg-red-500/20 border border-red-500/40 px-2 py-0.5 text-xs text-red-300">Cerrado</span>
                  )}
                </div>
              </div>
              <div className="p-4">
                {venue.open && (
                  <div className="mb-3 flex items-center gap-2 rounded-xl border border-purple-500/20 bg-purple-600/10 px-3 py-2">
                    <span className="animate-pulse text-purple-400">\u25B6</span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-white">{venue.currentSong}</p>
                      <p className="truncate text-xs text-gray-500">{venue.currentArtist}</p>
                    </div>
                  </div>
                )}
                <p className="mb-2 text-xs text-gray-400">{venue.address}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {venue.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 px-2 py-0.5 text-xs text-gray-500">{tag}</span>
                  ))}
                </div>
                <OccupancyBar current={venue.visitors} capacity={venue.capacity} />
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-yellow-400 text-xs">
                    {'\u2605'.repeat(Math.floor(venue.rating))}
                    <span className="text-gray-400 ml-1">{venue.rating}</span>
                  </div>
                  <button className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white hover:bg-white/10 transition-all">Ver playlist \u2192</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && <div className="py-20 text-center text-gray-600">No se encontraron locales</div>}
      </div>
    </main>
  );
}
