import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '../components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pickmysong — La musica que define tu estilo',
  description:
    'La plataforma donde la musica, la moda y la cultura urbana se fusionan. Descubre, vota y controla la musica en tus locales favoritos.',
  keywords: ['musica', 'lifestyle', 'urban', 'fashion', 'playlist', 'voting', 'discoteca', 'bar', 'local'],
  authors: [{ name: 'PickMySong' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PickMySong',
  },
  openGraph: {
    title: 'Pickmysong',
    description: 'La plataforma donde la musica, la moda y la cultura urbana se fusionan.',
    type: 'website',
    url: 'https://pickmysong.com',
    siteName: 'PickMySong',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PickMySong',
    description: 'Vota las canciones en tus locales favoritos',
  },
};

export const viewport: Viewport = {
  themeColor: '#7c3aed',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="PickMySong" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={inter.className + ' bg-black text-white antialiased'}>
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
