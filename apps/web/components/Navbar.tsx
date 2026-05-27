'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/discover', label: 'Descubrir', icon: '🔍' },
  { href: '/playlists', label: 'Playlists', icon: '🎶' },
  { href: '/artists', label: 'Artistas', icon: '🎤' },
  { href: '/venues', label: 'Locales', icon: '🏪' },
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
];

const MOBILE_LINKS = [
  { href: '/', label: 'Inicio', icon: '🏠' },
  { href: '/discover', label: 'Descubrir', icon: '🔍' },
  { href: '/playlists', label: 'Playlists', icon: '🎶' },
  { href: '/artists', label: 'Artistas', icon: '🎤' },
  { href: '/venues', label: 'Locales', icon: '🏪' },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-xl border-b border-white/5">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🎵</span>
          <span className="text-lg font-black tracking-tighter text-white group-hover:text-purple-400 transition-colors">
            Pick<span className="text-purple-400">my</span>song
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-base">{link.icon}</span>
                {link.label}
                {link.href === '/venues' && (
                  <span className="ml-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Locales activos" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Auth / Profile */}
        <div className="flex items-center gap-3">
          <Link
            href="/auth"
            className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/auth"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20"
          >
            Registrarse
          </Link>
          <Link
            href="/profile"
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-base hover:scale-105 transition-transform"
            title="Mi perfil"
          >
            🎧
          </Link>
        </div>
      </nav>

      {/* Desktop spacer */}
      <div className="hidden md:block h-[73px]" />

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-t border-white/10 px-2 pb-safe">
        <div className="flex items-center justify-around py-2">
          {MOBILE_LINKS.map((link) => {
            const isActive = link.href === '/'
              ? pathname === '/'
              : pathname === link.href || pathname?.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                  isActive ? 'text-white' : 'text-gray-600'
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                <span className={`text-[10px] font-semibold ${isActive ? 'text-purple-400' : ''}`}>
                  {link.label}
                </span>
              </Link>
            );
          })}
          {/* Profile link */}
          <Link
            href="/profile"
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
              pathname === '/profile' ? 'text-white' : 'text-gray-600'
            }`}
          >
            <span className="text-xl">🎧</span>
            <span className={`text-[10px] font-semibold ${pathname === '/profile' ? 'text-purple-400' : ''}`}>
              Perfil
            </span>
          </Link>
        </div>
      </nav>
    </>
  );
}
