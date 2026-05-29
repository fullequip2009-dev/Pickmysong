// ============================================================
// Pickmysong — Supabase Database Types
// Auto-generate with: supabase gen types typescript --local > lib/database.types.ts
// ============================================================

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// Generic row type that allows any columns
type AnyRow = { [key: string]: Json | undefined };
type AnyInsert = { [key: string]: Json | undefined };
type AnyUpdate = { [key: string]: Json | undefined };

type GenericTable = {
  Row: AnyRow;
  Insert: AnyInsert;
  Update: AnyUpdate;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          handle: string;
          name: string;
          avatar: string | null;
          bio: string | null;
          plan: 'free' | 'premium';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          handle: string;
          name: string;
          avatar?: string | null;
          bio?: string | null;
          plan?: 'free' | 'premium';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          handle?: string;
          name?: string;
          avatar?: string | null;
          bio?: string | null;
          plan?: 'free' | 'premium';
          created_at?: string;
          updated_at?: string;
        };
      };
      songs: GenericTable;
      artists: GenericTable;
      playlists: GenericTable;
      venues: GenericTable;
      achievements: GenericTable;
      votes: GenericTable;
      playlist_songs: GenericTable;
      venue_playlists: GenericTable;
      [key: string]: GenericTable;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};
