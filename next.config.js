/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '100mb', // Allows large video/PDF uploads
    },
  },
  // Vercel specific settings for longer execution times
  maxDuration: 60, 
};

module.exports = nextConfig;
