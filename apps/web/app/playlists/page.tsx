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
}

interface Playlist {
  id: string;
  name: string;
  venueId?: string;
  venueName?: string;
  description?: string;
  coverUrl?: string;
  songCount?: number;
  totalVotes?: number;
  isActive?: boolean;
  genre?: string;
  songs?: Song[];
}

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active'>('all');

  useEffect(() => {
    fetch('/api/playlists')
      .then(r => r.json())
      .then(data => {
        setPlaylists(Array.isArray(data) ? data : (data.playlists || []));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = activeFilter === 'active' ? playlists.filter(p => p.isActive) : playlists;
  const totalVotesAll = playlists.reduce((acc, p) => acc + (p.totalVotes || 0), 0);
  const activePlaylists = playlists.filter(p => p.isActive).length;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative overflow-hidden bg-gradient-to-b from-purple-950/40 to-black pt-24 pb-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 left-1/3 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-10 right-1/4 w-56 h-56 bg-pink-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        <div className="relative max-w-5xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-black mb-3">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Playlists</span>
          </h1>
          <p className="text-gray-400 text-lg mb-6">Las playlists votadas por el p&#250;blico en tiempo real</p>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2"><span className="text-2xl font-black text-white">{playlists.length}</span><span className="text-gray-500 text-sm">playlists totales</span></div>
            <div className="flex items-center gap-2"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /><span className="text-2xl font-black text-green-400">{activePlaylists}</span><span className="text-gray-500 text-sm">activas ahora</span></div>
            <div className="flex items-center gap-2"><span className="text-2xl font-black text-purple-400">{totalVotesAll.toLocaleString()}</span><span className="text-gray-500 text-sm">votos totales</span></div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex gap-2 mb-8">
          {(['all', 'active'] as const).map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} className={activeFilter === f ? 'px-5 py-2 rounded-full text-sm font-semibold bg-purple-600 text-white' : 'px-5 py-2 rounded-full text-sm font-semibold bg-gray-900/80 border border-white/10 text-gray-400 hover:text-purple-300'}>
              {f === 'all' ? 'Todas' : '● Activas'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">{[...Array(4)].map((_, i) => (<div key={i} className="bg-gray-900/40 rounded-2xl p-5 animate-pulse"><div className="flex items-center gap-4"><div className="w-16 h-16 bg-gray-800 rounded-xl" /><div className="flex-1 space-y-2"><div className="h-5 bg-gray-800 rounded w-2/3" /><div className="h-4 bg-gray-800 rounded w-1/3" /></div></div></div>))}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24"><p className="text-5xl mb-4">&#127925;</p><p className="text-gray-400">No hay playlists disponibles</p></div>
        ) : (
          <div className="space-y-4">
            {filtered.map(playlist => (
              <div key={playlist.id} className="bg-gray-900/50 border border-white/10 hover:border-purple-500/30 rounded-2xl overflow-hidden transition-all">
                <button onClick={() => setExpanded(expanded === playlist.id ? null : playlist.id)} className="w-full flex items-center gap-4 p-5 text-left group">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    {playlist.coverUrl ? (<img src={playlist.coverUrl} alt={playlist.name} className="w-full h-full object-cover" />) : (<div className="w-full h-full bg-gradient-to-br from-purple-800 to-pink-800 flex items-center justify-center text-2xl">&#127925;</div>)}
                    {playlist.isActive && (<div className="absolute inset-0 bg-black/30 flex items-center justify-center"><span className="w-3 h-3 bg-green-400 rounded-full animate-pulse" /></div>)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-white font-bold text-lg group-hover:text-purple-300 transition-colors truncate">{playlist.name}</h3>
                      {playlist.isActive && (<span className="flex-shrink-0 px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-400 font-medium">● LIVE</span>)}
                      {playlist.genre && (<span className="flex-shrink-0 px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300">{playlist.genre}</span>)}
                    </div>
                    {playlist.venueName && (<Link href={'/venues/' + playlist.venueId} onClick={e => e.stopPropagation()} className="text-purple-400 text-sm hover:text-purple-300 transition-colors">&#127979; {playlist.venueName}</Link>)}
                    {playlist.description && (<p className="text-gray-500 text-sm mt-1 truncate">{playlist.description}</p>)}
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-gray-300 font-bold">{playlist.songCount || 0} canciones</span>
                    <span className="text-purple-400 text-sm">{(playlist.totalVotes || 0).toLocaleString()} votos</span>
                    <span className="text-gray-600 text-xs mt-1">{expanded === playlist.id ? '▲ cerrar' : '▼ ver lista'}</span>
                  </div>
                </button>
                {expanded === playlist.id && playlist.songs && playlist.songs.length > 0 && (
                  <div className="border-t border-white/5 px-5 pb-5">
                    <div className="mt-4 space-y-2">
                      {playlist.songs.map((song, idx) => (
                        <div key={song.id} className="flex items-center gap-3 p-3 bg-gray-950/50 rounded-xl">
                          <span className="w-6 text-center text-gray-600 text-sm font-bold flex-shrink-0">{idx + 1}</span>
                          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-900 to-pink-900">{song.coverUrl && <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />}</div>
                          <div className="flex-1 min-w-0"><p className="text-white text-sm font-medium truncate">{song.title}</p><p className="text-gray-500 text-xs">{song.artist}</p></div>
                          {song.genre && <span className="text-xs text-purple-400 flex-shrink-0">{song.genre}</span>}
                          <span className="text-gray-400 text-sm font-semibold flex-shrink-0">{song.votes.toLocaleString()} ▲</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center"><Link href={'/venues/' + playlist.venueId} className="inline-block px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-sm font-semibold text-white hover:from-purple-500 hover:to-pink-500 transition-all">Ir al local y votar &#8594;</Link></div>
                  </div>
                )}
                {expanded === playlist.id && (!playlist.songs || playlist.songs.length === 0) && (
                  <div className="border-t border-white/5 px-5 py-8 text-center text-gray-500">
                    <p>No hay canciones todav&#237;a</p>
                    {playlist.venueId && (<Link href={'/venues/' + playlist.venueId} className="mt-3 inline-block text-purple-400 text-sm hover:text-purple-300">Visita el local &#8594;</Link>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="mt-16 rounded-2xl bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/20 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div><p className="text-xl font-bold mb-1">&#127900; &#191;Quieres tu propia playlist?</p><p className="text-gray-400 text-sm">Registra tu local y empieza a recibir votos.</p></div>
          <Link href="/pricing" className="flex-shrink-0 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold text-white hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/30">Empezar gratis &#8594;</Link>
        </div>
      </div>
    </div>
  );
}
