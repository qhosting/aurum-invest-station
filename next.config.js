const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost', 'auruminvest.mx'],
  },
  env: {
    CUSTOM_KEY: 'auruminvest_station',
  },
  webpack: (config, { isServer }) => {
    // Explicit path resolution for Docker environment
    const srcPath = path.resolve(__dirname, 'src')
    
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    }
    
    // Configure aliases
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': srcPath,
    }
    
    // Add src directory to module resolution
    if (!config.resolve.modules.includes(srcPath)) {
      config.resolve.modules.push(srcPath)
    }
    
    return config
  },
}

module.exports = nextConfig