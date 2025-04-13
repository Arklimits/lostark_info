import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'img.lostark.co.kr' },
      { hostname: 'cdn-lostark.game.onstove.com' },
    ],
  },
};

export default nextConfig;
