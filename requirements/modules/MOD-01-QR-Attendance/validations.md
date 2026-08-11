# MOD-01: QR Attendance - Validations

## Validation Rules

### VAL-M01-01: QR Code Format Validation

| Field | Value |
|-------|-------|
| Validation ID | VAL-M01-01 |
| Rule Name | QR Code Format Validation |
| Status | INFERRED |
| Priority | HIGH |

**Description**: Validate that scanned QR code has correct format.

**Validation Logic**:
```
IF QR code matches expected format THEN
    Proceed with validation
ELSE
    Reject with error
END IF
```

**Expected Format**: TBD (e.g., UUID, Base64, custom format)

**Error Message**: "Mã QR không hợp lệ"

**Open Questions**:
- What is the expected QR code format?
- Is there a prefix or suffix?
- What encoding is used?

---

### VAL-M01-02: QR Code Existence Validation

| Field | Value |
|-------|-------|
| Validation ID | VAL-M01-02 |
| Rule Name | QR Code Existence Validation |
| Status | NOT SPECIFIED |
| Priority | HIGH |

**Description**: Validate that QR code exists in system database.

**Validation Logic**:
```
IF QR code exists in database AND status == ACTIVE THEN
    Proceed
ELSE
    Reject with error
END IF
```

**Error Message**: "Mã QR không tồn tại hoặc đã hết hạn"

**Open Questions**:
- How are QR codes stored in database?
- What is the QR code entity structure?
- How are inactive QR codes handled?

---

### VAL-M01-03: QR Code Expiration Validation

| Field | Value |
|-------|-------|
| Validation ID | VAL-M01-03 |
| Rule Name | QR Code Expiration Validation |
| Status | NOT SPECIFIED |
| Priority | HIGH |

**Description**: Validate that QR code has not expired.

**Validation Logic**:
```
IF current_time <= QR_code.expiration_time THEN
    Proceed
ELSE
    Reject with error
END IF
```

**Error Message**: "Mã QR đã hết hạn, vui lòng lấy mã mới"

**Open Questions**:
- What is the expiration duration?
- Is expiration configurable?
- How is expiration time calculated?

---

### VAL-M01-04: Employee-QR Code Association

| Field | Value |
|-------|-------|
| Validation ID | VAL-M01-04 |
| Rule Name | Employee-QR Code Association |
| Status | NOT SPECIFIED |
| Priority | HIGH |

**Description**: Validate that QR code is associated with the scanning employee.

**Validation Logic**:
```
IF QR_code.employee_id == scanned_employee.id THEN
    Proceed
ELSE
    Reject with error
END IF
```

**Error Message**: "Mã QR không thuộc về bạn"

**Open Questions**:
- Is QR code employee-specific or shared?
- Can one QR code be used by multiple employees?
- Is there location-based validation?

---

### VAL-M01-05: Duplicate Attendance Validation

| Field | Value |
|-------|-------|
| Validation ID | VAL-M01-05 |
| Rule Name | Duplicate Attendance Validation |
| Status | INFERRED |
| Priority | HIGH |

**Description**: Validate that employee is not attempting duplicate attendance.

**Validation Logic**:
```
last_attendance = get_last_attendance(employee_id)
IF last_attendance.type == requested_type THEN
    IF time_diff(current_time, last_attendance.time) < minimum_interval THEN
        Reject as duplicate
    ELSE
        Proceed (minimum interval passed)
    END IF
ELSE
    Proceed (different type)
END IF
```

**Error Message**: "Bạn đã chấm công [IN/OUT] rồi"

**Open Questions**:
- What is minimum interval between scans?
- Can admin override this validation?
- How to handle edge cases?

---

### VAL-M01-06: Time Window Validation

| Field | Value |
|-------|-------|
| Validation ID | VAL-M01-06 |
| Rule Name | Time Window Validation |
| Status | NOT SPECIFIED |
| Priority | MEDIUM |

**Description**: Validate that attendance is within allowed time window.

**Validation Logic**:
```
IF current_time >= allowed_start_time AND current_time <= allowed_end_time THEN
    Proceed
ELSE
    Allow but mark as outside window
END IF
```

**Error Message**: Warning - Outside working hours

**Open Questions**:
- What are the allowed time windows?
- Is attendance allowed outside working hours?
- How to handle overnight shifts?

---

### VAL-M01-07: Camera Permission Validation

| Field | Value |
|-------|-------|
| Validation ID | VAL-M01-07 |
| Rule Name | Camera Permission Validation |
| Status | NOT SPECIFIED |
| Priority | HIGH |

**Description**: Validate that camera permission is granted.

**Validation Logic**:
```
IF camera_permission == GRANTED THEN
    Enable QR scanning
ELSE
    Prompt for permission
END IF
```

**Error Message**: "Vui lòng cấp quyền truy cập camera"

**Open Questions**:
- What if user denies camera permission?
- Is there manual entry fallback?
- How to handle permission revocation?

---

### VAL-M01-08: GPS Location Validation (NEW)

| Field | Value |
|-------|-------|
| Validation ID | VAL-M01-08 |
| Rule Name | GPS Location Validation |
| Status | SPECIFIED |
| Priority | CRITICAL |

**Description**: Validate that employee GPS location is within 10 meters of company location.

**Validation Logic**:
```
employee_gps = get_employee_gps_location()
company_gps = get_company_gps_location()

IF employee_gps IS NULL OR employee_gps IS INVALID THEN
    Reject with error "Vui lòng bật GPS"
END IF

IF company_gps IS NULL OR company_gps IS NOT CONFIGURED THEN
    Reject with error "Không tìm thấy vị trí công ty"
END IF

distance = haversine_distance(employee_gps, company_gps)

IF distance <= 10 THEN
    GPS validation PASSED
ELSE
    GPS validation FAILED
    Reject with error "Khoảng cách {distance}m > 10m"
END IF
```

**Error Messages**:
- GPS unavailable: "Vui lòng bật GPS trên thiết bị"
- Company GPS not configured: "Không tìm thấy vị trí công ty"
- Distance > 10m: "Khoảng cách {distance}m vượt quá 10m, vui lòng di chuyển closer"

**Validation Rules**:
- GPS coordinates must be valid (latitude: -90 to 90, longitude: -180 to 180)
- GPS accuracy must be within acceptable threshold (e.g., ±5m)
- Company GPS must be configured in system
- Distance calculation uses Haversine formula

**Open Questions**:
- What is the GPS accuracy threshold?
- Is GPS accuracy validation required?
- How to handle GPS accuracy issues?
- Can manual override bypass GPS validation?

---

### VAL-M01-09: GPS Permission Validation (NEW)

| Field | Value |
|-------|-------|
| Validation ID | VAL-M01-09 |
| Rule Name | GPS Permission Validation |
| Status | SPECIFIED |
| Priority | HIGH |

**Description**: Validate that GPS/location permission is granted.

**Validation Logic**:
```
IF location_permission == GRANTED THEN
    Enable GPS tracking
ELSE
    Prompt for permission
END IF
```

**Error Message**: "Vui lòng cấp quyền truy cập vị trí"

**Open Questions**:
- What if user denies GPS permission?
- Is there manual location entry fallback?
- How to handle permission revocation?

---

### VAL-M01-10: Attendance Success Validation (NEW)

| Field | Value |
|-------|-------|
| Validation ID | VAL-M01-10 |
| Rule Name | Attendance Success Validation |
| Status | SPECIFIED |
| Priority | CRITICAL |

**Description**: Validate that both QR and GPS conditions are met for successful attendance.

**Validation Logic**:
```
qr_valid = validate_qr_code(scanned_qr)
gps_valid = validate_gps_location(employee_gps, company_gps)

IF qr_valid == TRUE AND gps_valid == TRUE THEN
    Attendance SUCCESS
    Record attendance
ELSE
    Attendance FAILED
    IF qr_valid == FALSE THEN
        Return QR error
    END IF
    IF gps_valid == FALSE THEN
        Return GPS error
    END IF
END IF
```

**Error Messages**:
- QR invalid: "Mã QR không hợp lệ"
- GPS out of range: "Khoảng cách vượt quá 10m"
- Both fail: "Mã QR không hợp lệ và khoảng cách vượt quá 10m"

**Open Questions**:
- Can attendance be recorded if GPS fails but QR is valid?
- Is there a manual override option?
- How to handle partial failures?

---

## Validation Summary

| Validation | Status | Priority | Open Questions |
|------------|--------|----------|----------------|
| VAL-M01-01: QR Code Format | INFERRED | HIGH | Format specification |
| VAL-M01-02: QR Code Existence | NOT SPECIFIED | HIGH | Storage structure |
| VAL-M01-03: QR Code Expiration | NOT SPECIFIED | HIGH | Duration, configuration |
| VAL-M01-04: Employee-QR Association | NOT SPECIFIED | HIGH | Shared vs specific |
| VAL-M01-05: Duplicate Attendance | INFERRED | HIGH | Interval, override |
| VAL-M01-06: Time Window | NOT SPECIFIED | MEDIUM | Allowed hours |
| VAL-M01-07: Camera Permission | NOT SPECIFIED | HIGH | Fallback options |
| VAL-M01-08: GPS Location | SPECIFIED | CRITICAL | Accuracy threshold |
| VAL-M01-09: GPS Permission | SPECIFIED | HIGH | Fallback options |
| VAL-M01-10: Attendance Success | SPECIFIED | CRITICAL | Manual override |

## Validation Completeness

**Specified**: 4/10 (40%)
**Inferred**: 2/10 (20%)
**Not Specified**: 4/10 (40%)

## New Validations Summary

| Validation | Status | Key Requirement |
|------------|--------|-----------------|
| VAL-M01-08: GPS Location | SPECIFIED | Distance ≤ 10 meters |
| VAL-M01-09: GPS Permission | SPECIFIED | Location permission required |
| VAL-M01-10: Attendance Success | SPECIFIED | QR valid AND GPS valid |

## Recommendation

New GPS validations have been added. Key decisions needed:
1. GPS accuracy threshold and validation
2. Manual override options for GPS failures
3. Handling of GPS unavailability
4. Integration with QR validation logic
