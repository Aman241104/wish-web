import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'www.transparenttextures.com',
      },
    ],
  },
  // Optimization: Compress assets
  compress: true,
  // Optimization: Production source maps (optional, keeping disabled for now)
  productionBrowserSourceMaps: false,
};

export default nextConfig;
