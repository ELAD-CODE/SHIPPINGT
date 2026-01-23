```markdown
# Deployment guide (AWS)

1. Prerequisites
   - GitHub Secrets: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET, DATABASE_URL, SESSION_SECRET, TRACKINGMORE_API_KEY, MAMAN_USERNAME
   - Ensure IAM key has minimal required permissions for S3/EB/ECS deployments.

2. Staging deploy
   - Push to `staging` branch triggers CI build and deploy to staging S3/EB as configured.

3. Production deploy
   - Protect `main` branch: require PR review and required checks.
   - After PR passes checks and review, merge to `main` and run production deploy manually or via controlled workflow.

4. DB migration
   - Backup DB manually before running migrations.
   - Run migrations using your migration tool (example with psql):
     - pg_dump -Fc $DATABASE_URL > /backups/db-pre-migration.dump
     - Run migration script in `backend/migrations/`
```