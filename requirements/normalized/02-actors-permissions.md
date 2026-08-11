# REQ-02: Actors and Permissions

## Actor Inventory

| Actor ID | Actor Name | Source Reference | Status |
|----------|------------|------------------|--------|
| ACT-01 | Employee | Implicit (scans QR) | INFERRED |
| ACT-02 | Administrator | Implicit (reports) | INFERRED |
| ACT-03 | HR Manager | Not in source | NOT SPECIFIED |
| ACT-04 | System Admin | Not in source | NOT SPECIFIED |

## Actor Details

### ACT-01: Employee

- **Description**: Regular employee who needs to clock in/out
- **Source**: Inferred from "Chấm công bằng mã QR"
- **Authentication**: Not specified
- **Default Permissions**:
  - Scan QR code for attendance
  - View own attendance history
  - View own reports
- **Limitations**:
  - Cannot view other employees' data
  - Cannot modify attendance records
  - Cannot access admin functions

### ACT-02: Administrator

- **Description**: Person responsible for generating reports and managing system
- **Source**: Inferred from "báo cáo danh sách nhân viên"
- **Authentication**: Not specified
- **Default Permissions**:
  - View all employee attendance
  - Generate monthly reports
  - Calculate salary
  - Access dashboard
- **Limitations**:
  - Cannot clock in/out for others
  - System admin functions TBD

### ACT-03: HR Manager (NOT SPECIFIED)

- **Description**: Human resources personnel
- **Source**: Not in source document
- **Authentication**: Not specified
- **Permissions**: Not specified
- **Status**: Requires clarification

### ACT-04: System Admin (NOT SPECIFIED)

- **Description**: Technical system administrator
- **Source**: Not in source document
- **Authentication**: Not specified
- **Permissions**: Not specified
- **Status**: Requires clarification

## Role-Permission Matrix

| Permission | Employee (ACT-01) | Administrator (ACT-02) | HR Manager (ACT-03) | System Admin (ACT-04) |
|------------|-------------------|------------------------|---------------------|----------------------|
| Scan QR (Clock IN/OUT) | ✅ | ❌ | ❌ | ❌ |
| View Own Attendance | ✅ | ❌ | ❌ | ❌ |
| View All Attendance | ❌ | ✅ | ✅ | ✅ |
| Generate Reports | ❌ | ✅ | ✅ | ❌ |
| Calculate Salary | ❌ | ✅ | ✅ | ❌ |
| Access Dashboard | ❌ | ✅ | ✅ | ✅ |
| Manage Users | ❌ | ❌ | ❌ | ✅ |
| Configure System | ❌ | ❌ | ❌ | ✅ |

## Authentication Requirements

| Requirement | Status |
|-------------|--------|
| Login method (username/password, SSO, OAuth) | NOT SPECIFIED |
| Session management | NOT SPECIFIED |
| Password policy | NOT SPECIFIED |
| Multi-factor authentication | NOT SPECIFIED |
| Session timeout | NOT SPECIFIED |

## Open Questions

| ID | Question | Impact |
|----|----------|--------|
| OQ-02-01 | Are there more actor types beyond Employee and Administrator? | Role definition |
| OQ-02-02 | What authentication method should be used? | Security |
| OQ-02-03 | Is there role-based access control (RBAC)? | Authorization |
| OQ-02-04 | Can employees view their own attendance history? | Feature scope |
| OQ-02-05 | Are there department/organization hierarchy requirements? | Data model |
| OQ-02-06 | Is there audit logging for attendance modifications? | Compliance |

## Assumptions

1. **ASSUMPTION-02-01**: Employee can only view their own attendance data
2. **ASSUMPTION-02-02**: Administrator has access to all attendance data
3. **ASSUMPTION-02-03**: There is at least one admin role for report generation
