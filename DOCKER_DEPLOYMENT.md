# AURUM INVEST STATION - Docker Deployment Guide

Esta guía describe cómo desplegar AURUM INVEST STATION en EasyPanel usando Docker.

## 🚀 **Despliegue en EasyPanel**

### Prerrequisitos
- EasyPanel instalado en tu servidor
- GitHub repository configurado (ya completado)
- Dominio personalizado (recomendado)

### Paso 1: Configurar Proyecto en EasyPanel

1. **Crear Proyecto**:
   - Accede a EasyPanel
   - Click en "New Project"
   - Nombre: `AURUM INVEST STATION`
   - Click "Create"

2. **Configurar App Service**:
   - En el proyecto, click "+ Service"
   - Selecciona "App"

3. **Configurar Source**:
   - Selecciona "GitHub"
   - Autoriza tu cuenta de GitHub
   - Repositorio: `qhosting/aurum-invest-station`

### Paso 2: Configurar Build

1. **Build Tab**:
   - Selecciona "Dockerfile"
   - Dockerfile Path: `./Dockerfile`
   - Build Command: (dejar vacío)

### Paso 3: Variables de Entorno

1. **Environment Tab**:
   - Copia el contenido de `.env.production`
   - **IMPORTANTE**: Cambiar las variables siguientes:
     - `NEXTAUTH_URL=https://tu-dominio-real.com`
     - `NEXTAUTH_SECRET=generar-nueva-clave-secreta`
     - `OPENAI_API_KEY=tu_clave_real`
     - Y todas las demás APIs con valores reales
   - Marca "Create .env file" ✅

### Paso 4: Configurar Dominio

1. **Domains Tab**:
   - Agrega tu dominio personalizado
   - Internal Port: `3000`
   - EasyPanel configurará HTTPS automáticamente

### Paso 5: Configurar Almacenamiento

1. **Storage Tab**:
   - Volume Mount:
     - Name: `database`
     - Mount Path: `/data`
   - Esto persistirá la base de datos SQLite

### Paso 6: Deploy

1. Click "Deploy"
2. Espera la construcción (5-10 minutos)
3. Tu aplicación estará disponible en tu dominio

## 🐳 **Comandos Docker Locales**

### Construir imagen localmente:
```bash
npm run docker:build
```

### Ejecutar contenedor local:
```bash
npm run docker:run
```

### Verificar build:
```bash
npm run test:build
```

## 📋 **Variables de Entorno**

### Variables Críticas (DEBES cambiar):
- `NEXTAUTH_URL` - URL de tu aplicación en producción
- `NEXTAUTH_SECRET` - Clave secreta generada con `openssl rand -base64 32`
- `OPENAI_API_KEY` - Clave de API de OpenAI (opcional)
- `DATABASE_URL` - URL de la base de datos (ya configurado para SQLite)

### Variables Opcionales:
- `CHATWOOT_TOKEN` - Para soporte al cliente
- `CHATWOOT_URL` - URL de tu instancia de Chatwoot
- `N8N_WEBHOOK_URL` - Para automatización
- `MT5_CONNECTOR_URL` - Para conectar con MetaTrader 5
- `SMTP_*` - Para envío de emails

## 🔧 **Configuración de la Base de Datos**

### SQLite (Desarrollo/Producción Pequeña)
- Configurado por defecto
- Almacenado en `/data/production.db`
- Funciona bien para proyectos pequeños a medianos

### PostgreSQL (Recomendado para Producción)
Si decides migrar a PostgreSQL:
1. Cambiar `DATABASE_URL` en `.env.production`
2. Actualizar `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Ejecutar migración: `npm run prisma:migrate`

## 🔍 **Monitoreo y Debugging**

### Health Check
La aplicación incluye un endpoint de health check:
- URL: `https://tu-dominio.com/api/health`
- Verifica estado de la aplicación y base de datos

### Logs
En EasyPanel:
- **Logs Tab**: Ver logs en tiempo real
- **Console Tab**: Acceder al terminal del contenedor

### Comandos Útiles
```bash
# Ver logs
npm run logs

# Reiniciar servicio
npm restart

# Acceder al console
npm console
```

## 🛡️ **Seguridad**

### Headers de Seguridad
La aplicación incluye headers de seguridad configurados en `next.config.ts`:
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- Referrer-Policy: origin-when-cross-origin

### Variables de Entorno
- **NUNCA** commitees archivos `.env*`
- Solo usar `.env.example` como plantilla
- Generar claves secretas fuertes con `openssl rand -base64 32`

## ⚡ **Optimizaciones**

### Docker
- Multi-stage build para imágenes más pequeñas
- Non-root user para seguridad
- Health check incluido
- Cache de dependencias optimizado

### Next.js
- Output standalone para Docker
- Server Components optimizados
- Static asset optimization
- Image optimization

## 🐛 **Troubleshooting**

### Error: "Port 3000 not accessible"
- Verificar que `PORT=3000` esté en variables de entorno
- Confirmar que Internal Port en EasyPanel sea `3000`

### Error: "Database connection failed"
- Verificar que el volume mount `/data` esté configurado
- Confirmar permisos del directorio

### Error: "Build failed"
- Verificar que todos los archivos estén en GitHub
- Confirmar que el Dockerfile esté en la raíz
- Revisar logs de build en EasyPanel

### Error: "Environment variables not found"
- Asegurar que "Create .env file" esté marcado
- Verificar que las variables no tengan espacios extras

## 📞 **Soporte**

Para problemas específicos:
1. Revisa los logs en EasyPanel
2. Verifica la configuración de variables de entorno
3. Consulta la documentación de EasyPanel
4. Contacta al equipo de desarrollo

---

**Última actualización**: Diciembre 2025
**Versión**: 1.0.0
**Autor**: MiniMax Agent