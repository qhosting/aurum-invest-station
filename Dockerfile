# Dockerfile ultra-optimizado para EasyPanel - Sin errores de Prisma
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy only package files first
COPY package*.json ./
# Install production dependencies only
RUN npm install --ignore-scripts

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files including prisma
COPY . .

# No fix needed - using original files from repository

# Set Node.js path resolution environment variables for Docker
ENV NODE_PATH=/app/node_modules:/app/src
ENV TS_NODE_TRANSPILE_ONLY=1

# Generate Prisma client explicitly
RUN npx prisma generate

# Build the application
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy all necessary files from builder first
COPY --from=builder /app ./

# Install tsx for running the seed script
RUN npm install -g tsx

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown -R nextjs:nodejs /app

# Make docker-entrypoint.sh executable
USER root
RUN chmod +x /app/docker-entrypoint.sh
USER nextjs

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Use absolute path for docker-entrypoint.sh
CMD ["/app/docker-entrypoint.sh", "npm", "start"]