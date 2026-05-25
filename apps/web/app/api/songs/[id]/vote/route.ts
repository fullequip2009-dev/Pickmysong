import { NextRequest, NextResponse } from 'next/server';
import { voteSong } from '../../../../../lib/db';

// POST /api/songs/[id]/vote
// Body: { userId: string }  (use fingerprint or auth token in production)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await request.json();

    if (!userId?.trim()) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const result = voteSong(params.id, userId);

    if (!result) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    return NextResponse.json({ data: { songId: params.id, ...result } }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to vote', details: String(err) }, { status: 500 });
  }
}
