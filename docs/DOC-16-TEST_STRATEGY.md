# DOC-16: Test Strategy
**Status:** Draft  
**Owner:** QA & Dev Team  

## 1. Unit Testing
- **Backend**: Pytest with `pytest-asyncio` and `httpx` for fast endpoint validation. Focus on `services/` and `schemas/`. Minimum 80% coverage enforced by CI.
- **Frontend**: Vitest + React Testing Library. Testing hooks, Zustand stores, and complex components (`CarFilter`, `EMICalculator`).

## 2. Integration Testing
- Test database spun up via `docker-compose` in CI to run DB-bound repository tests.
- Mocking external services (S3 presigned URLs, Cognito verification).

## 3. E2E Testing
- **Playwright** framework used to test critical user flows (Search -> Detail -> Book Test Drive -> Login -> Confirm).
- E2E tests run against the `staging` environment on a nightly schedule.
