import { NextResponse } from 'next/server';
import { getSongs, getPlaylists, getArtists, getVenues } from '../../../../lib/db';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function GET() {
  if (SUPABASE_URL) {
    try {
      const { createServerSupabaseClient } = await import('../../../../lib/supabase');
      const supabase = await createServerSupabaseClient();

      const [songsRes, playlistsRes, artistsRes, venuesRes, votesRes] = await Promise.all([
        supabase.from('songs').select('id, votes, plays', { count: 'exact' }),
        supabase.from('playlists').select('id', { count: 'exact' }),
        supabase.from('artists').select('id', { count: 'exact' }),
        supabase.from('venues').select('id, open', { count: 'exact' }),
        supabase.from('votes').select('id', { count: 'exact' }),
      ]);

      const songs = songsRes.data ?? [];
      const openVenues = (venuesRes.data ?? []).filter((v: any) => v.open).length;
      const totalVotes = songsRes.data?.reduce((acc: number, s: any) => acc + (s.votes ?? 0), 0) ?? 0;
      const totalPlays = songsRes.data?.reduce((acc: number, s: any) => acc + (s.plays ?? 0), 0) ?? 0;

      // Top songs by votes
      const topSongs = [...songs]
        .sort((a: any, b: any) => (b.votes ?? 0) - (a.votes ?? 0))
        .slice(0, 5);

      // Weekly data (mock chart using DB counts)
      const weeklyData = Array.from({ length: 7 }, (_, i) => {
        const day = new Date();
        day.setDate(day.getDate() - (6 - i));
        return {
          day: day.toLocaleDateString('es-ES', { weekday: 'short' }),
          votes: Math.floor(totalVotes / 7) + Math.floor(Math.random() * 20),
          plays: Math.floor(totalPlays / 7) + Math.floor(Math.random() * 50),
        };
      });

      return NextResponse.json({
        stats: {
          totalSongs: songsRes.count ?? songs.length,
          totalPlaylists: playlistsRes.count ?? 0,
          totalArtists: artistsRes.count ?? 0,
          totalVenues: venuesRes.count ?? 0,
          openVenues,
          totalVotes,
          totalPlays,
          topSongs,
          weeklyData,
        },
      });
    } catch (err) {
      console.error('[/api/dashboard/stats] Supabase error, falling back:', err);
    }
  }

  // Fallback mock
  const songs = getSongs({});
  const playlists = getPlaylists({});
  const artists = getArtists({});
  const venues = getVenues({});

  const totalVotes = songs.reduce((acc, song) => acc + song.votes, 0);
  const totalPlays = songs.reduce((acc, song) => acc + song.plays, 0);
  const openVenues = venues.filter(v => v.isOpen).length;

  const topSongs = [...songs].sort((a, b) => b.votes - a.votes).slice(0, 5);

  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - i));
    return {
      day: day.toLocaleDateString('es-ES', { weekday: 'short' }),
      votes: Math.floor(Math.random() * 100) + 20,
      plays: Math.floor(Math.random() * 200) + 50,
    };
  });

  return NextResponse.json({
    stats: {
      totalSongs: songs.length,
      totalPlaylists: playlists.length,
      totalArtists: artists.length,
      totalVenues: venues.length,
      openVenues,
      totalVotes,
      totalPlays,
      topSongs,
      weeklyData,
    },
  });
}
