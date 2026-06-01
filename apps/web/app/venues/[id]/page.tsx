'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Song {
  id: string;
  title: string;
  artist: string;
  cover?: string;
  duration?: number;
}

interface QueueItem {
  id: string;
  bids: number;
  position: number;
  songs: Song;
}

interface NowPlaying {
  id: string;
  played_at: string;
  songs: Song;
}

interface Venue {
  id: string;
  name: string;
  address?: string;
  city?: string;
  type?: string;
  open: boolean;
  cover_url?: string;
  description?: string;
}
export default function VenuePage() {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [nowPlaying, setNowPlaying] = useState<NowPlaying | null>(null);
  const [visitors, setVisitors] = useState(0);
  const [loading, setLoading] = useState(true);
  const [checkedIn, setCheckedIn] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [biddingId, setBiddingId] = useState<string | null>(null);
  const [biddedItems, setBiddedItems] = useState<Set<string>>(new Set());

  const fetchLiveData = useCallback(async () => {
    try {
      const res = await fetch(`/api/checkin?venue_id=${id}`);
      if (res.ok) {
        const data = await res.json();
        setVisitors(data.visitors ?? 0);
        setNowPlaying(data.now_playing ?? null);
        setQueue(data.queue ?? []);
      }
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const venueRes = await fetch(`/api/venues/${id}`);
        if (venueRes.ok) {
          const data = await venueRes.json();
          setVenue(data.venue ?? data);
        }
        await fetchLiveData();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
    const stored = localStorage.getItem(`bidded_${id}`);
    if (stored) setBiddedItems(new Set(JSON.parse(stored)));
    const checkin = localStorage.getItem(`checkin_${id}`);
    if (checkin) setCheckedIn(true);
  }, [id, fetchLiveData]);

  // Poll every 15s for live updates
  useEffect(() => {
    const interval = setInterval(fetchLiveData, 15000);
    return () => clearInterval(interval);
  }, [fetchLiveData]);
  async function handleCheckIn() {
    setCheckingIn(true);
    try {
      const res = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ venue_id: id }),
      });
      if (res.ok) {
        setCheckedIn(true);
        localStorage.setItem(`checkin_${id}`, 'true');
        await fetchLiveData();
      } else {
        // Fallback local si no hay sesion
        setCheckedIn(true);
        localStorage.setItem(`checkin_${id}`, 'true');
      }
    } catch {
      setCheckedIn(true);
      localStorage.setItem(`checkin_${id}`, 'true');
    } finally {
      setCheckingIn(false);
    }
  }

  async function handleCheckOut() {
    try {
      await fetch('/api/checkin', { method: 'DELETE' });
    } catch { /* ignore */ }
    setCheckedIn(false);
    localStorage.removeItem(`checkin_${id}`);
    await fetchLiveData();
  }

  async function handleBid(queueItemId: string) {
    if (!checkedIn || biddedItems.has(queueItemId)) return;
    setBiddingId(queueItemId);
    try {
      const res = await fetch('/api/queue/puja', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ venue_id: id, queue_item_id: queueItemId }),
      });
      if (res.ok) {
        const newBidded = new Set(biddedItems).add(queueItemId);
        setBiddedItems(newBidded);
        localStorage.setItem(`bidded_${id}`, JSON.stringify([...newBidded]));
        await fetchLiveData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBiddingId(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Cargando local...</p>
        </div>
      </div>
    );
  }

  const displayVenue = venue ?? { id, name: 'Local', open: true };
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <div className="relative h-64">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${displayVenue.cover_url ?? 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200'})`, filter: 'brightness(0.4)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-black/40 to-pink-900/60" />
        <Link href="/venues" className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-full text-sm hover:bg-black/70">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Locales
        </Link>
        <Link href={`/venues/${id}/qr`} className="absolute top-4 right-4 z-10 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-full text-sm hover:bg-black/70">QR</Link>
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${displayVenue.open ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
              {displayVenue.open ? '● Abierto' : '● Cerrado'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-gray-300">{visitors} visitantes</span>
          </div>
          <h1 className="text-3xl font-bold">{displayVenue.name}</h1>
          {displayVenue.address && <p className="text-gray-400 text-sm mt-1">{displayVenue.address}{displayVenue.city ? `, ${displayVenue.city}` : ''}</p>}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Check-in / Check-out */}
        {!checkedIn ? (
          <div className="mb-8 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">📍</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">¿Estás aquí?</h3>
                <p className="text-gray-400 text-sm mt-1">Haz check-in para pujar por las canciones</p>
              </div>
              <button onClick={handleCheckIn} disabled={checkingIn}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition-all disabled:opacity-50">
                {checkingIn ? 'Registrando...' : 'Check-in ✓'}
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-8 bg-green-900/20 border border-green-500/30 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">✓</div>
              <div>
                <p className="font-medium text-green-400">¡Check-in realizado!</p>
                <p className="text-sm text-gray-400">Ahora puedes pujar por las canciones</p>
              </div>
            </div>
            <button onClick={handleCheckOut} className="text-xs text-gray-500 hover:text-red-400 transition-colors">Salir</button>
          </div>
        )}
        {/* Now Playing */}
        {nowPlaying && (
          <div className="mb-8 bg-gradient-to-r from-green-900/30 to-teal-900/30 border border-green-500/30 rounded-2xl p-5">
            <p className="text-xs text-green-400 font-semibold uppercase tracking-wider mb-3">Sonando ahora</p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {nowPlaying.songs.cover ? <img src={nowPlaying.songs.cover} alt={nowPlaying.songs.title} className="w-full h-full object-cover" /> : <span className="text-2xl">🎵</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-lg truncate">{nowPlaying.songs.title}</p>
                <p className="text-gray-400 truncate">{nowPlaying.songs.artist}</p>
              </div>
              <div className="flex gap-1">
                {[0,1,2,3,4].map(i => <div key={i} className="w-1 bg-green-400 rounded-full animate-pulse" style={{ height: `${8 + Math.random() * 16}px`, animationDelay: `${i * 0.1}s` }} />)}
              </div>
            </div>
          </div>
        )}

        {/* Cola musical */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">🎵</span> Cola musical
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              En vivo
            </div>
          </div>

          {checkedIn && (
            <p className="mb-4 text-sm text-gray-400 flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Pulsa ▲ para pujar por una canción (consume 1 crédito)
            </p>
          )}

          <div className="space-y-3">
            {queue.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-4xl mb-3">🎶</p>
                <p>La cola está vacía. ¡Sé el primero en pujar una canción!</p>
              </div>
            ) : queue.map((item, index) => {
              const hasBidded = biddedItems.has(item.id);
              const isBidding = biddingId === item.id;
              return (
                <div key={item.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  index === 0 ? 'bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-purple-500/40' : 'bg-white/5 border-white/10 hover:bg-white/8'
                }`}>
                  <div className={`text-lg font-bold w-8 text-center ${
                    index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-600' : 'text-gray-600'
                  }`}>{index === 0 ? '👑' : `#${index + 1}`}</div>
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {item.songs.cover ? <img src={item.songs.cover} alt={item.songs.title} className="w-full h-full object-cover" /> : <span className="text-xl">🎵</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{item.songs.title}</p>
                    <p className="text-sm text-gray-400 truncate">{item.songs.artist}</p>
                  </div>
                  <div className="text-center">
                    <p className={`text-lg font-bold ${index === 0 ? 'text-purple-400' : 'text-gray-400'}`}>{item.bids}</p>
                    <p className="text-xs text-gray-600">pujas</p>
                  </div>
                  <button onClick={() => handleBid(item.id)} disabled={!checkedIn || hasBidded || isBidding}
                    className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all ${
                      !checkedIn ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                      : hasBidded ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : isBidding ? 'bg-purple-600/50 animate-pulse cursor-wait'
                      : 'bg-purple-600 hover:bg-purple-500 active:scale-90 cursor-pointer'
                    }`}>
                    {isBidding ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : hasBidded ? <>✓<span>Pujado</span></>
                      : <>▲<span>Puja</span></>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
