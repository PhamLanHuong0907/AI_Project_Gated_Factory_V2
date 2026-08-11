# MOD-05: QR Code Generation - Acceptance Criteria

## Acceptance Criteria

### AC-M05-01: Employee Generates QR Code

| Field | Value |
|-------|-------|
| Criteria ID | AC-M05-01 |
| Feature | Button to Generate QR Code |
| Status | SPECIFIED |
| Priority | CRITICAL |
| Source | OQ-013 ANSWERED |

**Given**: Employee is logged in
**When**: Employee presses "Tạo mã QR" button
**Then**:
- System checks if employee has active QR
- If has active QR, ask to cancel old QR
- System generates new QR code
- QR code is displayed on screen
- QR code has expiration based on configuration

**Acceptance Criteria**:
- [ ] Employee can press button to generate QR
- [ ] System checks for existing active QR
- [ ] New QR invalidates old QR (with confirmation)
- [ ] QR code is displayed correctly
- [ ] Expiration time is set based on configuration

---

### AC-M05-02: QR Code Validity Based on Configuration

| Field | Value |
|-------|-------|
| Criteria ID | AC-M05-02 |
| Feature | QR Code Validity |
| Status | SPECIFIED |
| Priority | HIGH |
| Source | OQ-013 ANSWERED |

**Given**: Admin has configured validity period
**When**: Employee generates QR code
**Then**:
- QR code validity period is based on configuration
- QR code expires after configured period
- Expired QR cannot be used for attendance

**Acceptance Criteria**:
- [ ] Validity period is read from configuration
- [ ] QR expires after configured period
- [ ] Expired QR is rejected during scan

---

### AC-M05-03: QR Code Display

| Field | Value |
|-------|-------|
| Criteria ID | AC-M05-03 |
| Feature | QR Code Display |
| Status | SPECIFIED |
| Priority | HIGH |

**Given**: QR code is generated
**When**: Employee views QR code
**Then**:
- QR code is displayed on screen
- QR code is readable by scanner
- QR code shows expiration time

**Acceptance Criteria**:
- [ ] QR code displays correctly
- [ ] QR code is scannable
- [ ] Expiration time is shown

---

### AC-M05-04: Work Time QR Reminder

| Field | Value |
|-------|-------|
| Criteria ID | AC-M05-04 |
| Feature | Work Time Reminder |
| Status | SPECIFIED |
| Priority | HIGH |
| Source | OQ-013 ANSWERED |

**Given**: Employee has shift today and no active QR
**When**: Time to shift start <= reminder threshold
**Then**:
- System sends reminder notification to employee
- Reminder message: "Vui lòng tạo mã QR chấm công"
- Reminder is sent only once per shift

**Acceptance Criteria**:
- [ ] System detects employee has no active QR
- [ ] System checks time to shift start
- [ ] Reminder is sent when threshold reached
- [ ] Reminder is not repeated unnecessarily

---

### AC-M05-05: QR Code Expiration

| Field | Value |
|-------|-------|
| Criteria ID | AC-M05-05 |
| Feature | QR Code Expiration |
| Status | SPECIFIED |
| Priority | HIGH |

**Given**: QR code is generated with expiration
**When**: Expiration time passes
**Then**:
- QR code status changes to EXPIRED
- QR code cannot be used for attendance
- Employee can generate new QR

**Acceptance Criteria**:
- [ ] QR code expires correctly
- [ ] Expired QR cannot be used
- [ ] Employee can generate new QR after expiration

---

### AC-M05-06: QR Code Invalidation by Admin

| Field | Value |
|-------|-------|
| Criteria ID | AC-M05-06 |
| Feature | QR Code Invalidation |
| Status | SPECIFIED |
| Priority | MEDIUM |

**Given**: Administrator wants to invalidate QR code
**When**: Admin requests invalidation
**Then**:
- QR code status changes to INVALIDATED
- QR code cannot be used for attendance
- Action is logged

**Acceptance Criteria**:
- [ ] QR code can be invalidated
- [ ] Invalidated QR cannot be used
- [ ] Action is logged

---

## Acceptance Criteria Summary

| Criteria | Status | Priority | Source |
|----------|--------|----------|--------|
| AC-M05-01: Employee Generates QR | ANSWERED | CRITICAL | OQ-013 |
| AC-M05-02: QR Validity Based on Config | ANSWERED | HIGH | OQ-013 |
| AC-M05-03: QR Code Display | SPECIFIED | HIGH | - |
| AC-M05-04: Work Time Reminder | ANSWERED | HIGH | OQ-013 |
| AC-M05-05: QR Code Expiration | SPECIFIED | HIGH | - |
| AC-M05-06: QR Invalidation by Admin | SPECIFIED | MEDIUM | - |
