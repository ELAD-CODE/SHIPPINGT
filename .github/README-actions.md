# GitHub Actions Setup Guide

This document explains how to configure GitHub Secrets for the CI/CD pipeline.

## Overview

The CI/CD pipeline requires several secrets to be configured in GitHub repository settings. These secrets are used for:
- AWS deployment
- Database connections
- API integrations
- Session management

## Required GitHub Secrets

Navigate to: **Repository Settings → Secrets and variables → Actions → New repository secret**

### 1. AWS Configuration (Required for Deployment)

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `AWS_ACCESS_KEY_ID` | AWS IAM access key for deployment | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_REGION` | AWS region for deployment | `us-east-1` |
| `S3_BUCKET` | S3 bucket name for build artifacts | `shipment-tracking-staging` |
| `CLOUDFRONT_DISTRIBUTION_ID` | (Optional) CloudFront distribution ID | `E1234567890ABC` |

### 2. Database

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |

### 3. API Keys & Authentication

| Secret Name | Description | How to Obtain |
|------------|-------------|---------------|
| `TRACKINGMORE_API_KEY` | TrackingMore API key | Register at https://www.trackingmore.com |
| `MAMAN_USERNAME` | Maman Online username | Contact Maman customs clearance service |
| `MAMAN_PASSWORD` | Maman Online password | Contact Maman customs clearance service |

### 4. Security

| Secret Name | Description | How to Generate |
|------------|-------------|-----------------|
| `SESSION_SECRET` | Session encryption key | `openssl rand -base64 32` |
| `JWT_SECRET` | JWT token signing key | `openssl rand -base64 32` |
| `WEBHOOK_SECRET` | External webhook validation | `openssl rand -hex 32` |

### 5. Optional: Gitleaks

| Secret Name | Description | How to Obtain |
|------------|-------------|---------------|
| `GITLEAKS_LICENSE` | (Optional) Gitleaks premium features | https://gitleaks.io |

## How to Add Secrets

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Enter the secret name (exact match from table above)
5. Paste the secret value
6. Click **Add secret**

## Environment-Specific Secrets

For staging and production environments, use **Environment secrets**:

1. Go to **Settings** → **Environments**
2. Create environments: `staging`, `production`
3. Add environment-specific secrets

Example:
- Staging: `DATABASE_URL` → staging database
- Production: `DATABASE_URL` → production database

## Verification

After adding secrets, trigger a workflow to verify:

1. Push to `staging` branch, or
2. Open a Pull Request to `main` branch

Check the Actions tab for workflow execution status.

## Security Best Practices

✅ **DO:**
- Use IAM roles with minimum required permissions
- Rotate secrets regularly (every 90 days)
- Use separate credentials for staging/production
- Enable MFA for AWS accounts
- Audit secret access logs

❌ **DON'T:**
- Share secrets via chat/email
- Commit secrets to git (even in private repos)
- Use production secrets in development
- Give deployment keys full admin access

## IAM Policy for AWS Deployment

Minimum required permissions for deployment user:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket",
        "s3:DeleteObject"
      ],
      "Resource": [
        "arn:aws:s3:::your-bucket-name",
        "arn:aws:s3:::your-bucket-name/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "arn:aws:cloudfront::*:distribution/*"
    }
  ]
}
```

## Troubleshooting

### Workflow fails with "Missing required secret"
- Verify secret name matches exactly (case-sensitive)
- Check if secret is set for the correct environment

### AWS deployment fails with permission errors
- Review IAM policy attached to the user
- Verify S3 bucket name and region match secrets

### Gitleaks reports false positives
- Add patterns to `.gitleaks.toml` (if created)
- Use `gitleaks:allow` comment in code (use sparingly)

## Support

For issues with CI/CD setup:
- Open a GitHub issue
- Contact DevOps team
- Review workflow logs in Actions tab

---

**Last updated:** 2026-01-22
