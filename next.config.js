/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // Add image optimization configuration
  images: {
    unoptimized: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
