/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@pickmysong/ui'],
  experimental: {
    serverComponentsExternalPackages: [],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
