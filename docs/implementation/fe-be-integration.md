# Frontend-Backend Integration Report

**Date**: 2026-08-10
**Status**: MOCK_MODE (ready for real API integration)

## Architecture

```
Frontend (Vite :3000)
  ├── Mock Mode (default) — in-memory data, no backend needed
  └── Real Mode (VITE_API_URL set) — proxies to Spring Boot :8080
         └── Spring Boot :8080
               └── PostgreSQL :5432
```

## Switching Mechanism

| Environment Variable | Mode | Description |
|---------------------|------|-------------|
| `VITE_API_URL` not set | MOCK | Uses in-memory mock data |
| `VITE_API_URL=http://localhost:8080` | REAL | Calls real Spring Boot API |

## API Client Structure

| File | Purpose |
|------|---------|
| `services/types.ts` | TypeScript DTOs aligned with OpenAPI |
| `services/api.ts` | API client with mock/real switch |
| `services/mock-data.ts` | Mock data matching DB seed |
| `services/auth-context.tsx` | Auth state + JWT token management |
| `services/mock-delay.ts` | Simulated network latency |

## Mock-to-Real Mapping

| Frontend Method | Mock Behavior | Real Endpoint |
|-----------------|---------------|---------------|
| `api.auth.login()` | Checks MOCK_LOGIN_MAP | POST /auth/login |
| `api.users.list()` | Filters MOCK_USERS | GET /users |
| `api.attendance.list()` | Filters MOCK_ATTENDANCE | GET /attendance |
| `api.leaveRequests.list()` | Filters MOCK_LEAVE_REQUESTS | GET /leave-requests |
| `api.shifts.list()` | Filters MOCK_SHIFTS | GET /shifts |
| `api.salaryConfig.positions.list()` | Returns MOCK_SALARY_POSITIONS | GET /salary/positions |
| `api.config.gps.get()` | Returns MOCK_GPS_CONFIG | GET /config/gps |

## Integration Checklist

- [x] Frontend types match OpenAPI schemas
- [x] Mock data matches seed data (V2__seed_data.sql)
- [x] API client methods match controller endpoints
- [x] Auth context stores JWT token
- [x] Error handling matches backend error format
- [ ] Replace mocks with real API calls (integration phase)
- [ ] Test all CRUD operations end-to-end
- [ ] Verify RBAC enforcement
- [ ] Test file upload flow

## Backend Startup

```bash
# 1. Start PostgreSQL
docker-compose up -d

# 2. Start Spring Boot
cd backend && ./gradlew bootRun

# 3. Start Frontend (with real API)
cd frontend && VITE_API_URL=http://localhost:8080 npm run dev
```

## Database Migrations

| Version | File | Description |
|---------|------|-------------|
| V1 | V1__init_schema.sql | Full schema: 15 tables |
| V2 | V2__seed_data.sql | 3 users, 3 shifts, configs |

## Seed Data (Default Accounts)

| Email | Password | Role |
|-------|----------|------|
| admin@pas.com | admin123 | ADMIN |
| hr@pas.com | hr123 | HR_MANAGER |
| employee@pas.com | emp123 | EMPLOYEE |
