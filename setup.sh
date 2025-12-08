#!/bin/bash

# AURUM Invest Station - Setup Script
# Generates secure secrets and sets up the environment

set -e

echo "🚀 AURUM Invest Station - Setup Script"
echo "======================================"

# Function to generate random string
generate_secret() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-32
}

# Function to generate UUID
generate_uuid() {
    python3 -c "import uuid; print(uuid.uuid4())"
}

# Check if .env exists
if [ -f ".env" ]; then
    echo "⚠️  .env file already exists. Do you want to overwrite it? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        echo "Setup cancelled. Existing .env file preserved."
        exit 0
    fi
fi

echo ""
echo "🔧 Generating secure secrets..."

# Generate secrets
NEXTAUTH_SECRET=$(generate_secret)
ENCRYPTION_KEY=$(generate_secret)
MT5_WEBHOOK_SECRET=$(generate_secret)
API_KEY_1=$(generate_uuid)
API_KEY_2=$(generate_uuid)

echo "✅ Secrets generated successfully!"
echo ""

# Create .env file
cat > .env << EOF
# ======================================
# AURUM INVEST STATION - Environment Configuration
# Generated on: $(date)
# ======================================

# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/aurum_invest_station?schema=public"

# NextAuth.js Configuration
NEXTAUTH_SECRET="$NEXTAUTH_SECRET"
NEXTAUTH_URL="http://localhost:3000"

# Chatwoot Integration (Optional)
NEXT_PUBLIC_CHATWOOT_TOKEN=""
NEXT_PUBLIC_CHATWOOT_BASE_URL=""

# Application Settings
NODE_ENV="development"
PORT=3000

# Security
ENCRYPTION_KEY="$ENCRYPTION_KEY"
MT5_WEBHOOK_SECRET="$MT5_WEBHOOK_SECRET"

# Demo User (for testing)
DEMO_USER_EMAIL="trader@demo.com"
DEMO_USER_PASSWORD="demo123"

# API Keys (for MT5 integration)
DEMO_USER_API_KEY="$API_KEY_1"
ADMIN_USER_API_KEY="$API_KEY_2"

# Docker Settings
WEB_PORT=3000
POSTGRES_PORT=5432

# ======================================
# PRODUCTION SETTINGS (Update for production)
# ======================================
# NEXTAUTH_URL="https://your-domain.com"
# DATABASE_URL="postgresql://username:password@prod-db-host:5432/aurum_invest_station"
# NEXT_PUBLIC_CHATWOOT_TOKEN="your-production-chatwoot-token"
# NEXT_PUBLIC_CHATWOOT_BASE_URL="https://chat.your-domain.com"
EOF

echo "📝 Created .env file with secure configuration"
echo ""

# Display generated secrets
echo "🔐 Generated Secrets (save these securely):"
echo "=========================================="
echo "NextAuth Secret: $NEXTAUTH_SECRET"
echo "Encryption Key: $ENCRYPTION_KEY"
echo "MT5 Webhook Secret: $MT5_WEBHOOK_SECRET"
echo "Demo User API Key: $API_KEY_1"
echo "Admin User API Key: $API_KEY_2"
echo ""

# Check Node.js version
echo "🔍 Checking system requirements..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18.19.0 or higher."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version is too old. Please upgrade to Node.js 18.19.0 or higher."
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm $(npm -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "✅ Dependencies installed successfully!"
echo ""

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
npm run db:generate

echo "✅ Prisma client generated!"
echo ""

# Check if PostgreSQL is available
echo "🗄️  Checking database connection..."
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL client detected"
else
    echo "⚠️  PostgreSQL client not found. Make sure PostgreSQL is installed or use Docker."
fi
echo ""

# Create database schema (if PostgreSQL is available)
echo "🏗️  Creating database schema..."
read -p "Do you want to create the database schema now? (requires PostgreSQL) (y/N): " create_schema
if [[ "$create_schema" =~ ^[Yy]$ ]]; then
    if npm run db:migrate; then
        echo "✅ Database schema created successfully!"
    else
        echo "❌ Failed to create database schema. Please check your DATABASE_URL and try again."
    fi
else
    echo "⏭️  Skipping database schema creation."
    echo "   Run 'npm run db:migrate' manually when your database is ready."
fi
echo ""

# Docker setup
if command -v docker &> /dev/null; then
    echo "🐳 Docker detected!"
    read -p "Do you want to set up Docker Compose for local development? (y/N): " setup_docker
    if [[ "$setup_docker" =~ ^[Yy]$ ]]; then
        echo "🔧 Setting up Docker Compose..."
        
        # Create docker-compose.override.yml for development
        cat > docker-compose.override.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: aurum_postgres_dev
    environment:
      POSTGRES_DB: aurum_invest_station
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  web:
    build: .
    container_name: aurum_web_dev
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@postgres:5432/aurum_invest_station
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=http://localhost:3000
    depends_on:
      postgres:
        condition: service_healthy
    volumes:
      - ./src:/app/src
      - ./public:/app/public
    command: npm run dev

volumes:
  postgres_data:
EOF

        echo "✅ Docker Compose override file created!"
        echo ""
        echo "To start with Docker:"
        echo "  docker-compose up -d"
        echo "  docker-compose logs -f web"
    fi
else
    echo "⚠️  Docker not detected. Install Docker for containerized development."
fi
echo ""

# Final instructions
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "Next steps:"
echo "1. Update DATABASE_URL in .env with your PostgreSQL connection"
echo "2. Run database migrations: npm run db:migrate"
echo "3. Start the development server: npm run dev"
echo "4. Visit http://localhost:3000"
echo ""
echo "Available commands:"
echo "  npm run dev          - Start development server"
echo "  npm run build        - Build for production"
echo "  npm run start        - Start production server"
echo "  npm run db:studio    - Open Prisma Studio"
echo "  npm run docker:build - Build Docker image"
echo "  npm run docker:run   - Run Docker container"
echo ""
echo "📚 Documentation:"
echo "  README.md               - General documentation"
echo "  EASYPANEL_DEPLOYMENT.md - EasyPanel deployment guide"
echo ""
echo "🔐 Demo Credentials:"
echo "  Email: trader@demo.com"
echo "  Password: demo123"
echo ""
echo "Happy trading! 📈"

# Make the script executable
chmod +x "$0"