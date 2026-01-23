# GitHub Repository Setup

This guide explains how to configure GitHub settings, secrets, and permissions for the Shipment Tracking Israel project.

## Table of Contents

- [Initial Setup](#initial-setup)
- [Branch Protection](#branch-protection)
- [GitHub Secrets](#github-secrets)
- [Environments](#environments)
- [Security Settings](#security-settings)
- [Team Permissions](#team-permissions)

## Initial Setup

### 1. Repository Settings

Go to **Settings** and configure:

#### General
- ✅ Default branch: `main`
- ✅ Allow merge commits
- ✅ Allow squash merging
- ✅ Allow rebase merging
- ✅ Automatically delete head branches

#### Features
- ✅ Issues
- ✅ Projects
- ✅ Wiki (optional)
- ❌ Discussions (optional)

#### Pull Requests
- ✅ Allow squash merging
- ✅ Default to pull request title
- ✅ Always suggest updating pull request branches
- ✅ Allow auto-merge
- ✅ Automatically delete head branches after merge

### 2. Code Security and Analysis

Go to **Settings → Code security and analysis**:

#### Dependency graph
- ✅ Enable Dependency graph

#### Dependabot
- ✅ Enable Dependabot alerts
- ✅ Enable Dependabot security updates
- ✅ Enable Dependabot version updates (optional)

#### Code scanning
- ✅ Enable CodeQL analysis (via Actions)

#### Secret scanning
- ✅ Enable secret scanning
- ✅ Enable push protection (prevents pushing secrets)

### 3. Actions Settings

Go to **Settings → Actions → General**:

#### Actions permissions
- ✅ Allow all actions and reusable workflows

#### Workflow permissions
- ✅ Read and write permissions
- ✅ Allow GitHub Actions to create and approve pull requests

#### Artifact and log retention
- Set to: **90 days**

## Branch Protection

### Protect Main Branch

Go to **Settings → Branches → Add rule**

**Branch name pattern:** `main`

#### Protection Rules

**Require pull request reviews before merging**
- ✅ Enable
- Required approvals: `1`
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require review from Code Owners (optional)

**Require status checks to pass before merging**
- ✅ Enable
- ✅ Require branches to be up to date before merging
- Required checks:
  - ✅ `secret-scan` (Gitleaks)
  - ✅ `lint` (ESLint)
  - ✅ `build` (Next.js build)
  - ✅ `test` (Jest tests)

**Require conversation resolution before merging**
- ✅ Enable

**Require signed commits** (optional but recommended)
- ✅ Enable

**Require linear history**
- ✅ Enable (optional - prevents merge commits)

**Include administrators**
- ✅ Enable (admins must follow rules too)

**Restrict who can push to matching branches**
- ❌ Disable (or restrict to specific teams)

**Allow force pushes**
- ❌ Disable

**Allow deletions**
- ❌ Disable

### Protect Develop Branch (if using)

**Branch name pattern:** `develop`

Use similar rules as main, but:
- Required approvals: `1` (can be same as main)
- Allow more flexibility for active development

## GitHub Secrets

Go to **Settings → Secrets and variables → Actions**

### Required Secrets

Click **New repository secret** for each:

#### Database
```
Name: DATABASE_URL
Secret: postgresql://user:password@host:5432/database
```

#### APIs
```
Name: TRACKINGMORE_API_KEY
Secret: tm_xxxxxxxxxxxxxxxxxx
```

```
Name: MAMAN_USERNAME
Secret: your_maman_username
```

```
Name: MAMAN_PASSWORD
Secret: your_maman_password
```

#### Security
```
Name: SESSION_SECRET
Secret: (generate with: openssl rand -base64 32)
```

#### AWS (for deployments)
```
Name: AWS_ACCESS_KEY_ID
Secret: AKIAIOSFODNN7EXAMPLE
```

```
Name: AWS_SECRET_ACCESS_KEY
Secret: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

```
Name: AWS_REGION
Secret: us-east-1
```

```
Name: S3_BUCKET
Secret: shipment-tracking-prod
```

### Verify Secrets

After adding, verify they're listed (values are hidden):

```
✅ DATABASE_URL
✅ TRACKINGMORE_API_KEY
✅ MAMAN_USERNAME
✅ MAMAN_PASSWORD
✅ SESSION_SECRET
✅ AWS_ACCESS_KEY_ID
✅ AWS_SECRET_ACCESS_KEY
✅ AWS_REGION
✅ S3_BUCKET
```

### Using GitHub CLI

Alternatively, use GitHub CLI to add secrets:

```bash
# Install and authenticate
brew install gh
gh auth login

# Add secrets
gh secret set DATABASE_URL
# (paste value and press Ctrl+D)

gh secret set TRACKINGMORE_API_KEY
gh secret set SESSION_SECRET
gh secret set AWS_ACCESS_KEY_ID
gh secret set AWS_SECRET_ACCESS_KEY
gh secret set AWS_REGION
gh secret set S3_BUCKET
gh secret set MAMAN_USERNAME
gh secret set MAMAN_PASSWORD

# List secrets (values hidden)
gh secret list
```

## Environments

Create deployment environments for better control.

Go to **Settings → Environments**

### Create Staging Environment

**Name:** `staging`

**Protection rules:**
- ❌ Required reviewers (staging can auto-deploy)
- ✅ Wait timer: 0 minutes
- Deployment branches: `develop`, `TRACK-AI`

**Environment secrets:** (if different from main)
```
DATABASE_URL_STAGING
AWS_S3_BUCKET_STAGING
```

**Environment variables:**
```
DEPLOYMENT_ENV=staging
API_BASE_URL=https://api-staging.example.com
```

### Create Production Environment

**Name:** `production`

**Protection rules:**
- ✅ Required reviewers: Select 1-2 reviewers
- ✅ Wait timer: 5 minutes (gives time to cancel)
- Deployment branches: `main` only

**Environment secrets:** (production values)
```
DATABASE_URL_PROD
AWS_S3_BUCKET_PROD
```

**Environment variables:**
```
DEPLOYMENT_ENV=production
API_BASE_URL=https://api.example.com
```

## Security Settings

### Enable Security Features

#### 1. Two-Factor Authentication

**Require 2FA for organization** (if organization):
- Go to **Organization Settings → Authentication security**
- ✅ Require two-factor authentication

#### 2. Verified Domains

**Add your domain**:
- Go to **Organization Settings → Verified domains**
- Add: `example.com`
- Verify via DNS

#### 3. Security Advisories

**Enable private security advisories**:
- Allows reporting vulnerabilities privately
- Go to **Settings → Security** (repository level)

#### 4. Dependency Review

**Enable dependency review**:
- Automatically reviews PR dependencies
- Enabled via GitHub Actions (see workflow)

## Team Permissions

### Organization Teams (if applicable)

Create teams with specific permissions:

#### Admin Team
- **Permission:** Admin
- **Members:** Lead developers, DevOps
- **Access:** All repositories

#### Developers Team
- **Permission:** Write
- **Members:** All developers
- **Access:** Development repositories

#### Reviewers Team
- **Permission:** Triage
- **Members:** Senior developers
- **Access:** Review PRs, manage issues

#### External Contributors
- **Permission:** Read
- **Access:** Public repositories only

### Repository Collaborators

Go to **Settings → Collaborators**

Add individual users:
- **Admin:** Full access (repository owner)
- **Write:** Push access, cannot change settings
- **Read:** View only access

## CODEOWNERS File

Create `.github/CODEOWNERS` to auto-assign reviewers:

```
# Global owners (review all PRs)
* @team-leads

# Backend code
/app/api/** @backend-team
/config/** @devops-team
/prisma/** @database-team

# Frontend code
/app/components/** @frontend-team
/app/page.tsx @frontend-team

# Infrastructure
/.github/workflows/** @devops-team
/docs/** @documentation-team

# Critical files require multiple approvals
package.json @team-leads @devops-team
prisma/schema.prisma @database-team @backend-team
```

## Notifications

Configure notification preferences:

### Email Notifications

**Settings → Notifications → Email**
- ✅ Pull Requests
- ✅ Issues
- ✅ Actions workflow runs
- ✅ Security alerts

### Slack/Discord Integration

1. Install GitHub app in Slack/Discord
2. Configure notifications:
   ```
   /github subscribe owner/repo
   /github subscribe owner/repo reviews comments
   ```

## Webhooks (Optional)

Go to **Settings → Webhooks** to integrate with external services:

### Example: Deployment Notification

**Payload URL:** `https://api.example.com/webhooks/github`

**Events:**
- ✅ Push events
- ✅ Pull request events
- ✅ Deployment events
- ✅ Deployment status events

## Repository Labels

Create standard labels for issues/PRs:

### Type
- `bug` - Something isn't working
- `feature` - New feature request
- `enhancement` - Improve existing feature
- `documentation` - Documentation updates
- `security` - Security issue

### Priority
- `priority: high` - Urgent
- `priority: medium` - Normal
- `priority: low` - Can wait

### Status
- `status: in progress` - Currently being worked on
- `status: blocked` - Blocked by dependency
- `status: review needed` - Ready for review

### Area
- `area: frontend` - UI/UX changes
- `area: backend` - API/server changes
- `area: database` - Schema changes
- `area: ci/cd` - Pipeline changes

## Issue Templates

Create `.github/ISSUE_TEMPLATE/`:

### Bug Report
```yaml
name: Bug Report
about: Report a bug
labels: bug
---

**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. iOS]
- Browser [e.g. chrome, safari]
- Version [e.g. 22]
```

### Feature Request
```yaml
name: Feature Request
about: Suggest a new feature
labels: feature
---

**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
What you want to happen.

**Additional context**
Any other context or screenshots.
```

## Pull Request Template

Create `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests
- [ ] Updated documentation

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Commented complex code
- [ ] Updated documentation
- [ ] No new warnings
- [ ] Added tests
- [ ] Tests pass
- [ ] Changes don't break existing functionality

## Related Issues
Closes #123
```

## Verification Checklist

After setup, verify:

- [ ] Branch protection enabled on `main`
- [ ] All required secrets added
- [ ] Environments configured (staging, production)
- [ ] Security features enabled
- [ ] Actions workflow runs successfully
- [ ] Gitleaks scanning working
- [ ] Team permissions set correctly
- [ ] CODEOWNERS file created
- [ ] Issue/PR templates created
- [ ] Notifications configured

## Troubleshooting

### Secrets Not Working

1. Check secret names match exactly (case-sensitive)
2. Verify secrets are in correct scope (repository vs environment)
3. Check workflow has permission to access secrets

### Branch Protection Conflicts

1. Ensure status check names match workflow job names
2. Run workflow once to populate available checks
3. Update protection rules after checks appear

### Actions Permission Denied

1. Go to **Settings → Actions → General**
2. Check **Workflow permissions**
3. Enable **Read and write permissions**

## Support

For GitHub setup questions:
- GitHub Docs: https://docs.github.com
- GitHub Support: https://support.github.com
- DevOps Team: devops@example.com

---

**Last Updated:** 2026-01-22
