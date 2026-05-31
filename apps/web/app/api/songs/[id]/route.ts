// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  if (SUPABASE_URL) {
    try {
      const { createServerSupabaseClient } = await import('../../../../lib/supabase');
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      if (!data) {
        return NextResponse.json({ error: 'Song not found' }, { status: 404 });
      }
      return NextResponse.json({ song: data });
    } catch (e) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }
  }

  return NextResponse.json({ error: 'Song not found' }, { status: 404 });
}
