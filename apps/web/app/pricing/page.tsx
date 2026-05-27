import Link from 'next/link';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '0',
    period: 'siempre',
    description: 'Para empezar a descubrir música',
    color: 'from-gray-800 to-gray-900',
    border: 'border-white/10',
    badge: null,
    features: [
      { text: 'Descubre canciones en tiempo real', included: true },
      { text: 'Vota hasta 10 canciones por día', included: true },
      { text: 'Acceso a playlists públicas', included: true },
      { text: 'Perfil básico', included: true },
      { text: 'Votos ilimitados', included: false },
      { text: 'Crear playlists privadas', included: false },
      { text: 'Analytics de escucha', included: false },
      { text: 'Badge Premium en perfil', included: false },
      { text: 'Acceso anticipado a nuevas features', included: false },
    ],
    cta: 'Empezar gratis',
    ctaHref: '/auth',
    ctaStyle: 'bg-white/10 hover:bg-white/20 border border-white/20 text-white',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '4.99',
    period: 'mes',
    description: 'La experiencia musical completa',
    color: 'from-purple-900 to-pink-900',
    border: 'border-purple-500/50',
    badge: 'Más popular',
    features: [
      { text: 'Todo lo de Free', included: true },
      { text: 'Votos ilimitados', included: true },
      { text: 'Crear playlists privadas', included: true },
      { text: 'Analytics de escucha', included: true },
      { text: 'Badge Premium en perfil', included: true },
      { text: 'Acceso anticipado a nuevas features', included: true },
      { text: 'Sin anuncios', included: true },
      { text: 'Prioridad en soporte', included: true },
      { text: 'Exportar playlists a Spotify', included: true },
    ],
    cta: 'Empezar Premium',
    ctaHref: '/auth',
    ctaStyle: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/25',
  },
  {
    id: 'venue',
    name: 'Local / Marca',
    price: '29',
    period: 'mes',
    description: 'Para locales y marcas que quieren dominar su ambiente sonoro',
    color: 'from-amber-900/60 to-orange-900/60',
    border: 'border-amber-500/30',
    badge: 'Business',
    features: [
      { text: 'Todo lo de Premium', included: true },
      { text: 'Dashboard de analytics avanzado', included: true },
      { text: 'Gestión de playlist del local', included: true },
      { text: 'QR code para votar en el local', included: true },
      { text: 'Branding personalizado', included: true },
      { text: 'API access', included: true },
      { text: 'Múltiples usuarios del equipo', included: true },
      { text: 'Soporte prioritario 24/7', included: true },
      { text: 'Integraciones con sistemas de pago', included: true },
    ],
    cta: 'Contactar ventas',
    ctaHref: '/auth',
    ctaStyle: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold shadow-lg',
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black pb-20 md:pb-0">
      {/* Hero */}
      <section className="relative px-4 pt-20 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-gray-400 mb-6">
            <span>&#x1F48E;</span> Planes simples y transparentes
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-4">
            Elige tu
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> ritmo</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Desde descubrir música gratis hasta gestionar el ambiente sonoro de tu local.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl border ${plan.border} bg-gradient-to-b ${plan.color} p-8 flex flex-col ${plan.id === 'premium' ? 'ring-1 ring-purple-500/30 md:scale-105' : ''}`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg">
                  {plan.badge}
                </div>
              )}
              <div className="mb-6">
                <h2 className="text-xl font-black text-white mb-1">{plan.name}</h2>
                <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-gray-400 text-lg">€</span>
                  <span className="text-5xl font-black text-white">{plan.price}</span>
                  <span className="text-gray-500 text-sm">/ {plan.period}</span>
                </div>
              </div>
              <Link href={plan.ctaHref} className={`block w-full py-3 px-6 rounded-xl text-center text-sm font-bold transition-all mb-8 ${plan.ctaStyle}`}>
                {plan.cta}
              </Link>
              <div className="space-y-3 flex-1">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs ${feature.included ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-gray-600'}`}>
                      {feature.included ? 'v' : 'x'}
                    </span>
                    <span className={`text-sm ${feature.included ? 'text-gray-200' : 'text-gray-600'}`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-2xl mx-auto px-4 pb-20 text-center">
        <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/20 rounded-3xl p-10">
          <h3 className="text-3xl font-black text-white mb-3">Listo para empezar?</h3>
          <p className="text-gray-400 mb-6">Únete a miles de amantes de la música urbana</p>
          <Link href="/auth" className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/25 text-sm tracking-wide">
            Crear cuenta gratis
          </Link>
        </div>
      </section>
    </main>
  );
}
