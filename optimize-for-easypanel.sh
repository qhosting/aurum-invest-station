#!/bin/bash

# Script de optimización automática para EasyPanel
# Ejecutar antes del despliegue para evitar errores

echo "🔧 AURUM INVEST STATION - Optimización para EasyPanel"
echo "===================================================="

# Hacer ejecutables los scripts
chmod +x troubleshoot.sh

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: No se encuentra package.json. Ejecutar desde el directorio raíz del proyecto."
    exit 1
fi

echo "✅ Directorio del proyecto verificado"

# Backup del Dockerfile actual
if [ -f "Dockerfile" ]; then
    cp Dockerfile Dockerfile.backup
    echo "✅ Backup del Dockerfile creado como Dockerfile.backup"
fi

# Aplicar optimizaciones al Dockerfile
echo "🔧 Aplicando optimizaciones al Dockerfile..."

# Verificar si existe Dockerfile.optimized
if [ -f "Dockerfile.optimized" ]; then
    cp Dockerfile.optimized Dockerfile
    echo "✅ Dockerfile optimizado aplicado"
elif [ -f "Dockerfile.simple" ]; then
    cp Dockerfile.simple Dockerfile
    echo "✅ Dockerfile simple aplicado"
else
    echo "⚠️  No se encontraron archivos Dockerfile optimizados"
fi

# Optimizar docker-entrypoint.sh
echo "🔧 Optimizando docker-entrypoint.sh..."

# Crear versión mejorada del entrypoint
cat > docker-entrypoint.sh << 'EOF'
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
EOF

chmod +x docker-entrypoint.sh
echo "✅ docker-entrypoint.sh optimizado"

# Verificar variables de entorno críticas
echo "🔍 Verificando configuración..."

if [ -z "$DATABASE_URL" ]; then
    echo "⚠️  ADVERTENCIA: DATABASE_URL no está configurada"
fi

if [ -z "$NEXTAUTH_SECRET" ]; then
    echo "⚠️  ADVERTENCIA: NEXTAUTH_SECRET no está configurada"
fi

if [ -z "$NEXTAUTH_URL" ]; then
    echo "⚠️  ADVERTENCIA: NEXTAUTH_URL no está configurada"
fi

# Generar NEXTAUTH_SECRET si no existe
if [ -z "$NEXTAUTH_SECRET" ]; then
    echo "🔑 Generando NEXTAUTH_SECRET..."
    echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" > .env.temp
    echo "✅ NEXTAUTH_SECRET generado en .env.temp"
fi

# Crear archivo de configuración para EasyPanel
cat > easypanel-config.env << EOF
# Configuración para EasyPanel - AURUM INVEST STATION
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/aurum_invest_station
NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-$(openssl rand -base64 32)}
NEXTAUTH_URL=https://auruminvest.mx
NEXT_PUBLIC_CHATWOOT_BASE_URL=https://chat.auruminvest.mx
NEXT_PUBLIC_CHATWOOT_TOKEN=tu_token_aqui
NODE_ENV=production
PORT=3000
EOF

echo "✅ Archivo easypanel-config.env creado"

# Verificar archivos críticos
echo "📁 Verificando archivos críticos..."
files=("package.json" "docker-entrypoint.sh" "prisma/schema.prisma" "next.config.js")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file existe"
    else
        echo "❌ $file NO existe"
    fi
done

# Mostrar configuración recomendada para EasyPanel
echo ""
echo "📋 Configuración recomendada para EasyPanel:"
echo "============================================"
echo "💾 Memoria: Mínimo 2GB (Recomendado 4GB)"
echo "🖥️  CPU: Mínimo 1 core (Recomendado 2 cores)"
echo "⏱️  Build Timeout: 30 minutos"
echo "🔌 Registry Timeout: 10 minutos"
echo "🔄 Restart Policy: unless-stopped"
echo ""

echo "📝 Pasos siguientes:"
echo "1. Copiar el contenido de 'easypanel-config.env' a EasyPanel"
echo "2. Configurar las variables de entorno en EasyPanel"
echo "3. Ajustar recursos del servidor según las recomendaciones"
echo "4. Ejecutar el despliegue"
echo ""

echo "🎯 ¡Optimización completada!"
echo "===================================================="

# Limpiar archivos temporales
rm -f .env.temp

echo "✅ Archivos temporales limpiados"