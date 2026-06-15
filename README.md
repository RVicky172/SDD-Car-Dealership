# 🚗 AutoElite — Car Dealer Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.12+-3776AB?logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.137-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

A full-stack Car Dealer platform monorepo, developed using a **Spec-Driven Development (SDD)** methodology — every line of code is justified by a document.

---

## 🏗️ Tech Stack

| Layer | Technologies |
|---|---|
| **Backend** | Python 3.12, FastAPI, SQLAlchemy 2.0, PostgreSQL 15, Alembic, Celery, Redis |
| **Frontend** | TypeScript, React 18, Vite, Tailwind CSS v4, React Query, Zustand, Lucide Icons |
| **Infrastructure** | Terraform, AWS (ECS Fargate, RDS, ElastiCache, S3, CloudFront, Cognito, SES) |
| **CI/CD** | GitHub Actions |

---

## 🚀 Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/RVicky172/SDD-Car-Dealership.git
cd SDD-Car-Dealership

# 2. Start local infrastructure (PostgreSQL + Redis)
docker compose up -d

# 3. Backend setup
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload

# 4. Frontend setup (in a new terminal)
cd frontend
npm install
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

> 📖 For detailed setup instructions, see [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md).

---

## 📂 Project Structure

```
SDD-Car-Dealership/
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── api/              # Route handlers (v1/)
│   │   ├── core/             # Config, security utilities
│   │   ├── db/               # Database session & base
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── schemas/          # Pydantic validation schemas
│   │   └── main.py           # FastAPI app entrypoint
│   ├── alembic/              # Database migrations
│   ├── requirements.txt
│   └── .env
├── frontend/                 # React SPA
│   ├── src/
│   │   ├── api/              # Axios client & query keys
│   │   ├── components/       # Layout, auth, UI components
│   │   ├── pages/            # Route page views
│   │   ├── store/            # Zustand state stores
│   │   └── App.tsx           # Root component with routing
│   ├── package.json
│   └── vite.config.ts
├── infra/                    # Terraform infrastructure
├── docs/                     # All SDD spec documents
├── docker-compose.yml        # Local dev infrastructure
└── .github/workflows/        # CI/CD pipelines
```

---

## 📋 Spec-Driven Development (SDD)

Every feature flows from a specification document. The workflow is:

```
Requirements → Spec Documents → Review/Approve → Code → Tests → Deploy
```

> **No Pull Request is merged without a linked spec document or spec amendment.**

### Document Phases

| Phase | Documents | Status |
|---|---|---|
| **Phase 0** — Discovery | [PRD](docs/DOC-01-PRD.md), [Architecture](docs/DOC-02-ARCHITECTURE.md) | ✅ Complete |
| **Phase 1** — Data Layer | [DB Schema](docs/DOC-03-DB_SCHEMA.md), [Migrations](docs/DOC-04-MIGRATIONS_PLAN.md) | ✅ Complete |
| **Phase 2** — API Contract | [OpenAPI](docs/DOC-05-openapi.yaml), [Auth Spec](docs/DOC-06-AUTH_SPEC.md) | ✅ Complete |
| **Phase 3** — Frontend | [Components](docs/DOC-07-COMPONENT_SPEC.md), [State](docs/DOC-08-STATE_MANAGEMENT_SPEC.md), [Routes](docs/DOC-09-ROUTES_SPEC.md) | ✅ Complete |
| **Phase 4** — Infrastructure | [Infra](docs/DOC-10-INFRA_SPEC.md), [Network](docs/DOC-11-NETWORK_SPEC.md), [Security](docs/DOC-12-SECURITY_SPEC.md) | ✅ Complete |
| **Phase 5** — Deployment | [CI/CD](docs/DOC-13-CICD_SPEC.md), [Runbook](docs/DOC-14-DEPLOYMENT_RUNBOOK.md), [Rollback](docs/DOC-15-ROLLBACK_PLAN.md), [Tests](docs/DOC-16-TEST_STRATEGY.md) | ✅ Complete |

---

## 🔑 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/v1/auth/register` | Public | Register a new user |
| `POST` | `/v1/auth/login` | Public | Login and receive JWT tokens |
| `GET` | `/v1/users/me` | Bearer | Get current user profile |
| `GET` | `/v1/cars` | Public | Browse car inventory |
| `GET` | `/v1/dealers/{id}` | Public | Get dealer details |
| `POST` | `/v1/inquiries` | Public | Submit an inquiry |
| `POST` | `/v1/bookings` | Bearer | Book a test drive |

---

## 🤝 Contributing

1. Read the relevant spec document in `docs/` before writing any code.
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Ensure your PR links to a spec document or spec amendment.
4. Submit a Pull Request for review.

---

## 📄 License

This project is licensed under the MIT License.
