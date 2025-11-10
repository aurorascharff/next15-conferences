import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
    staleTimes: {
      dynamic: 30,
    },
  },
  typedRoutes: true,
};

module.exports = nextConfig;
