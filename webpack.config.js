const path = require('path')

module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/app': path.resolve(__dirname, 'src/app'),
      '@/types': path.resolve(__dirname, 'src/types'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'src/lib'),
      path.resolve(__dirname, 'src/components'),
    ],
  },
}