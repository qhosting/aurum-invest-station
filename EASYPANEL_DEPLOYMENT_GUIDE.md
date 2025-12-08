# 🚀 Guía de Despliegue AURUM INVEST STATION en EasyPanel

## 📋 Problemas Comunes y Soluciones

### ❌ Error: "context canceled" en Docker
**Síntoma:** El build falla con "context canceled"

**Causa:** Timeout en el proceso de build, conectividad con daemon Docker, o recursos insuficientes

**Soluciones:**

#### 1. 🔧 Usar Dockerfile Optimizado
```bash
# Reemplazar el Dockerfile actual con la versión simple
cp Dockerfile.simple Dockerfile
```

#### 2. ⚡ Configuración en EasyPanel
- **Memory:** Mínimo 2GB
- **CPU:** Mínimo 1 core
- **Build Timeout:** Aumentar a 30 minutos
- **Registry Timeout:** Aumentar a 10 minutos

#### 3. 🌐 Variables de Entorno Críticas
```bash
# En EasyPanel, configurar:
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/aurum_invest_station
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=https://auruminvest.mx
NEXT_PUBLIC_CHATWOOT_BASE_URL=https://chat.auruminvest.mx
NEXT_PUBLIC_CHATWOOT_TOKEN=tu_token_aqui
```

#### 4. 🔄 Estrategia de Despliegue Escalonado
```bash
# Paso 1: Deploy sin variables de entorno
# Paso 2: Una vez que el container esté corriendo, configurar variables
# Paso 3: Reiniciar el servicio
```

## 🛠️ Comandos de Diagnóstico

### Ejecutar Troubleshooting
```bash
chmod +x troubleshoot.sh
./troubleshoot.sh
```

### Verificar Logs
```bash
# En EasyPanel, ir a:
# Aplicación > Logs > Ver todos los logs
```

### Test de Conectividad
```bash
# Desde el contenedor, verificar PostgreSQL
docker exec -it <container_name> nc -z postgres 5432
```

## 📊 Configuración Óptima para EasyPanel

### Recursos Mínimos
- **RAM:** 2GB
- **CPU:** 1 core
- **Almacenamiento:** 10GB
- **Network:** 100 Mbps

### Recursos Recomendados
- **RAM:** 4GB
- **CPU:** 2 cores
- **Almacenamiento:** 20GB
- **Network:** 1 Gbps

### Configuración Docker
```yaml
# docker-compose.yml optimizado
version: '3.8'
services:
  aurum-invest-station:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_URL=${DATABASE_URL}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - NEXT_PUBLIC_CHATWOOT_BASE_URL=${NEXT_PUBLIC_CHATWOOT_BASE_URL}
      - NEXT_PUBLIC_CHATWOOT_TOKEN=${NEXT_PUBLIC_CHATWOOT_TOKEN}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

## 🔐 Credenciales Auto-generadas

Una vez desplegado, puedes acceder con:

### Super Administrador
- **Email:** admin@auruminvest.mx
- **Contraseña:** AURUM2024!SuperAdmin
- **Rol:** ADMIN

### Trader Demo
- **Email:** trader@auruminvest.mx
- **Contraseña:** AURUM2024!Trader
- **Rol:** TRADER

## 🚨 Resolución de Errores Comunes

### Error: "package-lock.json not found"
**Solución:** Ya corregido en el Dockerfile optimizado

### Error: "Prisma client generation failed"
```bash
# En el contenedor, ejecutar manualmente:
docker exec -it <container_name> npx prisma generate
```

### Error: "Database connection failed"
**Verificar:**
1. PostgreSQL está corriendo
2. Variables de entorno correctas
3. Conectividad de red entre containers

### Error: "Port 3000 already in use"
```bash
# Cambiar el puerto en EasyPanel
# O modificar el Dockerfile:
ENV PORT=3001
EXPOSE 3001
```

## 📈 Monitoreo Post-Despliegue

### Health Check
```bash
curl -f http://localhost:3000/api/health
```

### Verificar Base de Datos
```bash
curl -f http://localhost:3000/api/auth/session
```

### Logs de Aplicación
```bash
# En EasyPanel: Aplicación > Logs
# O por terminal:
docker logs <container_name>
```

## 🎯 URLs Importantes

- **Aplicación:** https://auruminvest.mx
- **API Health:** https://auruminvest.mx/api/health
- **Documentación API:** https://auruminvest.mx/api/docs
- **Chatwoot:** https://chat.auruminvest.mx

## ✅ Checklist Pre-Despliegue

- [ ] EasyPanel configurado con recursos mínimos
- [ ] Variables de entorno preparadas
- [ ] PostgreSQL configurado y funcionando
- [ ] Dockerfile optimizado seleccionado
- [ ] Timeout de build aumentado a 30 minutos
- [ ] Registro de contenedores configurado
- [ ] Dominio DNS configurado (auruminvest.mx)

## 📞 Soporte

Si persisten los problemas:

1. **Ejecutar troubleshooting:** `./troubleshoot.sh`
2. **Revisar logs en EasyPanel**
3. **Verificar conectividad de red**
4. **Comprobar recursos del servidor**

## 🔄 Rollback

En caso de fallo del despliegue:

1. **En EasyPanel:** Ir a Aplicación > Rollback
2. **Seleccionar versión anterior**
3. **Reiniciar servicio**

---

**AURUM INVEST STATION v1.0** - Listo para producción 🚀