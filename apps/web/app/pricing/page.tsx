'use client';

import { useState } from 'react';
import Link from 'next/link';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Para empezar a descubrir musica en directo',
    color: 'from-gray-800 to-gray-900',
    border: 'border-white/10',
    badge: null,
    cta: 'Empezar gratis',
    ctaStyle: 'border border-white/20 hover:border-purple-500/50 text-white',
    features: [
      { text: 'Descubre canciones en tiempo real', included: true },
      { text: 'Vota hasta 10 canciones por dia', included: true },
      { text: 'Acceso a playlists publicas', included: true },
      { text: 'Perfil basico', included: true },
      { text: 'Votos ilimitados', included: false },
      { text: 'Sin anuncios', included: false },
      { text: 'Estadisticas avanzadas', included: false },
      { text: 'Acceso anticipado a nuevas features', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 4.99,
    yearlyPrice: 3.99,
    description: 'Para los que viven la noche al maximo',
    color: 'from-purple-900/80 to-pink-900/50',
    border: 'border-purple-500/50',
    badge: 'MAS POPULAR',
    cta: 'Empezar Pro',
    ctaStyle: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-500/25',
    features: [
      { text: 'Descubre canciones en tiempo real', included: true },
      { text: 'Votos ilimitados', included: true },
      { text: 'Acceso a playlists publicas y privadas', included: true },
      { text: 'Perfil avanzado con estadisticas', included: true },
      { text: 'Sin anuncios', included: true },
      { text: 'Notificaciones push personalizadas', included: true },
      { text: 'Estadisticas avanzadas', included: true },
      { text: 'Acceso anticipado a nuevas features', included: false },
    ],
  },
  {
    id: 'venue',
    name: 'Venue',
    monthlyPrice: 29.99,
    yearlyPrice: 24.99,
    description: 'Para locales de ocio que quieren dominar la noche',
    color: 'from-amber-900/60 to-orange-900/40',
    border: 'border-amber-500/40',
    badge: 'PARA LOCALES',
    cta: 'Hablar con ventas',
    ctaStyle: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-lg shadow-amber-500/25',
    features: [
      { text: 'Todo lo de Pro para tus clientes', included: true },
      { text: 'Dashboard de venue owner', included: true },
      { text: 'QR codes ilimitados', included: true },
      { text: 'Analytics en tiempo real', included: true },
      { text: 'Notificaciones a clientes en sala', included: true },
      { text: 'Integracion con Spotify Premium', included: true },
      { text: 'Branding personalizado', included: true },
      { text: 'Soporte prioritario 24/7', included: true },
    ],
  },
];

const FAQS = [
  { q: '¿Puedo cambiar de plan en cualquier momento?', a: 'Si, puedes hacer upgrade o downgrade cuando quieras. El cambio se aplica inmediatamente.' },
  { q: '¿Hay periodo de prueba?', a: 'El plan Free no tiene limite de tiempo. El plan Pro tiene 14 dias de prueba gratuita.' },
  { q: '¿Como funciona la facturacion anual?', a: 'Se cobra una vez al año con un 20% de descuento respecto al precio mensual.' },
  { q: '¿Que pasa si cancelo?', a: 'Puedes cancelar cuando quieras. Seguiras teniendo acceso hasta el final del periodo pagado.' },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-purple-600/8 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-pink-600/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/8 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-300 mb-6">
            <span>💎</span>
            <span>Planes simples, sin sorpresas</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Elige tu{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              experiencia
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Desde gratis hasta venue owner. Cada plan desbloquea una nueva dimensión de la noche.
          </p>

          {/* Toggle mensual/anual */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={'text-sm font-medium ' + (!isYearly ? 'text-white' : 'text-gray-500')}>
              Mensual
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={'relative w-14 h-7 rounded-full transition-all duration-300 ' + (isYearly ? 'bg-purple-600' : 'bg-white/20')}
            >
              <div className={'absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ' + (isYearly ? 'left-8' : 'left-1')} />
            </button>
            <div className="flex items-center gap-2">
              <span className={'text-sm font-medium ' + (isYearly ? 'text-white' : 'text-gray-500')}>
                Anual
              </span>
              <span className="px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-400 font-semibold">
                -20%
              </span>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {PLANS.map(plan => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            return (
              <div
                key={plan.id}
                className={'relative p-6 rounded-2xl border bg-gradient-to-b backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ' + plan.color + ' ' + plan.border + (plan.id === 'pro' ? ' shadow-xl shadow-purple-500/20' : '')}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className={'px-4 py-1 rounded-full text-xs font-bold ' + (plan.id === 'pro' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gradient-to-r from-amber-500 to-orange-500 text-black')}>
                      {plan.badge}
                    </div>
                  </div>
                )}

                {/* Plan header */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-1">{plan.name}</h2>
                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black">
                      {price === 0 ? 'Gratis' : ('€' + price.toFixed(2))}
                    </span>
                    {price > 0 && (
                      <span className="text-gray-400 text-sm">/ mes</span>
                    )}
                  </div>
                  {isYearly && price > 0 && (
                    <p className="text-xs text-green-400 mt-1">
                      Facturado anualmente · €{(price * 12).toFixed(0)}/año
                    </p>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href={plan.id === 'venue' ? '/contact' : '/auth/signin'}
                  className={'block text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 mb-6 ' + plan.ctaStyle}
                >
                  {plan.cta}
                </Link>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className={'flex items-start gap-3 text-sm ' + (feature.included ? 'text-gray-200' : 'text-gray-600')}>
                      <span className={'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs mt-0.5 ' + (feature.included ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-600')}>
                        {feature.included ? '✓' : '×'}
                      </span>
                      {feature.text}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Credits Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">¿Prefieres pagar por uso?</h2>
            <p className="text-gray-400">Compra creditos y usa solo lo que necesitas, sin suscripcion</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { credits: 50, price: 4.99, bonus: null },
              { credits: 150, price: 12.99, bonus: '+20 gratis' },
              { credits: 400, price: 29.99, bonus: '+100 gratis' },
              { credits: 1000, price: 59.99, bonus: '+300 gratis' },
            ].map(pack => (
              <button
                key={pack.credits}
                className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-purple-500/30 hover:bg-white/10 transition-all text-center group"
              >
                <div className="text-2xl font-black text-white mb-1">{pack.credits}</div>
                <div className="text-xs text-gray-400 mb-2">creditos</div>
                {pack.bonus && (
                  <div className="text-xs text-green-400 mb-2 font-semibold">{pack.bonus}</div>
                )}
                <div className="text-lg font-bold text-purple-400">€{pack.price}</div>
              </button>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Preguntas frecuentes</h2>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-all"
                >
                  <span className="font-medium text-sm pr-4">{faq.q}</span>
                  <span className={'text-gray-400 flex-shrink-0 transition-transform duration-200 ' + (openFaq === i ? 'rotate-180' : '')}>
                    ↓
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-400">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-gray-400 text-sm mb-4">
            ¿Dudas? <Link href="/contact" className="text-purple-400 hover:text-purple-300">Contacta con nosotros</Link>
          </p>
          <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
