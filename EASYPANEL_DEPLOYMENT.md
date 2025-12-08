# EasyPanel Deployment Guide for AURUM INVEST STATION

This guide will walk you through deploying AURUM INVEST STATION on EasyPanel with Docker.

## Prerequisites

- EasyPanel server with Docker support
- Domain name configured
- SSL certificate ready
- PostgreSQL database access

## Step 1: Prepare the Environment

### 1.1 Create Environment File
Create a `.env` file with your production settings:

```bash
# Database
DATABASE_URL="postgresql://username:password@your-db-host:5432/aurum_invest_station?schema=public"

# NextAuth.js
NEXTAUTH_SECRET="your-secure-random-secret-key"
NEXTAUTH_URL="https://your-domain.com"

# Chatwoot Integration
NEXT_PUBLIC_CHATWOOT_TOKEN="your-chatwoot-token"
NEXT_PUBLIC_CHATWOOT_BASE_URL="https://chat.your-domain.com"

# Application Settings
NODE_ENV="production"
PORT=3000
```

### 1.2 Generate Secure Secrets
```bash
# Generate NextAuth secret
openssl rand -base64 32

# Generate additional secrets as needed
```

## Step 2: Build Docker Image

### 2.1 Build the Image
```bash
# Build the production image
docker build -t aurum-invest-station:latest .

# Verify the image was created
docker images | grep aurum-invest-station
```

### 2.2 Test the Image Locally (Optional)
```bash
# Run locally to verify everything works
docker run -d \
  --name aurum-test \
  -p 3000:3000 \
  --env-file .env \
  aurum-invest-station:latest

# Check logs
docker logs aurum-test

# Stop test container
docker stop aurum-test && docker rm aurum-test
```

## Step 3: Deploy to EasyPanel

### 3.1 Upload Docker Image

#### Option A: Direct Upload
1. Save the image to a tar file:
   ```bash
   docker save aurum-invest-station:latest > aurum-invest-station.tar
   ```

2. Upload the tar file through EasyPanel interface

#### Option B: Registry Upload
1. Push to a container registry:
   ```bash
   # Tag for your registry
   docker tag aurum-invest-station:latest your-registry/aurum-invest-station:latest
   
   # Push to registry
   docker push your-registry/aurum-invest-station:latest
   ```

### 3.2 Create Project in EasyPanel

1. **Create New Project**
   - Project Name: `aurum-invest-station`
   - Type: `Docker`
   - Description: `Professional Trading Dashboard`

2. **Configure Container**
   - **Image**: `aurum-invest-station:latest`
   - **Container Name**: `aurum-web`
   - **Restart Policy**: `Unless stopped`

3. **Environment Variables**
   Add all variables from your `.env` file:
   ```
   DATABASE_URL=postgresql://...
   NEXTAUTH_SECRET=...
   NEXTAUTH_URL=https://your-domain.com
   NEXT_PUBLIC_CHATWOOT_TOKEN=...
   NEXT_PUBLIC_CHATWOOT_BASE_URL=...
   NODE_ENV=production
   ```

4. **Port Configuration**
   - **Container Port**: `3000`
   - **Host Port**: `80` (or your preferred port)
   - **Protocol**: `TCP`

5. **Volume Mounts**
   - **Path**: `/app/uploads`
   - **Mount Point**: `/app/uploads`
   - **Type**: `Volume`

### 3.3 Configure Domain and SSL

1. **Add Domain**
   - Primary Domain: `your-domain.com`
   - SSL: Enable automatic Let's Encrypt
   - Redirect HTTP to HTTPS: Enabled

2. **SSL Certificate**
   - SSL Provider: Let's Encrypt
   - Auto-renewal: Enabled

## Step 4: Database Setup

### 4.1 Create PostgreSQL Database

#### Option A: EasyPanel Database
1. Go to Databases section in EasyPanel
2. Create new PostgreSQL database
3. Note the connection details
4. Update `DATABASE_URL` in environment variables

#### Option B: External Database
1. Use your preferred PostgreSQL provider
2. Ensure database is accessible from EasyPanel
3. Update connection string in environment variables

### 4.2 Run Database Migrations

#### Method 1: Through EasyPanel Terminal
1. Open project terminal in EasyPanel
2. Run migration commands:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

#### Method 2: One-time Setup Container
Create a temporary setup container:
```bash
docker run --rm \
  --env-file .env \
  -e DATABASE_URL="your-db-url" \
  aurum-invest-station:latest \
  sh -c "npm run db:generate && npm run db:migrate"
```

## Step 5: Health Checks and Monitoring

### 5.1 Configure Health Check
In EasyPanel project settings:
- **Health Check URL**: `http://localhost:3000/api/health`
- **Interval**: `30 seconds`
- **Timeout**: `10 seconds`
- **Retries**: `3`

### 5.2 Monitoring Setup
1. **Enable Logging**
   - Log Level: `Info`
   - Max Log Size: `100MB`
   - Log Rotation: `Daily`

2. **Resource Monitoring**
   - CPU Alert: `80%`
   - Memory Alert: `85%`
   - Disk Alert: `90%`

## Step 6: Post-Deployment Configuration

### 6.1 Verify Deployment
1. Access your domain
2. Check if the application loads
3. Test user registration/login
4. Verify database connection

### 6.2 Create Admin User
If needed, create an admin user through the application interface or database.

### 6.3 Configure Chatwoot
1. Update Chatwoot settings if using
2. Test AI coaching integration
3. Verify user identity handshake

## Step 7: Performance Optimization

### 7.1 Enable Caching
If using external Redis:
```bash
# Add Redis environment variables
REDIS_URL=redis://your-redis-host:6379
```

### 7.2 CDN Configuration
Configure CDN for static assets if needed.

### 7.3 Database Optimization
1. Ensure database indexes are created
2. Configure connection pooling
3. Set up database backups

## Step 8: Backup and Recovery

### 8.1 Database Backups
Set up automated database backups through EasyPanel or external tools.

### 8.2 File Uploads
If using file uploads, configure backup for the uploads volume.

### 8.3 Application Backup
Backup the Docker image and environment configuration.

## Troubleshooting

### Common Issues

#### 1. Container Won't Start
```bash
# Check logs in EasyPanel
# Common causes:
# - Missing environment variables
# - Database connection issues
# - Port conflicts
```

#### 2. Database Connection Failed
- Verify `DATABASE_URL` format
- Check database server accessibility
- Ensure database exists and user has permissions

#### 3. SSL Certificate Issues
- Verify domain DNS settings
- Check Let's Encrypt logs
- Ensure port 80 is accessible for ACME challenge

#### 4. High Memory Usage
- Monitor application logs
- Check for memory leaks
- Consider increasing container memory limits

### Debug Commands

```bash
# Access container shell
docker exec -it aurum-web /bin/sh

# Check application logs
docker logs aurum-web

# Test database connection
docker exec aurum-web node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.\$queryRaw\`SELECT 1\`.then(() => {
  console.log('Database connected');
  process.exit(0);
}).catch(err => {
  console.error('Database error:', err);
  process.exit(1);
});
"
```

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files to version control
- Use secure secrets for production
- Rotate secrets regularly

### 2. Database Security
- Use strong passwords
- Limit database user permissions
- Enable SSL for database connections

### 3. Network Security
- Configure firewall rules
- Use HTTPS only
- Implement rate limiting

### 4. Container Security
- Keep base images updated
- Run containers as non-root user
- Use minimal base images

## Maintenance

### Regular Tasks
1. **Weekly**: Check application logs and performance
2. **Monthly**: Update dependencies and security patches
3. **Quarterly**: Review and rotate secrets
4. **Annually**: Full security audit and backup testing

### Updates
1. Build new Docker image with updates
2. Test in staging environment
3. Deploy to production during low-traffic hours
4. Monitor for issues post-deployment

## Support

For EasyPanel-specific issues:
- Check EasyPanel documentation
- Review EasyPanel community forums
- Contact EasyPanel support

For application-specific issues:
- Check application logs
- Review this documentation
- Create GitHub issue with detailed information

---

**Deployment Complete!** 🎉

Your AURUM INVEST STATION should now be running on EasyPanel with full functionality including trading dashboard, MT5 integration, and AI coaching features.