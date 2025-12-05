# AURUM INVEST STATION - Guía de Ramas Git

## 🌿 **Rama Recomendada para Producción**

### Rama: `main`
- **URL completa**: https://github.com/qhosting/aurum-invest-station.git
- **Branch**: `main`

## ⚙️ **Configuración en EasyPanel**

### Step 1: Source Tab
```
Repository: qhosting/aurum-invest-station
Branch: main
Dockerfile Path: ./Dockerfile
```

### Step 2: Verificar Branch
En EasyPanel, asegúrate de seleccionar:
- **Branch**: `main` ✅
- **Dockerfile**: `./Dockerfile`

## 🚀 **Proceso de Despliegue**

1. **EasyPanel detecta automáticamente** la rama `main`
2. **Clona el repositorio** desde GitHub
3. **Construye la imagen Docker** usando el Dockerfile
4. **Despliega el contenedor** en tu servidor

## 📝 **Si Usas Otra Rama**

Si prefieres usar una rama diferente, actualiza la configuración:

### Para rama `develop`:
```
Repository: qhosting/aurum-invest-station
Branch: develop
```

### Para rama `production`:
```
Repository: qhosting/aurum-invest-station
Branch: production
```

## ⚡ **Comandos Git (Si necesitas cambiar ramas)**

```bash
# Ver ramas disponibles
git branch -a

# Cambiar a rama main
git checkout main

# O crear rama específica para Docker
git checkout -b docker-production
git push -u origin docker-production
```

## 🔍 **Verificar Branch en Repositorio**

En GitHub, puedes ver que tu commit está en `main`:
- **Commit**: `a1465a1`
- **Branch**: `main`
- **Repository**: https://github.com/qhosting/aurum-invest-station

## ✅ **Configuración Final EasyPanel**

```
═══════════════════════════════════════════
           EASYPANEL CONFIG
═══════════════════════════════════════════
Source:
  Repository: qhosting/aurum-invest-station
  Branch: main
  Dockerfile: ./Dockerfile

Build:
  Method: Dockerfile

Environment:
  .env.production (desde .env.production)

Domains:
  Internal Port: 3000

Storage:
  Volume: /data (para SQLite)

Deploy:
  Click Deploy ✅
═══════════════════════════════════════════
```

## 🎯 **Resumen**

**✅ BRANCA RECOMENDADA: `main`**
**✅ URL: `https://github.com/qhosting/aurum-invest-station.git`**
**✅ BRANCH: `main`**

Esta configuración está lista para despliegue inmediato en EasyPanel.