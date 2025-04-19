/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // ✅ mode export
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

module.exports = nextConfig;
