'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const PERIODS = ['7 días', '30 días', '90 días'];

const SONG_GRADIENTS = [
  'from-purple-600 to-pink-600',
  'from-orange-600 to-red-600',
  'from-blue-600 to-cyan-500',
  'from-yellow-500 to-amber-600',
  'from-emerald-600 to-teal-500',
];

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const h = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex h-24 w-6 items-end rounded-t-sm overflow-hidden bg-white/5">
        <div className={`w-full rounded-t-sm ${color} transition-all`} style={{ height: `${h}%` }} />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [period, setPeriod] = useState('7 días');
  const [chartMode, setChartMode] = useState<'votes' | 'plays'>('votes');
  const [stats, setStats] = useState<any>(null);
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, venuesRes] = await Promise.all([
          fetch('/api/dashboard/stats').then((r) => r.json()),
          fetch('/api/venues').then((r) => r.json()),
        ]);
        setStats(statsRes.stats ?? null);
        setVenues(venuesRes.venues ?? []);
      } catch (e) {
        console.error('[dashboard] load error', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const totalActiveUsers = venues.reduce((acc, v) => acc + (v.activeUsers ?? 0), 0);

  const STATS = [
    { label: 'Votos recibidos', value: (stats?.totalVotes ?? 0).toLocaleString(), delta: '+18%', icon: '💜', color: 'text-purple-400' },
    { label: 'Oyentes activos', value: totalActiveUsers.toLocaleString(), delta: '+7%', icon: '👥', color: 'text-blue-400' },
    { label: 'Reproducciones', value: (stats?.totalPlays ?? 0).toLocaleString(), delta: '+24%', icon: '🎵', color: 'text-green-400' },
    { label: 'Locales activos', value: `${stats?.openVenues ?? 0}/${stats?.totalVenues ?? 0}`, delta: '+12%', icon: '🏪', color: 'text-yellow-400' },
  ];

  const WEEKLY_DATA = (stats?.weeklyData ?? []).map((d: any) => ({
    day: d.day ? d.day.charAt(0).toUpperCase() + d.day.slice(1) : '',
    votes: d.votes ?? 0,
    plays: d.plays ?? 0,
  }));
  const MAX_VOTES = Math.max(1, ...WEEKLY_DATA.map((d: any) => d.votes));
  const MAX_PLAYS = Math.max(1, ...WEEKLY_DATA.map((d: any) => d.plays));

  const TOP_SONGS = (stats?.topSongs ?? []).map((s: any, i: number) => ({
    rank: i + 1,
    title: s.title ?? s.id,
    artist: s.artist ?? '—',
    votes: s.votes ?? 0,
    plays: s.plays ?? 0,
    trend: '→',
    cover: '🎵',
    color: SONG_GRADIENTS[i % SONG_GRADIENTS.length],
  }));

  const VENUES_DATA = [...venues]
    .sort((a, b) => (b.activeUsers ?? 0) - (a.activeUsers ?? 0))
    .slice(0, 5)
    .map((v) => ({
      name: v.name,
      city: v.city,
      votes: v.activeUsers ?? 0,
      avatar: v.type === 'club' ? '🌌' : v.type === 'bar' ? '🍸' : '🎸',
    }));

  return (
    <main className="min-h-screen bg-black text-white pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">🎵</span>
            <span className="font-black tracking-tighter text-white">Pick<span className="text-purple-400">mysong</span></span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {[['/', 'Inicio'], ['/discover', 'Descubrir'], ['/playlists', 'Playlists'], ['/artists', 'Artistas'], ['/venues', 'Locales'], ['/dashboard', 'Dashboard']].map(([href, label]) => (
              <Link key={href} href={href} className={`px-3 py-1.5 rounded-full transition-all ${href === '/dashboard' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>{label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block rounded-full border border-purple-500/30 bg-purple-600/10 px-3 py-1 text-xs text-purple-300">🎪 Mi local</span>
            <button className="rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500 transition-colors">Mi cuenta</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Page header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold tracking-widest text-purple-400 mb-1">ANALYTICS DASHBOARD</p>
            <h1 className="text-3xl font-black tracking-tighter text-white md:text-4xl">Panel del local</h1>
            <p className="mt-1 text-gray-400">{loading ? 'Cargando datos…' : `${stats?.totalVenues ?? 0} locales • ${stats?.totalSongs ?? 0} canciones • ${stats?.totalArtists ?? 0} artistas`}</p>
          </div>
          {/* Period selector */}
          <div className="flex rounded-xl border border-white/10 bg-white/5 p-1 gap-1">
            {PERIODS.map((p) => (
              <button key={p} onClick={() => setPeriod(p)} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${period === p ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white'}`}>{p}</button>
            ))}
          </div>
        </div>

        {/* KPI cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/5 bg-white/3 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{s.icon}</span>
                <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${s.delta.startsWith('+') ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-red-500/30 bg-red-500/10 text-red-400'}`}>{s.delta}</span>
              </div>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="mt-1 text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Chart — takes 2/3 */}
          <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-white/3 p-6 backdrop-blur-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-bold text-white">Actividad semanal</h2>
              <div className="flex gap-2">
                {(['votes', 'plays'] as const).map((m) => (
                  <button key={m} onClick={() => setChartMode(m)} className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${chartMode === m ? 'bg-purple-600 text-white' : 'border border-white/10 text-gray-400 hover:text-white'}`}>{m === 'votes' ? 'Votos' : 'Plays'}</button>
                ))}
              </div>
            </div>
            {/* Bar chart */}
            <div className="flex items-end justify-between gap-2 px-2">
              {WEEKLY_DATA.map((d: any) => (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs text-gray-500">{chartMode === 'votes' ? d.votes.toLocaleString() : d.plays.toLocaleString()}</span>
                  <MiniBar value={chartMode === 'votes' ? d.votes : d.plays} max={chartMode === 'votes' ? MAX_VOTES : MAX_PLAYS} color={chartMode === 'votes' ? 'bg-purple-500' : 'bg-blue-500'} />
                  <span className="text-xs text-gray-500">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top venues — 1/3 */}
          <div className="rounded-2xl border border-white/5 bg-white/3 p-6 backdrop-blur-sm">
            <h2 className="mb-4 font-bold text-white">Locales top</h2>
            <div className="flex flex-col gap-3">
              {VENUES_DATA.map((v, i) => (
                <div key={v.name} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/3 p-3">
                  <span className="text-xs font-black text-gray-600 w-4">{i + 1}</span>
                  <span className="text-xl">{v.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{v.name}</p>
                    <p className="text-xs text-gray-500">{v.city}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-purple-400">{v.votes.toLocaleString()}</p>
                    <p className="text-xs text-gray-600">activos</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top songs table */}
        <div className="mt-6 rounded-2xl border border-white/5 bg-white/3 p-6 backdrop-blur-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-bold text-white">Top canciones</h2>
            <Link href="/discover" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Ver todas →</Link>
          </div>
          <div className="flex flex-col gap-3">
            {TOP_SONGS.map((song: any) => (
              <div key={song.rank} className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/3 p-3 hover:border-white/10 transition-colors">
                <span className="w-5 shrink-0 text-center text-sm font-black text-gray-600">{song.rank}</span>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${song.color} text-lg`}>{song.cover}</div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{song.title}</p>
                  <p className="truncate text-xs text-gray-500">{song.artist}</p>
                </div>
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-bold text-purple-400">{song.votes.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">votos</p>
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-bold text-blue-400">{song.plays.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">plays</p>
                </div>
                <span className={`text-lg font-bold ${song.trend === '↑' ? 'text-green-400' : song.trend === '↓' ? 'text-red-400' : 'text-gray-400'}`}>{song.trend}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { icon: '🎵', label: 'Gestionar playlist', desc: 'Añade o quita canciones de tu local', href: '/playlists' },
            { icon: '📊', label: 'Ver estadísticas', desc: 'Informes detallados de audiencia', href: '#' },
            { icon: '📣', label: 'Promocionar', desc: 'Llega a más oyentes en tu ciudad', href: '#' },
          ].map((action) => (
            <Link key={action.label} href={action.href} className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/3 p-5 backdrop-blur-sm hover:border-purple-500/30 transition-colors">
              <span className="text-3xl">{action.icon}</span>
              <div>
                <p className="font-semibold text-white group-hover:text-purple-300 transition-colors">{action.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
