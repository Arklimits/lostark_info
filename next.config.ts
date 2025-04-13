import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.lostark.co.kr',
      },
      {
        protocol: 'https',
        hostname: 'cdn-lostark.game.onstove.com',
      },
    ],
  },
};

export default nextConfig;
