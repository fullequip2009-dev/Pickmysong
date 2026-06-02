'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Venue {
  id: string;
  name: string;
  type: string;
  city: string;
  address: string;
  coverImage?: string;
  isOpen?: boolean;
  activeUsers?: number;
  capacity?: number;
  rating?: number;
  genre?: string;
  description?: string;
}

const GENRE_FILTERS = ['Todos', 'Jazz', 'Electronic', 'Pop', 'Rock', 'Indie', 'Funk', 'House'];

function VenueCard({ venue }: { venue: Venue }) {
  const pct = venue.capacity ? Math.round(((venue.activeUsers || 0) / venue.capacity) * 100) : 0;
  const occupancyColor = pct > 75 ? 'bg-red-500' : pct > 40 ? 'bg-yellow-500' : 'bg-green-500';

  return (
    <Link href={'/venues/' + venue.id} className="group block">
      <div className="relative bg-gray-900/60 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-1">
        <div className="relative h-52 overflow-hidden">
          {venue.coverImage ? (
            <img src={venue.coverImage} alt={venue.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center"><span className="text-5xl">&#127925;</span></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-sm text-gray-300 border border-white/20">{venue.type}</span>
            <span className={venue.isOpen ? 'px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm bg-green-500/80 text-white' : 'px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm bg-red-500/80 text-white'}>
              {venue.isOpen ? '● ABIERTO' : '● CERRADO'}
            </span>
          </div>
          {venue.isOpen && (
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm rounded-full px-2.5 py-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-green-300 font-medium">{venue.activeUsers} online</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-white font-bold text-lg leading-tight group-hover:text-purple-300 transition-colors">{venue.name}</h3>
            {venue.rating && (
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <span className="text-yellow-400 text-sm">&#9733;</span>
                <span className="text-gray-300 text-sm font-medium">{venue.rating}</span>
              </div>
            )}
          </div>
          <p className="text-gray-500 text-sm mb-1">&#128205; {venue.address}, {venue.city}</p>
          {venue.genre && (
            <span className="inline-block mt-1 mb-3 px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300">{venue.genre}</span>
          )}
          {venue.description && (
            <p className="text-gray-400 text-sm line-clamp-2 mb-3">{venue.description}</p>
          )}
          {venue.isOpen && venue.capacity && (
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1"><span>Ocupación</span><span>{pct}%</span></div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className={'h-full rounded-full transition-all ' + occupancyColor} style={{ width: pct + '%' }} />
              </div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{venue.isOpen ? 'Votaciones activas' : 'Próximamente'}</span>
            <span className="text-xs font-semibold text-purple-400 group-hover:text-purple-300">Entrar &#8594;</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState('Todos');
  const [search, setSearch] = useState('');
  const [showOpenOnly, setShowOpenOnly] = useState(false);

  useEffect(() => {
    fetch('/api/venues')
      .then(r => r.json())
      .then(data => {
        setVenues(Array.isArray(data) ? data : (data.venues || []));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = venues.filter(v => {
    if (showOpenOnly && !v.isOpen) return false;
    if (activeGenre !== 'Todos' && v.genre !== activeGenre) return false;
    if (search && !v.name.toLowerCase().includes(search.toLowerCase()) && !v.city.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openCount = venues.filter(v => v.isOpen).length;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative overflow-hidden bg-gradient-to-b from-purple-950/40 to-black pt-24 pb-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -top-10 right-10 w-60 h-60 bg-pink-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm font-medium">{openCount} locales abiertos ahora</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            Descubre{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">locales</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl">Entra, vota tus canciones favoritas y vive la experiencia musical en directo.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">&#128269;</span>
            <input type="text" placeholder="Buscar local o ciudad..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-900/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors" />
          </div>
          <button onClick={() => setShowOpenOnly(!showOpenOnly)} className={showOpenOnly ? 'flex items-center gap-2 px-4 py-3 rounded-xl border font-medium text-sm transition-all bg-green-500/20 border-green-500/50 text-green-300' : 'flex items-center gap-2 px-4 py-3 rounded-xl border font-medium text-sm transition-all bg-gray-900/80 border-white/10 text-gray-400 hover:border-white/30'}>
            <span className={showOpenOnly ? 'w-2 h-2 rounded-full bg-green-400 animate-pulse' : 'w-2 h-2 rounded-full bg-gray-600'} />
            Solo abiertos
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {GENRE_FILTERS.map(g => (
            <button key={g} onClick={() => setActiveGenre(g)} className={activeGenre === g ? 'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all bg-gray-900/80 border border-white/10 text-gray-400 hover:border-purple-500/50 hover:text-purple-300'}>{g}</button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">{loading ? 'Cargando...' : filtered.length + ' locales encontrados'}</p>
          <Link href="/search" className="text-purple-400 text-sm hover:text-purple-300 transition-colors">B&#250;squeda avanzada &#8594;</Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-900/60 rounded-2xl overflow-hidden animate-pulse">
                <div className="h-52 bg-gray-800" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-800 rounded w-3/4" />
                  <div className="h-4 bg-gray-800 rounded w-1/2" />
                  <div className="h-3 bg-gray-800 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-6xl mb-4">&#127925;</p>
            <p className="text-gray-400 text-lg mb-2">No hay locales que coincidan</p>
            <p className="text-gray-600 text-sm">Prueba cambiando los filtros</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(v => <VenueCard key={v.id} venue={v} />)}
          </div>
        )}

        <div className="mt-16 rounded-2xl bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/20 p-8 text-center">
          <p className="text-2xl font-bold mb-2">&#127908; &#191;Tienes un local?</p>
          <p className="text-gray-400 mb-6">&#218;nete a Pickmysong y deja que tu p&#250;blico elija la m&#250;sica.</p>
          <Link href="/pricing" className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-white hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/30">Ver planes &#8594;</Link>
        </div>
      </div>
    </div>
  );
}
