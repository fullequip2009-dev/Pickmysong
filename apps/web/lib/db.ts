// ============================================================
// Pickmysong — In-Memory Data Layer (mock DB)
// Replace with Supabase/Prisma calls when backend is ready
// ============================================================

import type { Song, Artist, Venue, Playlist, Vote, User } from './types';

// ─── Seed Data ───────────────────────────────────────────────

const now = new Date().toISOString();

export const songs: Song[] = [
  { id: 's1', title: 'MONTAGEM CYBERPUNK', artist: 'DJ KL Jay', genre: 'Funk', bpm: 138, votes: 2847, plays: 18400, cover: '\uD83C\uDFB5', color: 'from-purple-600 to-pink-600', trend: 12, createdAt: now, updatedAt: now },
  { id: 's2', title: 'RAVE DE FAVELA', artist: 'MC Lan & Diplo', genre: 'Rave', bpm: 150, votes: 2341, plays: 15200, cover: '\uD83D\uDD25', color: 'from-orange-600 to-red-600', trend: 8, createdAt: now, updatedAt: now },
  { id: 's3', title: 'NEON NIGHTS', artist: 'Future Classic', genre: 'R&B', bpm: 94, votes: 1987, plays: 12800, cover: '\uD83C\uDF19', color: 'from-blue-600 to-cyan-500', trend: 5, createdAt: now, updatedAt: now },
  { id: 's4', title: 'ASPHALT GOLD', artist: 'Skepta feat. Young Thug', genre: 'Grime', bpm: 140, votes: 1654, plays: 10100, cover: '\uD83D\uDC51', color: 'from-yellow-500 to-amber-600', trend: 3, createdAt: now, updatedAt: now },
  { id: 's5', title: 'MADRUGADA', artist: 'Cleo & Biel', genre: 'Brazilian Pop', bpm: 110, votes: 1432, plays: 8400, cover: '\uD83C\uDF03', color: 'from-indigo-600 to-purple-500', trend: 2, createdAt: now, updatedAt: now },
  { id: 's6', title: 'SILK ROAD', artist: 'Kaytranada', genre: 'Electronic', bpm: 122, votes: 1201, plays: 8900, cover: '\uD83C\uDFB6', color: 'from-emerald-600 to-teal-500', trend: 1, createdAt: now, updatedAt: now },
];

export const artists: Artist[] = [
  { id: 'a1', name: 'DJ KL Jay', handle: '@djkljay', bio: 'Pionero del funk electr\u00f3nico. S\u00e3o Paulo, Brasil.', genre: 'Funk / Electronic', followers: 48200, songs: 34, plays: 1240000, avatar: '\uD83C\uDFB5', color: 'from-purple-600 to-pink-600', verified: true, trending: true, createdAt: now },
  { id: 'a2', name: 'Future Classic', handle: '@futureclassic', bio: 'R&B con alma de neo-soul y ciudad de noche.', genre: 'R&B / Neo-soul', followers: 31500, songs: 22, plays: 890000, avatar: '\uD83C\uDF19', color: 'from-blue-600 to-cyan-500', verified: true, trending: false, createdAt: now },
  { id: 'a3', name: 'Kaytranada', handle: '@kaytranada', bio: 'Montreal en el dancefloor. House con sabor propio.', genre: 'Electronic / House', followers: 95100, songs: 67, plays: 4100000, avatar: '\uD83C\uDFB6', color: 'from-emerald-600 to-teal-500', verified: true, trending: true, createdAt: now },
  { id: 'a4', name: 'MC Lan', handle: '@mclan', bio: 'Funk carioca al mundo. Voz del asfalto.', genre: 'Funk / Rave', followers: 72300, songs: 89, plays: 6700000, avatar: '\uD83D\uDD25', color: 'from-orange-600 to-red-600', verified: false, trending: true, createdAt: now },
  { id: 'a5', name: 'Skepta', handle: '@skepta', bio: 'El grime no tiene l\u00edmites. North London forever.', genre: 'Grime / Trap', followers: 183000, songs: 112, plays: 12400000, avatar: '\uD83D\uDC51', color: 'from-yellow-500 to-amber-600', verified: true, trending: false, createdAt: now },
];

export const venues: Venue[] = [
  { id: 'v1', name: 'Club Nocturno BRLND', type: 'Club', city: 'Barcelona', address: 'Carrer de la Marina, 19', vibe: 'Dark Techno / Industrial', capacity: 500, currentVisitors: 340, rating: 4.8, open: true, currentSongId: 's1', playlistId: 'p1', avatar: '\uD83C\uDF0C', color: 'from-purple-900 to-black', tags: ['Techno', 'Dark', 'Industrial'], createdAt: now },
  { id: 'v2', name: 'Terraza del Sol', type: 'Bar', city: 'Madrid', address: 'Gran V\u00eda, 45', vibe: 'R&B / Neo-soul', capacity: 200, currentVisitors: 120, rating: 4.5, open: true, currentSongId: 's3', playlistId: 'p2', avatar: '\u2600\uFE0F', color: 'from-orange-900 to-amber-900', tags: ['R&B', 'Chill'], createdAt: now },
  { id: 'v3', name: "Raver's Paradise", type: 'Rave', city: 'Berlin', address: 'Revaler Str. 99', vibe: 'Rave / Hardcore', capacity: 1200, currentVisitors: 800, rating: 4.9, open: true, currentSongId: 's2', playlistId: 'p3', avatar: '\uD83D\uDD25', color: 'from-red-900 to-orange-900', tags: ['Rave', 'Hardcore'], createdAt: now },
  { id: 'v4', name: 'Gold Lounge', type: 'Lounge', city: 'Miami', address: 'Ocean Drive, 1201', vibe: 'Hip-hop / Trap', capacity: 150, currentVisitors: 90, rating: 4.3, open: false, avatar: '\uD83D\uDC8E', color: 'from-yellow-900 to-amber-800', tags: ['Hip-hop', 'VIP'], createdAt: now },
];

export const playlists: Playlist[] = [
  { id: 'p1', name: 'Noches de Ne\u00f3n', description: 'Para cuando la ciudad no duerme', cover: '\uD83C\uDF19', color: 'from-blue-900 to-purple-900', tags: ['Electronic', 'Ambient'], songIds: ['s3', 's6', 's1'], likes: 847, public: true, venueId: 'v1', createdAt: now, updatedAt: now },
  { id: 'p2', name: 'Trap Moda', description: 'Los beats que visten mejor', cover: '\uD83D\uDC8E', color: 'from-gray-900 to-zinc-800', tags: ['Trap', 'Hip-hop'], songIds: ['s4', 's2'], likes: 623, public: true, createdAt: now, updatedAt: now },
  { id: 'p3', name: 'Funk do Futuro', description: 'El funk que viene del ma\u00f1ana', cover: '\uD83D\uDD25', color: 'from-orange-900 to-red-900', tags: ['Funk', 'Electronic'], songIds: ['s1', 's2', 's5'], likes: 1240, public: true, venueId: 'v3', createdAt: now, updatedAt: now },
  { id: 'p4', name: 'Soul & Seda', description: 'Suavidad con actitud', cover: '\uD83C\uDF38', color: 'from-pink-900 to-rose-900', tags: ['R&B', 'Soul'], songIds: ['s3', 's5'], likes: 512, public: true, createdAt: now, updatedAt: now },
];

// In-memory votes store
export const votes: Vote[] = [];

// In-memory users store
export const users: User[] = [];

// ─── Query Helpers ────────────────────────────────────────────

/** Get songs sorted by votes desc, with optional genre filter */
export function getSongs(opts?: { genre?: string; limit?: number; offset?: number }) {
  let result = [...songs];
  if (opts?.genre && opts.genre !== 'Todos') {
    result = result.filter((s) => s.genre.toLowerCase().includes(opts.genre!.toLowerCase()));
  }
  result.sort((a, b) => b.votes - a.votes);
  const offset = opts?.offset ?? 0;
  const limit = opts?.limit ?? 50;
  return { data: result.slice(offset, offset + limit), total: result.length };
}

export function getSongById(id: string): Song | undefined {
  return songs.find((s) => s.id === id);
}

export function createSong(input: Partial<Song>): Song {
  const song: Song = {
    id: 's' + (songs.length + 1),
    title: input.title ?? 'Untitled',
    artist: input.artist ?? 'Unknown',
    genre: input.genre ?? 'Electronic',
    bpm: input.bpm ?? 120,
    votes: 0,
    plays: 0,
    cover: input.cover ?? '\uD83C\uDFB5',
    color: input.color ?? 'from-purple-600 to-pink-600',
    trend: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  songs.push(song);
  return song;
}

/** Vote for a song. Returns updated vote count. */
export function voteSong(songId: string, userId: string): { votes: number; userVoted: boolean } | null {
  const song = songs.find((s) => s.id === songId);
  if (!song) return null;

  const existing = votes.find((v) => v.songId === songId && v.userId === userId);
  if (existing) {
    // Toggle off
    const idx = votes.indexOf(existing);
    votes.splice(idx, 1);
    song.votes = Math.max(0, song.votes - 1);
    song.updatedAt = new Date().toISOString();
    return { votes: song.votes, userVoted: false };
  }

  votes.push({ id: 'v' + Date.now(), songId, userId, createdAt: new Date().toISOString() });
  song.votes += 1;
  song.updatedAt = new Date().toISOString();
  return { votes: song.votes, userVoted: true };
}

export function getPlaylists(opts?: { venueId?: string; limit?: number }) {
  let result = [...playlists];
  if (opts?.venueId) result = result.filter((p) => p.venueId === opts.venueId);
  result.sort((a, b) => b.likes - a.likes);
  return { data: result.slice(0, opts?.limit ?? 50), total: result.length };
}

export function getPlaylistById(id: string): Playlist | undefined {
  return playlists.find((p) => p.id === id);
}

export function createPlaylist(input: Partial<Playlist>): Playlist {
  const playlist: Playlist = {
    id: 'p' + (playlists.length + 1),
    name: input.name ?? 'Nueva playlist',
    description: input.description ?? '',
    cover: input.cover ?? '\uD83C\uDFB5',
    color: input.color ?? 'from-purple-900 to-black',
    tags: input.tags ?? [],
    songIds: input.songIds ?? [],
    likes: 0,
    public: input.public ?? true,
    venueId: input.venueId,
    ownerId: input.ownerId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  playlists.push(playlist);
  return playlist;
}

export function getArtists(opts?: { genre?: string; limit?: number }) {
  let result = [...artists];
  if (opts?.genre && opts.genre !== 'Todos') {
    result = result.filter((a) => a.genre.toLowerCase().includes(opts.genre!.toLowerCase()));
  }
  return { data: result.slice(0, opts?.limit ?? 50), total: result.length };
}

export function getVenues(opts?: { type?: string; open?: boolean; limit?: number }) {
  let result = [...venues];
  if (opts?.type && opts.type !== 'Todos') result = result.filter((v) => v.type === opts.type);
  if (opts?.open !== undefined) result = result.filter((v) => v.open === opts.open);
  return { data: result.slice(0, opts?.limit ?? 50), total: result.length };
}
