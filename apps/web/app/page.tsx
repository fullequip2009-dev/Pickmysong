import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black">
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-800/10 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col items-center gap-8">
          <div className="flex items-center gap-3">
            <span className="text-5xl">\uD83C\uDFB5</span>
            <h1 className="text-5xl font-black tracking-tighter text-white md:text-7xl">
              Pick<span className="text-purple-400">my</span>song
            </h1>
          </div>
          <p className="max-w-2xl text-lg font-light text-gray-300 md:text-2xl">
            La plataforma donde la{' '}
            <span className="font-semibold text-white">m\u00fasica</span>,{' '}
            la <span className="font-semibold text-white">moda</span>{' '}
            y la <span className="font-semibold text-white">cultura urbana</span>{' '}
            se fusionan.
          </p>
          <p className="max-w-xl text-base text-gray-500">
            Descubre, vota y comparte las canciones que definen tu estilo de vida.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/discover" className="rounded-full bg-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-purple-500 hover:scale-105 active:scale-100">
              Descubrir canciones \u2192
            </Link>
            <button className="rounded-full border border-white/20 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10">
              Ver c\u00f3mo funciona
            </button>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {['Vota canciones', 'Crea playlists', 'Descubre artistas', 'Para locales', 'Para marcas'].map((feature) => (
              <span key={feature} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300">{feature}</span>
            ))}
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="h-8 w-5 rounded-full border-2 border-white/30 flex items-start justify-center p-1">
            <div className="h-2 w-1 rounded-full bg-white/50" />
          </div>
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-white md:text-4xl">C\u00f3mo funciona</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: '01', title: 'Descubre', desc: 'Explora canciones en tiempo real ordenadas por votos y tendencias.', icon: '\uD83D\uDD0D' },
              { step: '02', title: 'Vota', desc: 'Dale like a las canciones que conectan con tu estilo de vida.', icon: '\uD83D\uDC9C' },
              { step: '03', title: 'Influye', desc: 'Tus votos determinan qu\u00e9 suena en locales, marcas y playlists.', icon: '\uD83D\uDCA5' },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl border border-white/5 bg-white/3 p-6 backdrop-blur-sm">
                <span className="text-3xl">{item.icon}</span>
                <p className="mt-4 text-xs font-bold tracking-widest text-purple-400">{item.step}</p>
                <h3 className="mt-1 text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/discover" className="inline-block rounded-full bg-purple-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-purple-500 hover:scale-105">
              Empieza a votar ahora
            </Link>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center gap-6 py-24 px-4 text-center border-t border-white/5">
        <h2 className="text-3xl font-bold text-white md:text-4xl">Pr\u00f3ximamente</h2>
        <p className="max-w-lg text-gray-400">Estamos construyendo algo incre\u00edble. S\u00e9 el primero en enterarte cuando lancemos.</p>
        <form className="flex w-full max-w-md gap-2">
          <input type="email" placeholder="Tu email" className="flex-1 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-white placeholder-gray-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500" />
          <button type="submit" className="rounded-full bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-500">Notifc\u00e1me</button>
        </form>
      </section>
    </main>
  );
}
