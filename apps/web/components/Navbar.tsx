'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/discover', label: 'Descubrir', icon: '\uD83D\uDD0D' },
  { href: '/playlists', label: 'Playlists', icon: '\uD83C\uDFB6' },
  { href: '/artists', label: 'Artistas', icon: '\uD83C\uDFA4' },
  { href: '/venues', label: 'Locales', icon: '\uD83C\uDFAA' },
  { href: '/dashboard', label: 'Dashboard', icon: '\uD83D\uDCCA' },
];

const MOBILE_LINKS = [
  { href: '/', label: 'Inicio', icon: '\uD83C\uDFE0' },
  { href: '/discover', label: 'Descubrir', icon: '\uD83D\uDD0D' },
  { href: '/playlists', label: 'Playlists', icon: '\uD83C\uDFB6' },
  { href: '/artists', label: 'Artistas', icon: '\uD83C\uDFA4' },
  { href: '/venues', label: 'Locales', icon: '\uD83C\uDFAA' },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">\uD83C\uDFB5</span>
            <span className="font-black tracking-tighter text-white text-lg">
              Pick<span className="text-purple-400">my</span>song
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                  pathname === link.href
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className={`hidden sm:block rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                pathname === '/dashboard'
                  ? 'border-purple-500/50 bg-purple-600/20 text-purple-300'
                  : 'border-white/10 text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              \uD83C\uDFAA Para locales
            </Link>
            <button className="rounded-full bg-purple-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-purple-500 transition-colors">
              Iniciar sesi\u00f3n
            </button>
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-white/5 bg-black/95 px-2 py-3 backdrop-blur-xl">
        {MOBILE_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors ${pathname === link.href ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <span className="text-lg leading-none">{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
