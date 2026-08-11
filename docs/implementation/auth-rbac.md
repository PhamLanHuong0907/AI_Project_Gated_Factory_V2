# Authentication & RBAC Report

**Date**: 2026-08-10
**Status**: COMPLETE

## Authentication Flow

```
Login Request
  → AuthController.login()
    → AuthenticationManager.authenticate()
      → CustomUserDetailsService.loadUserByUsername()
    → JwtTokenProvider.generateToken()
  → Returns { token, user }
```

## JWT Structure

| Field | Value |
|-------|-------|
| Header | `alg: HS256` |
| Payload | `sub: {userId}, role: {role}, iat: *, exp: *` |
| Secret | Configurable via `JWT_SECRET` env var |
| Expiration | 24 hours (86400000ms) |

## Security Configuration

| Feature | Implementation |
|---------|---------------|
| Password Encoding | BCrypt |
| JWT Filter | JwtAuthenticationFilter (once-per-request) |
| Stateless | No HTTP sessions |
| CORS | Configured for development |
| Public Endpoints | `/auth/login`, `/auth/register`, `/v3/api-docs/**`, `/swagger-ui/**` |

## RBAC Matrix

| Endpoint | EMPLOYEE | ADMIN | HR_MANAGER |
|----------|----------|-------|------------|
| POST /auth/login | ✅ | ✅ | ✅ |
| POST /auth/register | ✅ | ✅ | ✅ |
| GET /auth/me | ✅ | ✅ | ✅ |
| GET /users | ❌ | ✅ | ❌ |
| POST /users | ❌ | ✅ | ❌ |
| PUT /users/{id} | ❌ | ✅ | ❌ |
| DELETE /users/{id} | ❌ | ✅ | ❌ |
| GET /shifts | ✅ | ✅ | ✅ |
| POST /shifts | ❌ | ✅ | ❌ |
| PUT /shifts/{id} | ❌ | ✅ | ❌ |
| DELETE /shifts/{id} | ❌ | ✅ | ❌ |
| GET /attendance | ✅ (own) | ✅ (all) | ✅ (all) |
| POST /attendance/check-in | ✅ | ✅ | ✅ |
| POST /attendance/{id}/check-out | ✅ (own) | ✅ | ✅ |
| GET /attendance/stats | ✅ | ✅ | ✅ |
| GET /leave-requests | ✅ (own) | ✅ (all) | ✅ (all) |
| POST /leave-requests | ✅ | ✅ | ✅ |
| POST /leave-requests/{id}/approve | ❌ | ✅ | ✅ |
| POST /leave-requests/{id}/reject | ❌ | ✅ | ✅ |
| GET /salary/* | ❌ | ✅ | ✅ (read) |
| POST /salary/* | ❌ | ✅ | ❌ |
| GET /config/* | ❌ | ✅ | ✅ (read) |
| PUT /config/* | ❌ | ✅ | ❌ |

## Data Scope

| Role | User Data | Attendance | Leave Requests | Salary |
|------|-----------|------------|----------------|--------|
| EMPLOYEE | Own only | Own only | Own only | Own only |
| HR_MANAGER | All | All | All | Read-only |
| ADMIN | All | All | All | Full CRUD |

## Frontend Auth Integration

| Component | Auth Behavior |
|-----------|---------------|
| App.tsx | Route guard: redirects to /login if no token |
| AppShell.tsx | Displays user name, role, logout button |
| Login.tsx | Calls api.auth.login(), stores token in localStorage |
| AuthContext | Provides user state + token to all components |
