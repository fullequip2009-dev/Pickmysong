import { NextRequest, NextResponse } from 'next/server';
import { getVenues } from '../../../lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || undefined;
  const open = searchParams.has('open') ? searchParams.get('open') === 'true' : undefined;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

  const venues = getVenues({ type, open, limit });

  return NextResponse.json({
    venues,
    total: venues.length,
  });
}
