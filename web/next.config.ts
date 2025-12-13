import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Allow images from Django
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },

  // 2. Force Polling for Docker on Windows
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,   // Check for changes every second
      aggregateTimeout: 300,
    };
    return config;
  },
};

export default nextConfig;