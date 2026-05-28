'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Song {
  id: string;
  title: string;
  artist: string;
  votes: number;
  cover_url?: string;
  duration?: number;
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
  lat?: number;
  lng?: number;
}

export default function VenuePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [venue, setVenue] = useState<Venue | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedSongs, setVotedSongs] = useState<Set<string>>(new Set());
  const [checkedIn, setCheckedIn] = useState(false);
  const [votingId, setVotingId] = useState<string | null>(null);

  useEffect(() => {
    fetchVenueData();
    const stored = localStorage.getItem(`voted_${id}`);
    if (stored) setVotedSongs(new Set(JSON.parse(stored)));
    const checkin = localStorage.getItem(`checkin_${id}`);
    if (checkin) setCheckedIn(true);
  }, [id]);

  async function fetchVenueData() {
    setLoading(true);
    try {
      const [venueRes, songsRes] = await Promise.all([
        fetch(`/api/venues/${id}`),
        fetch(`/api/songs?venueId=${id}&limit=20`),
      ]);

      if (venueRes.ok) {
        const data = await venueRes.json();
        setVenue(data.venue);
      }
      if (songsRes.ok) {
        const data = await songsRes.json();
        setSongs(data.songs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleVote(songId: string) {
    if (!checkedIn) {
      alert('Debes hacer check-in primero para votar');
      return;
    }
    if (votedSongs.has(songId)) return;

    setVotingId(songId);
    try {
      const res = await fetch(`/api/songs/${songId}/vote`, { method: 'POST' });
      if (res.ok) {
        const newVoted = new Set(votedSongs).add(songId);
        setVotedSongs(newVoted);
        localStorage.setItem(`voted_${id}`, JSON.stringify([...newVoted]));
        setSongs(prev =>
          prev
            .map(s => s.id === songId ? { ...s, votes: s.votes + 1 } : s)
            .sort((a, b) => b.votes - a.votes)
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVotingId(null);
    }
  }

  function handleCheckIn() {
    setCheckedIn(true);
    localStorage.setItem(`checkin_${id}`, 'true');
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

  // Mock venue data if API not configured
  const displayVenue = venue ?? {
    id,
    name: 'The Jazz Corner',
    address: 'Calle Gran Vía 45',
    city: 'Madrid',
    type: 'bar',
    open: true,
    description: 'El mejor jazz en vivo de Madrid. Ambiente acogedor, cócteles artesanales.',
  };

  const displaySongs = songs.length > 0 ? songs : [
    { id: '1', title: 'Blue in Green', artist: 'Miles Davis', votes: 24 },
    { id: '2', title: 'Autumn Leaves', artist: 'Bill Evans', votes: 18 },
    { id: '3', title: 'Take Five', artist: 'Dave Brubeck', votes: 15 },
    { id: '4', title: 'So What', artist: 'Miles Davis', votes: 12 },
    { id: '5', title: 'Round Midnight', artist: 'Thelonious Monk', votes: 9 },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero banner */}
      <div className="relative h-64 md:h-96">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-black/40 to-pink-900/60" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${displayVenue.cover_url ?? 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200'})`,
            filter: 'brightness(0.4)',
          }}
        />

        {/* Back button */}
        <Link
          href="/venues"
          className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-full text-sm hover:bg-black/70 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Locales
        </Link>

        {/* QR & Share buttons */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <Link
            href={`/venues/${id}/qr`}
            className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-full text-sm hover:bg-black/70 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            QR
          </Link>
        </div>

        {/* Venue info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${displayVenue.open ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                  {displayVenue.open ? '● Abierto ahora' : '● Cerrado'}
                </span>
                {displayVenue.type && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300 border border-purple-500/30 capitalize">
                    {displayVenue.type}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-bold">{displayVenue.name}</h1>
              {displayVenue.address && (
                <p className="text-gray-400 mt-1 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {displayVenue.address}{displayVenue.city ? `, ${displayVenue.city}` : ''}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Check-in CTA */}
        {!checkedIn ? (
          <div className="mb-8 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="text-4xl">📍</div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">¿Estás aquí?</h3>
                <p className="text-gray-400 text-sm mt-1">Haz check-in para poder votar por las canciones que quieres escuchar</p>
              </div>
              <button
                onClick={handleCheckIn}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap"
              >
                Check-in ✓
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-8 bg-green-900/20 border border-green-500/30 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">✓</div>
            <div>
              <p className="font-medium text-green-400">¡Check-in realizado!</p>
              <p className="text-sm text-gray-400">Ahora puedes votar por las canciones que quieres escuchar</p>
            </div>
          </div>
        )}

        {/* Description */}
        {displayVenue.description && (
          <div className="mb-8">
            <p className="text-gray-300 leading-relaxed">{displayVenue.description}</p>
          </div>
        )}

        {/* Live playlist */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">🎵</span>
              Playlist en vivo
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Actualizándose en vivo
            </div>
          </div>

          {checkedIn && (
            <div className="mb-4 text-sm text-gray-400 flex items-center gap-2">
              <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Toca el botón ▲ para puja por la canción que quieres escuchar
            </div>
          )}

          <div className="space-y-3">
            {displaySongs.map((song, index) => {
              const hasVoted = votedSongs.has(song.id);
              const isVoting = votingId === song.id;
              return (
                <div
                  key={song.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    index === 0
                      ? 'bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-purple-500/40'
                      : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20'
                  }`}
                >
                  {/* Rank */}
                  <div className={`text-lg font-bold w-8 text-center ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-600' : 'text-gray-600'}`}>
                    {index === 0 ? '👑' : `#${index + 1}`}
                  </div>

                  {/* Cover */}
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {song.cover_url ? (
                      <img src={song.cover_url} alt={song.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">🎵</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{song.title}</p>
                    <p className="text-sm text-gray-400 truncate">{song.artist}</p>
                  </div>

                  {/* Vote count */}
                  <div className="text-center">
                    <p className={`text-lg font-bold ${index === 0 ? 'text-purple-400' : 'text-gray-400'}`}>{song.votes}</p>
                    <p className="text-xs text-gray-600">votos</p>
                  </div>

                  {/* Vote button */}
                  <button
                    onClick={() => handleVote(song.id)}
                    disabled={!checkedIn || hasVoted || isVoting}
                    className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all ${
                      !checkedIn
                        ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                        : hasVoted
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 cursor-default'
                        : isVoting
                        ? 'bg-purple-600/50 animate-pulse cursor-wait'
                        : 'bg-purple-600 hover:bg-purple-500 active:scale-90 cursor-pointer transform hover:scale-105'
                    }`}
                  >
                    {isVoting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : hasVoted ? (
                      <>✓<span>Votado</span></>
                    ) : (
                      <>▲<span>Puja</span></>
                    )}
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
