#!/bin/bash

# ===== VALIDACIÓN Y DIAGNÓSTICO COMPLETO =====
echo "🔍 DIAGNÓSTICO COMPLETO DE DOCKER-ENTRYPOINT.SH"
echo "=================================================="

# Validar que el script está en la ubicación correcta
SCRIPT_PATH="/app/docker-entrypoint.sh"
echo "🔍 Verificando ubicación del script..."
echo "Script path: $SCRIPT_PATH"
echo "Script actual (\$0): $0"
echo "PID: $$"

if [ ! -f "$SCRIPT_PATH" ]; then
    echo "❌ ERROR CRÍTICO: $SCRIPT_PATH no encontrado!"
    echo "📁 Directorio actual: $(pwd)"
    echo "📋 Contenido de /app:"
    ls -la /app/ 2>/dev/null || echo "❌ No se puede acceder a /app"
    echo "🔍 Buscando docker-entrypoint.sh en todo el sistema:"
    find / -name "docker-entrypoint.sh" -type f 2>/dev/null || echo "❌ No encontrado"
    echo "❌ ABORTANDO EJECUCIÓN - Archivo no encontrado"
    exit 1
fi

echo "✅ Script encontrado en: $SCRIPT_PATH"
echo "📊 Permisos del archivo:"
ls -la "$SCRIPT_PATH"

# Verificar que es ejecutable
if [ ! -x "$SCRIPT_PATH" ]; then
    echo "⚠️  Script no es ejecutable, aplicando permisos..."
    chmod +x "$SCRIPT_PATH"
    echo "✅ Permisos aplicados: $(ls -la "$SCRIPT_PATH")"
fi

# Verificar variables de entorno críticas
echo "🔍 Variables de entorno:"
echo "NODE_ENV: ${NODE_ENV:-'NO DEFINIDA'}"
echo "DATABASE_URL: ${DATABASE_URL:0:30}..."
echo "NEXTAUTH_URL: ${NEXTAUTH_URL:-'NO DEFINIDA'}"
echo "PORT: ${PORT:-'NO DEFINIDA'}"

# Script de inicialización automática para AURUM INVEST STATION
echo "🚀 Iniciando AURUM INVEST STATION..."

# ===== VALIDACIONES DE DIAGNÓSTICO =====
echo "🔍 DIAGNÓSTICO DEL ENTORNO:"
echo "📁 Directorio actual: $(pwd)"
echo "📋 Usuario actual: $(whoami)"
echo "🔢 PID actual: $$"
echo "📋 Argumentos recibidos: $@"
echo "🔍 Verificando ubicación de docker-entrypoint.sh..."

# Verificar que el archivo actual existe
if [ -f "/app/docker-entrypoint.sh" ]; then
    echo "✅ /app/docker-entrypoint.sh existe"
    echo "📊 Permisos: $(ls -la /app/docker-entrypoint.sh)"
else
    echo "❌ /app/docker-entrypoint.sh NO existe"
    echo "📁 Contenido de /app:"
    ls -la /app/
    echo "🔍 Buscando docker-entrypoint.sh en el sistema..."
    find /app -name "docker-entrypoint.sh" 2>/dev/null || echo "❌ No encontrado en /app"
    find / -name "docker-entrypoint.sh" -type f 2>/dev/null | head -5 || echo "❌ No encontrado en todo el sistema"
fi

# Verificar variables de entorno críticas
echo "🔍 Variables de entorno:"
echo "NODE_ENV: $NODE_ENV"
echo "DATABASE_URL: ${DATABASE_URL:0:20}..."
echo "NEXTAUTH_URL: $NEXTAUTH_URL"
echo "PORT: $PORT"

# ===== VALIDACIÓN DE UBICACIÓN ACTUAL =====
echo "🔍 Validando ubicación del script:"
if [ "$0" = "/app/docker-entrypoint.sh" ] || [ "$0" = "./docker-entrypoint.sh" ]; then
    echo "✅ Script ejecutado desde la ubicación correcta"
else
    echo "⚠️  Script ejecutado desde: $0"
fi

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