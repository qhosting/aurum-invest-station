# AURUM INVEST STATION

Plataforma profesional de trading algorítmico con análisis en tiempo real, journal de trading y coaching de IA.

## 🚀 Características Principales

- **Dashboard Profesional**: Métricas de trading, curva de capital y análisis de rendimiento en tiempo real
- **Journal de Trading**: Registro manual y automático de trades con coaching de IA y análisis emocional
- **Automatización MT5**: Webhook seguro para integración con MetaTrader 5
- **Autenticación Avanzada**: NextAuth.js v4 con roles (TRADER, SUPER_ADMIN) y JWT
- **Análisis de Datos**: Charts interactivos con Recharts, métricas PnL y risk-reward
- **Tema Oscuro**: Interfaz profesional con paleta de colores AURUM (Gold/Dark Navy)
- **Validación Robusta**: Zod schemas para todas las entradas de datos
- **TypeScript Completo**: Tipado estricto en toda la aplicación
- **Componentes Reutilizables**: Biblioteca completa de componentes Shadcn/UI
- **Base de Datos Flexible**: Soporte para SQLite (desarrollo) y PostgreSQL (producción)

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14.2.33** con App Router y Server Actions
- **TypeScript 5** (strict mode)
- **Tailwind CSS 3.4.1** para styling
- **Shadcn/UI** + Radix UI components (Avatar, Dialog, Dropdown, etc.)
- **Recharts 2.12.7** para gráficos interactivos
- **Lucide React** para iconografía
- **React Hook Form** para formularios

### Backend & Base de Datos
- **Prisma ORM 5.18.0** para manejo de datos
- **SQLite** para desarrollo local
- **PostgreSQL** para producción
- **NextAuth.js v4.24.8** para autenticación
- **Zod 3.23.8** para validación de esquemas
- **bcrypt 5.1.1** para hashing de contraseñas

### APIs & Integración
- **Webhooks MT5**: API segura con X-API-KEY authentication
- **JWT** para manejo de sesiones
- **RBAC**: Sistema de roles con SUPER_ADMIN y TRADER
- **Server Actions**: Mutations del lado del servidor sin API routes

## 📋 Requisitos Previos

- Node.js 18.19.0 o superior
- PostgreSQL 14+
- npm o yarn

## 🚦 Instalación y Configuración

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd aurum-invest-station
```

### 2. Instalar Dependencias
```bash
npm install
```

### 3. Configurar Variables de Entorno

El proyecto ya incluye un archivo `.env.local` de ejemplo. Para desarrollo rápido, puedes usar SQLite:

```env
# Database (SQLite para desarrollo local)
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="aurum-dev-secret-2025-key-[tu-secret-seguro-aqui]"

# AI Configuration (Opcional - para uso futuro)
OPENAI_API_KEY="sk-your-openai-key-here"
CHATWOOT_TOKEN="your-chatwoot-token"
CHATWOOT_URL="https://your-domain.chatwoot.com"

# Automation (Opcional - para uso futuro)
N8N_WEBHOOK_URL="http://localhost:5678/webhook"
MT5_CONNECTOR_URL="http://localhost:8080"

# Email Configuration (Opcional - para uso futuro)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

**Para producción**, cambia a PostgreSQL:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/aurum_invest_station"
```

### 4. Configurar la Base de Datos

#### Opción A: SQLite (Desarrollo Rápido)
```bash
# Generar cliente Prisma
npx prisma generate

# Crear base de datos y esquema
npx prisma migrate dev --name init

# Ver la base de datos en el navegador
npx prisma studio
```

#### Opción B: PostgreSQL (Producción)
```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev --name init

# Ver la base de datos en el navegador
npx prisma studio
```

**Nota**: El proyecto está configurado para SQLite por defecto. Para cambiar a PostgreSQL, actualiza el `DATABASE_URL` en `.env.local` y ejecuta las migraciones.

### 5. Scripts Disponibles

```bash
# Servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar servidor de producción
npm start

# Linting del código
npm run lint

# Verificar configuración
node test-setup.js
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🏗️ Estructura del Proyecto

```
aurum-invest-station/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API endpoints
│   │   ├── auth/              # Páginas de autenticación
│   │   ├── dashboard/         # Dashboard principal
│   │   ├── journal/           # Journal de trading
│   │   └── globals.css        # Estilos globales
│   ├── components/
│   │   ├── ui/                # Componentes Shadcn/UI
│   │   ├── layout/            # Componentes de layout
│   │   └── dashboard/         # Componentes del dashboard
│   ├── lib/
│   │   ├── auth.ts            # Configuración NextAuth
│   │   ├── prisma.ts          # Cliente Prisma
│   │   ├── utils.ts           # Utilidades
│   │   └── validations.ts     # Esquemas Zod
│   └── types/
│       └── index.ts           # Tipos TypeScript
├── prisma/
│   └── schema.prisma          # Esquema de base de datos
└── public/                    # Assets estáticos
```

## 🔐 Autenticación y Roles

### Roles Disponibles
- **TRADER**: Acceso a dashboard y journal
- **SUPER_ADMIN**: Acceso completo incluyendo configuración del sistema

### Credenciales Demo
- **Email**: `trader@demo.com`
- **Contraseña**: `demo123`

## 📊 Endpoints de API

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/signin` - Iniciar sesión (NextAuth)
- `GET /api/auth/session` - Obtener sesión actual

### Trades y Journal
- `GET /api/trades` - Obtener trades del usuario
- `POST /api/trades` - Crear nuevo trade
- `PUT /api/trades/[id]` - Actualizar trade
- `GET /api/journal` - Obtener entradas de journal
- `POST /api/journal` - Crear entrada de journal

### MetaTrader 5 Integration
- `POST /api/webhooks/mt5` - Recibir trade desde MT5
- `GET /api/webhooks/mt5` - Obtener trades (con API key)

**Headers requeridos**: `X-API-KEY: [user-api-key]`

## 🎨 Diseño y Tema

### Paleta de Colores
- **Fondo Principal**: `#0A192F` (Dark Navy)
- **Primario**: `#D4AF37` (Gold)
- **Éxito**: `#10B981` (Green)
- **Error**: `#EF4444` (Red)
- **Superficie**: `#12233A` (Cards, modals)

### Fuentes
- **Inter**: Interfaz y textos
- **Fira Code**: Datos numéricos y código

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Manual
```bash
npm run build
npm start
```

## 🔧 Configuración Adicional

### MetaTrader 5
Para configurar la integración con MT5:

1. Obtén tu API key desde tu perfil
2. Configura el webhook en tu EA de MT5:
   - URL: `https://your-domain.com/api/webhooks/mt5`
   - Headers: `X-API-KEY: your-api-key`
   - Payload: Datos del trade en formato JSON

### Base de Datos
La aplicación usa PostgreSQL. Para desarrollo local puedes usar:
- **Supabase** (recomendado)
- **Railway**
- **Docker**: `docker run -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:14`

## 📈 Métricas y Análisis

### Dashboard
- Tasa de éxito (Win Rate)
- Profit Factor
- PnL Total
- Ratio Riesgo-Recompensa
- Curva de capital interactiva

### Journal
- Registro emocional
- Identificación de errores
- Aprendizajes y mejoras
- Coaching con IA

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🆘 Soporte

Para soporte técnico o preguntas:
- Crea un issue en GitHub
- Contacta al equipo de desarrollo

---

**AURUM INVEST STATION** - Elevando el trading algorítmico al siguiente nivel 🚀
