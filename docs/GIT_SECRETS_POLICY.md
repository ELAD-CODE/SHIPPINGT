# Git Secrets Policy

This document outlines the policy and procedures for handling secrets in this repository.

## Table of Contents

- [Policy Overview](#policy-overview)
- [What Are Secrets?](#what-are-secrets)
- [Prevention](#prevention)
- [Detection](#detection)
- [Remediation](#remediation)
- [Best Practices](#best-practices)

## Policy Overview

**NO SECRETS SHALL BE COMMITTED TO THE REPOSITORY - EVER.**

This is a zero-tolerance policy. Any accidental commit of secrets must be immediately remediated following the procedures below.

## What Are Secrets?

Secrets include, but are not limited to:

- 🔑 API keys and tokens
- 🔒 Database credentials and connection strings
- 🛡️ Private keys and certificates
- 🔐 OAuth client secrets
- 💳 AWS access keys and secret keys
- 📧 SMTP credentials
- 📱 Twilio/Sendgrid tokens
- 🎯 Session secrets
- 🔏 JWT signing keys

### Examples of Secrets to Never Commit

```bash
# ❌ NEVER commit these
DATABASE_URL="postgresql://admin:MyP@ssw0rd@db.example.com:5432/prod"
TRACKINGMORE_API_KEY="tm_sk_live_abc123def456"
AWS_SECRET_ACCESS_KEY="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
SESSION_SECRET="super-secret-key-that-should-be-in-env"
```

## Prevention

### 1. Use Environment Variables

**Always** use environment variables for secrets:

```javascript
// ✅ CORRECT
const apiKey = process.env.TRACKINGMORE_API_KEY;
const dbUrl = process.env.DATABASE_URL;

// ❌ WRONG
const apiKey = "tm_sk_live_abc123def456";
const dbUrl = "postgresql://admin:password@localhost/db";
```

### 2. Use .env Files (Local Only)

Create a `.env` file for local development:

```bash
# .env (NEVER commit this file)
DATABASE_URL="postgresql://localhost:5432/dev"
TRACKINGMORE_API_KEY="your_dev_key"
```

### 3. Check .gitignore

Ensure `.gitignore` includes:

```gitignore
# Environment files
.env
.env.local
.env*.local
*.pem
*.key
*.crt
secrets/
credentials/
```

### 4. Use .env.example

Provide a template with dummy values:

```bash
# .env.example (SAFE to commit)
DATABASE_URL="postgresql://user:password@localhost:5432/database"
TRACKINGMORE_API_KEY="your_api_key_here"
```

### 5. Pre-commit Hooks

Install git hooks to prevent commits:

```bash
# Install gitleaks as pre-commit hook
brew install gitleaks  # macOS
# or
apt-get install gitleaks  # Ubuntu

# Add to .git/hooks/pre-commit
gitleaks protect --staged --verbose
```

## Detection

### Automated Detection

#### 1. Gitleaks in CI/CD

Our GitHub Actions workflow includes Gitleaks scanning:

```yaml
- name: Run Gitleaks
  uses: gitleaks/gitleaks-action@v2
```

This runs on every push and pull request.

#### 2. Local Scanning

Scan your repository locally:

```bash
# Install gitleaks
brew install gitleaks

# Scan all commits
gitleaks detect --source . --verbose

# Scan before commit
gitleaks protect --staged
```

#### 3. GitHub Secret Scanning

GitHub automatically scans for known secret patterns. Enable:
1. Go to **Settings → Code security and analysis**
2. Enable **Secret scanning**
3. Enable **Push protection**

### Manual Review

Before committing, always review:

```bash
# Review what you're about to commit
git diff --staged

# Look for suspicious patterns
git diff --staged | grep -i "password\|secret\|key\|token"
```

## Remediation

### If You Accidentally Commit a Secret

**⚠️ CRITICAL: DO NOT just delete the file and commit again. The secret is still in Git history!**

### Step 1: Immediate Actions (Within Minutes)

1. **Rotate the Secret Immediately**
   - Generate a new API key/password
   - Update the secret in your environment
   - Revoke the old secret

2. **Remove from Latest Commit (If not pushed)**

   ```bash
   # If you haven't pushed yet
   git reset --soft HEAD~1
   
   # Remove the secret from files
   # Edit files to remove secrets
   
   # Re-commit without secrets
   git commit -m "Your message"
   ```

### Step 2: If Already Pushed (Requires History Rewrite)

**⚠️ WARNING: This rewrites history. Coordinate with team first.**

#### Option A: BFG Repo-Cleaner (Recommended)

```bash
# Install BFG
brew install bfg  # macOS
# or download from https://rtyley.github.io/bfg-repo-cleaner/

# Create a backup first!
git clone --mirror git@github.com:your-org/repo.git repo-backup.git

# Clone the repo
git clone git@github.com:your-org/repo.git
cd repo

# Remove secrets (replace with placeholder)
bfg --replace-text passwords.txt  # Create passwords.txt with secrets to remove

# Clean up
cd repo.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push (COORDINATE WITH TEAM!)
git push --force
```

#### Option B: Git Filter-Branch (Manual)

```bash
# Remove a specific file from all history
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch path/to/secret/file' \
  --prune-empty --tag-name-filter cat -- --all

# Force push
git push --force --all
git push --force --tags
```

#### Option C: git-filter-repo (Modern Alternative)

```bash
# Install git-filter-repo
pip install git-filter-repo

# Remove file from history
git filter-repo --path path/to/secret/file --invert-paths

# Force push
git push --force --all
```

### Step 3: Notify Team

1. **Immediately notify team** that history was rewritten
2. Team members must re-clone:
   ```bash
   cd existing-repo
   git fetch origin
   git reset --hard origin/main
   ```

### Step 4: Document the Incident

Create an incident report:
- What was exposed?
- When was it committed?
- When was it detected?
- Was it rotated?
- What prevention measures were added?

## Best Practices

### ✅ DO

- ✅ Use environment variables for all secrets
- ✅ Keep `.env` files in `.gitignore`
- ✅ Provide `.env.example` with dummy values
- ✅ Use GitHub Secrets for CI/CD
- ✅ Rotate secrets regularly (every 90 days)
- ✅ Use different secrets for each environment
- ✅ Review diffs before committing
- ✅ Enable GitHub secret scanning
- ✅ Use pre-commit hooks
- ✅ Rotate immediately if exposed

### ❌ DON'T

- ❌ Commit `.env` files
- ❌ Hard-code secrets in code
- ❌ Share secrets in chat/email
- ❌ Use production secrets in development
- ❌ Commit credentials in comments
- ❌ Push without reviewing changes
- ❌ Ignore Gitleaks warnings
- ❌ Store secrets in config files
- ❌ Use weak or default secrets
- ❌ Forget to rotate exposed secrets

## Secret Management Tools

Consider using a secret management service:

### 1. GitHub Secrets (CI/CD)
- Built into GitHub Actions
- Free for public/private repos
- Best for CI/CD secrets

### 2. AWS Secrets Manager
- Automatic rotation
- Audit logging
- Integrates with AWS services

### 3. HashiCorp Vault
- Enterprise-grade
- Dynamic secrets
- Fine-grained access control

### 4. Doppler
- Developer-friendly
- Multi-environment support
- Sync across platforms

### 5. 1Password/Bitwarden (Team)
- Shared team secrets
- Access control
- Audit logs

## Compliance & Auditing

### Regular Audits

Perform quarterly audits:

```bash
# Scan full history
gitleaks detect --source . --log-level info

# Check for patterns
git log -p | grep -i "password\|secret\|key" > audit.log
```

### Access Reviews

- Review who has access to secrets quarterly
- Remove access for departed team members immediately
- Use principle of least privilege

### Rotation Schedule

| Secret Type | Rotation Frequency |
|-------------|-------------------|
| API Keys | Every 90 days |
| Database Passwords | Every 90 days |
| Session Secrets | Every 180 days |
| AWS Keys | Every 90 days |
| After exposure | **Immediately** |

## Incident Response Plan

1. **Detect** - Gitleaks alert or manual discovery
2. **Assess** - Determine exposure scope
3. **Contain** - Rotate secret immediately
4. **Remediate** - Remove from history if needed
5. **Notify** - Inform team and stakeholders
6. **Document** - Record incident details
7. **Prevent** - Add controls to prevent recurrence

## Training & Awareness

All developers must:
- Read this policy before first commit
- Complete security training annually
- Report suspected exposures immediately
- Review commits before pushing

## Questions?

If you're unsure whether something is a secret:
1. **When in doubt, treat it as a secret**
2. Ask the security team
3. Use environment variables

## Policy Version

- **Version:** 1.0
- **Last Updated:** 2026-01-22
- **Review Date:** 2026-04-22 (quarterly)

## Contact

For questions or to report an incident:
- Security Team: security@example.com
- Emergency: security-emergency@example.com
