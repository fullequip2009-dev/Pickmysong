'use client';

import { useState } from 'react';
import Link from 'next/link';
import { songs, artists } from '@/lib/db';

// Mock logged-in user
const MOCK_USER = {
  id: 'u1',
  name: 'Urban Listener',
  handle: '@urbanlistener',
  email: 'user@pickmysong.com',
  avatar: '🎧',
  bio: 'Amante de la música urbana y el lifestyle nocturno. Siempre en busca del próximo banger.',
  joinedAt: '2026-01-15',
  plan: 'free' as 'free' | 'premium',
  stats: {
    votesGiven: 247,
    playlistsCreated: 8,
    followedArtists: 12,
    songsDiscovered: 89,
  },
};

const TABS = ['Actividad', 'Artistas', 'Playlists', 'Configuración'] as const;
type Tab = typeof TABS[number];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('Actividad');
  const [editMode, setEditMode] = useState(false);
  const [bio, setBio] = useState(MOCK_USER.bio);
  const [name, setName] = useState(MOCK_USER.name);

  const topSongs = songs.slice(0, 5);
  const followedArtists = artists.slice(0, 4);

  return (
    <main className="min-h-screen bg-black pb-20 md:pb-0">
      {/* Hero Banner */}
      <div className="relative h-48 bg-gradient-to-r from-purple-900/60 via-black to-pink-900/40 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-16 relative">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-8">
          {/* Avatar */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-5xl shadow-2xl border-4 border-black flex-shrink-0">
            {MOCK_USER.avatar}
          </div>

          {/* Info */}
          <div className="flex-1">
            {editMode ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-2xl font-black text-white bg-white/10 border border-white/20 rounded-lg px-3 py-1 mb-1 w-full max-w-xs"
              />
            ) : (
              <h1 className="text-2xl md:text-3xl font-black text-white">{name}</h1>
            )}
            <p className="text-purple-400 text-sm font-semibold">{MOCK_USER.handle}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${MOCK_USER.plan === 'premium' ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black' : 'bg-white/10 text-gray-400'}`}>
                {MOCK_USER.plan === 'premium' ? '✨ Premium' : 'Free'}
              </span>
              <span className="text-gray-500 text-xs">
                Miembro desde {new Date(MOCK_USER.joinedAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white text-sm font-semibold rounded-xl transition-all"
            >
              {editMode ? '💾 Guardar' : '✏️ Editar'}
            </button>
            {MOCK_USER.plan === 'free' && (
              <Link href="/pricing" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-bold rounded-xl transition-all">
                ⬆️ Premium
              </Link>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="mb-8">
          {editMode ? (
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-300 text-sm focus:outline-none focus:border-purple-500 resize-none"
            />
          ) : (
            <p className="text-gray-400 text-sm max-w-2xl">{bio}</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Votos dados', value: MOCK_USER.stats.votesGiven, icon: '🗳️', color: 'text-purple-400' },
            { label: 'Playlists', value: MOCK_USER.stats.playlistsCreated, icon: '📂', color: 'text-pink-400' },
            { label: 'Artistas', value: MOCK_USER.stats.followedArtists, icon: '🎤', color: 'text-blue-400' },
            { label: 'Descubiertas', value: MOCK_USER.stats.songsDiscovered, icon: '🔍', color: 'text-emerald-400' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-gray-500 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-6 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-fit py-2 px-4 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'Actividad' && (
          <div className="space-y-3">
            <h2 className="text-white font-bold mb-4">Canciones que votaste recientemente</h2>
            {topSongs.map((song, i) => (
              <div key={song.id} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all">
                <span className="text-gray-600 text-sm w-5 text-right flex-shrink-0">{i + 1}</span>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${song.color} flex items-center justify-center text-xl flex-shrink-0`}>
                  {song.cover}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm truncate">{song.title}</div>
                  <div className="text-gray-500 text-xs">{song.artist}</div>
                </div>
                <div className="text-purple-400 font-bold text-sm">{song.votes.toLocaleString()} votos</div>
              </div>
            ))}
            <Link href="/discover" className="block text-center text-purple-400 hover:text-purple-300 text-sm py-4 transition-colors">
              Ver todas las canciones →
            </Link>
          </div>
        )}

        {activeTab === 'Artistas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {followedArtists.map((artist) => (
              <div key={artist.id} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${artist.color} flex items-center justify-center text-3xl flex-shrink-0`}>
                  {artist.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm truncate">{artist.name}</span>
                    {artist.verified && <span className="text-blue-400 text-xs">✓</span>}
                  </div>
                  <div className="text-gray-500 text-xs">{artist.genre}</div>
                  <div className="text-gray-400 text-xs">{(artist.followers / 1000).toFixed(1)}k seguidores</div>
                </div>
                <button className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-300 text-xs font-semibold rounded-lg transition-all">
                  Siguiendo
                </button>
              </div>
            ))}
            <Link href="/artists" className="col-span-full block text-center text-purple-400 hover:text-purple-300 text-sm py-4 transition-colors">
              Explorar más artistas →
            </Link>
          </div>
        )}

        {activeTab === 'Playlists' && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📂</div>
            <h3 className="text-white font-bold text-lg mb-2">Sin playlists aún</h3>
            <p className="text-gray-500 text-sm mb-6">Crea tu primera playlist y comparte tu gusto musical</p>
            <Link href="/playlists" className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl text-sm">
              Ver playlists de la comunidad
            </Link>
          </div>
        )}

        {activeTab === 'Configuración' && (
          <div className="space-y-4 max-w-lg">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-white font-bold">Cuenta</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Email</label>
                <input type="email" defaultValue={MOCK_USER.email} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Nueva contraseña</label>
                <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500" />
              </div>
              <button className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-sm transition-all">
                Guardar cambios
              </button>
            </div>
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
              <h3 className="text-red-400 font-bold mb-2">Zona de peligro</h3>
              <p className="text-gray-500 text-sm mb-4">Una vez que elimines tu cuenta, no hay vuelta atrás.</p>
              <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold rounded-xl transition-all">
                Eliminar cuenta
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
