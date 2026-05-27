// ============================================================
// Pickmysong — Shared TypeScript Types
// ============================================================

export type Genre =
  | 'Funk'
  | 'Electronic'
  | 'Rave'
  | 'R&B'
  | 'Neo-soul'
  | 'Grime'
  | 'Trap'
  | 'Hip-hop'
  | 'House'
  | 'Brazilian Pop'
  | 'Afrobeat'
  | 'World';

// ─── Song ─────────────────────────────────────────────────────
export interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  votes: number;
  plays: number;
  cover: string;          // emoji or image URL
  color: string;          // tailwind gradient classes
  trend: number;          // % change in votes (last 24h)
  duration?: string;      // e.g. "3:24"
  releaseYear?: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Artist ───────────────────────────────────────────────────
export interface Artist {
  id: string;
  name: string;
  handle: string;
  bio: string;
  genre: string;
  followers: number;
  songs: number;
  plays: number;
  avatar: string;
  color: string;
  verified: boolean;
  trending: boolean;
  createdAt: string;
}

// ─── Venue ────────────────────────────────────────────────────
export interface Venue {
  id: string;
  name: string;
  type: 'Club' | 'Bar' | 'Rave' | 'Lounge' | 'Restaurant' | 'Festival';
  city: string;
  address: string;
  vibe: string;
  capacity: number;
  currentVisitors: number;
  rating: number;
  open: boolean;
  currentSongId?: string;
  playlistId?: string;
  avatar: string;
  color: string;
  tags: string[];
  createdAt: string;
}

// ─── Playlist ─────────────────────────────────────────────────
export interface Playlist {
  id: string;
  name: string;
  description: string;
  cover: string;
  color: string;
  tags: string[];
  songIds: string[];
  likes: number;
  public: boolean;
  venueId?: string;
  creatorId?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Vote ─────────────────────────────────────────────────────
export interface Vote {
  id: string;
  songId: string;
  userId: string;
  createdAt: string;
}

// ─── User ─────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  handle: string;
  avatar: string;
  bio?: string;
  plan: 'free' | 'premium';
  role?: 'user' | 'venue_owner' | 'artist' | 'admin';
  followedArtistIds?: string[];
  likedPlaylistIds?: string[];
  votedSongIds?: string[];
  createdAt: string;
}

// ─── API Response Types ────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  limit?: number;
  error?: string;
}

export interface SongsResponse extends ApiResponse<Song[]> {}
export interface ArtistsResponse extends ApiResponse<Artist[]> {}
export interface VenuesResponse extends ApiResponse<Venue[]> {}
export interface PlaylistsResponse extends ApiResponse<Playlist[]> {}

export interface VoteResponse {
  votes: number;
  userVoted: boolean;
}

export interface AuthResponse {
  user: Omit<User, 'bio' | 'followedArtistIds' | 'likedPlaylistIds' | 'votedSongIds'>;
  token: string;
  message: string;
}

// ─── Dashboard Types ───────────────────────────────────────────
export interface DashboardStat {
  label: string;
  value: string | number;
  delta: string;
  icon: string;
  color: string;
}

export interface DashboardStats {
  stats: DashboardStat[];
  topSongs: Array<{
    rank: number;
    title: string;
    artist: string;
    votes: number;
    plays: number;
    trend: number;
  }>;
  weeklyData: Array<{
    day: string;
    votes: number;
    plays: number;
  }>;
}
