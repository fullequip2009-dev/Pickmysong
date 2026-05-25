import { NextRequest, NextResponse } from 'next/server';
import { getPlaylists, createPlaylist } from '../../../lib/db';

// GET /api/playlists?venueId=&limit=
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const venueId = searchParams.get('venueId') ?? undefined;
    const limit   = Number(searchParams.get('limit') ?? 50);
    const { data, total } = getPlaylists({ venueId, limit });
    return NextResponse.json({ data, meta: { total, limit } }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch playlists', details: String(err) }, { status: 500 });
  }
}

// POST /api/playlists
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name?.trim()) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }
    const playlist = createPlaylist(body);
    return NextResponse.json({ data: playlist }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create playlist', details: String(err) }, { status: 500 });
  }
}
