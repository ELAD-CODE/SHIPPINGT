```markdown
# Git Secrets Policy & Remediation

- Never commit secrets to the repository.
- Use `.env.example` for variable names only.
- Add GitHub Secrets in repository Settings -> Secrets.

If a secret is found in the repo:
1. Rotate (revoke) the secret immediately at the provider.
2. Remove the secret from the repo history manually:
   - Use `git filter-repo` or `bfg` following internal ops policy.
   - Coordinate with stakeholders; this is a destructive operation.
3. After history rewrite, force-push corrected branches and inform team to re-clone.

Automated detection:
- CI runs gitleaks and will block merges if potential secrets are detected.
```