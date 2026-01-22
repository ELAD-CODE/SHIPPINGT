# Git Secrets Policy

This document outlines the policy and procedures for managing secrets in the codebase to prevent accidental exposure of sensitive information.

## 🎯 Policy Overview

**NEVER** commit secrets, API keys, passwords, or sensitive data to the git repository.

### What Constitutes a Secret?

- API keys and tokens (TrackingMore, Maman, SeaRates, etc.)
- Database credentials and connection strings
- AWS access keys and secret keys
- Session secrets and JWT secrets
- Private keys and certificates
- OAuth client secrets
- Webhook secrets
- Any password or credential

## 🛡️ Prevention Measures

### 1. Use Environment Variables

**Always** store secrets in environment variables, never in code:

```typescript
// ❌ BAD - Never do this
const apiKey = "sk_live_abc123def456...";

// ✅ GOOD - Use environment variables
const apiKey = process.env.TRACKINGMORE_API_KEY;
```

### 2. Use .env Files Locally

- Copy `.env.example` to `.env.local`
- Add real secrets to `.env.local`
- `.env.local` is in `.gitignore` and won't be committed

```bash
# Safe workflow
cp .env.example .env.local
# Edit .env.local with real secrets
# Never commit .env.local
```

### 3. Pre-Commit Checks

The repository uses Gitleaks in CI/CD to scan for secrets. However, you can also run it locally:

```bash
# Install gitleaks
brew install gitleaks  # macOS
# or download from https://github.com/gitleaks/gitleaks/releases

# Scan current changes
gitleaks detect --source . --verbose

# Scan before committing
gitleaks protect --verbose --staged
```

### 4. Git Hooks (Optional)

Add a pre-commit hook to automatically scan for secrets:

```bash
# .git/hooks/pre-commit
#!/bin/bash
gitleaks protect --verbose --staged
if [ $? -eq 1 ]; then
  echo "❌ Gitleaks found secrets in your changes!"
  echo "Please remove them before committing."
  exit 1
fi
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

## 🚨 What to Do If You Committed a Secret

### Step 1: DO NOT PANIC

The secret is exposed, but we can fix it.

### Step 2: Rotate the Secret IMMEDIATELY

1. **Invalidate the compromised secret**:
   - API keys: Regenerate in provider dashboard (TrackingMore, AWS, etc.)
   - Database passwords: Change password immediately
   - Session secrets: Generate new random value

2. **Update the new secret**:
   - Update in GitHub Secrets
   - Update in production environment
   - Update in `.env.local` for local development

### Step 3: Remove from Git History

#### Option A: Using git-filter-repo (Recommended)

```bash
# Install git-filter-repo
pip install git-filter-repo

# Create backup branch
git branch backup-before-secret-removal

# Remove file completely
git filter-repo --invert-paths --path config/secrets.json

# Or remove specific text pattern
git filter-repo --replace-text <(echo "sk_live_abc123def456==>REMOVED")

# Force push (WARNING: Requires coordination with team)
git push origin --force --all
git push origin --force --tags
```

#### Option B: Using BFG Repo-Cleaner

```bash
# Download BFG
wget https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar

# Remove secrets by pattern
java -jar bfg-1.14.0.jar \
  --replace-text passwords.txt \
  your-repo.git

# Clean up
cd your-repo.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push origin --force --all
```

#### Option C: Rewrite Recent Commits (If Just Committed)

```bash
# If secret is in the last commit
git reset --soft HEAD~1
# Remove the secret from files
# Commit again
git commit -m "Your commit message"

# If already pushed
git push --force origin your-branch

# For multiple commits
git rebase -i HEAD~5  # Adjust number as needed
# Mark commits with 'edit', remove secrets, continue rebase
```

### Step 4: Verify Removal

```bash
# Scan entire history
gitleaks detect --source . --verbose --log-opts="--all"

# Check specific file history
git log --all --full-history -- path/to/file
```

### Step 5: Notify the Team

1. Send message to team: "Secret X was committed and removed, rotated to Y"
2. Everyone needs to re-clone or reset their local repos:
   ```bash
   git fetch origin
   git reset --hard origin/main
   ```

## 📋 Secret Rotation Schedule

### Regular Rotation (Every 90 Days)

- [ ] TrackingMore API key
- [ ] Maman API credentials
- [ ] AWS access keys
- [ ] Session secrets
- [ ] JWT secrets
- [ ] Database passwords (staging/production)

### Immediate Rotation Required

- When a team member leaves
- When a secret is accidentally committed
- When there's suspicion of compromise
- After a security incident

## 🔍 Scanning Tools

### Gitleaks Configuration

Create `.gitleaks.toml` in repository root:

```toml
title = "Gitleaks Configuration"

[[rules]]
id = "aws-access-key"
description = "AWS Access Key"
regex = '''(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}'''

[[rules]]
id = "generic-api-key"
description = "Generic API Key"
regex = '''(?i)(api[_-]?key|apikey)(['"]\s*[:=]\s*['"]|['\s]*[:=]\s*)[a-zA-Z0-9_\-]{20,}'''

[[rules]]
id = "database-url"
description = "Database Connection String"
regex = '''postgres(ql)?://[a-zA-Z0-9_\-]+:[a-zA-Z0-9_\-]+@[a-zA-Z0-9\.\-]+:\d+/[a-zA-Z0-9_\-]+'''
```

### Allowlist (False Positives)

Create `.gitleaksignore`:

```
# Ignore test fixtures
tests/fixtures/*
**/test-data/**

# Ignore specific commits (by SHA)
abc123def456789

# Ignore specific findings
secret:AWS Access Key:src/example.ts:23
```

## 📚 Best Practices

### DO

✅ Use environment variables for all secrets
✅ Use `.env.example` with placeholder values
✅ Store production secrets in AWS Secrets Manager or GitHub Secrets
✅ Use different secrets for development, staging, and production
✅ Rotate secrets regularly
✅ Scan repositories before pushing
✅ Review pull requests for secrets
✅ Use strong, random secrets (minimum 32 characters)

### DON'T

❌ Commit secrets to git
❌ Put secrets in code comments
❌ Store secrets in configuration files in the repo
❌ Share secrets via email or chat
❌ Use weak or predictable secrets
❌ Reuse secrets across environments
❌ Keep compromised secrets active

## 🔐 Generating Secure Secrets

### Using OpenSSL

```bash
# Generate 32-byte random secret (base64)
openssl rand -base64 32

# Generate 64-byte random secret (hex)
openssl rand -hex 64
```

### Using Node.js

```javascript
// Generate random secret
const crypto = require('crypto');
const secret = crypto.randomBytes(32).toString('base64');
console.log(secret);
```

### Using Python

```python
import secrets
secret = secrets.token_urlsafe(32)
print(secret)
```

## 📞 Incident Response

### If You Discover a Secret in the Repo

1. **Report immediately** to DevOps/Security team
2. **Do not** share the secret further
3. **Do not** use the secret
4. **Wait** for instructions on rotation and removal

### Contact

- **Security Team**: security@company.com
- **DevOps Lead**: devops@company.com
- **Emergency**: Use secure communication channel

## 📄 Compliance

This policy aligns with:
- OWASP Top 10 (A02:2021 – Cryptographic Failures)
- CIS AWS Foundations Benchmark
- SOC 2 Type II requirements
- GDPR data protection requirements

## 📚 Resources

- [Gitleaks Documentation](https://github.com/gitleaks/gitleaks)
- [Git Filter-Repo Guide](https://github.com/newren/git-filter-repo)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)

---

**Last Updated**: 2026-01-22  
**Policy Owner**: DevOps Team  
**Review Schedule**: Quarterly
