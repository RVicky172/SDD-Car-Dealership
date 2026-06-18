# 🚗 AutoElite — Car Dealership Platform
## System Design & Software Architecture Document

> **Version:** 1.0.0 | **Status:** Approved | **Last Updated:** June 2026
> **Author:** Engineering Architecture Team
> **Stack:** React 18 + TypeScript · Python 3.12 + FastAPI · PostgreSQL · AWS

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [Technology Stack](#3-technology-stack)
4. [Backend Design Patterns — Python + FastAPI](#4-backend-design-patterns--python--fastapi)
   - 4.1 Repository Pattern
   - 4.2 Dependency Injection
   - 4.3 Strategy Pattern
   - 4.4 Factory Pattern
   - 4.5 Unit of Work Pattern
5. [Frontend Design Patterns — React + TypeScript](#5-frontend-design-patterns--react--typescript)
   - 5.1 Adapter Pattern
   - 5.2 Provider / Observer Pattern
   - 5.3 Container / Presentational Pattern
   - 5.4 Compound Component Pattern
   - 5.5 Custom Hook Pattern
6. [Database Schema Design](#6-database-schema-design)
7. [API Design Principles](#7-api-design-principles)
8. [AWS Infrastructure Architecture](#8-aws-infrastructure-architecture)
9. [Security Patterns](#9-security-patterns)
10. [User Journey × Design Pattern Matrix](#10-user-journey--design-pattern-matrix)
11. [Scalability & Performance Considerations](#11-scalability--performance-considerations)
12. [Testing Strategy](#12-testing-strategy)
13. [18-Week Development Roadmap](#13-18-week-development-roadmap)

---

## 1. Executive Summary

**AutoElite** is a full-stack car dealership platform that connects buyers, dealers, and financing partners through a unified web experience. The platform handles vehicle inventory management, test-drive scheduling, loan origination, and real-time pricing — all backed by a clean, pattern-driven architecture designed to scale from MVP to enterprise without rewrites.

### Core Business Domains

| Domain | Description | Complexity |
|---|---|---|
| **Inventory Management** | Real-time stock, VIN lookup, vehicle photos | High |
| **Pricing Engine** | Dynamic pricing with promotions, loyalty tiers | High |
| **Loan Origination** | Multi-lender credit workflow | Very High |
| **Test Drive Scheduling** | Calendar, availability, confirmations | Medium |
| **User Accounts** | Buyer profiles, saved vehicles, history | Medium |
| **Admin Dashboard** | Dealer tools, analytics, reporting | High |

### Architecture Goals

- **Separation of Concerns** — every layer has a single, well-defined responsibility
- **Testability** — all business logic is independently testable without a running server
- **Replaceability** — databases, pricing engines, and auth providers can be swapped with minimal disruption
- **Scalability** — stateless services that scale horizontally behind a load balancer

---

## 2. System Architecture Overview

### High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                               │
│                                                                     │
│   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐  │
│   │  React 18 SPA   │   │  Admin Portal   │   │  Mobile (PWA)   │  │
│   │  (TypeScript)   │   │  (React 18)     │   │                 │  │
│   └────────┬────────┘   └────────┬────────┘   └────────┬────────┘  │
│            │                     │                     │           │
└────────────┼─────────────────────┼─────────────────────┼───────────┘
             │              HTTPS / REST                 │
             ▼                     ▼                     ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         API GATEWAY (AWS)                           │
│                    Rate Limiting · Auth · Routing                   │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
             ┌──────────────────┼──────────────────┐
             ▼                  ▼                  ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ Vehicle Service│  │  Loan Service  │  │  User Service  │
│   FastAPI      │  │   FastAPI      │  │   FastAPI      │
│  (Port 8001)   │  │  (Port 8002)   │  │  (Port 8003)   │
└───────┬────────┘  └───────┬────────┘  └───────┬────────┘
        │                   │                   │
        ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          DATA LAYER                                 │
│  ┌───────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │  PostgreSQL   │  │    Redis     │  │     AWS S3               │  │
│  │  (Primary DB) │  │   (Cache)    │  │  (Vehicle Images/Docs)   │  │
│  └───────────────┘  └──────────────┘  └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

### Request Lifecycle

```
Browser → CloudFront CDN → API Gateway → FastAPI Service → Repository → PostgreSQL
                                     ↘ Redis Cache (on cache hit)
```

---

## 3. Technology Stack

### Backend

| Layer | Technology | Rationale |
|---|---|---|
| **Language** | Python 3.12 | Async support, type hints, rich ecosystem |
| **Framework** | FastAPI | Auto-generated OpenAPI docs, native DI, async-first |
| **ORM** | SQLAlchemy 2.0 + Alembic | Async queries, migration management |
| **Validation** | Pydantic v2 | Request/response schema validation |
| **Auth** | python-jose + passlib | JWT generation and verification |
| **Task Queue** | Celery + Redis | Async loan processing, email notifications |
| **Testing** | pytest + httpx | Async test support |

### Frontend

| Layer | Technology | Rationale |
|---|---|---|
| **Language** | TypeScript 5.x | Type safety, better DX, refactoring confidence |
| **Framework** | React 18 | Concurrent features, server components ready |
| **State** | Zustand + React Query | Lightweight global state + server state |
| **UI Library** | shadcn/ui + Tailwind CSS | Composable, unstyled-first components |
| **Forms** | React Hook Form + Zod | Performant forms with schema validation |
| **HTTP Client** | Axios + interceptors | Centralized auth headers, error handling |
| **Testing** | Vitest + React Testing Library | Fast unit + component testing |

### Infrastructure (AWS)

| Service | Purpose |
|---|---|
| **ECS Fargate** | Containerized microservices |
| **RDS PostgreSQL** | Managed relational database |
| **ElastiCache Redis** | Session store + API response caching |
| **S3 + CloudFront** | Static assets + vehicle image CDN |
| **API Gateway** | Rate limiting, routing, SSL termination |
| **Cognito** | User pool management (optional) |
| **SQS** | Async messaging between services |
| **CloudWatch** | Centralized logging and monitoring |

---

## 4. Backend Design Patterns — Python + FastAPI

### 4.1 Repository Pattern

**Category:** Structural
**Problem:** Raw SQLAlchemy queries scattered directly inside FastAPI route handlers make the codebase difficult to test in isolation and painful to maintain when the database schema changes.
**Solution:** Introduce a Repository layer that owns all data-access logic. Routes become thin orchestrators; they call the repository, not the database.

#### Project Structure

```
app/
├── api/
│   └── v1/
│       └── vehicles.py         ← Routes (thin, no DB queries)
├── repositories/
│   ├── base.py                 ← Generic CRUD base
│   └── vehicle_repository.py  ← Domain-specific queries
├── models/
│   └── vehicle.py              ← SQLAlchemy ORM models
└── schemas/
    └── vehicle.py              ← Pydantic request/response schemas
```

#### Implementation

```python
# app/repositories/base.py
from typing import Generic, TypeVar, Type, Optional, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

ModelType = TypeVar("ModelType")

class BaseRepository(Generic[ModelType]):
    """Generic CRUD repository — never write raw queries in routes again."""

    def __init__(self, model: Type[ModelType], session: AsyncSession):
        self.model = model
        self.session = session

    async def get_by_id(self, record_id: int) -> Optional[ModelType]:
        result = await self.session.execute(
            select(self.model).where(self.model.id == record_id)
        )
        return result.scalar_one_or_none()

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        result = await self.session.execute(
            select(self.model).offset(skip).limit(limit)
        )
        return result.scalars().all()

    async def create(self, obj_in: dict) -> ModelType:
        db_obj = self.model(**obj_in)
        self.session.add(db_obj)
        await self.session.commit()
        await self.session.refresh(db_obj)
        return db_obj

    async def delete(self, record_id: int) -> bool:
        obj = await self.get_by_id(record_id)
        if obj:
            await self.session.delete(obj)
            await self.session.commit()
            return True
        return False
```

```python
# app/repositories/vehicle_repository.py
from sqlalchemy import select, and_
from app.repositories.base import BaseRepository
from app.models.vehicle import Vehicle

class VehicleRepository(BaseRepository[Vehicle]):
    """All vehicle-specific database queries live here and nowhere else."""

    async def get_available_inventory(
        self,
        make: str | None = None,
        max_price: float | None = None,
        year_from: int | None = None,
    ) -> list[Vehicle]:
        conditions = [Vehicle.status == "available"]

        if make:
            conditions.append(Vehicle.make.ilike(f"%{make}%"))
        if max_price:
            conditions.append(Vehicle.price <= max_price)
        if year_from:
            conditions.append(Vehicle.year >= year_from)

        result = await self.session.execute(
            select(Vehicle)
            .where(and_(*conditions))
            .order_by(Vehicle.price.asc())
        )
        return result.scalars().all()

    async def get_by_vin(self, vin: str) -> Vehicle | None:
        result = await self.session.execute(
            select(Vehicle).where(Vehicle.vin == vin)
        )
        return result.scalar_one_or_none()

    async def mark_as_sold(self, vehicle_id: int) -> Vehicle | None:
        vehicle = await self.get_by_id(vehicle_id)
        if vehicle:
            vehicle.status = "sold"
            await self.session.commit()
            await self.session.refresh(vehicle)
        return vehicle
```

```python
# app/api/v1/vehicles.py  ← Notice: ZERO raw SQL here
from fastapi import APIRouter, Depends
from app.repositories.vehicle_repository import VehicleRepository
from app.dependencies import get_vehicle_repo
from app.schemas.vehicle import VehicleOut, VehicleFilters

router = APIRouter(prefix="/vehicles", tags=["Vehicles"])

@router.get("/", response_model=list[VehicleOut])
async def list_vehicles(
    filters: VehicleFilters = Depends(),
    repo: VehicleRepository = Depends(get_vehicle_repo),
):
    return await repo.get_available_inventory(**filters.model_dump(exclude_none=True))

@router.get("/{vehicle_id}", response_model=VehicleOut)
async def get_vehicle(vehicle_id: int, repo: VehicleRepository = Depends(get_vehicle_repo)):
    vehicle = await repo.get_by_id(vehicle_id)
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")
    return vehicle
```

> **Key Benefit:** To switch from PostgreSQL to MongoDB, only `VehicleRepository` changes — the route handlers remain completely untouched.

---

### 4.2 Dependency Injection

**Category:** Architectural (Creational)
**Problem:** Manually managing database sessions, authentication clients, and external API connections across dozens of routes leads to resource leaks and scattered boilerplate.
**Solution:** FastAPI's `Depends()` mechanism provides a built-in IoC container. Dependencies are created once per request and properly torn down — even if an exception occurs.

```python
# app/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import AsyncSessionLocal
from app.repositories.vehicle_repository import VehicleRepository
from app.repositories.user_repository import UserRepository
from app.services.auth_service import AuthService

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

# ─── Database Session ─────────────────────────────────────────────────────────
async def get_db() -> AsyncSession:
    """Yields a DB session and guarantees cleanup via async context manager."""
    async with AsyncSessionLocal() as session:
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

# ─── Repository Factory Functions ─────────────────────────────────────────────
def get_vehicle_repo(db: AsyncSession = Depends(get_db)) -> VehicleRepository:
    return VehicleRepository(model=Vehicle, session=db)

def get_user_repo(db: AsyncSession = Depends(get_db)) -> UserRepository:
    return UserRepository(model=User, session=db)

# ─── Authentication Guard ──────────────────────────────────────────────────────
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    repo: UserRepository = Depends(get_user_repo),
):
    """Validates JWT and returns the authenticated user — inject this anywhere."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
    )
    user_id = AuthService.decode_token(token)
    if not user_id:
        raise credentials_exception

    user = await repo.get_by_id(user_id)
    if not user or not user.is_active:
        raise credentials_exception
    return user

# ─── Role Guard ────────────────────────────────────────────────────────────────
def require_role(*roles: str):
    """Factory that returns a dependency checking for specific user roles."""
    async def role_checker(current_user=Depends(get_current_user)):
        if current_user.role not in roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return current_user
    return role_checker


# Usage in any route — one-liner auth:
# current_user = Depends(require_role("admin", "dealer"))
```

---

### 4.3 Strategy Pattern

**Category:** Behavioral
**Problem:** Vehicle pricing logic involves dozens of overlapping rules — holiday sales, VIP tiers, fleet discounts, employee pricing, trade-in credits — that change frequently. Encoding all of these as nested `if/elif` blocks is a maintenance nightmare.
**Solution:** Define a `PricingStrategy` abstract base class. Each pricing rule becomes a concrete strategy class that can be swapped in at runtime.

```python
# app/strategies/pricing.py
from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import date

@dataclass
class PricingContext:
    base_price: float
    customer_tier: str       # "standard" | "vip" | "employee"
    trade_in_value: float
    current_date: date

@dataclass
class PricingResult:
    final_price: float
    discount_amount: float
    discount_label: str
    breakdown: dict[str, float]

# ─── Abstract Base ─────────────────────────────────────────────────────────────
class PricingStrategy(ABC):
    @abstractmethod
    def calculate(self, ctx: PricingContext) -> PricingResult:
        ...

# ─── Concrete Strategies ───────────────────────────────────────────────────────
class StandardPricing(PricingStrategy):
    def calculate(self, ctx: PricingContext) -> PricingResult:
        final = ctx.base_price - ctx.trade_in_value
        return PricingResult(
            final_price=final,
            discount_amount=ctx.trade_in_value,
            discount_label="Trade-In Credit",
            breakdown={"base": ctx.base_price, "trade_in": -ctx.trade_in_value}
        )

class HolidayPricing(PricingStrategy):
    DISCOUNT_RATE = 0.08  # 8% holiday discount

    def calculate(self, ctx: PricingContext) -> PricingResult:
        holiday_discount = ctx.base_price * self.DISCOUNT_RATE
        final = ctx.base_price - holiday_discount - ctx.trade_in_value
        return PricingResult(
            final_price=final,
            discount_amount=holiday_discount + ctx.trade_in_value,
            discount_label="Holiday Sale — 8% Off",
            breakdown={
                "base": ctx.base_price,
                "holiday_discount": -holiday_discount,
                "trade_in": -ctx.trade_in_value,
            }
        )

class VIPCustomerPricing(PricingStrategy):
    def calculate(self, ctx: PricingContext) -> PricingResult:
        vip_discount = ctx.base_price * 0.12  # 12% VIP discount
        final = ctx.base_price - vip_discount - ctx.trade_in_value
        return PricingResult(
            final_price=final,
            discount_amount=vip_discount + ctx.trade_in_value,
            discount_label="VIP Member — 12% Exclusive Discount",
            breakdown={
                "base": ctx.base_price,
                "vip_discount": -vip_discount,
                "trade_in": -ctx.trade_in_value,
            }
        )

class EmployeePricing(PricingStrategy):
    def calculate(self, ctx: PricingContext) -> PricingResult:
        employee_discount = ctx.base_price * 0.20  # 20% employee discount
        final = ctx.base_price - employee_discount - ctx.trade_in_value
        return PricingResult(
            final_price=final,
            discount_amount=employee_discount + ctx.trade_in_value,
            discount_label="Employee Pricing — 20% Off",
            breakdown={
                "base": ctx.base_price,
                "employee_discount": -employee_discount,
                "trade_in": -ctx.trade_in_value,
            }
        )

# ─── Pricing Engine (Strategy Selector) ───────────────────────────────────────
class PricingEngine:
    """Selects and executes the correct pricing strategy at runtime."""

    HOLIDAY_DATES = {(12, 24), (12, 25), (11, 29)}  # Christmas, Black Friday

    @classmethod
    def get_strategy(cls, ctx: PricingContext) -> PricingStrategy:
        month_day = (ctx.current_date.month, ctx.current_date.day)

        if ctx.customer_tier == "employee":
            return EmployeePricing()
        if ctx.customer_tier == "vip":
            return VIPCustomerPricing()
        if month_day in cls.HOLIDAY_DATES:
            return HolidayPricing()
        return StandardPricing()

    @classmethod
    def calculate(cls, ctx: PricingContext) -> PricingResult:
        strategy = cls.get_strategy(ctx)
        return strategy.calculate(ctx)
```

---

### 4.4 Factory Pattern

**Category:** Creational
**Problem:** Loan applications must be routed through different approval workflows depending on the applicant's credit score — prime, near-prime, and subprime borrowers require entirely different lender integrations, document sets, and processing steps.
**Solution:** A `LoanWorkflowFactory` inspects the credit score and instantiates the correct workflow object, keeping the loan service decoupled from the routing logic.

```python
# app/factories/loan_workflow_factory.py
from abc import ABC, abstractmethod
from dataclasses import dataclass

@dataclass
class LoanApplication:
    applicant_id: int
    vehicle_id: int
    loan_amount: float
    credit_score: int
    annual_income: float
    down_payment: float

class LoanWorkflow(ABC):
    @abstractmethod
    async def process(self, application: LoanApplication) -> dict:
        ...

class PrimeLoanWorkflow(LoanWorkflow):
    """Credit score 720+ — best rates, fast approval."""
    async def process(self, application: LoanApplication) -> dict:
        return {
            "status": "auto_approved",
            "interest_rate": 4.9,
            "term_months": 72,
            "lender": "AutoElite_Prime_Partner",
            "requires_documents": ["income_verification"],
        }

class NearPrimeLoanWorkflow(LoanWorkflow):
    """Credit score 620–719 — moderate rates, additional verification."""
    async def process(self, application: LoanApplication) -> dict:
        return {
            "status": "conditional_approval",
            "interest_rate": 9.5,
            "term_months": 60,
            "lender": "Regional_Credit_Union",
            "requires_documents": ["income_verification", "employment_letter", "bank_statements"],
        }

class SubprimeLoanWorkflow(LoanWorkflow):
    """Credit score < 620 — high-risk tier, manual review."""
    async def process(self, application: LoanApplication) -> dict:
        return {
            "status": "manual_review",
            "interest_rate": 18.9,
            "term_months": 48,
            "lender": "Specialty_Finance_Corp",
            "requires_documents": ["full_financial_disclosure", "co_signer_option"],
        }

class LoanWorkflowFactory:
    """Returns the correct workflow without the caller knowing the credit tiers."""

    @staticmethod
    def create(application: LoanApplication) -> LoanWorkflow:
        score = application.credit_score
        if score >= 720:
            return PrimeLoanWorkflow()
        elif score >= 620:
            return NearPrimeLoanWorkflow()
        else:
            return SubprimeLoanWorkflow()
```

---

### 4.5 Unit of Work Pattern

**Category:** Architectural
**Problem:** Complex transactions (e.g., a vehicle purchase simultaneously marks the car as sold, creates an invoice, and sends a notification) need to either fully succeed or fully roll back — ensuring data consistency.
**Solution:** The Unit of Work wraps multiple repository operations inside a single atomic transaction boundary.

```python
# app/unit_of_work.py
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.vehicle_repository import VehicleRepository
from app.repositories.invoice_repository import InvoiceRepository
from app.repositories.user_repository import UserRepository

class VehiclePurchaseUoW:
    """Ensures a purchase either fully commits or fully rolls back."""

    def __init__(self, session: AsyncSession):
        self.session = session
        self.vehicles = VehicleRepository(Vehicle, session)
        self.invoices = InvoiceRepository(Invoice, session)
        self.users = UserRepository(User, session)

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if exc_type:
            await self.session.rollback()
        else:
            await self.session.commit()
        await self.session.close()

    async def complete_purchase(self, vehicle_id: int, buyer_id: int, final_price: float):
        """Atomic: mark sold + create invoice — both succeed or both roll back."""
        vehicle = await self.vehicles.mark_as_sold(vehicle_id)
        invoice = await self.invoices.create({
            "vehicle_id": vehicle_id,
            "buyer_id": buyer_id,
            "amount": final_price,
            "status": "issued",
        })
        return vehicle, invoice
```

---

## 5. Frontend Design Patterns — React + TypeScript

### 5.1 Adapter Pattern

**Category:** Structural
**Problem:** The FastAPI backend returns snake_case JSON with field names optimized for the database schema (e.g., `mfg_year`, `car_brand`, `asking_price_usd`). React components work best with camelCase TypeScript interfaces that use domain-friendly terminology.
**Solution:** An adapter function transforms the raw API response into a clean frontend domain model. The rest of the app never sees raw API shapes.

```typescript
// src/adapters/vehicleAdapter.ts

// ─── Raw API Shape (from FastAPI) ─────────────────────────────────────────────
interface VehicleApiResponse {
  id: number;
  vin: string;
  car_brand: string;
  car_model: string;
  mfg_year: number;
  asking_price_usd: number;
  odometer_km: number;
  fuel_type_code: string;
  color_hex: string;
  img_urls: string[];
  dealer_id: number;
  is_available: boolean;
  created_at: string;
}

// ─── Frontend Domain Model ─────────────────────────────────────────────────────
interface Vehicle {
  id: number;
  vin: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileageKm: number;
  fuelType: "petrol" | "diesel" | "electric" | "hybrid";
  color: string;
  imageUrls: string[];
  dealerId: number;
  isAvailable: boolean;
  listedAt: Date;
}

const FUEL_TYPE_MAP: Record<string, Vehicle["fuelType"]> = {
  PTR: "petrol",
  DSL: "diesel",
  EV:  "electric",
  HYB: "hybrid",
};

// ─── Adapter Function ──────────────────────────────────────────────────────────
export function adaptVehicle(raw: VehicleApiResponse): Vehicle {
  return {
    id:         raw.id,
    vin:        raw.vin,
    make:       raw.car_brand,
    model:      raw.car_model,
    year:       raw.mfg_year,
    price:      raw.asking_price_usd,
    mileageKm:  raw.odometer_km,
    fuelType:   FUEL_TYPE_MAP[raw.fuel_type_code] ?? "petrol",
    color:      raw.color_hex,
    imageUrls:  raw.img_urls,
    dealerId:   raw.dealer_id,
    isAvailable: raw.is_available,
    listedAt:   new Date(raw.created_at),
  };
}

export function adaptVehicleList(rawList: VehicleApiResponse[]): Vehicle[] {
  return rawList.map(adaptVehicle);
}
```

---

### 5.2 Provider / Observer Pattern

**Category:** Behavioral
**Problem:** State like the user's saved vehicles, shopping cart, and auth session needs to be accessible from deeply nested components without prop-drilling through 5+ layers.
**Solution:** React Context acts as the Observer pattern's Subject. Components subscribe by consuming the context and automatically re-render when the shared state changes.

```typescript
// src/contexts/SavedVehiclesContext.tsx
import { createContext, useContext, useReducer, ReactNode } from "react";
import type { Vehicle } from "@/types/vehicle";

// ─── State & Actions ───────────────────────────────────────────────────────────
interface State {
  savedVehicles: Vehicle[];
  count: number;
}

type Action =
  | { type: "SAVE_VEHICLE"; payload: Vehicle }
  | { type: "REMOVE_VEHICLE"; payload: number }
  | { type: "CLEAR_ALL" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SAVE_VEHICLE":
      if (state.savedVehicles.some(v => v.id === action.payload.id)) return state;
      const added = [...state.savedVehicles, action.payload];
      return { savedVehicles: added, count: added.length };

    case "REMOVE_VEHICLE":
      const removed = state.savedVehicles.filter(v => v.id !== action.payload);
      return { savedVehicles: removed, count: removed.length };

    case "CLEAR_ALL":
      return { savedVehicles: [], count: 0 };

    default:
      return state;
  }
}

// ─── Context & Provider ────────────────────────────────────────────────────────
interface ContextValue extends State {
  saveVehicle: (vehicle: Vehicle) => void;
  removeVehicle: (id: number) => void;
  isSaved: (id: number) => boolean;
}

const SavedVehiclesContext = createContext<ContextValue | null>(null);

export function SavedVehiclesProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { savedVehicles: [], count: 0 });

  return (
    <SavedVehiclesContext.Provider value={{
      ...state,
      saveVehicle:   (v) => dispatch({ type: "SAVE_VEHICLE", payload: v }),
      removeVehicle: (id) => dispatch({ type: "REMOVE_VEHICLE", payload: id }),
      isSaved:       (id) => state.savedVehicles.some(v => v.id === id),
    }}>
      {children}
    </SavedVehiclesContext.Provider>
  );
}

// ─── Custom Hook ───────────────────────────────────────────────────────────────
export function useSavedVehicles(): ContextValue {
  const ctx = useContext(SavedVehiclesContext);
  if (!ctx) throw new Error("useSavedVehicles must be used inside SavedVehiclesProvider");
  return ctx;
}
```

---

### 5.3 Container / Presentational Pattern

**Category:** Structural
**Problem:** Components that simultaneously fetch data, transform it, manage loading/error states, and render the UI become unreadable and impossible to test or reuse.
**Solution:** Split every feature into two layers: a Container (custom hook) that owns data-fetching logic, and a Presentational component that is a pure function of its props.

```typescript
// ─── CONTAINER: Custom Hook ────────────────────────────────────────────────────
// src/hooks/useCarInventory.ts
import { useQuery } from "@tanstack/react-query";
import { vehicleService } from "@/services/vehicleService";
import { adaptVehicleList } from "@/adapters/vehicleAdapter";
import type { VehicleFilters } from "@/types/vehicle";

export function useCarInventory(filters: VehicleFilters) {
  return useQuery({
    queryKey: ["vehicles", filters],
    queryFn:  () => vehicleService.getInventory(filters).then(adaptVehicleList),
    staleTime: 5 * 60 * 1000, // 5 minutes — inventory doesn't change by the second
  });
}

// ─── PRESENTATIONAL: Pure UI ───────────────────────────────────────────────────
// src/components/CarGrid.tsx
interface CarGridProps {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: Error | null;
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export function CarGrid({ vehicles, isLoading, error, onSelectVehicle }: CarGridProps) {
  if (isLoading) return <VehicleSkeletonGrid count={9} />;
  if (error)     return <ErrorState message={error.message} />;
  if (!vehicles.length) return <EmptyState message="No vehicles match your search." />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map(vehicle => (
        <VehicleCard
          key={vehicle.id}
          vehicle={vehicle}
          onClick={() => onSelectVehicle(vehicle)}
        />
      ))}
    </div>
  );
}

// ─── PAGE: Wires the two together ──────────────────────────────────────────────
// src/pages/InventoryPage.tsx
export function InventoryPage() {
  const [filters, setFilters] = useState<VehicleFilters>({});
  const { data: vehicles = [], isLoading, error } = useCarInventory(filters);
  const navigate = useNavigate();

  return (
    <div>
      <FilterPanel onFiltersChange={setFilters} />
      <CarGrid
        vehicles={vehicles}
        isLoading={isLoading}
        error={error}
        onSelectVehicle={(v) => navigate(`/vehicles/${v.id}`)}
      />
    </div>
  );
}
```

---

### 5.4 Compound Component Pattern

**Category:** Structural
**Problem:** A complex `VehicleCard` component needs different slot configurations for the inventory page vs the saved-vehicles page vs the comparison tool — but you don't want a prop explosion like `showPrice`, `showMileage`, `showSaveButton`, `showCompareButton`.
**Solution:** Compound components let the consumer compose the UI from discrete subcomponents, keeping the parent clean.

```typescript
// src/components/VehicleCard/index.tsx
import { createContext, useContext } from "react";
import type { Vehicle } from "@/types/vehicle";

const CardContext = createContext<Vehicle | null>(null);
const useCard = () => {
  const ctx = useContext(CardContext);
  if (!ctx) throw new Error("Must be used inside <VehicleCard>");
  return ctx;
};

function VehicleCard({ vehicle, children }: { vehicle: Vehicle; children: ReactNode }) {
  return (
    <CardContext.Provider value={vehicle}>
      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
        {children}
      </div>
    </CardContext.Provider>
  );
}

VehicleCard.Image     = function Image()     { const v = useCard(); return <img src={v.imageUrls[0]} alt={`${v.year} ${v.make} ${v.model}`} className="w-full h-48 object-cover" />; };
VehicleCard.Title     = function Title()     { const v = useCard(); return <h3 className="font-semibold text-lg">{v.year} {v.make} {v.model}</h3>; };
VehicleCard.Price     = function Price()     { const v = useCard(); return <p className="text-2xl font-bold text-blue-600">${v.price.toLocaleString()}</p>; };
VehicleCard.Mileage   = function Mileage()   { const v = useCard(); return <p className="text-sm text-gray-500">{v.mileageKm.toLocaleString()} km</p>; };
VehicleCard.SaveButton = function SaveButton() {
  const v = useCard();
  const { saveVehicle, removeVehicle, isSaved } = useSavedVehicles();
  const saved = isSaved(v.id);
  return (
    <button onClick={() => saved ? removeVehicle(v.id) : saveVehicle(v)}>
      {saved ? "♥ Saved" : "♡ Save"}
    </button>
  );
};

export { VehicleCard };

// ─── Consumer — no prop explosion ─────────────────────────────────────────────
// Inventory page layout:
<VehicleCard vehicle={car}>
  <VehicleCard.Image />
  <VehicleCard.Title />
  <VehicleCard.Price />
  <VehicleCard.Mileage />
  <VehicleCard.SaveButton />
</VehicleCard>

// Compact comparison layout:
<VehicleCard vehicle={car}>
  <VehicleCard.Title />
  <VehicleCard.Price />
</VehicleCard>
```

---

### 5.5 Custom Hook Pattern

**Category:** Behavioral
**Problem:** Loan calculator logic (monthly payment, total interest, amortization table) is complex and would pollute a UI component if embedded directly.
**Solution:** Encapsulate all financial computation in a custom hook, keeping components concerned only with rendering.

```typescript
// src/hooks/useLoanCalculator.ts
import { useMemo } from "react";

interface LoanInput {
  vehiclePrice: number;
  downPayment: number;
  tradeInValue: number;
  annualInterestRate: number;  // e.g. 6.9 for 6.9%
  termMonths: number;
}

interface LoanResult {
  loanAmount: number;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  amortizationTable: AmortizationRow[];
}

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export function useLoanCalculator(input: LoanInput): LoanResult {
  return useMemo(() => {
    const loanAmount = input.vehiclePrice - input.downPayment - input.tradeInValue;
    const monthlyRate = input.annualInterestRate / 100 / 12;

    const monthlyPayment = monthlyRate === 0
      ? loanAmount / input.termMonths
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, input.termMonths))
        / (Math.pow(1 + monthlyRate, input.termMonths) - 1);

    const amortizationTable: AmortizationRow[] = [];
    let balance = loanAmount;

    for (let month = 1; month <= input.termMonths; month++) {
      const interest  = balance * monthlyRate;
      const principal = monthlyPayment - interest;
      balance -= principal;

      amortizationTable.push({
        month,
        payment:   parseFloat(monthlyPayment.toFixed(2)),
        interest:  parseFloat(interest.toFixed(2)),
        principal: parseFloat(principal.toFixed(2)),
        balance:   parseFloat(Math.max(0, balance).toFixed(2)),
      });
    }

    const totalCost     = monthlyPayment * input.termMonths;
    const totalInterest = totalCost - loanAmount;

    return { loanAmount, monthlyPayment, totalInterest, totalCost, amortizationTable };
  }, [input]);
}
```

---

## 6. Database Schema Design

### Entity Relationship Overview

```
users ──────────────────── saved_vehicles
  │                              │
  │                              │
  ├──── loan_applications        │
  │          │                   │
  │          │                vehicles ──── vehicle_images
  │          │                   │
  │          └─────────────────  │
  │                              │
  └──── test_drive_bookings ─────┘
               │
           dealers ──── dealer_hours
```

### Core Table Definitions

```sql
-- Users & Authentication
CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    email           VARCHAR(255) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(150),
    phone           VARCHAR(20),
    role            VARCHAR(20) DEFAULT 'buyer',   -- buyer | dealer | admin
    tier            VARCHAR(20) DEFAULT 'standard', -- standard | vip | employee
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Dealers (can be linked to a user account)
CREATE TABLE dealers (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id),
    business_name   VARCHAR(200) NOT NULL,
    license_number  VARCHAR(100) UNIQUE NOT NULL,
    city            VARCHAR(100),
    state           VARCHAR(50),
    is_verified     BOOLEAN DEFAULT FALSE
);

-- Vehicle Inventory
CREATE TABLE vehicles (
    id              SERIAL PRIMARY KEY,
    vin             VARCHAR(17) UNIQUE NOT NULL,
    dealer_id       INTEGER REFERENCES dealers(id),
    make            VARCHAR(100) NOT NULL,
    model           VARCHAR(100) NOT NULL,
    year            INTEGER NOT NULL,
    price           NUMERIC(12, 2) NOT NULL,
    mileage_km      INTEGER DEFAULT 0,
    fuel_type       VARCHAR(20),       -- petrol | diesel | electric | hybrid
    transmission    VARCHAR(20),       -- manual | automatic | cvt
    color           VARCHAR(50),
    body_style      VARCHAR(50),       -- sedan | suv | truck | coupe | van
    condition       VARCHAR(20),       -- new | certified_used | used
    status          VARCHAR(20) DEFAULT 'available', -- available | reserved | sold
    description     TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicle Images
CREATE TABLE vehicle_images (
    id              SERIAL PRIMARY KEY,
    vehicle_id      INTEGER REFERENCES vehicles(id) ON DELETE CASCADE,
    s3_key          VARCHAR(500) NOT NULL,
    cdn_url         VARCHAR(500) NOT NULL,
    is_primary      BOOLEAN DEFAULT FALSE,
    display_order   INTEGER DEFAULT 0
);

-- Loan Applications
CREATE TABLE loan_applications (
    id              SERIAL PRIMARY KEY,
    applicant_id    INTEGER REFERENCES users(id),
    vehicle_id      INTEGER REFERENCES vehicles(id),
    loan_amount     NUMERIC(12, 2) NOT NULL,
    down_payment    NUMERIC(12, 2) DEFAULT 0,
    term_months     INTEGER NOT NULL,
    credit_score    INTEGER,
    annual_income   NUMERIC(12, 2),
    status          VARCHAR(30) DEFAULT 'draft',
    -- draft | submitted | approved | rejected | funded
    interest_rate   NUMERIC(5, 3),
    approved_amount NUMERIC(12, 2),
    lender_ref      VARCHAR(200),
    submitted_at    TIMESTAMPTZ,
    decided_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Test Drive Bookings
CREATE TABLE test_drive_bookings (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id),
    vehicle_id      INTEGER REFERENCES vehicles(id),
    dealer_id       INTEGER REFERENCES dealers(id),
    scheduled_at    TIMESTAMPTZ NOT NULL,
    duration_min    INTEGER DEFAULT 30,
    status          VARCHAR(20) DEFAULT 'pending',
    -- pending | confirmed | completed | no_show | cancelled
    notes           TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Saved / Favourited Vehicles
CREATE TABLE saved_vehicles (
    id              SERIAL PRIMARY KEY,
    user_id         INTEGER REFERENCES users(id),
    vehicle_id      INTEGER REFERENCES vehicles(id),
    saved_at        TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, vehicle_id)
);

-- ─── Indexes ───────────────────────────────────────────────────────────────────
CREATE INDEX idx_vehicles_status      ON vehicles(status);
CREATE INDEX idx_vehicles_make_model  ON vehicles(make, model);
CREATE INDEX idx_vehicles_price       ON vehicles(price);
CREATE INDEX idx_vehicles_dealer      ON vehicles(dealer_id);
CREATE INDEX idx_loan_apps_applicant  ON loan_applications(applicant_id);
CREATE INDEX idx_bookings_scheduled   ON test_drive_bookings(scheduled_at);
```

---

## 7. API Design Principles

### RESTful Endpoint Structure

```
Base URL: https://api.autoelite.com/v1

─── Vehicles ──────────────────────────────────────────────────────────
GET    /vehicles                     List inventory with filters
GET    /vehicles/{id}                Single vehicle detail
POST   /vehicles                     Create listing [dealer]
PATCH  /vehicles/{id}                Update listing [dealer]
DELETE /vehicles/{id}                Remove listing [dealer/admin]
GET    /vehicles/{id}/pricing        Dynamic price calculation
GET    /vehicles/search              Full-text search

─── Loan Applications ──────────────────────────────────────────────────
POST   /loans/applications           Submit loan application
GET    /loans/applications/{id}      Application status
GET    /loans/applications           User's application history
GET    /loans/calculator             Payment estimate (no auth required)

─── Test Drive Bookings ────────────────────────────────────────────────
GET    /bookings/availability        Available slots for a dealer/vehicle
POST   /bookings                     Book a test drive
PATCH  /bookings/{id}/cancel         Cancel booking
GET    /bookings/my                  User's bookings

─── Users ──────────────────────────────────────────────────────────────
POST   /auth/register
POST   /auth/login
POST   /auth/refresh
GET    /users/me
PATCH  /users/me
GET    /users/me/saved-vehicles
POST   /users/me/saved-vehicles/{vehicle_id}
DELETE /users/me/saved-vehicles/{vehicle_id}
```

### Standard API Response Envelope

```json
// Success — paginated list
{
  "success": true,
  "data": [ ...items ],
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 347,
    "total_pages": 18
  }
}

// Success — single item
{
  "success": true,
  "data": { ...item }
}

// Error
{
  "success": false,
  "error": {
    "code": "VEHICLE_NOT_FOUND",
    "message": "No vehicle exists with ID 9999",
    "detail": null
  }
}
```

---

## 8. AWS Infrastructure Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                            AWS Cloud                                     │
│                                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │                     Public Subnets (Multi-AZ)                   │     │
│  │                                                                 │     │
│  │  Route 53 → CloudFront → Application Load Balancer             │     │
│  │                │                      │                         │     │
│  │         (S3 Static SPA)        (API Traffic)                    │     │
│  └─────────────────────────────────────────────────────────────────┘     │
│                                   │                                      │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │                    Private App Subnets                          │     │
│  │                                                                 │     │
│  │  ECS Fargate Cluster                                            │     │
│  │  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐       │     │
│  │  │ Vehicle Svc   │  │  Loan Svc     │  │  User Svc     │       │     │
│  │  │ (2–6 tasks)   │  │ (2–4 tasks)   │  │ (2–4 tasks)   │       │     │
│  │  └───────────────┘  └───────────────┘  └───────────────┘       │     │
│  │         │                  │                   │                │     │
│  │         └──────────────────┴───────────────────┘               │     │
│  │                            │                                    │     │
│  └────────────────────────────┼────────────────────────────────────┘     │
│                               │                                          │
│  ┌─────────────────────────────────────────────────────────────────┐     │
│  │                   Private Data Subnets                          │     │
│  │                                                                 │     │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌─────────────┐   │     │
│  │  │  RDS PostgreSQL  │  │ ElastiCache Redis │  │    SQS      │   │     │
│  │  │ (Multi-AZ, r6g)  │  │  (cache, sessions)│  │  (queues)   │   │     │
│  │  └──────────────────┘  └──────────────────┘  └─────────────┘   │     │
│  └─────────────────────────────────────────────────────────────────┘     │
│                                                                          │
│  ┌───────────────────────────────────────────┐                          │
│  │  Shared Services                          │                          │
│  │  S3 (images) · Secrets Manager · SES     │                          │
│  │  CloudWatch · X-Ray · WAF · ACM (TLS)    │                          │
│  └───────────────────────────────────────────┘                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### ECS Task Definition (Vehicle Service)

```json
{
  "family": "autoelite-vehicle-service",
  "cpu": "512",
  "memory": "1024",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "containerDefinitions": [{
    "name": "vehicle-api",
    "image": "123456789.dkr.ecr.ap-south-1.amazonaws.com/autoelite-vehicle:latest",
    "portMappings": [{ "containerPort": 8001 }],
    "environment": [
      { "name": "APP_ENV", "value": "production" },
      { "name": "PORT",    "value": "8001" }
    ],
    "secrets": [
      { "name": "DATABASE_URL", "valueFrom": "arn:aws:secretsmanager:ap-south-1:...db-url" },
      { "name": "REDIS_URL",    "valueFrom": "arn:aws:secretsmanager:ap-south-1:...redis" }
    ],
    "logConfiguration": {
      "logDriver": "awslogs",
      "options": {
        "awslogs-group": "/ecs/autoelite/vehicle-service",
        "awslogs-region": "ap-south-1",
        "awslogs-stream-prefix": "ecs"
      }
    },
    "healthCheck": {
      "command": ["CMD-SHELL", "curl -f http://localhost:8001/health || exit 1"],
      "interval": 30,
      "timeout": 5,
      "retries": 3
    }
  }]
}
```

---

## 9. Security Patterns

### Authentication Flow

```
1. User POSTs credentials to /auth/login
2. Server validates password hash (bcrypt)
3. Server returns { access_token (15 min), refresh_token (7 days) }
4. Client stores access_token in memory (NOT localStorage)
5. Client stores refresh_token in httpOnly cookie
6. Every API request includes: Authorization: Bearer <access_token>
7. On 401, client silently calls /auth/refresh to get new access_token
```

### Security Implementation Checklist

| Layer | Control | Implementation |
|---|---|---|
| **Transport** | TLS 1.3 only | ACM + CloudFront policy |
| **Auth** | JWT with short expiry | python-jose, 15-min access tokens |
| **Passwords** | bcrypt hashing | passlib with cost factor 12 |
| **SQL Injection** | Parameterised queries | SQLAlchemy ORM (no raw SQL) |
| **Rate Limiting** | Per-IP + per-user limits | AWS API Gateway usage plans |
| **CORS** | Whitelist specific origins | FastAPI CORS middleware |
| **Secrets** | No secrets in code/env files | AWS Secrets Manager |
| **Dependencies** | Vulnerability scanning | Dependabot + pip-audit in CI |
| **Uploads** | File type validation | python-magic + S3 pre-signed URLs |
| **WAF** | OWASP Top 10 rules | AWS WAF on CloudFront |

---

## 10. User Journey × Design Pattern Matrix

| User Action | Frontend Pattern | Backend Pattern | Infra Pattern |
|---|---|---|---|
| **Browse Inventory** | Container/Presentational renders grid; React Query caches results | Repository queries `vehicles` by filters | CloudFront caches `/vehicles` list for 5 min |
| **Search Vehicles** | Custom Hook `useVehicleSearch` with debounce | Repository full-text search with `tsvector` index | ElastiCache caches hot search terms |
| **View Vehicle Detail** | Adapter transforms API snake_case to camelCase domain model | Repository `get_by_id` + image CDN URLs | S3 + CloudFront serves images at edge |
| **Get Price Quote** | Custom Hook `useLoanCalculator` (pure computation) | Strategy Pattern selects correct pricing tier | No DB hit — computed in-memory |
| **Save to Favourites** | Observer Pattern — Context updates nav badge count | Dependency Injection validates JWT session | Write to RDS `saved_vehicles` |
| **Apply for a Loan** | Adapter maps form inputs to API schema; form validated with Zod | Factory Pattern creates correct loan workflow by credit score | SQS queues loan processing; Celery worker handles async |
| **Book Test Drive** | Compound Component `<BookingForm>` with date/time slots | Repository checks dealer availability slots | RDS write; SES confirmation email via Celery |
| **Admin Edits Listing** | Protected route + role-aware UI elements | Dependency Injection role guard (`require_role("dealer")`) | ECS task with elevated IAM role for S3 writes |
| **Purchase Vehicle** | Multi-step form with Zustand state | Unit of Work: atomically marks sold + creates invoice | RDS transaction; SQS triggers webhook to CRM |

---

## 11. Scalability & Performance Considerations

### Caching Strategy

```
L1 — React Query (in-browser)
     • Vehicle list:  5 min stale time
     • Vehicle detail: 10 min stale time
     • User profile:  1 min stale time

L2 — ElastiCache Redis (server-side)
     • Inventory search results: TTL 2 min
     • Pricing calculations:     TTL 10 min
     • Auth token validation:    TTL matches JWT expiry

L3 — CloudFront (CDN edge)
     • Static SPA assets:        Cache-Control: max-age=31536000, immutable
     • Vehicle images:           Cache-Control: max-age=86400
     • API GET responses:        Cache-Control: max-age=300 (5 min) on public endpoints
```

### Auto-Scaling Rules (ECS Fargate)

| Service | Min Tasks | Max Tasks | Scale-Out Trigger | Scale-In Trigger |
|---|---|---|---|---|
| Vehicle Service | 2 | 10 | CPU > 70% for 3 min | CPU < 30% for 10 min |
| Loan Service | 2 | 8 | Queue depth > 100 msgs | Queue depth < 10 for 5 min |
| User Service | 2 | 6 | CPU > 70% for 3 min | CPU < 30% for 10 min |

### Database Query Optimization

```python
# Use select_in loading to avoid N+1 queries when loading vehicle images
result = await session.execute(
    select(Vehicle)
    .options(selectinload(Vehicle.images))
    .where(Vehicle.status == "available")
    .limit(20)
)
```

---

## 12. Testing Strategy

### Testing Pyramid

```
               ┌─────────────────┐
               │   E2E Tests     │  ← Playwright: 20 critical user journeys
               │  (Slow, Costly) │
          ┌────┴─────────────────┴────┐
          │   Integration Tests       │  ← pytest + httpx: API contract tests
          │   (Medium Speed)          │
     ┌────┴───────────────────────────┴────┐
     │         Unit Tests                  │  ← pytest / Vitest: business logic
     │    (Fast, Numerous, Isolated)       │
     └─────────────────────────────────────┘
```

### Backend Test Example — Repository

```python
# tests/test_vehicle_repository.py
import pytest
from httpx import AsyncClient
from app.repositories.vehicle_repository import VehicleRepository

@pytest.mark.asyncio
async def test_get_available_inventory_filters_by_make(async_session, seed_vehicles):
    repo = VehicleRepository(Vehicle, async_session)
    results = await repo.get_available_inventory(make="Toyota")

    assert all(v.make == "Toyota" for v in results)
    assert all(v.status == "available" for v in results)

@pytest.mark.asyncio
async def test_pricing_strategy_selects_holiday(monkeypatch):
    from datetime import date
    from app.strategies.pricing import PricingEngine, PricingContext, HolidayPricing

    ctx = PricingContext(
        base_price=30000,
        customer_tier="standard",
        trade_in_value=0,
        current_date=date(2026, 12, 25),  # Christmas
    )
    strategy = PricingEngine.get_strategy(ctx)
    assert isinstance(strategy, HolidayPricing)
```

### Frontend Test Example — Hook

```typescript
// src/hooks/__tests__/useLoanCalculator.test.ts
import { renderHook } from "@testing-library/react";
import { useLoanCalculator } from "../useLoanCalculator";

describe("useLoanCalculator", () => {
  it("calculates correct monthly payment", () => {
    const { result } = renderHook(() => useLoanCalculator({
      vehiclePrice: 25000,
      downPayment: 5000,
      tradeInValue: 0,
      annualInterestRate: 6.0,
      termMonths: 60,
    }));

    expect(result.current.loanAmount).toBe(20000);
    expect(result.current.monthlyPayment).toBeCloseTo(386.66, 0);
    expect(result.current.amortizationTable).toHaveLength(60);
  });
});
```

---

## 13. 18-Week Development Roadmap

```
Phase 1 — Foundation (Weeks 1–4)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Week 1   Project scaffolding · AWS account setup · CI/CD pipeline
  Week 2   Database schema · Alembic migrations · Base models
  Week 3   User service — auth, JWT, registration, login
  Week 4   React app setup · Auth flows · Protected routing

Phase 2 — Core Domain (Weeks 5–10)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Week 5   Vehicle Repository · inventory CRUD endpoints
  Week 6   Pricing Strategy engine · price calculation API
  Week 7   Vehicle inventory UI · search, filters, CarGrid
  Week 8   Vehicle detail page · image gallery · loan calculator widget
  Week 9   Saved vehicles feature · Observer Pattern (Context)
  Week 10  Test drive booking — availability slots, booking flow

Phase 3 — Loan & Checkout (Weeks 11–14)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Week 11  Loan Factory · workflow engine · credit tier routing
  Week 12  Multi-step loan application form · Zod validation
  Week 13  Unit of Work — vehicle purchase atomic transaction
  Week 14  SQS integration · Celery workers · email notifications

Phase 4 — Admin & Polish (Weeks 15–18)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Week 15  Admin portal — dealer tools, listing management
  Week 16  Analytics dashboard · CloudWatch metrics · Grafana
  Week 17  Performance optimisation · Redis caching · CDN tuning
  Week 18  Security audit · Load testing · Production launch
```

---

## Appendix: Pattern Quick Reference

| Pattern | Layer | Category | Primary Benefit |
|---|---|---|---|
| Repository | Backend | Structural | Decouples DB from routes |
| Dependency Injection | Backend | Architectural | Manageable, testable dependencies |
| Strategy | Backend | Behavioral | Swappable business rules |
| Factory | Backend | Creational | Object creation without coupling |
| Unit of Work | Backend | Architectural | Atomic multi-repo transactions |
| Adapter | Frontend | Structural | Decouples API schema from UI model |
| Provider / Observer | Frontend | Behavioral | Shared state without prop-drilling |
| Container/Presentational | Frontend | Structural | Testable separation of concerns |
| Compound Component | Frontend | Structural | Flexible, prop-drilling-free UI |
| Custom Hook | Frontend | Behavioral | Reusable encapsulated logic |

---

*This document is a living specification. All diagrams, schema definitions, and code examples should be updated as the system evolves. Track changes via Git alongside the codebase.*

> **Document Owner:** Engineering Architecture · **Review Cycle:** Per Sprint · **Next Review:** Sprint 3 Kickoffeact inherently encourages certain patterns (like composition), but as your car dealership UI grows, standard software patterns become very useful.Adapter Pattern (Structural)The Problem: Sometimes the JSON data coming from your FastAPI backend doesn't perfectly match the TypeScript interfaces you want to use in your React components.The Car Dealer Fix: Create an adapter function that transforms the backend API response into the exact TypeScript interface your frontend components expect. For example, adapting a backend {"mfg_year": 2021, "car_brand": "Toyota"} to a frontend interface Car { year: number; make: string; }.Provider / Observer Pattern (Behavioral)The Problem: You need to share state (like the user's shopping cart, their saved cars, or their authentication status) across many deeply nested React components.The Car Dealer Fix: Use React Context (or a state manager like Zustand/Redux), which implements the Observer pattern. Your SavedCarsContext acts as the "Subject," and any component that needs to display the saved cars "subscribes" to it and automatically updates when a user favorites a new car.Container / Presentational Pattern (Structural)The Problem: Components become massive and messy when they handle data-fetching, complex business logic, and UI rendering.The Car Dealer Fix: Separate them. Use custom React Hooks (e.g., useCarInventory()) as the "Container" to handle fetching data from FastAPI. Pass that data to a dumb "Presentational" component (e.g., <CarGrid cars={data} />) that does nothing but render the UI cleanly.Tying It Together: The User JourneyUser ActionFrontend PatternBackend PatternBrowsing CarsContainer/Presentational renders the UI while custom hooks fetch data.Repository Pattern queries the database for active inventory.Applying for a LoanAdapter Pattern formats the user's form inputs to match the API requirements.Factory Pattern generates different loan approval workflows based on credit score.Saving to FavoritesObserver Pattern (React Context) updates the "Favorites" counter in the nav bar.Dependency Injection validates the user's JWT token to ensure they are logged in.