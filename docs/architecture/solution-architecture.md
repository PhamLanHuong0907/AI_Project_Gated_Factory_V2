# Solution Architecture - Phần mềm Chấm công

## 1. Architecture Overview

| Field | Value |
|-------|-------|
| Architecture Style | Monolithic with Modular Design |
| Deployment | Single Server / Docker Compose |
| Database | PostgreSQL (Single Tenant) |

## 2. High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           SOLUTION ARCHITECTURE                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                           PRESENTATION LAYER                            │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │   │
│  │  │  Attendance  │  │  Dashboard  │  │   Reports   │  │   Admin     │   │   │
│  │  │    (PWA)     │  │   (React)   │  │   (React)   │  │   (React)   │   │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                           APPLICATION LAYER                             │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │  │                    Spring Boot Application                       │   │   │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │   │   │
│  │  │  │   Auth   │ │   QR     │ │   GPS    │ │Attendance│          │   │   │
│  │  │  │ Module   │ │ Module   │ │ Module   │ │  Module  │          │   │   │
│  │  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │   │   │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │   │   │
│  │  │  │ Reports  │ │  Shift   │ │  Salary  │ │Dashboard │          │   │   │
│  │  │  │ Module   │ │  Config  │ │  Config  │ │  Module  │          │   │   │
│  │  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │   │   │
│  │  └─────────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                            DATA LAYER                                   │   │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │   │
│  │  │                      PostgreSQL Database                         │   │   │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │   │   │
│  │  │  │  Users   │ │Attendance│ │   QR     │ │  Shift   │          │   │   │
│  │  │  │  Table   │ │  Table   │ │  Table   │ │  Table   │          │   │   │
│  │  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │   │   │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │   │   │
│  │  │  │  Salary  │ │  Config  │ │  Audit   │ │  Session │          │   │   │
│  │  │  │  Table   │ │  Table   │ │  Log     │ │  Table   │          │   │   │
│  │  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │   │   │
│  │  └─────────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 3. Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Frontend | ReactJS | 18.x | UI Components |
| Frontend | TypeScript | 5.x | Type Safety |
| Frontend | Tailwind CSS | 3.x | Styling |
| Frontend | PWA | - | Mobile Support |
| Backend | Java | 21 | Runtime |
| Backend | Spring Boot | 3.2.x | Framework |
| Backend | Spring Security | 6.x | Authentication |
| Backend | Spring Data JPA | 3.x | Data Access |
| Database | PostgreSQL | 16.x | Primary DB |
| Migration | Flyway | 9.x | DB Migration |
| Build | Maven | 3.9.x | Build Tool |
| Container | Docker | 24.x | Containerization |
| Container | Docker Compose | 2.x | Orchestration |

## 4. Module Architecture

### 4.1 Module Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         MODULE DEPENDENCY GRAPH                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│                         ┌───────────────────┐                                   │
│                         │   MOD-07: Auth     │                                   │
│                         │   (Foundation)     │                                   │
│                         └─────────┬─────────┘                                   │
│                                   │                                             │
│              ┌────────────────────┼────────────────────┐                        │
│              │                    │                    │                        │
│              ▼                    ▼                    ▼                        │
│    ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│    │   MOD-08: User  │  │   MOD-05: QR    │  │   MOD-03: Shift │              │
│    │   Management    │  │   Generation    │  │   Config        │              │
│    └────────┬────────┘  └────────┬────────┘  └────────┬────────┘              │
│             │                    │                    │                        │
│             └────────────────────┼────────────────────┘                        │
│                                  │                                             │
│                                  ▼                                             │
│                    ┌───────────────────────────┐                               │
│                    │      MOD-01: QR           │                               │
│                    │      Attendance           │                               │
│                    │  (Core Business Logic)    │                               │
│                    └─────────────┬─────────────┘                               │
│                                  │                                             │
│           ┌──────────────────────┼──────────────────────┐                     │
│           │                      │                      │                     │
│           ▼                      ▼                      ▼                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐              │
│  │  MOD-02: Mobile │  │  MOD-03: Report │  │  MOD-04: Dash   │              │
│  │  Responsive     │  │  & Salary       │  │  board          │              │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘              │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Module Ownership

| Module | Owner | Responsibility |
|--------|-------|----------------|
| MOD-01 | Core Team | QR Attendance business logic |
| MOD-02 | Frontend Team | Mobile responsive UI |
| MOD-03 | Backend Team | Reports and salary calculation |
| MOD-04 | Frontend Team | Dashboard visualization |
| MOD-05 | Core Team | QR code generation |
| MOD-06 | Core Team | GPS verification |
| MOD-07 | Security Team | Authentication and session |
| MOD-08 | Backend Team | User CRUD operations |

## 5. Security Architecture

### 5.1 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        AUTHENTICATION FLOW                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐             │
│  │  Client  │────►│  API     │────►│ Security │────►│Database  │             │
│  │  (PWA)   │     │ Gateway  │     │ Filter   │     │          │             │
│  └──────────┘     └──────────┘     └──────────┘     └──────────┘             │
│       │                │                │                │                     │
│       │ 1. Login       │                │                │                     │
│       │───────────────►│                │                │                     │
│       │                │ 2. Validate    │                │                     │
│       │                │───────────────►│                │                     │
│       │                │                │ 3. Check       │                     │
│       │                │                │───────────────►│                     │
│       │                │                │ 4. Return      │                     │
│       │                │                │◄───────────────│                     │
│       │                │ 5. Create      │                │                     │
│       │                │    Session     │                │                     │
│       │ 6. JWT Token   │                │                │                     │
│       │◄───────────────│                │                │                     │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Authorization Matrix

| Resource | Employee (ACT-01) | Admin (ACT-02) | HR (ACT-03) |
|----------|-------------------|----------------|-------------|
| POST /api/auth/login | ✅ | ✅ | ✅ |
| POST /api/attendance/scan | ✅ | ✅ | ✅ |
| GET /api/attendance/me | ✅ | ❌ | ❌ |
| GET /api/attendance | ❌ | ✅ | ✅ |
| POST /api/qr/generate | ✅ | ✅ | ❌ |
| GET /api/reports/monthly | ❌ | ✅ | ✅ |
| GET /api/salary/config | ❌ | ✅ | ✅ |
| PUT /api/salary/config | ❌ | ✅ | ❌ |
| GET /api/users | ❌ | ✅ | ❌ |
| POST /api/users | ❌ | ✅ | ❌ |

### 5.3 Security Policies

| Policy | Implementation |
|--------|----------------|
| Password Hashing | BCrypt (Strength: 12) |
| Session Timeout | Configurable (default: 8 hours) |
| JWT Expiration | 24 hours |
| Failed Login Lockout | 5 attempts → 5 min lockout |
| CORS | Configured for frontend domain |
| Rate Limiting | 100 requests/minute per user |

## 6. Integration Architecture

### 6.1 Internal Integrations

| Integration | Protocol | Purpose |
|-------------|----------|---------|
| Frontend → Backend | REST API (HTTPS) | All operations |
| Backend → Database | JDBC | Data persistence |
| Backend → GPS | Browser API | Location services |
| Backend → Camera | Browser API | QR scanning |

### 6.2 External Integrations (Future)

| System | Protocol | Purpose | Status |
|--------|----------|---------|--------|
| HR System | REST API | Employee sync | Not in scope v1 |
| Payroll System | REST API | Salary data | Not in scope v1 |
| Email Service | SMTP | Notifications | Optional |

## 7. Deployment Architecture

### 7.1 Docker Compose Deployment

```yaml
# docker-compose.yml structure
services:
  frontend:
    image: nginx:alpine
    ports: ["80:80"]
    
  backend:
    image: openjdk:21-slim
    ports: ["8080:8080"]
    
  database:
    image: postgres:16-alpine
    ports: ["5432:5432"]
    
  flyway:
    image: flyway/flyway:9
    depends_on: [database]
```

### 7.2 Environment Configuration

| Environment | Database | Backend | Frontend |
|-------------|----------|---------|----------|
| Development | localhost:5432 | localhost:8080 | localhost:3000 |
| Testing | test-db:5432 | test-api:8080 | test-ui:3000 |
| Production | prod-db:5432 | prod-api:8080 | prod-ui:80 |

## 8. Data Flow

### 8.1 QR Attendance Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    QR ATTENDANCE DATA FLOW                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  1. Employee opens PWA                                                          │
│     │                                                                           │
│  2. Login (username/password)                                                   │
│     │                                                                           │
│  3. System creates session (JWT)                                                │
│     │                                                                           │
│  4. Employee scans QR code                                                      │
│     │                                                                           │
│  5. System gets GPS location                                                    │
│     │                                                                           │
│  6. System validates:                                                           │
│     ├── QR code valid?                                                          │
│     ├── QR not expired?                                                         │
│     ├── GPS distance ≤ threshold?                                               │
│     └── No duplicate scan?                                                      │
│     │                                                                           │
│  7. If all pass:                                                                │
│     ├── Record attendance (timestamp, type IN/OUT)                              │
│     ├── Return success + haptic feedback                                        │
│     └── Log audit trail                                                         │
│     │                                                                           │
│  8. If any fail:                                                                │
│     └── Return error with details                                               │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 9. Decision Log

| ID | Decision | Rationale | Alternatives | Status |
|----|----------|-----------|--------------|--------|
| DEC-01 | Use PostgreSQL | ACID compliance, JSON support | MySQL, MongoDB | APPROVED |
| DEC-02 | PWA over Native | Lower cost, cross-platform | Native iOS/Android | APPROVED |
| DEC-03 | JWT Authentication | Stateless, scalable | Session-based | APPROVED |
| DEC-04 | Monolithic Architecture | Simple deployment, MVP scope | Microservices | APPROVED |
| DEC-05 | Flyway for Migrations | Version control, rollback | Liquibase | APPROVED |
| DEC-06 | GPS threshold 50m default | Indoor accuracy issues | 10m (too strict) | APPROVED |
| DEC-07 | Dynamic QR (15-30s) | Anti-fraud, prevent sharing | Static QR | APPROVED |
| DEC-08 | No offline support | GPS anti-fraud requirement | Offline cache | APPROVED |
| DEC-09 | Server time only | Prevent time manipulation | Device time | APPROVED |
| DEC-10 | Single tenant v1 | Simplify data model | Multi-tenant | APPROVED |
