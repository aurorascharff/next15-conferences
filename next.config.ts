import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
  },
  typedRoutes: true,
};

module.exports = nextConfig;
