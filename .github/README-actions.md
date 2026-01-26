# GitHub Actions Setup Guide

This document explains how to configure GitHub Secrets and Actions for the CI/CD pipeline.

## Overview

The CI/CD pipeline includes:
- 🔐 Secret scanning with Gitleaks
- 🏗️ Build and test automation
- 🚀 Automatic deployment to AWS (staging branch)
- ✅ Automated status checks

## Required GitHub Secrets

Navigate to your repository on GitHub:
**Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### Critical Secrets (Required for CI/CD)

| Secret Name | Description | How to Get |
|------------|-------------|------------|
| `AWS_ACCESS_KEY_ID` | AWS access key for deployment | AWS IAM Console → Create user with deployment permissions |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key for deployment | Same as above |
| `DATABASE_URL` | PostgreSQL connection string | Your database provider (e.g., Supabase, RDS) |
| `SESSION_SECRET` | Secret for session encryption | Generate: `openssl rand -base64 32` |
| `TRACKINGMORE_API_KEY` | TrackingMore API key | https://www.trackingmore.com/ |

### Optional Secrets

| Secret Name | Description | Required For |
|------------|-------------|--------------|
| `MAMAN_USERNAME` | Maman customs API username | Israeli customs integration |
| `MAMAN_PASSWORD` | Maman customs API password | Israeli customs integration |
| `S3_BUCKET` | S3 bucket name for deployment | S3 static hosting |
| `GITLEAKS_LICENSE` | Gitleaks license key (optional) | Enhanced gitleaks features |
| `SENTRY_DSN` | Sentry error tracking DSN | Error monitoring |

## Step-by-Step Setup

### 1. Add AWS Credentials

```bash
# Create IAM user with these policies:
# - AmazonS3FullAccess (for S3 deployment)
# - ElasticBeanstalkFullAccess (for EB deployment)
# - AmazonECS_FullAccess (for ECS deployment)

# Add secrets in GitHub:
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
```

### 2. Add Database URL

```bash
# Format: postgresql://username:password@host:port/database
DATABASE_URL=postgresql://user:pass@db.example.com:5432/shipment_tracking
```

### 3. Generate Session Secret

```bash
# Generate a strong random secret:
openssl rand -base64 32

# Add to GitHub Secrets:
SESSION_SECRET=<generated_secret>
```

### 4. Add TrackingMore API Key

1. Sign up at https://www.trackingmore.com/
2. Get your API key from dashboard
3. Add to GitHub Secrets:
   ```
   TRACKINGMORE_API_KEY=your_api_key_here
   ```

### 5. Add Maman API Credentials (Optional)

```bash
MAMAN_USERNAME=your_username
MAMAN_PASSWORD=your_password
```

## Workflow Triggers

### Automatic Triggers

- **Pull Request to `main`**: Runs tests and security scanning
- **Push to `staging`**: Runs full CI/CD including deployment to AWS

### Manual Trigger

You can manually trigger workflows from:
**Actions** → **Select workflow** → **Run workflow**

## Branch Protection

### Recommended Settings for `main` branch:

1. **Settings** → **Branches** → **Add branch protection rule**
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (at least 1)
   - ✅ Require status checks to pass before merging
     - Select: `🔐 Secret Scanning`
     - Select: `🏗️ Build & Test`
   - ✅ Require branches to be up to date before merging
   - ✅ Do not allow bypassing the above settings

### Auto-merge Setup

To enable auto-merge after successful checks:

1. Enable branch protection rules as above
2. When creating a PR:
   ```bash
   # Via GitHub CLI
   gh pr create --title "Your PR title" --body "Description"
   gh pr merge --auto --merge
   ```
3. Or via GitHub UI: Click **Enable auto-merge** button on PR

## Deployment Strategy

### Current Setup (S3 Example)

The workflow deploys to AWS S3 on push to `staging` branch.

**To customize deployment:**

Edit `.github/workflows/ci-cd.yml` → `deploy-staging` job:

```yaml
- name: Deploy to S3
  run: |
    # Your custom deployment commands
    aws s3 sync .next/static s3://${{ secrets.S3_BUCKET }}/static --delete
```

### Alternative Deployment Options

#### Elastic Beanstalk
```yaml
- name: Deploy to Elastic Beanstalk
  run: |
    zip -r deploy.zip .
    aws elasticbeanstalk create-application-version \
      --application-name shipment-tracking \
      --version-label ${{ github.sha }} \
      --source-bundle S3Bucket="my-bucket",S3Key="deploy.zip"
    aws elasticbeanstalk update-environment \
      --environment-name staging \
      --version-label ${{ github.sha }}
```

#### ECS (Docker)
```yaml
- name: Build and push Docker image
  run: |
    docker build -t shipment-tracking:${{ github.sha }} .
    aws ecr get-login-password --region us-east-1 | \
      docker login --username AWS --password-stdin $ECR_REGISTRY
    docker push $ECR_REGISTRY/shipment-tracking:${{ github.sha }}
    aws ecs update-service --cluster my-cluster --service shipment-tracking --force-new-deployment
```

## Monitoring & Notifications

### View Workflow Runs

**Actions** tab → Select workflow → View logs

### Slack Notifications (Optional)

Add to workflow:
```yaml
- name: Notify Slack
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Troubleshooting

### Build Fails

1. Check logs in Actions tab
2. Ensure all secrets are correctly set
3. Verify `SKIP_ENV_VALIDATION=true` is set in test environment

### Gitleaks Fails

1. Review gitleaks output for exposed secrets
2. Remove secrets from code
3. Use GitHub Secrets or environment variables
4. See `docs/GIT_SECRETS_POLICY.md` for remediation

### Deployment Fails

1. Verify AWS credentials have correct permissions
2. Check AWS region is correct (default: us-east-1)
3. Verify S3 bucket or deployment target exists

## Security Best Practices

✅ **DO:**
- Rotate secrets regularly (every 90 days)
- Use different secrets for dev/staging/prod
- Enable secret scanning in GitHub Security tab
- Review access logs regularly

❌ **DON'T:**
- Never commit secrets to git
- Don't share secrets in public channels
- Don't use production secrets in CI/CD tests
- Don't give excessive AWS permissions

## Support

For issues with GitHub Actions:
1. Check workflow logs
2. Review this documentation
3. Consult `docs/DEPLOYMENT.md`
4. Open an issue on GitHub

---

**Last Updated:** January 2026
