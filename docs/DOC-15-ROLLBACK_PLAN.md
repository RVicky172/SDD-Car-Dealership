# DOC-15: Rollback Plan
**Status:** Draft  
**Owner:** DevOps/Infra Team  

## 1. Backend API Rollback
If a newly deployed ECS Task exhibits >1% 5xx errors:
1. Re-run the deployment workflow in GitHub Actions specifying the previous known-good Git SHA image tag.
2. ECS will perform a rolling update back to the stable container.

## 2. Frontend SPA Rollback
Since S3 hosting is used with CloudFront:
1. GitHub Actions stores previous `dist/` builds with SHA tags in the S3 bucket prior to overwriting.
2. Rollback script copies the old SHA folder contents back to the root of the S3 bucket.
3. Invalidate CloudFront `/*`.

## 3. Database Rollback
If a DB migration corrupts state:
1. Run `alembic downgrade -1` via emergency one-off ECS task.
2. Rollback backend API version to match schema.
