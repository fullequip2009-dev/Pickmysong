'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

type Tab = 'venues' | 'songs' | 'artists';

interface Venue {
  id: string;
  name: string;
  city?: string;
  type?: string;
  open: boolean;
  cover_url?: string;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  votes: number;
  cover_url?: string;
}

interface Artist {
  id: string;
  name: string;
  genre?: string;
  followers?: number;
  avatar_url?: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('venues');
  const [venues, setVenues] = useState<Venue[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const requestGeolocation = () => {
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoLoading(false);
        // Auto-search nearby venues
        searchNearby(pos.coords.latitude, pos.coords.longitude);
      },
      () => setGeoLoading(false)
    );
  };

  const searchNearby = async (lat: number, lng: number) => {
    setLoading(true);
    setActiveTab('venues');
    setHasSearched(true);
    try {
      const res = await fetch(`/api/venues?lat=${lat}&lng=${lng}&radius=5&open=true`);
      if (res.ok) {
        const data = await res.json();
        setVenues(data.venues || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setHasSearched(true);

    try {
      const [venueRes, songRes, artistRes] = await Promise.all([
        fetch(`/api/venues?search=${encodeURIComponent(q)}`),
        fetch(`/api/songs?search=${encodeURIComponent(q)}&limit=10`),
        fetch(`/api/artists?search=${encodeURIComponent(q)}&limit=10`),
      ]);

      if (venueRes.ok) setVenues((await venueRes.json()).venues || []);
      if (songRes.ok) setSongs((await songRes.json()).songs || []);
      if (artistRes.ok) setArtists((await artistRes.json()).artists || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) performSearch(query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query, performSearch]);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'venues', label: 'Locales', count: venues.length },
    { key: 'songs', label: 'Canciones', count: songs.length },
    { key: 'artists', label: 'Artistas', count: artists.length },
  ];

  const totalResults = venues.length + songs.length + artists.length;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero search bar */}
      <div className="bg-gradient-to-b from-purple-950/50 to-black pt-12 pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2">Buscar</h1>
          <p className="text-gray-400 text-center mb-8 text-sm">Encuentra locales, canciones y artistas</p>

          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar locales, canciones, artistas..."
              autoFocus
              className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all text-lg"
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setHasSearched(false); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Geolocation button */}
          <button
            onClick={requestGeolocation}
            disabled={geoLoading}
            className="mt-3 mx-auto flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            {geoLoading ? (
              <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            )}
            {geoLoading ? 'Buscando tu ubicación...' : 'Locales cerca de mí'}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-16">
        {!hasSearched && !loading && (
          <div className="py-16 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-gray-400">Escribe para buscar o usa tu ubicación</p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {['Jazz', 'Rock', 'Electrónica', 'Pop', 'Hip-hop', 'Reggaeton'].map(genre => (
                <button
                  key={genre}
                  onClick={() => { setQuery(genre); }}
                  className="py-2 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-gray-300 transition-colors"
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="py-16 flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">Buscando...</p>
          </div>
        )}

        {hasSearched && !loading && totalResults === 0 && (
          <div className="py-16 text-center">
            <div className="text-4xl mb-4">😕</div>
            <p className="text-gray-400">No encontramos resultados para <span className="text-white font-medium">"{query}"</span></p>
            <p className="text-gray-600 text-sm mt-2">Prueba con otro término</p>
          </div>
        )}

        {hasSearched && !loading && totalResults > 0 && (
          <>
            {/* Tabs */}
            <div className="flex gap-1 mb-6 mt-4 bg-white/5 rounded-xl p-1">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.key
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-1.5 text-xs opacity-70">({tab.count})</span>
                  )}
                </button>
              ))}
            </div>

            {/* Venues */}
            {activeTab === 'venues' && (
              <div className="space-y-3">
                {venues.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Sin resultados en locales</p>
                ) : venues.map(venue => (
                  <Link
                    key={venue.id}
                    href={`/venues/${venue.id}`}
                    className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/8 border border-white/10 hover:border-purple-500/30 rounded-xl transition-all group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-700 to-pink-700 flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                      {venue.cover_url
                        ? <img src={venue.cover_url} alt={venue.name} className="w-full h-full object-cover" />
                        : '🎵'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold group-hover:text-purple-400 transition-colors truncate">{venue.name}</p>
                      <p className="text-sm text-gray-400 truncate">{venue.city ?? 'Ubicación desconocida'}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${venue.open ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {venue.open ? 'Abierto' : 'Cerrado'}
                      </span>
                      {venue.type && <span className="text-xs text-gray-500 capitalize">{venue.type}</span>}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Songs */}
            {activeTab === 'songs' && (
              <div className="space-y-3">
                {songs.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Sin resultados en canciones</p>
                ) : songs.map((song, i) => (
                  <Link
                    key={song.id}
                    href={`/songs/${song.id}`}
                    className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/8 border border-white/10 hover:border-purple-500/30 rounded-xl transition-all group"
                  >
                    <span className="text-gray-600 w-6 text-center text-sm">{i + 1}</span>
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                      {song.cover_url
                        ? <img src={song.cover_url} alt={song.title} className="w-full h-full object-cover rounded-lg" />
                        : '🎵'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold group-hover:text-purple-400 transition-colors truncate">{song.title}</p>
                      <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-purple-400">{song.votes}</p>
                      <p className="text-xs text-gray-600">votos</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Artists */}
            {activeTab === 'artists' && (
              <div className="space-y-3">
                {artists.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Sin resultados en artistas</p>
                ) : artists.map(artist => (
                  <Link
                    key={artist.id}
                    href={`/artists`}
                    className="flex items-center gap-4 p-4 bg-white/5 hover:bg-white/8 border border-white/10 hover:border-purple-500/30 rounded-xl transition-all group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {artist.avatar_url
                        ? <img src={artist.avatar_url} alt={artist.name} className="w-full h-full object-cover" />
                        : <span className="text-xl">🎤</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold group-hover:text-purple-400 transition-colors">{artist.name}</p>
                      <p className="text-sm text-gray-400">{artist.genre ?? 'Género variado'}</p>
                    </div>
                    {artist.followers !== undefined && (
                      <div className="text-right text-xs text-gray-500">
                        <p className="font-medium text-sm text-gray-300">{artist.followers.toLocaleString()}</p>
                        <p>seguidores</p>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
