# Deployment Guide

This guide covers deployment options and procedures for the Shipment Tracking Israel application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Deployment Options](#deployment-options)
- [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
- [AWS Deployment](#aws-deployment)
- [Docker Deployment](#docker-deployment)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Post-Deployment](#post-deployment)

## Prerequisites

Before deploying, ensure you have:

- ✅ Node.js 18+ installed (for local builds)
- ✅ PostgreSQL database (or Supabase/Neon/Railway)
- ✅ TrackingMore API account
- ✅ All environment variables configured
- ✅ Production build tested locally

## Deployment Options

### 1. Vercel (Recommended for Next.js)

**Pros:**
- Zero-config Next.js deployment
- Automatic HTTPS and CDN
- Edge functions support
- Free tier available

**Cons:**
- Vendor lock-in
- Limited control over infrastructure

### 2. AWS (EC2 + S3 + CloudFront)

**Pros:**
- Full infrastructure control
- Scalable and reliable
- Integration with AWS services

**Cons:**
- More complex setup
- Higher operational overhead
- Costs can accumulate

### 3. Docker (Self-hosted)

**Pros:**
- Run anywhere (VPS, on-premises)
- Full control
- Reproducible environment

**Cons:**
- Requires DevOps knowledge
- Manual scaling
- Infrastructure management

## Vercel Deployment (Recommended)

### Quick Start

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Via GitHub Integration

1. Go to [vercel.com](https://vercel.com)
2. Click **New Project**
3. Import your GitHub repository
4. Configure environment variables (see below)
5. Click **Deploy**

### Configure Environment Variables on Vercel

Go to **Project Settings → Environment Variables** and add:

```
DATABASE_URL=postgresql://...
TRACKINGMORE_API_KEY=your_key
SESSION_SECRET=your_secret_min_32_chars
MAMAN_USERNAME=optional
MAMAN_PASSWORD=optional
```

### Custom Domain

1. Go to **Project Settings → Domains**
2. Add your domain (e.g., `tracking.example.com`)
3. Update DNS records as instructed
4. Wait for SSL certificate (automatic)

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `TRACKINGMORE_API_KEY` | TrackingMore API key | `tm_xxxxxxxxx` |
| `SESSION_SECRET` | Session encryption secret | Generated with `openssl rand -base64 32` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `3000` |
| `MAMAN_USERNAME` | Maman API username | - |
| `MAMAN_PASSWORD` | Maman API password | - |
| `AWS_ACCESS_KEY_ID` | AWS access key | - |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | - |
| `AWS_REGION` | AWS region | `us-east-1` |
| `S3_BUCKET` | S3 bucket for uploads | - |

## Database Setup

### Run Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (if needed)
npx prisma db seed
```

## Security Checklist

Before going live:

- [ ] All secrets in environment variables (not code)
- [ ] HTTPS enabled
- [ ] Database has strong password
- [ ] Firewall configured (only required ports open)
- [ ] Rate limiting enabled
- [ ] CORS configured properly
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive data
- [ ] Gitleaks scan passing
- [ ] Dependencies updated (no known vulnerabilities)

---

**Last Updated:** 2026-01-22
