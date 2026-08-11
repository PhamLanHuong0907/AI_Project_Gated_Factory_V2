# System Context - Phần mềm Chấm công

## 1. System Overview

| Field | Value |
|-------|-------|
| System Name | Hệ thống Chấm công QR |
| System Code | ATTENDANCE-SYS |
| Version | 1.0.0 |
| Timezone | Asia/Ho_Chi_Minh |
| Language | Vietnamese (vi) |

## 2. System Context Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          SYSTEM CONTEXT DIAGRAM                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│    ┌──────────────┐         ┌──────────────────┐         ┌──────────────┐      │
│    │   Employee    │         │  Attendance Sys   │         │   Admin/HR   │      │
│    │  (ACT-01)     │◄───────►│  (Core System)    │◄───────►│  (ACT-02)    │      │
│    └──────────────┘         └──────────────────┘         └──────────────┘      │
│           │                        │    │                        │              │
│           │                        │    │                        │              │
│           ▼                        ▼    ▼                        ▼              │
│    ┌──────────────┐         ┌──────────────────┐         ┌──────────────┐      │
│    │ Mobile Device │         │   PostgreSQL      │         │  Web Portal  │      │
│    │ (Camera+GPS)  │         │   Database        │         │  (ReactJS)   │      │
│    └──────────────┘         └──────────────────┘         └──────────────┘      │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 3. Actors

| Actor ID | Actor Name | Description | Access Level |
|----------|------------|-------------|--------------|
| ACT-01 | Nhân viên (Employee) | Scan QR for attendance | Login, scan QR, view own data |
| ACT-02 | Quản trị viên (Admin) | System administration | Full access |
| ACT-03 | HR Manager | Reports and salary | View reports, manage salary |
| ACT-SYS | System | Automated processes | QR generation, auto-OUT, reminders |

## 4. External Systems

| System | Integration | Protocol | Purpose |
|--------|-------------|----------|---------|
| GPS Service | Device native | Browser API | Get employee location |
| Camera | Device native | Browser API | Scan QR codes |
| PostgreSQL | Direct | JDBC | Data persistence |

## 5. System Boundaries

### In Scope
- QR code attendance (IN/OUT)
- GPS location verification
- Dynamic QR generation
- Monthly reports
- Salary calculation
- User authentication
- Shift configuration

### Out of Scope
- Payroll integration (external)
- Biometric verification
- Multi-tenant support (v1)
- Offline attendance

## 6. Assumptions

| ID | Assumption | Impact |
|----|------------|--------|
| ASSUM-01 | Single company deployment | Data model simplified |
| ASSUM-02 | Network always available | No offline support needed |
| ASSUM-320px | Minimum screen width: 320px | Mobile compatibility |
| ASSUM-GPS | GPS accuracy: 20-50m indoor | Threshold configurable |
| ASSUM-PWA | PWA sufficient (no native app) | Lower development cost |

## 7. Constraints

| Type | Constraint |
|------|------------|
| Technical | Java 21, Spring Boot, ReactJS, PostgreSQL |
| Business | QR + GPS required for attendance |
| Security | Password authentication, session management |
| Performance | Response time < 1s normal, < 3s acceptable |
