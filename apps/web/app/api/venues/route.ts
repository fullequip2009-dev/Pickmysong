import { NextRequest, NextResponse } from 'next/server';
import { getVenues } from '../../../lib/db';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const open = searchParams.get('open');
  const search = searchParams.get('search') || undefined;
  const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : undefined;
  const lng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : undefined;
  const radius = searchParams.get('radius') ? parseFloat(searchParams.get('radius')!) : 10;

  if (SUPABASE_URL) {
    try {
      const { createServerSupabaseClient } = await import('../../../lib/supabase');
      const supabase = await createServerSupabaseClient();

      let query = supabase
        .from('venues')
        .select('*')
        .order('name', { ascending: true });

      if (open === 'true') query = query.eq('open', true);
      if (search) query = query.ilike('name', `%${search}%`);

      const { data, error } = await query;
      if (error) throw error;

      let venues = data ?? [];

      if (lat !== undefined && lng !== undefined) {
        venues = venues.filter((v: any) => {
          if (!v.lat || !v.lng) return true;
          const dlat = (v.lat - lat) * (Math.PI / 180);
          const dlng = (v.lng - lng) * (Math.PI / 180);
          const a =
            Math.sin(dlat / 2) ** 2 +
            Math.cos(lat * (Math.PI / 180)) *
              Math.cos(v.lat * (Math.PI / 180)) *
              Math.sin(dlng / 2) ** 2;
          const dist = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return dist <= radius;
        });
      }

      return NextResponse.json({ venues, total: venues.length });
    } catch (err) {
      console.error('[/api/venues] Supabase error, falling back:', err);
    }
  }

  let venues = getVenues({ open: open === 'true' ? true : open === 'false' ? false : undefined });
  if (search) {
    venues = venues.filter(v =>
      v.name.toLowerCase().includes(search.toLowerCase())
    );
  }
  return NextResponse.json({ venues, total: venues.length });
}
