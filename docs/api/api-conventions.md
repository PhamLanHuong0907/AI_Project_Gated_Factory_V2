# API Conventions - Phần mềm Chấm công

## 1. API Overview

| Aspect | Convention |
|--------|------------|
| Style | RESTful API |
| Protocol | HTTPS |
| Data Format | JSON |
| Authentication | JWT Bearer Token |
| Versioning | URI-based (/api/v1/) |

## 2. Base URL

| Environment | Base URL |
|-------------|----------|
| Development | http://localhost:8080/api/v1 |
| Production | https://attendance.company.com/api/v1 |

## 3. Request/Response Format

### 3.1 Standard Response Envelope

```json
{
  "success": true,
  "data": { },
  "message": "Operation successful",
  "timestamp": "2026-08-10T10:30:00Z"
}
```

### 3.2 Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "username",
        "message": "Username is required"
      }
    ]
  },
  "timestamp": "2026-08-10T10:30:00Z"
}
```

## 4. HTTP Methods

| Method | Purpose | Idempotent |
|--------|---------|------------|
| GET | Retrieve resources | Yes |
| POST | Create resources | No |
| PUT | Update resources (full) | Yes |
| PATCH | Update resources (partial) | Yes |
| DELETE | Remove resources | Yes |

## 5. HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource |
| 422 | Unprocessable Entity | Business logic error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

## 6. Pagination

### 6.1 Request Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | integer | 0 | Page number (0-indexed) |
| size | integer | 20 | Items per page (max: 100) |
| sort | string | created_at,desc | Sort field and direction |

### 6.2 Response Format

```json
{
  "success": true,
  "data": {
    "content": [],
    "page": 0,
    "size": 20,
    "totalElements": 100,
    "totalPages": 5
  }
}
```

## 7. Filtering

### 7.1 Query Parameters

| Operator | Syntax | Example |
|----------|--------|---------|
| Equals | field=value | status=ACTIVE |
| Not equals | field!=value | status!=INACTIVE |
| Greater than | field>value | created_at>2026-01-01 |
| Less than | field<value | created_at<2026-12-31 |
| Contains | field=*value | name=*Van |
| In | field=(v1,v2) | role=(ADMIN,HR_MANAGER) |

## 8. Date/Time Format

| Type | Format | Example |
|------|--------|---------|
| Date | ISO 8601 | 2026-08-10 |
| Time | ISO 8601 | 10:30:00 |
| DateTime | ISO 8601 | 2026-08-10T10:30:00Z |
| Timezone | UTC | Always UTC in API |

## 9. Authentication

### 9.1 Login Request

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "username": "employee01",
  "password": "Employee@123"
}
```

### 9.2 Login Response

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "expiresIn": 86400,
    "user": {
      "id": 3,
      "username": "employee01",
      "fullName": "Nguyễn Văn A",
      "role": "EMPLOYEE"
    }
  }
}
```

### 9.3 Authenticated Request

```http
GET /api/v1/attendance/me
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

## 10. Rate Limiting

| Endpoint Category | Limit | Window |
|-------------------|-------|--------|
| Authentication | 5 requests | 1 minute |
| Attendance Scan | 10 requests | 1 minute |
| General API | 100 requests | 1 minute |

### 10.1 Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1691635260
```

## 11. Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Input validation failed |
| UNAUTHORIZED | 401 | Authentication required |
| TOKEN_EXPIRED | 401 | JWT token expired |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| ALREADY_EXISTS | 409 | Resource already exists |
| BUSINESS_ERROR | 422 | Business logic error |
| RATE_LIMITED | 429 | Rate limit exceeded |
| SERVER_ERROR | 500 | Internal server error |

## 12. CORS

```http
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```
