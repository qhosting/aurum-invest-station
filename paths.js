// resolve.ts - Path resolution helper for Docker builds
const path = require('path')

const paths = {
  '@': path.resolve(__dirname, 'src'),
  '@/lib': path.resolve(__dirname, 'src/lib'),
  '@/components': path.resolve(__dirname, 'src/components'),
  '@/app': path.resolve(__dirname, 'src/app'),
  '@/types': path.resolve(__dirname, 'src/types'),
}

module.exports = paths