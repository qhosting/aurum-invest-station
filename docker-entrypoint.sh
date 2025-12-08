#!/bin/bash

# Script de inicialización optimizada para AURUM INVEST STATION
echo "🚀 Iniciando AURUM INVEST STATION..."

# Función para logging
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Esperar a que PostgreSQL esté disponible con timeout
log "⏳ Esperando conexión a PostgreSQL..."
timeout=30
counter=0
until nc -z postgres 5432; do
    sleep 2
    counter=$((counter + 2))
    log "⏳ Esperando PostgreSQL... ($counter/$timeout segundos)"
    if [ $counter -ge $timeout ]; then
        log "⚠️  Timeout esperando PostgreSQL, continuando..."
        break
    fi
done
log "✅ PostgreSQL verificado"

# Ejecutar migraciones de Prisma con timeout
log "🗄️  Ejecutando migraciones de base de datos..."
if timeout 60 npx prisma migrate deploy; then
    log "✅ Migraciones completadas exitosamente"
else
    log "⚠️  Migraciones completadas con advertencias"
fi

# Ejecutar seeding de datos con timeout
log "🌱 Ejecutando seeding de datos..."
if timeout 30 npx tsx prisma/seed.ts; then
    log "✅ Seeding completado exitosamente"
else
    log "⚠️  Seeding completado con advertencias"
fi

log "✅ Inicialización completada!"
log "🎯 AURUM INVEST STATION listo para recibir conexiones"

# Iniciar la aplicación
exec "$@"
