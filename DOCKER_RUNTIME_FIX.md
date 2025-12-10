# 🔧 Docker Runtime Fix - Resolución de Problemas de Logs

**Fecha:** 2025-12-10  
**Issue:** Falta de actividad en logs después del deploy

---

## 📋 Problema Identificado

Después de un build exitoso de Docker, el contenedor no mostraba actividad en los logs después del deploy. La imagen se creó correctamente (`docker.io/easypanel/qhosting/aurum-station:latest`), pero no había logs de runtime.

### Síntomas
- ✅ Build de Docker completado exitosamente
- ❌ Sin logs después del deploy
- ⚠️ Error de health check durante build (normal, pero confuso)
- ⚠️ Posible fallo silencioso al intentar conectarse a PostgreSQL

### Causa Raíz
1. **docker-entrypoint.sh** asumía que PostgreSQL estaba en host `postgres`, pero esto puede variar según el entorno de deploy
2. Falta de parsing dinámico de `DATABASE_URL` para extraer host y puerto
3. Logging insuficiente para troubleshooting
4. No había netcat pre-instalado en la imagen de runtime para testing de conexiones
5. Errores silenciosos si la DB no estaba disponible

---

## ✅ Correcciones Implementadas

### 1. **docker-entrypoint.sh mejorado**

**Cambios principales:**

```bash
# ✅ Parsing dinámico de DATABASE_URL
DB_HOST=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')

# ✅ Logging detallado con timestamps
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# ✅ Verificación de conexión con retry logic
MAX_RETRIES=30
while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null; then
        CONNECTION_SUCCESS=true
        break
    fi
    sleep 2
done

# ✅ Manejo de errores graceful
if [ "$CONNECTION_SUCCESS" = false ]; then
    log "⚠️ ADVERTENCIA: No se pudo conectar..."
    log "La aplicación intentará conectarse pero puede fallar"
fi
```

**Mejoras:**
- ✅ Extrae automáticamente host y puerto de `DATABASE_URL`
- ✅ Funciona con cualquier configuración de DB (Docker Compose, servicios externos, etc.)
- ✅ Logs con timestamps para debugging
- ✅ Mensajes de troubleshooting útiles
- ✅ No falla inmediatamente si DB no está disponible
- ✅ Logs detallados del estado de migraciones y seeding
- ✅ Información clara sobre el estado de inicialización

### 2. **Dockerfile actualizado**

```dockerfile
# ✅ Pre-instalar netcat en runtime
FROM base AS runner
RUN apk add --no-cache netcat-openbsd
```

**Beneficios:**
- Elimina la necesidad de instalar netcat durante el entrypoint
- Reduce el tiempo de inicio del contenedor
- Asegura que las herramientas de debugging estén disponibles

### 3. **TROUBLESHOOTING_DOCKER.md - Guía completa**

Documento exhaustivo con:
- ✅ Comandos para verificar estado del contenedor
- ✅ Guía de visualización y búsqueda de logs
- ✅ Lista completa de variables de entorno requeridas
- ✅ Soluciones a 6+ problemas comunes
- ✅ Comandos de debugging
- ✅ Checklist de deploy

### 4. **.env.production.example**

Template con:
- ✅ Todas las variables necesarias para producción
- ✅ Ejemplos para diferentes plataformas (Railway, Render, EasyPanel, etc.)
- ✅ Instrucciones de generación de secrets
- ✅ Notas de seguridad
- ✅ Tips de configuración

---

## 🔍 Análisis del Error de Health Check Durante Build

Durante el build aparece este error:
```
Health check failed: PrismaClientInitializationError: 
Can't reach database server at `localhost:5432`
```

### ¿Es un problema?
**NO** - Esto es completamente normal.

### Explicación:
1. Next.js intenta pre-renderizar rutas estáticas durante el build
2. La ruta `/api/health` hace una consulta a PostgreSQL
3. Durante el build **no hay base de datos disponible**
4. El build continúa exitosamente de todas formas
5. En runtime, el endpoint funcionará correctamente

### Por qué no es crítico:
- El build no falla por esto
- Solo afecta a la pre-generación de esa ruta específica
- La aplicación funciona correctamente en runtime
- El health check se ejecutará correctamente cuando la app esté corriendo

---

## 📊 Comparación: Antes vs Después

### Antes ❌
```bash
# docker-entrypoint.sh
nc -z postgres 5432  # ❌ Host hardcodeado
# Sin logs detallados
# Falla silenciosamente
# No indica qué salió mal
```

**Resultado:** Contenedor inicia pero no hay logs → confusión

### Después ✅
```bash
# docker-entrypoint.sh
log "=========================================="
log "AURUM INVEST STATION - INICIANDO"
log "=========================================="
log "INFORMACIÓN DEL SISTEMA:"
log "  Directorio actual: /app"
log "  Usuario: nextjs"
log "  Node version: v18.x.x"
...
log "  Parsed DB Host: db.example.com"
log "  Parsed DB Port: 5432"
log "VERIFICANDO CONEXIÓN A BASE DE DATOS:"
log "  Esperando conexión a db.example.com:5432..."
log "  ✅ Conexión a base de datos establecida"
log "EJECUTANDO MIGRACIONES DE BASE DE DATOS:"
log "  ✅ Migraciones completadas exitosamente"
log "=========================================="
log "INICIALIZACIÓN COMPLETADA"
log "=========================================="
log "Iniciando aplicación Next.js..."
```

**Resultado:** Logs claros que muestran exactamente qué está pasando

---

## 🚀 Cómo Usar las Mejoras

### 1. Rebuild de la imagen

```bash
# Desde el directorio del proyecto
docker build -t aurum-station:latest .
```

### 2. Deploy con variables de entorno

```bash
docker run -d \
  -e DATABASE_URL="postgresql://user:pass@your-db-host:5432/db" \
  -e NEXTAUTH_SECRET="your-secure-secret-32-chars-min" \
  -e NEXTAUTH_URL="https://your-domain.com" \
  -e NODE_ENV="production" \
  -p 3000:3000 \
  aurum-station:latest
```

### 3. Verificar logs

```bash
# Logs en tiempo real
docker logs -f <container_id>

# Deberías ver:
[2025-12-10 05:30:15] AURUM INVEST STATION - INICIANDO
[2025-12-10 05:30:15] INFORMACIÓN DEL SISTEMA:
...
[2025-12-10 05:30:16] ✅ Conexión a base de datos establecida
...
[2025-12-10 05:30:20] INICIALIZACIÓN COMPLETADA
[2025-12-10 05:30:20] Iniciando aplicación Next.js...
```

### 4. Verificar health endpoint

```bash
curl http://localhost:3000/api/health

# Respuesta esperada:
{
  "status": "healthy",
  "timestamp": "2025-12-10T05:30:00.000Z",
  "services": {
    "database": "connected",
    "application": "running"
  }
}
```

---

## 🐛 Debugging

Si sigues sin ver logs:

### 1. Verificar estado del contenedor
```bash
docker ps -a | grep aurum
```

### 2. Inspeccionar logs completos
```bash
docker logs <container_id>
```

### 3. Acceder al contenedor
```bash
docker exec -it <container_id> sh

# Dentro del contenedor
cat /app/docker-entrypoint.sh  # Verificar que existe
ls -la /app/                    # Ver archivos
nc -zv <db-host> 5432          # Test de conexión
```

### 4. Consultar guía de troubleshooting
```bash
cat TROUBLESHOOTING_DOCKER.md
```

---

## 📦 Archivos Modificados/Creados

### Modificados:
- ✅ `docker-entrypoint.sh` - Completamente reescrito con mejor logging
- ✅ `Dockerfile` - Agregado netcat-openbsd

### Creados:
- ✅ `TROUBLESHOOTING_DOCKER.md` - Guía completa de troubleshooting
- ✅ `.env.production.example` - Template de variables de entorno
- ✅ `DOCKER_RUNTIME_FIX.md` (este archivo) - Documentación de los cambios

---

## ✅ Testing

Para probar los cambios:

```bash
# 1. Build
docker build -t aurum-test .

# 2. Run con logs visibles
docker run -it --rm \
  -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
  -e NEXTAUTH_SECRET="test-secret-at-least-32-chars" \
  -e NEXTAUTH_URL="http://localhost:3000" \
  -p 3000:3000 \
  aurum-test

# 3. En otra terminal, verificar health
curl http://localhost:3000/api/health
```

---

## 🔐 Seguridad

**Recordatorios importantes:**

1. ⚠️ **NUNCA** commitear credenciales reales
2. ✅ Usar secrets management de tu plataforma
3. ✅ Generar NEXTAUTH_SECRET único: `openssl rand -base64 32`
4. ✅ Usar HTTPS en producción
5. ✅ Rotar secrets regularmente

---

## 📚 Referencias

- [TROUBLESHOOTING_DOCKER.md](./TROUBLESHOOTING_DOCKER.md) - Guía completa de troubleshooting
- [.env.production.example](./.env.production.example) - Template de configuración
- [README.md](./README.md) - Documentación general del proyecto
- [RESUMEN_TECNICO.md](./RESUMEN_TECNICO.md) - Estado técnico del proyecto

---

**Estado:** ✅ COMPLETADO  
**Próximos pasos:** Deploy en producción con las nuevas mejoras
