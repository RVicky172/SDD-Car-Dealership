# 🚗 Car Dealer Website — Getting Started Guide

This guide walks you through setting up the full-stack Car Dealer platform for local development.

## Prerequisites

Ensure the following tools are installed on your machine:

| Tool                     | Version | Purpose                  |
| ------------------------ | ------- | ------------------------ |
| **Python**         | 3.12+   | Backend runtime          |
| **Node.js**        | 18+     | Frontend runtime         |
| **Docker Desktop** | Latest  | Local PostgreSQL & Redis |
| **Git**            | Latest  | Version control          |

---

## 1. Clone the Repository

```bash
git clone https://github.com/RVicky172/SDD-Car-Dealership.git
cd SDD-Car-Dealership
```

---

## 2. Start Local Infrastructure (PostgreSQL & Redis)

We use Docker Compose to run PostgreSQL 15 and Redis 7 locally.

```bash
docker compose up -d
```

This starts:

- **PostgreSQL** on `localhost:5432` (user: `postgres`, password: `postgrespassword`, db: `cardealer`)
- **Redis** on `localhost:6379`

To stop the services:

```bash
docker compose down
```

### 2.1 Connecting to pgAdmin
Open your browser and navigate to http://localhost:8080.

Log in to pgAdmin using the following credentials:

Email: rohillavicky.172@gmail.com

Password: RVicky@2411

Click Add New Server and fill out the Connection tab with these exact details:

Host name/address: db (Note: Do not use localhost here, as pgAdmin runs inside a container and communicates via the Docker network).

Port: 5432

Maintenance database: cardealer

Username: postgres

Password: postgrespassword

---

## 3. Backend Setup (FastAPI)

### 3.1 Create and activate a Python virtual environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate    # macOS/Linux
# venv\Scripts\activate     # Windows
```

### 3.2 Install dependencies

```bash
pip install -r requirements.txt
```

### 3.3 Run database migrations

```bash
alembic upgrade head
```

This creates all the tables defined in our SQLAlchemy models (`users`, `dealers`, `cars`, `car_images`, `inquiries`, `test_drive_bookings`, `wishlists`).

### 3.4 Start the API server

```bash
uvicorn app.main:app --reload
```

The API is now available at:

- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 4. Frontend Setup (React + Vite)

### 4.1 Install dependencies

```bash
cd frontend
npm install
```

### 4.2 Start the dev server

```bash
npm run dev
```

The SPA is now available at:

- **App**: [http://localhost:5173](http://localhost:5173)

> **Note:** The Vite dev server is configured to proxy `/v1` API requests to the FastAPI backend at `http://localhost:8000`, so you do not need to worry about CORS during development.

---

## 5. Verify the Full Stack

1. Open [http://localhost:5173](http://localhost:5173) — you should see the **AutoElite** homepage.
2. Click **Sign In** → **Sign Up** to register a new user.
3. Log in with your new credentials.
4. Navigate to **Inventory** to browse the (currently empty) car listings.
5. Open [http://localhost:8000/docs](http://localhost:8000/docs) to interact with the raw API endpoints.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable         | Default                                                                     | Description                |
| ---------------- | --------------------------------------------------------------------------- | -------------------------- |
| `APP_ENV`      | `local`                                                                   | Environment identifier     |
| `DATABASE_URL` | `postgresql+asyncpg://postgres:postgrespassword@localhost:5432/cardealer` | Async DB connection string |

---

## Project Commands Cheatsheet

| Command                                      | Location      | Description                |
| -------------------------------------------- | ------------- | -------------------------- |
| `docker compose up -d`                     | Root          | Start PostgreSQL & Redis   |
| `docker compose down`                      | Root          | Stop infrastructure        |
| `alembic upgrade head`                     | `backend/`  | Run all pending migrations |
| `alembic revision --autogenerate -m "msg"` | `backend/`  | Generate a new migration   |
| `uvicorn app.main:app --reload`            | `backend/`  | Start FastAPI server       |
| `npm run dev`                              | `frontend/` | Start Vite dev server      |
| `npm run build`                            | `frontend/` | Build production bundle    |

---

## Troubleshooting

### "Module not found" errors in backend

Make sure you have activated the virtual environment:

```bash
source backend/venv/bin/activate
```

### Database connection refused

Ensure Docker containers are running:

```bash
docker compose ps
```

### Frontend API calls failing

Ensure the backend server is running on port 8000. The Vite proxy forwards `/v1` requests to the backend automatically.
