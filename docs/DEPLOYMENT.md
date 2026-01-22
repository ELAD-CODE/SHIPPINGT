# Deployment Guide - Shipment Tracking Israel

Complete guide for deploying the application to AWS and other cloud providers.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [AWS Deployment Options](#aws-deployment-options)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [CI/CD Deployment](#cicd-deployment)
6. [Manual Deployment](#manual-deployment)
7. [Database Migrations](#database-migrations)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools

```bash
# Node.js 18 or higher
node --version  # Should be 18.x or higher

# AWS CLI
aws --version

# Prisma CLI (for database migrations)
npx prisma --version

# Git
git --version
```

### Required Access

- AWS account with appropriate permissions
- Database instance (PostgreSQL)
- TrackingMore API account
- GitHub repository access (for CI/CD)

---

## AWS Deployment Options

### Option 1: AWS Elastic Beanstalk (Recommended for beginners)

**Pros:**
- Managed infrastructure
- Auto-scaling
- Easy to set up
- Built-in monitoring

**Setup:**

```bash
# Install EB CLI
pip install awsebcli

# Initialize Elastic Beanstalk
eb init shipment-tracking --platform node.js --region us-east-1

# Create environment
eb create staging --instance-type t3.micro

# Set environment variables
eb setenv \
  DATABASE_URL="postgresql://..." \
  TRACKINGMORE_API_KEY="..." \
  SESSION_SECRET="..." \
  NODE_ENV="production"

# Deploy
eb deploy

# Open application
eb open
```

### Option 2: AWS ECS (Elastic Container Service)

**Pros:**
- Docker-based
- Highly scalable
- Better for microservices

**Setup:**

```bash
# Build Docker image
docker build -t shipment-tracking:latest .

# Tag for ECR
docker tag shipment-tracking:latest \
  123456789.dkr.ecr.us-east-1.amazonaws.com/shipment-tracking:latest

# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  123456789.dkr.ecr.us-east-1.amazonaws.com

# Push to ECR
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/shipment-tracking:latest

# Create ECS task definition and service
aws ecs create-service \
  --cluster shipment-tracking \
  --service-name shipment-tracking-service \
  --task-definition shipment-tracking:1 \
  --desired-count 2
```

### Option 3: AWS S3 + CloudFront (Static Export)

**Pros:**
- Lowest cost
- Very fast (CDN)
- Highly available

**Note:** Only works if your app can be statically exported.

```bash
# Add to next.config.js: output: 'export'

# Build and export
npm run build

# Deploy to S3
aws s3 sync out/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

---

## Database Setup

### Using AWS RDS (Managed PostgreSQL)

1. **Create RDS Instance:**

```bash
aws rds create-db-instance \
  --db-instance-identifier shipment-tracking-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password YOUR_SECURE_PASSWORD \
  --allocated-storage 20 \
  --backup-retention-period 7 \
  --storage-encrypted
```

2. **Get Connection String:**

```bash
# Format: postgresql://username:password@host:5432/database
DATABASE_URL="postgresql://postgres:PASSWORD@shipment-tracking-db.xxxx.us-east-1.rds.amazonaws.com:5432/shipment_tracking"
```

3. **Configure Security Group:**
- Allow inbound PostgreSQL (port 5432) from your application
- Restrict access to specific IP ranges or security groups

### Using Supabase (Alternative)

1. Create project at https://supabase.com
2. Get connection string from project settings
3. Enable row-level security (RLS) if needed

---

## Environment Configuration

### Production Environment Variables

Create a secure `.env.production` (NOT committed to git):

```bash
# Application
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_SITE_URL=https://shipmenttracking.net
NEXT_PUBLIC_APP_ENV=production

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db

# APIs
TRACKINGMORE_API_KEY=your_production_key
MAMAN_USERNAME=your_maman_username
MAMAN_PASSWORD=your_maman_password

# Security
SESSION_SECRET=GENERATE_STRONG_SECRET_32_CHARS_MIN
ALLOWED_ORIGINS=https://shipmenttracking.net,https://www.shipmenttracking.net

# AWS
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=us-east-1

# Monitoring
SENTRY_DSN=https://...@sentry.io/...
SENTRY_ENVIRONMENT=production
LOG_LEVEL=info
```

---

## CI/CD Deployment

### GitHub Actions Automatic Deployment

The repository includes `.github/workflows/ci-cd.yml` that automatically deploys on push to `staging` branch.

**Setup:**

1. **Add GitHub Secrets** (see `.github/README-actions.md`):
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `DATABASE_URL`
   - `SESSION_SECRET`
   - `TRACKINGMORE_API_KEY`

2. **Push to staging:**
   ```bash
   git checkout staging
   git merge main
   git push origin staging
   ```

3. **Monitor deployment:**
   - Go to GitHub Actions tab
   - Watch deployment progress
   - Check logs if deployment fails

---

## Manual Deployment

### Step-by-Step Manual Deploy

```bash
# 1. Clone repository
git clone https://github.com/OWNER/REPO.git
cd REPO

# 2. Install dependencies
npm ci

# 3. Set environment variables
export DATABASE_URL="..."
export TRACKINGMORE_API_KEY="..."
export SESSION_SECRET="..."

# 4. Run database migrations
npx prisma migrate deploy

# 5. Build application
npm run build

# 6. Start production server
npm start

# Or use PM2 for process management
npm install -g pm2
pm2 start npm --name "shipment-tracking" -- start
pm2 save
pm2 startup
```

---

## Database Migrations

### Before Running Migrations - CRITICAL

**⚠️ ALWAYS backup your database before running migrations in production!**

### Backup Database (REQUIRED)

#### RDS Backup
```bash
# Create manual snapshot
aws rds create-db-snapshot \
  --db-instance-identifier shipment-tracking-db \
  --db-snapshot-identifier manual-backup-$(date +%Y%m%d-%H%M%S)

# Verify snapshot completed
aws rds describe-db-snapshots \
  --db-snapshot-identifier manual-backup-...
```

#### Manual pg_dump Backup
```bash
# Backup entire database
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d-%H%M%S).sql

# Or backup to S3
pg_dump $DATABASE_URL | gzip | \
  aws s3 cp - s3://backups/shipment-tracking-$(date +%Y%m%d).sql.gz
```

### Restore from Backup (if needed)

```bash
# From RDS snapshot
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier shipment-tracking-db-restored \
  --db-snapshot-identifier manual-backup-...

# From pg_dump
psql $DATABASE_URL < backup-20260122.sql
```

### Running Migrations

```bash
# 1. BACKUP FIRST (see above)

# 2. Preview migration (dry run)
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datasource $DATABASE_URL

# 3. Run migration
npx prisma migrate deploy

# 4. Verify migration succeeded
npx prisma db push --preview-feature

# 5. Generate Prisma Client
npx prisma generate
```

### Rolling Back Migrations

If migration fails:

```bash
# Option 1: Restore from backup
psql $DATABASE_URL < backup-before-migration.sql

# Option 2: Restore RDS snapshot
aws rds restore-db-instance-from-db-snapshot ...
```

---

## Monitoring & Maintenance

### Health Checks

Create `/api/health` endpoint to monitor application health.

### Regular Maintenance Tasks

**Weekly:**
- Review error logs
- Check database size and performance
- Review API usage (TrackingMore)
- Update dependencies (`npm update`)

**Monthly:**
- Rotate secrets/credentials
- Review AWS costs
- Database vacuum/optimize
- Review and archive old data

**Quarterly:**
- Security audit
- Load testing
- Disaster recovery drill
- Update documentation

---

## Troubleshooting

### Application Won't Start

```bash
# Check environment variables
node -e "console.log(process.env.DATABASE_URL ? 'DB configured' : 'Missing DB URL')"

# Check database connectivity
npx prisma db push --preview-feature

# Check logs
pm2 logs shipment-tracking
```

### Database Connection Issues

```bash
# Test connection
psql $DATABASE_URL -c "SELECT version();"

# Check database is running
aws rds describe-db-instances --db-instance-identifier shipment-tracking-db
```

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

---

## Security Checklist

Before deploying to production:

- [ ] All secrets in environment variables (not hardcoded)
- [ ] Database backups configured and tested
- [ ] HTTPS enabled (SSL certificate)
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Security headers configured
- [ ] Dependency vulnerabilities checked (`npm audit`)
- [ ] Gitleaks scan passed
- [ ] Database connection encrypted
- [ ] Monitoring and alerts configured

---

**Last Updated:** January 2026
