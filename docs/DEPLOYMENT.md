# Deployment Guide

This guide covers deploying the Shipment Tracking Israel application to AWS infrastructure.

## 📋 Overview

The application can be deployed using several AWS services:
- **S3 + CloudFront**: Static hosting with CDN (recommended for Next.js)
- **Elastic Beanstalk**: Platform-as-a-Service (PaaS)
- **ECS (Elastic Container Service)**: Container-based deployment
- **Lambda@Edge**: Serverless deployment

## 🚀 Quick Start Deployment (Vercel - Easiest)

### Prerequisites
- GitHub repository connected to Vercel
- Vercel account (free tier available)

### Steps

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository

2. **Configure Environment Variables**:
   Add all variables from `.env.example`:
   - `DATABASE_URL`
   - `TRACKINGMORE_API_KEY`
   - `SESSION_SECRET`
   - `MAMAN_USERNAME`
   - `MAMAN_PASSWORD`
   - And others as needed

3. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy
   - Get your live URL (e.g., `shipment-tracking.vercel.app`)

4. **Automatic Deployments**:
   - Production: Every push to `main`
   - Preview: Every pull request

## 🗄️ Database Setup (AWS RDS)

### Create PostgreSQL Database

```bash
aws rds create-db-instance \
  --db-instance-identifier shipment-tracking-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 14.7 \
  --master-username admin \
  --master-user-password YOUR_SECURE_PASSWORD \
  --allocated-storage 20 \
  --backup-retention-period 7
```

### Run Database Migrations

```bash
# Set DATABASE_URL
export DATABASE_URL="postgresql://admin:password@endpoint:5432/shipment_tracking"

# Run migrations
npx prisma migrate deploy

# Seed database (if needed)
npx prisma db seed
```

## 🔐 Secrets Management

### Using AWS Secrets Manager

```bash
# Store API keys
aws secretsmanager create-secret \
  --name shipment-tracking/trackingmore-api-key \
  --secret-string "your_api_key_here"

aws secretsmanager create-secret \
  --name shipment-tracking/database-url \
  --secret-string "postgresql://user:pass@host:5432/db"
```

### Using Environment Variables (Recommended for Vercel)

Configure in Vercel dashboard:
1. Project Settings → Environment Variables
2. Add each variable with appropriate scope (Production/Preview/Development)

## 📊 Monitoring

### CloudWatch Alarms (AWS)

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name shipment-tracking-high-errors \
  --metric-name 5XXError \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold
```

### Vercel Analytics

- Enable in Project Settings
- View real-time metrics
- Monitor Core Web Vitals

## 🔄 Deployment Workflow

### Production Deployment

```bash
# 1. Ensure all tests pass
npm test

# 2. Create production build
npm run build

# 3. Tag release
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0

# 4. Merge to main (triggers deployment)
git checkout main
git merge develop
git push origin main
```

### Rollback

```bash
# Vercel: Use dashboard to rollback to previous deployment
# Or redeploy specific commit
vercel --prod --force
```

## 📝 Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Secrets stored securely
- [ ] Monitoring configured
- [ ] Backup created
- [ ] Team notified

For detailed AWS deployment options, see the extended version of this document in the repository.
