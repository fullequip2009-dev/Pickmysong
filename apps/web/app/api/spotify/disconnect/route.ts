import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { venue_id } = await request.json();

    if (!venue_id) {
      return NextResponse.json(
        { error: 'venue_id is required' },
        { status: 400 }
      );
    }

    // Delete the Spotify tokens for this venue
    const { error } = await supabase
      .from('spotify_tokens')
      .delete()
      .eq('venue_id', venue_id);

    if (error) {
      console.error('Error disconnecting Spotify:', error);
      return NextResponse.json(
        { error: 'Failed to disconnect Spotify' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in disconnect route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
