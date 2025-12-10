#!/bin/bash

# Script de build con retry para manejar problemas de red
set -e

echo "🚀 BUILD CON RETRY PARA AURUM INVEST STATION"
echo "============================================"

# Función para logging
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Configurar variables de entorno para timeouts
export NEXT_TELEMETRY_DISABLED=1
export NODE_OPTIONS="--max-old-space-size=4096"

# Función para intentar el build con retry
build_with_retry() {
    local max_attempts=3
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        log "Intento $attempt/$max_attempts de build..."
        
        # Configurar npm con timeouts largos
        npm config set fetch-timeout 300000  # 5 minutos
        npm config set fetch-retry-mintimeout 20000  # 20 segundos
        npm config set fetch-retry-maxtimeout 120000  # 2 minutos
        npm config set fetch-retries 5
        
        # Intentar el build (llamar directamente a next build para evitar recursión)
        if timeout 300 npx next build; then  # Timeout total de 5 minutos
            log "✅ Build completado exitosamente!"
            return 0
        else
            log "⚠️ Intento $attempt falló, esperando antes del siguiente intento..."
            sleep 10
            attempt=$((attempt + 1))
        fi
    done
    
    log "❌ Build falló después de $max_attempts intentos"
    return 1
}

# Intentar el build
build_with_retry

# Si el build falla, intentar build simplificado
if [ $? -ne 0 ]; then
    log "🔧 Intentando build simplificado..."
    
    # Generar Prisma primero
    log "🗄️ Generando Prisma Client..."
    npx prisma generate
    
    # Build con configuración mínima
    log "🏗️ Ejecutando Next.js build..."
    export NEXT_TELEMETRY_DISABLED=1
    timeout 180 npx next build --no-lint || {
        log "⚠️ Build con timeout, intentando sin optimizaciones..."
        NEXT_TELEMETRY_DISABLED=1 timeout 180 npx next build --no-optimizations
    }
fi

log "🏁 Proceso de build finalizado"