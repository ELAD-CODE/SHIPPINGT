# GitHub Repository Setup Guide

This guide helps you configure branch protection rules, code reviews, and security settings for the Shipment Tracking Israel repository.

## 🎯 Repository Configuration Overview

Best practices for a secure, collaborative development workflow.

## 🔒 Branch Protection Rules

### Protecting the `main` Branch

Go to: **Settings → Branches → Add branch protection rule**

#### Rule Configuration for `main`

**Branch name pattern**: `main`

Enable these protections:

- ✅ **Require a pull request before merging**
  - ✅ Require approvals: **1** (or 2 for critical projects)
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  - ✅ Require review from Code Owners (if using CODEOWNERS file)

- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - Required checks:
    - `🔒 Scan for Secrets`
    - `🧪 Lint & Test`
    - `🏗️ Build Application`

- ✅ **Require conversation resolution before merging**

- ✅ **Require signed commits** (Optional but recommended)

- ✅ **Require linear history** (Optional - prevents merge commits)

- ✅ **Include administrators** (Apply rules to admins too)

- ✅ **Restrict who can push to matching branches**
  - Add: DevOps team, Senior developers

- ✅ **Allow force pushes**: ❌ Disabled
- ✅ **Allow deletions**: ❌ Disabled

### Protecting the `staging` Branch

**Branch name pattern**: `staging`

Similar to `main`, but with relaxed rules:

- ✅ Require pull request reviews: **1 approval**
- ✅ Require status checks to pass
- ❌ Do not require linear history
- ✅ Allow force pushes: Only for specific users (for emergency hotfixes)

### Protecting `feature/*` Branches

**Branch name pattern**: `feature/*`

- ✅ Require status checks to pass (Gitleaks, tests, lint)
- ❌ Do not require pull request reviews (optional)

## 👥 Code Owners

Create `.github/CODEOWNERS` file:

```
# Global owners
* @your-username @team-lead

# Infrastructure and CI/CD
.github/ @devops-team
docs/ @devops-team @tech-writer

# API routes
/app/api/ @backend-team @api-lead

# Frontend components
/app/components/ @frontend-team

# Database schema
/prisma/ @database-admin @backend-lead

# Security configurations
.env.example @security-team
lib/config.ts @security-team @devops-team
```

## 🔐 Security Settings

Go to: **Settings → Security**

### Enable Security Features

- ✅ **Dependency graph**
- ✅ **Dependabot alerts**
- ✅ **Dependabot security updates**
- ✅ **Dependabot version updates** (optional)
- ✅ **Code scanning** (GitHub Advanced Security)
- ✅ **Secret scanning** (Automatic for public repos, enable for private)

### Dependabot Configuration

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  # npm dependencies
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "devops-team"
    labels:
      - "dependencies"
      - "automated"

  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    reviewers:
      - "devops-team"
```

## 🏷️ Labels Configuration

Create these labels for better organization:

### Priority Labels
- `priority: critical` (🔴 Red)
- `priority: high` (🟠 Orange)
- `priority: medium` (🟡 Yellow)
- `priority: low` (🟢 Green)

### Type Labels
- `type: bug` (🐛 Bug)
- `type: feature` (✨ Feature)
- `type: security` (🔒 Security)
- `type: documentation` (📚 Docs)
- `type: refactor` (♻️ Refactor)

### Status Labels
- `status: in-progress` (Working on it)
- `status: blocked` (Blocked)
- `status: needs-review` (Awaiting review)
- `status: needs-testing` (Needs QA)

### Other Labels
- `dependencies` (Automated dependency updates)
- `good first issue` (For new contributors)
- `help wanted` (Need assistance)

## 📋 Pull Request Template

Create `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Description
<!-- Describe your changes in detail -->

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Security fix

## Related Issue
<!-- Link to issue: Fixes #123 -->

## Testing
<!-- Describe the tests you ran and how to reproduce -->

- [ ] Unit tests pass (`npm test`)
- [ ] Linter passes (`npm run lint`)
- [ ] Build successful (`npm run build`)
- [ ] Tested locally
- [ ] Tested in staging environment

## Security Checklist
- [ ] No secrets committed
- [ ] Gitleaks scan passed
- [ ] Dependencies checked for vulnerabilities
- [ ] Input validation added where needed
- [ ] Authentication/authorization verified

## Screenshots (if applicable)
<!-- Add screenshots for UI changes -->

## Deployment Notes
<!-- Any special deployment considerations? -->

- [ ] Database migrations needed
- [ ] Environment variables changed
- [ ] Cache clearing required
- [ ] Documentation updated

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

## 🤝 Issue Templates

Create `.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: 'type: bug'
assignees: ''
---

## Bug Description
<!-- A clear and concise description of what the bug is -->

## To Reproduce
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
<!-- What you expected to happen -->

## Actual Behavior
<!-- What actually happened -->

## Screenshots
<!-- If applicable, add screenshots -->

## Environment
- Browser: [e.g., Chrome, Safari]
- OS: [e.g., iOS, Windows, Linux]
- Version: [e.g., 22]

## Additional Context
<!-- Add any other context about the problem here -->
```

Create `.github/ISSUE_TEMPLATE/feature_request.md`:

```markdown
---
name: Feature Request
about: Suggest an idea for this project
title: '[FEATURE] '
labels: 'type: feature'
assignees: ''
---

## Feature Description
<!-- Clear and concise description of the feature -->

## Problem it Solves
<!-- What problem does this feature solve? -->

## Proposed Solution
<!-- How should this feature work? -->

## Alternatives Considered
<!-- What alternative solutions have you considered? -->

## Additional Context
<!-- Add any other context or screenshots -->
```

## 🔄 Branch Naming Convention

Standardize branch names:

```
feature/  - New features (feature/add-sea-tracking)
bugfix/   - Bug fixes (bugfix/fix-date-parsing)
hotfix/   - Urgent production fixes (hotfix/security-patch)
docs/     - Documentation (docs/update-readme)
refactor/ - Code refactoring (refactor/api-structure)
test/     - Test additions (test/add-unit-tests)
```

## 📊 Webhooks (Optional)

Configure webhooks for integration with external services:

Go to: **Settings → Webhooks → Add webhook**

### Slack Integration

- Payload URL: Your Slack webhook URL
- Content type: `application/json`
- Events: Push, Pull request, Issues, Workflow run

### Discord Integration

- Payload URL: Your Discord webhook URL
- Append `/github` to the Discord webhook URL

## 🔑 Deploy Keys and Tokens

### Deploy Keys (Read-only access)

For CI/CD servers that need to clone the repo:

1. Generate SSH key:
   ```bash
   ssh-keygen -t ed25519 -C "ci-server@shipment-tracking"
   ```

2. Add public key: **Settings → Deploy keys → Add deploy key**

### Personal Access Tokens

For API access, use fine-grained tokens:

1. Go to your **GitHub Settings (not repo) → Developer settings → Personal access tokens → Fine-grained tokens**
2. Create token with minimal permissions needed
3. Set expiration date (max 1 year)

## 🎯 Required Secrets

Ensure these secrets are configured:

**Settings → Secrets and variables → Actions**

Required secrets:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `STAGING_DATABASE_URL`
- `PRODUCTION_DATABASE_URL`

See `.github/README-actions.md` for complete list.

## 📅 Maintenance Schedule

### Weekly
- [ ] Review open pull requests
- [ ] Review Dependabot alerts
- [ ] Check CI/CD pipeline health

### Monthly
- [ ] Review and update branch protection rules
- [ ] Audit access permissions
- [ ] Review secret expiration dates
- [ ] Update documentation

### Quarterly
- [ ] Rotate all secrets
- [ ] Security audit
- [ ] Review and archive old branches
- [ ] Update team access levels

## 📞 Support

For repository setup issues:
- Contact DevOps team
- Check GitHub's documentation
- Open an internal issue

## 📚 Additional Resources

- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [Code Owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [Dependabot](https://docs.github.com/en/code-security/dependabot)
- [GitHub Advanced Security](https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security)
