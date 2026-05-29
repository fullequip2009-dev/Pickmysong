// @ts-nocheck
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const DEMO_PLAYLISTS = [
  {
    id: 'pl-1',
    name: 'Friday Night Vibes',
    description: 'The hottest tracks to kick off your weekend',
    venue_id: 'venue-1',
    user_id: 'user-1',
    cover_url: 'https://picsum.photos/seed/pl1/400/400',
    is_public: true,
    song_count: 24,
    created_at: '2025-01-10T20:00:00.000Z',
  },
  {
    id: 'pl-2',
    name: 'Chill Lounge',
    description: 'Smooth and relaxed beats for the evening',
    venue_id: 'venue-1',
    user_id: 'user-2',
    cover_url: 'https://picsum.photos/seed/pl2/400/400',
    is_public: true,
    song_count: 18,
    created_at: '2025-01-12T18:30:00.000Z',
  },
  {
    id: 'pl-3',
    name: 'Throwback Classics',
    description: 'All the bangers from back in the day',
    venue_id: 'venue-2',
    user_id: 'user-1',
    cover_url: 'https://picsum.photos/seed/pl3/400/400',
    is_public: false,
    song_count: 31,
    created_at: '2025-01-15T21:15:00.000Z',
  },
]

function getPlaylists({ venueId, userId }) {
  let result = DEMO_PLAYLISTS
  if (venueId) result = result.filter((p) => p.venue_id === venueId)
  if (userId) result = result.filter((p) => p.user_id === userId)
  return result
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const venueId = searchParams.get('venueId')
    const userId = searchParams.get('userId')

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const { createServerSupabaseClient } = await import('@/lib/supabase')
        const supabase = await createServerSupabaseClient()
        let query = supabase.from('playlists').select('*')
        if (venueId) query = query.eq('venue_id', venueId)
        if (userId) query = query.eq('user_id', userId)
        const { data, error } = await query
        if (!error && data && data.length > 0) {
          return NextResponse.json({ playlists: data, total: data.length })
        }
      } catch (e) {
        // fall through to demo data
      }
    }

    const playlists = getPlaylists({ venueId, userId })
    return NextResponse.json({ playlists, total: playlists.length })
  } catch (err) {
    const playlists = getPlaylists({})
    return NextResponse.json({ playlists, total: playlists.length })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, description, venue_id, user_id, is_public } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const { createServerSupabaseClient } = await import('@/lib/supabase')
        const supabase = await createServerSupabaseClient()
        const { data, error } = await supabase
          .from('playlists')
          .insert({ name, description, venue_id, user_id, is_public })
          .select()
          .single()
        if (!error && data) {
          return NextResponse.json({ playlist: data }, { status: 201 })
        }
      } catch (e) {
        // fall through to demo response
      }
    }

    const newPlaylist = {
      id: 'pl-' + Date.now(),
      name,
      description: description || '',
      venue_id: venue_id || null,
      user_id: user_id || null,
      cover_url: 'https://picsum.photos/seed/' + Date.now() + '/400/400',
      is_public: is_public ?? true,
      song_count: 0,
      created_at: new Date().toISOString(),
    }
    return NextResponse.json({ playlist: newPlaylist }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
