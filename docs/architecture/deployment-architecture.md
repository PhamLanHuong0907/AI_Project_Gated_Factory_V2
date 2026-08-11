# Deployment Architecture - Phần mềm Chấm công

## 1. Deployment Overview

| Aspect | Choice |
|--------|--------|
| Deployment Model | Containerized (Docker Compose) |
| Target Environment | Single Server / Cloud VM |
| Scaling | Vertical (initial), Horizontal (future) |
| Backup | Daily automated backups |

## 2. Docker Compose Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    DOCKER COMPOSE ARCHITECTURE                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                        docker-compose.yml                                │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │   │
│  │  │   nginx     │  │   backend   │  │  postgres   │  │   flyway    │   │   │
│  │  │  (Frontend) │  │  (Spring)   │  │  (Database) │  │  (Migrate)  │   │   │
│  │  │   :80       │  │   :8080     │  │   :5432     │  │   (init)    │   │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘   │   │
│  │         │                │                │                │            │   │
│  │         └────────────────┴────────────────┴────────────────┘            │   │
│  │                              │                                          │   │
│  │                     ┌────────▼────────┐                                │   │
│  │                     │  attendance-net │                                │   │
│  │                     │   (Network)     │                                │   │
│  │                     └─────────────────┘                                │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 3. Service Configuration

### 3.1 Frontend (Nginx)

| Setting | Value |
|---------|-------|
| Image | nginx:alpine |
| Port | 80 |
| Volume | ./frontend/dist → /usr/share/nginx/html |
| Config | Custom nginx.conf for SPA routing |

```yaml
frontend:
  image: nginx:alpine
  ports:
    - "80:80"
  volumes:
    - ./frontend/dist:/usr/share/nginx/html
    - ./nginx.conf:/etc/nginx/conf.d/default.conf
  depends_on:
    - backend
  networks:
    - attendance-net
```

### 3.2 Backend (Spring Boot)

| Setting | Value |
|---------|-------|
| Image | openjdk:21-slim |
| Port | 8080 |
| JVM Memory | -Xmx512m -Xms256m |
| Profile | docker |

```yaml
backend:
  build:
    context: ./backend
    dockerfile: Dockerfile
  ports:
    - "8080:8080"
  environment:
    - SPRING_PROFILES_ACTIVE=docker
    - SPRING_DATASOURCE_URL=jdbc:postgresql://database:5432/attendance
    - SPRING_DATASOURCE_USERNAME=attendance_user
    - SPRING_DATASOURCE_PASSWORD=${DB_PASSWORD}
    - JWT_SECRET=${JWT_SECRET}
  depends_on:
    database:
      condition: service_healthy
  networks:
    - attendance-net
```

### 3.3 Database (PostgreSQL)

| Setting | Value |
|---------|-------|
| Image | postgres:16-alpine |
| Port | 5432 |
| Volume | postgres_data:/var/lib/postgresql/data |
| Health Check | pg_isready |

```yaml
database:
  image: postgres:16-alpine
  ports:
    - "5432:5432"
  environment:
    - POSTGRES_DB=attendance
    - POSTGRES_USER=attendance_user
    - POSTGRES_PASSWORD=${DB_PASSWORD}
  volumes:
    - postgres_data:/var/lib/postgresql/data
    - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U attendance_user -d attendance"]
    interval: 10s
    timeout: 5s
    retries: 5
  networks:
    - attendance-net
```

### 3.4 Database Migration (Flyway)

| Setting | Value |
|---------|-------|
| Image | flyway/flyway:9 |
| Mode | Init only (runs on first start) |

```yaml
flyway:
  image: flyway/flyway:9
  command: -url=jdbc:postgresql://database:5432/attendance -user=attendance_user -password=${DB_PASSWORD} migrate
  volumes:
    - ./database/migrations:/flyway/sql
  depends_on:
    database:
      condition: service_healthy
  networks:
    - attendance-net
```

## 4. Environment Configuration

### 4.1 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DB_PASSWORD | PostgreSQL password | Required |
| JWT_SECRET | JWT signing secret | Required |
| SPRING_PROFILES_ACTIVE | Spring profile | docker |
| NODE_ENV | Frontend environment | production |

### 4.2 Environment Files

```
.env                    # Local development
.env.docker            # Docker environment
.env.production        # Production environment
```

## 5. Network Configuration

### 5.1 Network Topology

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         NETWORK TOPOLOGY                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                      attendance-net (bridge)                             │   │
│  │                                                                         │   │
│  │  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐              │   │
│  │  │   nginx     │────►│   backend   │────►│  postgres   │              │   │
│  │  │  172.20.0.2 │     │  172.20.0.3 │     │  172.20.0.4 │              │   │
│  │  └─────────────┘     └─────────────┘     └─────────────┘              │   │
│  │                                                                         │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                            │
│                                    ▼                                            │
│                         ┌─────────────────┐                                    │
│                         │   Host Network   │                                    │
│                         │    (Port 80)     │                                    │
│                         └─────────────────┘                                    │
│                                    │                                            │
│                                    ▼                                            │
│                         ┌─────────────────┐                                    │
│                         │    Internet      │                                    │
│                         └─────────────────┘                                    │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Port Mapping

| Service | Container Port | Host Port | Protocol |
|---------|----------------|-----------|----------|
| Frontend | 80 | 80 | HTTP |
| Backend | 8080 | 8080 | HTTP |
| Database | 5432 | 5432 | TCP |

## 6. Volume Configuration

### 6.1 Persistent Volumes

| Volume | Purpose | Backup |
|--------|---------|--------|
| postgres_data | Database storage | Daily |
| backend_logs | Application logs | Weekly |
| nginx_logs | Access/error logs | Weekly |

### 6.2 Volume Configuration

```yaml
volumes:
  postgres_data:
    driver: local
  backend_logs:
    driver: local
  nginx_logs:
    driver: local
```

## 7. Health Checks

### 7.1 Service Health Checks

| Service | Check | Interval | Timeout | Retries |
|---------|-------|----------|---------|---------|
| Database | pg_isready | 10s | 5s | 5 |
| Backend | /actuator/health | 30s | 10s | 3 |
| Frontend | curl localhost:80 | 30s | 5s | 3 |

### 7.2 Health Check Configuration

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## 8. Logging Configuration

### 8.1 Log Drivers

| Service | Log Driver | Max Size | Max File |
|---------|------------|----------|----------|
| All | json-file | 10m | 3 |

### 8.2 Log Configuration

```yaml
logging:
  driver: "json-file"
  options:
    max-size: "10m"
    max-file: "3"
```

## 9. Backup Strategy

### 9.1 Backup Schedule

| Component | Frequency | Retention | Method |
|-----------|-----------|-----------|--------|
| Database | Daily | 30 days | pg_dump |
| Application | On deploy | Last 5 | Docker image |
| Configuration | On change | All versions | Git |

### 9.2 Backup Script

```bash
#!/bin/bash
# backup.sh
BACKUP_DIR="/backups/attendance"
DATE=$(date +%Y%m%d_%H%M%S)

# Database backup
docker exec database pg_dump -U attendance_user attendance | gzip > $BACKUP_DIR/db_$DATE.sql.gz

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete
```

## 10. Deployment Commands

### 10.1 First Deployment

```bash
# Clone repository
git clone <repository-url>
cd attendance-system

# Create environment file
cp .env.example .env
# Edit .env with secrets

# Build and start
docker-compose up -d

# Verify
docker-compose ps
docker-compose logs -f
```

### 10.2 Updates

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose up -d --build

# Run migrations (if needed)
docker-compose run flyway migrate
```

### 10.3 Rollback

```bash
# Stop current
docker-compose down

# Checkout previous version
git checkout <previous-commit>

# Restart
docker-compose up -d
```

## 11. Monitoring

### 11.1 Metrics to Monitor

| Metric | Threshold | Alert |
|--------|-----------|-------|
| CPU Usage | > 80% | Warning |
| Memory Usage | > 85% | Warning |
| Disk Usage | > 90% | Critical |
| Response Time | > 3s | Warning |
| Error Rate | > 5% | Critical |

### 11.2 Monitoring Stack (Optional)

| Tool | Purpose |
|------|---------|
| Prometheus | Metrics collection |
| Grafana | Visualization |
| ELK Stack | Log aggregation |
