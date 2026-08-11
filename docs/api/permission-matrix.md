# Permission Matrix - Phần mềm Chấm công

## 1. Role Definitions

| Role | Code | Description | Scope |
|------|------|-------------|-------|
| Employee | EMPLOYEE | Regular staff member | Own data only |
| Admin | ADMIN | System administrator | Full access |
| HR Manager | HR_MANAGER | HR personnel | Reports, salary, attendance |

## 2. API Permission Matrix

### 2.1 Authentication APIs

| Endpoint | Method | EMPLOYEE | ADMIN | HR_MANAGER |
|----------|--------|----------|-------|------------|
| /auth/login | POST | ✅ | ✅ | ✅ |
| /auth/logout | POST | ✅ | ✅ | ✅ |
| /auth/me | GET | ✅ | ✅ | ✅ |

### 2.2 Attendance APIs

| Endpoint | Method | EMPLOYEE | ADMIN | HR_MANAGER |
|----------|--------|----------|-------|------------|
| /attendance/scan | POST | ✅ | ✅ | ✅ |
| /attendance/me | GET | ✅ (own) | ❌ | ❌ |
| /attendance | GET | ❌ | ✅ (all) | ✅ (all) |
| /attendance/{id} | GET | ✅ (own) | ✅ (all) | ✅ (all) |
| /attendance/{id} | PUT | ❌ | ✅ | ✅ |

### 2.3 QR Code APIs

| Endpoint | Method | EMPLOYEE | ADMIN | HR_MANAGER |
|----------|--------|----------|-------|------------|
| /qr/generate | POST | ✅ | ✅ | ❌ |
| /qr/validate | POST | ✅ | ✅ | ❌ |

### 2.4 User Management APIs

| Endpoint | Method | EMPLOYEE | ADMIN | HR_MANAGER |
|----------|--------|----------|-------|------------|
| /users | GET | ❌ | ✅ | ❌ |
| /users | POST | ❌ | ✅ | ❌ |
| /users/{id} | GET | ✅ (self) | ✅ | ❌ |
| /users/{id} | PUT | ✅ (self) | ✅ | ❌ |
| /users/{id} | DELETE | ❌ | ✅ | ❌ |

### 2.5 Report APIs

| Endpoint | Method | EMPLOYEE | ADMIN | HR_MANAGER |
|----------|--------|----------|-------|------------|
| /reports/monthly | GET | ❌ | ✅ | ✅ |
| /reports/salary | GET | ❌ | ✅ | ✅ |

### 2.6 Configuration APIs

| Endpoint | Method | EMPLOYEE | ADMIN | HR_MANAGER |
|----------|--------|----------|-------|------------|
| /shifts | GET | ✅ | ✅ | ✅ |
| /shifts | POST | ❌ | ✅ | ❌ |
| /shifts/{id} | PUT | ❌ | ✅ | ❌ |
| /shifts/{id} | DELETE | ❌ | ✅ | ❌ |
| /salary/config | GET | ❌ | ✅ | ✅ |
| /salary/config | POST | ❌ | ✅ | ❌ |
| /salary/config/{userId} | PUT | ❌ | ✅ | ❌ |
| /config/gps | GET | ❌ | ✅ | ❌ |
| /config/gps | PUT | ❌ | ✅ | ❌ |

### 2.7 Salary Config APIs (New)

| Endpoint | Method | EMPLOYEE | ADMIN | HR_MANAGER |
|----------|--------|----------|-------|------------|
| /salary/positions | GET | ❌ | ✅ | ✅ |
| /salary/positions | POST | ❌ | ✅ | ❌ |
| /salary/positions/{id} | PUT | ❌ | ✅ | ❌ |
| /salary/positions/{id} | DELETE | ❌ | ✅ | ❌ |
| /salary/experience | GET | ❌ | ✅ | ✅ |
| /salary/experience | POST | ❌ | ✅ | ❌ |
| /salary/experience/{id} | PUT | ❌ | ✅ | ❌ |
| /salary/experience/{id} | DELETE | ❌ | ✅ | ❌ |
| /salary/penalties | GET | ❌ | ✅ | ✅ |
| /salary/penalties | POST | ❌ | ✅ | ❌ |
| /salary/penalties/{id} | PUT | ❌ | ✅ | ❌ |
| /salary/penalties/{id} | DELETE | ❌ | ✅ | ❌ |
| /salary/bonus | GET | ❌ | ✅ | ✅ |
| /salary/bonus | POST | ❌ | ✅ | ❌ |
| /salary/bonus/{id} | PUT | ❌ | ✅ | ❌ |
| /salary/bonus/{id} | DELETE | ❌ | ✅ | ❌ |
| /salary/assign/position | POST | ❌ | ✅ | ❌ |
| /salary/assign/experience | POST | ❌ | ✅ | ❌ |
| /salary/assign/bonus | POST | ❌ | ✅ | ❌ |
| /salary/assign/bonus | DELETE | ❌ | ✅ | ❌ |
| /salary/employee/{userId} | GET | ❌ | ✅ | ✅ |
| /salary/formula | GET | ❌ | ✅ | ✅ |
| /salary/formula | PUT | ❌ | ✅ | ❌ |
| /salary/formula/validate | POST | ❌ | ✅ | ❌ |
| /salary/formula/preview | POST | ❌ | ✅ | ✅ |

## 3. Data Access Rules

### 3.1 Employee (EMPLOYEE)

| Resource | Access | Condition |
|----------|--------|-----------|
| Own Profile | Read/Update | Cannot change role |
| Own Attendance | Read | Only own records |
| QR Generation | Create | One active QR at a time |
| Salary Config | Read | Own salary only |
| Shifts | Read | View assigned shift |

### 3.2 Admin (ADMIN)

| Resource | Access | Condition |
|----------|--------|-----------|
| All Users | Full CRUD | Cannot delete self |
| All Attendance | Read/Update | Full access |
| QR Generation | Create | For any user |
| Salary Config | Full CRUD | For any user |
| Shifts | Full CRUD | Full access |
| System Config | Full CRUD | Full access |

### 3.3 HR Manager (HR_MANAGER)

| Resource | Access | Condition |
|----------|--------|-----------|
| Users | Read | View only |
| All Attendance | Read/Update | Cannot modify |
| Reports | Read | Full access |
| Salary Config | Read | View only |
| Shifts | Read | View only |

## 4. Business Rule Permissions

| Rule | Description | Who Can Override |
|------|-------------|------------------|
| Duplicate Prevention | Min 2 min between scans | Admin |
| GPS Validation | Distance ≤ threshold | Admin (Web Portal only) |
| Auto-OUT | Auto clock out at 23:59 | System (no override) |
| Account Lockout | Lock after 5 failures | Admin |
| Grace Period | Late arrival grace | Admin (configurable) |

## 5. Resource Ownership

| Resource | Owner | Transferable |
|----------|-------|--------------|
| User Account | Admin | No |
| Attendance Record | System | No |
| QR Code | Generating User | No |
| Salary Config | Admin | Yes |
| Shift Config | Admin | Yes |

## 6. Permission Inheritance

```
ADMIN
  └── Can access everything
        └── Can delegate HR_MANAGER role

HR_MANAGER
  └── Can read all data
  └── Can update attendance
  └── Cannot manage users
  └── Cannot modify config

EMPLOYEE
  └── Can access own data only
  └── Can generate QR
  └── Can scan for attendance
  └── Cannot access reports
```

## 7. Security Constraints

| Constraint | Implementation |
|------------|----------------|
| Self-modification | Cannot delete own account |
| Role escalation | Cannot change own role |
| Data isolation | Employee sees only own data |
| Audit trail | All changes logged |
| Password policy | Enforced on create/update |
| Session timeout | Configurable per role |

## 8. API Endpoint to Requirement Mapping

| Endpoint | Requirement ID | Description |
|----------|----------------|-------------|
| POST /auth/login | REQ-07 | User authentication |
| POST /attendance/scan | REQ-01 | QR attendance scan |
| GET /attendance/me | REQ-01 | View own attendance |
| POST /qr/generate | REQ-05 | Generate QR code |
| GET /reports/monthly | REQ-03 | Monthly report |
| GET /reports/salary | REQ-03 | Salary report |
| GET /users | REQ-08 | User management |
| PUT /salary/config | REQ-08 | Salary configuration |
| GET /shifts | REQ-09 | Shift configuration |
