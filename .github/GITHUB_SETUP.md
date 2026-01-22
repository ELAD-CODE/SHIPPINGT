# GitHub Repository Setup Guide

Complete guide for setting up branch protection, required status checks, and repository configuration.

## Table of Contents

1. [Branch Protection Rules](#branch-protection-rules)
2. [Required Status Checks](#required-status-checks)
3. [Auto-Merge Configuration](#auto-merge-configuration)
4. [Code Review Requirements](#code-review-requirements)
5. [Security Settings](#security-settings)

---

## Branch Protection Rules

### For `main` Branch (Production)

Navigate to: **Settings** → **Branches** → **Add branch protection rule**

#### Basic Settings
- **Branch name pattern:** `main`

#### Protection Rules

✅ **Require a pull request before merging**
- Require approvals: `1` (recommended: 2 for production)
- Dismiss stale pull request approvals when new commits are pushed: ✅
- Require review from Code Owners: ✅ (if CODEOWNERS file exists)

✅ **Require status checks to pass before merging**
- Require branches to be up to date before merging: ✅
- Status checks that are required:
  - `🔐 Secret Scanning`
  - `🏗️ Build & Test`
  - `✅ Status Check`

✅ **Require conversation resolution before merging**
- All conversations must be resolved: ✅

✅ **Require signed commits** (Optional but recommended)

✅ **Require linear history** (Optional - prevents merge commits)

✅ **Include administrators**
- Enforce all configured restrictions for administrators: ✅

❌ **Allow force pushes** (Keep disabled for main)

❌ **Allow deletions** (Keep disabled for main)

### For `staging` Branch (Pre-production)

Same settings as `main`, but you may adjust:
- Require approvals: `1` (can be lower than production)
- Can allow force pushes if needed for hotfixes

### For `development` Branch

More relaxed settings for active development:
- Require approvals: `0` (or 1)
- Require status checks: ✅ (but don't require up-to-date)
- Allow force pushes: Can be enabled if team agrees

---

## Required Status Checks

### Configuring Status Checks

After first workflow run, status checks will appear in branch protection settings.

**Required checks for `main` branch:**

1. **🔐 Secret Scanning** (`secret-scanning`)
   - Purpose: Prevents committing secrets/credentials
   - Blocks merge if: Secrets are detected by Gitleaks
   - Fix: Remove secrets, use environment variables

2. **🏗️ Build & Test** (`build-and-test`)
   - Purpose: Ensures code builds and tests pass
   - Blocks merge if: Build fails, tests fail, or linting errors
   - Fix: Fix code issues, update tests

3. **✅ Status Check** (`status-check`)
   - Purpose: Summary check that all jobs passed
   - Blocks merge if: Any required job failed
   - Fix: Address failures in other checks

### Status Check Best Practices

- ✅ Always require status checks on protected branches
- ✅ Require branches to be up-to-date (prevents conflicts)
- ✅ Don't allow bypassing checks, even for admins
- ✅ Monitor check execution time and optimize if slow

---

## Auto-Merge Configuration

### Enable Auto-Merge on Repository

**Settings** → **General** → **Pull Requests**

Enable:
- ✅ Allow auto-merge
- ✅ Automatically delete head branches

### Using Auto-Merge

#### Via GitHub UI

1. Create pull request
2. After approval and checks pass, click **Enable auto-merge**
3. Select merge method: **Squash and merge** (recommended)
4. PR will merge automatically when all checks pass

#### Via GitHub CLI

```bash
# Create PR with auto-merge
gh pr create \
  --title "feat: add new feature" \
  --body "Description" \
  --base main \
  --head feature-branch

# Enable auto-merge
gh pr merge --auto --squash
```

#### Via API

```bash
# Enable auto-merge via API
curl -X PUT \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/OWNER/REPO/pulls/PR_NUMBER/merge \
  -d '{"merge_method":"squash"}'
```

### Auto-Merge Best Practices

- ✅ Use with required approvals and status checks
- ✅ Set clear merge commit messages
- ✅ Enable automatic branch deletion
- ⚠️ Watch for conflicts - auto-merge will fail if conflicts exist

---

## Code Review Requirements

### CODEOWNERS File

Create `.github/CODEOWNERS` to automatically request reviews:

```
# Repository CODEOWNERS

# Default owners for everything
*       @team-lead

# Infrastructure and CI/CD
/.github/           @devops-team
/docs/              @tech-writers

# Backend code
/app/api/           @backend-team
/prisma/            @backend-team @database-admin

# Security-sensitive files
/.env.example       @security-team
/lib/config.ts      @security-team
```

### Review Guidelines

**For Contributors:**
- ✅ Keep PRs small and focused (< 400 lines)
- ✅ Write clear descriptions and link to issues
- ✅ Ensure all checks pass before requesting review
- ✅ Respond to review comments promptly
- ✅ Update PR based on feedback

**For Reviewers:**
- ✅ Review within 24 hours
- ✅ Check code quality, security, and best practices
- ✅ Test changes locally if significant
- ✅ Approve only when satisfied
- ✅ Use "Request changes" if issues found

---

## Security Settings

### Repository Security Features

**Settings** → **Security & analysis**

Enable all:
- ✅ Dependency graph
- ✅ Dependabot alerts
- ✅ Dependabot security updates
- ✅ Secret scanning
- ✅ Code scanning (CodeQL)

### Secret Scanning

**Settings** → **Security & analysis** → **Secret scanning**

- Enable secret scanning alerts: ✅
- Push protection: ✅ (blocks pushes with secrets)

### Security Policy

Create `.github/SECURITY.md`:

```markdown
# Security Policy

## Reporting a Vulnerability

Email: security@shipmenttracking.net

Please do not open public issues for security vulnerabilities.

## Response Time

We aim to respond to security reports within 48 hours.
```

---

## Repository Labels

### Recommended Labels

Navigate to: **Issues** → **Labels** → **New label**

**Priority:**
- 🔴 `priority: critical` - Urgent, blocks functionality
- 🟠 `priority: high` - Important, should be done soon
- 🟡 `priority: medium` - Normal priority
- 🟢 `priority: low` - Nice to have

**Type:**
- 🐛 `bug` - Something isn't working
- ✨ `enhancement` - New feature or request
- 📝 `documentation` - Documentation improvements
- 🔒 `security` - Security-related changes
- 🚀 `deployment` - Deployment-related
- 🧹 `refactor` - Code refactoring

**Status:**
- 🏗️ `in progress` - Currently being worked on
- 👀 `needs review` - Awaiting review
- ⏸️ `blocked` - Blocked by dependency
- ✅ `ready to merge` - Approved and ready

---

## Notifications

### Configure Notifications

**Settings** → **Notifications**

Recommended settings:
- Watch: All activity on critical branches
- Email: Important discussions and mentions
- Slack: Integrate with team Slack for PR notifications

### Slack Integration

1. Install GitHub app in Slack
2. Configure notifications:
   ```
   /github subscribe OWNER/REPO reviews comments
   /github subscribe OWNER/REPO deployments
   ```

---

## Best Practices Summary

### Do's ✅

- Enable branch protection on all important branches
- Require status checks and reviews before merging
- Use auto-merge for efficiency
- Monitor security alerts and act quickly
- Keep dependencies up to date
- Document code review process
- Use meaningful commit messages

### Don'ts ❌

- Don't allow direct pushes to main/staging
- Don't bypass required checks
- Don't merge without review (except trivial changes)
- Don't commit secrets to repository
- Don't ignore security alerts
- Don't merge with failing tests

---

## Troubleshooting

### Cannot merge PR

**Issue:** Status checks required, but not present
**Fix:** 
1. Push a commit to trigger checks
2. Check workflow is enabled in Actions tab
3. Verify workflow triggers on correct events

### Auto-merge not working

**Issue:** Auto-merge enabled but PR not merging
**Fix:**
1. Check all required reviews are approved
2. Verify all status checks passed
3. Ensure branch is up to date
4. Check for merge conflicts

### Status check always failing

**Issue:** Specific check always fails
**Fix:**
1. Review check logs in Actions tab
2. Ensure GitHub Secrets are correctly configured
3. Check `.env.example` exists
4. Verify test environment variables are set

---

## Additional Resources

- [GitHub Branch Protection Docs](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Gitleaks Documentation](https://github.com/gitleaks/gitleaks)
- Project Docs:
  - `docs/DEPLOYMENT.md` - Deployment instructions
  - `docs/GIT_SECRETS_POLICY.md` - Secret management
  - `.github/README-actions.md` - GitHub Actions setup

---

**Last Updated:** January 2026
