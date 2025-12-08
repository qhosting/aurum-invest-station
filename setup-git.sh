#!/bin/bash

# Script para inicializar y subir AURUM INVEST STATION al repositorio
# Autor: MiniMax Agent

echo "🚀 AURUM INVEST STATION - Git Setup Script"
echo "=============================================="

# Verificar si git está instalado
if ! command -v git &> /dev/null; then
    echo "❌ Git no está instalado. Por favor instala Git primero."
    exit 1
fi

# Verificar si ya existe un repositorio git
if [ ! -d ".git" ]; then
    echo "📦 Inicializando repositorio Git..."
    git init
else
    echo "✅ Repositorio Git ya inicializado"
fi

# Agregar archivos
echo "📁 Agregando archivos al staging..."
git add .

# Hacer commit inicial
echo "💾 Creando commit inicial..."
git commit -m "Initial commit: AURUM INVEST STATION v1.0.0

✨ Características:
- Dashboard de trading profesional con Next.js 14+
- Autenticación con NextAuth.js v5
- Integración Chatwoot AI Coach
- Webhook MT5 seguro
- Base de datos PostgreSQL + Prisma
- Docker multi-stage optimizado
- Migraciones automáticas
- Usuarios administradores auto-generados
- Tema oscuro AURUM con Shadcn/UI

🎯 Dominio: auruminvest.mx
🔐 Auto-setup completo con credenciales pre-generadas"

echo ""
echo "✅ Configuración de Git completada!"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "1. Conecta tu repositorio remoto:"
echo "   git remote add origin https://github.com/TU-USUARIO/aurum-invest-station.git"
echo ""
echo "2. Sube el código al repositorio:"
echo "   git push -u origin main"
echo ""
echo "🔑 CREDENCIALES AUTO-GENERADAS:"
echo "👑 Super Admin: admin@auruminvest.mx / AURUM2024!SuperAdmin"
echo "👤 Trader Demo: trader@auruminvest.mx / AURUM2024!Trader"
echo ""
echo "⚠️  IMPORTANTE: Cambia estas contraseñas después del primer login!"
echo ""
echo "🎯 ¡Listo para desplegar en Easypanel!"