// @deprecated — usar Supabase Auth + tablas snake_case (queue/songs/venues). DB en memoria legacy.
// ============================================================
//  Pickmysong — In-Memory Demo DB
//  Rich demo data: venues, brands, users, playlists, songs
// ============================================================

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre?: string;
  votes: number;
  plays: number;
  duration?: number; // seconds
  cover_url?: string;
  spotify_url?: string;
  venueId?: string;
  playlistId?: string;
}

export interface Artist {
  id: string;
  name: string;
  genre?: string;
  followers: number;
  avatar_url?: string;
  bio?: string;
  verified?: boolean;
}

export interface Venue {
  id: string;
  name: string;
  address: string;
  city: string;
  type: 'bar' | 'restaurant' | 'club' | 'cafeteria' | 'rooftop';
  isOpen: boolean;
  cover_url?: string;
  description?: string;
  lat?: number;
  lng?: number;
  currentGenre?: string;
  activeUsers?: number;
  brandSponsor?: string;
}

export interface Brand {
  id: string;
  name: string;
  logo_url?: string;
  category: string;
  description?: string;
  color: string;
  venueIds: string[];
}

export interface User {
  id: string;
  name: string;
  handle: string;
  email: string;
  avatar_url?: string;
  plan: 'free' | 'premium' | 'business';
  role: 'user' | 'venue_owner' | 'admin';
  totalVotes: number;
  favoriteGenre?: string;
  city?: string;
  achievements?: string[];
}

export interface Playlist {
  id: string;
  name: string;
  venueId: string;
  userId?: string;
  description?: string;
  cover_url?: string;
  isLive?: boolean;
  songIds: string[];
  likes: number;
}

// ─── SONGS ──────────────────────────────────────────────────
const songs: Song[] = [
  // Jazz Corner playlist
  { id: 's1', title: 'Blue in Green', artist: 'Miles Davis', album: 'Kind of Blue', genre: 'Jazz', votes: 47, plays: 12, duration: 337, cover_url: 'https://upload.wikimedia.org/wikipedia/en/7/71/Miles_Davis_-_Kind_of_Blue.jpg', venueId: 'v1' },
  { id: 's2', title: 'Autumn Leaves', artist: 'Bill Evans', album: 'Portrait in Jazz', genre: 'Jazz', votes: 38, plays: 9, duration: 310, venueId: 'v1' },
  { id: 's3', title: 'Take Five', artist: 'Dave Brubeck', album: 'Time Out', genre: 'Jazz', votes: 35, plays: 11, duration: 324, venueId: 'v1' },
  { id: 's4', title: 'So What', artist: 'Miles Davis', album: 'Kind of Blue', genre: 'Jazz', votes: 29, plays: 8, duration: 562, venueId: 'v1' },
  { id: 's5', title: "Round Midnight", artist: 'Thelonious Monk', album: "Thelonious Monk Plays", genre: 'Jazz', votes: 22, plays: 7, duration: 332, venueId: 'v1' },

  // El Loco Electro playlist
  { id: 's6', title: 'One More Time', artist: 'Daft Punk', album: 'Discovery', genre: 'Electronic', votes: 89, plays: 34, duration: 320, cover_url: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Daft_Punk_-_Discovery.png', venueId: 'v2' },
  { id: 's7', title: 'Get Lucky', artist: 'Daft Punk ft. Pharrell', album: 'Random Access Memories', genre: 'Electronic', votes: 76, plays: 28, duration: 369, venueId: 'v2' },
  { id: 's8', title: 'Strobe', artist: 'deadmau5', album: 'For Lack of a Better Name', genre: 'Electronic', votes: 71, plays: 19, duration: 1035, venueId: 'v2' },
  { id: 's9', title: 'Levels', artist: 'Avicii', album: 'True', genre: 'Electronic', votes: 65, plays: 22, duration: 326, venueId: 'v2' },
  { id: 's10', title: 'Animals', artist: 'Martin Garrix', album: 'Gold Skies', genre: 'Electronic', votes: 58, plays: 17, duration: 289, venueId: 'v2' },

  // La Terraza Rooftop
  { id: 's11', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', genre: 'Pop', votes: 92, plays: 41, duration: 200, cover_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c1/The_Weeknd_-_After_Hours.png/220px-The_Weeknd_-_After_Hours.png', venueId: 'v3' },
  { id: 's12', title: 'As It Was', artist: 'Harry Styles', album: "Harry's House", genre: 'Pop', votes: 87, plays: 38, duration: 167, venueId: 'v3' },
  { id: 's13', title: 'Bad Guy', artist: 'Billie Eilish', album: 'When We All Fall Asleep', genre: 'Pop', votes: 74, plays: 29, duration: 194, venueId: 'v3' },
  { id: 's14', title: 'Flowers', artist: 'Miley Cyrus', album: 'Endless Summer Vacation', genre: 'Pop', votes: 68, plays: 25, duration: 200, venueId: 'v3' },
  { id: 's15', title: 'Vampire', artist: 'Olivia Rodrigo', album: 'GUTS', genre: 'Pop', votes: 61, plays: 22, duration: 218, venueId: 'v3' },

  // Sala Rock
  { id: 's16', title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera', genre: 'Rock', votes: 112, plays: 55, duration: 355, venueId: 'v4' },
  { id: 's17', title: 'Hotel California', artist: 'Eagles', album: 'Hotel California', genre: 'Rock', votes: 98, plays: 47, duration: 391, venueId: 'v4' },
  { id: 's18', title: 'Smells Like Teen Spirit', artist: 'Nirvana', album: 'Nevermind', genre: 'Rock', votes: 89, plays: 43, duration: 301, venueId: 'v4' },
  { id: 's19', title: 'Back in Black', artist: 'AC/DC', album: 'Back in Black', genre: 'Rock', votes: 77, plays: 35, duration: 255, venueId: 'v4' },
  { id: 's20', title: 'Sweet Child O Mine', artist: "Guns N' Roses", album: 'Appetite for Destruction', genre: 'Rock', votes: 71, plays: 31, duration: 356, venueId: 'v4' },

  // Café del Barrio (Indie/Alternativo)
  { id: 's21', title: 'Creep', artist: 'Radiohead', album: 'Pablo Honey', genre: 'Indie', votes: 54, plays: 24, duration: 238, venueId: 'v5' },
  { id: 's22', title: 'Mr. Brightside', artist: 'The Killers', album: 'Hot Fuss', genre: 'Indie', votes: 48, plays: 21, duration: 222, venueId: 'v5' },
  { id: 's23', title: 'Take Me Out', artist: 'Franz Ferdinand', album: 'Franz Ferdinand', genre: 'Indie', votes: 41, plays: 18, duration: 237, venueId: 'v5' },
  { id: 's24', title: 'Seven Nation Army', artist: 'The White Stripes', album: 'Elephant', genre: 'Rock', votes: 39, plays: 16, duration: 231, venueId: 'v5' },
  { id: 's25', title: 'Float On', artist: 'Modest Mouse', album: 'Good News for People', genre: 'Indie', votes: 33, plays: 13, duration: 200, venueId: 'v5' },
];

// ─── ARTISTS ────────────────────────────────────────────────
const artists: Artist[] = [
  { id: 'a1', name: 'Miles Davis', genre: 'Jazz', followers: 4200000, bio: 'Trompetista y compositor de jazz americano, considerado uno de los músicos más influyentes del siglo XX.', verified: true },
  { id: 'a2', name: 'Daft Punk', genre: 'Electronic', followers: 8900000, bio: 'Dúo de música electrónica francés, iconos del house y electro pop mundial.', verified: true },
  { id: 'a3', name: 'The Weeknd', genre: 'Pop/R&B', followers: 31000000, bio: 'Cantante canadiense conocido por su estilo oscuro y melancólico.', verified: true },
  { id: 'a4', name: 'Queen', genre: 'Rock', followers: 26000000, bio: 'Legendaria banda británica de rock, una de las más vendidas en la historia.', verified: true },
  { id: 'a5', name: 'Billie Eilish', genre: 'Pop/Alternativo', followers: 18000000, bio: 'Cantante y compositora estadounidense que debutó siendo adolescente.', verified: true },
  { id: 'a6', name: 'Radiohead', genre: 'Indie Rock', followers: 11000000, bio: 'Banda de rock inglesa conocida por su sonido experimental y letras introspectivas.', verified: true },
  { id: 'a7', name: 'Dave Brubeck', genre: 'Jazz', followers: 890000, bio: 'Pianista de jazz americano conocido por experimentar con compases inusuales.', verified: true },
  { id: 'a8', name: 'Avicii', genre: 'Electronic/EDM', followers: 14000000, bio: 'DJ y productor sueco, pionero del future house y progressive house.', verified: true },
];

// ─── VENUES ─────────────────────────────────────────────────
const venues: Venue[] = [
  {
    id: 'v1',
    name: 'The Jazz Corner',
    address: 'Calle de Alcalá 45',
    city: 'Madrid',
    type: 'bar',
    isOpen: true,
    cover_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    description: 'El mejor jazz en vivo de Madrid. Ambiente íntimo, cócteles artesanales y una selección musical impecable curada por nuestros clientes.',
    lat: 40.4168,
    lng: -3.6972,
    currentGenre: 'Jazz',
    activeUsers: 23,
    brandSponsor: 'b1',
  },
  {
    id: 'v2',
    name: 'El Loco Electro',
    address: 'Calle de Fuencarral 22',
    city: 'Madrid',
    type: 'club',
    isOpen: true,
    cover_url: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=800&q=80',
    description: 'El club electrónico más votado de Madrid. House, techno y electro en sus mejores versiones. La música la pones tú.',
    lat: 40.4237,
    lng: -3.7038,
    currentGenre: 'Electronic',
    activeUsers: 87,
    brandSponsor: 'b2',
  },
  {
    id: 'v3',
    name: 'La Terraza Rooftop',
    address: 'Gran Vía 80, Planta 12',
    city: 'Madrid',
    type: 'rooftop',
    isOpen: true,
    cover_url: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80',
    description: 'Vistas panorámicas de Madrid con el mejor pop y R&B. Reserva tu mesa y elige la banda sonora de la noche.',
    lat: 40.4200,
    lng: -3.7025,
    currentGenre: 'Pop',
    activeUsers: 54,
    brandSponsor: 'b3',
  },
  {
    id: 'v4',
    name: 'Sala Rock Madrid',
    address: 'Calle de la Luna 12',
    city: 'Madrid',
    type: 'club',
    isOpen: false,
    cover_url: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80',
    description: 'Sala histórica del rock madrileño. Desde clásicos del 70 hasta el rock más alternativo de hoy. Abre viernes y sábados.',
    lat: 40.4195,
    lng: -3.7053,
    currentGenre: 'Rock',
    activeUsers: 0,
    brandSponsor: 'b1',
  },
  {
    id: 'v5',
    name: 'Café del Barrio',
    address: 'Calle de Malasaña 8',
    city: 'Madrid',
    type: 'cafeteria',
    isOpen: true,
    cover_url: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80',
    description: 'El café indie de Malasaña. Música alternativa y de autor, brunch todos los fines de semana y tarde de vinilo los jueves.',
    lat: 40.4275,
    lng: -3.7058,
    currentGenre: 'Indie',
    activeUsers: 14,
  },
];

// ─── BRANDS / PATROCINADORES ─────────────────────────────────
const brands: Brand[] = [
  {
    id: 'b1',
    name: 'Estrella Damm',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Estrella_Damm_logo.svg/200px-Estrella_Damm_logo.svg.png',
    category: 'Bebidas',
    description: 'Patrocinador oficial de la escena musical en Madrid. Cada voto suma a la experiencia Estrella.',
    color: '#F5A623',
    venueIds: ['v1', 'v4'],
  },
  {
    id: 'b2',
    name: 'Resident Advisor',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Resident_Advisor_Logo.svg/200px-Resident_Advisor_Logo.svg.png',
    category: 'Media',
    description: 'La guía de música electrónica más respetada del mundo. Presentes en los mejores clubes.',
    color: '#FF3B30',
    venueIds: ['v2'],
  },
  {
    id: 'b3',
    name: 'Spotify',
    logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/168px-Spotify_logo_without_text.svg.png',
    category: 'Music Tech',
    description: 'Escucha las playlists de Pickmysong en Spotify. Las canciones más votadas, en tu bolsillo.',
    color: '#1DB954',
    venueIds: ['v3'],
  },
];

// ─── USERS ──────────────────────────────────────────────────
const users: User[] = [
  { id: 'u1', name: 'Carlos Martínez', handle: 'carlosm', email: 'carlos@demo.com', plan: 'premium', role: 'user', totalVotes: 342, favoriteGenre: 'Jazz', city: 'Madrid', achievements: ['Tastemaker', 'Early Adopter', '7-Day Streak'] },
  { id: 'u2', name: 'Ana García', handle: 'anagarcia', email: 'ana@demo.com', plan: 'free', role: 'user', totalVotes: 187, favoriteGenre: 'Pop', city: 'Madrid', achievements: ['First Vote', 'Social Sharer'] },
  { id: 'u3', name: 'DJ Matteo', handle: 'djmatteo', email: 'matteo@demo.com', plan: 'business', role: 'venue_owner', totalVotes: 0, favoriteGenre: 'Electronic', city: 'Madrid', achievements: ['Venue Owner', 'Top Venue'] },
  { id: 'u4', name: 'Lucía Torres', handle: 'luciat', email: 'lucia@demo.com', plan: 'premium', role: 'user', totalVotes: 521, favoriteGenre: 'Indie', city: 'Barcelona', achievements: ['Tastemaker', 'Rock Lover', 'Night Owl', '30-Day Streak'] },
  { id: 'u5', name: 'Pablo Ruiz', handle: 'pabloruiz', email: 'pablo@demo.com', plan: 'free', role: 'user', totalVotes: 98, favoriteGenre: 'Rock', city: 'Madrid', achievements: ['First Vote'] },
  { id: 'u6', name: 'Sofia Chen', handle: 'sofiachen', email: 'sofia@demo.com', plan: 'premium', role: 'user', totalVotes: 267, favoriteGenre: 'Electronic', city: 'Madrid', achievements: ['Club Hopper', 'Tastemaker'] },
  { id: 'u7', name: 'The Jazz Corner', handle: 'thejazzcorner', email: 'jazz@venue.com', plan: 'business', role: 'venue_owner', totalVotes: 0, favoriteGenre: 'Jazz', city: 'Madrid', achievements: ['Venue Owner'] },
  { id: 'u8', name: 'Admin', handle: 'admin', email: 'admin@pickmysong.com', plan: 'business', role: 'admin', totalVotes: 0, city: 'Madrid', achievements: ['Founder'] },
];

// ─── PLAYLISTS ───────────────────────────────────────────────
const playlists: Playlist[] = [
  {
    id: 'p1',
    name: 'Jazz Corner — Viernes Noche',
    venueId: 'v1',
    userId: 'u7',
    description: 'La playlist definitiva para una noche de jazz. Curada por votos en vivo.',
    isLive: true,
    songIds: ['s1', 's2', 's3', 's4', 's5'],
    likes: 124,
  },
  {
    id: 'p2',
    name: 'El Loco Electro — Club Mix',
    venueId: 'v2',
    userId: 'u3',
    description: 'Beats electrónicos para bailar hasta el amanecer. Los más votados esta noche.',
    isLive: true,
    songIds: ['s6', 's7', 's8', 's9', 's10'],
    likes: 287,
  },
  {
    id: 'p3',
    name: 'Rooftop Sunset Vibes',
    venueId: 'v3',
    userId: 'u3',
    description: 'Pop y R&B con vistas a Madrid. La mejor banda sonora para el atardecer.',
    isLive: true,
    songIds: ['s11', 's12', 's13', 's14', 's15'],
    likes: 198,
  },
  {
    id: 'p4',
    name: 'Clásicos del Rock',
    venueId: 'v4',
    userId: 'u5',
    description: 'Los himnos del rock que nunca pasan de moda. Votados por los rockeros de Madrid.',
    isLive: false,
    songIds: ['s16', 's17', 's18', 's19', 's20'],
    likes: 341,
  },
  {
    id: 'p5',
    name: 'Malasaña Indie Session',
    venueId: 'v5',
    userId: 'u4',
    description: 'Alternativo e indie para la mañana de café en el barrio más cool de Madrid.',
    isLive: true,
    songIds: ['s21', 's22', 's23', 's24', 's25'],
    likes: 89,
  },
];

// ─── QUERY FUNCTIONS ────────────────────────────────────────

export function getSongs(params: { venueId?: string; genre?: string; limit?: number; search?: string }): Song[] {
  let result = [...songs];
  if (params.venueId) result = result.filter(s => s.venueId === params.venueId);
  if (params.genre) result = result.filter(s => s.genre?.toLowerCase() === params.genre!.toLowerCase());
  if (params.search) result = result.filter(s =>
    s.title.toLowerCase().includes(params.search!.toLowerCase()) ||
    s.artist.toLowerCase().includes(params.search!.toLowerCase())
  );
  result.sort((a, b) => b.votes - a.votes);
  if (params.limit) result = result.slice(0, params.limit);
  return result;
}

export function getSongById(id: string): Song | undefined {
  return songs.find(s => s.id === id);
}

export function voteSong(id: string): Song | null {
  const song = songs.find(s => s.id === id);
  if (!song) return null;
  song.votes += 1;
  return song;
}

export function getArtists(params: { genre?: string; limit?: number; search?: string }): Artist[] {
  let result = [...artists];
  if (params.genre) result = result.filter(a => a.genre?.toLowerCase().includes(params.genre!.toLowerCase()));
  if (params.search) result = result.filter(a => a.name.toLowerCase().includes(params.search!.toLowerCase()));
  result.sort((a, b) => b.followers - a.followers);
  if (params.limit) result = result.slice(0, params.limit);
  return result;
}

export function getVenues(params: { open?: boolean; type?: string; limit?: number }): Venue[] {
  let result = [...venues];
  if (params.open !== undefined) result = result.filter(v => v.isOpen === params.open);
  if (params.type) result = result.filter(v => v.type === params.type);
  if (params.limit) result = result.slice(0, params.limit);
  return result;
}

export function getBrands(): Brand[] {
  return [...brands];
}

export function getUsers(): User[] {
  return [...users];
}

export function getUserByEmail(email: string): User | undefined {
  return users.find(u => u.email === email);
}

export function createUser(data: Partial<User>): User {
  const newUser: User = {
    id: 'u' + (users.length + 1),
    name: data.name ?? 'Usuario',
    handle: data.handle ?? 'user' + Date.now(),
    email: data.email ?? '',
    plan: 'free',
    role: 'user',
    totalVotes: 0,
    ...data,
  };
  users.push(newUser);
  return newUser;
}

export function getPlaylists(params: { venueId?: string; userId?: string }): Playlist[] {
  let result = [...playlists];
  if (params.venueId) result = result.filter(p => p.venueId === params.venueId);
  if (params.userId) result = result.filter(p => p.userId === params.userId);
  return result;
}

export function getPlaylistById(id: string): Playlist | undefined {
  return playlists.find(p => p.id === id);
}

export function createPlaylist(data: Partial<Playlist>): Playlist {
  const newPlaylist: Playlist = {
    id: 'p' + (playlists.length + 1),
    name: data.name ?? 'Nueva Playlist',
    venueId: data.venueId ?? '',
    userId: data.userId,
    description: data.description,
    isLive: false,
    songIds: [],
    likes: 0,
    ...data,
  };
  playlists.push(newPlaylist);
  return newPlaylist;
}

export function getDashboardStats() {
  const totalVotes = songs.reduce((acc, s) => acc + s.votes, 0);
  const totalPlays = songs.reduce((acc, s) => acc + s.plays, 0);
  const openVenues = venues.filter(v => v.isOpen).length;
  const topSongs = [...songs].sort((a, b) => b.votes - a.votes).slice(0, 5);

  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - i));
    return {
      day: day.toLocaleDateString('es-ES', { weekday: 'short' }),
      votes: [45, 67, 89, 72, 95, 142, 118][i],
      plays: [120, 180, 210, 165, 230, 310, 280][i],
    };
  });

  return {
    totalSongs: songs.length,
    totalPlaylists: playlists.length,
    totalArtists: artists.length,
    totalVenues: venues.length,
    openVenues,
    totalVotes,
    totalPlays,
    topSongs,
    weeklyData,
  };
}
