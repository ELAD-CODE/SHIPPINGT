# GitHub Repository Setup Guide

This document provides recommendations for configuring branch protection rules and required status checks.

## Branch Protection Rules

### Main Branch (`main`)

The `main` branch should be protected with the following rules:

1. Navigate to: **Settings → Branches → Add branch protection rule**
2. Branch name pattern: `main`
3. Configure the following settings:

#### Require Pull Request Reviews
- ✅ **Require a pull request before merging**
  - Required approving reviews: **1**
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  - ✅ Require review from Code Owners (if CODEOWNERS file exists)

#### Require Status Checks
- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  
  **Required status checks:**
  - `🔐 Secret Scanning`
  - `🏗️ Build, Lint & Test`
  - `🛡️ Security Audit`

#### Additional Rules
- ✅ **Require conversation resolution before merging**
- ✅ **Require linear history** (optional, enforces rebase/squash)
- ✅ **Include administrators** (applies rules to admins too)
- ❌ Allow force pushes (keep disabled)
- ❌ Allow deletions (keep disabled)

### Staging Branch (`staging`)

Configure similar but slightly relaxed rules:

1. Branch name pattern: `staging`
2. Settings:
   - Required approving reviews: **1**
   - ✅ Require status checks to pass before merging
   - Required checks: Same as main
   - ❌ Require linear history (allow merge commits)

## Recommended Workflows

### Feature Development

```
feature/my-feature → staging → main
```

1. Create feature branch from `staging`
2. Develop and test locally
3. Open PR to `staging`
4. After merge, test in staging environment
5. Open PR from `staging` to `main` for production release

### Hotfix

```
hotfix/critical-bug → main
```

1. Create hotfix branch from `main`
2. Fix the issue
3. Open PR directly to `main`
4. After merge, backport to `staging`

## CODEOWNERS File

Create a `.github/CODEOWNERS` file to automatically request reviews:

```
# Global owners
* @your-team/developers

# Specific file types
*.yml @your-team/devops
*.md @your-team/tech-writers

# Critical directories
/prisma/ @your-team/database-admins
/.github/ @your-team/devops
/docs/ @your-team/tech-writers

# Security-sensitive files
.env.example @your-team/security
/lib/config.ts @your-team/security
```

## Repository Settings

### General

- ✅ **Automatically delete head branches** (after PR merge)
- ✅ **Allow squash merging** (clean commit history)
- ✅ **Allow auto-merge** (when all checks pass)
- ❌ Allow merge commits (optional, based on preference)
- ❌ Allow rebase merging (optional)

### Actions

- ✅ **Allow all actions and reusable workflows**
- Or: ✅ **Allow actions created by GitHub** + verified creators
- ✅ **Allow GitHub Actions to create and approve pull requests** (for automated updates)

### Secrets

Configure required secrets as documented in [README-actions.md](./README-actions.md)

### Environments

Create the following environments:

1. **staging**
   - Deployment protection rules: None (auto-deploy)
   - Environment secrets: Staging-specific credentials

2. **production**
   - Deployment protection rules: **Required reviewers** (1-2 people)
   - Environment secrets: Production credentials
   - Wait timer: 5 minutes (optional)

## Issue Templates

Create issue templates for better organization:

### `.github/ISSUE_TEMPLATE/bug_report.md`

```markdown
---
name: Bug Report
about: Report a bug or unexpected behavior
labels: bug
---

## Description
Brief description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Observe error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Branch: 
- Browser/Platform:
```

### `.github/ISSUE_TEMPLATE/feature_request.md`

```markdown
---
name: Feature Request
about: Suggest a new feature
labels: enhancement
---

## Feature Description
What feature would you like?

## Use Case
Why is this feature needed?

## Proposed Solution
How should it work?

## Alternatives Considered
Other approaches you've thought about
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

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No secrets committed
- [ ] All status checks passing
- [ ] Reviewed by code owner

## Testing
How was this tested?

## Screenshots
If applicable

## Related Issues
Closes #(issue number)
```

## Labels

Recommended labels for issue management:

| Label | Color | Description |
|-------|-------|-------------|
| `bug` | `#d73a4a` | Something isn't working |
| `enhancement` | `#a2eeef` | New feature request |
| `documentation` | `#0075ca` | Improvements to documentation |
| `security` | `#ee0701` | Security-related issue |
| `performance` | `#fbca04` | Performance improvement |
| `dependencies` | `#0366d6` | Dependency updates |
| `ci/cd` | `#f9d0c4` | CI/CD pipeline changes |
| `wontfix` | `#ffffff` | Not addressing this issue |
| `duplicate` | `#cfd3d7` | Duplicate issue |

## Monitoring & Notifications

### GitHub Actions Notifications

Set up Slack/Discord webhooks for workflow notifications:

1. Go to **Settings → Webhooks**
2. Add webhook URL from your chat platform
3. Select events: **Workflow runs**, **Pull requests**

### Branch Rules Monitoring

Regularly review:
- Failed status check patterns
- Bypassed rules (if any)
- Merge statistics

## Security Settings

### Vulnerability Alerts

- ✅ **Dependabot alerts** - Enable to receive security notifications
- ✅ **Dependabot security updates** - Auto-create PRs for vulnerabilities
- ✅ **Dependabot version updates** - Keep dependencies up to date

Add `.github/dependabot.yml`:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5
    labels:
      - "dependencies"
```

### Code Scanning

- ✅ **CodeQL analysis** - Enable for security scanning
- ✅ **Secret scanning** - GitHub's built-in secret detection
- ✅ **Push protection** - Prevent commits with secrets

## Maintenance

### Quarterly Reviews

Every 3 months:
- [ ] Review and update branch protection rules
- [ ] Audit secret access logs
- [ ] Rotate deployment credentials
- [ ] Update required status checks
- [ ] Review CODEOWNERS accuracy

### Annual Reviews

Every year:
- [ ] Comprehensive security audit
- [ ] Review and update all workflows
- [ ] Update documentation
- [ ] Review team permissions

---

**Last updated:** 2026-01-22
