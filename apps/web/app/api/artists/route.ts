import { NextRequest, NextResponse } from 'next/server';
import { getArtists } from '../../../lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const genre = searchParams.get('genre') || undefined;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

  const artists = getArtists({ genre, limit });

  return NextResponse.json({
    artists,
    total: artists.length,
  });
}
