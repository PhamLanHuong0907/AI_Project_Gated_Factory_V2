# Operations Guide — PAS v1.0.0

## Service Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Backend       │────▶│   PostgreSQL    │
│   (React/Vite)  │     │   (Spring Boot) │     │   (Database)    │
│   Port: 3000    │     │   Port: 8080    │     │   Port: 5432    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Service Management

### Start Services
```bash
# Production
docker-compose -f docker-compose.prod.yml up -d

# Test/UAT
cd compose-test
docker-compose -f docker-compose.test.yml up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f pas-backend
docker-compose logs -f pas-frontend
docker-compose logs -f pas-postgres
```

### Restart Services
```bash
docker-compose restart pas-backend
```

## Monitoring

### Health Checks
```bash
# Backend
curl http://localhost:8080/actuator/health

# Frontend
curl http://localhost:3000

# Database
pg_isready -h localhost -p 5432 -U pas_prod
```

### Key Metrics to Watch
- Backend response time < 500ms
- Database connection pool usage < 80%
- Memory usage < 80%
- Disk usage < 85%

## Troubleshooting

### Backend Won't Start
1. Check database connection:
   ```bash
   psql -h localhost -U pas_prod -d pas_production -c "SELECT 1"
   ```
2. Check logs:
   ```bash
   docker-compose logs pas-backend | tail -50
   ```
3. Verify environment variables are set correctly

### Frontend Shows Blank Page
1. Check if backend is running:
   ```bash
   curl http://localhost:8080/api/auth/login -X POST -d '{"email":"admin@pas.vn","password":"admin123"}' -H "Content-Type: application/json"
   ```
2. Check browser console for errors
3. Verify `VITE_API_URL` is correct

### Database Connection Issues
1. Check PostgreSQL is running:
   ```bash
   docker-compose ps pas-postgres
   ```
2. Check connection:
   ```bash
   psql -h localhost -p 5433 -U pas_test -d pas_test
   ```
3. Check Flyway migrations:
   ```bash
   docker-compose logs pas-backend | grep flyway
   ```

## Backup Procedures

### Database Backup
```bash
# Manual backup
pg_dump -h localhost -U pas_prod -d pas_production -F c -f backup_$(date +%Y%m%d_%H%M%S).dump

# Automated backup (cron)
0 2 * * * pg_dump -h localhost -U pas_prod -d pas_production -F c -f /backups/pas_$(date +\%Y\%m\%d).dump
```

### Restore from Backup
```bash
# Stop backend
docker-compose stop pas-backend

# Restore database
pg_restore -h localhost -U pas_prod -d pas_production -c backup_20260810.dump

# Start backend
docker-compose start pas-backend
```

## Security Operations

### Rotate JWT Secret
1. Generate new secret:
   ```bash
   openssl rand -base64 64
   ```
2. Update environment variable
3. Restart backend
4. All users will need to re-login

### Password Reset
```bash
# Generate BCrypt hash
node -e "console.log(require('bcryptjs').hashSync('newpassword', 10))"

# Update in database
psql -h localhost -U pas_prod -d pas_production -c "UPDATE users SET password_hash = '<new-hash>' WHERE email = '<email>'"
```

## Performance Tuning

### Database
- Monitor slow queries:
  ```sql
  SELECT query, mean_time, calls
  FROM pg_stat_statements
  ORDER BY mean_time DESC
  LIMIT 10;
  ```

### Backend
- JVM heap size: Set `-Xmx512m` in production
- Connection pool: Monitor HikariCP metrics

### Frontend
- Enable gzip compression in nginx
- Cache static assets (1 year)
- Use CDN for production

## Support Contacts

- **Development Team**: dev@pas.vn
- **Operations**: ops@pas.vn
- **Emergency**: +84-xxx-xxx-xxx
