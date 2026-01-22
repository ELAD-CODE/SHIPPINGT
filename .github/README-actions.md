# GitHub Actions Setup Guide

This document explains how to configure GitHub Secrets and environment settings for the CI/CD pipeline.

## 📋 Overview

The CI/CD pipeline automatically:
- ✅ Scans for secrets (gitleaks)
- ✅ Runs linters and tests
- ✅ Builds the application
- ✅ Deploys to staging (on `staging` branch)
- ✅ Deploys to production (on `main` branch)

## 🔑 Required GitHub Secrets

To configure GitHub Secrets, go to: **Repository Settings → Secrets and variables → Actions → New repository secret**

### Critical Secrets (Required for CI/CD)

| Secret Name | Description | Example |
|------------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | AWS access key for deployment | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret access key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_REGION` | AWS region for deployment | `us-east-1` |
| `AWS_S3_BUCKET` | S3 bucket name for static files | `shipment-tracking-prod` |
| `STAGING_DATABASE_URL` | PostgreSQL URL for staging | `postgresql://user:pass@host:5432/db` |
| `PRODUCTION_DATABASE_URL` | PostgreSQL URL for production | `postgresql://user:pass@host:5432/db` |

### Optional Secrets (Recommended)

| Secret Name | Description | Required For |
|------------|-------------|--------------|
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID | Cache invalidation after deployment |
| `GITLEAKS_LICENSE` | Gitleaks Enterprise license | Enterprise features (optional) |
| `ECS_CLUSTER` | ECS cluster name | ECS deployment (if using) |

### Application Secrets (Not used in CI, but needed in deployed environments)

These should be configured in your AWS environment (ECS Task Definitions, Elastic Beanstalk, Lambda, etc.):

- `TRACKINGMORE_API_KEY`
- `MAMAN_USERNAME`
- `MAMAN_PASSWORD`
- `SESSION_SECRET`
- `JWT_SECRET`
- `WEBHOOK_SECRET`

## 🚀 How to Add GitHub Secrets

### Step 1: Navigate to Repository Settings

```
GitHub Repository → Settings → Secrets and variables → Actions
```

### Step 2: Add Each Secret

1. Click **"New repository secret"**
2. Enter the **Name** (exactly as shown above, case-sensitive)
3. Enter the **Value** (the actual secret)
4. Click **"Add secret"**

### Step 3: Verify Secrets

After adding all secrets, you should see them listed in the "Repository secrets" section (values are hidden for security).

## 🌍 Environment Configuration

The CI/CD pipeline uses GitHub Environments for staging and production deployments.

### Creating Environments

1. Go to **Repository Settings → Environments**
2. Create two environments:
   - `staging`
   - `production`

### Environment-Specific Configuration

#### Staging Environment

- **URL**: `https://staging.shipment-tracking.com`
- **Protection rules**: None (auto-deploy on push to `staging` branch)
- **Secrets**: Uses repository-level secrets

#### Production Environment

- **URL**: `https://shipment-tracking.com`
- **Protection rules** (Recommended):
  - ✅ Required reviewers (1-2 people)
  - ✅ Wait timer: 5 minutes
  - ✅ Deployment branches: Only `main`
- **Secrets**: Uses repository-level secrets

## 🔒 AWS IAM Setup

### Required IAM Permissions

Your AWS user/role needs the following permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::YOUR_BUCKET_NAME",
        "arn:aws:s3:::YOUR_BUCKET_NAME/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation"
      ],
      "Resource": "arn:aws:cloudfront::ACCOUNT_ID:distribution/DISTRIBUTION_ID"
    }
  ]
}
```

### Creating an AWS IAM User for CI/CD

1. **AWS Console** → **IAM** → **Users** → **Add user**
2. User name: `github-actions-deployer`
3. Access type: **Programmatic access**
4. Attach policy: Create custom policy with permissions above
5. **Save the Access Key ID and Secret Access Key** (you'll need these for GitHub Secrets)

## 🔄 Workflow Triggers

### Automatic Triggers

- **Pull Request to `main`**: Runs tests and linting only
- **Push to `staging`**: Full CI/CD + deploy to staging
- **Push to `main`**: Full CI/CD + deploy to production (with manual approval)

### Manual Triggers

You can manually trigger workflows from the GitHub Actions tab:

1. Go to **Actions** tab
2. Select the **CI/CD Pipeline** workflow
3. Click **"Run workflow"**
4. Select branch and click **"Run workflow"**

## 🛡️ Secret Scanning (Gitleaks)

### What it Does

Gitleaks scans all code and commits for:
- API keys
- Passwords
- Private keys
- AWS credentials
- Database connection strings
- JWT tokens
- OAuth tokens

### If Secrets are Found

1. The pipeline will **fail** immediately
2. Check the Gitleaks report in the Actions log
3. Remove the secret from code
4. Rotate the compromised secret
5. Follow the instructions in `docs/GIT_SECRETS_POLICY.md` to remove from git history

### False Positives

If Gitleaks flags something that's not a secret:

1. Create a `.gitleaksignore` file in the repository root
2. Add the commit SHA or pattern to ignore:

```
# .gitleaksignore
# Ignore specific commit
abc123def456789

# Ignore file pattern
**/test-fixtures/**
```

## 📊 Monitoring Deployments

### Viewing Deployment Status

1. Go to **Actions** tab
2. Click on the workflow run
3. Check each job status:
   - 🔒 Secret scan
   - 🧪 Lint & test
   - 🏗️ Build
   - 🚀 Deploy

### Deployment Notifications

The workflow outputs success messages in the logs. You can also integrate with:
- Slack (via webhooks)
- Discord (via webhooks)
- Email notifications (GitHub settings)

## 🔧 Troubleshooting

### Build Fails with "Missing Environment Variable"

**Cause**: Required secrets not configured

**Solution**:
1. Check which variable is missing in the error log
2. Add it to GitHub Secrets (see Required Secrets section)
3. Re-run the workflow

### Gitleaks Fails

**Cause**: Secret detected in code or git history

**Solution**:
1. Check the Gitleaks report for the detected secret
2. Remove it from code
3. Rotate the secret
4. Follow `docs/GIT_SECRETS_POLICY.md` to clean git history

### Deployment Fails with AWS Error

**Cause**: AWS credentials invalid or insufficient permissions

**Solution**:
1. Verify `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are correct
2. Check IAM user has required permissions (see AWS IAM Setup section)
3. Verify S3 bucket exists and is accessible

### Tests Fail

**Cause**: Code changes broke tests

**Solution**:
1. Run tests locally: `npm test`
2. Fix failing tests
3. Commit and push fixes
4. Workflow will automatically re-run

## 📝 Best Practices

### Secret Management

- ✅ Never commit secrets to code
- ✅ Use `.env.example` with placeholder values
- ✅ Rotate secrets regularly (every 90 days)
- ✅ Use different secrets for staging and production
- ✅ Audit secret access logs in AWS IAM

### Branch Strategy

- `main`: Production-ready code
- `staging`: Pre-production testing
- `feature/*`: Feature development branches
- `hotfix/*`: Emergency production fixes

### Pull Request Reviews

- Require at least 1 approval before merging to `main`
- Run all CI checks before merging
- Check Gitleaks results carefully

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Gitleaks Documentation](https://github.com/gitleaks/gitleaks)
- [AWS CLI Documentation](https://docs.aws.amazon.com/cli/)
- [Prisma Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)

## 📞 Support

For issues with CI/CD setup:
1. Check the troubleshooting section above
2. Review workflow logs in GitHub Actions tab
3. Open an issue in the repository
