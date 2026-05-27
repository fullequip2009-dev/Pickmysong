// ============================================================
// Pickmysong — Supabase Database Types
// Auto-generate with: supabase gen types typescript --local > lib/database.types.ts
// ============================================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          handle: string;
          name: string;
          avatar: string;
          bio: string | null;
          plan: 'free' | 'premium';
          role: 'user' | 'venue_owner' | 'artist' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          handle: string;
          name: string;
          avatar?: string;
          bio?: string | null;
          plan?: 'free' | 'premium';
          role?: 'user' | 'venue_owner' | 'artist' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          handle?: string;
          name?: string;
          avatar?: string;
          bio?: string | null;
          plan?: 'free' | 'premium';
          role?: 'user' | 'venue_owner' | 'artist' | 'admin';
          updated_at?: string;
        };
      };
      songs: {
        Row: {
          id: string;
          title: string;
          artist: string;
          genre: string;
          bpm: number;
          votes: number;
          plays: number;
          cover: string;
          color: string;
          trend: number;
          duration: string | null;
          release_year: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          artist: string;
          genre: string;
          bpm?: number;
          votes?: number;
          plays?: number;
          cover?: string;
          color?: string;
          trend?: number;
          duration?: string | null;
          release_year?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['songs']['Insert']>;
      };
      artists: {
        Row: {
          id: string;
          name: string;
          handle: string;
          bio: string;
          genre: string;
          followers: number;
          songs_count: number;
          plays: number;
          avatar: string;
          color: string;
          verified: boolean;
          trending: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          handle: string;
          bio?: string;
          genre: string;
          followers?: number;
          songs_count?: number;
          plays?: number;
          avatar?: string;
          color?: string;
          verified?: boolean;
          trending?: boolean;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['artists']['Insert']>;
      };
      venues: {
        Row: {
          id: string;
          owner_id: string | null;
          name: string;
          type: 'Club' | 'Bar' | 'Rave' | 'Lounge' | 'Restaurant' | 'Festival';
          city: string;
          address: string;
          vibe: string;
          capacity: number;
          current_visitors: number;
          rating: number;
          open: boolean;
          current_song_id: string | null;
          avatar: string;
          color: string;
          tags: string[];
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['venues']['Row'], 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<Database['public']['Tables']['venues']['Insert']>;
      };
      playlists: {
        Row: {
          id: string;
          creator_id: string | null;
          venue_id: string | null;
          name: string;
          description: string;
          cover: string;
          color: string;
          tags: string[];
          likes: number;
          public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          creator_id?: string | null;
          venue_id?: string | null;
          name: string;
          description?: string;
          cover?: string;
          color?: string;
          tags?: string[];
          likes?: number;
          public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['playlists']['Insert']>;
      };
      playlist_songs: {
        Row: {
          playlist_id: string;
          song_id: string;
          position: number;
          added_at: string;
        };
        Insert: {
          playlist_id: string;
          song_id: string;
          position?: number;
          added_at?: string;
        };
        Update: Partial<Database['public']['Tables']['playlist_songs']['Insert']>;
      };
      votes: {
        Row: {
          id: string;
          user_id: string;
          song_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          song_id: string;
          created_at?: string;
        };
        Update: never;
      };
      follows: {
        Row: {
          user_id: string;
          artist_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          artist_id: string;
          created_at?: string;
        };
        Update: never;
      };
      playlist_likes: {
        Row: {
          user_id: string;
          playlist_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          playlist_id: string;
          created_at?: string;
        };
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: {
      toggle_vote: {
        Args: { p_song_id: string; p_user_id: string };
        Returns: Json;
      };
    };
    Enums: Record<string, never>;
  };
};

// ─── Helper types ─────────────────────────────────────────────
type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

export type DBProfile       = Tables<'profiles'>;
export type DBSong          = Tables<'songs'>;
export type DBArtist        = Tables<'artists'>;
export type DBVenue         = Tables<'venues'>;
export type DBPlaylist      = Tables<'playlists'>;
export type DBPlaylistSong  = Tables<'playlist_songs'>;
export type DBVote          = Tables<'votes'>;
export type DBFollow        = Tables<'follows'>;
export type DBPlaylistLike  = Tables<'playlist_likes'>;
