#!/bin/bash

# ===== SCRIPT DE INICIO ROBUSTO PARA AURUM INVEST STATION =====
# Este script se ejecuta como fallback si docker-entrypoint.sh no está disponible

echo "🚀 SCRIPT DE INICIO ROBUSTO ACTIVADO"
echo "=================================="

# Diagnóstico completo del sistema
echo "🔍 DIAGNÓSTICO DEL SISTEMA:"
echo "Directorio actual: $(pwd)"
echo "Usuario actual: $(whoami)"
echo "PID: $$"
echo "Argumentos: $@"

# Buscar docker-entrypoint.sh en múltiples ubicaciones
echo "🔍 Buscando docker-entrypoint.sh..."
SEARCH_PATHS=(
    "/app/docker-entrypoint.sh"
    "/usr/local/bin/docker-entrypoint.sh"
    "./docker-entrypoint.sh"
    "docker-entrypoint.sh"
)

ENTRYPOINT_FOUND=""
for path in "${SEARCH_PATHS[@]}"; do
    if [ -f "$path" ]; then
        echo "✅ Encontrado en: $path"
        ENTRYPOINT_FOUND="$path"
        break
    fi
done

# Si no se encuentra, crear un docker-entrypoint.sh mínimo
if [ -z "$ENTRYPOINT_FOUND" ]; then
    echo "⚠️  docker-entrypoint.sh no encontrado, creando script mínimo..."
    
    cat > /app/docker-entrypoint.sh << 'EOF'
#!/bin/bash
echo "🚀 AURUM INVEST STATION - INICIO RÁPIDO"
echo "Variables de entorno:"
echo "NODE_ENV: $NODE_ENV"
echo "DATABASE_URL: ${DATABASE_URL:0:30}..."
echo "NEXTAUTH_URL: $NEXTAUTH_URL"
echo "PORT: $PORT"

# Esperar PostgreSQL (simplificado)
echo "⏳ Esperando PostgreSQL..."
timeout 30 bash -c 'until nc -z postgres 5432; do sleep 2; done' || echo "⚠️  PostgreSQL no disponible"

# Migraciones
echo "🗄️ Ejecutando migraciones..."
timeout 60 npx prisma migrate deploy || echo "⚠️  Migraciones con advertencias"

# Seeding
echo "🌱 Ejecutando seeding..."
timeout 30 npx tsx prisma/seed.ts || echo "⚠️  Seeding con advertencias"

echo "✅ Inicio completado, iniciando Next.js..."
exec "$@"
EOF
    
    chmod +x /app/docker-entrypoint.sh
    ENTRYPOINT_FOUND="/app/docker-entrypoint.sh"
    echo "✅ Script mínimo creado en: $ENTRYPOINT_FOUND"
fi

# Verificar permisos
if [ ! -x "$ENTRYPOINT_FOUND" ]; then
    echo "⚠️  Aplicando permisos ejecutables..."
    chmod +x "$ENTRYPOINT_FOUND"
fi

# Mostrar información del script seleccionado
echo "📊 Script seleccionado: $ENTRYPOINT_FOUND"
ls -la "$ENTRYPOINT_FOUND"

# Ejecutar el script encontrado
echo "🚀 Ejecutando: $ENTRYPOINT_FOUND $@"
exec "$ENTRYPOINT_FOUND" "$@"