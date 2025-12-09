#!/bin/bash

# ===== SCRIPT DE REPARACIÓN AUTOMÁTICA =====
# Este script repara problemas comunes con docker-entrypoint.sh

echo "🔧 SCRIPT DE REPARACIÓN AUTOMÁTICA ACTIVADO"
echo "=========================================="

# Función para logging
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log "Iniciando reparación del sistema..."

# Reparar permisos del directorio /app
log "🔧 Reparando permisos de /app..."
chown -R nextjs:nodejs /app 2>/dev/null || log "⚠️  No se pudieron cambiar permisos (ejecutar como root)"

# Crear docker-entrypoint.sh si no existe
if [ ! -f "/app/docker-entrypoint.sh" ]; then
    log "🔧 Creando docker-entrypoint.sh..."
    cat > /app/docker-entrypoint.sh << 'EOF'
#!/bin/bash
set -e

echo "🚀 AURUM INVEST STATION - MODO DE RECUPERACIÓN"
echo "============================================="

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log "Variables de entorno:"
log "NODE_ENV: $NODE_ENV"
log "DATABASE_URL: ${DATABASE_URL:0:30}..."
log "NEXTAUTH_URL: $NEXTAUTH_URL"
log "PORT: $PORT"

# Esperar PostgreSQL
log "⏳ Esperando PostgreSQL..."
timeout 30 bash -c 'until nc -z postgres 5432; do sleep 2; done' || log "⚠️  PostgreSQL no disponible"

# Migraciones
log "🗄️ Ejecutando migraciones..."
timeout 60 npx prisma migrate deploy || log "⚠️  Migraciones con advertencias"

# Seeding
log "🌱 Ejecutando seeding..."
timeout 30 npx tsx prisma/seed.ts || log "⚠️  Seeding con advertencias"

log "✅ Inicialización completada"
log "🎯 Iniciando Next.js..."
exec "$@"
EOF
    log "✅ docker-entrypoint.sh creado"
fi

# Aplicar permisos ejecutables
log "🔧 Aplicando permisos ejecutables..."
chmod +x /app/docker-entrypoint.sh
chmod +x /app/start-app.sh
chmod +x /app/validate-system.sh

# Verificar archivos críticos
log "🔧 Verificando archivos críticos..."
for file in /app/package.json /app/next.config.js /app/prisma/schema.prisma; do
    if [ -f "$file" ]; then
        log "✅ $file existe"
    else
        log "❌ $file NO existe"
    fi
done

# Crear archivos faltantes si es necesario
if [ ! -f "/app/.env" ]; then
    log "🔧 Creando archivo .env con valores por defecto..."
    cat > /app/.env << EOF
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-'fallback-secret-for-recovery'}
NEXTAUTH_URL=${NEXTAUTH_URL:-'http://localhost:3000'}
DATABASE_URL=${DATABASE_URL:-'postgresql://postgres:postgres@postgres:5432/aurum_invest_station'}
EOF
    log "✅ .env creado"
fi

log "✅ Reparación completada"
log "📊 Estado final:"
ls -la /app/*.sh

# Ejecutar validación final
log "🔍 Ejecutando validación final..."
/app/validate-system.sh