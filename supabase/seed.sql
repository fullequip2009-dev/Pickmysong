-- ============================================================
-- Pickmysong - Seed Data (matching lib/db.ts demo data)
-- Run after migrations: supabase db seed
-- ============================================================

-- Clear existing data (order matters due to FK constraints)
TRUNCATE public.votes, public.playlist_songs, public.playlists,
         public.songs, public.venues, public.artists,
         public.brands, public.users RESTART IDENTITY CASCADE;

-- ---- Artists -----------------------------------------------
INSERT INTO public.artists (id, name, genre, followers, verified, image_url) VALUES
  ('art-1', 'Miles Davis',  'Jazz',       890000, true,  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300'),
  ('art-2', 'Daft Punk',    'Electronic', 4200000, true,  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300'),
  ('art-3', 'Queen',        'Rock',       8900000, true,  'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300'),
  ('art-4', 'The Weeknd',   'Pop/R&B',    12000000, true,  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300'),
  ('art-5', 'Radiohead',    'Indie Rock', 3400000, true,  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300'),
  ('art-6', 'Nina Simone',  'Jazz/Soul',  1200000, true,  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300'),
  ('art-7', 'Aphex Twin',   'Electronic', 980000, true,  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300'),
  ('art-8', 'The Strokes',  'Indie Rock', 2100000, true,  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300');

-- ---- Venues ------------------------------------------------
INSERT INTO public.venues (id, name, type, city, address, genre, description, capacity, active_users, rating, is_open, cover_image, latitude, longitude) VALUES
  ('ven-1', 'The Jazz Corner',     'Bar',      'Madrid', 'Calle Huertas 18, Barrio de las Letras', 'Jazz',       'El templo del jazz en Madrid. Ambiente íntimo, músicos en directo cada noche.',                            120, 47, 4.8, true,  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', 40.4152, -3.6985),
  ('ven-2', 'El Loco Electro',     'Club',     'Madrid', 'Calle Atocha 56, Lavapiés',              'Electronic', 'La meca de la electrónica en Madrid. Sonido Funktion-One, luces láser y beats hasta el amanecer.',         500, 312, 4.6, true,  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800', 40.4085, -3.7006),
  ('ven-3', 'La Terraza Rooftop',  'Rooftop',  'Madrid', 'Gran Vía 80, Planta 12',                 'Pop',        'La terraza más cool de Madrid con vistas de 360° y las mejores canciones del momento.',                   200, 178, 4.9, true,  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800', 40.4200, -3.7020),
  ('ven-4', 'Sala Rock Madrid',    'Sala',     'Madrid', 'Calle de Barceló 11, Malasaña',          'Rock',       'El epicentro del rock en la capital. Indie, alternativo y clásicos del rock en un espacio brutal.',       350, 89, 4.5, false, 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800', 40.4285, -3.7018),
  ('ven-5', 'Café del Barrio',     'Café',     'Madrid', 'Calle Fuencarral 22, Chueca',            'Indie',      'El café más bohemio de Chueca. Música indie, tertulia y los mejores cafés de especialidad de Madrid.',     80, 34, 4.7, true,  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800', 40.4240, -3.6980);

-- ---- Songs -------------------------------------------------
INSERT INTO public.songs (id, title, artist, genre, bpm, votes, cover_url, venue_id, venue_name) VALUES
  -- The Jazz Corner
  ('sng-01', 'So What',              'Miles Davis',  'Jazz',       136, 892, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300', 'ven-1', 'The Jazz Corner'),
  ('sng-02', 'Kind of Blue',         'Miles Davis',  'Jazz',        94, 756, 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300', 'ven-1', 'The Jazz Corner'),
  ('sng-03', 'Feeling Good',         'Nina Simone',  'Jazz/Soul',   72, 634, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300', 'ven-1', 'The Jazz Corner'),
  ('sng-04', 'My Funny Valentine',   'Miles Davis',  'Jazz',        60, 521, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300', 'ven-1', 'The Jazz Corner'),
  ('sng-05', 'Strange Fruit',        'Nina Simone',  'Jazz/Soul',   68, 489, 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300', 'ven-1', 'The Jazz Corner'),
  -- El Loco Electro
  ('sng-06', 'Get Lucky',            'Daft Punk',    'Electronic', 116, 2341, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300', 'ven-2', 'El Loco Electro'),
  ('sng-07', 'Around the World',     'Daft Punk',    'Electronic', 121, 1987, 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300', 'ven-2', 'El Loco Electro'),
  ('sng-08', 'Harder Better Faster', 'Daft Punk',    'Electronic', 123, 1654, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300', 'ven-2', 'El Loco Electro'),
  ('sng-09', 'One More Time',        'Daft Punk',    'Electronic', 123, 2105, 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300', 'ven-2', 'El Loco Electro'),
  ('sng-10', 'Windowlicker',         'Aphex Twin',   'Electronic', 140, 987,  'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300', 'ven-2', 'El Loco Electro'),
  -- La Terraza Rooftop
  ('sng-11', 'Blinding Lights',      'The Weeknd',   'Pop',        171, 3421, 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300', 'ven-3', 'La Terraza Rooftop'),
  ('sng-12', 'Save Your Tears',      'The Weeknd',   'Pop',        118, 2876, 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300', 'ven-3', 'La Terraza Rooftop'),
  ('sng-13', 'Starboy',              'The Weeknd',   'Pop',        186, 2543, 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300', 'ven-3', 'La Terraza Rooftop'),
  ('sng-14', 'The Hills',            'The Weeknd',   'Pop',        105, 1987, 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300', 'ven-3', 'La Terraza Rooftop'),
  ('sng-15', 'After Hours',          'The Weeknd',   'Pop',        108, 1654, 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=300', 'ven-3', 'La Terraza Rooftop'),
  -- Sala Rock Madrid
  ('sng-16', 'Bohemian Rhapsody',    'Queen',        'Rock',       144, 4521, 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300', 'ven-4', 'Sala Rock Madrid'),
  ('sng-17', 'We Will Rock You',     'Queen',        'Rock',        81, 3876, 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300', 'ven-4', 'Sala Rock Madrid'),
  ('sng-18', 'Don''t Stop Me Now',   'Queen',        'Rock',       156, 3234, 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300', 'ven-4', 'Sala Rock Madrid'),
  ('sng-19', 'Somebody to Love',     'Queen',        'Rock',        76, 2765, 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300', 'ven-4', 'Sala Rock Madrid'),
  ('sng-20', 'Under Pressure',       'Queen',        'Rock',       110, 2345, 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300', 'ven-4', 'Sala Rock Madrid'),
  -- Café del Barrio
  ('sng-21', 'Creep',                'Radiohead',    'Indie Rock',  92, 1876, 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300', 'ven-5', 'Café del Barrio'),
  ('sng-22', 'Karma Police',         'Radiohead',    'Indie Rock',  72, 1543, 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300', 'ven-5', 'Café del Barrio'),
  ('sng-23', 'Last Nite',            'The Strokes',  'Indie Rock', 133, 1234, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300', 'ven-5', 'Café del Barrio'),
  ('sng-24', 'Reptilia',             'The Strokes',  'Indie Rock', 148, 987,  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300', 'ven-5', 'Café del Barrio'),
  ('sng-25', 'Fake Plastic Trees',   'Radiohead',    'Indie Rock',  72, 876,  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300', 'ven-5', 'Café del Barrio');

-- ---- Brands -----------------------------------------------
INSERT INTO public.brands (id, name, description, logo_url, website, tier) VALUES
  ('brd-1', 'Estrella Damm',    'La cerveza mediterránea oficial de Pickmysong. Refrescante como la música.',         'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=200', 'https://estrelladamm.com', 'premium'),
  ('brd-2', 'Resident Advisor', 'La guía definitiva de música electrónica. Donde los DJs y fans se encuentran.',      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200',  'https://ra.co',            'partner'),
  ('brd-3', 'Spotify',          'Escucha las canciones más votadas en Pickmysong directamente en Spotify.',           'https://images.unsplash.com/photo-1611339555312-e607c8352fd7?w=200', 'https://spotify.com',      'premium');

-- ---- Users ------------------------------------------------
INSERT INTO public.users (id, email, name, role, plan, avatar_url, xp, level) VALUES
  ('usr-1', 'admin@pickmysong.com',   'Admin PMS',     'admin',        'enterprise', null, 9999, 99),
  ('usr-2', 'jazz@corner.es',         'Jazz Corner',   'venue_owner',  'pro',        null,  450, 12),
  ('usr-3', 'loco@electro.es',        'Loco Electro',  'venue_owner',  'pro',        null,  380,  9),
  ('usr-4', 'terraza@rooftop.es',     'La Terraza',    'venue_owner',  'pro',        null,  520, 14),
  ('usr-5', 'sala@rock.es',           'Sala Rock',     'venue_owner',  'basic',      null,  290,  7),
  ('usr-6', 'carlos@gmail.com',       'Carlos M.',     'user',         'free',       null,  125,  3),
  ('usr-7', 'sofia@gmail.com',        'Sofía R.',      'user',         'free',       null,   87,  2),
  ('usr-8', 'miguel@gmail.com',       'Miguel L.',     'user',         'free',       null,  210,  5);

-- ---- Playlists --------------------------------------------
INSERT INTO public.playlists (id, name, venue_id, description, is_active, genre, total_votes, song_count, cover_url) VALUES
  ('pl-1', 'Noches de Jazz',       'ven-1', 'Los clásicos del jazz para la noche madrileña',      true,  'Jazz',       2892,  5, 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400'),
  ('pl-2', 'Beats Eléctricos',     'ven-2', 'Lo mejor de la electrónica para bailar sin parar',   true,  'Electronic', 9074,  5, 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'),
  ('pl-3', 'Rooftop Vibes',        'ven-3', 'Pop y R&B para una noche mágica con vistas',         true,  'Pop',        13481, 5, 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400'),
  ('pl-4', 'Rock Eterno',          'ven-4', 'Los himnos del rock que nunca pasan de moda',        false, 'Rock',       16741, 5, 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400'),
  ('pl-5', 'Indie Café Sessions',  'ven-5', 'Indie y alternativo para tardes de café y buena onda', true, 'Indie Rock',  6516,  5, 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400');

-- ---- Playlist Songs ----------------------------------------
INSERT INTO public.playlist_songs (playlist_id, song_id, position) VALUES
  -- Jazz Corner playlist
  ('pl-1', 'sng-01', 1), ('pl-1', 'sng-02', 2), ('pl-1', 'sng-03', 3), ('pl-1', 'sng-04', 4), ('pl-1', 'sng-05', 5),
  -- El Loco Electro playlist
  ('pl-2', 'sng-06', 1), ('pl-2', 'sng-09', 2), ('pl-2', 'sng-07', 3), ('pl-2', 'sng-08', 4), ('pl-2', 'sng-10', 5),
  -- La Terraza Rooftop playlist
  ('pl-3', 'sng-11', 1), ('pl-3', 'sng-12', 2), ('pl-3', 'sng-13', 3), ('pl-3', 'sng-14', 4), ('pl-3', 'sng-15', 5),
  -- Sala Rock Madrid playlist
  ('pl-4', 'sng-16', 1), ('pl-4', 'sng-17', 2), ('pl-4', 'sng-18', 3), ('pl-4', 'sng-19', 4), ('pl-4', 'sng-20', 5),
  -- Café del Barrio playlist
  ('pl-5', 'sng-21', 1), ('pl-5', 'sng-22', 2), ('pl-5', 'sng-23', 3), ('pl-5', 'sng-24', 4), ('pl-5', 'sng-25', 5);

-- Done! Run: supabase db seed
