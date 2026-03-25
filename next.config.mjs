import { execSync } from 'child_process';

const getCommitHash = () => {
    try {
        return execSync('git rev-parse --short HEAD').toString().trim();
    } catch (e) {
        return 'no-git';
    }
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  env: {
    NEXT_PUBLIC_COMMIT_HASH: getCommitHash(),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
