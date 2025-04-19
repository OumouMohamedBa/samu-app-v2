// ✅ next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors on build
  },
  typescript: {
    ignoreBuildErrors: true,  // Ignore TypeScript errors on build
  },
};

module.exports = nextConfig;
