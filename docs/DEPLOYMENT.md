# Deployment Guide

This document describes the deployment process for Shipment Tracking Israel application to AWS infrastructure.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Deployment Architecture](#deployment-architecture)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Database Migration](#database-migration)
- [Deployment Steps](#deployment-steps)
- [Post-Deployment Verification](#post-deployment-verification)
- [Rollback Procedure](#rollback-procedure)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Access
- AWS account with appropriate IAM permissions
- GitHub repository access with Actions enabled
- Database admin credentials
- SSH access to application servers (if applicable)

### Required Tools
```bash
# Install AWS CLI
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Verify installation
aws --version

# Configure AWS credentials
aws configure
```

### Required Environment Variables
Ensure all secrets are configured in GitHub as per [README-actions.md](../.github/README-actions.md)

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CloudFront CDN (Optional)                │
│                    (Edge caching & SSL)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  Application Load Balancer                   │
│              (Health checks & SSL termination)               │
└────────┬────────────────────────────────┬───────────────────┘
         │                                │
         ▼                                ▼
┌──────────────────┐           ┌──────────────────┐
│   EC2/ECS/Fargate│           │   EC2/ECS/Fargate│
│   (Next.js App)  │           │   (Next.js App)  │
└────────┬─────────┘           └────────┬─────────┘
         │                                │
         └────────────────┬───────────────┘
                          │
                          ▼
         ┌────────────────────────────────┐
         │    RDS PostgreSQL Database      │
         │    (Primary + Read Replica)     │
         └────────────────────────────────┘
                          │
                          ▼
         ┌────────────────────────────────┐
         │      S3 Bucket Storage          │
         │  (Documents & Build Artifacts)  │
         └────────────────────────────────┘
```

## Pre-Deployment Checklist

### 1. Code Quality Verification

```bash
# Run locally before pushing
npm run lint
npm test
npm run build
```

All checks must pass before deployment.

### 2. Environment Configuration

- [ ] All required GitHub Secrets configured
- [ ] Database connection string updated
- [ ] API keys rotated if needed
- [ ] SSL certificates valid
- [ ] DNS records updated

### 3. Database Backup (CRITICAL)

**ALWAYS backup database before deployment!**

See [Database Backup](#database-backup) section below.

### 4. Communication

- [ ] Notify team of deployment window
- [ ] Post maintenance notice (if applicable)
- [ ] Prepare rollback plan

## Database Migration

### Database Backup

**Before ANY database migration or deployment:**

```bash
# 1. Connect to database server
ssh user@db-server

# 2. Create backup directory
mkdir -p ~/backups/$(date +%Y%m%d)
cd ~/backups/$(date +%Y%m%d)

# 3. Perform PostgreSQL dump
pg_dump -h localhost -U postgres -d shipment_tracking \
  -F c -b -v -f "shipment_tracking_$(date +%Y%m%d_%H%M%S).backup"

# 4. Verify backup file
ls -lh *.backup

# 5. Optional: Copy to S3 for redundancy
aws s3 cp shipment_tracking_*.backup \
  s3://your-backup-bucket/database-backups/

# 6. Test restore (RECOMMENDED)
# Create test database
createdb shipment_tracking_test

# Restore backup
pg_restore -h localhost -U postgres -d shipment_tracking_test \
  shipment_tracking_*.backup

# Verify data
psql -h localhost -U postgres -d shipment_tracking_test \
  -c "SELECT COUNT(*) FROM \"TrackingSearch\";"

# Drop test database
dropdb shipment_tracking_test
```

### Running Migrations

```bash
# 1. Review pending migrations
npx prisma migrate status

# 2. Generate Prisma client
npx prisma generate

# 3. Run migrations (STAGING FIRST)
npx prisma migrate deploy

# 4. Verify migration success
npx prisma migrate status

# 5. Check application health
curl https://staging.yourapp.com/api/health
```

### Migration Rollback

If migration fails:

```bash
# 1. Restore from backup
pg_restore -h localhost -U postgres -d shipment_tracking \
  --clean --if-exists \
  /path/to/backup.backup

# 2. Verify restoration
psql -h localhost -U postgres -d shipment_tracking \
  -c "SELECT version, applied_at FROM _prisma_migrations ORDER BY applied_at DESC LIMIT 5;"

# 3. Restart application
# (Method depends on hosting: systemctl, docker, etc.)
```

## Deployment Steps

### Automated Deployment (Recommended)

Deployment happens automatically via GitHub Actions when pushing to `staging` branch:

```bash
# 1. Ensure you're on the right branch
git checkout staging

# 2. Merge your changes
git merge feature/your-feature

# 3. Push to trigger deployment
git push origin staging

# 4. Monitor deployment
# Go to: https://github.com/ELAD-CODE/SHIPPINGT/actions
```

### Manual Deployment (Emergency Only)

If CI/CD is unavailable:

```bash
# 1. Build application
npm run build

# 2. Upload to S3
aws s3 sync .next s3://your-bucket/builds/manual-$(date +%Y%m%d-%H%M%S)/ \
  --delete --exclude ".git/*"

# 3. Invalidate CloudFront (if applicable)
aws cloudfront create-invalidation \
  --distribution-id YOUR_DIST_ID \
  --paths "/*"

# 4. SSH to servers and pull new build
ssh user@app-server1 << 'EOF'
cd /var/www/app
git pull origin staging
npm ci --production
npm run build
pm2 restart all
EOF
```

## Post-Deployment Verification

### 1. Health Checks

```bash
# API health
curl https://yourapp.com/api/health

# Expected response:
# {"status":"ok","timestamp":"2026-01-22T17:30:00.000Z"}

# Database connectivity
curl https://yourapp.com/api/health/database

# TrackingMore API
curl https://yourapp.com/api/health/trackingmore
```

### 2. Smoke Tests

```bash
# Test tracking search
curl -X POST https://yourapp.com/api/track \
  -H "Content-Type: application/json" \
  -d '{"tracking_number":"157-12345678"}'

# Test sea shipment (new feature)
curl -X POST https://yourapp.com/api/shipments \
  -H "Content-Type: application/json" \
  -d '{
    "tracking_number":"MAEU123456789",
    "shipment_type":"sea",
    "container_number":"MSCU1234567",
    "bl_number":"MAEU123456789"
  }'
```

### 3. Monitor Logs

```bash
# CloudWatch Logs (if on AWS)
aws logs tail /aws/lambda/shipment-tracking --follow

# Application logs
ssh user@app-server1 "tail -f /var/log/app/error.log"

# Database slow queries
psql -h db-host -U postgres -d shipment_tracking \
  -c "SELECT query, calls, total_time FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;"
```

### 4. Performance Verification

- [ ] Homepage loads < 2 seconds
- [ ] API response times < 500ms
- [ ] Database query times normal
- [ ] No error spike in logs

## Rollback Procedure

If deployment fails or introduces critical bugs:

### 1. Quick Rollback (Revert to Previous Version)

```bash
# Option A: Revert git commit
git revert HEAD
git push origin staging

# Option B: Restore previous S3 build
aws s3 ls s3://your-bucket/builds/
# Note the previous build timestamp

aws s3 sync s3://your-bucket/builds/PREVIOUS_TIMESTAMP/ .next/
# Then restart services

# Option C: GitHub Actions rerun
# Go to Actions → Select previous successful workflow → Re-run jobs
```

### 2. Database Rollback

```bash
# Restore from backup (created in pre-deployment)
pg_restore -h db-host -U postgres -d shipment_tracking \
  --clean --if-exists \
  /path/to/backup-before-deployment.backup

# Verify restoration
psql -h db-host -U postgres -d shipment_tracking \
  -c "SELECT COUNT(*) FROM \"TrackingSearch\";"
```

### 3. Verify Rollback

- [ ] Application responding
- [ ] Database queries working
- [ ] No data loss
- [ ] Users can access the site

### 4. Post-Rollback

- [ ] Document what went wrong
- [ ] Create incident report
- [ ] Fix issues in feature branch
- [ ] Re-test before next deployment

## Troubleshooting

### Build Fails

```bash
# Check Node version
node --version
# Should be 18+

# Clear cache
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Database Connection Issues

```bash
# Test connection
psql -h db-host -U postgres -d shipment_tracking -c "SELECT 1;"

# Check connection limits
psql -h db-host -U postgres -d shipment_tracking \
  -c "SELECT count(*) FROM pg_stat_activity;"

# Check DATABASE_URL format
echo $DATABASE_URL
# Should be: postgresql://user:pass@host:5432/db
```

### API Integration Failures

```bash
# Test TrackingMore API
curl -X GET "https://api.trackingmore.com/v4/carriers" \
  -H "Tracking-Api-Key: YOUR_KEY"

# Test Maman API
curl -X POST "https://mamanonline.wsfreeze.co.il/api/v1/Account/authenticate" \
  -H "Content-Type: application/json" \
  -d '{"userName":"YOUR_USER","password":"YOUR_PASS"}'
```

### Performance Issues

```bash
# Check database performance
psql -h db-host -U postgres -d shipment_tracking << 'EOF'
SELECT 
  schemaname,
  tablename,
  n_live_tup as rows,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC
LIMIT 10;
EOF

# Check slow queries
# Enable pg_stat_statements extension first
psql -h db-host -U postgres -d shipment_tracking \
  -c "CREATE EXTENSION IF NOT EXISTS pg_stat_statements;"
```

## Emergency Contacts

- **On-call DevOps:** +972-52-842-0009
- **Database Admin:** Contact via GitHub issues
- **AWS Support:** https://console.aws.amazon.com/support/
- **GitHub Support:** https://support.github.com/

## Deployment Schedule

- **Staging:** Any time (automatic on push)
- **Production:** Tuesday/Thursday, 10:00-12:00 IST
- **Hotfixes:** As needed, with manager approval

---

**Last updated:** 2026-01-22
**Next review:** 2026-04-22
