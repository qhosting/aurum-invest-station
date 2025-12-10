#!/bin/bash

# ========================================
# AURUM INVEST STATION - Docker Entrypoint
# Configuración robusta con troubleshooting mejorado
# ========================================

set -e

# Function for logging with timestamp
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

log "=========================================="
log "AURUM INVEST STATION - INICIANDO"
log "=========================================="

# System information
log "INFORMACIÓN DEL SISTEMA:"
log "  Directorio actual: $(pwd)"
log "  Usuario: $(whoami)"
log "  PID: $$"
log "  Node version: $(node --version 2>/dev/null || echo 'N/A')"
log "  npm version: $(npm --version 2>/dev/null || echo 'N/A')"

# Check critical environment variables
log ""
log "VARIABLES DE ENTORNO CRÍTICAS:"
log "  NODE_ENV: ${NODE_ENV:-'NOT SET'}"
log "  PORT: ${PORT:-3000}"
log "  NEXTAUTH_URL: ${NEXTAUTH_URL:-'NOT SET'}"

# Database URL parsing (extract host and port from DATABASE_URL)
if [ -n "$DATABASE_URL" ]; then
    log "  DATABASE_URL: ${DATABASE_URL:0:30}... [REDACTED]"
    
    # Extract database host and port from DATABASE_URL
    # Format: postgresql://user:pass@host:port/dbname
    DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\):.*/\1/p')
    DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    
    log "  Parsed DB Host: ${DB_HOST:-'localhost'}"
    log "  Parsed DB Port: ${DB_PORT:-5432}"
else
    log "  DATABASE_URL: NOT SET - La aplicación fallará al iniciar"
    log "  ⚠️  ADVERTENCIA: DATABASE_URL es requerido"
    DB_HOST="localhost"
    DB_PORT="5432"
fi

# Install netcat if not available (for database connection testing)
if ! command -v nc &> /dev/null; then
    log "Instalando netcat para pruebas de conexión..."
    apk add --no-cache netcat-openbsd 2>/dev/null || log "No se pudo instalar netcat"
fi

# Wait for PostgreSQL to be available
log ""
log "VERIFICANDO CONEXIÓN A BASE DE DATOS:"
log "  Esperando conexión a ${DB_HOST}:${DB_PORT}..."

MAX_RETRIES=30
RETRY_COUNT=0
CONNECTION_SUCCESS=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; then
        log "  ✅ Conexión a base de datos establecida"
        CONNECTION_SUCCESS=true
        break
    fi
    
    RETRY_COUNT=$((RETRY_COUNT + 1))
    log "  Intento $RETRY_COUNT/$MAX_RETRIES - Esperando base de datos..."
    sleep 2
done

if [ "$CONNECTION_SUCCESS" = false ]; then
    log "  ⚠️  ADVERTENCIA: No se pudo conectar a ${DB_HOST}:${DB_PORT} después de $MAX_RETRIES intentos"
    log "  La aplicación intentará conectarse pero puede fallar"
    log ""
    log "TROUBLESHOOTING:"
    log "  1. Verifica que DATABASE_URL esté correctamente configurado"
    log "  2. Asegúrate de que el servicio de PostgreSQL esté corriendo"
    log "  3. Verifica la conectividad de red entre contenedores"
    log "  4. Revisa los logs del contenedor de PostgreSQL"
else
    log "  Base de datos accesible - Continuando..."
fi

# Run Prisma migrations
log ""
log "EJECUTANDO MIGRACIONES DE BASE DE DATOS:"

if [ "$CONNECTION_SUCCESS" = true ]; then
    if timeout 90 npx prisma migrate deploy 2>&1 | tee /tmp/migrate.log; then
        log "  ✅ Migraciones completadas exitosamente"
    else
        EXIT_CODE=${PIPESTATUS[0]}
        log "  ⚠️  Migraciones completadas con código de salida: $EXIT_CODE"
        log "  Log de migraciones:"
        cat /tmp/migrate.log 2>/dev/null || log "  No se pudo leer el log"
        
        # Don't exit - let the app try to start
        log "  Continuando de todas formas..."
    fi
else
    log "  ⚠️  OMITIENDO migraciones - Base de datos no accesible"
fi

# Run data seeding (optional - may fail if data already exists)
log ""
log "EJECUTANDO SEED DE DATOS:"

if [ "$CONNECTION_SUCCESS" = true ]; then
    if timeout 60 npx tsx prisma/seed.ts 2>&1 | tee /tmp/seed.log; then
        log "  ✅ Seed completado exitosamente"
    else
        EXIT_CODE=${PIPESTATUS[0]}
        log "  ℹ️  Seed completado con código de salida: $EXIT_CODE"
        log "  (Esto es normal si los datos ya existen)"
        
        # Check if it's just a duplicate key error (expected)
        if grep -q "Unique constraint" /tmp/seed.log 2>/dev/null; then
            log "  Los datos ya existen - esto es normal"
        fi
    fi
else
    log "  ⚠️  OMITIENDO seed - Base de datos no accesible"
fi

# Final status
log ""
log "=========================================="
log "INICIALIZACIÓN COMPLETADA"
log "=========================================="
log "Estado de la aplicación:"
log "  - Conexión DB: $([ "$CONNECTION_SUCCESS" = true ] && echo '✅ OK' || echo '❌ FALLO')"
log "  - Migraciones: $([ -f /tmp/migrate.log ] && echo '✅ Ejecutadas' || echo '⚠️  Omitidas')"
log "  - Seed: $([ -f /tmp/seed.log ] && echo '✅ Ejecutado' || echo '⚠️  Omitido')"
log ""
log "Iniciando aplicación Next.js..."
log "La aplicación estará disponible en http://0.0.0.0:${PORT:-3000}"
log ""
log "Para ver logs en tiempo real:"
log "  docker logs -f <container_id>"
log ""
log "=========================================="

# Start the application (this will replace the current process)
# Any logs after this point will come from the Next.js application
exec "$@"
