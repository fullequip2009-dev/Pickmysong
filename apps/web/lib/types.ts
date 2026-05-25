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

// ─── Song ────────────────────────────────────────────────────
export interface Song {
  id: string;
  title: string;
  artist: string;
  genre: Genre | string;
  bpm: number;
  votes: number;
  plays: number;
  cover: string;        // emoji or URL
  color: string;        // tailwind gradient classes
  trend: number;        // % change (e.g. +12 or -3)
  createdAt: string;    // ISO date string
  updatedAt: string;
}

export interface SongCreateInput {
  title: string;
  artist: string;
  genre: string;
  bpm?: number;
  cover?: string;
}

export interface SongVoteResult {
  songId: string;
  votes: number;
  userVoted: boolean;
}

// ─── Artist ──────────────────────────────────────────────────
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

// ─── Venue ───────────────────────────────────────────────────
export interface Venue {
  id: string;
  name: string;
  type: 'Club' | 'Bar' | 'Rave' | 'Lounge' | 'Rooftop' | 'Other';
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
  ownerId?: string;
  venueId?: string;
  public: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistCreateInput {
  name: string;
  description?: string;
  cover?: string;
  tags?: string[];
  public?: boolean;
  venueId?: string;
}

// ─── Vote ─────────────────────────────────────────────────────
export interface Vote {
  id: string;
  songId: string;
  userId: string;    // anonymous fingerprint or auth id
  createdAt: string;
}

// ─── User ─────────────────────────────────────────────────────
export interface User {
  id: string;
  email?: string;
  username?: string;
  avatar?: string;
  role: 'user' | 'venue_owner' | 'admin';
  followedArtistIds: string[];
  likedPlaylistIds: string[];
  votedSongIds: string[];
  createdAt: string;
}

// ─── API Responses ────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ApiError {
  error: string;
  code?: string;
  details?: unknown;
}

// ─── Dashboard Analytics ──────────────────────────────────────
export interface DashboardStats {
  totalVotes: number;
  totalPlays: number;
  activeListeners: number;
  estimatedRevenue: number;
  voteDelta: number;   // percentage vs previous period
  playDelta: number;
  listenerDelta: number;
  revenueDelta: number;
}

export interface WeeklyDataPoint {
  day: string;
  votes: number;
  plays: number;
  listeners: number;
}
