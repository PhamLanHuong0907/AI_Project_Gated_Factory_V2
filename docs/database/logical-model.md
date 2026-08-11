# Logical Data Model - Phần mềm Chấm công

## 1. Data Model Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         LOGICAL DATA MODEL                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐                   │
│  │    Users     │     │  Attendance  │     │   QR_Codes   │                   │
│  │──────────────│     │──────────────│     │──────────────│                   │
│  │ id (PK)      │◄────│ user_id (FK) │     │ id (PK)      │                   │
│  │ username     │     │ id (PK)      │     │ user_id (FK) │                   │
│  │ password     │     │ qr_id (FK)   │────►│ code         │                   │
│  │ full_name    │     │ type (IN/OUT)│     │ expires_at   │                   │
│  │ email        │     │ timestamp    │     │ created_at   │                   │
│  │ role         │     │ gps_lat      │     └──────────────┘                   │
│  │ status       │     │ gps_lng      │                                        │
│  └──────────────┘     │ distance     │     ┌──────────────┐                   │
│         │             │ status       │     │   Shifts     │                   │
│         │             └──────────────┘     │──────────────│                   │
│         │                                  │ id (PK)      │                   │
│         │             ┌──────────────┐     │ name         │                   │
│         │             │   Salary     │     │ start_time   │                   │
│         │             │──────────────│     │ end_time     │                   │
│         └────────────►│ user_id (FK) │     │ grace_period │                   │
│                       │ id (PK)      │     │ work_days    │                   │
│                       │ category     │     └──────────────┘                   │
│                       │ base_salary  │                                        │
│                       │ formula      │     ┌──────────────┐                   │
│                       └──────────────┘     │   Config     │                   │
│                                            │──────────────│                   │
│                       ┌──────────────┐     │ id (PK)      │                   │
│                       │  Audit_Log   │     │ key          │                   │
│                       │──────────────│     │ value        │                   │
│                       │ id (PK)      │     │ description  │                   │
│                       │ user_id (FK) │     └──────────────┘                   │
│                       │ event_type   │                                        │
│                       │ details      │                                        │
│                       │ created_at   │                                        │
│                       └──────────────┘                                        │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 2. Entity Relationships

### 2.1 ERD Summary

| Entity | Relationships |
|--------|---------------|
| Users | 1:N Attendance, 1:N QR_Codes, 1:1 Salary, N:1 Shifts |
| Attendance | N:1 Users, N:1 QR_Codes |
| QR_Codes | 1:N Attendance, N:1 Users |
| Salary | 1:1 Users |
| Shifts | 1:N Users |
| Config | Standalone (key-value) |
| Audit_Log | N:1 Users |

### 2.2 Relationship Matrix

| Parent → Child | Relationship | Cascade |
|----------------|--------------|---------|
| Users → Attendance | One-to-Many | Delete restrict |
| Users → QR_Codes | One-to-Many | Delete restrict |
| Users → Salary | One-to-One | Delete cascade |
| Users → Shifts | Many-to-One | Delete set null |
| QR_Codes → Attendance | One-to-Many | Delete restrict |

## 3. Module Ownership

| Entity | Owner Module | Description |
|--------|--------------|-------------|
| users | MOD-07/08 | Authentication & User Management |
| attendance | MOD-01 | QR Attendance |
| qr_codes | MOD-05 | QR Generation |
| salary_config | MOD-03 | Reports & Salary |
| shifts | MOD-03 | Shift Configuration |
| system_config | MOD-04 | System Configuration |
| audit_log | MOD-07 | Security & Audit |

## 4. Data Classification

| Entity | Classification | Sensitivity |
|--------|----------------|-------------|
| users.password | Highly Sensitive | BCrypt hash |
| users.email | Sensitive | PII |
| attendance.gps_* | Sensitive | Location data |
| salary_config.* | Confidential | Business data |
| qr_codes.code | Internal | Time-limited |
| audit_log.* | Internal | Audit trail |

## 5. Cross-Module Relationships

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    CROSS-MODULE DATA FLOW                                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  MOD-07 (Auth)                                                                  │
│       │                                                                         │
│       │ users table                                                             │
│       ▼                                                                         │
│  MOD-01 (Attendance)                                                            │
│       │                                                                         │
│       │ attendance.user_id → users.id                                           │
│       │ attendance.qr_id → qr_codes.id                                         │
│       ▼                                                                         │
│  MOD-05 (QR Generation)                                                         │
│       │                                                                         │
│       │ qr_codes.user_id → users.id                                            │
│       ▼                                                                         │
│  MOD-03 (Reports & Salary)                                                      │
│       │                                                                         │
│       │ salary_config.user_id → users.id                                        │
│       │ attendance records → salary calculation                                 │
│       ▼                                                                         │
│  MOD-04 (Dashboard)                                                             │
│       │                                                                         │
│       │ Aggregates data from attendance, users, salary                          │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 6. Data Dictionary

### 6.1 users

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | BIGSERIAL | NO | Primary key |
| username | VARCHAR(50) | NO | Unique username |
| password | VARCHAR(255) | NO | BCrypt hashed password |
| full_name | VARCHAR(100) | NO | Employee full name |
| email | VARCHAR(100) | YES | Email address |
| role | VARCHAR(20) | NO | EMPLOYEE, ADMIN, HR_MANAGER |
| shift_id | BIGINT | YES | Assigned shift |
| status | VARCHAR(20) | NO | ACTIVE, INACTIVE, LOCKED |
| failed_attempts | INTEGER | NO | Failed login attempts |
| locked_until | TIMESTAMP | NO | Account lock expiry |
| created_at | TIMESTAMP | NO | Record creation |
| updated_at | TIMESTAMP | NO | Last update |

### 6.2 attendance

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | BIGSERIAL | NO | Primary key |
| user_id | BIGINT | NO | Employee ID (FK) |
| qr_id | BIGINT | NO | QR code used (FK) |
| type | VARCHAR(4) | NO | IN or OUT |
| timestamp | TIMESTAMP | NO | Server timestamp |
| gps_lat | DECIMAL(10,8) | YES | GPS latitude |
| gps_lng | DECIMAL(11,8) | YES | GPS longitude |
| distance | DECIMAL(10,2) | YES | Distance to company (meters) |
| status | VARCHAR(20) | NO | VALID, INVALID, PENDING |
| flag | VARCHAR(50) | YES | AUTO_OUT, MANUAL_OVERRIDE |
| notes | TEXT | YES | Additional notes |
| created_at | TIMESTAMP | NO | Record creation |

### 6.3 qr_codes

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | BIGSERIAL | NO | Primary key |
| user_id | BIGINT | NO | Generated by user (FK) |
| code | VARCHAR(255) | NO | QR code data |
| signature | VARCHAR(255) | NO | HMAC signature |
| expires_at | TIMESTAMP | NO | Expiration time |
| status | VARCHAR(20) | NO | ACTIVE, EXPIRED, USED |
| created_at | TIMESTAMP | NO | Record creation |

### 6.4 salary_config

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | BIGSERIAL | NO | Primary key |
| user_id | BIGINT | NO | Employee ID (FK, unique) |
| category | VARCHAR(50) | NO | Salary category |
| base_salary | DECIMAL(15,2) | NO | Base salary amount |
| formula | TEXT | YES | Calculation formula |
| late_penalty_rate | DECIMAL(10,2) | NO | Penalty per minute late |
| leave_penalty_rate | DECIMAL(10,2) | NO | Penalty per day leave |
| created_at | TIMESTAMP | NO | Record creation |
| updated_at | TIMESTAMP | NO | Last update |

### 6.5 shifts

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | BIGSERIAL | NO | Primary key |
| name | VARCHAR(100) | NO | Shift name |
| start_time | TIME | NO | Shift start time |
| end_time | TIME | NO | Shift end time |
| grace_period | INTEGER | NO | Minutes (default: 15) |
| work_days | VARCHAR(20) | NO | e.g., "1,2,3,4,5" |
| is_active | BOOLEAN | NO | Active flag |
| created_at | TIMESTAMP | NO | Record creation |

### 6.6 system_config

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | BIGSERIAL | NO | Primary key |
| config_key | VARCHAR(100) | NO | Unique key |
| config_value | TEXT | NO | Configuration value |
| description | TEXT | YES | Description |
| created_at | TIMESTAMP | NO | Record creation |
| updated_at | TIMESTAMP | NO | Last update |

### 6.7 audit_log

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| id | BIGSERIAL | NO | Primary key |
| user_id | BIGINT | YES | User who performed action |
| event_type | VARCHAR(50) | NO | Event type |
| resource | VARCHAR(100) | YES | Affected resource |
| action | VARCHAR(50) | YES | Action performed |
| details | JSONB | YES | Additional details |
| ip_address | INET | YES | Client IP |
| user_agent | TEXT | YES | Client user agent |
| created_at | TIMESTAMP | NO | Record creation |
