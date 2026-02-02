# 🔧 AURUM INVEST STATION - Guía de Troubleshooting Docker

## 📋 Índice
1. [Verificación de Estado del Contenedor](#verificación-de-estado-del-contenedor)
2. [Visualización de Logs](#visualización-de-logs)
3. [Variables de Entorno Requeridas](#variables-de-entorno-requeridas)
4. [Problemas Comunes y Soluciones](#problemas-comunes-y-soluciones)
5. [Health Checks](#health-checks)
6. [Comandos Útiles](#comandos-útiles)

---

## 🔍 Verificación de Estado del Contenedor

### 1. Verificar si el contenedor está corriendo

```bash
# Listar todos los contenedores (incluyendo detenidos)
docker ps -a

# Buscar específicamente el contenedor de Aurum
docker ps -a | grep aurum
```

**Indicadores de estado:**
- `Up X minutes/hours` → ✅ Contenedor corriendo
- `Exited (0)` → ⚠️ Contenedor terminó normalmente
- `Exited (1)` o código diferente de 0 → ❌ Contenedor falló

### 2. Inspeccionar detalles del contenedor

```bash
# Obtener información detallada
docker inspect <container_id>

# Ver solo el estado
docker inspect <container_id> | grep -A 10 "State"

# Ver variables de entorno configuradas
docker inspect <container_id> | grep -A 50 "Env"
```

### 3. Verificar recursos del contenedor

```bash
# Ver uso de CPU, memoria, red
docker stats <container_id>

# Ver uso de recursos de todos los contenedores
docker stats
```

---

## 📊 Visualización de Logs

### Comandos básicos de logs

```bash
# Ver últimos logs
docker logs <container_id>

# Ver logs en tiempo real (seguimiento)
docker logs -f <container_id>

# Ver últimas 100 líneas
docker logs --tail 100 <container_id>

# Ver logs con timestamps
docker logs -t <container_id>

# Ver logs desde hace 10 minutos
docker logs --since 10m <container_id>

# Ver logs entre fechas específicas
docker logs --since "2025-12-10T00:00:00" --until "2025-12-10T12:00:00" <container_id>
```

### Buscar errores específicos en logs

```bash
# Buscar errores
docker logs <container_id> 2>&1 | grep -i error

# Buscar warnings
docker logs <container_id> 2>&1 | grep -i warning

# Buscar problemas de base de datos
docker logs <container_id> 2>&1 | grep -i "database\|postgres\|prisma"

# Buscar problemas de conexión
docker logs <container_id> 2>&1 | grep -i "connection\|connect\|econnrefused"
```

### Logs del entrypoint

El archivo `docker-entrypoint.sh` genera logs con timestamps en el siguiente formato:
```
[2025-12-10 05:30:15] MENSAJE
```

Busca estos patrones clave:
- `AURUM INVEST STATION - INICIANDO` → Inicio del contenedor
- `Conexión a base de datos establecida` → DB conectada ✅
- `No se pudo conectar a` → Problema de conexión DB ❌
- `Migraciones completadas exitosamente` → Migraciones OK ✅
- `INICIALIZACIÓN COMPLETADA` → Entrypoint completado
- `Iniciando aplicación Next.js` → App iniciando

---

## 🔐 Variables de Entorno Requeridas

### Variables CRÍTICAS (obligatorias)

```bash
# Base de datos (OBLIGATORIO)
DATABASE_URL="postgresql://username:password@host:5432/database_name"

# Autenticación NextAuth (OBLIGATORIO)
NEXTAUTH_SECRET="tu-secret-seguro-de-minimo-32-caracteres"
NEXTAUTH_URL="https://tu-dominio.com"

# Configuración de Node
NODE_ENV="production"
PORT=3000
```

### Variables opcionales

```bash
# Chatwoot
NEXT_PUBLIC_CHATWOOT_TOKEN="token-de-chatwoot"
NEXT_PUBLIC_CHATWOOT_BASE_URL="https://chat.auruminvest.mx"

# MT5 Webhook
MT5_WEBHOOK_SECRET="webhook-secret"

# Seguridad
ENCRYPTION_KEY="tu-clave-de-encriptacion-32-caracteres"
```

### Cómo configurar variables en diferentes plataformas

#### Docker Compose
```yaml
services:
  app:
    image: tu-imagen:latest
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/db
      - NEXTAUTH_SECRET=tu-secret
      - NEXTAUTH_URL=https://tu-dominio.com
      - NODE_ENV=production
    env_file:
      - .env.production
```

#### Docker Run
```bash
docker run -d \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e NEXTAUTH_SECRET="tu-secret" \
  -e NEXTAUTH_URL="https://tu-dominio.com" \
  -e NODE_ENV="production" \
  -p 3000:3000 \
  tu-imagen:latest
```

#### EasyPanel / Render / Railway
Configura las variables de entorno en el panel de configuración de la plataforma.

**⚠️ IMPORTANTE:** Nunca incluyas credenciales reales en el código fuente o en el repositorio Git.

---

## 🚨 Problemas Comunes y Soluciones

### Problema 1: "No hay actividad en los logs después del deploy"

**Síntomas:**
- El contenedor está en estado "Up" pero no genera logs
- No hay respuesta en el puerto 3000
- `docker logs` no muestra nada o muy poco

**Causas posibles:**
1. ❌ DATABASE_URL no configurado o incorrecto
2. ❌ El contenedor no puede conectarse a PostgreSQL
3. ❌ La aplicación falla silenciosamente al iniciar

**Solución:**

```bash
# 1. Verificar estado del contenedor
docker ps -a | grep aurum

# 2. Ver logs completos
docker logs <container_id>

# 3. Si el contenedor está "Exited", ver por qué falló
docker inspect <container_id> | grep -A 20 "State"

# 4. Verificar variables de entorno
docker inspect <container_id> | grep -A 50 "Env" | grep -i database

# 5. Intentar acceder al contenedor
docker exec -it <container_id> sh

# 6. Dentro del contenedor, verificar conectividad a DB
nc -z <db_host> 5432
# o
telnet <db_host> 5432

# 7. Verificar que Prisma puede conectarse
npx prisma db pull
```

**Fix rápido:**
```bash
# Recrear contenedor con logging verbose
docker run -it --rm \
  -e DATABASE_URL="tu-database-url" \
  -e NEXTAUTH_SECRET="tu-secret" \
  -e NEXTAUTH_URL="https://tu-url.com" \
  -e NODE_ENV="production" \
  -p 3000:3000 \
  tu-imagen:latest
```

### Problema 2: "Can't reach database server"

**Síntomas:**
```
PrismaClientInitializationError: Can't reach database server at `host:5432`
```

**Causas:**
1. ❌ PostgreSQL no está corriendo
2. ❌ Host incorrecto en DATABASE_URL
3. ❌ Puerto bloqueado o firewall
4. ❌ Credenciales incorrectas

**Solución:**

```bash
# 1. Verificar que PostgreSQL está corriendo
docker ps | grep postgres
# o si es un servicio externo
nc -zv <db_host> 5432

# 2. Verificar formato de DATABASE_URL
# Formato correcto:
# postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public

# 3. Para Docker Compose, verificar red
docker network ls
docker network inspect <network_name>

# 4. Verificar conectividad desde el contenedor
docker exec -it <container_id> sh
nc -zv <db_host> 5432

# 5. Probar conexión manual
docker exec -it <container_id> sh
apk add postgresql-client
psql "$DATABASE_URL"
```

**Fix:**
1. Asegúrate de que el host en DATABASE_URL sea correcto:
   - Para Docker Compose: usa el nombre del servicio (ej: `postgres`)
   - Para servicios externos: usa la IP o dominio completo
2. Verifica que ambos contenedores estén en la misma red Docker
3. Verifica credenciales y permisos de la base de datos

### Problema 3: "Health check failed during build"

**Síntomas:**
Durante el build aparece:
```
Health check failed: PrismaClientInitializationError
Can't reach database server at `localhost:5432`
```

**¿Es un problema?**
❌ **NO** - Esto es NORMAL durante el build.

**Explicación:**
- Next.js intenta pre-generar páginas estáticas durante el build
- El endpoint `/api/health` intenta conectarse a la base de datos
- Durante el build **no hay base de datos disponible**
- Esto **no afecta** el funcionamiento en runtime

**Solución:**
No requiere acción. Puedes ignorar este error durante el build.

Si quieres eliminarlo, puedes:
1. Deshabilitar la generación estática del endpoint de health
2. Usar un mock de Prisma durante el build
3. Configurar una base de datos de build temporal

### Problema 4: "Migrations failed"

**Síntomas:**
```
⚠️ Migraciones completadas con código de salida: 1
```

**Causas:**
1. ❌ Base de datos no accesible
2. ❌ Prisma schema desincronizado
3. ❌ Permisos insuficientes en la base de datos

**Solución:**

```bash
# 1. Verificar estado actual de migraciones
docker exec -it <container_id> npx prisma migrate status

# 2. Ver qué migraciones faltan
docker exec -it <container_id> npx prisma migrate resolve

# 3. Aplicar migraciones manualmente
docker exec -it <container_id> npx prisma migrate deploy

# 4. Si hay conflictos, resetear (⚠️ CUIDADO: borra datos)
docker exec -it <container_id> npx prisma migrate reset --force

# 5. Verificar conexión
docker exec -it <container_id> npx prisma db pull
```

### Problema 5: "Container keeps restarting"

**Síntomas:**
- El contenedor se reinicia constantemente
- `docker ps` muestra "Restarting"

**Solución:**

```bash
# 1. Ver por qué está reiniciando
docker logs --tail 50 <container_id>

# 2. Ver conteo de reinicios
docker inspect <container_id> | grep -A 5 "RestartCount"

# 3. Detener el contenedor temporalmente
docker stop <container_id>

# 4. Iniciar en modo interactivo para debugging
docker run -it --rm \
  --entrypoint /bin/sh \
  -e DATABASE_URL="..." \
  tu-imagen:latest

# 5. Dentro del shell, ejecutar manualmente
/app/docker-entrypoint.sh npm start
```

### Problema 6: "Port 3000 already in use"

**Síntomas:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solución:**

```bash
# 1. Ver qué está usando el puerto 3000
lsof -i :3000
# o
netstat -tulpn | grep 3000

# 2. Detener el proceso que usa el puerto
kill <PID>

# 3. O usar un puerto diferente
docker run -d -p 8080:3000 tu-imagen:latest
```

---

## ❤️ Health Checks

### Health Check interno de la aplicación

```bash
# Verificar health endpoint
curl http://localhost:3000/api/health

# Respuesta esperada (saludable):
{
  "status": "healthy",
  "timestamp": "2025-12-10T05:30:00.000Z",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "application": "running"
  }
}

# Respuesta (no saludable):
{
  "status": "unhealthy",
  "timestamp": "2025-12-10T05:30:00.000Z",
  "error": "Database connection failed",
  "services": {
    "database": "disconnected",
    "application": "running"
  }
}
```

### Configurar Health Check en Docker Compose

```yaml
services:
  app:
    image: tu-imagen:latest
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
```

---

## 🛠️ Comandos Útiles

### Debugging dentro del contenedor

```bash
# Acceder al contenedor
docker exec -it <container_id> sh

# Ver archivos del proyecto
ls -la /app/

# Ver logs de npm
cat /root/.npm/_logs/*

# Verificar Prisma
npx prisma --version
npx prisma generate
npx prisma migrate status

# Probar conexión a DB
nc -zv <db_host> 5432
```

### Reconstruir y reiniciar

```bash
# Detener contenedor
docker stop <container_id>

# Eliminar contenedor
docker rm <container_id>

# Reconstruir imagen
docker build -t aurum-station:latest .

# Iniciar nuevo contenedor
docker run -d \
  -e DATABASE_URL="..." \
  -e NEXTAUTH_SECRET="..." \
  -p 3000:3000 \
  aurum-station:latest

# Ver logs del nuevo contenedor
docker logs -f <new_container_id>
```

### Backup y restore de base de datos

```bash
# Backup
docker exec <postgres_container> pg_dump -U postgres aurum_db > backup.sql

# Restore
docker exec -i <postgres_container> psql -U postgres aurum_db < backup.sql
```

### Limpiar Docker

```bash
# Eliminar contenedores detenidos
docker container prune

# Eliminar imágenes no usadas
docker image prune -a

# Eliminar volúmenes no usados
docker volume prune

# Limpiar todo
docker system prune -a --volumes
```

---

## 📞 Soporte Adicional

Si ninguna de estas soluciones funciona:

1. **Recopila información:**
   ```bash
   # Logs completos
   docker logs <container_id> > logs.txt
   
   # Configuración del contenedor
   docker inspect <container_id> > inspect.json
   
   # Variables de entorno (oculta secretos)
   docker inspect <container_id> | grep -A 50 Env > env.txt
   ```

2. **Verifica la documentación:**
   - README.md
   - RESUMEN_TECNICO.md
   - DOCKER_FIX_SUMMARY.md

3. **Contacta al equipo de desarrollo** con:
   - Logs completos
   - Plataforma de deploy (EasyPanel, Railway, etc.)
   - Variables de entorno configuradas (sin secrets)
   - Versión de Docker

---

## ✅ Checklist de Deploy

Antes de deployar, asegúrate de que:

- [ ] DATABASE_URL está correctamente configurado
- [ ] NEXTAUTH_SECRET tiene al menos 32 caracteres
- [ ] NEXTAUTH_URL apunta al dominio correcto
- [ ] NODE_ENV está en "production"
- [ ] PostgreSQL está corriendo y accesible
- [ ] El puerto 3000 está disponible
- [ ] Las credenciales de DB son correctas
- [ ] La red Docker permite comunicación entre contenedores
- [ ] Hay suficiente memoria (mínimo 512MB)
- [ ] Las migraciones de Prisma están actualizadas

---

**Última actualización:** 2025-12-10  
**Versión:** 1.0.0
