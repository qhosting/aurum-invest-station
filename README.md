# AURUM INVEST STATION

A professional multi-tenant trading dashboard with AI coaching integration, performance analytics, and automated trade logging.

![AURUM Invest Station](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.18-2D3748)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)

## 🚀 Features

### Core Functionality
- **Professional Trading Dashboard** - Real-time trading metrics and performance analysis
- **Automated Trade Journal** - Manual and automatic trade logging with AI coaching
- **MT5 Integration** - Secure webhook for MetaTrader 5 automation
- **Performance Analytics** - Interactive charts with Recharts, PnL metrics, and risk-reward ratios
- **Multi-Tenant Architecture** - Supports multiple traders with role-based access control

### Technical Features
- **NextAuth.js v5** - Advanced authentication with JWT and role-based access
- **Shadcn/UI Components** - Professional, customizable UI components
- **Dark Theme** - Hedge fund aesthetic with AURUM gold color palette
- **TypeScript** - Full type safety throughout the application
- **Zod Validation** - Robust data validation and error handling
- **Docker Ready** - Optimized for EasyPanel deployment

### AI Integration
- **Chatwoot Integration** - AI coaching and emotional analysis
- **Performance Insights** - Automated trade analysis and recommendations
- **Risk Management** - AI-powered risk assessment and alerts

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (Strict Mode)
- **UI Framework**: Shadcn/UI + Radix Primitives
- **Styling**: Tailwind CSS with custom AURUM theme
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

### Backend
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5 (Credentials Provider)
- **Validation**: Zod schemas
- **API**: Next.js API Routes + Server Actions

### DevOps
- **Containerization**: Docker (Multi-stage builds)
- **Deployment**: EasyPanel ready
- **Health Checks**: Built-in monitoring endpoints

## 📦 Installation

### Prerequisites
- Node.js 18.19.0 or higher
- PostgreSQL 14+
- npm or yarn

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/qhosting/aurum-invest-station.git
   cd aurum-invest-station
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to access the application.

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

1. **Clone and configure**
   ```bash
   git clone https://github.com/qhosting/aurum-invest-station.git
   cd aurum-invest-station
   cp .env.example .env
   ```

2. **Start services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Application: http://localhost:3000
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379

### EasyPanel Deployment

1. **Build the Docker image**
   ```bash
   docker build -t aurum-invest-station .
   ```

2. **Deploy to EasyPanel**
   - Upload the built image
   - Set environment variables
   - Configure domain and SSL
   - Set up PostgreSQL database

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXTAUTH_SECRET` | NextAuth secret key | Yes |
| `NEXTAUTH_URL` | Application URL | Yes |
| `NEXT_PUBLIC_CHATWOOT_TOKEN` | Chatwoot website token | No |
| `NEXT_PUBLIC_CHATWOOT_BASE_URL` | Chatwoot base URL | No |

### Database Schema

The application uses three main models:

- **User**: Authentication and user management
- **Trade**: Individual trade records
- **JournalMetric**: Daily performance snapshots

## 🔐 Authentication

The application supports role-based authentication:

- **TRADER**: Standard trader access
- **ADMIN**: Administrative privileges

### Demo Credentials
```
Email: trader@demo.com
Password: demo123
```

## 📊 Trading Features

### Dashboard Metrics
- Total Balance
- Win Rate Percentage
- Relative Drawdown
- Daily P&L

### Performance Analytics
- Equity Curve visualization
- Risk-Reward ratios
- Profit factor calculations
- Maximum drawdown analysis

### Trade Management
- Manual trade entry
- Automated MT5 integration
- Screenshot attachments
- Setup categorization

## 🤖 MT5 Integration

### Webhook Setup

1. **Generate API Key**
   - API keys are automatically generated for new users
   - Available in user profile

2. **Configure MT5 Robot**
   ```javascript
   const webhookUrl = "https://your-domain.com/api/webhooks/mt5";
   const apiKey = "user-api-key";
   
   // Example webhook payload
   {
     "symbol": "EURUSD",
     "action": "OPEN",
     "price": 1.0845,
     "sl": 1.0800,
     "tp": 1.0900,
     "lotSize": 0.1,
     "type": "BUY"
   }
   ```

## 🎨 Theming

### Color Palette
- **Background**: `#0A192F` (Deep Navy)
- **Surface**: `#12233A` (Cards, modals)
- **Primary**: `#D4AF37` (Aurum Gold)
- **Success**: `#10B981` (Green)
- **Error**: `#EF4444` (Red)

### Theme Features
- Dark mode optimized
- Professional hedge fund aesthetic
- Responsive design
- Accessibility compliant

## 🔍 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/session` - Get current session

### Trading Endpoints
- `GET /api/trades` - Get user trades
- `POST /api/trades` - Create new trade
- `PUT /api/trades/[id]` - Update trade

### MT5 Webhook
- `POST /api/webhooks/mt5` - Receive automated trades
- `GET /api/webhooks/mt5` - Get trades (with API key)

## 🚀 Performance

### Optimizations
- Standalone build output
- Optimized server components
- Dependency caching
- Image optimization
- Code splitting

### Monitoring
- Health check endpoints
- Error tracking
- Performance metrics
- Database query optimization

## 🔒 Security

### Features
- CSRF protection
- XSS prevention
- SQL injection protection
- Rate limiting
- Secure headers
- Environment variable protection

## 📈 Development

### Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
```

### Project Structure
```
src/
├── app/              # Next.js App Router
│   ├── app/         # Dashboard pages
│   ├── auth/        # Authentication pages
│   ├── api/         # API routes
│   └── globals.css  # Global styles
├── components/      # React components
│   ├── ui/         # Shadcn UI components
│   ├── dashboard/  # Dashboard-specific components
│   └── providers/  # Context providers
├── lib/            # Utility libraries
│   ├── auth.ts     # NextAuth configuration
│   ├── prisma.ts   # Prisma client
│   ├── utils.ts    # Helper functions
│   └── validations.ts # Zod schemas
└── types/          # TypeScript definitions
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review existing issues
- Create a new issue with detailed information

## 🎯 Roadmap

- [ ] Mobile responsive design
- [ ] Advanced charting tools
- [ ] Social trading features
- [ ] Mobile app development
- [ ] Advanced AI coaching
- [ ] Multi-language support
- [ ] API rate limiting
- [ ] Advanced analytics dashboard

---

**Built with ❤️ by MiniMax Agent**

*AURUM INVEST STATION - Professional Trading Made Simple*