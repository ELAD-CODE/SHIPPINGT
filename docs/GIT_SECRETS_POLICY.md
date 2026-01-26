# Git Secrets Policy

This document outlines the policy and procedures for handling secrets in the SHIPPINGT repository.

## Table of Contents

- [Policy Overview](#policy-overview)
- [Prevention](#prevention)
- [Detection](#detection)
- [Response & Remediation](#response--remediation)
- [Secret Rotation](#secret-rotation)
- [Best Practices](#best-practices)

## Policy Overview

### Core Principles

1. **Never commit secrets to Git** - No exceptions, even in private repositories
2. **Use environment variables** - All secrets must be loaded from environment
3. **Rotate immediately** - Any exposed secret must be rotated within 24 hours
4. **Scan regularly** - Automated scanning on every commit
5. **No history rewriting** - We do NOT rewrite history; we rotate and move forward

### What Qualifies as a Secret?

- API keys and tokens
- Database credentials
- Session secrets / JWT secrets
- AWS access keys and secret keys
- Private SSH keys
- OAuth client secrets
- Webhook secrets
- Encryption keys
- Third-party service credentials (Maman, TrackingMore, etc.)
- Any password or authentication credential

### What is NOT a Secret?

- Public API endpoints
- Non-sensitive configuration (timeouts, feature flags)
- Example/placeholder values in `.env.example`
- Public package versions
- Documentation

## Prevention

### 1. Pre-Commit Protection

#### Install git-secrets (Local Development)

```bash
# macOS
brew install git-secrets

# Linux
git clone https://github.com/awslabs/git-secrets.git
cd git-secrets
sudo make install

# Configure for repo
cd /path/to/SHIPPINGT
git secrets --install
git secrets --register-aws
git secrets --add 'TRACKINGMORE_API_KEY=[A-Za-z0-9]+'
git secrets --add 'MAMAN_PASSWORD=.*'
git secrets --add 'SESSION_SECRET=.*'
```

#### Configure .gitignore

Ensure `.gitignore` excludes all environment files:

```gitignore
# Environment files
.env
.env.local
.env.*.local
.env.development
.env.production
.env.test
.env.staging
*.env
!.env.example
```

### 2. Code Review Checklist

Reviewers MUST verify:
- [ ] No hard-coded secrets in code
- [ ] All sensitive values use `process.env.VAR_NAME`
- [ ] New dependencies checked for vulnerabilities
- [ ] `.env.example` updated with new variables
- [ ] No secrets in comments or documentation

### 3. Developer Training

All developers must:
- Read this policy before first commit
- Understand difference between public and secret data
- Know how to use environment variables
- Report any suspected secret exposure immediately

## Detection

### 1. Automated CI/CD Scanning

**Gitleaks** runs automatically on:
- Every pull request to `main`
- Every push to `staging`
- Weekly scheduled scans of entire repository

Configuration in `.github/workflows/ci-cd.yml`:

```yaml
- name: Run Gitleaks
  uses: gitleaks/gitleaks-action@v2
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 2. Manual Scanning

Run local scan before pushing:

```bash
# Using Gitleaks (recommended)
docker run -v $(pwd):/path zricethezav/gitleaks:latest \
  detect --source="/path" --verbose

# Scan specific commit
gitleaks detect --log-opts="<commit-sha>"

# Scan uncommitted changes
gitleaks protect --staged
```

### 3. GitHub Secret Scanning

GitHub's built-in secret scanning alerts you when known secret patterns are detected.

Enable in: **Settings → Security → Code security and analysis**

- ✅ Secret scanning
- ✅ Push protection (prevents commits with secrets)

## Response & Remediation

### Step 1: Immediate Response (Within 1 Hour)

If a secret is detected:

1. **STOP** - Do not push any more changes
2. **Assess** - Identify what secret was exposed
3. **Notify** - Alert team lead and security team immediately
4. **Rotate** - Generate new secret and update all systems

### Step 2: Secret Rotation (Within 24 Hours)

#### For TrackingMore API Key

```bash
# 1. Go to TrackingMore dashboard
# 2. Generate new API key
# 3. Update GitHub Secret: TRACKINGMORE_API_KEY
# 4. Update production environment variable
# 5. Verify application still works
# 6. Revoke old API key
```

#### For Database Credentials

```bash
# 1. Connect to database as admin
psql -h db-host -U postgres

# 2. Create new user/password
CREATE USER new_app_user WITH PASSWORD 'new_secure_password';
GRANT ALL PRIVILEGES ON DATABASE shipment_tracking TO new_app_user;

# 3. Update DATABASE_URL in GitHub Secrets
# 4. Deploy with new credentials
# 5. Verify application works
# 6. Revoke old credentials
DROP USER old_app_user;
```

#### For AWS Keys

```bash
# 1. Log into AWS Console → IAM
# 2. Find the exposed user
# 3. Create new access key
# 4. Update GitHub Secrets:
#    - AWS_ACCESS_KEY_ID
#    - AWS_SECRET_ACCESS_KEY
# 5. Test deployment
# 6. Delete old access key
```

#### For Session Secrets

```bash
# 1. Generate new secret
openssl rand -base64 32

# 2. Update GitHub Secret: SESSION_SECRET
# 3. Update production environment
# 4. Deploy (will log out all users - acceptable)
# 5. Notify users if needed
```

### Step 3: Remove from Git History (Manual, As Needed)

**Policy: We do NOT automatically rewrite history.**

However, if history cleaning is absolutely necessary (e.g., long-lived secrets with extensive exposure):

#### Option A: Using git-filter-repo (Recommended)

```bash
# 1. Install git-filter-repo
pip3 install git-filter-repo

# 2. Backup repository
cp -r SHIPPINGT SHIPPINGT-backup

# 3. Clone fresh copy
git clone https://github.com/ELAD-CODE/SHIPPINGT.git SHIPPINGT-clean
cd SHIPPINGT-clean

# 4. Remove file from history
git filter-repo --path config/secrets.js --invert-paths

# Or replace strings
git filter-repo --replace-text ../replacements.txt

# Format of replacements.txt:
# actual_secret==>REDACTED
# another_secret==>REDACTED

# 5. Force push (REQUIRES TEAM COORDINATION)
git push origin --force --all
git push origin --force --tags

# 6. All team members must re-clone
# Send message: "Repository history rewritten. Please re-clone."
```

#### Option B: Using BFG Repo Cleaner

```bash
# 1. Download BFG
wget https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar

# 2. Clone mirror
git clone --mirror https://github.com/ELAD-CODE/SHIPPINGT.git

# 3. Remove secrets
java -jar bfg-1.14.0.jar --replace-text replacements.txt SHIPPINGT.git

# 4. Cleanup
cd SHIPPINGT.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# 5. Force push
git push --force

# 6. All team members must re-clone
```

#### Important Notes on History Rewriting

⚠️ **This is a last resort option. Before rewriting history:**

- Get approval from team lead
- Schedule maintenance window
- Notify ALL team members
- Ensure all local branches are backed up
- Understand that open PRs will break
- Plan for team members to re-clone

✅ **Better approach:**
- Rotate the secret immediately
- Leave history as-is
- Document the incident
- Improve prevention

### Step 4: Document Incident

Create incident report including:
- Date/time of discovery
- What secret was exposed
- How it was exposed
- When it was first committed
- Rotation actions taken
- Preventive measures added

Template in: `docs/incidents/YYYY-MM-DD-secret-exposure.md`

## Secret Rotation

### Rotation Schedule

| Secret Type | Rotation Frequency | Owner |
|-------------|-------------------|-------|
| TrackingMore API Key | Every 6 months | Backend Lead |
| Database Passwords | Every 90 days | DBA |
| Session Secrets | Every 90 days | Backend Lead |
| AWS Keys | Every 90 days | DevOps |
| Webhook Secrets | Every 6 months | Backend Lead |
| Maman Credentials | When Maman requires | Integration Lead |

### Rotation Procedure

1. Generate new secret
2. Update GitHub Secrets (staging)
3. Deploy to staging
4. Verify staging works
5. Update GitHub Secrets (production)
6. Deploy to production
7. Verify production works
8. Revoke/delete old secret
9. Document rotation in changelog

## Best Practices

### ✅ DO

- Use `.env.example` for documentation
- Load secrets via `process.env`
- Use GitHub Secrets for CI/CD
- Use AWS Secrets Manager for production
- Rotate secrets regularly
- Use different secrets for staging/production
- Review code for secrets before committing
- Enable push protection on GitHub
- Run local scans with gitleaks
- Report suspected exposures immediately

### ❌ DON'T

- Commit `.env` files
- Hard-code secrets in source code
- Share secrets via email/chat
- Use production secrets in development
- Reuse secrets across environments
- Store secrets in documentation
- Include secrets in code comments
- Share secrets in screenshots
- Use weak/default secrets
- Ignore secret scanning alerts

### Code Examples

#### ❌ Bad - Hard-coded Secret

```typescript
const API_KEY = 'sk_live_51234567890abcdef';

fetch('https://api.example.com', {
  headers: { 'Authorization': `Bearer ${API_KEY}` }
});
```

#### ✅ Good - Environment Variable

```typescript
const API_KEY = process.env.TRACKINGMORE_API_KEY;

if (!API_KEY) {
  throw new Error('TRACKINGMORE_API_KEY not configured');
}

fetch('https://api.example.com', {
  headers: { 'Authorization': `Bearer ${API_KEY}` }
});
```

#### ❌ Bad - Secret in Comment

```typescript
// TODO: Replace with real key: sk_test_1234567890
const API_KEY = process.env.API_KEY;
```

#### ✅ Good - Generic Comment

```typescript
// API key loaded from environment variables
const API_KEY = process.env.API_KEY;
```

### Environment Variable Validation

Always validate critical environment variables at startup:

```typescript
// lib/config.ts
function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.error(`❌ Missing required environment variable: ${key}`);
    process.exit(1);
  }
  return value;
}

export const config = {
  trackingApiKey: getEnv('TRACKINGMORE_API_KEY'),
  databaseUrl: getEnv('DATABASE_URL'),
  sessionSecret: getEnv('SESSION_SECRET'),
};
```

## Incident Response Contacts

- **Security Team:** security@yourcompany.com
- **Team Lead:** +972-52-842-0009
- **GitHub Security:** https://github.com/ELAD-CODE/SHIPPINGT/security

## References

- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Gitleaks Documentation](https://github.com/gitleaks/gitleaks)
- [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)
- [12-Factor App Config](https://12factor.net/config)

---

**Last updated:** 2026-01-22
**Policy owner:** DevOps Team
**Next review:** 2026-07-22
