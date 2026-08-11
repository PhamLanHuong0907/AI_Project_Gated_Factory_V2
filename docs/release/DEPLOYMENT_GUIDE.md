# Deployment Guide — Precision Attendance System (PAS)

## Overview

PAS is a full-stack application:
- **Frontend**: React 19 + TypeScript + Vite 6 + Tailwind CSS 3
- **Backend**: Spring Boot 3.4.1 + Java 24 + PostgreSQL 16
- **Database**: PostgreSQL with Flyway migrations

## Prerequisites

- Docker & Docker Compose
- Java 24+ (for local development)
- Node.js 20+ (for local development)
- PostgreSQL 16 (if running locally)

## Production Deployment

### 1. Clone Repository
```bash
git clone <repository-url>
cd AI_Project_Gated_Factory_V2
```

### 2. Environment Configuration

Create `.env` file in project root:
```env
# Database
POSTGRES_DB=pas_production
POSTGRES_USER=pas_prod
POSTGRES_PASSWORD=<secure-password>

# JWT
JWT_SECRET=<random-64-char-string>

# Frontend
VITE_API_URL=https://api.yourdomain.com
```

### 3. Start Services
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 4. Verify Deployment
```bash
# Check backend health
curl https://api.yourdomain.com/actuator/health

# Check frontend
curl https://yourdomain.com
```

## Test/UAT Deployment

### Using Docker Compose (Test)
```bash
cd compose-test
docker-compose -f docker-compose.test.yml up -d

# Frontend: http://localhost:3001
# Backend: http://localhost:8081
# Database: localhost:5433
```

### Running E2E Tests
```bash
# Install Playwright
npx playwright install chromium

# Run tests against test environment
E2E_BASE_URL=http://localhost:3001 E2E_API_URL=http://localhost:8081 npx playwright test
```

## Database Migrations

Flyway runs automatically on backend startup. Migration files:
- `V1__init.sql` — Schema creation
- `V2__seed_data.sql` — Demo data
- `V3__fix_seed_passwords.sql` — Password hash fixes

**Never modify approved migrations.** Create new V4, V5, etc. for changes.

## Rollback Procedure

### Database Rollback
1. Stop backend
2. Restore database from backup:
   ```bash
   pg_restore -d pas_production backup.dump
   ```
3. Start backend (Flyway will verify schema matches)

### Application Rollback
1. Stop current version
2. Deploy previous Docker image tag
3. Verify health checks pass

## Backup Strategy

### Database Backup
```bash
# Daily backup
pg_dump -d pas_production -f backup_$(date +%Y%m%d).dump

# Backup to S3 (if configured)
aws s3 cp backup_$(date +%Y%m%d).dump s3://pas-backups/
```

### Restore
```bash
pg_restore -d pas_production backup_20260810.dump
```

## Monitoring

### Health Checks
- Backend: `GET /actuator/health`
- Frontend: `GET /` (should return 200)
- Database: `pg_isready -U pas_prod -d pas_production`

### Logs
```bash
# Docker logs
docker logs pas_backend --tail 100
docker logs pas_frontend --tail 100
docker logs pas_postgres --tail 100
```

## Security Notes

- JWT tokens expire after 24 hours
- Passwords are bcrypt-hashed (10 rounds)
- CORS configured for specific origins in production
- Never commit secrets to version control
- Use environment variables for all sensitive configuration
