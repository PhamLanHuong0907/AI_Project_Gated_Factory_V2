# MOD-05: QR Code Generation - Validations

## Validation Rules

### VAL-M05-01: QR Code Format Validation

| Field | Value |
|-------|-------|
| Validation ID | VAL-M05-01 |
| Rule Name | QR Code Format Validation |
| Status | SPECIFIED |
| Priority | HIGH |

**Description**: Validate generated QR code has correct format.

**Validation Logic**:
```
IF QR code matches expected format THEN
    Store QR code
ELSE
    Regenerate QR code
END IF
```

**Expected Format**: UUID format (e.g., "550e8400-e29b-41d4-a716-446655440000")

---

### VAL-M05-02: QR Code Uniqueness Validation

| Field | Value |
|-------|-------|
| Validation ID | VAL-M05-02 |
| Rule Name | QR Code Uniqueness Validation |
| Status | SPECIFIED |
| Priority | CRITICAL |

**Description**: Validate QR code is unique in system.

**Validation Logic**:
```
IF QR code NOT EXISTS in database WITH status == ACTIVE THEN
    Store QR code
ELSE
    Regenerate QR code
END IF
```

---

### VAL-M05-03: QR Code Expiration Validation

| Field | Value |
|-------|-------|
| Validation ID | VAL-M05-03 |
| Rule Name | QR Code Expiration Validation |
| Status | SPECIFIED |
| Priority | HIGH |
| Source | OQ-013 ANSWERED |

**Description**: Validate QR code expiration is set correctly based on configuration.

**Validation Logic**:
```
validity_duration = get_configured_validity()
expiration_time = current_time + validity_duration

IF expiration_time > current_time THEN
    Store QR code
ELSE
    Reject with error
END IF
```

---

### VAL-M05-04: QR Code Association Validation

| Field | Value |
|-------|-------|
| Validation ID | VAL-M05-04 |
| Rule Name | QR Code Association Validation |
| Status | SPECIFIED |
| Priority | HIGH |

**Description**: Validate QR code is associated with valid employee.

**Validation Logic**:
```
IF employee EXISTS AND is_active THEN
    Store association
ELSE
    Reject with error
END IF
```

---

### VAL-M05-05: Employee Login Validation

| Field | Value |
|-------|-------|
| Validation ID | VAL-M05-05 |
| Rule Name | Employee Login Validation |
| Status | SPECIFIED |
| Priority | CRITICAL |
| Source | OQ-013 ANSWERED |

**Description**: Validate employee is logged in before generating QR.

**Validation Logic**:
```
IF employee_is_logged_in(employee_id) THEN
    Allow QR generation
ELSE
    Reject with error "Vui lòng đăng nhập"
END IF
```

---

### VAL-M05-06: Active QR Limit Validation

| Field | Value |
|-------|-------|
| Validation ID | VAL-M05-06 |
| Rule Name | Active QR Limit Validation |
| Status | SPECIFIED |
| Priority | HIGH |
| Source | OQ-013 ANSWERED |

**Description**: Validate employee has no more than one active QR.

**Validation Logic**:
```
active_qr_count = count_active_qr(employee_id)

IF active_qr_count == 0 THEN
    Allow new QR generation
ELSE IF active_qr_count == 1 THEN
    Ask to cancel old QR before generating new
ELSE
    Reject with error
END IF
```

---

## Validation Summary

| Validation | Status | Priority | Source |
|------------|--------|----------|--------|
| VAL-M05-01: QR Code Format | SPECIFIED | HIGH | - |
| VAL-M05-02: QR Code Uniqueness | SPECIFIED | CRITICAL | - |
| VAL-M05-03: QR Code Expiration | ANSWERED | HIGH | OQ-013 |
| VAL-M05-04: QR Code Association | SPECIFIED | HIGH | - |
| VAL-M05-05: Employee Login | ANSWERED | CRITICAL | OQ-013 |
| VAL-M05-06: Active QR Limit | ANSWERED | HIGH | OQ-013 |
