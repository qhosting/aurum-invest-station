# 🔧 SOLUCIÓN ERROR PRISMA SCHEMA - AURUM INVEST STATION

## ❌ **Error Identificado**

El build de Docker falla con:
```
Error: Could not find Prisma Schema that is required for this command.
schema.prisma: file not found
prisma/schema.prisma: file not found
```

**Causa:** El Dockerfile actual ejecuta `npm install` que incluye `prisma generate` antes de que el directorio `prisma/` sea copiado.

## ✅ **Solución Inmediata**

### **1. Dockerfile Optimizado para EasyPanel**

**Reemplaza el Dockerfile en EasyPanel con este contenido:**

```dockerfile
# Dockerfile ultra-optimizado para EasyPanel - Sin errores de Prisma
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy only package files first
COPY package*.json ./
# Install production dependencies only (sin scripts de Prisma)
RUN npm ci --only=production --ignore-scripts

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files including prisma
COPY . .

# Generate Prisma client explicitly (después de copiar prisma/)
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy prisma and other necessary files
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/docker-entrypoint.sh ./docker-entrypoint.sh

# Install tsx for running the seed script
RUN npm install -g tsx

USER root
RUN chmod +x docker-entrypoint.sh
USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Use docker-entrypoint.sh as the startup script
CMD ["./docker-entrypoint.sh", "npm", "start"]
```

### **2. Variables de Entorno para EasyPanel**

**Configura estas variables en EasyPanel:**

```bash
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/aurum_invest_station
NEXTAUTH_SECRET=lmM3csYY5lO99PgS/2EKso34xZtoSy/U6GuhvRWgWAM=
NEXTAUTH_URL=https://auruminvest.mx
NEXT_PUBLIC_CHATWOOT_BASE_URL=https://chat.auruminvest.mx
NEXT_PUBLIC_CHATWOOT_TOKEN=tu_token_aqui
NODE_ENV=production
PORT=3000
```

### **3. Configuración de Recursos en EasyPanel**

- **💾 RAM:** Mínimo 2GB (Recomendado 4GB)
- **🖥️ CPU:** Mínimo 1 core (Recomendado 2 cores)
- **⏱️ Build Timeout:** 30 minutos
- **🔌 Registry Timeout:** 10 minutos

## 🎯 **Pasos de Implementación**

### **En EasyPanel:**

1. **Ve a tu aplicación AURUM INVEST STATION**
2. **Reemplaza el contenido del campo "Dockerfile"** con el código de arriba
3. **Configura las variables de entorno** de la lista anterior
4. **Reinicia el despliegue**

## 🔑 **Credenciales Después del Despliegue**

Una vez desplegado exitosamente:

- **Super Administrador:**
  - Email: `admin@auruminvest.mx`
  - Contraseña: `AURUM2024!SuperAdmin`

- **Trader Demo:**
  - Email: `trader@auruminvest.mx`
  - Contraseña: `AURUM2024!Trader`

## ✅ **Cambios Clave en la Solución**

1. **✅ `--ignore-scripts`** en npm install para evitar prisma generate automático
2. **✅ `npm ci`** en lugar de `npm install` para builds más determinísticos
3. **✅ Prisma generate** movido después de `COPY . .` en la etapa builder
4. **✅ Estructura de Dockerfile** optimizada para evitar dependencias circulares

## 🔍 **Verificación Post-Despliegue**

Después del despliegue exitoso:

1. **Acceder a:** https://auruminvest.mx
2. **Verificar:** Página de login carga correctamente
3. **Probar:** Credenciales de admin y trader
4. **Confirmar:** Dashboard muestra datos de ejemplo

## 📞 **Si Persiste el Problema**

Si aún tienes errores:

1. **Verificar logs** en EasyPanel: Aplicación > Logs
2. **Ejecutar troubleshooting** con `bash troubleshoot.sh`
3. **Confirmar recursos** del servidor (RAM mínima 2GB)
4. **Revisar conectividad** de PostgreSQL

---

**🎯 Esta solución elimina específicamente el error "Prisma Schema not found" y optimiza el build para EasyPanel.**