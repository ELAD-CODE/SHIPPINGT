# GitHub Actions Configuration

This document explains how to configure GitHub Secrets and use the CI/CD pipeline for this project.

## Overview

The CI/CD pipeline automatically runs on:
- **Push** to `main`, `develop`, or `TRACK-AI` branches
- **Pull requests** targeting `main` or `develop`

### Pipeline Stages

1. **🔒 Secret Scanning** - Gitleaks checks for leaked secrets
2. **🔍 Lint** - ESLint checks code quality
3. **🏗️ Build** - Next.js build verification
4. **🧪 Test** - Jest test suite execution
5. **🚀 Deploy** - Automated deployment (staging/production)

## Required GitHub Secrets

Navigate to **Settings → Secrets and variables → Actions** and add the following secrets:

### Database Configuration
- `DATABASE_URL` - PostgreSQL connection string
  - Example: `postgresql://user:password@host:5432/database`

### API Keys
- `TRACKINGMORE_API_KEY` - TrackingMore API key for shipment tracking
- `MAMAN_USERNAME` - Maman carrier API username (if using)
- `MAMAN_PASSWORD` - Maman carrier API password (if using)

### Security
- `SESSION_SECRET` - Secret for session encryption (min 32 characters)
  - Generate: `openssl rand -base64 32`

### AWS Deployment
- `AWS_ACCESS_KEY_ID` - AWS IAM access key
- `AWS_SECRET_ACCESS_KEY` - AWS IAM secret key
- `AWS_REGION` - AWS region (e.g., `us-east-1`, `eu-west-1`)
- `S3_BUCKET` - S3 bucket name for deployments

### Optional Secrets (for notifications)
- `SENDGRID_API_KEY` - SendGrid API key for email notifications
- `TWILIO_ACCOUNT_SID` - Twilio account SID for SMS
- `TWILIO_AUTH_TOKEN` - Twilio auth token
- `TWILIO_PHONE_NUMBER` - Twilio phone number

## Setting Up Secrets

### Method 1: GitHub Web UI

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Enter the secret name and value
5. Click **Add secret**

### Method 2: GitHub CLI

```bash
# Install GitHub CLI if needed
# https://cli.github.com/

# Authenticate
gh auth login

# Add secrets
gh secret set DATABASE_URL
gh secret set TRACKINGMORE_API_KEY
gh secret set SESSION_SECRET
gh secret set AWS_ACCESS_KEY_ID
gh secret set AWS_SECRET_ACCESS_KEY
gh secret set AWS_REGION
gh secret set S3_BUCKET
gh secret set MAMAN_USERNAME
gh secret set MAMAN_PASSWORD
```

## Workflow Files

### `.github/workflows/ci-cd.yml`

Main CI/CD pipeline with the following jobs:

#### Secret Scanning
```yaml
secret-scan:
  - Uses Gitleaks to scan for secrets
  - Fails if secrets are detected
  - Runs before all other jobs
```

#### Lint
```yaml
lint:
  - Runs ESLint
  - Checks code style and quality
```

#### Build
```yaml
build:
  - Builds Next.js application
  - Creates production bundle
  - Uploads artifacts
```

#### Test
```yaml
test:
  - Runs Jest test suite
  - Generates coverage report
  - Uploads coverage artifacts
```

#### Deploy Staging
```yaml
deploy-staging:
  - Runs on: develop, TRACK-AI branches
  - Deploys to AWS staging environment
  - Uses AWS credentials from secrets
```

#### Deploy Production
```yaml
deploy-production:
  - Runs on: main branch only
  - Deploys to AWS production environment
  - Requires manual approval (environment protection)
```

## Environment Protection Rules

It's recommended to set up environment protection rules:

1. Go to **Settings → Environments**
2. Create environments: `staging` and `production`
3. For `production`, add protection rules:
   - ✓ Required reviewers (1-2 people)
   - ✓ Wait timer (optional, e.g., 5 minutes)
   - ✓ Deployment branches: `main` only

## Gitleaks Configuration

The pipeline uses Gitleaks to scan for secrets. Default configuration is used, but you can customize:

1. Create `.gitleaks.toml` in repository root
2. Add custom rules or allowlists
3. See: https://github.com/gitleaks/gitleaks#configuration

## Troubleshooting

### Build Fails Due to Missing Secrets

If the build job fails with environment variable errors:

1. Check that secrets are properly set in GitHub
2. Verify secret names match exactly (case-sensitive)
3. Ensure dummy values in workflow are sufficient for build

### Gitleaks False Positives

If Gitleaks detects false positives:

1. Review the detected "secret"
2. If it's not a real secret, add to `.gitleaks.toml` allowlist
3. Never commit real secrets - rotate them instead

### Deployment Fails

1. Check AWS credentials are valid
2. Verify S3 bucket exists and is accessible
3. Check CloudFormation/deployment logs in AWS
4. Ensure IAM permissions are sufficient

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Gitleaks Documentation](https://github.com/gitleaks/gitleaks)
- [AWS Actions](https://github.com/aws-actions)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## Support

For pipeline issues, contact the DevOps team or check the workflow run logs in the **Actions** tab.
