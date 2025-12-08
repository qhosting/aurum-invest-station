#!/bin/bash

# Script de inicialización automática para AURUM INVEST STATION
echo "🚀 Iniciando AURUM INVEST STATION..."

# Esperar a que PostgreSQL esté disponible
echo "⏳ Esperando conexión a PostgreSQL..."
until nc -z postgres 5432; do
  sleep 1
done
echo "✅ PostgreSQL está disponible"

# Ejecutar migraciones de Prisma
echo "🗄️  Ejecutando migraciones de base de datos..."
npx prisma migrate deploy

# Ejecutar seeding de datos
echo "🌱 Ejecutando seeding de datos..."
npx tsx prisma/seed.ts

echo "✅ Inicialización completada!"
echo "🎯 AURUM INVEST STATION listo para recibir conexiones"

# Iniciar la aplicación
exec "$@"