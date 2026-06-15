# DOC-04: Migrations Plan
**Status:** Draft  
**Owner:** Backend Team  
**Last Updated:** 2026-06-15  
**Depends On:** DOC-03  
**Blocks:** DOC-05  

## 1. Tooling Strategy
- **ORM**: SQLAlchemy 2.0 (using async engine)
- **Migrations Tool**: Alembic
- **DB Driver**: asyncpg

## 2. Alembic Configuration
- Single `alembic.ini` located at `backend/alembic.ini`.
- Migrations folder located at `backend/app/db/migrations`.
- Alembic `env.py` will be configured to load models from `backend.app.models.base`.

## 3. Migration Workflow
1. **Local Development**:
   - Model changes made in `backend/app/models/`.
   - Autogenerate script: `alembic revision --autogenerate -m "description"`.
   - Verify generated script.
   - Apply locally: `alembic upgrade head`.

2. **Staging / Production Deployment**:
   - The ECS Fargate setup will include a pre-deployment hook (a one-off ECS task) that runs `alembic upgrade head` against the RDS instance before replacing the active FastAPI container instances.
   - If a migration fails, the deployment of the new application container image is aborted.

## 4. Safety Constraints
- **NO DESTRUCTIVE MIGRATIONS**: Dropping tables or columns should be a multi-step process in production (deprecate, stop usage, drop later).
- **CONCURRENT INDEX CREATION**: In production, indices for large tables must be created concurrently.
- **DOWN REVISIONS**: All migrations must include functional `downgrade()` logic to facilitate rollbacks.
