'use client';

import { useState } from 'react';
import Link from 'next/link';

const CATEGORIES = [
  { id: 'all', label: 'Todos', icon: '🎯' },
  { id: 'voter', label: 'Votante', icon: '🗳️' },
  { id: 'explorer', label: 'Explorador', icon: '🗺️' },
  { id: 'social', label: 'Social', icon: '👥' },
  { id: 'music', label: 'Musica', icon: '🎵' },
  { id: 'special', label: 'Especiales', icon: '💎' },
];

const ACHIEVEMENTS = [
  // Voter
  { id: 1, category: 'voter', title: 'Primer voto', desc: 'Vota tu primera cancion', icon: '🗳️', xp: 10, unlocked: true, rarity: 'common', date: 'Hace 3 meses' },
  { id: 2, category: 'voter', title: 'Votante activo', desc: 'Vota 50 canciones', icon: '⚡', xp: 50, unlocked: true, rarity: 'common', date: 'Hace 2 meses', progress: 100 },
  { id: 3, category: 'voter', title: 'Racha de 5', desc: '5 votos ganadores seguidos', icon: '🔥', xp: 75, unlocked: true, rarity: 'uncommon', date: 'Hace 1 mes' },
  { id: 4, category: 'voter', title: 'Oido de oro', desc: 'Tasa de acierto del 80%', icon: '👂', xp: 150, unlocked: false, rarity: 'rare', progress: 78 },
  { id: 5, category: 'voter', title: 'Racha de 10', desc: '10 votos ganadores seguidos', icon: '💫', xp: 200, unlocked: false, rarity: 'epic', progress: 50 },
  { id: 6, category: 'voter', title: 'Leyenda', desc: 'Vota 500 canciones', icon: '👑', xp: 500, unlocked: false, rarity: 'legendary', progress: 68 },

  // Explorer
  { id: 7, category: 'explorer', title: 'Primer local', desc: 'Visita tu primer local', icon: '📍', xp: 10, unlocked: true, rarity: 'common', date: 'Hace 3 meses' },
  { id: 8, category: 'explorer', title: 'Explorador', desc: 'Visita 5 locales distintos', icon: '🗺️', xp: 50, unlocked: true, rarity: 'common', date: 'Hace 2 meses' },
  { id: 9, category: 'explorer', title: 'Nomada nocturno', desc: 'Visita 20 locales distintos', icon: '✈️', xp: 150, unlocked: false, rarity: 'rare', progress: 60 },
  { id: 10, category: 'explorer', title: 'Check-in rapido', desc: 'Haz check-in en menos de 30 seg', icon: '⚡', xp: 25, unlocked: false, rarity: 'uncommon', progress: 0 },

  // Social
  { id: 11, category: 'social', title: 'Primer amigo', desc: 'Conecta con un amigo', icon: '🤝', xp: 20, unlocked: true, rarity: 'common', date: 'Hace 2 meses' },
  { id: 12, category: 'social', title: 'Embajador', desc: 'Invita a 5 amigos', icon: '👥', xp: 100, unlocked: false, rarity: 'uncommon', progress: 40 },
  { id: 13, category: 'social', title: 'Influencer', desc: 'Invita a 20 amigos', icon: '📣', xp: 300, unlocked: false, rarity: 'epic', progress: 10 },

  // Music
  { id: 14, category: 'music', title: 'DJ en ciernes', desc: 'Añade 10 canciones a playlists', icon: '🎧', xp: 75, unlocked: true, rarity: 'uncommon', date: 'Hace 3 semanas' },
  { id: 15, category: 'music', title: 'Trendsetter', desc: 'Tu cancion fue #1 en un local', icon: '🔥', xp: 200, unlocked: false, rarity: 'rare', progress: 75 },
  { id: 16, category: 'music', title: 'Curador', desc: 'Crea 5 playlists', icon: '🎵', xp: 100, unlocked: false, rarity: 'uncommon', progress: 60 },

  // Special
  { id: 17, category: 'special', title: 'Madrugador', desc: 'Vota una cancion a las 6 AM', icon: '🌅', xp: 50, unlocked: false, rarity: 'uncommon', progress: 0 },
  { id: 18, category: 'special', title: 'Maestro del beat', desc: 'Acumula 5000 XP', icon: '💎', xp: 0, unlocked: false, rarity: 'legendary', progress: 57 },
];

const RARITY_STYLES: Record<string, { border: string; glow: string; label: string; labelColor: string }> = {
  common: { border: 'border-gray-600/30', glow: '', label: 'Comun', labelColor: 'text-gray-400' },
  uncommon: { border: 'border-green-600/40', glow: 'hover:shadow-green-500/10', label: 'Poco comun', labelColor: 'text-green-400' },
  rare: { border: 'border-blue-500/40', glow: 'hover:shadow-blue-500/10', label: 'Raro', labelColor: 'text-blue-400' },
  epic: { border: 'border-purple-500/40', glow: 'hover:shadow-purple-500/10', label: 'Epico', labelColor: 'text-purple-400' },
  legendary: { border: 'border-amber-500/50', glow: 'hover:shadow-amber-500/20', label: 'Legendario', labelColor: 'text-amber-400' },
};

const TOP_USERS = [
  { rank: 1, name: 'DJ_Master_Carlos', xp: 8420, achievements: 18, avatar: '🥇' },
  { rank: 2, name: 'NightOwl_Maria', xp: 7250, achievements: 15, avatar: '🥈' },
  { rank: 3, name: 'BeatHunter_Alex', xp: 6180, achievements: 14, avatar: '🥉' },
  { rank: 4, name: 'RhythmSeeker_Ana', xp: 5340, achievements: 12, avatar: '4️⃣' },
  { rank: 5, name: 'Tu (Carlos M.)', xp: 2840, achievements: 7, avatar: '⭐', isUser: true },
];

export default function AchievementsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<'achievements' | 'leaderboard'>('achievements');

  const filtered = activeCategory === 'all'
    ? ACHIEVEMENTS
    : ACHIEVEMENTS.filter(a => a.category === activeCategory);

  const unlocked = ACHIEVEMENTS.filter(a => a.unlocked).length;
  const totalXp = ACHIEVEMENTS.filter(a => a.unlocked).reduce((sum, a) => sum + a.xp, 0);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-amber-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-purple-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Logros & Ranking</h1>
          <p className="text-gray-400">Gana XP, desbloquea logros y escala el ranking nocturno</p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Logros desbloqueados', value: unlocked + ' / ' + ACHIEVEMENTS.length, icon: '🏆' },
            { label: 'XP ganada', value: totalXp.toLocaleString(), icon: '⚡' },
            { label: 'Rango global', value: '#47', icon: '📊' },
          ].map(stat => (
            <div key={stat.label} className="text-center p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-lg font-bold">{stat.value}</div>
              <div className="text-xs text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 p-1 rounded-xl mb-6">
          {([['achievements', '🏆 Logros'], ['leaderboard', '📊 Ranking']] as const).map(([id, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={'flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ' + (
                activeTab === id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div>
            {/* Category filters */}
            <div className="flex gap-2 flex-wrap mb-6">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all ' + (
                    activeCategory === cat.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/30'
                  )}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Achievements grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map(ach => {
                const style = RARITY_STYLES[ach.rarity] || RARITY_STYLES.common;
                return (
                  <div
                    key={ach.id}
                    className={'relative p-4 rounded-xl border transition-all hover:shadow-xl ' + style.border + ' ' + style.glow + ' ' + (ach.unlocked ? 'bg-white/5' : 'bg-white/2 opacity-70')}
                  >
                    {/* Rarity badge */}
                    <div className={'absolute top-2 right-2 text-xs ' + style.labelColor}>
                      {style.label}
                    </div>

                    <div className="flex items-start gap-3">
                      <div className={'text-3xl ' + (!ach.unlocked ? 'grayscale opacity-50' : '')}>
                        {ach.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{ach.title}</h3>
                          {ach.unlocked && <span className="text-xs text-green-400">✓</span>}
                        </div>
                        <p className="text-xs text-gray-400 mb-2">{ach.desc}</p>

                        {/* XP reward */}
                        {ach.xp > 0 && (
                          <div className={'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs mb-2 ' + (ach.unlocked ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-gray-500')}>
                            ⚡ {ach.xp} XP
                          </div>
                        )}

                        {/* Progress or date */}
                        {ach.unlocked ? (
                          <p className="text-xs text-purple-400">{ach.date}</p>
                        ) : ach.progress !== undefined && ach.progress > 0 ? (
                          <div>
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Progreso</span>
                              <span>{ach.progress}%</span>
                            </div>
                            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                style={{ width: ach.progress + '%' }}
                              />
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-600">Bloqueado</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div>
            <div className="space-y-2">
              {TOP_USERS.map(user => (
                <div
                  key={user.rank}
                  className={'flex items-center gap-4 p-4 rounded-xl border transition-all ' + (
                    user.isUser
                      ? 'bg-purple-500/10 border-purple-500/30'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  )}
                >
                  <div className="text-2xl w-8 text-center flex-shrink-0">{user.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className={'font-semibold text-sm ' + (user.isUser ? 'text-purple-300' : 'text-white')}>
                      {user.name} {user.isUser && '(tu)'}
                    </p>
                    <p className="text-xs text-gray-400">{user.achievements} logros desbloqueados</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-amber-400">{user.xp.toLocaleString()} XP</p>
                    <p className="text-xs text-gray-500">Nivel {Math.floor(user.xp / 250)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl text-center">
              <p className="text-sm text-gray-400">
                Estas en el <span className="text-purple-400 font-bold">top 5%</span> de usuarios mas activos esta semana
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/profile" className="text-sm text-gray-400 hover:text-white transition-colors mr-6">
            Ver tu perfil
          </Link>
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
