# 🚗 Car Dealer Website

This is a full-stack Car Dealer platform monorepo, developed using a Spec-Driven Development (SDD) methodology.

## Tech Stack
- **Backend**: Python 3.12, FastAPI, SQLAlchemy 2.0, PostgreSQL, Celery, Redis
- **Frontend**: TypeScript, React 18, Vite, Tailwind CSS v3, React Query, Zustand, shadcn/ui
- **Infrastructure**: Terraform, AWS (ECS Fargate, ECR, RDS, ElastiCache, S3, CloudFront, Cognito, SES)
- **CI/CD**: GitHub Actions

## Spec-Driven Development (SDD)
Every line of code is justified by a document. The workflow is:
`Requirements → Spec Documents → Review/Approve → Code → Tests → Deploy`

> **No Pull Request is merged without a linked spec document or spec amendment.**

### Document Creation Order (SDD Phases)
- **PHASE 0**: Discovery (PRD, Architecture)
- **PHASE 1**: Data Layer (DB Schema, Migrations)
- **PHASE 2**: API Contract (OpenAPI, Auth Spec)
- **PHASE 3**: Frontend Contracts (Component Spec, State Management, Routes)
- **PHASE 4**: Infrastructure (Infra, Network, Security)
- **PHASE 5**: Deployment & Operations (CI/CD, Runbook, Rollback, Tests)

## Directory Structure
- `backend/`: FastAPI application
- `frontend/`: React.js application
- `infra/`: Terraform infrastructure
- `docs/`: All spec documents
- `.github/workflows/`: CI/CD pipelines
