# AURUM INVEST STATION

**Multi-Tenant Trading Dashboard with AI Coaching Integration**

Una plataforma completa de trading que integra múltiples brokers, análisis en tiempo real y coaching con IA para traders profesionales.

## 🚀 Características Principales

- **📊 Dashboard en Tiempo Real**: Métricas de trading, equity curve y análisis de rendimiento
- **🔐 Autenticación Robusta**: Sistema de roles (ADMIN/TRADER) con NextAuth.js
- **📈 Integración MT5**: Webhooks seguros para datos de trading en tiempo real
- **🤖 Chatwoot Integration**: Soporte al cliente integrado con identidad de usuario
- **🗄️ Base de Datos PostgreSQL**: Esquema completo con Prisma ORM
- **🎨 UI/UX Moderna**: Interfaz dark theme con Tailwind CSS y Shadcn/UI
- **🐳 Despliegue Docker**: Configuración optimizada para EasyPanel

## 🛠️ Stack Tecnológico

- **Frontend**: Next.js 14+ (App Router) + React 18
- **Backend**: Next.js API Routes + TypeScript
- **Base de Datos**: PostgreSQL + Prisma ORM
- **Autenticación**: NextAuth.js v5
- **UI Framework**: Tailwind CSS + Shadcn/UI
- **Gráficos**: Recharts
- **Formularios**: React Hook Form + Zod
- **Despliegue**: Docker + EasyPanel

## 📋 Prerrequisitos

- Node.js 18.19.0 o superior
- PostgreSQL 14+
- Docker (para despliegue)

## 🔧 Instalación Local

### 1. Clonar el repositorio
```bash
git clone https://github.com/qhosting/aurum-invest-station.git
cd aurum-invest-station
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env.local
```

Editar `.env.local`:
```bash
DATABASE_URL=postgresql://username:password@localhost:5432/aurum_invest_station
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_CHATWOOT_BASE_URL=https://your-chatwoot-instance.com
NEXT_PUBLIC_CHATWOOT_TOKEN=your-chatwoot-token
```

### 4. Configurar base de datos
```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Poblar con datos de ejemplo
npm run db:seed
```

### 5. Ejecutar en desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🐳 Despliegue con Docker

### Configuración para EasyPanel

#### 1. Dockerfile Optimizado
El proyecto incluye un Dockerfile optimizado que maneja:
- Instalación automática de dependencias
- Migraciones de base de datos
- Seeding automático de datos
- Configuración de variables de entorno

#### 2. Variables de Entorno en EasyPanel
```bash
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/aurum_invest_station
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_CHATWOOT_BASE_URL=https://your-chatwoot-domain.com
NEXT_PUBLIC_CHATWOOT_TOKEN=your-chatwoot-token
NODE_ENV=production
PORT=3000
```

#### 3. Recursos Recomendados
- **RAM**: Mínimo 2GB (Recomendado 4GB)
- **CPU**: Mínimo 1 core (Recomendado 2 cores)
- **Almacenamiento**: 10GB mínimo

## 🔑 Credenciales por Defecto

Después del despliegue, se crean automáticamente:

### Super Administrador
- **Email**: admin@auruminvest.mx
- **Contraseña**: AURUM2024!SuperAdmin
- **Rol**: ADMIN

### Trader Demo
- **Email**: trader@auruminvest.mx
- **Contraseña**: AURUM2024!Trader
- **Rol**: TRADER

## 📊 Estructura del Proyecto

```
aurum-invest-station/
├── prisma/
│   ├── schema.prisma          # Esquema de base de datos
│   └── seed.ts               # Datos de ejemplo
├── src/
│   ├── app/                  # App Router de Next.js
│   │   ├── api/             # API Routes
│   │   ├── auth/            # Páginas de autenticación
│   │   └── dashboard/       # Dashboard principal
│   ├── components/          # Componentes React
│   │   ├── ui/             # Componentes UI base
│   │   └── dashboard/      # Componentes del dashboard
│   ├── lib/                # Utilidades y configuraciones
│   └── types/              # Tipos TypeScript
├── docker-entrypoint.sh     # Script de inicialización
├── Dockerfile               # Configuración Docker
└── package.json            # Dependencias del proyecto
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `GET/POST /api/auth/[...nextauth]` - Autenticación NextAuth

### Trading
- `POST /api/webhooks/mt5` - Webhook para datos MT5
- `GET /api/health` - Health check

## 🗄️ Esquema de Base de Datos

### Modelos Principales
- **User**: Usuarios del sistema (ADMIN/TRADER)
- **Trade**: Operaciones de trading
- **JournalMetric**: Métricas diarias del journal

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linting
npm run db:generate  # Generar cliente Prisma
npm run db:migrate   # Ejecutar migraciones
npm run db:studio    # Abrir Prisma Studio
npm run db:seed      # Poblar con datos de ejemplo
```

## 🚨 Solución de Problemas

### Error: "Prisma Schema not found"
- Verificar que el directorio `prisma/` existe
- Asegurar que `schema.prisma` está presente
- Ejecutar `npx prisma generate`

### Error: "Database connection failed"
- Verificar que PostgreSQL está ejecutándose
- Comprobar la variable `DATABASE_URL`
- Verificar conectividad de red

### Error: "Port 3000 already in use"
- Cambiar el puerto en variables de entorno
- O detener el proceso que usa el puerto 3000

## 📈 Funcionalidades del Dashboard

- **Métricas en Tiempo Real**: Equity, drawdown, win rate
- **Gráfico de Equity Curve**: Visualización del rendimiento
- **Tabla de Trades Recientes**: Últimas operaciones
- **Integración Chatwoot**: Soporte al cliente
- **Gestión de Usuarios**: Sistema de roles y permisos

## 🤝 Contribuciones

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**MiniMax Agent** - Desarrollo completo de la plataforma

---

**AURUM INVEST STATION v1.0** - Plataforma completa de trading con IA 🚀