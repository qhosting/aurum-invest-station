/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'auruminvest.mx'],
  },
  env: {
    CUSTOM_KEY: 'auruminvest_station',
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    }
    // Ensure path resolution works in Docker
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').join(__dirname, 'src'),
    }
    return config
  },
}

module.exports = nextConfig