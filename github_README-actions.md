```markdown
# GitHub Actions - Setup

Required repository secrets:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_REGION
- S3_BUCKET
- DATABASE_URL
- SESSION_SECRET
- TRACKINGMORE_API_KEY
- MAMAN_USERNAME
- MAMAN_PASSWORD

Add these under Settings -> Secrets -> Actions.

The CI workflow runs gitleaks; any detected secret will fail the job.
```