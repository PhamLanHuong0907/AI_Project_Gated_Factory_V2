# SCR-01 — Đăng nhập (`/login`)

## General

| Field | Value |
|-------|-------|
| Screen ID | SCR-01 |
| Screen Name | Đăng nhập |
| Route | `/login` |
| Use Case | UC-01 |
| Actors | All (unauthenticated) |
| Priority | P0 |
| Layout | Standalone (no App Shell) |

## Layout

```
┌─────────────────────────────────────────┐
│                                         │
│           [Company Logo]                │
│        Hệ thống Chấm công QR           │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Tên đăng nhập                  │   │
│  │  ┌───────────────────────────┐  │   │
│  │  │                           │  │   │
│  │  └───────────────────────────┘  │   │
│  │                                 │   │
│  │  Mật khẩu                  👁  │   │
│  │  ┌───────────────────────────┐  │   │
│  │  │ ••••••••                  │  │   │
│  │  └───────────────────────────┘  │   │
│  │                                 │   │
│  │  [Đăng nhập]                    │   │
│  └─────────────────────────────────┘   │
│                                         │
│         © 2026 Company Name            │
└─────────────────────────────────────────┘
```

## Fields

| Field | Type | Required | Validation | Default |
|-------|------|----------|------------|---------|
| username | text | Yes | Min 3, Max 50 chars | — |
| password | password | Yes | Min 8 chars | — |

## Actions

| Action | Trigger | API Call | Behavior |
|--------|---------|----------|----------|
| Đăng nhập | Button click / Enter key | `POST /api/v1/auth/login` | Send credentials, store JWT, redirect by role |
| Show/Hide password | Eye icon click | — | Toggle password visibility |
| Forgot password | Link click | — | Show toast "Vui lòng liên hệ admin" (v1) |

## API Operations

| Operation | Method | Endpoint | Request | Response |
|-----------|--------|----------|---------|----------|
| login | POST | `/api/v1/auth/login` | `{ username, password }` | `{ success, data: { token, expiresIn, user } }` |

## Loading State

| State | Behavior |
|-------|----------|
| Loading | Button shows spinner, form disabled |
| Success | Redirect to `/{role-based-route}` |
| Error (401) | Inline error: "Tên đăng nhập hoặc mật khẩu không đúng" |
| Error (429) | Toast: "Quá nhiều yêu cầu. Vui lòng thử lại sau [X]s" |
| Error (500) | Toast: "Lỗi hệ thống. Vui lòng thử lại" |

## Empty State

Not applicable (form always has fields).

## Error Display

| Error Code | Display Location | Message |
|------------|-----------------|---------|
| INVALID_CREDENTIALS | Below form | "Tên đăng nhập hoặc mật khẩu không đúng" |
| ACCOUNT_LOCKED | Below form | "Tài khoản đã bị khóa. Vui lòng liên hệ admin" |
| RATE_LIMITED | Toast | "Quá nhiều yêu cầu. Vui lòng thử lại sau {retryAfter}s" |
| NETWORK_ERROR | Toast | "Không thể kết nối. Kiểm tra mạng và thử lại" |

## Responsive Rules

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | ≤ 480px | Full-width card, padding 16px |
| Tablet | 481–768px | Centered card, max-width 400px |
| Desktop | ≥ 769px | Centered card, max-width 400px, background gradient |

## Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-SCR01-01 | Form validates required fields before submission |
| AC-SCR01-02 | Username min 3 chars, password min 8 chars |
| AC-SCR01-03 | Loading spinner on button during API call |
| AC-SCR01-04 | Error message displayed below form on failure |
| AC-SCR01-05 | Successful login redirects: EMPLOYEE → `/qr/scan`, ADMIN/HR → `/` |
| AC-SCR01-06 | JWT token stored in localStorage |
| AC-SCR01-07 | Password toggle shows/hides password |
| AC-SCR01-08 | Enter key submits form |
| AC-SCR01-09 | Form disabled during submission |
| AC-SCR01-10 | Touch target ≥ 44px for all interactive elements |
| AC-SCR01-11 | Works at 320px minimum width |
| AC-SCR01-12 | Haptic feedback on successful login (light vibration) |
