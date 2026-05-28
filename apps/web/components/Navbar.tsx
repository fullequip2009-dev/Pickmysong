'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/discover', label: 'Descubrir', icon: (active: boolean) => (
    <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2}
        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
  )},
  { href: '/venues', label: 'Locales', icon: (active: boolean) => (
    <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )},
  { href: '/playlists', label: 'Playlists', icon: (active: boolean) => (
    <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2}
        d="M4 6h16M4 10h16M4 14h10M4 18h6" />
    </svg>
  )},
  { href: '/search', label: 'Buscar', icon: (active: boolean) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 2.5 : 2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )},
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifCount] = useState(3);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className={'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ' + (
        scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl' : 'bg-transparent'
      )}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:shadow-purple-500/40 transition-all">
                <span className="text-white font-black text-sm">P</span>
              </div>
              <span className="font-bold text-white text-lg hidden sm:block">PickMySong</span>
            </Link>

            {/* Desktop nav items */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map(item => {
                const active = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ' + (
                      active
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {item.icon(active)}
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <Link href="/notifications" className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notifCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {notifCount}
                  </span>
                )}
              </Link>

              {/* Achievements */}
              <Link href="/achievements" className="p-2 text-gray-400 hover:text-amber-400 transition-colors rounded-lg hover:bg-white/5 hidden sm:block" title="Logros">
                🏆
              </Link>

              {/* Profile */}
              <Link href="/profile" className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white text-sm font-medium transition-all shadow-lg shadow-purple-500/25">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">C</div>
                <span className="hidden sm:block">Perfil</span>
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileOpen
                    ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  }
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 px-4 py-3">
            <div className="grid grid-cols-2 gap-2">
              {[...NAV_ITEMS,
                { href: '/profile', label: 'Perfil', icon: () => <span>👤</span> },
                { href: '/achievements', label: 'Logros', icon: () => <span>🏆</span> },
                { href: '/pricing', label: 'Precios', icon: () => <span>💎</span> },
                { href: '/notifications', label: 'Notifs', icon: () => <span>🔔</span> },
              ].map(item => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={'flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ' + (
                      active
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {item.icon(active)}
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom nav (mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-white/10 safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {NAV_ITEMS.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={'flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-all ' + (
                  active ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'
                )}
              >
                {item.icon(active)}
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
          <Link
            href="/profile"
            className={'flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-all ' + (
              pathname === '/profile' ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'
            )}
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs text-white font-bold">
              C
            </div>
            <span className="text-xs">Perfil</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
