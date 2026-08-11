# REQ-05: Open Questions

## Answered Questions

### Authentication & Security

| ID | Question | Answer | Status |
|----|----------|--------|--------|
| OQ-004 | What authentication method is required? | Login with personal account, scan QR with personal device | ✅ ANSWERED |

### QR Code System

| ID | Question | Answer | Status |
|----|----------|--------|--------|
| OQ-013 | How are QR codes generated? | User presses button to generate | ✅ ANSWERED |
| OQ-015 | What is QR code validity period? | Based on configuration | ✅ ANSWERED |

### Attendance Rules

| ID | Question | Answer | Status |
|----|----------|--------|--------|
| OQ-018 | What are standard working hours? | Shift configuration available | ✅ ANSWERED |

### Overtime & Salary

| ID | Question | Answer | Status |
|----|----------|--------|--------|
| OQ-028 | What salary components are calculated? | Salary categories, base salary, calculation formula, default penalties | ✅ ANSWERED |

---

## Remaining Open Questions

### Project Identity

| ID | Question | Impact | Priority |
|----|----------|--------|----------|
| OQ-001 | What is the official project name? | Project documentation | HIGH |
| OQ-002 | What is the project code for configuration? | System configuration | HIGH |
| OQ-003 | What is the target deployment environment? | Architecture | HIGH |

### Authentication & Security

| ID | Question | Impact | Priority |
|----|----------|--------|----------|
| OQ-005 | Is multi-factor authentication required? | Security level | HIGH |
| OQ-006 | What password policy applies? | Security | MEDIUM |
| OQ-007 | What is session timeout policy? | Security | MEDIUM |
| OQ-008 | Is audit logging required for attendance modifications? | Compliance | HIGH |

### User Management

| ID | Question | Impact | Priority |
|----|----------|--------|----------|
| OQ-009 | How many user roles are there? | Role design | HIGH |
| OQ-010 | Can employees self-register or are they created by admin? | User management | HIGH |
| OQ-011 | Is there department/team hierarchy? | Data model | HIGH |
| OQ-012 | Can employees belong to multiple departments? | Data model | MEDIUM |

### QR Code System

| ID | Question | Impact | Priority |
|----|----------|--------|----------|
| OQ-014 | Where are QR codes displayed? (Screen, Printed, Mobile badge) | User experience | HIGH |
| OQ-016 | Are QR codes single-use or reusable? | Security | HIGH |
| OQ-017 | Can the same QR code be used by multiple employees? | Security | HIGH |

### Attendance Rules

| ID | Question | Impact | Priority |
|----|----------|--------|----------|
| OQ-019 | What is the grace period for late arrivals? | Business rules | HIGH |
| OQ-020 | What defines "late arrival"? | Business rules | HIGH |
| OQ-021 | What defines "early departure"? | Business rules | HIGH |
| OQ-022 | What is minimum interval between consecutive scans? | Business rules | HIGH |
| OQ-023 | How are holidays handled? | Business rules | HIGH |
| OQ-024 | Can employees work on weekends? | Business rules | MEDIUM |

### Overtime & Salary

| ID | Question | Impact | Priority |
|----|----------|--------|----------|
| OQ-025 | Is overtime tracked automatically? | Feature scope | HIGH |
| OQ-026 | What is overtime rate calculation? | Business rules | HIGH |
| OQ-027 | Is overtime approval required? | Workflow | HIGH |
| OQ-029 | Is salary calculation automatic or manual? | Workflow | HIGH |
| OQ-030 | Are there different pay grades? | Data model | MEDIUM |

### Reports & Dashboard

| ID | Question | Impact | Priority |
|----|----------|--------|----------|
| OQ-031 | What report formats are supported? (PDF, Excel, CSV) | Feature | HIGH |
| OQ-032 | What metrics are on the dashboard? | Feature | HIGH |
| OQ-033 | Who can access the dashboard? | Security | HIGH |
| OQ-034 | Can reports be filtered by department/team? | Feature | MEDIUM |
| OQ-035 | What is historical data retention policy? | Data | MEDIUM |

### Technical

| ID | Question | Impact | Priority |
|----|----------|--------|----------|
| OQ-036 | Is this a single-tenant or multi-tenant system? | Architecture | HIGH |
| OQ-037 | What is expected user count? | Scalability | MEDIUM |
| OQ-038 | Are there integration requirements with existing HR systems? | Integration | HIGH |
| OQ-039 | What mobile OS/browsers must be supported? | Compatibility | HIGH |
| OQ-040 | Is offline attendance supported? | Feature scope | MEDIUM |

## Questions by Priority

### CRITICAL (All answered ✅)

1. ~~OQ-004: Authentication method~~ ✅ ANSWERED
2. ~~OQ-013: QR code generation method~~ ✅ ANSWERED
3. ~~OQ-018: Standard working hours~~ ✅ ANSWERED
4. ~~OQ-028: Salary components~~ ✅ ANSWERED

### HIGH (Remaining)

1. OQ-001-003: Project identity
2. OQ-005-008: Security requirements
3. OQ-009-012: User management
4. OQ-014-017: QR code details
5. OQ-019-024: Attendance rules
6. OQ-025-027, OQ-029-030: Overtime/salary
7. OQ-031-033: Reports/dashboard
8. OQ-036, OQ-038: Architecture

### MEDIUM (Remaining)

1. OQ-034-035: Report filtering
2. OQ-037, OQ-039-040: Technical details

## Impact Assessment

**Current Requirement Completeness**: ~75%

**BLOCKED Status**: No - Critical questions answered

**Recommendation**:
1. Proceed with implementation planning
2. Clarify remaining HIGH priority questions during development
3. Define non-functional requirements
