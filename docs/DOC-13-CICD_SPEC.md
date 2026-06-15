# DOC-13: CI/CD Specification
**Status:** Draft  
**Owner:** DevOps/Infra Team  
**Last Updated:** 2026-06-15  
**Depends On:** DOC-10, DOC-11  

## 1. Branching Strategy
- `main`: Reflects production environment.
- `staging`: Reflects staging environment.
- `feature/*`: Short-lived feature branches.

## 2. GitHub Actions Workflows
Located in `.github/workflows/`:
- **backend-ci.yml**: Triggered on push to any branch. Lints (Ruff), formats (Black), type checks (Mypy), and runs Pytest. Builds Docker image if branch is `staging` or `main`.
- **frontend-ci.yml**: Runs ESLint, Vitest, and checks TS build.
- **backend-deploy-staging.yml**: Auto-triggered when `backend-ci.yml` passes on `staging`. Updates ECS Task definition and forces redeployment.
- **backend-deploy-prod.yml**: Triggered via `workflow_dispatch` on `main`. Requires manual approval gate.
- **frontend-deploy-staging.yml**: Auto-syncs Vite build to staging S3 bucket and invalidates CloudFront.
