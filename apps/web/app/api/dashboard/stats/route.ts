import { NextResponse } from 'next/server';
import { getSongs, getPlaylists, getArtists, getVenues } from '../../../../lib/db';

export async function GET() {
  const songs = getSongs({});
  const playlists = getPlaylists({});
  const artists = getArtists({});
  const venues = getVenues({});

  const totalVotes = songs.reduce((acc, song) => acc + song.votes, 0);
  const totalPlays = songs.reduce((acc, song) => acc + song.plays, 0);
  const openVenues = venues.filter((v) => v.isOpen).length;

  // Top songs by votes
  const topSongs = [...songs]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 5)
    .map((s) => ({ id: s.id, title: s.title, artist: s.artist, votes: s.votes, plays: s.plays }));

  // Weekly chart mock data (last 7 days)
  const weeklyData = [
    { day: 'Lun', votes: 120, plays: 340 },
    { day: 'Mar', votes: 95, plays: 280 },
    { day: 'Mie', votes: 180, plays: 510 },
    { day: 'Jue', votes: 140, plays: 420 },
    { day: 'Vie', votes: 220, plays: 680 },
    { day: 'Sab', votes: 310, plays: 890 },
    { day: 'Dom', votes: 260, plays: 740 },
  ];

  return NextResponse.json({
    stats: {
      totalSongs: songs.length,
      totalVotes,
      totalPlays,
      totalPlaylists: playlists.length,
      totalArtists: artists.length,
      totalVenues: venues.length,
      openVenues,
    },
    topSongs,
    weeklyData,
  });
}
