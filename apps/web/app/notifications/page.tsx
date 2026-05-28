'use client';

import { useState } from 'react';
import Link from 'next/link';

type NotifType = 'song_played' | 'vote_confirmed' | 'achievement' | 'venue_update' | 'new_song';

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  link?: string;
  icon?: string;
}

const MOCK_NOTIFS: Notification[] = [
  {
    id: '1',
    type: 'song_played',
    title: '¡Tu canción está sonando!',
    body: '"Blue in Green" está reproduciéndose ahora en The Jazz Corner',
    time: 'Hace 2 min',
    read: false,
    link: '/venues/venue-1',
    icon: '🎵',
  },
  {
    id: '2',
    type: 'achievement',
    title: '¡Nuevo logro desbloqueado!',
    body: 'Eres un "Tastemaker" — has votado 10 canciones que se reprodujeron',
    time: 'Hace 15 min',
    read: false,
    link: '/profile',
    icon: '🏆',
  },
  {
    id: '3',
    type: 'vote_confirmed',
    title: 'Voto registrado',
    body: 'Has votado por "Take Five" en The Jazz Corner. Posición actual: #2',
    time: 'Hace 1 hora',
    read: true,
    link: '/venues/venue-1',
    icon: '▲',
  },
  {
    id: '4',
    type: 'venue_update',
    title: 'The Jazz Corner ha abierto',
    body: 'Un local que sigues acaba de abrir. ¡Haz check-in y vota!',
    time: 'Hace 2 horas',
    read: true,
    link: '/venues/venue-1',
    icon: '📍',
  },
  {
    id: '5',
    type: 'new_song',
    title: 'Nueva canción añadida',
    body: '"Round Midnight" de Thelonious Monk está disponible para votar',
    time: 'Hace 3 horas',
    read: true,
    link: '/discover',
    icon: '🆕',
  },
  {
    id: '6',
    type: 'achievement',
    title: 'Racha de 7 días',
    body: 'Llevas 7 días seguidos votando canciones. ¡Sigue así!',
    time: 'Ayer',
    read: true,
    link: '/profile',
    icon: '🔥',
  },
  {
    id: '7',
    type: 'song_played',
    title: 'Tu canción llegó al top',
    body: '"Autumn Leaves" que votaste alcanzó el #1 en Blue Moon Bar',
    time: 'Ayer',
    read: true,
    icon: '👑',
  },
];

const typeColors: Record<NotifType, string> = {
  song_played: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
  achievement: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30',
  vote_confirmed: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
  venue_update: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  new_song: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/30',
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notification[]>(MOCK_NOTIFS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifs.filter(n => !n.read).length;
  const displayed = filter === 'unread' ? notifs.filter(n => !n.read) : notifs;

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function dismiss(id: string) {
    setNotifs(prev => prev.filter(n => n.id !== id));
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="font-bold text-lg flex items-center gap-2">
              Notificaciones
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-purple-600 rounded-full text-xs font-bold">{unreadCount}</span>
              )}
            </h1>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Marcar todo leído
            </button>
          )}
        </div>

        {/* Filter tabs */}
        <div className="max-w-2xl mx-auto px-4 pb-3 flex gap-2">
          {[
            { key: 'all' as const, label: 'Todas' },
            { key: 'unread' as const, label: `Sin leer (${unreadCount})` },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === tab.key
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-2">
        {displayed.length === 0 ? (
          <div className="py-24 text-center">
            <div className="text-5xl mb-4">🔔</div>
            <p className="text-gray-400 font-medium">No tienes notificaciones sin leer</p>
            <p className="text-gray-600 text-sm mt-1">Cuando alguien vote tus canciones o sucedan cosas importantes, te avisaremos aquí</p>
          </div>
        ) : (
          displayed.map(notif => {
            const Wrapper = notif.link ? Link : 'div';
            const wrapperProps = notif.link ? { href: notif.link } : {};
            return (
              <Wrapper
                key={notif.id}
                {...(wrapperProps as any)}
                onClick={() => markRead(notif.id)}
                className={`relative flex items-start gap-4 p-4 rounded-xl border bg-gradient-to-r transition-all cursor-pointer group ${
                  typeColors[notif.type]
                } ${!notif.read ? 'shadow-sm shadow-purple-900/50' : 'opacity-70'}`}
              >
                {/* Unread dot */}
                {!notif.read && (
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-purple-400" />
                )}

                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                  notif.type === 'achievement' ? 'bg-amber-500/20' :
                  notif.type === 'song_played' ? 'bg-purple-500/20' :
                  notif.type === 'vote_confirmed' ? 'bg-green-500/20' :
                  'bg-blue-500/20'
                }`}>
                  {notif.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-4">
                  <p className={`font-semibold text-sm ${!notif.read ? 'text-white' : 'text-gray-300'}`}>
                    {notif.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{notif.body}</p>
                  <p className="text-xs text-gray-600 mt-1">{notif.time}</p>
                </div>

                {/* Dismiss button */}
                <button
                  onClick={e => { e.preventDefault(); e.stopPropagation(); dismiss(notif.id); }}
                  className="absolute top-2 right-5 opacity-0 group-hover:opacity-100 text-gray-600 hover:text-gray-400 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </Wrapper>
            );
          })
        )}
      </div>

      {/* Notification settings link */}
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <Link
          href="/profile"
          className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
        >
          ⚙️ Configurar notificaciones
        </Link>
      </div>
    </div>
  );
}
