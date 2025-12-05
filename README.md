# AURUM INVEST STATION

Plataforma profesional de trading algorítmico con análisis en tiempo real, journal de trading y coaching de IA.

## 🚀 Características Principales

- **Dashboard Profesional**: Métricas de trading, curva de capital y análisis de rendimiento
- **Journal de Trading**: Registro de trades con IA coaching y análisis emocional
- **Automatización MT5**: Integración con MetaTrader 5 via webhooks seguros
- **Autenticación Avanzada**: NextAuth.js con roles (Trader, Super Admin)
- **Análisis de Datos**: Charts interactivos con Recharts y métricas avanzadas
- **Tema Oscuro**: Interfaz optimizada para traders profesionales

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14+** con App Router
- **TypeScript** (strict mode)
- **Tailwind CSS** para styling
- **Shadcn/UI** + Radix UI components
- **Recharts** para visualización de datos
- **NextAuth.js** para autenticación

### Backend
- **PostgreSQL** como base de datos
- **Prisma ORM** para manejo de datos
- **Zod** para validación de datos
- **bcrypt** para encriptación de contraseñas

### Integración
- **API Webhooks** para MetaTrader 5
- **JWT** para sesiones
- **RBAC** (Role-Based Access Control)

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
Crea un archivo `.env.local` con las siguientes variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/aurum_invest_station"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-in-production"

# AI Configuration
OPENAI_API_KEY="your-openai-api-key"
CHATWOOT_TOKEN="your-chatwoot-token"
CHATWOOT_URL="https://your-domain.chatwoot.com"

# Automation
N8N_WEBHOOK_URL="http://localhost:5678/webhook"
MT5_CONNECTOR_URL="http://localhost:8080"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
```

### 4. Configurar la Base de Datos
```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma db push

# (Opcional) Poblar con datos de prueba
npx prisma db seed
```

### 5. Iniciar Servidor de Desarrollo
```bash
npm run dev
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
