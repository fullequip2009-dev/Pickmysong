'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Song {
  id: string;
  title: string;
  artist: string;
  genre?: string;
  votes: number;
  coverUrl?: string;
  bpm?: number;
  venueId?: string;
  venueName?: string;
}

interface Venue {
  id: string;
  name: string;
  isOpen?: boolean;
  activeUsers?: number;
  genre?: string;
  coverImage?: string;
  type?: string;
}

interface Artist {
  id: string;
  name: string;
  genre?: string;
  followers?: number;
  imageUrl?: string;
  verified?: boolean;
}

const GENRES = ['Todos', 'Jazz', 'Electronic', 'Pop', 'Rock', 'Indie', 'Funk', 'House'];

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="text-2xl">&#128081;</span>;
  if (rank === 2) return <span className="text-xl text-gray-300">&#129352;</span>;
  if (rank === 3) return <span className="text-xl text-amber-600">&#129353;</span>;
  return <span className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 text-sm font-bold">{rank}</span>;
}

export default function DiscoverPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState('Todos');
  const [search, setSearch] = useState('');
  const [voted, setVoted] = useState<Set<string>>(new Set());
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState<'songs' | 'venues' | 'artists'>('songs');

  useEffect(() => {
    Promise.all([
      fetch('/api/songs').then(r => r.json()).catch(() => []),
      fetch('/api/venues').then(r => r.json()).catch(() => []),
      fetch('/api/artists').then(r => r.json()).catch(() => [])
    ]).then(([s, v, a]) => {
      setSongs(Array.isArray(s) ? s : (s.songs || []));
      setVenues(Array.isArray(v) ? v : (v.venues || []));
      setArtists(Array.isArray(a) ? a : (a.artists || []));
      setLoading(false);
    });
  }, []);

  const handleVote = (songId: string) => {
    if (voted.has(songId)) return;
    setVoted(prev => new Set([...prev, songId]));
    setVoteCounts(prev => ({ ...prev, [songId]: (prev[songId] || 0) + 1 }));
  };

  const filteredSongs = songs
    .filter(s => {
      if (activeGenre !== 'Todos' && s.genre !== activeGenre) return false;
      if (search && !s.title.toLowerCase().includes(search.toLowerCase()) && !s.artist.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => ((b.votes + (voteCounts[b.id] || 0)) - (a.votes + (voteCounts[a.id] || 0))))
    .slice(0, 20);

  const openVenues = venues.filter(v => v.isOpen);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-b from-purple-950/40 to-black pt-24 pb-10">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-pink-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-3">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Descubre</span>{' '}
            lo que suena
          </h1>
          <p className="text-gray-400 text-lg mb-6">Canciones en tiempo real, locales activos y artistas trending</p>
          <div className="relative max-w-md mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">&#128269;</span>
            <input
              type="text"
              placeholder="Buscar canci&#243;n, artista..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-gray-900/80 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Live venues horizontal scroll */}
      {openVenues.length > 0 && (
        <div className="border-y border-white/5 bg-gray-950/50 py-4">
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs font-semibold uppercase tracking-wide">Locales abiertos ahora</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {openVenues.map(v => (
                <Link key={v.id} href={'/venues/' + v.id} className="flex-shrink-0 flex items-center gap-2.5 bg-gray-900/80 border border-white/10 hover:border-purple-500/50 rounded-xl px-3 py-2 transition-all group">
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                    {v.coverImage ? (
                      <img src={v.coverImage} alt={v.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-800 to-pink-800 flex items-center justify-center text-xs">🎵;</div>
                    )}
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold group-hover:text-purple-300 transition-colors whitespace-nowrap">{v.name}</p>
                    <p className="text-green-400 text-xs">{v.activeUsers} online</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-900/60 border border-white/10 rounded-xl p-1 w-fit">
          {(['songs', 'venues', 'artists'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? 'px-5 py-2 rounded-lg text-sm font-semibold bg-purple-600 text-white transition-all' : 'px-5 py-2 rounded-lg text-sm font-semibold text-gray-400 hover:text-white transition-all'}
            >
              {tab === 'songs' ? '🎵; Canciones' : tab === 'venues' ? '🏫 Locales' : '🎤 Artistas'}
            </button>
          ))}
        </div>

        {/* Genre filter - only for songs */}
        {activeTab === 'songs' && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {GENRES.map(g => (
              <button
                key={g}
                onClick={() => setActiveGenre(g)}
                className={activeGenre === g ? 'flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium bg-gray-900/80 border border-white/10 text-gray-400 hover:border-purple-500/50 hover:text-purple-300'}
              >{g}</button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-gray-900/40 rounded-xl animate-pulse">
                <div className="w-7 h-7 bg-gray-800 rounded-full" />
                <div className="w-12 h-12 bg-gray-800 rounded-lg" />
                <div className="flex-1 space-y-2"><div className="h-4 bg-gray-800 rounded w-2/3" /><div className="h-3 bg-gray-800 rounded w-1/3" /></div>
              </div>
            ))}
          </div>
        ) : activeTab === 'songs' ? (
          <div className="space-y-2">
            {filteredSongs.length === 0 ? (
              <div className="text-center py-20 text-gray-500">No hay canciones que coincidan</div>
            ) : filteredSongs.map((song, idx) => {
              const currentVotes = song.votes + (voteCounts[song.id] || 0);
              const hasVoted = voted.has(song.id);
              return (
                <div key={song.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all group ${idx === 0 ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/20 border-purple-500/30' : 'bg-gray-900/40 border-white/5 hover:border-white/15 hover:bg-gray-900/60'}`}>
                  <div className="w-7 flex items-center justify-center flex-shrink-0">
                    <RankBadge rank={idx + 1} />
                  </div>
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-800 to-pink-800">
                    {song.coverUrl && <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">{song.title}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-gray-400 text-sm">{song.artist}</span>
                      {song.genre && <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full">{song.genre}</span>}
                      {song.venueName && <span className="text-xs text-gray-600">@ {song.venueName}</span>}
                    </div>
                  </div>
                  {song.bpm && <span className="hidden md:block text-xs text-gray-600 flex-shrink-0">{song.bpm} BPM</span>}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-gray-300 font-bold text-sm">{currentVotes.toLocaleString()}</span>
                    <button
                      onClick={() => handleVote(song.id)}
                      disabled={hasVoted}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${hasVoted ? 'bg-purple-600/30 text-purple-400 cursor-default' : 'bg-purple-600 hover:bg-purple-500 text-white active:scale-95'}`}
                    >
                      {hasVoted ? '&#10003;' : '▲'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : activeTab === 'venues' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {venues.map(v => (
              <Link key={v.id} href={'/venues/' + v.id} className="group flex items-center gap-4 p-4 bg-gray-900/40 border border-white/5 hover:border-purple-500/40 rounded-xl transition-all">
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  {v.coverImage ? (
                    <img src={v.coverImage} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center text-2xl">🎵;</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold group-hover:text-purple-300 transition-colors">{v.name}</p>
                  <p className="text-gray-500 text-sm">{v.type}</p>
                  {v.genre && <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full">{v.genre}</span>}
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={v.isOpen ? 'text-xs font-semibold text-green-400' : 'text-xs font-semibold text-gray-600'}>{v.isOpen ? '● ABIERTO' : '● CERRADO'}</span>
                  {v.isOpen && <span className="text-xs text-gray-500">{v.activeUsers} online</span>}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {artists.map(a => (
              <div key={a.id} className="group bg-gray-900/40 border border-white/5 hover:border-purple-500/40 rounded-xl p-4 text-center transition-all">
                <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden bg-gradient-to-br from-purple-800 to-pink-800">
                  {a.imageUrl && <img src={a.imageUrl} alt={a.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex items-center justify-center gap-1 mb-1">
                  <p className="text-white font-semibold text-sm">{a.name}</p>
                  {a.verified && <span className="text-blue-400 text-xs">&#10003;</span>}
                </div>
                {a.genre && <p className="text-purple-400 text-xs mb-2">{a.genre}</p>}
                {a.followers && <p className="text-gray-500 text-xs">{(a.followers / 1000).toFixed(0)}K seguidores</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
