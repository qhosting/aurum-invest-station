#!/bin/bash

# Script para generar claves secretas seguras para AURUM INVEST STATION
# Autor: MiniMax Agent
# Fecha: Diciembre 2025

echo "🔐 Generador de Claves Secretas - AURUM INVEST STATION"
echo "======================================================"

# Función para generar clave secreta de NextAuth
generate_nextauth_secret() {
    echo "Generando NEXTAUTH_SECRET segura..."
    if command -v openssl >/dev/null 2>&1; then
        SECRET=$(openssl rand -base64 32)
        echo "✅ NEXTAUTH_SECRET generada:"
        echo "NEXTAUTH_SECRET=$SECRET"
        echo ""
        echo "💡 Copia esta clave y úsala en tu archivo .env.production"
        echo ""
    else
        echo "❌ OpenSSL no encontrado. Instala OpenSSL para generar claves seguras."
    fi
}

# Función para generar API key de ejemplo
generate_example_api_key() {
    echo "Generando API Key de ejemplo..."
    if command -v openssl >/dev/null 2>&1; then
        API_KEY=$(openssl rand -hex 32)
        echo "✅ API Key generada:"
        echo "OPENAI_API_KEY=$API_KEY"
        echo ""
    else
        echo "❌ OpenSSL no encontrado."
    fi
}

# Función para mostrar variables de entorno de ejemplo
show_example_environment() {
    echo "📋 Variables de Entorno de Ejemplo:"
    echo "===================================="
    echo ""
    echo "# Base de datos"
    echo "DATABASE_URL=file:./production.db"
    echo ""
    echo "# Next.js"
    echo "NODE_ENV=production"
    echo "NEXT_TELEMETRY_DISABLED=1"
    echo ""
    echo "# NextAuth (GENERAR NUEVAS CLAVES)"
    generate_nextauth_secret
    echo "NEXTAUTH_URL=https://tu-dominio.com"
    echo ""
    echo "# APIs (CAMBIAR POR VALORES REALES)"
    generate_example_api_key
    echo "CHATWOOT_TOKEN=tu_chatwoot_token_real"
    echo "CHATWOOT_URL=https://tu-chatwoot-instance.com"
    echo "N8N_WEBHOOK_URL=https://tu-n8n-instance.com/webhook/aurum-trades"
    echo "MT5_CONNECTOR_URL=https://tu-mt5-connector.com"
    echo ""
    echo "# Email"
    echo "SMTP_HOST=smtp.gmail.com"
    echo "SMTP_PORT=587"
    echo "SMTP_USER=tu-email@gmail.com"
    echo "SMTP_PASSWORD=tu_app_password"
    echo ""
    echo "# Puerto"
    echo "PORT=3000"
    echo "HOSTNAME=0.0.0.0"
}

# Función para validar configuración
validate_setup() {
    echo "🔍 Validando Configuración del Proyecto"
    echo "======================================"
    
    echo "Verificando archivos necesarios..."
    
    if [ -f "Dockerfile" ]; then
        echo "✅ Dockerfile encontrado"
    else
        echo "❌ Dockerfile no encontrado"
    fi
    
    if [ -f ".env.production" ]; then
        echo "✅ .env.production encontrado"
    else
        echo "❌ .env.production no encontrado"
    fi
    
    if [ -f "next.config.ts" ]; then
        echo "✅ next.config.ts encontrado"
    else
        echo "❌ next.config.ts no encontrado"
    fi
    
    if [ -f "healthcheck.js" ]; then
        echo "✅ healthcheck.js encontrado"
    else
        echo "❌ healthcheck.js no encontrado"
    fi
    
    if [ -f "src/app/api/health/route.ts" ]; then
        echo "✅ Health API route encontrado"
    else
        echo "❌ Health API route no encontrado"
    fi
    
    echo ""
    echo "📝 Próximos pasos:"
    echo "1. Generar nuevas claves secretas (usar función generate_nextauth_secret)"
    echo "2. Actualizar .env.production con las claves generadas"
    echo "3. Configurar variables de API con valores reales"
    echo "4. Subir cambios a GitHub: git add . && git commit && git push"
    echo "5. Desplegar en EasyPanel siguiendo DOCKER_DEPLOYMENT.md"
}

# Función principal
main() {
    echo "Selecciona una opción:"
    echo "1) Generar NEXTAUTH_SECRET"
    echo "2) Mostrar variables de entorno de ejemplo"
    echo "3) Validar configuración del proyecto"
    echo "4) Todas las opciones"
    echo ""
    read -p "Opción (1-4): " choice
    
    case $choice in
        1)
            generate_nextauth_secret
            ;;
        2)
            show_example_environment
            ;;
        3)
            validate_setup
            ;;
        4)
            show_example_environment
            echo ""
            validate_setup
            ;;
        *)
            echo "Opción inválida"
            exit 1
            ;;
    esac
}

# Ejecutar script si se llama directamente
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi