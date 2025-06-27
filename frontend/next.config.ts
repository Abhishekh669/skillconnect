import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   allowedDevOrigins: ['https://baburam-sarki.com.np'],
    images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol : 'https',
        hostname : 'utfs.io',
        pathname : '/**'
      },
      {
        protocol : 'https',
        hostname : 'cn0d0b79y9.ufs.sh',
        pathname : '/**'
      },
       {
        protocol : 'https',
        hostname : '*.ufs.sh',
        pathname : '/**'
      }
    ],
  },
  /* config options here */
};

export default nextConfig;
