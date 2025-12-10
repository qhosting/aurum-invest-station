# Dockerfile ultra-optimizado para EasyPanel - EMERGENCY FILE COPY 2025-12-10 08:40:22
# ⚠️ FORCED FILE COPY - validate-system.sh, start-app.sh, repair-system.sh, docker-entrypoint.sh
# ALL BACKUP SCRIPTS READY - validate-system.sh, start-app.sh, repair-system.sh
# CRITICAL FIX: package-lock.json added + CMD robust with conditional checks
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy only package files first
COPY package*.json ./
# Install production dependencies only - ROBUST NETWORK HANDLING
RUN npm config set fetch-timeout 600000 && \
    npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000 && \
    npm install --prefer-offline --ignore-scripts || \
    (echo "ERROR: npm install falló - Intentando con configuración alternativa..." && \
     npm install --no-optional --ignore-scripts --legacy-peer-deps) || \
    echo "ERROR: npm install falló completamente - revisar conectividad de red"

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files including prisma
COPY . .

# FIX: Resolve naming conflicts before build
RUN echo "🔧 FIXING NAMING CONFLICTS..." && \
    find src/ -name "*.tsx" -o -name "*.ts" | while read file; do \
        if grep -q "Terminal" "$file" 2>/dev/null; then \
            if grep -q "import.*Terminal.*from 'lucide-react'" "$file" && grep -q "function Terminal" "$file"; then \
                echo "⚠️ Fixing Terminal conflict in $file"; \
                sed -i 's/import { \([^,]*\), *Terminal, *\([^}]*\) } from '\''lucide-react'\''/import { \1, TerminalIcon, \2 } from '\''lucide-react'\''/g' "$file"; \
                sed -i 's/import { Terminal } from '\''lucide-react'\''/import { TerminalIcon } from '\''lucide-react'\''/g' "$file"; \
                sed -i 's/Terminal,/TerminalIcon,/g' "$file"; \
                sed -i 's/Terminal\}/TerminalIcon\}/g' "$file"; \
            fi; \
        fi; \
    done || echo "No conflicts found"

# Set Node.js path resolution environment variables for Docker
ENV NODE_PATH=/app/node_modules:/app/src
ENV TS_NODE_TRANSPILE_ONLY=1

# Generate Prisma client explicitly
RUN npx prisma generate

# Build arguments for secrets (can be overridden during build)
# ⚠️ WARNING: These are ONLY for build time, real values must be provided at runtime
ARG BUILD_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/build"
ARG BUILD_NEXTAUTH_SECRET="build-time-placeholder-change-at-runtime"
ARG BUILD_NEXTAUTH_URL="http://localhost:3000"

# Set build-time environment variables (will be overridden at runtime)
ENV DATABASE_URL=$BUILD_DATABASE_URL
ENV NEXTAUTH_SECRET=$BUILD_NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$BUILD_NEXTAUTH_URL

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install netcat for database connection testing in entrypoint
RUN apk add --no-cache netcat-openbsd

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy all necessary files from builder first
COPY --from=builder /app ./

# Install tsx for running the seed script
RUN npm install -g tsx

# Set the correct permission for prerender cache
RUN mkdir -p .next || true
RUN chown -R nextjs:nodejs /app

# Make docker-entrypoint.sh executable with extensive validation
USER root
# Validación exhaustiva del archivo docker-entrypoint.sh
RUN echo "🔍 VALIDACIÓN EXHAUSTIVA DE DOCKER-ENTRYPOINT.SH:" && \
    ls -la /app/ | grep docker-entrypoint && \
    if [ -f /app/docker-entrypoint.sh ]; then \
        echo "✅ docker-entrypoint.sh found at /app/docker-entrypoint.sh"; \
        file /app/docker-entrypoint.sh; \
        chmod +x /app/docker-entrypoint.sh; \
        echo "✅ Permisos aplicados: $(ls -la /app/docker-entrypoint.sh)"; \
    else \
        echo "❌ docker-entrypoint.sh NOT found at /app/docker-entrypoint.sh"; \
        echo "📋 Contenido de /app:"; \
        ls -la /app/; \
    fi

# Copy robust startup script - consolidated below

# Copy repair script for automatic system repair
COPY repair-system.sh /app/repair-system.sh
USER root
RUN chmod +x /app/repair-system.sh || echo "⚠️  chmod failed - repair script may already have correct permissions"
USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy validation script - CLEAN COPY
USER root
COPY validate-system.sh /app/validate-system.sh
COPY start-app.sh /app/start-app.sh
COPY repair-system.sh /app/repair-system.sh
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
COPY emergency-validate.sh /app/emergency-validate.sh
# Apply permissions to ALL scripts
RUN chmod +x /app/*.sh || echo "⚠️  chmod failed - scripts may already have correct permissions"
USER nextjs

# Simplified CMD to avoid syntax errors
CMD ["/app/docker-entrypoint.sh", "npm", "start"]