#!/bin/bash

# ===== SCRIPT DE VALIDACIÓN COMPLETA =====
# Ejecutar este script para diagnosticar problemas con docker-entrypoint.sh

echo "🔍 VALIDACIÓN COMPLETA DEL SISTEMA"
echo "================================="

# Información del sistema
echo "📊 INFORMACIÓN DEL SISTEMA:"
echo "Directorio actual: $(pwd)"
echo "Usuario actual: $(whoami)"
echo "Grupo actual: $(groups)"
echo "PID: $$"
echo "Directorio de trabajo: $(pwd)"
echo "Directorio home: $HOME"

# Verificar estructura de directorios
echo ""
echo "📁 ESTRUCTURA DE DIRECTORIOS:"
echo "Contenido de /app:"
ls -la /app/ 2>/dev/null || echo "❌ No se puede acceder a /app"

echo ""
echo "Contenido de /usr/local/bin:"
ls -la /usr/local/bin/ 2>/dev/null | grep docker || echo "❌ No hay scripts docker en /usr/local/bin"

# Buscar docker-entrypoint.sh en todo el sistema
echo ""
echo "🔍 BÚSQUEDA DE DOCKER-ENTRYPOINT.SH:"
SEARCH_PATHS=(
    "/app/docker-entrypoint.sh"
    "/usr/local/bin/docker-entrypoint.sh"
    "./docker-entrypoint.sh"
    "docker-entrypoint.sh"
    "/app/start-app.sh"
)

for path in "${SEARCH_PATHS[@]}"; do
    if [ -f "$path" ]; then
        echo "✅ Encontrado: $path"
        echo "   Permisos: $(ls -la $path)"
        echo "   Tipo: $(file $path)"
        echo "   Tamaño: $(stat -f%z "$path" 2>/dev/null || stat -c%s "$path" 2>/dev/null) bytes"
    else
        echo "❌ No encontrado: $path"
    fi
done

# Verificar variables de entorno
echo ""
echo "🔍 VARIABLES DE ENTORNO:"
echo "NODE_ENV: ${NODE_ENV:-'NO DEFINIDA'}"
echo "DATABASE_URL: ${DATABASE_URL:0:50}..."
echo "NEXTAUTH_URL: ${NEXTAUTH_URL:-'NO DEFINIDA'}"
echo "NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:0:20}..."
echo "PORT: ${PORT:-'NO DEFINIDA'}"
echo "HOSTNAME: ${HOSTNAME:-'NO DEFINIDA'}"

# Verificar herramientas necesarias
echo ""
echo "🔧 HERRAMIENTAS NECESARIAS:"
for tool in npm node npx prisma; do
    if command -v $tool >/dev/null 2>&1; then
        echo "✅ $tool: $(which $tool) - $( $tool --version 2>/dev/null || echo 'version unknown')"
    else
        echo "❌ $tool: NO DISPONIBLE"
    fi
done

# Verificar conectividad a PostgreSQL
echo ""
echo "🗄️ CONECTIVIDAD A POSTGRESQL:"
if command -v nc >/dev/null 2>&1; then
    if timeout 5 nc -z postgres 5432 2>/dev/null; then
        echo "✅ PostgreSQL accesible en puerto 5432"
    else
        echo "❌ PostgreSQL NO accesible en puerto 5432"
    fi
else
    echo "⚠️  netcat (nc) no disponible para verificar conectividad"
fi

# Verificar archivos críticos de la aplicación
echo ""
echo "📄 ARCHIVOS CRÍTICOS DE LA APLICACIÓN:"
CRITICAL_FILES=(
    "/app/package.json"
    "/app/next.config.js"
    "/app/.next"
    "/app/prisma/schema.prisma"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -e "$file" ]; then
        echo "✅ $file existe"
    else
        echo "❌ $file NO existe"
    fi
done

echo ""
echo "✅ VALIDACIÓN COMPLETA FINALIZADA"
echo "================================="