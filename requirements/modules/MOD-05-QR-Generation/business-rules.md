# MOD-05: QR Code Generation - Business Rules

## Business Rules

### BR-M05-01: QR Code Generation Method

| Field | Value |
|-------|-------|
| Rule ID | BR-M05-01 |
| Rule Name | QR Code Generation Method |
| Status | SPECIFIED |
| Priority | HIGH |
| Source | OQ-013 ANSWERED |

**Description**: QR code is generated when employee presses the generate button.

**Logic**:
```
WHEN employee presses "Generate QR" button:
    qr_code = generate_unique_code()
    validity_period = get_configured_validity()
    expiration_time = current_time + validity_period
    associate_with_employee(qr_code, employee_id)
    store_in_database(qr_code, expiration_time)
    display_qr_on_screen(qr_code)
END WHEN
```

**Rules**:
1. Employee must be logged in to generate QR
2. Only one active QR per employee at a time
3. New QR invalidates previous active QR
4. Validity period is based on system configuration

---

### BR-M05-02: QR Code Uniqueness

| Field | Value |
|-------|-------|
| Rule ID | BR-M05-02 |
| Rule Name | QR Code Uniqueness |
| Status | SPECIFIED |
| Priority | CRITICAL |

**Description**: Each QR code must be unique within its validity period.

**Logic**:
```
qr_code = generate_unique_code()
WHILE qr_code EXISTS in database WITH status == ACTIVE:
    qr_code = generate_unique_code()
END WHILE
RETURN qr_code
```

**Validation**:
- QR code does not exist in database with ACTIVE status
- QR code is unique across system

**Exception Handling**:
- Collision detected: Regenerate code

---

### BR-M05-03: QR Code Expiration

| Field | Value |
|-------|-------|
| Rule ID | BR-M05-03 |
| Rule Name | QR Code Expiration |
| Status | SPECIFIED |
| Priority | HIGH |
| Source | OQ-013 ANSWERED |

**Description**: QR codes have validity period based on system configuration.

**Logic**:
```
validity_duration = get_configured_validity_from_admin()
expiration_time = current_time + validity_duration
```

**Configuration**:
| Setting | Default | Configurable |
|---------|---------|--------------|
| Validity Period | 30 minutes | Yes (Admin) |
| Max Active QR | 1 per employee | Yes |

**Rules**:
1. Validity period is set by administrator
2. QR expires automatically after validity period
3. Expired QR cannot be used for attendance
4. Employee can generate new QR after expiration

---

### BR-M05-04: QR Code Association

| Field | Value |
|-------|-------|
| Rule ID | BR-M05-04 |
| Rule Name | QR Code Association |
| Status | SPECIFIED |
| Priority | HIGH |

**Description**: QR codes must be associated with employee or shift.

**Logic**:
```
IF strategy == "per_employee" THEN
    associate_with_employee(qr_code, employee_id)
ELSE IF strategy == "per_shift" THEN
    associate_with_shift(qr_code, shift_id)
ELSE IF strategy == "per_day" THEN
    associate_with_date(qr_code, date)
END IF
```

**Open Questions**:
- Can QR codes be shared between employees?
- How to handle multi-shift employees?

---

### BR-M05-05: QR Code Invalidation

| Field | Value |
|-------|-------|
| Rule ID | BR-M05-05 |
| Rule Name | QR Code Invalidation |
| Status | SPECIFIED |
| Priority | MEDIUM |

**Description**: QR codes can be manually invalidated by administrator.

**Logic**:
```
IF admin requests invalidation THEN
    Mark QR as INVALIDATED
    Log invalidation action
    Notify affected users (if applicable)
END IF
```

**Rules**:
1. Only admin can invalidate QR codes
2. Invalidation requires confirmation
3. Invalidation is logged for audit
4. Invalidation cannot be reversed

---

### BR-M05-06: Work Time QR Reminder

| Field | Value |
|-------|-------|
| Rule ID | BR-M05-06 |
| Rule Name | Work Time QR Reminder |
| Status | SPECIFIED |
| Priority | HIGH |
| Source | OQ-013 ANSWERED |

**Description**: System reminds employee to generate QR if approaching work time without active QR.

**Logic**:
```
FOR EACH employee WITH shift_today == TRUE:
    time_to_start = shift_start_time - current_time
    has_active_qr = check_active_qr(employee_id)

    IF time_to_start <= reminder_threshold AND has_active_qr == FALSE THEN
        send_reminder(employee_id, "Vui lòng tạo mã QR chấm công")
    END IF
END FOR
```

**Configuration**:
| Setting | Default | Configurable |
|---------|---------|--------------|
| Reminder Threshold | 15 minutes before shift | Yes (Admin) |
| Reminder Frequency | Once per shift | Yes |
| Reminder Method | In-app notification | Yes |

**Rules**:
1. Reminder is sent only when employee has no active QR
2. Reminder is sent before shift start time
3. Reminder threshold is configurable
4. Employee can dismiss reminder
5. System logs all reminders sent

---

## Summary

| Rule | Status | Key Requirement |
|------|--------|-----------------|
| BR-M05-01: Generation Method | ANSWERED | Employee presses button to generate |
| BR-M05-02: Uniqueness | SPECIFIED | Must be unique |
| BR-M05-03: Expiration | ANSWERED | Validity based on configuration |
| BR-M05-04: Association | SPECIFIED | Must be associated with employee |
| BR-M05-05: Invalidation | SPECIFIED | Can be manually invalidated |
| BR-M05-06: Work Time Reminder | ANSWERED | Remind if near work time without QR |

## Recommendation

QR generation rules are now specified:
1. Employee generates QR by pressing button ✓
2. Validity period is configured by admin ✓
3. System reminds employee if approaching work time without QR ✓
4. Open: Dynamic vs static QR, reminder threshold value
