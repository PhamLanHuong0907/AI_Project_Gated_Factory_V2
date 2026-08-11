# Physical ERD - Phần mềm Chấm công

## 1. Physical ERD Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         PHYSICAL ERD DIAGRAM                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────────────────┐                                                      │
│  │       shifts         │                                                      │
│  │──────────────────────│                                                      │
│  │ PK id                │◄─────────────────────────────────────┐               │
│  │    name              │                                      │               │
│  │    start_time        │                                      │               │
│  │    end_time          │                                      │               │
│  │    grace_period      │                                      │               │
│  │    work_days         │                                      │               │
│  │    is_active         │                                      │               │
│  │    created_at        │                                      │               │
│  └──────────────────────┘                                      │               │
│           │                                                    │               │
│           │ 1:N                                                │               │
│           ▼                                                    │               │
│  ┌──────────────────────┐      ┌──────────────────────┐       │               │
│  │       users          │      │    salary_config     │       │               │
│  │──────────────────────│      │──────────────────────│       │               │
│  │ PK id                │◄─────│ PK id                │       │               │
│  │    username          │  1:1 │ FK user_id           │       │               │
│  │    password          │      │    category          │       │               │
│  │    full_name         │      │    base_salary       │       │               │
│  │    email             │      │    formula           │       │               │
│  │    role              │      │    late_penalty_rate │       │               │
│  │ FK shift_id ─────────┼──────│    leave_penalty_rate│       │               │
│  │    status            │      │    created_at        │       │               │
│  │    failed_attempts   │      │    updated_at        │       │               │
│  │    locked_until      │      └──────────────────────┘       │               │
│  │    created_at        │                                      │               │
│  │    updated_at        │                                      │               │
│  └──────────┬───────────┘                                      │               │
│             │                                                  │               │
│             │ 1:N                                              │               │
│             ├──────────────────────────────────────────────────┘               │
│             │                                                                   │
│             ├──────────────────────────────┐                                   │
│             │                              │                                   │
│             ▼                              ▼                                   │
│  ┌──────────────────────┐      ┌──────────────────────┐                      │
│  │     attendance       │      │      qr_codes        │                      │
│  │──────────────────────│      │──────────────────────│                      │
│  │ PK id                │      │ PK id                │                      │
│  │ FK user_id           │      │ FK user_id           │                      │
│  │ FK qr_id ────────────┼──────│    code              │                      │
│  │    type              │      │    signature         │                      │
│  │    timestamp         │      │    expires_at        │                      │
│  │    gps_lat           │      │    status            │                      │
│  │    gps_lng           │      │    created_at        │                      │
│  │    distance          │      └──────────────────────┘                      │
│  │    status            │                                                     │
│  │    flag              │      ┌──────────────────────┐                      │
│  │    notes             │      │    system_config     │                      │
│  │    created_at        │      │──────────────────────│                      │
│  └──────────────────────┘      │ PK id                │                      │
│                                │    config_key        │                      │
│  ┌──────────────────────┐      │    config_value      │                      │
│  │      audit_log       │      │    description       │                      │
│  │──────────────────────│      │    created_at        │                      │
│  │ PK id                │      │    updated_at        │                      │
│  │ FK user_id           │      └──────────────────────┘                      │
│  │    event_type        │                                                     │
│  │    resource          │                                                     │
│  │    action            │                                                     │
│  │    details (JSONB)   │                                                     │
│  │    ip_address        │                                                     │
│  │    user_agent        │                                                     │
│  │    created_at        │                                                     │
│  └──────────────────────┘                                                     │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 2. Table Specifications

### 2.1 shifts

| Property | Value |
|----------|-------|
| Table Name | shifts |
| Owner Module | MOD-03 |
| Description | Work shift configurations |
| Estimated Rows | 10-50 |

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NO | auto | Primary key |
| name | VARCHAR(100) | NO | - | Shift name (e.g., "Ca sáng") |
| start_time | TIME | NO | - | Shift start time |
| end_time | TIME | NO | - | Shift end time |
| grace_period | INTEGER | NO | 15 | Grace period in minutes |
| work_days | VARCHAR(20) | NO | '1,2,3,4,5' | Comma-separated day numbers |
| is_active | BOOLEAN | NO | true | Active flag |
| created_at | TIMESTAMP | NO | NOW() | Record creation |

**Constraints**:
- PK: id
- UQ: name (unique shift name)
- CHECK: grace_period >= 0 AND grace_period <= 60

**Indexes**:
- idx_shifts_active (is_active)

---

### 2.2 users

| Property | Value |
|----------|-------|
| Table Name | users |
| Owner Module | MOD-07/08 |
| Description | System users (employees, admins) |
| Estimated Rows | 100-10000 |

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NO | auto | Primary key |
| username | VARCHAR(50) | NO | - | Unique username |
| password | VARCHAR(255) | NO | - | BCrypt hashed password |
| full_name | VARCHAR(100) | NO | - | Employee full name |
| email | VARCHAR(100) | YES | NULL | Email address |
| role | VARCHAR(20) | NO | 'EMPLOYEE' | User role |
| shift_id | BIGINT | YES | NULL | Assigned shift (FK) |
| status | VARCHAR(20) | NO | 'ACTIVE' | Account status |
| failed_attempts | INTEGER | NO | 0 | Failed login counter |
| locked_until | TIMESTAMP | NO | '1970-01-01' | Lock expiry |
| created_at | TIMESTAMP | NO | NOW() | Record creation |
| updated_at | TIMESTAMP | NO | NOW() | Last update |

**Constraints**:
- PK: id
- UQ: username
- UQ: email (if not null)
- FK: shift_id → shifts(id) ON DELETE SET NULL
- CHECK: role IN ('EMPLOYEE', 'ADMIN', 'HR_MANAGER')
- CHECK: status IN ('ACTIVE', 'INACTIVE', 'LOCKED')

**Indexes**:
- idx_users_username (username)
- idx_users_role (role)
- idx_users_status (status)
- idx_users_shift (shift_id)

---

### 2.3 qr_codes

| Property | Value |
|----------|-------|
| Table Name | qr_codes |
| Owner Module | MOD-05 |
| Description | Generated QR codes for attendance |
| Estimated Rows | 100-1000 per day |

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NO | auto | Primary key |
| user_id | BIGINT | NO | - | Generated by user (FK) |
| code | VARCHAR(255) | NO | - | QR code data (UUID) |
| signature | VARCHAR(255) | NO | - | HMAC signature |
| expires_at | TIMESTAMP | NO | - | Expiration time |
| status | VARCHAR(20) | NO | 'ACTIVE' | QR status |
| created_at | TIMESTAMP | NO | NOW() | Record creation |

**Constraints**:
- PK: id
- UQ: code (unique QR code)
- FK: user_id → users(id) ON DELETE CASCADE
- CHECK: status IN ('ACTIVE', 'EXPIRED', 'USED')

**Indexes**:
- idx_qr_codes_user (user_id)
- idx_qr_codes_code (code)
- idx_qr_codes_expires (expires_at)
- idx_qr_codes_status (status)

---

### 2.4 attendance

| Property | Value |
|----------|-------|
| Table Name | attendance |
| Owner Module | MOD-01 |
| Description | Attendance records |
| Estimated Rows | 2-10 per user per day |

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NO | auto | Primary key |
| user_id | BIGINT | NO | - | Employee ID (FK) |
| qr_id | BIGINT | NO | - | QR code used (FK) |
| type | VARCHAR(4) | NO | - | IN or OUT |
| timestamp | TIMESTAMP | NO | NOW() | Server timestamp |
| gps_lat | DECIMAL(10,8) | YES | NULL | GPS latitude |
| gps_lng | DECIMAL(11,8) | YES | NULL | GPS longitude |
| distance | DECIMAL(10,2) | YES | NULL | Distance to company (meters) |
| status | VARCHAR(20) | NO | 'VALID' | Record status |
| flag | VARCHAR(50) | YES | NULL | Special flags |
| notes | TEXT | YES | NULL | Additional notes |
| created_at | TIMESTAMP | NO | NOW() | Record creation |

**Constraints**:
- PK: id
- FK: user_id → users(id) ON DELETE RESTRICT
- FK: qr_id → qr_codes(id) ON DELETE RESTRICT
- CHECK: type IN ('IN', 'OUT')
- CHECK: status IN ('VALID', 'INVALID', 'PENDING')
- CHECK: flag IS NULL OR flag IN ('AUTO_OUT', 'MANUAL_OVERRIDE', 'LATE', 'EARLY')

**Indexes**:
- idx_attendance_user (user_id)
- idx_attendance_date (timestamp)
- idx_attendance_type (type)
- idx_attendance_status (status)
- idx_attendance_user_date (user_id, timestamp)

---

### 2.5 salary_config

| Property | Value |
|----------|-------|
| Table Name | salary_config |
| Owner Module | MOD-03 |
| Description | Salary configuration per employee |
| Estimated Rows | 100-10000 |

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NO | auto | Primary key |
| user_id | BIGINT | NO | - | Employee ID (FK, unique) |
| category | VARCHAR(50) | NO | - | Salary category |
| base_salary | DECIMAL(15,2) | NO | - | Base salary amount |
| formula | TEXT | YES | NULL | Calculation formula |
| late_penalty_rate | DECIMAL(10,2) | NO | 0 | Penalty per minute late |
| leave_penalty_rate | DECIMAL(10,2) | NO | 0 | Penalty per day leave |
| created_at | TIMESTAMP | NO | NOW() | Record creation |
| updated_at | TIMESTAMP | NO | NOW() | Last update |

**Constraints**:
- PK: id
- UQ: user_id (one config per user)
- FK: user_id → users(id) ON DELETE CASCADE
- CHECK: base_salary >= 0
- CHECK: late_penalty_rate >= 0
- CHECK: leave_penalty_rate >= 0

**Indexes**:
- idx_salary_config_user (user_id)
- idx_salary_config_category (category)

---

### 2.6 system_config

| Property | Value |
|----------|-------|
| Table Name | system_config |
| Owner Module | MOD-04 |
| Description | System configuration key-value pairs |
| Estimated Rows | 20-100 |

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NO | auto | Primary key |
| config_key | VARCHAR(100) | NO | - | Configuration key |
| config_value | TEXT | NO | - | Configuration value |
| description | TEXT | YES | NULL | Description |
| created_at | TIMESTAMP | NO | NOW() | Record creation |
| updated_at | TIMESTAMP | NO | NOW() | Last update |

**Constraints**:
- PK: id
- UQ: config_key

**Indexes**:
- idx_system_config_key (config_key)

---

### 2.7 audit_log

| Property | Value |
|----------|-------|
| Table Name | audit_log |
| Owner Module | MOD-07 |
| Description | Audit trail for security events |
| Estimated Rows | 1000-100000 |

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NO | auto | Primary key |
| user_id | BIGINT | YES | NULL | User who performed action |
| event_type | VARCHAR(50) | NO | - | Event type |
| resource | VARCHAR(100) | YES | NULL | Affected resource |
| action | VARCHAR(50) | YES | NULL | Action performed |
| details | JSONB | YES | NULL | Additional details |
| ip_address | INET | YES | NULL | Client IP address |
| user_agent | TEXT | YES | NULL | Client user agent |
| created_at | TIMESTAMP | NO | NOW() | Record creation |

**Constraints**:
- PK: id
- FK: user_id → users(id) ON DELETE SET NULL

**Indexes**:
- idx_audit_log_user (user_id)
- idx_audit_log_event (event_type)
- idx_audit_log_date (created_at)
- idx_audit_log_resource (resource)

## 3. Constraints Summary

| Table | Constraint Type | Columns | Rule |
|-------|-----------------|---------|------|
| shifts | UNIQUE | name | Unique shift name |
| shifts | CHECK | grace_period | 0-60 minutes |
| users | UNIQUE | username | Unique username |
| users | UNIQUE | email | Unique email (if not null) |
| users | CHECK | role | IN ('EMPLOYEE', 'ADMIN', 'HR_MANAGER') |
| users | CHECK | status | IN ('ACTIVE', 'INACTIVE', 'LOCKED') |
| qr_codes | UNIQUE | code | Unique QR code |
| qr_codes | CHECK | status | IN ('ACTIVE', 'EXPIRED', 'USED') |
| attendance | CHECK | type | IN ('IN', 'OUT') |
| attendance | CHECK | status | IN ('VALID', 'INVALID', 'PENDING') |
| salary_config | UNIQUE | user_id | One config per user |
| salary_config | CHECK | base_salary | >= 0 |
| system_config | UNIQUE | config_key | Unique key |

## 4. Indexes Summary

| Table | Index Name | Columns | Purpose |
|-------|------------|---------|---------|
| users | idx_users_username | username | Login lookup |
| users | idx_users_role | role | Role-based queries |
| users | idx_users_shift | shift_id | Shift assignment |
| qr_codes | idx_qr_codes_user | user_id | User QR lookup |
| qr_codes | idx_qr_codes_code | code | QR validation |
| qr_codes | idx_qr_codes_expires | expires_at | Expiration check |
| attendance | idx_attendance_user | user_id | User attendance |
| attendance | idx_attendance_date | timestamp | Date range queries |
| attendance | idx_attendance_user_date | user_id, timestamp | Combined lookup |
| salary_config | idx_salary_config_user | user_id | User salary lookup |
| system_config | idx_system_config_key | config_key | Config lookup |
| audit_log | idx_audit_log_user | user_id | User audit trail |
| audit_log | idx_audit_log_date | created_at | Date range queries |
