# MOD-07: Authentication - Overview

## Module Identity

| Field | Value |
|-------|-------|
| Module ID | MOD-07 |
| Module Name | Authentication |
| Requirement Reference | REQ-07 |
| Status | SPECIFIED |

## Purpose

Enable users to login with personal account, then use personal device to scan QR code for attendance identification.

## Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                       │
├─────────────────────────────────────────────────────────────┤
│  1. User opens app                                          │
│  2. User enters username/password                           │
│  3. System validates credentials                            │
│  4. Session created                                         │
│  5. User can now scan QR codes                              │
│  6. QR scan identifies user for attendance                  │
└─────────────────────────────────────────────────────────────┘
```

## Actors

| Actor | Role | Access Level |
|-------|------|--------------|
| Employee (ACT-01) | Login and scan QR | Login, scan QR, view own data |
| Administrator (ACT-02) | Manage users | Create/edit/delete users |

## Features

| Feature ID | Feature Name | Status |
|------------|--------------|--------|
| F-07-01 | User Login | SPECIFIED |
| F-07-02 | Session Management | SPECIFIED |
| F-07-03 | Password Validation | SPECIFIED |
| F-07-04 | Account Lockout | NOT SPECIFIED |
| F-07-05 | Logout | SPECIFIED |

## Module Dependencies

| Dependency | Module/System | Status |
|------------|---------------|--------|
| User Management | MOD-08 | REQUIRED |
| Database | PostgreSQL | REQUIRED |

## Constraints

1. Users must login before scanning QR
2. Session must be active for QR scan to work
3. Password must meet security policy
4. Account lockout after failed attempts

## Assumptions

1. Username/password authentication is sufficient
2. Session timeout is configurable
3. Passwords are hashed and stored securely
4. Account lockout prevents brute force attacks

## Open Questions

| ID | Question |
|----|----------|
| OQ-M07-01 | Is multi-factor authentication required? |
| OQ-M07-02 | What is session timeout? |
| OQ-M07-03 | How many failed attempts before lockout? |
| OQ-M07-04 | Is password reset functionality required? |

## Source Traceability

| Source Section | Requirement |
|----------------|-------------|
| Stakeholder | "Đăng nhập tài khoản cá nhân rồi dùng thiết bị cá nhân quét mã để nhận diện" |
