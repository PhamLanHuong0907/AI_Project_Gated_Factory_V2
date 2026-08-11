# Stitch Prompt: SCR-01 — Đăng nhập

## Screen Identity

| Field | Value |
|-------|-------|
| Screen ID | SCR-01 |
| Screen Name | Đăng nhập |
| Route | `/login` |
| Use Case | UC-01 |
| Actors | All (unauthenticated) |
| Layout | **Standalone** (NO App Shell — this screen does NOT use the global shell) |

## User Role & Goal

Any unauthenticated user needs to log in with email and password to access the system. On success, they are redirected to their role-based home screen.

## GLOBAL APP SHELL LOCK

> This screen is **standalone** — it does NOT use the App Shell. No top bar, no sidebar, no bottom nav. The login form is centered on a clean background.

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

| Field | Type | Label | Required | Validation | Placeholder |
|-------|------|-------|----------|------------|-------------|
| username | text | Tên đăng nhập | Yes | Min 3, Max 50 chars | "Nhập tên đăng nhập" |
| password | password | Mật khẩu | Yes | Min 8 chars | "Nhập mật khẩu" |

## Actions

| Action | Trigger | Component | Behavior |
|--------|---------|-----------|----------|
| Đăng nhập | Button click / Enter key | Button (primary, full-width) | Validate → POST /api/v1/auth/login → Store JWT → Redirect by role |
| Show/Hide password | Eye icon click | IconButton | Toggle password visibility |
| Forgot password | Link click | TextLink | Show toast "Vui lòng liên hệ admin" |

## API Operations

| Operation | Method | Endpoint | Request | Response |
|-----------|--------|----------|---------|----------|
| login | POST | `/api/v1/auth/login` | `{ username: string, password: string }` | `{ success: boolean, data: { token: string, expiresIn: number, user: { id, name, email, role } } }` |

## States

### Loading State
- Button shows spinner icon
- Form inputs disabled
- Text changes to "Đang đăng nhập..."

### Success State
- Haptic feedback (light vibration)
- Redirect: EMPLOYEE → `/qr/scan`, ADMIN/HR_MANAGER → `/`

### Error States

| Error | Display | Message |
|-------|---------|---------|
| 401 Invalid credentials | Below form, red text | "Tên đăng nhập hoặc mật khẩu không đúng" |
| 403 Account locked | Below form, red text | "Tài khoản đã bị khóa. Vui lòng liên hệ admin" |
| 429 Rate limited | Toast | "Quá nhiều yêu cầu. Vui lòng thử lại sau {retryAfter}s" |
| 500 Server error | Toast | "Lỗi hệ thống. Vui lòng thử lại" |
| Network error | Toast | "Không thể kết nối. Kiểm tra mạng và thử lại" |

## Responsive Rules

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | ≤ 480px | Full-width card, padding 16px |
| Tablet | 481–768px | Centered card, max-width 400px |
| Desktop | ≥ 769px | Centered card, max-width 400px, subtle background gradient |

## Design Tokens

| Element | Token | Value |
|---------|-------|-------|
| Card background | `--color-bg` | `#FFFFFF` |
| Card border | `--color-border` | `#E2E8F0` |
| Card shadow | `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` |
| Card radius | `--radius-lg` | `12px` |
| Primary button bg | `--color-primary` | `#2563EB` |
| Primary button text | white | `#FFFFFF` |
| Input border | `--color-border` | `#E2E8F0` |
| Input focus border | `--color-primary` | `#2563EB` |
| Error text | `--color-error` | `#DC2626` |
| Label text | `--color-text-secondary` | `#64748B` |
| Title text | `--color-text` | `#0F172A` |

## Forbidden

- DO NOT add social login buttons (Google, Facebook, etc.)
- DO NOT add "Remember me" checkbox
- DO NOT add registration link
- DO NOT change the form layout to multi-step
- DO NOT add CAPTCHA

## Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-SCR01-01 | Form validates required fields before submission |
| AC-SCR01-02 | Username min 3 chars, password min 8 chars |
| AC-SCR01-03 | Loading spinner on button during API call |
| AC-SCR01-04 | Error message displayed below form on 401 |
| AC-SCR01-05 | Successful login redirects: EMPLOYEE → `/qr/scan`, ADMIN/HR → `/` |
| AC-SCR01-06 | JWT token stored in localStorage |
| AC-SCR01-07 | Password toggle shows/hides password |
| AC-SCR01-08 | Enter key submits form |
| AC-SCR01-09 | Form disabled during submission |
| AC-SCR01-10 | Touch target ≥ 44px for all interactive elements |
| AC-SCR01-11 | Works at 320px minimum width |
| AC-SCR01-12 | Haptic feedback on successful login (light vibration) |
