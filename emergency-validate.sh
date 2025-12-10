#!/bin/bash

# ===== VALIDACIÓN CRÍTICA DE ARCHIVOS =====
# Este script debe ejecutarse al inicio del contenedor

echo "🚨 VALIDACIÓN CRÍTICA DE ARCHIVOS - $(date)"
echo "==========================================="

echo "📁 Contenido actual de /app:"
ls -la /app/

echo ""
echo "🔍 Buscando validate-system.sh:"
if [ -f /app/validate-system.sh ]; then
    echo "✅ validate-system.sh encontrado en /app/"
    echo "📊 Permisos: $(ls -la /app/validate-system.sh)"
    echo "📋 Primeras líneas del archivo:"
    head -5 /app/validate-system.sh
else
    echo "❌ validate-system.sh NO encontrado en /app/"
    echo "🔍 Buscando en directorios alternativos..."
    
    # Buscar en la raíz del contenedor
    find / -name "validate-system.sh" 2>/dev/null || echo "❌ No se encontró en ninguna ubicación"
fi

echo ""
echo "🔍 Buscando docker-entrypoint.sh:"
if [ -f /app/docker-entrypoint.sh ]; then
    echo "✅ docker-entrypoint.sh encontrado"
else
    echo "❌ docker-entrypoint.sh NO encontrado"
fi

echo ""
echo "🔍 Verificando permisos de usuario:"
whoami
id
echo "📁 Directorio actual: $(pwd)"

echo ""
echo "✅ VALIDACIÓN COMPLETA"