-- ============================================================
-- Pickmysong — Seed Data
-- Run after migrations: supabase db seed
-- ============================================================

-- ─── Songs ────────────────────────────────────────────────────
insert into public.songs (id, title, artist, genre, bpm, votes, plays, cover, color, trend) values
  ('11111111-0000-0000-0000-000000000001', 'MONTAGEM CYBERPUNK',  'DJ KL Jay',                'Funk',         138, 2847, 18400, '🎵', 'from-purple-600 to-pink-600',    12),
  ('11111111-0000-0000-0000-000000000002', 'RAVE DE FAVELA',      'MC Lan & Diplo',           'Rave',         150, 2341, 15200, '🔥', 'from-orange-600 to-red-600',     8),
  ('11111111-0000-0000-0000-000000000003', 'NEON NIGHTS',         'Future Classic',           'R&B',           94, 1987, 12800, '🌙', 'from-blue-600 to-cyan-500',      5),
  ('11111111-0000-0000-0000-000000000004', 'ASPHALT GOLD',        'Skepta feat. Young Thug',  'Grime',        140, 1654, 10100, '👑', 'from-yellow-500 to-amber-600',   3),
  ('11111111-0000-0000-0000-000000000005', 'MADRUGADA',           'Cleo & Biel',              'Brazilian Pop',110, 1432,  8400, '🌃', 'from-indigo-600 to-purple-500',  2),
  ('11111111-0000-0000-0000-000000000006', 'SILK ROAD',           'Kaytranada',               'Electronic',   122, 1201,  8900, '🎶', 'from-emerald-600 to-teal-500',   1);

-- ─── Artists ──────────────────────────────────────────────────
insert into public.artists (id, name, handle, bio, genre, followers, songs_count, plays, avatar, color, verified, trending) values
  ('22222222-0000-0000-0000-000000000001', 'DJ KL Jay',      '@djkljay',      'Pionero del funk electrónico. São Paulo, Brasil.',             'Funk / Electronic',  48200,  34, 1240000, '🎵', 'from-purple-600 to-pink-600',   true,  true),
  ('22222222-0000-0000-0000-000000000002', 'Future Classic',  '@futureclassic','R&B con alma de neo-soul y ciudad de noche.',                  'R&B / Neo-soul',     31500,  22,  890000, '🌙', 'from-blue-600 to-cyan-500',     true,  false),
  ('22222222-0000-0000-0000-000000000003', 'Kaytranada',      '@kaytranada',   'Montreal en el dancefloor. House con sabor propio.',           'Electronic / House', 95100,  67, 4100000, '🎶', 'from-emerald-600 to-teal-500',  true,  true),
  ('22222222-0000-0000-0000-000000000004', 'MC Lan',          '@mclan',        'Funk carioca al mundo. Voz del asfalto.',                     'Funk / Rave',        72300,  89, 6700000, '🔥', 'from-orange-600 to-red-600',    false, true),
  ('22222222-0000-0000-0000-000000000005', 'Skepta',          '@skepta',       'El grime no tiene límites. North London forever.',             'Grime / Trap',      183000, 112,12400000, '👑', 'from-yellow-500 to-amber-600',  true,  false);

-- ─── Venues ───────────────────────────────────────────────────
insert into public.venues (id, name, type, city, address, vibe, capacity, current_visitors, rating, open, current_song_id, avatar, color, tags) values
  ('33333333-0000-0000-0000-000000000001', 'Club Nocturno BRLND', 'Club',   'Barcelona', 'Carrer de la Marina, 19', 'Dark Techno / Industrial', 500, 340, 4.8, true,  '11111111-0000-0000-0000-000000000001', '🌌', 'from-purple-900 to-black',        array['Techno','Dark','Industrial']),
  ('33333333-0000-0000-0000-000000000002', 'Terraza del Sol',    'Bar',    'Madrid',    'Gran Vía, 45',            'R&B / Neo-soul',           200, 120, 4.5, true,  '11111111-0000-0000-0000-000000000003', '☀️', 'from-orange-900 to-amber-900',    array['R&B','Chill']),
  ('33333333-0000-0000-0000-000000000003', 'Raver''s Paradise',  'Rave',   'Berlin',    'Revaler Str. 99',         'Rave / Hardcore',         1200, 800, 4.9, true,  '11111111-0000-0000-0000-000000000002', '🔥', 'from-red-900 to-orange-900',      array['Rave','Hardcore']),
  ('33333333-0000-0000-0000-000000000004', 'Gold Lounge',        'Lounge', 'Miami',     'Ocean Drive, 1201',       'Hip-hop / Trap',           150,  90, 4.3, false, null,                                   '💎', 'from-yellow-900 to-amber-800',    array['Hip-hop','VIP']);

-- ─── Playlists ────────────────────────────────────────────────
insert into public.playlists (id, venue_id, name, description, cover, color, tags, likes, public) values
  ('44444444-0000-0000-0000-000000000001', '33333333-0000-0000-0000-000000000001', 'Noches de Neón',  'Para cuando la ciudad no duerme',      '🌙', 'from-blue-900 to-purple-900',  array['Electronic','Ambient'], 847,  true),
  ('44444444-0000-0000-0000-000000000002', null,                                   'Trap Moda',        'Los beats que visten mejor',           '💎', 'from-gray-900 to-zinc-800',    array['Trap','Hip-hop'],       623,  true),
  ('44444444-0000-0000-0000-000000000003', '33333333-0000-0000-0000-000000000003', 'Funk do Futuro',   'El funk que viene del mañana',         '🔥', 'from-orange-900 to-red-900',   array['Funk','Electronic'],    1240, true),
  ('44444444-0000-0000-0000-000000000004', null,                                   'Soul & Seda',      'Suavidad con actitud',                 '🌸', 'from-pink-900 to-rose-900',    array['R&B','Soul'],           512,  true);

-- ─── Playlist Songs ───────────────────────────────────────────
insert into public.playlist_songs (playlist_id, song_id, position) values
  ('44444444-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000003', 1),
  ('44444444-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000006', 2),
  ('44444444-0000-0000-0000-000000000001', '11111111-0000-0000-0000-000000000001', 3),
  ('44444444-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000004', 1),
  ('44444444-0000-0000-0000-000000000002', '11111111-0000-0000-0000-000000000002', 2),
  ('44444444-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000001', 1),
  ('44444444-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000002', 2),
  ('44444444-0000-0000-0000-000000000003', '11111111-0000-0000-0000-000000000005', 3),
  ('44444444-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000003', 1),
  ('44444444-0000-0000-0000-000000000004', '11111111-0000-0000-0000-000000000005', 2);
