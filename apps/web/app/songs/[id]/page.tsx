// @ts-nocheck
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  votes: number;
  plays: number;
  duration?: number;
  cover_url?: string;
  spotify_url?: string;
  venueId?: string;
  playlistId?: string;
}

// Demo songs for fallback
const DEMO_SONGS: Song[] = [
  { id: 'song-1', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', genre: 'Pop', votes: 234, plays: 1820, duration: 200, cover_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300' },
  { id: 'song-2', title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', genre: 'Pop', votes: 198, plays: 1540, duration: 203, cover_url: 'https://images.unsplash.com/photo-1571266752821-e2ceec3e9a92?w=300' },
  { id: 'song-3', title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', album: 'F*CK LOVE 3', genre: 'Hip-Hop', votes: 187, plays: 1320, duration: 141, cover_url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300' },
  { id: 'song-4', title: 'Peaches', artist: 'Justin Bieber', album: 'Justice', genre: 'R&B', votes: 156, plays: 1150, duration: 198, cover_url: 'https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?w=300' },
  { id: 'song-5', title: 'Montero', artist: 'Lil Nas X', album: 'Montero', genre: 'Pop', votes: 143, plays: 980, duration: 137, cover_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300' },
];

export default function SongDetailPage() {
  const params = useParams();
  const [song, setSong] = useState<Song | null>(null);
  const [voted, setVoted] = useState(false);
  const [votes, setVotes] = useState(0);
  const [loading, setLoading] = useState(false);
