import Link from 'next/link';

export default function HomePage() {
  return (
    <main className='min-h-screen bg-black text-white'>
      {/* Hero Section */}
      <section className='relative min-h-screen flex flex-col items-center justify-center px-4 text-center'>
        <div className='absolute inset-0 overflow-hidden pointer-events-none'>
          <div className='absolute -top-40 -left-40 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl animate-pulse' />
          <div className='absolute top-1/3 -right-32 w-80 h-80 bg-pink-700/20 rounded-full blur-3xl animate-pulse' />
        </div>

        <div className='relative z-10 max-w-5xl mx-auto'>
          <h1 className='text-5xl md:text-7xl font-black mb-6 leading-tight'>
            La plataforma que conecta
            {' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400'>
              música, locales y marcas
            </span>
          </h1>
          <p className='text-xl text-gray-400 max-w-3xl mx-auto mb-16'>
            PickMySong revoluciona la experiencia musical en vivo. Una plataforma única para usuarios, locales y marcas.
          </p>
        </div>
      </section>

      {/* Target Audiences Section */}
      <section className='py-24 px-4'>
        <div className='max-w-7xl mx-auto'>
          <h2 className='text-4xl md:text-5xl font-bold text-center mb-4'>
            ¿Quién eres?
          </h2>
          <p className='text-xl text-gray-400 text-center mb-16'>
            Elige tu perfil y descubre cómo PickMySong funciona para ti
          </p>

          <div className='grid md:grid-cols-3 gap-8'>
            {/* Usuario Final */}
            <div className='group relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 hover:border-purple-500 transition-all duration-300 hover:scale-105'>
              <div className='text-6xl mb-6'>🎵</div>
              <h3 className='text-3xl font-bold mb-4'>Para ti, música lover</h3>
              <p className='text-gray-400 mb-6 leading-relaxed'>
                Vota las canciones en tus bares favoritos, descubre nuevos locales y controla la música en tiempo real.
              </p>
              <ul className='space-y-3 mb-8 text-gray-300'>
                <li className='flex items-start'>
                  <span className='mr-3 text-green-400'>✓</span>
                  <span>Vota y elige canciones en directo</span>
                </li>
                <li className='flex items-start'>
                  <span className='mr-3 text-green-400'>✓</span>
                  <span>Gana logros y recompensas</span>
                </li>
                <li className='flex items-start'>
                  <span className='mr-3 text-green-400'>✓</span>
                  <span>Descubre locales con tu música</span>
                </li>
              </ul>
              <Link
                href='/discover'
                className='block w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-colors text-center'
              >
                Explorar ahora
              </Link>
            </div>

            {/* Locales/Venues */}
            <div className='group relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 hover:border-pink-500 transition-all duration-300 hover:scale-105'>
              <div className='text-6xl mb-6'>🏪</div>
              <h3 className='text-3xl font-bold mb-4'>Para tu local</h3>
              <p className='text-gray-400 mb-6 leading-relaxed'>
                Transforma la experiencia musical en tu bar, café o club. Tus clientes eligen la música y tú mejoras el ambiente.
              </p>
              <ul className='space-y-3 mb-8 text-gray-300'>
                <li className='flex items-start'>
                  <span className='mr-3 text-green-400'>✓</span>
                  <span>Sistema de votación en vivo</span>
                </li>
                <li className='flex items-start'>
                  <span className='mr-3 text-green-400'>✓</span>
                  <span>Panel de control y analíticas</span>
                </li>
                <li className='flex items-start'>
                  <span className='mr-3 text-green-400'>✓</span>
                  <span>Aumenta engagement y ventas</span>
                </li>
              </ul>
              <Link
                href='/venue-dashboard'
                className='block w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-xl transition-colors text-center'
              >
                Registrar mi local
              </Link>
            </div>

            {/* Marcas */}
            <div className='group relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-3xl p-8 hover:border-red-500 transition-all duration-300 hover:scale-105'>
              <div className='text-6xl mb-6'>🎯</div>
              <h3 className='text-3xl font-bold mb-4'>Para tu marca</h3>
              <p className='text-gray-400 mb-6 leading-relaxed'>
                Crea campañas musicales patrocinadas y conecta con tu audiencia en locales de música en vivo.
              </p>
              <ul className='space-y-3 mb-8 text-gray-300'>
                <li className='flex items-start'>
                  <span className='mr-3 text-green-400'>✓</span>
                  <span>Campañas musicales en locales</span>
                </li>
                <li className='flex items-start'>
                  <span className='mr-3 text-green-400'>✓</span>
                  <span>Segmentación por sector y ciudad</span>
                </li>
                <li className='flex items-start'>
                  <span className='mr-3 text-green-400'>✓</span>
                  <span>Métricas y ROI en tiempo real</span>
                </li>
              </ul>
              <Link
                href='/brands/register'
                className='block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-colors text-center'
              >
                Crear campaña
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className='py-16 px-4 bg-gradient-to-b from-black to-gray-900'>
        <div className='max-w-6xl mx-auto'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-8 text-center'>
            <div>
              <div className='text-5xl font-black text-purple-400 mb-2'>3</div>
              <div className='text-gray-400'>Locales activos</div>
            </div>
            <div>
              <div className='text-5xl font-black text-pink-400 mb-2'>628</div>
              <div className='text-gray-400'>Votos hoy</div>
            </div>
            <div>
              <div className='text-5xl font-black text-red-400 mb-2'>178</div>
              <div className='text-gray-400'>Usuarios en vivo</div>
            </div>
            <div>
              <div className='text-5xl font-black text-orange-400 mb-2'>3</div>
              <div className='text-gray-400'>Playlists activas</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-24 px-4'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-4xl md:text-5xl font-bold mb-6'>
            ¿Listo para empezar?
          </h2>
          <p className='text-xl text-gray-400 mb-10'>
            Únete a la revolución musical. Es gratis y toma menos de 2 minutos.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href='/auth?tab=register'
              className='bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl transition-all text-lg'
            >
              Registrarse gratis
            </Link>
            <Link
              href='/venues'
              className='bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 px-8 rounded-xl transition-colors text-lg'
            >
              Ver locales
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
