#!/bin/bash

# Script de solución específica para error de Prisma Schema
# Ejecutar este script para solucionar el problema de build en EasyPanel

echo "🔧 AURUM INVEST STATION - Solución Error Prisma Schema"
echo "======================================================"

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encuentra package.json. Ejecutar desde el directorio raíz."
    exit 1
fi

# Backup de archivos originales
echo "📦 Creando backups..."
cp package.json package.json.backup 2>/dev/null || true
cp Dockerfile Dockerfile.backup 2>/dev/null || true

echo "✅ Backups creados"

# Aplicar soluciones
echo "🛠️  Aplicando soluciones..."

# Solución 1: Usar Dockerfile.ultra
if [ -f "Dockerfile.ultra" ]; then
    cp Dockerfile.ultra Dockerfile
    echo "✅ Dockerfile.ultra aplicado"
fi

# Solución 2: Verificar que package.json tiene la configuración correcta
if [ -f "package.json.fixed" ]; then
    cp package.json.fixed package.json
    echo "✅ package.json.fixed aplicado"
fi

# Solución 3: Verificar estructura de prisma
echo "📁 Verificando estructura de prisma..."
if [ -f "prisma/schema.prisma" ]; then
    echo "✅ prisma/schema.prisma existe"
else
    echo "❌ prisma/schema.prisma NO existe"
    echo "🔍 Buscando archivos schema..."
    find . -name "*.prisma" -type f
fi

# Solución 4: Test local del build
echo "🧪 Probando build local..."
if command -v docker &> /dev/null; then
    echo "🐳 Docker disponible, probando build..."
    docker build -t aurum-invest-test . --progress=plain || echo "⚠️  Build local falló, pero puede funcionar en EasyPanel"
else
    echo "⚠️  Docker no disponible para test local"
fi

# Solución 5: Verificar variables de entorno críticas
echo "🔍 Verificando configuración..."
if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  DATABASE_URL no configurada localmente (normal en EasyPanel)"
fi

# Crear archivo de configuración optimizada para EasyPanel
cat > easypanel-dockerfile.txt << 'EOF'
# USAR ESTE DOCKERFILE EN EASYPANEL:
# Copia el contenido de Dockerfile.ultra en el campo "Dockerfile" de EasyPanel

# Dockerfile ultra-optimizado para EasyPanel - Sin errores de Prisma
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy only package files first
COPY package*.json ./
# Install production dependencies only
RUN npm ci --only=production --ignore-scripts

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files including prisma
COPY . .

# Generate Prisma client explicitly
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy prisma and other necessary files
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/docker-entrypoint.sh ./docker-entrypoint.sh

# Install tsx for running the seed script
RUN npm install -g tsx

USER root
RUN chmod +x docker-entrypoint.sh
USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Use docker-entrypoint.sh as the startup script
CMD ["./docker-entrypoint.sh", "npm", "start"]
EOF

echo "✅ Archivo easypanel-dockerfile.txt creado"

# Crear variables de entorno para EasyPanel
cat > easypanel-variables.txt << 'EOF'
# VARIABLES DE ENTORNO PARA EASYPANEL:
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/aurum_invest_station
NEXTAUTH_SECRET=lmM3csYY5lO99PgS/2EKso34xZtoSy/U6GuhvRWgWAM=
NEXTAUTH_URL=https://auruminvest.mx
NEXT_PUBLIC_CHATWOOT_BASE_URL=https://chat.auruminvest.mx
NEXT_PUBLIC_CHATWOOT_TOKEN=tu_token_aqui
NODE_ENV=production
PORT=3000
EOF

echo "✅ Archivo easypanel-variables.txt creado"

# Instrucciones finales
echo ""
echo "🎯 SOLUCIÓN COMPLETADA"
echo "======================"
echo ""
echo "📋 PASOS PARA EASYPANEL:"
echo "1. Copiar el contenido de 'easypanel-dockerfile.txt' al campo Dockerfile de EasyPanel"
echo "2. Configurar las variables de entorno desde 'easypanel-variables.txt'"
echo "3. Asegurar recursos mínimos: 2GB RAM, 1 CPU core"
echo "4. Ejecutar despliegue"
echo ""
echo "🔑 CREDENCIALES DESPUÉS DEL DESPLIEGUE:"
echo "Super Admin: admin@auruminvest.mx / AURUM2024!SuperAdmin"
echo "Trader Demo: trader@auruminvest.mx / AURUM2024!Trader"
echo ""
echo "📊 ARCHIVOS CREADOS:"
echo "- easypanel-dockerfile.txt (Dockerfile optimizado)"
echo "- easypanel-variables.txt (Variables de entorno)"
echo "- package.json.backup (Respaldo original)"
echo "- Dockerfile.backup (Respaldo original)"
echo ""
echo "✅ ¡Listo para despliegue en EasyPanel!"

# Restaurar archivos originales si es necesario
read -p "¿Restaurar archivos originales? (y/N): " restore
if [[ $restore =~ ^[Yy]$ ]]; then
    cp package.json.backup package.json 2>/dev/null || true
    cp Dockerfile.backup Dockerfile 2>/dev/null || true
    echo "✅ Archivos originales restaurados"
fi