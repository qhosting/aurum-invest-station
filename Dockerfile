# Multi-stage Dockerfile para AURUM INVEST STATION
# Optimizado para producción y fácil despliegue en EasyPanel

# Stage 1: Base image
FROM node:18-alpine AS base

# Instalar dependencias del sistema necesarias
RUN apk add --no-cache libc6-compat

# Stage 2: Dependencies
FROM base AS deps
# Instalar solo las dependencias de producción
RUN npm ci --only=production && npm cache clean --force

# Stage 3: Builder
FROM base AS builder
WORKDIR /app

# Instalar todas las dependencias
COPY package.json package-lock.json ./
RUN npm ci

# Copiar código fuente
COPY . .

# Generar cliente de Prisma
RUN npx prisma generate

# Build de la aplicación
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 4: Runner
FROM base AS runner
WORKDIR /app

# Crear usuario no-root para seguridad
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios
COPY --from=builder /app/public ./public

# Copiar archivos standalone de Next.js
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copiar archivos de Prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Configurar directorio de datos para SQLite
RUN mkdir -p /data && chown -R nextjs:nodejs /data

USER nextjs

# Exponer puerto
EXPOSE 3000

# Variables de entorno por defecto
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Comando de inicio
CMD ["node", "server.js"]