# DOC-02: System Design Decisions
**Status:** Draft  
**Owner:** Architecture Team  
**Last Updated:** 2026-06-15  
**Depends On:** DOC-01  
**Blocks:** DOC-03, DOC-04, DOC-05  

## 1. Tech Stack Decision Matrix

### Backend
| Layer | Choice | Why |
|---|---|---|
| Language | Python 3.12 | Type hints, ecosystem, team familiarity |
| Framework | FastAPI | Auto OpenAPI docs, async native, Pydantic validation |
| ORM | SQLAlchemy 2.0 + Alembic | Typed ORM, migration support |
| Validation | Pydantic v2 | Zero-overhead validation, JSON schema generation |
| Auth | JWT (PyJWT) + AWS Cognito | Stateless, scalable, MFA via Cognito |
| Task Queue | Celery + Redis | Async email, image processing, notifications |
| Testing | Pytest + HTTPX | Async test client, fixtures |
| Linting | Ruff + Black | Fast linting, consistent formatting |

### Frontend
| Layer | Choice | Why |
|---|---|---|
| Language | TypeScript 5.x | Type safety, IDE support |
| Framework | React 18 | Concurrent mode, large ecosystem |
| Build Tool | Vite | Fast HMR, optimized builds |
| Styling | Tailwind CSS v3 | Utility-first, no CSS drift |
| State (server) | TanStack Query (React Query) | Caching, background sync, loading states |
| State (client) | Zustand | Lightweight, no boilerplate |
| Forms | React Hook Form + Zod | Performant, schema validation |
| UI Components | shadcn/ui | Accessible, unstyled, customizable |
| Routing | React Router v6 | File-based routing patterns |
| Testing | Vitest + Testing Library | Fast unit tests, React component testing |

### Infrastructure (AWS)
- **ECS Fargate**: Container orchestration (FastAPI)
- **ECR**: Docker image registry
- **RDS PostgreSQL 15**: Primary database
- **ElastiCache Redis**: Session cache + Celery broker
- **S3 & CloudFront**: Car images + static React build CDN
- **ALB & Route 53**: Load balancer + SSL + DNS management
- **Cognito**: User auth + JWT issuer
- **SES & Secrets Manager**: Transactional email + DB passwords

## 2. System Architecture

The application operates as an API-first monolithic service inside ECS Fargate, serving a React SPA via CloudFront.

- **Frontend**: CloudFront serves the React SPA statically hosted in S3.
- **API Traffic**: Routes through an ALB to ECS Fargate containers running FastAPI.
- **Data Persistence**: RDS PostgreSQL handles structured data. Redis caches sessions and powers Celery for asynchronous tasks like image processing or email sending.
- **Authentication**: AWS Cognito manages OAuth and password flows. The backend verifies standard JWTs.
- **Infrastructure**: fully codified using Terraform, with separate state for Staging and Production.

## 3. High-Level Network Strategy
- **Public Subnets**: ALB and NAT Gateways.
- **Private App Subnets**: ECS Tasks, Celery Workers.
- **Private DB Subnets**: RDS, ElastiCache.
