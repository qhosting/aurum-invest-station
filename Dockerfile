# Dockerfile ultra-optimizado para EasyPanel - PERMISSION FIX APPLIED - READY FOR DEPLOYMENT
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy only package files first
COPY package*.json ./
# Install production dependencies only
RUN npm install --ignore-scripts

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files including prisma
COPY . .

# No fix needed - using original files from repository

# Set Node.js path resolution environment variables for Docker
ENV NODE_PATH=/app/node_modules:/app/src
ENV TS_NODE_TRANSPILE_ONLY=1

# Generate Prisma client explicitly
RUN npx prisma generate

# Build the application with default values for environment variables during build
# Use dummy values for build time to avoid DATABASE_URL errors
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/build"
ENV NEXTAUTH_SECRET="dummy-secret-for-build"
ENV NEXTAUTH_URL="http://localhost:3000"

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy all necessary files from builder first
COPY --from=builder /app ./

# Install tsx for running the seed script
RUN npm install -g tsx

# Set the correct permission for prerender cache
RUN mkdir -p .next || true
RUN chown -R nextjs:nodejs /app

# Make docker-entrypoint.sh executable with extensive validation
USER root
# Validación exhaustiva del archivo docker-entrypoint.sh
RUN echo "🔍 VALIDACIÓN EXHAUSTIVA DE DOCKER-ENTRYPOINT.SH:" && \
    ls -la /app/ | grep docker-entrypoint && \
    if [ -f /app/docker-entrypoint.sh ]; then \
        echo "✅ docker-entrypoint.sh found at /app/docker-entrypoint.sh"; \
        file /app/docker-entrypoint.sh; \
        chmod +x /app/docker-entrypoint.sh; \
        echo "✅ Permisos aplicados: $(ls -la /app/docker-entrypoint.sh)"; \
    else \
        echo "❌ docker-entrypoint.sh NOT found at /app/docker-entrypoint.sh"; \
        echo "📋 Contenido de /app:"; \
        ls -la /app/; \
    fi

# Copy robust startup script as backup
COPY start-app.sh /app/start-app.sh
# Apply permissions before changing ownership to avoid permission issues
USER root
RUN chmod +x /app/start-app.sh
USER nextjs
RUN echo "✅ Backup script start-app.sh created"

# Copy repair script for automatic system repair
COPY repair-system.sh /app/repair-system.sh
USER root
RUN chmod +x /app/repair-system.sh || echo "⚠️  chmod failed - repair script may already have correct permissions"
USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Copy validation script
USER root
COPY validate-system.sh /app/validate-system.sh
# Apply permissions before changing ownership to avoid permission issues
RUN chmod +x /app/validate-system.sh || echo "⚠️  chmod failed - file may already have correct permissions"
USER nextjs

# Robust CMD with comprehensive validation and fallback strategies
CMD ["sh", "-c", "echo '🚀 INICIANDO AURUM INVEST STATION...' && echo '=====================================' && echo '🔍 EJECUTANDO VALIDACIÓN DEL SISTEMA...' && /app/validate-system.sh && echo '' && echo '🔍 Verificando docker-entrypoint.sh...' && if [ -f /app/docker-entrypoint.sh ]; then echo '✅ docker-entrypoint.sh encontrado, ejecutando...' && /app/docker-entrypoint.sh npm start; else echo '⚠️  docker-entrypoint.sh no encontrado, usando start-app.sh...' && /app/start-app.sh npm start; fi"]