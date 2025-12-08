/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'auruminvest.mx'],
  },
  env: {
    CUSTOM_KEY: 'auruminvest_station',
  },
}

module.exports = nextConfig