# Security Architecture - Phần mềm Chấm công

## 1. Security Overview

| Aspect | Implementation |
|--------|----------------|
| Authentication | JWT + Username/Password |
| Authorization | Role-Based Access Control (RBAC) |
| Password Storage | BCrypt (Strength: 12) |
| Session Management | JWT with configurable expiration |
| Transport Security | HTTPS (TLS 1.2+) |
| Data Encryption | AES-256 for sensitive data at rest |

## 2. Authentication Architecture

### 2.1 Authentication Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION FLOW                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────┐                                                                  │
│  │ Employee │                                                                  │
│  └────┬─────┘                                                                  │
│       │                                                                        │
│       │ 1. Enter username/password                                             │
│       ▼                                                                        │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐             │
│  │ Frontend │────►│  API     │────►│ Security │────►│Database  │             │
│  │  (PWA)   │     │ Gateway  │     │ Service  │     │          │             │
│  └──────────┘     └──────────┘     └──────────┘     └──────────┘             │
│       ▲                │                │                │                     │
│       │                │ 2. Validate    │                │                     │
│       │                │───────────────►│                │                     │
│       │                │                │ 3. Check       │                     │
│       │                │                │───────────────►│                     │
│       │                │                │ 4. Return      │                     │
│       │                │                │◄───────────────│                     │
│       │                │ 5. Create      │                │                     │
│       │                │    JWT Token   │                │                     │
│       │ 6. Return      │                │                │                     │
│       │    Token       │                │                │                     │
│       │◄───────────────│                │                │                     │
│       │                                                                        │
│       │ 7. Store token in localStorage                                         │
│       ▼                                                                        │
│  ┌──────────┐                                                                  │
│  │ Frontend │                                                                  │
│  │ (Logged  │                                                                  │
│  │   In)    │                                                                  │
│  └──────────┘                                                                  │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "user_id",
    "name": "Nguyen Van A",
    "role": "EMPLOYEE",
    "iat": 1691635200,
    "exp": 1691721600,
    "iss": "attendance-system"
  }
}
```

### 2.3 Token Lifecycle

| Event | Action | Duration |
|-------|--------|----------|
| Login | Generate JWT | - |
| Request | Validate JWT | - |
| Expiration | Reject request | 24 hours (configurable) |
| Logout | Invalidate (client-side) | - |
| Password Change | Invalidate all tokens | - |

## 3. Authorization Architecture

### 3.1 Role Definitions

| Role | Code | Description | Permissions |
|------|------|-------------|-------------|
| Employee | EMPLOYEE | Regular staff | Scan QR, view own attendance |
| Admin | ADMIN | System administrator | Full access |
| HR Manager | HR_MANAGER | HR personnel | Reports, salary, attendance |

### 3.2 Permission Matrix

| API Endpoint | EMPLOYEE | ADMIN | HR_MANAGER |
|--------------|----------|-------|------------|
| POST /api/auth/login | ✅ | ✅ | ✅ |
| POST /api/auth/logout | ✅ | ✅ | ✅ |
| GET /api/auth/me | ✅ | ✅ | ✅ |
| POST /api/attendance/scan | ✅ | ✅ | ✅ |
| GET /api/attendance/me | ✅ | ❌ | ❌ |
| GET /api/attendance | ❌ | ✅ | ✅ |
| GET /api/attendance/{id} | ✅* | ✅ | ✅ |
| PUT /api/attendance/{id} | ❌ | ✅ | ✅ |
| POST /api/qr/generate | ✅ | ✅ | ❌ |
| GET /api/qr/validate | ✅ | ✅ | ❌ |
| GET /api/reports/monthly | ❌ | ✅ | ✅ |
| GET /api/reports/salary | ❌ | ✅ | ✅ |
| GET /api/shift | ✅ | ✅ | ✅ |
| POST /api/shift | ❌ | ✅ | ❌ |
| GET /api/salary/config | ❌ | ✅ | ✅ |
| PUT /api/salary/config | ❌ | ✅ | ❌ |
| GET /api/users | ❌ | ✅ | ❌ |
| POST /api/users | ❌ | ✅ | ❌ |
| PUT /api/users/{id} | ✅* | ✅ | ❌ |
| DELETE /api/users/{id} | ❌ | ✅ | ❌ |
| GET /api/dashboard | ❌ | ✅ | ✅ |

*Note: Employee can only access own data

### 3.3 Authorization Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      AUTHORIZATION FLOW                                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  Request with JWT Token                                                         │
│       │                                                                         │
│       ▼                                                                         │
│  ┌────────────────┐                                                             │
│  │ Extract Token  │                                                             │
│  └───────┬────────┘                                                             │
│          │                                                                      │
│          ▼                                                                      │
│  ┌────────────────┐     ┌────────────────┐                                     │
│  │ Validate JWT   │────►│ Token Invalid? │──── Yes ──► 401 Unauthorized       │
│  └───────┬────────┘     └────────────────┘                                     │
│          │ No                                                                   │
│          ▼                                                                      │
│  ┌────────────────┐     ┌────────────────┐                                     │
│  │ Check Expiry   │────►│ Expired?       │──── Yes ──► 401 Token Expired      │
│  └───────┬────────┘     └────────────────┘                                     │
│          │ No                                                                   │
│          ▼                                                                      │
│  ┌────────────────┐     ┌────────────────┐                                     │
│  │ Extract Role   │────►│ Role Has       │──── No ───► 403 Forbidden          │
│  │                │     │ Permission?    │                                     │
│  └───────┬────────┘     └────────────────┘                                     │
│          │ Yes                                                                  │
│          ▼                                                                      │
│  ┌────────────────┐                                                             │
│  │ Process Request│                                                             │
│  └────────────────┘                                                             │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 4. Password Security

### 4.1 Password Policy

| Rule | Value |
|------|-------|
| Minimum Length | 8 characters |
| Maximum Length | 128 characters |
| Required Characters | At least 1 uppercase, 1 lowercase, 1 number |
| Special Characters | Optional (recommended) |
| Password History | Last 5 passwords cannot be reused |
| Expiration | 90 days (configurable) |

### 4.2 Password Hashing

```
Algorithm: BCrypt
Work Factor: 12
Salt: Auto-generated per password
```

### 4.3 Account Lockout

| Setting | Value |
|---------|-------|
| Max Failed Attempts | 5 |
| Lockout Duration | 5 minutes |
| Reset Counter | After successful login |
| Notification | Email to admin on lockout |

## 5. Session Management

### 5.1 Session Configuration

| Setting | Default | Configurable |
|---------|---------|--------------|
| JWT Expiration | 24 hours | Yes |
| Refresh Token | Not used | - |
| Concurrent Sessions | Unlimited | Yes |
| Session Timeout | 8 hours | Yes |

### 5.2 Session Security

| Measure | Implementation |
|---------|----------------|
| Token Storage | HttpOnly Cookie (preferred) or localStorage |
| Token Transmission | HTTPS only |
| Token Validation | Server-side on every request |
| Logout | Client-side token removal |

## 6. Data Security

### 6.1 Data Classification

| Data Type | Classification | Protection |
|-----------|----------------|------------|
| Passwords | Highly Sensitive | BCrypt hashing |
| GPS Location | Sensitive | Encrypted at rest |
| Attendance Records | Internal | Access control |
| Salary Data | Confidential | Role-based access |
| QR Code Data | Internal | Time-limited |

### 6.2 Encryption at Rest

| Data | Algorithm | Key Management |
|------|-----------|----------------|
| Passwords | BCrypt | Auto-generated salt |
| Sensitive Fields | AES-256 | Environment variable |
| Database | TDE (Optional) | Database-level |

### 6.3 Encryption in Transit

| Channel | Protocol | Version |
|---------|----------|---------|
| API Communication | HTTPS | TLS 1.2+ |
| Database Connection | SSL | Required |
| Internal Services | mTLS | Optional |

## 7. API Security

### 7.1 Rate Limiting

| Endpoint Category | Limit | Window |
|-------------------|-------|--------|
| Authentication | 5 requests | 1 minute |
| Attendance Scan | 10 requests | 1 minute |
| General API | 100 requests | 1 minute |
| Report Generation | 5 requests | 1 minute |

### 7.2 Input Validation

| Input Type | Validation |
|------------|------------|
| Username | Alphanumeric, 3-50 chars |
| Password | Policy enforcement |
| GPS Coordinates | Valid latitude/longitude |
| QR Code Data | Format validation |
| Date/Time | ISO 8601 format |

### 7.3 CORS Configuration

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        return new UrlBasedCorsConfigurationSource();
    }
}
```

## 8. Audit Logging

### 8.1 Audit Events

| Event | Details Logged |
|-------|----------------|
| Login Success | User ID, timestamp, IP |
| Login Failure | Username attempted, timestamp, IP |
| Attendance Scan | User ID, timestamp, GPS, result |
| QR Generation | User ID, timestamp, QR ID |
| Data Access | User ID, resource, action |
| Configuration Change | User ID, setting, old/new value |

### 8.2 Audit Log Schema

```sql
CREATE TABLE audit_log (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT,
    event_type VARCHAR(50) NOT NULL,
    resource VARCHAR(100),
    action VARCHAR(50),
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 9. Security Controls Summary

| Control | Implementation | Status |
|---------|----------------|--------|
| Authentication | JWT + Password | ✅ Implemented |
| Authorization | RBAC | ✅ Implemented |
| Password Hashing | BCrypt | ✅ Implemented |
| HTTPS | TLS 1.2+ | ✅ Required |
| Rate Limiting | Per-endpoint | ✅ Implemented |
| Input Validation | Server-side | ✅ Implemented |
| Audit Logging | All critical events | ✅ Implemented |
| Session Management | JWT with expiry | ✅ Implemented |
| CORS | Configured | ✅ Implemented |
| SQL Injection | Parameterized queries | ✅ Implemented |
| XSS Protection | Output encoding | ✅ Implemented |
| CSRF Protection | SameSite cookies | ✅ Implemented |
