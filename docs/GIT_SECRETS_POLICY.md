# Git Secrets Policy

**Security policy for managing sensitive information in the Shipment Tracking Israel repository.**

---

## Table of Contents

1. [Overview](#overview)
2. [What Are Secrets?](#what-are-secrets)
3. [Prevention](#prevention)
4. [Detection](#detection)
5. [If You Accidentally Commit a Secret](#if-you-accidentally-commit-a-secret)
6. [Removing Secrets from Git History](#removing-secrets-from-git-history)
7. [Secret Rotation](#secret-rotation)
8. [Best Practices](#best-practices)

---

## Overview

**Secrets MUST NEVER be committed to version control.** This includes:
- API keys
- Passwords
- Database connection strings
- Private keys
- Session secrets
- AWS credentials
- Any other sensitive information

**Why?** Once committed to git, secrets become:
- Visible to anyone with repository access
- Permanently stored in git history
- Difficult to fully remove
- A security risk even if repository is private

---

## What Are Secrets?

### Examples of Secrets (NEVER commit these):

```bash
# ❌ BAD - Hardcoded secrets
const API_KEY = 'sk_live_123456789abcdef'
const DB_PASSWORD = 'MySecretPassword123'
const AWS_ACCESS_KEY = 'AKIAIOSFODNN7EXAMPLE'

# Database URLs
DATABASE_URL="postgresql://user:password@host:5432/db"

# API tokens
TRACKINGMORE_API_KEY=abc123xyz789

# Session secrets
SESSION_SECRET=my-super-secret-key
```

### What's Safe to Commit:

```bash
# ✅ GOOD - Environment variable references
const API_KEY = process.env.TRACKINGMORE_API_KEY
const DB_PASSWORD = process.env.DATABASE_URL
const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID

# ✅ GOOD - Example configurations
# .env.example
TRACKINGMORE_API_KEY=your_api_key_here
DATABASE_URL=postgresql://user:pass@localhost:5432/db
```

---

## Prevention

### 1. Use Environment Variables

**Always** use environment variables for secrets:

```typescript
// ✅ CORRECT
const apiKey = process.env.TRACKINGMORE_API_KEY
const dbUrl = process.env.DATABASE_URL

// ❌ WRONG
const apiKey = 'sk_live_123456'
```

### 2. Use .env Files (Local Development)

```bash
# Create .env.local (NOT .env)
cp .env.example .env.local

# Edit .env.local with your actual secrets
# This file is git-ignored
```

### 3. Ensure .gitignore Is Configured

Verify `.gitignore` contains:

```gitignore
# Environment files
.env
.env*.local
.env.local
.env.development.local
.env.test.local
.env.production.local
*.env

# Backup files
*.sql
*.dump
backup-*
```

### 4. Pre-commit Hooks

Install git-secrets or similar tools:

```bash
# Install git-secrets
brew install git-secrets  # macOS
# or
apt-get install git-secrets  # Linux

# Initialize for repository
git secrets --install
git secrets --register-aws
```

---

## Detection

### Automated Detection - Gitleaks

The CI/CD pipeline automatically scans for secrets using [Gitleaks](https://github.com/gitleaks/gitleaks).

**Every commit is scanned:**
- Push to any branch triggers secret scanning
- Pull requests are blocked if secrets detected
- Scan results visible in GitHub Actions

### Manual Scanning

Run gitleaks locally before committing:

```bash
# Install gitleaks
brew install gitleaks  # macOS
# or download from https://github.com/gitleaks/gitleaks/releases

# Scan repository
gitleaks detect --source . --verbose

# Scan uncommitted changes
gitleaks protect --staged --verbose
```

### GitHub Secret Scanning

GitHub automatically scans for known secret patterns:
- **Settings** → **Security & analysis** → **Secret scanning**
- Enable push protection to block pushes with secrets

---

## If You Accidentally Commit a Secret

### IMMEDIATE ACTIONS (Do within 5 minutes):

1. **STOP** - Don't push if you haven't yet
2. **Remove the secret from code:**
   ```bash
   # Edit the file to remove secret
   # Replace with environment variable reference
   ```

3. **Amend or reset the commit:**
   ```bash
   # If you haven't pushed yet
   git add .
   git commit --amend
   
   # Or reset the commit entirely
   git reset HEAD~1
   ```

4. **ROTATE the secret immediately:**
   - Generate new API key
   - Change password
   - Rotate credentials

### If Already Pushed to GitHub:

1. **Assume the secret is compromised**
2. **Rotate/revoke the secret IMMEDIATELY:**
   - TrackingMore: Delete API key, create new one
   - Database: Change password
   - AWS: Deactivate access key, create new one
   - Session secret: Generate new secret

3. **Remove from git history** (see next section)

4. **Notify team/security:**
   - Alert team members
   - Document incident
   - Monitor for unauthorized access

---

## Removing Secrets from Git History

### ⚠️ WARNING

Rewriting git history:
- Requires force push
- Disrupts other developers
- Should be done carefully
- Coordinate with team first

### Option 1: git filter-repo (Recommended)

**Most powerful and safest method:**

```bash
# Install git-filter-repo
pip install git-filter-repo

# Backup repository
git clone --mirror https://github.com/OWNER/REPO.git backup-repo

# Remove file containing secrets
git filter-repo --path path/to/secret/file --invert-paths

# Or remove specific string patterns
git filter-repo --replace-text <(echo "API_KEY=sk_live_123456==>API_KEY=REDACTED")

# Force push (coordinate with team!)
git push origin --force --all
git push origin --force --tags
```

### Option 2: BFG Repo-Cleaner

**Simpler but less flexible:**

```bash
# Download BFG
# https://rtyley.github.io/bfg-repo-cleaner/

# Clone repository with --mirror
git clone --mirror https://github.com/OWNER/REPO.git

cd REPO.git

# Remove file
bfg --delete-files secret-file.env

# Or replace strings
bfg --replace-text passwords.txt  # File with "SECRET_KEY==>REDACTED"

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push --force
```

### Option 3: Interactive Rebase (For Recent Commits)

**Only if secret is in last few commits:**

```bash
# Rebase last 5 commits
git rebase -i HEAD~5

# Mark commits with secret as 'edit'
# Remove secret from files
# Amend each commit:
git add .
git commit --amend
git rebase --continue

# Force push
git push --force
```

### After Removing from History:

1. **All developers must re-clone:**
   ```bash
   # Don't try to pull - will cause conflicts
   rm -rf local-repo
   git clone https://github.com/OWNER/REPO.git
   ```

2. **Verify secret is gone:**
   ```bash
   gitleaks detect --source . --verbose
   ```

3. **Monitor for unauthorized access**

---

## Secret Rotation

### When to Rotate Secrets:

- **Immediately**: If secret is compromised or committed to git
- **Regularly**: Every 90 days for production secrets
- **After**: Team member leaves with access
- **Proactively**: Before major releases

### How to Rotate Secrets:

#### 1. TrackingMore API Key

```bash
# 1. Create new API key at trackingmore.com
# 2. Test new key in staging
# 3. Update production environment variable
# 4. Monitor for errors
# 5. After 24h, delete old key
```

#### 2. Database Password

```bash
# 1. Create new database user or change password
ALTER USER postgres WITH PASSWORD 'new_secure_password';

# 2. Update DATABASE_URL in all environments
# 3. Restart application
# 4. Verify connectivity
```

#### 3. AWS Access Keys

```bash
# 1. Create new access key in IAM
aws iam create-access-key --user-name deploy-user

# 2. Update in GitHub Secrets and environment
# 3. Test deployment
# 4. Deactivate old key
aws iam update-access-key --access-key-id OLD_KEY_ID --status Inactive

# 5. After 48h, delete old key
aws iam delete-access-key --access-key-id OLD_KEY_ID
```

#### 4. Session Secret

```bash
# Generate new secret
openssl rand -base64 32

# Update SESSION_SECRET in environment
# Users will need to re-login (sessions invalidated)
```

---

## Best Practices

### For Developers:

✅ **DO:**
- Use environment variables for all secrets
- Keep `.env.local` locally, never commit
- Review `.gitignore` before adding new secrets
- Run `gitleaks protect` before pushing
- Use strong, unique secrets for each environment
- Document which secrets are needed (in `.env.example`)
- Use GitHub Secrets for CI/CD
- Rotate secrets regularly

❌ **DON'T:**
- Never hardcode secrets in code
- Never commit `.env` files
- Never share secrets in chat/email
- Never reuse passwords across services
- Never commit debug output with secrets
- Never put secrets in filenames
- Never log secrets to console
- Never put secrets in comments

### For Team Leads:

✅ **DO:**
- Enable GitHub secret scanning and push protection
- Require gitleaks in CI/CD pipeline
- Set up secret rotation schedule
- Audit access to secrets regularly
- Train team on secret management
- Have incident response plan
- Use secret management service (AWS Secrets Manager, Vault)

### For DevOps:

✅ **DO:**
- Use AWS Secrets Manager or similar for production
- Enable encryption at rest for databases
- Use IAM roles instead of access keys where possible
- Implement least privilege access
- Monitor secret usage
- Set up alerts for secret access
- Regular security audits

---

## Incident Response Plan

If a secret is exposed:

1. **⏰ 0-5 minutes**: Rotate/revoke secret immediately
2. **⏰ 5-15 minutes**: Remove from git history
3. **⏰ 15-30 minutes**: Notify team, assess damage
4. **⏰ 30-60 minutes**: Monitor logs for unauthorized access
5. **⏰ 1-24 hours**: Review and update security measures
6. **⏰ 24-48 hours**: Conduct post-mortem, update documentation

---

## Tools & Resources

### Recommended Tools:

- **Gitleaks**: https://github.com/gitleaks/gitleaks
- **git-secrets**: https://github.com/awslabs/git-secrets
- **BFG Repo-Cleaner**: https://rtyley.github.io/bfg-repo-cleaner/
- **git-filter-repo**: https://github.com/newren/git-filter-repo
- **AWS Secrets Manager**: https://aws.amazon.com/secrets-manager/
- **HashiCorp Vault**: https://www.vaultproject.io/

### Documentation:

- GitHub Secret Scanning: https://docs.github.com/en/code-security/secret-scanning
- Removing Sensitive Data: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository

---

## Questions?

For security concerns:
- Email: security@shipmenttracking.net
- Slack: #security channel
- Escalate to: CTO/Security Team

**Remember: When in doubt, assume it's a secret and use environment variables!**

---

**Last Updated:** January 2026
