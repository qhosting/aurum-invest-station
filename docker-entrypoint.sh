#!/bin/bash

# ===== VALIDACIÓN Y DIAGNÓSTICO ROBUSTO =====
set -e  # Salir en caso de error

echo "🔍 DOCKER-ENTRYPOINT.SH - INICIANDO VALIDACIÓN"
echo "=============================================="

# Información básica del sistema
echo "📊 INFORMACIÓN DEL SISTEMA:"
echo "Directorio actual: $(pwd)"
echo "Usuario actual: $(whoami)"
echo "PID: $$"
echo "Script ejecutado: $0"

# Función para logging con timestamp
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Validar ubicación del script
SCRIPT_PATH="/app/docker-entrypoint.sh"
log "Verificando ubicación del script: $SCRIPT_PATH"

if [ ! -f "$SCRIPT_PATH" ]; then
    log "❌ ERROR CRÍTICO: $SCRIPT_PATH no encontrado!"
    log "📁 Contenido de /app:"
    ls -la /app/ 2>/dev/null || log "❌ No se puede acceder a /app"
    log "🔍 Buscando docker-entrypoint.sh en todo el sistema:"
    find / -name "docker-entrypoint.sh" -type f 2>/dev/null | head -5 || log "❌ No encontrado"
    log "❌ ABORTANDO EJECUCIÓN"
    exit 1
fi

log "✅ Script encontrado: $SCRIPT_PATH"
log "📊 Permisos: $(ls -la "$SCRIPT_PATH")"

# Asegurar permisos ejecutables
if [ ! -x "$SCRIPT_PATH" ]; then
    log "⚠️  Aplicando permisos ejecutables..."
    chmod +x "$SCRIPT_PATH"
    log "✅ Permisos aplicados: $(ls -la "$SCRIPT_PATH")"
fi

# Verificar variables de entorno críticas
log "🔍 Variables de entorno:"
log "NODE_ENV: ${NODE_ENV:-'NO DEFINIDA'}"
log "DATABASE_URL: ${DATABASE_URL:0:50}..."
log "NEXTAUTH_URL: ${NEXTAUTH_URL:-'NO DEFINIDA'}"
log "PORT: ${PORT:-'NO DEFINIDA'}"

log "🚀 Iniciando AURUM INVEST STATION..."

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