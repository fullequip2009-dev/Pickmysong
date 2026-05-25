import { NextRequest, NextResponse } from 'next/server';
import { getSongs, createSong } from '../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const genre  = searchParams.get('genre')  ?? undefined;
    const limit  = Number(searchParams.get('limit')  ?? 50);
    const offset = Number(searchParams.get('offset') ?? 0);
    const { data, total } = getSongs({ genre, limit, offset });
    return NextResponse.json({ data, meta: { total, page: Math.floor(offset / limit) + 1, limit } }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch songs', details: String(err) }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.title?.trim()) return NextResponse.json({ error: 'title is required' }, { status: 400 });
    if (!body.artist?.trim()) return NextResponse.json({ error: 'artist is required' }, { status: 400 });
    const song = createSong(body);
    return NextResponse.json({ data: song }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create song', details: String(err) }, { status: 500 });
  }
}
