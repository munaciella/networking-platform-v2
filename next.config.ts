import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'links.papareact.com',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'linkedincloneyt.blob.core.windows.net',
      },
      {
        protocol: 'https',
        hostname: 'networkplatform.blob.core.windows.net',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true, // Disable TypeScript checking during build
  },
  eslint: {
    ignoreDuringBuilds: true, // Disable linting during the build process
  },
};

export default nextConfig;