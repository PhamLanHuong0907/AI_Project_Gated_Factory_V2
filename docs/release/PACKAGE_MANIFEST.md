# Package Manifest — PAS v1.0.0

## Release Package Contents

### Source Code
```
AI_Project_Gated_Factory_V2/
├── backend/
│   ├── src/main/java/com/pas/backend/
│   │   ├── entity/          # JPA entities
│   │   ├── dto/             # Data transfer objects
│   │   ├── repository/      # JPA repositories
│   │   ├── service/         # Business logic
│   │   ├── controller/      # REST controllers
│   │   ├── security/        # JWT, SecurityConfig
│   │   ├── config/          # OpenAPI, CORS
│   │   └── exception/       # Global exception handler
│   ├── src/main/resources/
│   │   └── db/migration/    # Flyway SQL migrations
│   └── build.gradle
├── frontend/
│   ├── src/
│   │   ├── pages/           # 12 screen components
│   │   ├── shell/           # App shell with navigation
│   │   ├── components/      # Shared UI components
│   │   ├── services/        # API client
│   │   └── App.tsx          # Router configuration
│   └── package.json
├── tests/
│   └── e2e/                 # Playwright E2E tests
├── docs/
│   ├── release/             # Release documentation
│   └── ui-ux/               # UI/UX specifications
└── compose-test/            # Docker Compose for test/UAT
```

### Documentation
| File | Description |
|------|-------------|
| `DEPLOYMENT_GUIDE.md` | Step-by-step deployment instructions |
| `OPERATIONS_GUIDE.md` | Day-to-day operations procedures |
| `RELEASE_NOTES.md` | Feature list and known issues |
| `ACCEPTANCE_CHECKLIST.md` | Release gate verification |
| `TEST_STRATEGY.md` | Test approach and coverage |
| `PACKAGE_MANIFEST.md` | This file |

### Configuration Files
| File | Purpose |
|------|---------|
| `docker-compose.test.yml` | Test/UAT environment |
| `playwright.config.ts` | E2E test configuration |
| `.env.example` | Environment variables template |

### Database Migrations
| Version | Description |
|---------|-------------|
| V1__init.sql | Schema creation (users, shifts, attendance, etc.) |
| V2__seed_data.sql | Demo data for testing |
| V3__fix_seed_passwords.sql | BCrypt password hash fixes |

### Test Evidence
| File | Description |
|------|-------------|
| `tests/evidence/results.json` | Playwright test results |
| `tests/evidence/artifacts/` | Screenshots, videos, traces |

## Dependencies

### Backend
| Dependency | Version | Purpose |
|------------|---------|---------|
| Spring Boot | 3.4.1 | Web framework |
| Java | 24 | Runtime |
| PostgreSQL | 16 | Database |
| Flyway | — | Database migrations |
| SpringDoc | 2.8.6 | API documentation |
| Lombok | 1.18.38 | Code generation |
| MapStruct | — | DTO mapping |
| JJWT | — | JWT authentication |

### Frontend
| Dependency | Version | Purpose |
|------------|---------|---------|
| React | 19 | UI framework |
| TypeScript | — | Type safety |
| Vite | 6 | Build tool |
| Tailwind CSS | 3 | Styling |
| React Router | 6 | Routing |
| qrcode.react | — | QR code generation |
| xlsx | — | Excel export |
| lucide-react | — | Icons |

### Dev Dependencies
| Dependency | Version | Purpose |
|------------|---------|---------|
| Playwright | — | E2E testing |
| Vitest | — | Unit testing |
| ESLint | — | Code linting |

## Build Artifacts

### Docker Images
- `pas-backend:1.0.0` — Spring Boot application
- `pas-frontend:1.0.0` — React application (served by nginx)

### Database
- PostgreSQL 16 with Flyway-managed schema
- Seed data included for demo/testing

## Verification Commands

```bash
# Backend build
cd backend && ./gradlew build

# Frontend build
cd frontend && npm run build

# E2E tests
npx playwright test

# Docker build
docker-compose build

# Smoke tests
npx playwright test tests/e2e/smoke.spec.ts
```

## Gate Status

**RELEASE_GATE**: ✅ READY FOR USER ACCEPTANCE SIGN-OFF

All artifacts verified. Documentation complete. Test evidence preserved.
