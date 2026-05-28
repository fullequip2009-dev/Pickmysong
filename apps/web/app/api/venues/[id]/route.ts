import { NextRequest, NextResponse } from 'next/server';
import { getVenues } from '../../../../lib/db';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (SUPABASE_URL) {
    try {
      const { createServerSupabaseClient } = await import('../../../../lib/supabase');
      const supabase = await createServerSupabaseClient();

      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) return NextResponse.json({ venue: data });
    } catch (err) {
      console.error('[/api/venues/[id]] Supabase error, falling back:', err);
    }
  }

  const venues = getVenues({});
  const venue = venues.find(v => v.id === id);
  if (!venue) return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
  return NextResponse.json({ venue });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json();

  if (SUPABASE_URL) {
    try {
      const { createServerSupabaseClient } = await import('../../../../lib/supabase');
      const supabase = await createServerSupabaseClient();

      const { data, error } = await supabase
        .from('venues')
        .update(body)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ venue: data });
    } catch (err) {
      console.error('[/api/venues/[id] PATCH] error:', err);
      return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
}
