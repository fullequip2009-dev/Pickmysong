'use client';

import { useState } from 'react';
import Link from 'next/link';

// --- Mock data ---
const STATS = [
  { label: 'Votos recibidos', value: '12,847', delta: '+18%', icon: '\uD83D\uDC9C', color: 'text-purple-400' },
  { label: 'Oyentes activos', value: '3,241', delta: '+7%', icon: '\uD83D\uDC65', color: 'text-blue-400' },
  { label: 'Reproducciones', value: '89,420', delta: '+24%', icon: '\uD83C\uDFB5', color: 'text-green-400' },
  { label: 'Ingresos est.', value: '\u20AC 4,320', delta: '+12%', icon: '\uD83D\uDCB0', color: 'text-yellow-400' },
];

const TOP_SONGS = [
  { rank: 1, title: 'MONTAGEM CYBERPUNK', artist: 'DJ KL Jay', votes: 2847, plays: 18400, trend: '\u2191', cover: '\uD83C\uDFB5', color: 'from-purple-600 to-pink-600' },
  { rank: 2, title: 'RAVE DE FAVELA', artist: 'MC Lan', votes: 2341, plays: 15200, trend: '\u2191', cover: '\uD83D\uDD25', color: 'from-orange-600 to-red-600' },
  { rank: 3, title: 'NEON NIGHTS', artist: 'Future Classic', votes: 1987, plays: 12800, trend: '\u2192', cover: '\uD83C\uDF19', color: 'from-blue-600 to-cyan-500' },
  { rank: 4, title: 'ASPHALT GOLD', artist: 'Skepta', votes: 1654, plays: 10100, trend: '\u2193', cover: '\uD83D\uDC51', color: 'from-yellow-500 to-amber-600' },
  { rank: 5, title: 'SILK ROAD', artist: 'Kaytranada', votes: 1201, plays: 8900, trend: '\u2191', cover: '\uD83C\uDFB6', color: 'from-emerald-600 to-teal-500' },
];

const WEEKLY_DATA = [
  { day: 'Lun', votes: 820, plays: 4200 },
  { day: 'Mar', votes: 1340, plays: 6800 },
  { day: 'Mié', votes: 960, plays: 5100 },
  { day: 'Jue', votes: 1580, plays: 8400 },
  { day: 'Vie', votes: 2240, plays: 12300 },
  { day: 'Sáb', votes: 2980, plays: 16700 },
  { day: 'Dom', votes: 1920, plays: 9800 },
];

const MAX_VOTES = Math.max(...WEEKLY_DATA.map((d) => d.votes));
const MAX_PLAYS = Math.max(...WEEKLY_DATA.map((d) => d.plays));

const VENUES_DATA = [
  { name: 'Club BRLND', city: 'Barcelona', songs: 24, votes: 4820, avatar: '\uD83C\uDF0C' },
  { name: "Raver's Paradise", city: 'Berlin', songs: 31, votes: 3940, avatar: '\uD83D\uDD25' },
  { name: 'Casa do Funk', city: 'São Paulo', songs: 18, votes: 2610, avatar: '\uD83C\uDF03' },
];

const PERIODS = ['7 días', '30 días', '90 días'];

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const h = Math.round((value / max) * 100);
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

  return (
    <main className="min-h-screen bg-black text-white pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">\uD83C\uDFB5</span>
            <span className="font-black tracking-tighter text-white">Pick<span className="text-purple-400">my</span>song</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {[['/', 'Inicio'], ['/discover', 'Descubrir'], ['/playlists', 'Playlists'], ['/artists', 'Artistas'], ['/venues', 'Locales'], ['/dashboard', 'Dashboard']].map(([href, label]) => (
              <Link key={href} href={href} className={`px-3 py-1.5 rounded-full transition-all ${href === '/dashboard' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>{label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block rounded-full border border-purple-500/30 bg-purple-600/10 px-3 py-1 text-xs text-purple-300">\uD83C\uDFAA Club BRLND</span>
            <button className="rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500 transition-colors">Mi cuenta</button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Page header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold tracking-widest text-purple-400 mb-1">ANALYTICS DASHBOARD</p>
            <h1 className="text-3xl font-black tracking-tighter text-white md:text-4xl">Club BRLND</h1>
            <p className="mt-1 text-gray-400">Barcelona \u2022 Techno / Industrial \u2022 Capacidad 500</p>
          </div>
          {/* Period selector */}
          <div className="flex rounded-xl border border-white/10 bg-white/5 p-1 gap-1">
            {PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${period === p ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* KPI cards */}
        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/5 bg-white/3 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl">{s.icon}</span>
                <span className={`rounded-full border px-2 py-0.5 text-xs font-semibold ${
                  s.delta.startsWith('+')
                    ? 'border-green-500/30 bg-green-500/10 text-green-400'
                    : 'border-red-500/30 bg-red-500/10 text-red-400'
                }`}>{s.delta}</span>
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
                  <button
                    key={m}
                    onClick={() => setChartMode(m)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${chartMode === m ? 'bg-purple-600 text-white' : 'border border-white/10 text-gray-400 hover:text-white'}`}
                  >
                    {m === 'votes' ? 'Votos' : 'Plays'}
                  </button>
                ))}
              </div>
            </div>
            {/* Bar chart */}
            <div className="flex items-end justify-between gap-2 px-2">
              {WEEKLY_DATA.map((d) => (
                <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-xs text-gray-500">{chartMode === 'votes' ? d.votes.toLocaleString() : d.plays.toLocaleString()}</span>
                  <MiniBar
                    value={chartMode === 'votes' ? d.votes : d.plays}
                    max={chartMode === 'votes' ? MAX_VOTES : MAX_PLAYS}
                    color={chartMode === 'votes' ? 'bg-purple-500' : 'bg-blue-500'}
                  />
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
                    <p className="text-xs text-gray-600">votos</p>
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
            <Link href="/discover" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">Ver todas \u2192</Link>
          </div>
          <div className="flex flex-col gap-3">
            {TOP_SONGS.map((song) => (
              <div key={song.rank} className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/3 p-3 hover:border-white/10 transition-all">
                <span className="w-5 shrink-0 text-center text-sm font-black text-gray-600">{song.rank}</span>
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-lg ${song.color}`}>{song.cover}</div>
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
                <span className={`text-lg font-bold ${song.trend === '\u2191' ? 'text-green-400' : song.trend === '\u2193' ? 'text-red-400' : 'text-gray-400'}`}>{song.trend}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { icon: '\uD83C\uDFB5', label: 'Gestionar playlist', desc: 'A\u00f1ade o quita canciones de tu local', href: '/playlists' },
            { icon: '\uD83D\uDCCA', label: 'Ver estad\u00edsticas', desc: 'Informes detallados de audiencia', href: '#' },
            { icon: '\uD83D\uDCE3', label: 'Promocionar', desc: 'Llega a m\u00e1s oyentes en tu ciudad', href: '#' },
          ].map((action) => (
            <Link key={action.label} href={action.href} className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/3 p-5 backdrop-blur-sm hover:border-white/10 hover:bg-white/5 transition-all">
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
