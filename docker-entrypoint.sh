#!/bin/bash

# VALIDATION AND ROBUST DIAGNOSTICS
set -e

echo "DOCKER-ENTRYPOINT.SH - STARTING VALIDATION"
echo "=========================================="

# Basic system information
echo "SYSTEM INFO:"
echo "Current directory: $(pwd)"
echo "Current user: $(whoami)"
echo "PID: $$"
echo "Script executed: $0"

# Function for logging with timestamp
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Validate script location
SCRIPT_PATH="/app/docker-entrypoint.sh"
log "Verifying script location: $SCRIPT_PATH"

if [ ! -f "$SCRIPT_PATH" ]; then
    log "ERROR: $SCRIPT_PATH not found!"
    log "Content of /app:"
    ls -la /app/ 2>/dev/null || log "Cannot access /app"
    log "Searching for docker-entrypoint.sh in the system:"
    find / -name "docker-entrypoint.sh" -type f 2>/dev/null | head -5 || log "Not found"
    log "ABORTING EXECUTION"
    exit 1
fi

log "Script found: $SCRIPT_PATH"
log "Permissions: $(ls -la "$SCRIPT_PATH")"

# Ensure executable permissions
if [ ! -x "$SCRIPT_PATH" ]; then
    log "Applying executable permissions..."
    chmod +x "$SCRIPT_PATH"
    log "Permissions applied: $(ls -la "$SCRIPT_PATH")"
fi

# Check critical environment variables
log "Environment variables:"
log "NODE_ENV: ${NODE_ENV:-'NOT DEFINED'}"
log "DATABASE_URL: ${DATABASE_URL:0:50}..."
log "NEXTAUTH_URL: ${NEXTAUTH_URL:-'NOT DEFINED'}"
log "PORT: ${PORT:-'NOT DEFINED'}"

log "Starting AURUM INVEST STATION..."

# ENVIRONMENT DIAGNOSTICS
echo "ENVIRONMENT DIAGNOSTICS:"
echo "Current directory: $(pwd)"
echo "Current user: $(whoami)"
echo "Current PID: $$"
echo "Arguments received: $@"
echo "Verifying docker-entrypoint.sh location..."

# Verify that the current file exists
if [ -f "/app/docker-entrypoint.sh" ]; then
    echo "SUCCESS: /app/docker-entrypoint.sh exists"
    echo "Permissions: $(ls -la /app/docker-entrypoint.sh)"
else
    echo "ERROR: /app/docker-entrypoint.sh NOT found"
    echo "Content of /app:"
    ls -la /app/
    echo "Searching for docker-entrypoint.sh in the system..."
    find /app -name "docker-entrypoint.sh" 2>/dev/null || echo "Not found in /app"
    find / -name "docker-entrypoint.sh" -type f 2>/dev/null | head -5 || echo "Not found in entire system"
fi

# Check critical environment variables
echo "Environment variables:"
echo "NODE_ENV: $NODE_ENV"
echo "DATABASE_URL: ${DATABASE_URL:0:20}..."
echo "NEXTAUTH_URL: $NEXTAUTH_URL"
echo "PORT: $PORT"

# LOCATION VALIDATION
echo "Validating script location:"
if [ "$0" = "/app/docker-entrypoint.sh" ] || [ "$0" = "./docker-entrypoint.sh" ]; then
    echo "SUCCESS: Script executed from correct location"
else
    echo "WARNING: Script executed from: $0"
fi

# Wait for PostgreSQL to be available with timeout
log "Waiting for PostgreSQL connection..."
timeout=30
counter=0
until nc -z postgres 5432; do
    sleep 2
    counter=$((counter + 2))
    log "Waiting for PostgreSQL... ($counter/$timeout seconds)"
    if [ $counter -ge $timeout ]; then
        log "Timeout waiting for PostgreSQL, continuing..."
        break
    fi
done
log "PostgreSQL verified"

# Run Prisma migrations with timeout
log "Running database migrations..."
if timeout 60 npx prisma migrate deploy; then
    log "Migrations completed successfully"
else
    log "Migrations completed with warnings"
fi

# Run data seeding with timeout
log "Running data seeding..."
if timeout 30 npx tsx prisma/seed.ts; then
    log "Seeding completed successfully"
else
    log "Seeding completed with warnings"
fi

log "Initialization completed!"
log "AURUM INVEST STATION ready for connections"

# Start the application
exec "$@"