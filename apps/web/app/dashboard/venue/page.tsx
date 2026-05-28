'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface VenueStats {
  totalVotes: number;
  totalPlays: number;
  activeUsers: number;
  topSong: string;
  openSince?: string;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  votes: number;
}

const MOCK_VENUE = {
  id: 'venue-1',
  name: 'The Jazz Corner',
  city: 'Madrid',
  type: 'bar',
  open: true,
  address: 'Calle Gran Vía 45',
};

const MOCK_STATS: VenueStats = {
  totalVotes: 342,
  totalPlays: 87,
  activeUsers: 23,
  topSong: 'Blue in Green - Miles Davis',
  openSince: '20:00',
};

const MOCK_SONGS: Song[] = [
  { id: '1', title: 'Blue in Green', artist: 'Miles Davis', votes: 24 },
  { id: '2', title: 'Autumn Leaves', artist: 'Bill Evans', votes: 18 },
  { id: '3', title: 'Take Five', artist: 'Dave Brubeck', votes: 15 },
  { id: '4', title: 'So What', artist: 'Miles Davis', votes: 12 },
  { id: '5', title: 'Round Midnight', artist: 'Thelonious Monk', votes: 9 },
];

type Section = 'overview' | 'playlist' | 'qr' | 'settings';

export default function VenueDashboardPage() {
  const [section, setSection] = useState<Section>('overview');
  const [isOpen, setIsOpen] = useState(true);
  const [songs, setSongs] = useState<Song[]>(MOCK_SONGS);
  const [liveCount, setLiveCount] = useState(MOCK_STATS.activeUsers);

  // Simulate live user count
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount(c => Math.max(1, c + Math.floor(Math.random() * 5) - 2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  function skipSong(id: string) {
    setSongs(prev => prev.filter(s => s.id !== id));
  }

  const statCards = [
    { label: 'Votos hoy', value: MOCK_STATS.totalVotes.toString(), icon: '▲', color: 'from-purple-600 to-purple-800' },
    { label: 'Reproducciones', value: MOCK_STATS.totalPlays.toString(), icon: '🎵', color: 'from-pink-600 to-pink-800' },
    { label: 'Usuarios en vivo', value: liveCount.toString(), icon: '👥', color: 'from-blue-600 to-blue-800', live: true },
    { label: 'Canción top', value: 'Blue in Green', icon: '👑', color: 'from-amber-600 to-amber-800', small: true },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Top bar */}
      <div className="border-b border-white/10 bg-black/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <p className="font-bold text-sm">{MOCK_VENUE.name}</p>
              <p className="text-xs text-gray-400">{MOCK_VENUE.address}, {MOCK_VENUE.city}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                isOpen
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              {isOpen ? 'Abierto' : 'Cerrado'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Nav tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { key: 'overview' as Section, label: '📊 Resumen' },
            { key: 'playlist' as Section, label: '🎵 Playlist' },
            { key: 'qr' as Section, label: '📱 QR' },
            { key: 'settings' as Section, label: '⚙️ Config' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setSection(tab.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                section === tab.key
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {section === 'overview' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {statCards.map((card, i) => (
                <div
                  key={i}
                  className={`relative bg-gradient-to-br ${card.color} rounded-2xl p-4 overflow-hidden`}
                >
                  {card.live && (
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span className="text-xs opacity-70">live</span>
                    </div>
                  )}
                  <div className="text-2xl mb-2">{card.icon}</div>
                  <p className={`font-bold ${card.small ? 'text-sm' : 'text-2xl'}`}>{card.value}</p>
                  <p className="text-xs opacity-70 mt-1">{card.label}</p>
                </div>
              ))}
            </div>

            {/* Activity chart placeholder */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <span>📈</span> Actividad en tiempo real
              </h3>
              <div className="flex items-end gap-1 h-24">
                {Array.from({ length: 24 }, (_, i) => {
                  const h = Math.floor(Math.random() * 80) + 10;
                  const isNow = i === 20;
                  return (
                    <div
                      key={i}
                      className={`flex-1 rounded-t transition-all ${isNow ? 'bg-purple-500' : 'bg-white/10'}`}
                      style={{ height: h + '%' }}
                      title={`${i}:00 - ${h} votos`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>00:00</span>
                <span>Ahora</span>
                <span>23:00</span>
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: 'Ver QR del local', icon: '📱', action: () => setSection('qr') },
                { label: 'Gestionar playlist', icon: '🎵', action: () => setSection('playlist') },
                { label: 'Compartir en RRSS', icon: '📢', action: () => {} },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={action.action}
                  className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/30 rounded-xl transition-all text-left"
                >
                  <span className="text-2xl">{action.icon}</span>
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PLAYLIST */}
        {section === 'playlist' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg">Playlist en vivo</h2>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Actualizada en tiempo real
              </div>
            </div>

            <div className="space-y-2 mb-6">
              {songs.map((song, i) => (
                <div
                  key={song.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border ${
                    i === 0
                      ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/30 border-purple-500/40'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  {i === 0 && (
                    <div className="w-1 h-12 bg-green-400 rounded-full animate-pulse" />
                  )}
                  <div className="w-8 text-center text-sm font-bold text-gray-500">
                    {i === 0 ? '▶' : `#${i + 1}`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{song.title}</p>
                    <p className="text-sm text-gray-400">{song.artist}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="font-bold text-purple-400">{song.votes}</p>
                      <p className="text-xs text-gray-600">votos</p>
                    </div>
                    <button
                      onClick={() => skipSong(song.id)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                      title="Eliminar de la playlist"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {songs.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-3">🎵</div>
                <p>La playlist está vacía. Los clientes pueden votar canciones.</p>
              </div>
            )}
          </div>
        )}

        {/* QR */}
        {section === 'qr' && (
          <div className="max-w-sm mx-auto text-center">
            <h2 className="font-bold text-xl mb-2">Tu código QR</h2>
            <p className="text-gray-400 text-sm mb-6">Ponlo en las mesas para que tus clientes puedan votar</p>

            <div className="bg-white rounded-2xl p-8 mb-6">
              <div className="w-48 h-48 mx-auto bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 mb-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">⬛⬜⬛</div>
                  <div className="text-4xl">⬜⬛⬜</div>
                  <div className="text-4xl">⬛⬜⬛</div>
                </div>
              </div>
              <p className="text-gray-800 font-bold">{MOCK_VENUE.name}</p>
              <p className="text-gray-500 text-sm">pickmysong.app/venues/{MOCK_VENUE.id}</p>
            </div>

            <Link
              href={`/venues/${MOCK_VENUE.id}/qr`}
              className="block w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold mb-3 hover:from-purple-500 hover:to-pink-500 transition-all"
            >
              Ver QR completo →
            </Link>

            <div className="grid grid-cols-2 gap-3">
              <button className="py-3 bg-white/10 border border-white/20 rounded-xl text-sm font-medium hover:bg-white/15 transition-colors">
                📥 Descargar
              </button>
              <button className="py-3 bg-white/10 border border-white/20 rounded-xl text-sm font-medium hover:bg-white/15 transition-colors">
                📢 Compartir
              </button>
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {section === 'settings' && (
          <div className="max-w-lg space-y-4">
            <h2 className="font-bold text-xl mb-6">Configuración del local</h2>

            {[
              { label: 'Nombre del local', value: MOCK_VENUE.name, type: 'text' },
              { label: 'Dirección', value: MOCK_VENUE.address, type: 'text' },
              { label: 'Ciudad', value: MOCK_VENUE.city, type: 'text' },
              { label: 'Tipo de local', value: MOCK_VENUE.type, type: 'select', options: ['bar', 'restaurant', 'club', 'cafeteria', 'other'] },
            ].map((field, i) => (
              <div key={i}>
                <label className="text-sm text-gray-400 mb-1 block">{field.label}</label>
                {field.type === 'select' ? (
                  <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 capitalize">
                    {field.options?.map(opt => (
                      <option key={opt} value={opt} className="bg-gray-900 capitalize">{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    defaultValue={field.value}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 placeholder-gray-500"
                  />
                )}
              </div>
            ))}

            <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold mt-4 hover:from-purple-500 hover:to-pink-500 transition-all">
              Guardar cambios
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
