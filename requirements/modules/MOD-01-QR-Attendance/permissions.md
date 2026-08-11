# MOD-01: QR Attendance - Permissions

## Permission Matrix

| Permission | Employee (ACT-01) | Administrator (ACT-02) | Status |
|------------|-------------------|------------------------|--------|
| Scan QR Code | ✅ ALLOW | ❌ DENY | INFERRED |
| View Own Attendance | ✅ ALLOW | ❌ DENY | NOT SPECIFIED |
| View All Attendance | ❌ DENY | ✅ ALLOW | NOT SPECIFIED |
| Edit Attendance | ❌ DENY | ⚠️ TBD | NOT SPECIFIED |
| Delete Attendance | ❌ DENY | ⚠️ TBD | NOT SPECIFIED |
| Generate QR Code | ❌ DENY | ✅ ALLOW | NOT SPECIFIED |
| Manual Override | ❌ DENY | ⚠️ TBD | NOT SPECIFIED |

## Permission Rules

### PERM-M01-01: Scan QR Code

| Field | Value |
|-------|-------|
| Permission ID | PERM-M01-01 |
| Permission Name | Scan QR Code |
| Status | INFERRED |
| Priority | HIGH |

**Description**: Employee can scan QR code to record attendance.

**Allowed Actors**: Employee (ACT-01)

**Access Conditions**:
- Employee is authenticated
- Employee is active in system
- Camera permission granted

**Denied Actions**:
- Cannot scan for another employee
- Cannot scan outside allowed time window (if configured)

**Open Questions**:
- Can administrator scan QR code?
- Is there location-based restriction?

---

### PERM-M01-02: View Own Attendance

| Field | Value |
|-------|-------|
| Permission ID | PERM-M01-02 |
| Permission Name | View Own Attendance |
| Status | NOT SPECIFIED |
| Priority | MEDIUM |

**Description**: Employee can view their own attendance history.

**Allowed Actors**: Employee (ACT-01)

**Access Conditions**:
- Employee is authenticated
- Employee requesting own data

**Data Scope**:
- Own attendance records only
- Cannot view other employees

**Open Questions**:
- What date range can be viewed?
- What details are shown? (time, location, status)
- Can employee export their data?

---

### PERM-M01-03: View All Attendance

| Field | Value |
|-------|-------|
| Permission ID | PERM-M01-03 |
| Permission Name | View All Attendance |
| Status | NOT SPECIFIED |
| Priority | HIGH |

**Description**: Administrator can view all employee attendance records.

**Allowed Actors**: Administrator (ACT-02)

**Access Conditions**:
- Administrator is authenticated
- Has admin role

**Data Scope**:
- All employee attendance records
- Can filter by employee, date, department

**Open Questions**:
- Is there role-based filtering? (e.g., manager sees team only)
- What audit trail exists for data access?

---

### PERM-M01-04: Edit Attendance

| Field | Value |
|-------|-------|
| Permission ID | PERM-M01-04 |
| Permission Name | Edit Attendance |
| Status | NOT SPECIFIED |
| Priority | HIGH |

**Description**: Administrator can modify attendance records.

**Allowed Actors**: Administrator (ACT-02)

**Access Conditions**:
- Administrator is authenticated
- Has admin role
- Reason for modification provided

**Audit Requirements**:
- Log all modifications
- Store original values
- Record who made change and why

**Open Questions**:
- Can administrator edit any record?
- Is approval required for edits?
- What fields can be edited?

---

### PERM-M01-05: Generate QR Code

| Field | Value |
|-------|-------|
| Permission ID | PERM-M01-05 |
| Permission Name | Generate QR Code |
| Status | NOT SPECIFIED |
| Priority | HIGH |

**Description**: Administrator can generate QR codes for attendance.

**Allowed Actors**: Administrator (ACT-02)

**Access Conditions**:
- Administrator is authenticated
- Has admin role

**Scope**:
- Generate single-use or multi-use QR codes
- Set expiration time
- Assign to location/department

**Open Questions**:
- Who can generate QR codes?
- Are QR codes generated automatically or manually?
- Can QR codes be printed?

---

## Role-Based Access Control (RBAC) Assessment

| Aspect | Status | Notes |
|--------|--------|-------|
| Role Definition | NOT SPECIFIED | Need to define roles |
| Permission Assignment | NOT SPECIFIED | Need to define |
| Role Hierarchy | NOT SPECIFIED | Need to define |
| Permission Inheritance | NOT SPECIFIED | Need to define |

## Open Questions

| ID | Question | Impact |
|----|----------|--------|
| OQ-P01-01 | What roles exist in the system? | Authorization |
| OQ-P01-02 | Is there role hierarchy? | Authorization |
| OQ-P01-03 | Can permissions be customized per role? | Flexibility |
| OQ-P01-04 | Is there audit logging for permission changes? | Security |
| OQ-P01-05 | Can permissions be assigned to departments? | Organization |

## Security Considerations

1. **Least Privilege**: Employees should only have minimal required permissions
2. **Separation of Duties**: Employee should not be able to edit own attendance
3. **Audit Trail**: All permission-sensitive actions should be logged
4. **Time-based Access**: Consider time-limited permissions for temporary access

## Recommendation

Permissions need detailed specification:
1. Define all user roles
2. Define role-permission matrix
3. Define permission inheritance rules
4. Define audit requirements
