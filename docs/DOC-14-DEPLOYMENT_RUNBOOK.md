# DOC-14: Deployment Runbook
**Status:** Draft  
**Owner:** DevOps/Infra Team  

## 1. Environment Bootstrap (One-time)
1. Configure AWS credentials locally.
2. Initialize Terraform state in S3.
3. Apply `infra/environments/staging` via Terraform.
4. Manually run initial Alembic migrations to setup DB.
5. Create Cognito User Pools.
6. Store DB and JWT secrets in AWS Secrets Manager.

## 2. Standard Deployment
- Development is merged into `staging`.
- GitHub Actions automatically builds and deploys to the staging ECS and S3 environments.
- QA sign-off triggers a manual `workflow_dispatch` approval gate for the `main` branch to push identical artifacts to Production.

## 3. Database Migration Deployment
- ECS deployment pipeline includes a pre-deploy one-off Fargate task overriding the command to `alembic upgrade head`. The main API deployment only proceeds if this exits `0`.
