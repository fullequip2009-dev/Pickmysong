'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/discover', label: 'Discover', icon: (active: boolean) => (
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
  { href: '/search', label: 'Buscar', icon: (active: boolean) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )},
  { href: '/playlists', label: 'Playlists', icon: (active: boolean) => (
    <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2}
        d="M4 6h16M4 10h16M4 14h10" />
    </svg>
  )},
  { href: '/profile', label: 'Perfil', icon: (active: boolean) => (
    <svg className="w-5 h-5" fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={active ? 0 : 2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )},
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [notifCount] = useState(2); // mock

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {/* Desktop Top Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/10 shadow-xl shadow-black/50' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center font-bold text-sm group-hover:scale-105 transition-transform">
              ♪
            </div>
            <span className="font-black text-lg tracking-tight hidden sm:block">
              Pick<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">my</span>song
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'text-white bg-white/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon(active)}
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Notifications bell */}
            <Link
              href="/notifications"
              className="relative p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {notifCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-purple-600 rounded-full text-xs flex items-center justify-center font-bold">
                  {notifCount}
                </span>
              )}
            </Link>

            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/auth"
                className="px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/auth?tab=register"
                className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-sm font-semibold transition-all transform hover:scale-105"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-t border-white/10 md:hidden safe-area-pb">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map(item => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                  active
                    ? 'text-purple-400'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <div className={`relative ${active ? 'transform scale-110' : ''} transition-transform`}>
                  {item.icon(active)}
                  {item.href === '/notifications' && notifCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-purple-600 rounded-full text-xs flex items-center justify-center font-bold">
                      {notifCount}
                    </span>
                  )}
                </div>
                <span className={`text-xs ${active ? 'font-semibold' : 'font-normal'}`}>
                  {item.label}
                </span>
                {active && (
                  <div className="w-1 h-1 rounded-full bg-purple-400 mt-0.5" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Top spacer for fixed nav */}
      <div className="h-16" />
    </>
  );
}
