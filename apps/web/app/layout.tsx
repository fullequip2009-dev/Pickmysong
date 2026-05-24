import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pickmysong — La música que define tu estilo',
  description:
    'La plataforma donde la música, la moda y la cultura urbana se fusionan. Descubre, vota y comparte las canciones que definen tu estilo de vida.',
  keywords: ['música', 'lifestyle', 'urban', 'fashion', 'playlist', 'voting'],
  openGraph: {
    title: 'Pickmysong',
    description: 'La plataforma donde la música, la moda y la cultura urbana se fusionan.',
    type: 'website',
    url: 'https://pickmysong.com',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
