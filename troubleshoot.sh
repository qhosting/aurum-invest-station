#!/bin/bash

# Script de troubleshooting para AURUM INVEST STATION en EasyPanel
# Ejecutar para diagnosticar problemas de despliegue

echo "🔍 AURUM INVEST STATION - Troubleshooting"
echo "=========================================="

# Verificar variables de entorno críticas
echo "📋 Verificando variables de entorno..."
echo "DATABASE_URL: ${DATABASE_URL:-'NO CONFIGURADA'}"
echo "NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:-'NO CONFIGURADA'}"
echo "NEXTAUTH_URL: ${NEXTAUTH_URL:-'NO CONFIGURADA'}"
echo ""

# Verificar conectividad a PostgreSQL
echo "🔗 Verificando conectividad a PostgreSQL..."
if command -v nc &> /dev/null; then
    if nc -z postgres 5432; then
        echo "✅ PostgreSQL es accesible"
    else
        echo "❌ PostgreSQL NO es accesible"
    fi
else
    echo "⚠️  netcat no disponible, usando ping..."
    if ping -c 1 postgres &> /dev/null; then
        echo "✅ PostgreSQL host responde al ping"
    else
        echo "❌ PostgreSQL host NO responde"
    fi
fi
echo ""

# Verificar archivos críticos
echo "📁 Verificando archivos críticos..."
files=("package.json" "docker-entrypoint.sh" "prisma/schema.prisma")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file existe"
    else
        echo "❌ $file NO existe"
    fi
done
echo ""

# Verificar permisos
echo "🔐 Verificando permisos..."
if [ -x "docker-entrypoint.sh" ]; then
    echo "✅ docker-entrypoint.sh es ejecutable"
else
    echo "❌ docker-entrypoint.sh NO es ejecutable"
fi
echo ""

# Verificar configuración de Next.js
echo "⚙️  Verificando configuración de Next.js..."
if [ -f "next.config.js" ]; then
    echo "✅ next.config.js existe"
    if grep -q "output: 'standalone'" next.config.js; then
        echo "✅ Configuración standalone presente"
    else
        echo "⚠️  Configuración standalone no encontrada"
    fi
else
    echo "❌ next.config.js NO existe"
fi
echo ""

# Verificar espacio en disco
echo "💾 Verificando espacio en disco..."
df -h | head -1
df -h | tail -n +2 | while read filesystem size used avail use mount; do
    echo "$filesystem: $size total, $used usado, $avail disponible ($use)"
done
echo ""

# Mostrar logs recientes si existen
echo "📋 Últimos logs del sistema:"
if [ -f "/var/log/syslog" ]; then
    tail -n 10 /var/log/syslog | grep -E "(docker|container)" || echo "No se encontraron logs de docker"
elif [ -f "/var/log/messages" ]; then
    tail -n 10 /var/log/messages | grep -E "(docker|container)" || echo "No se encontraron logs de docker"
else
    echo "Logs del sistema no encontrados"
fi

echo ""
echo "🏁 Troubleshooting completado"
echo "=========================================="