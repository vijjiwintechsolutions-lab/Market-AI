/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // TypeScript errors build ని నిలిపివేయకుండా చేస్తుంది
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint errors build ని నిలిపివేయకుండా చేస్తుంది
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
