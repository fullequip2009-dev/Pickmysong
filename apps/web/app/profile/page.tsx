'use client';

import { useState } from 'react';
import Link from 'next/link';

const MOCK_USER = {
  id: '1',
  name: 'Carlos Mendoza',
  email: 'carlos@pickmysong.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
  level: 12,
  xp: 2840,
  xpToNext: 3000,
  totalVotes: 342,
  songsAdded: 28,
  venuesVisited: 15,
  joinedDate: 'Enero 2025',
  favoriteGenre: 'House',
  rank: 'Gold',
};

const ACHIEVEMENTS = [
  { id: 1, title: 'Primer voto', description: 'Votaste tu primera cancion', icon: '🎵', unlocked: true, date: 'Hace 3 meses' },
  { id: 2, title: 'Buen gusto', description: '10 votos ganadores seguidos', icon: '🏆', unlocked: true, date: 'Hace 2 meses' },
  { id: 3, title: 'Explorador', description: 'Visitaste 5 locales distintos', icon: '🗺️', unlocked: true, date: 'Hace 1 mes' },
  { id: 4, title: 'DJ en ciernes', description: 'Añadiste 10 canciones a playlists', icon: '🎧', unlocked: true, date: 'Hace 3 semanas' },
  { id: 5, title: 'Leyenda local', description: 'Votaste en 50 canciones', icon: '⭐', unlocked: true, date: 'Hace 1 semana' },
  { id: 6, title: 'Trendsetter', description: 'Tu cancion fue #1 en un local', icon: '🔥', unlocked: false, progress: 75 },
  { id: 7, title: 'Viajero del ritmo', description: 'Visita 20 locales distintos', icon: '✈️', unlocked: false, progress: 60 },
  { id: 8, title: 'Maestro del beat', description: 'Acumula 5000 XP', icon: '💎', unlocked: false, progress: 57 },
  { id: 9, title: 'Embajador', description: 'Invita a 5 amigos', icon: '👥', unlocked: false, progress: 40 },
];

const VOTE_HISTORY = [
  { song: 'Blinding Lights', artist: 'The Weeknd', venue: 'Sala Apolo', result: 'winner', xp: 15, date: 'Hace 2 horas' },
  { song: 'Levitating', artist: 'Dua Lipa', venue: 'Club Opium', result: 'winner', xp: 15, date: 'Ayer' },
  { song: 'Save Your Tears', artist: 'The Weeknd', venue: 'Razzmatazz', result: 'loser', xp: 5, date: 'Ayer' },
  { song: 'Industry Baby', artist: 'Lil Nas X', venue: 'Sala Apolo', result: 'winner', xp: 15, date: 'Hace 2 dias' },
  { song: 'STAY', artist: 'The Kid LAROI', venue: 'Sutton Club', result: 'winner', xp: 15, date: 'Hace 3 dias' },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'achievements' | 'history' | 'stats'>('achievements');
  const xpPercent = Math.round((MOCK_USER.xp / MOCK_USER.xpToNext) * 100);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-500/50 bg-purple-900/30">
                <img src={MOCK_USER.avatar} alt={MOCK_USER.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-500 to-yellow-300 text-black">
                {MOCK_USER.rank}
              </div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold mb-1">{MOCK_USER.name}</h1>
              <p className="text-gray-400 text-sm mb-3">{MOCK_USER.email} · Miembro desde {MOCK_USER.joinedDate}</p>
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-purple-400 font-semibold">Nivel {MOCK_USER.level}</span>
                  <span className="text-gray-400">{MOCK_USER.xp.toLocaleString()} / {MOCK_USER.xpToNext.toLocaleString()} XP</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-1000"
                    style={{ width: xpPercent + '%' }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{MOCK_USER.xpToNext - MOCK_USER.xp} XP para nivel {MOCK_USER.level + 1}</p>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-xs text-purple-300">
                  🎵 {MOCK_USER.favoriteGenre}
                </span>
                <span className="px-3 py-1 bg-pink-500/20 border border-pink-500/30 rounded-full text-xs text-pink-300">
                  🔥 Top votante
                </span>
              </div>
            </div>
            <button className="px-4 py-2 border border-white/20 rounded-lg text-sm text-gray-300 hover:border-purple-500/50 hover:text-white transition-all">
              Editar perfil
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
            {[
              { label: 'Votos totales', value: MOCK_USER.totalVotes, icon: '🗳️' },
              { label: 'Songs añadidas', value: MOCK_USER.songsAdded, icon: '🎵' },
              { label: 'Locales visitados', value: MOCK_USER.venuesVisited, icon: '📍' },
            ].map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl mb-6">
          {(['achievements', 'history', 'stats'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={'flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ' + (
                activeTab === tab
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              {tab === 'achievements' ? '🏆 Logros' : tab === 'history' ? '📋 Historial' : '📊 Stats'}
            </button>
          ))}
        </div>

        {/* Achievements */}
        {activeTab === 'achievements' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Logros obtenidos</h2>
              <span className="text-sm text-gray-400">{ACHIEVEMENTS.filter(a => a.unlocked).length} / {ACHIEVEMENTS.length}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ACHIEVEMENTS.map(achievement => (
                <div
                  key={achievement.id}
                  className={'p-4 rounded-xl border transition-all ' + (
                    achievement.unlocked
                      ? 'bg-white/5 border-purple-500/30 hover:border-purple-500/60'
                      : 'bg-white/2 border-white/5 opacity-60'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={'text-3xl ' + (!achievement.unlocked ? 'grayscale' : '')}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{achievement.title}</h3>
                        {achievement.unlocked && <span className="text-xs text-green-400">✓</span>}
                      </div>
                      <p className="text-xs text-gray-400 mb-2">{achievement.description}</p>
                      {achievement.unlocked ? (
                        <p className="text-xs text-purple-400">{achievement.date}</p>
                      ) : (
                        <div>
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progreso</span>
                            <span>{achievement.progress}%</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                              style={{ width: achievement.progress + '%' }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* History */}
        {activeTab === 'history' && (
          <div>
            <h2 className="text-lg font-bold mb-4">Historial de votos</h2>
            <div className="space-y-2">
              {VOTE_HISTORY.map((vote, i) => (
                <div key={i} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:border-white/20 transition-all">
                  <div className={'w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ' + (
                    vote.result === 'winner' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  )}>
                    {vote.result === 'winner' ? '↑' : '↓'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{vote.song}</p>
                    <p className="text-xs text-gray-400">{vote.artist} · {vote.venue}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={'text-sm font-bold ' + (vote.result === 'winner' ? 'text-green-400' : 'text-gray-500')}>
                      +{vote.xp} XP
                    </p>
                    <p className="text-xs text-gray-500">{vote.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        {activeTab === 'stats' && (
          <div>
            <h2 className="text-lg font-bold mb-4">Estadisticas detalladas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'XP total ganada', value: '2,840', sub: '+150 esta semana' },
                { label: 'Tasa de acierto', value: '78%', sub: 'de canciones ganadoras' },
                { label: 'Racha actual', value: '5', sub: 'votos ganadores seguidos' },
                { label: 'Mejor racha', value: '12', sub: 'record personal' },
                { label: 'Local favorito', value: 'Sala Apolo', sub: '47 visitas' },
                { label: 'Genero mas votado', value: 'House', sub: '42% de tus votos' },
              ].map(stat => (
                <div key={stat.label} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.sub}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-xl">
              <h3 className="text-sm font-semibold mb-4">Generos votados</h3>
              {[
                { genre: 'House', pct: 42 },
                { genre: 'Pop', pct: 28 },
                { genre: 'Hip-Hop', pct: 18 },
                { genre: 'Reggaeton', pct: 12 },
              ].map(g => (
                <div key={g.genre} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300">{g.genre}</span>
                    <span className="text-gray-400">{g.pct}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                      style={{ width: g.pct + '%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
