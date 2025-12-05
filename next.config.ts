import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output standalone para Docker deployment
  output: 'standalone',
  
  // Optimizaciones para producción
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  },
  
  // Configuración de imágenes para producción
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif']
  },
  
  // Configuración de headers de seguridad
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  },
  
  // Configuración de redirects para producción
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/dashboard',
        permanent: true
      }
    ]
  }
};

export default nextConfig;
