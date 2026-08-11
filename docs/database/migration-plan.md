# Migration Plan - Phần mềm Chấm công

## 1. Migration Overview

| Aspect | Value |
|--------|-------|
| Migration Tool | Flyway |
| Database | PostgreSQL 16 |
| Naming Convention | V{version}__{description}.sql |
| Baseline | V1.0.0 |

## 2. Migration Strategy

### 2.1 Principles

1. **Never modify applied migrations** - Create new migrations for changes
2. **Idempotent migrations** - Use IF NOT EXISTS where possible
3. **Reversible when possible** - Include down migrations for critical changes
4. **Test before apply** - Run migrations in dev/staging first
5. **Backup before production** - Always backup before applying migrations

### 2.2 Migration Order

```
V1.0.0__create_shifts.sql
    ↓
V1.0.1__create_users.sql
    ↓
V1.0.2__create_qr_codes.sql
    ↓
V1.0.3__create_attendance.sql
    ↓
V1.0.4__create_salary_config.sql
    ↓
V1.0.5__create_system_config.sql
    ↓
V1.0.6__create_audit_log.sql
    ↓
V1.0.7__seed_data.sql
```

## 3. Migration Files

### V1.0.0__create_shifts.sql

```sql
-- V1.0.0: Create shifts table
CREATE TABLE IF NOT EXISTS shifts (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    grace_period INTEGER NOT NULL DEFAULT 15,
    work_days VARCHAR(20) NOT NULL DEFAULT '1,2,3,4,5',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_shifts_name UNIQUE (name),
    CONSTRAINT chk_shifts_grace_period CHECK (grace_period >= 0 AND grace_period <= 60)
);

CREATE INDEX idx_shifts_active ON shifts(is_active);

COMMENT ON TABLE shifts IS 'Work shift configurations';
```

### V1.0.1__create_users.sql

```sql
-- V1.0.1: Create users table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'EMPLOYEE',
    shift_id BIGINT,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    failed_attempts INTEGER NOT NULL DEFAULT 0,
    locked_until TIMESTAMP NOT NULL DEFAULT '1970-01-01',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_username UNIQUE (username),
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT fk_users_shift FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE SET NULL,
    CONSTRAINT chk_users_role CHECK (role IN ('EMPLOYEE', 'ADMIN', 'HR_MANAGER')),
    CONSTRAINT chk_users_status CHECK (status IN ('ACTIVE', 'INACTIVE', 'LOCKED'))
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_shift ON users(shift_id);

COMMENT ON TABLE users IS 'System users (employees, admins, HR)';
```

### V1.0.2__create_qr_codes.sql

```sql
-- V1.0.2: Create qr_codes table
CREATE TABLE IF NOT EXISTS qr_codes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    code VARCHAR(255) NOT NULL,
    signature VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_qr_codes_code UNIQUE (code),
    CONSTRAINT fk_qr_codes_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_qr_codes_status CHECK (status IN ('ACTIVE', 'EXPIRED', 'USED'))
);

CREATE INDEX idx_qr_codes_user ON qr_codes(user_id);
CREATE INDEX idx_qr_codes_code ON qr_codes(code);
CREATE INDEX idx_qr_codes_expires ON qr_codes(expires_at);
CREATE INDEX idx_qr_codes_status ON qr_codes(status);

COMMENT ON TABLE qr_codes IS 'Generated QR codes for attendance';
```

### V1.0.3__create_attendance.sql

```sql
-- V1.0.3: Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    qr_id BIGINT NOT NULL,
    type VARCHAR(4) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    gps_lat DECIMAL(10, 8),
    gps_lng DECIMAL(11, 8),
    distance DECIMAL(10, 2),
    status VARCHAR(20) NOT NULL DEFAULT 'VALID',
    flag VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attendance_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_attendance_qr FOREIGN KEY (qr_id) REFERENCES qr_codes(id) ON DELETE RESTRICT,
    CONSTRAINT chk_attendance_type CHECK (type IN ('IN', 'OUT')),
    CONSTRAINT chk_attendance_status CHECK (status IN ('VALID', 'INVALID', 'PENDING')),
    CONSTRAINT chk_attendance_flag CHECK (flag IS NULL OR flag IN ('AUTO_OUT', 'MANUAL_OVERRIDE', 'LATE', 'EARLY'))
);

CREATE INDEX idx_attendance_user ON attendance(user_id);
CREATE INDEX idx_attendance_date ON attendance(timestamp);
CREATE INDEX idx_attendance_type ON attendance(type);
CREATE INDEX idx_attendance_status ON attendance(status);
CREATE INDEX idx_attendance_user_date ON attendance(user_id, timestamp);

COMMENT ON TABLE attendance IS 'Attendance records';
```

### V1.0.4__create_salary_config.sql

```sql
-- V1.0.4: Create salary_config table
CREATE TABLE IF NOT EXISTS salary_config (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category VARCHAR(50) NOT NULL,
    base_salary DECIMAL(15, 2) NOT NULL,
    formula TEXT,
    late_penalty_rate DECIMAL(10, 2) NOT NULL DEFAULT 0,
    leave_penalty_rate DECIMAL(10, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_salary_config_user UNIQUE (user_id),
    CONSTRAINT fk_salary_config_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_salary_config_base CHECK (base_salary >= 0),
    CONSTRAINT chk_salary_config_late CHECK (late_penalty_rate >= 0),
    CONSTRAINT chk_salary_config_leave CHECK (leave_penalty_rate >= 0)
);

CREATE INDEX idx_salary_config_user ON salary_config(user_id);
CREATE INDEX idx_salary_config_category ON salary_config(category);

COMMENT ON TABLE salary_config IS 'Salary configuration per employee';
```

### V1.0.5__create_system_config.sql

```sql
-- V1.0.5: Create system_config table
CREATE TABLE IF NOT EXISTS system_config (
    id BIGSERIAL PRIMARY KEY,
    config_key VARCHAR(100) NOT NULL,
    config_value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_system_config_key UNIQUE (config_key)
);

CREATE INDEX idx_system_config_key ON system_config(config_key);

COMMENT ON TABLE system_config IS 'System configuration key-value pairs';
```

### V1.0.6__create_audit_log.sql

```sql
-- V1.0.6: Create audit_log table
CREATE TABLE IF NOT EXISTS audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    event_type VARCHAR(50) NOT NULL,
    resource VARCHAR(100),
    action VARCHAR(50),
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_audit_log_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_event ON audit_log(event_type);
CREATE INDEX idx_audit_log_date ON audit_log(created_at);
CREATE INDEX idx_audit_log_resource ON audit_log(resource);

COMMENT ON TABLE audit_log IS 'Audit trail for security events';
```

### V1.0.7__seed_data.sql

```sql
-- V1.0.7: Seed data
-- See seed-data.md for complete seed data
```

## 4. Migration Commands

### 4.1 Run Migrations

```bash
# Using Docker Compose
docker-compose run flyway migrate

# Using Flyway CLI
flyway -url=jdbc:postgresql://localhost:5432/attendance \
       -user=attendance_user \
       -password=your_password \
       migrate
```

### 4.2 Check Migration Status

```bash
flyway info
```

### 4.3 Validate Migrations

```bash
flyway validate
```

### 4.4 Repair Migration History

```bash
flyway repair
```

## 5. Rollback Strategy

### 5.1 Manual Rollback

```sql
-- Drop tables in reverse order
DROP TABLE IF EXISTS audit_log CASCADE;
DROP TABLE IF EXISTS system_config CASCADE;
DROP TABLE IF EXISTS salary_config CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS qr_codes CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS shifts CASCADE;
```

### 5.2 Backup Before Migration

```bash
# Backup database
docker exec database pg_dump -U attendance_user attendance > backup_$(date +%Y%m%d).sql

# Restore if needed
docker exec -i database psql -U attendance_user attendance < backup_20260810.sql
```

## 6. Migration Checklist

- [ ] Backup database before migration
- [ ] Test migrations in development
- [ ] Test migrations in staging
- [ ] Verify data integrity after migration
- [ ] Run application tests
- [ ] Monitor application logs
- [ ] Update migration documentation
