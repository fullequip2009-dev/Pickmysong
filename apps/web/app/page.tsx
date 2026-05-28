import Link from 'next/link';

const VENUES = [
  { id: 'v1', name: 'The Jazz Corner', city: 'Madrid', type: 'Bar', open: true, users: 23, genre: 'Jazz', img: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80' },
  { id: 'v2', name: 'El Loco Electro', city: 'Madrid', type: 'Club', open: true, users: 87, genre: 'Electronic', img: 'https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=600&q=80' },
  { id: 'v3', name: 'La Terraza Rooftop', city: 'Madrid', type: 'Rooftop', open: true, users: 54, genre: 'Pop', img: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=600&q=80' },
  { id: 'v5', name: 'Cafe del Barrio', city: 'Madrid', type: 'Cafe', open: true, users: 14, genre: 'Indie', img: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&q=80' },
];

const SONGS = [
  { title: 'Bohemian Rhapsody', artist: 'Queen', votes: 112 },
  { title: 'Blinding Lights', artist: 'The Weeknd', votes: 92 },
  { title: 'One More Time', artist: 'Daft Punk', votes: 89 },
  { title: 'Hotel California', artist: 'Eagles', votes: 98 },
  { title: 'As It Was', artist: 'Harry Styles', votes: 87 },
];

export default function HomePage() {
  return (
    <main className='min-h-screen bg-black text-white'>
      <section className='relative min-h-screen flex flex-col items-center justify-center px-4 text-center'>
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute -top-40 -left-40 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl animate-pulse' />
          <div className='absolute top-1/3 -right-32 w-80 h-80 bg-pink-700/20 rounded-full blur-3xl animate-pulse' />
        </div>
        <div className='relative z-10 max-w-4xl mx-auto'>
          <div className='inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-8'>
            <span className='w-2 h-2 rounded-full bg-green-400 animate-pulse' />
            <span className='text-gray-300'>178 usuarios votando ahora</span>
          </div>
          <h1 className='text-5xl md:text-7xl font-black mb-6 leading-tight'>
            Tu decides{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400'>que suena</span>
            <br />en tu local
          </h1>
          <p className='text-xl text-gray-400 max-w-2xl mx-auto mb-10'>Haz check-in en tu bar favorito, vota las canciones y controla la musica en tiempo real.</p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center mb-12'>
            <Link href='/discover' className='px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl text-lg font-bold transition-all hover:scale-105'>Explorar ahora</Link>
            <Link href='/venues' className='px-8 py-4 bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl text-lg font-bold transition-all'>Ver locales</Link>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto'>
            {[{l:'Locales activos',v:'3',i:'📍'},{l:'Votos hoy',v:'628',i:'▲'},{l:'En vivo',v:'178',i:'👥'},{l:'Playlists',v:'3',i:'🎵'}].map((s,idx) => (
              <div key={idx} className='bg-white/5 border border-white/10 rounded-2xl p-4 text-center'>
                <div className='text-3xl mb-1'>{s.i}</div>
                <div className='text-2xl font-black'>{s.v}</div>
                <div className='text-sm text-gray-400'>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='py-20 px-4 bg-gradient-to-b from-black via-purple-950/10 to-black'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex justify-between items-center mb-8'>
            <div><h2 className='text-3xl font-black mb-1'>Locales en directo</h2><p className='text-gray-400 text-sm flex items-center gap-2'><span className='w-2 h-2 rounded-full bg-green-400 animate-pulse' />Abiertos ahora</p></div>
            <Link href='/venues' className='text-purple-400 text-sm'>Ver todos</Link>
          </div>
          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {VENUES.map(v => (
              <Link key={v.id} href={'/venues/' + v.id} className='group relative rounded-2xl overflow-hidden' style={{aspectRatio:'3/4'}}>
                <img src={v.img} alt={v.name} className='absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' />
                <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent' />
                <div className='absolute inset-0 p-4 flex flex-col justify-between'>
                  <div className='flex justify-between'>
                    {v.open ? <span className='flex items-center gap-1 bg-green-500/20 border border-green-500/30 text-green-400 text-xs px-2 py-1 rounded-full'><span className='w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse' />Abierto</span> : <span className='text-xs bg-black/50 px-2 py-1 rounded-full text-gray-400'>Cerrado</span>}
                    <span className='bg-black/50 text-xs px-2 py-1 rounded-full'>👥 {v.users}</span>
                  </div>
                  <div>
                    <p className='text-xs text-gray-300 mb-0.5'>{v.type} · {v.genre}</p>
                    <h3 className='font-bold group-hover:text-purple-300 transition-colors'>{v.name}</h3>
                    <p className='text-sm text-gray-400'>{v.city}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className='py-20 px-4'>
        <div className='max-w-2xl mx-auto'>
          <div className='flex justify-between items-center mb-6'><h2 className='text-3xl font-black'>Top canciones</h2><Link href='/discover' className='text-purple-400 text-sm'>Ver ranking</Link></div>
          <div className='space-y-2'>
            {SONGS.map((s,i) => (
              <div key={i} className={'flex items-center gap-4 p-4 rounded-xl border ' + (i===0?'bg-yellow-900/10 border-yellow-700/30':'bg-white/5 border-white/10 hover:bg-white/8')}>
                <span className={'w-7 text-center font-black ' + (i===0?'text-yellow-400':i<3?'text-gray-400':'text-gray-700')}>{i===0?'👑':'#'+(i+1)}</span>
                <div className='w-10 h-10 rounded-lg bg-gradient-to-br from-purple-700 to-pink-700 flex items-center justify-center'>🎵</div>
                <div className='flex-1'><p className='font-semibold text-sm'>{s.title}</p><p className='text-xs text-gray-400'>{s.artist}</p></div>
                <p className='font-bold text-purple-400'>{s.votes}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='py-16 px-4 border-t border-white/5'>
        <div className='max-w-4xl mx-auto text-center'>
          <p className='text-gray-600 text-sm uppercase tracking-widest mb-8'>Partners y Patrocinadores</p>
          <div className='flex flex-wrap justify-center gap-4'>
            {[{n:'Estrella Damm',i:'🍺',d:'Patrocinador oficial'},{n:'Resident Advisor',i:'🎧',d:'Media partner'},{n:'Spotify',i:'🎵',d:'Music partner'}].map((b,i) => (
              <div key={i} className='flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-6 py-4 transition-all'>
                <span className='text-2xl'>{b.i}</span>
                <div><p className='font-bold text-sm'>{b.n}</p><p className='text-xs text-gray-500'>{b.d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='py-24 px-4 relative overflow-hidden'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-r from-purple-900/30 via-pink-900/20 to-purple-900/30 rounded-full blur-3xl' />
        <div className='relative max-w-2xl mx-auto text-center'>
          <h2 className='text-4xl font-black mb-4'>Listo para <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400'>tomar el control?</span></h2>
          <p className='text-gray-400 text-lg mb-8'>Unete a los usuarios que ya deciden la musica en sus locales favoritos.</p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link href='/auth?tab=register' className='px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-2xl text-lg font-bold transition-all hover:scale-105'>Registrarse gratis</Link>
            <Link href='/discover' className='px-10 py-4 bg-white/10 hover:bg-white/15 border border-white/20 rounded-2xl text-lg font-bold transition-all'>Ver la demo</Link>
          </div>
        </div>
      </section>

      <footer className='border-t border-white/10 py-8 px-4'>
        <div className='max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4'>
          <div className='flex items-center gap-2'><div className='w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center font-bold'>♪</div><span className='font-black'>Pickmysong</span></div>
          <div className='flex gap-6 text-sm text-gray-600'><Link href='/discover' className='hover:text-gray-400'>Discover</Link><Link href='/venues' className='hover:text-gray-400'>Locales</Link><Link href='/search' className='hover:text-gray-400'>Buscar</Link><Link href='/pricing' className='hover:text-gray-400'>Precios</Link></div>
          <p className='text-xs text-gray-700'>2026 Pickmysong</p>
        </div>
      </footer>
    </main>
  );
}
