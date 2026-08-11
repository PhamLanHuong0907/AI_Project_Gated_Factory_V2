# MOD-01: QR Attendance - Business Rules

## Business Rules

### BR-M01-01: QR Code Validity & Dynamic Refresh

| Field | Value |
|-------|-------|
| Rule ID | BR-M01-01 |
| Rule Name | QR Code Validity & Dynamic Refresh |
| Status | SPECIFIED |
| Priority | CRITICAL |
| Source | AC-M01-05, AC-M01-06 |

**Description**: QR codes are Dynamic (Mã động), auto-refresh every 15-30 seconds to prevent fraud (photo sharing).

**Logic**:
```
qr_code = generate_dynamic_qr(employee_id)
refresh_interval = 15-30 seconds (configurable)

LOOP:
    display_qr(qr_code)
    WAIT(refresh_interval)
    qr_code = regenerate_qr(employee_id)
END LOOP
```

**Rules**:
1. QR is Dynamic, auto-refreshes every 15-30 seconds
2. System displays QR on iPad/company computer
3. Employee cannot manually refresh (system-controlled)
4. QR encodes: employee_id, timestamp, tenant_id, signature

**Validation**:
- QR code exists in system
- QR code matches tenant_id
- QR code signature is valid

**Exception Handling**:
- Invalid QR (can't decode): "Mã QR không hợp lệ"
- Wrong tenant: "Mã QR không thuộc hệ thống"
- Expired QR: "Mã QR đã hết hạn, vui lòng quét lại"

---

### BR-M01-02: Duplicate Prevention & Grace Period

| Field | Value |
|-------|-------|
| Rule ID | BR-M01-02 |
| Rule Name | Duplicate Prevention & Grace Period |
| Status | SPECIFIED |
| Priority | HIGH |
| Source | AC-M01-02, AC-M01-04 |

**Description**: Prevent duplicate attendance with configurable minimum interval and grace period.

**Logic**:
```
// Minimum interval between scans (anti-spam)
minimum_interval = 1-3 minutes (configurable)

// Grace period for late arrival
grace_period = 5-15 minutes (configurable in Admin panel)

IF last_attendance_type == requested_type THEN
    IF time_since_last < minimum_interval THEN
        REJECT "Bạn đã chấm công [IN/OUT] lúc [time]"
    ELSE
        ALLOW (minimum interval passed)
    END IF
ELSE
    ALLOW (different type: IN→OUT or OUT→IN)
END IF
```

**Rules**:
1. Minimum interval: 1-3 minutes (configurable)
2. Grace period: 5-15 minutes (configurable in Admin)
3. Only first IN per day is recorded
4. Subsequent IN scans show: "Bạn đã chấm công IN lúc [time]"

**Exception Handling**:
- Duplicate detected: Show last attendance time
- Admin can override via Web Portal (not App)

---

### BR-M01-03: Attendance Type Detection & Auto-OUT

| Field | Value |
|-------|-------|
| Rule ID | BR-M01-03 |
| Rule Name | Attendance Type Detection & Auto-OUT |
| Status | SPECIFIED |
| Priority | HIGH |
| Source | AC-M01-02, AC-M01-03 |

**Description**: Auto-detect IN/OUT type. Handle forgot OUT with auto-OUT at 23:59.

**Logic**:
```
// Auto-detect type
IF last_attendance is NULL OR last_type == OUT THEN
    type = IN
ELSE
    type = OUT
END IF

// Only first IN per day
IF type == IN AND already_has_IN_today THEN
    REJECT "Bạn đã chấm công IN lúc [time]"
END IF

// Auto-OUT at 23:59 (configurable)
IF current_time == 23:59 AND has_IN_today AND NO OUT_today THEN
    auto_record_OUT(timestamp=23:59, flag="Tự động chốt hệ thống")
END IF
```

**Rules**:
1. Type auto-detected (not user-selected)
2. Only first IN per day is recorded
3. Auto-OUT at 23:59 if employee forgot to clock OUT
4. Auto-OUT flagged as "Tự động chốt hệ thống" for HR review

**Exception Handling**:
- Forgot OUT: Auto-OUT at 23:59 with flag
- HR reviews flagged records

---

### BR-M01-04: QR Code Display (Dynamic)

| Field | Value |
|-------|-------|
| Rule ID | BR-M01-04 |
| Rule Name | QR Code Display |
| Status | SPECIFIED |
| Priority | HIGH |
| Source | AC-M01-05, AC-M01-06 |

**Description**: QR codes displayed on company devices, auto-refresh, not employee-controlled.

**Logic**:
- Displayed on iPad/company computer at workplace
- Auto-refresh every 15-30 seconds
- Employee cannot manually refresh
- Anti-fraud: prevents photo sharing

**Rules**:
1. QR displayed on company device (iPad/computer)
2. Auto-refresh interval: 15-30 seconds
3. Employee cannot control refresh
4. Prevents "chấm hộ" (proxy attendance)

---

### BR-M01-05: GPS Location Verification

| Field | Value |
|-------|-------|
| Rule ID | BR-M01-05 |
| Rule Name | GPS Location Verification |
| Status | SPECIFIED |
| Priority | CRITICAL |
| Source | AC-M01-09, AC-M01-10 |

**Description**: Verify employee GPS within threshold of company location. Consider WiFi fallback for indoor GPS issues.

**Logic**:
```
employee_gps = get_employee_gps()
company_gps = get_company_gps()
distance = haversine(employee_gps, company_gps)

// GPS threshold (configurable, recommended 20-50m for indoor)
gps_threshold = config.gps_threshold (default: 50m)

// WiFi fallback option
wifi_connected = check_company_wifi()

IF distance <= gps_threshold THEN
    GPS_VALID = TRUE
ELSE IF wifi_connected == TRUE THEN
    GPS_VALID = TRUE (WiFi fallback)
ELSE
    GPS_VALID = FALSE
    SHOW "Bạn đang ở cách công ty [distance]m. Vui lòng di chuyển vào khu vực chấm công"
END IF
```

**Rules**:
1. GPS threshold: 20-50 meters (configurable, default 50m for indoor)
2. WiFi fallback: If connected to company WiFi, GPS check optional
3. Unlimited retry attempts (GPS may improve)
4. Show exact distance when out of range
5. No manual location input allowed

**Validation**:
- GPS coordinates valid (not null, not zero)
- Company GPS configured in system

**Exception Handling**:
- GPS unavailable: Hard block, show instructions to enable in Settings
- Distance > threshold: Show distance, ask to move closer
- WiFi fallback available: Allow if on company WiFi

---

### BR-M01-06: Attendance Success Condition

| Field | Value |
|-------|-------|
| Rule ID | BR-M01-06 |
| Rule Name | Attendance Success Condition |
| Status | SPECIFIED |
| Priority | CRITICAL |
| Source | AC-M01-11, AC-M01-12 |

**Description**: Attendance successful ONLY when QR valid AND GPS valid. No manual override at App level.

**Logic**:
```
qr_valid = validate_qr(scanned_qr)
gps_valid = verify_gps(employee_gps, company_gps)

IF qr_valid == TRUE AND gps_valid == TRUE THEN
    record_attendance(employee_id, timestamp, type)
    PLAY sound("bíp")
    VIBRATE(1 pulse)
    SHOW green_checkmark()
    RETURN SUCCESS
ELSE
    IF qr_valid == FALSE THEN
        RETURN ERROR_INVALID_QR
    END IF
    IF gps_valid == FALSE THEN
        RETURN ERROR_GPS_OUT_OF_RANGE
    END IF
END IF
```

**Rules**:
1. AND condition: Both QR and GPS must pass
2. If QR correct but GPS wrong: REJECT
3. No manual override at App level
4. Employee must use "Yêu cầu cập nhật công" workflow if device fails

**Response Requirements**:
- Success: Haptic feedback (1 pulse) + sound "bíp" + green checkmark
- Response time: < 1s normal, max 3s, timeout 10s

**Exception Handling**:
- QR invalid: Show error, ask for new scan
- GPS out of range: Show distance, ask to move closer
- Device failure: Employee submits "Yêu cầu cập nhật công" for approval

---

### BR-M01-07: Response Time & UX Feedback (NEW)

| Field | Value |
|-------|-------|
| Rule ID | BR-M01-07 |
| Rule Name | Response Time & UX Feedback |
| Status | SPECIFIED |
| Priority | HIGH |
| Source | AC-M01-01 |

**Description**: Scan response time and feedback requirements.

**Logic**:
```
START_TIMER()
result = process_scan(qr_data, gps_data)
response_time = STOP_TIMER()

IF response_time < 1s THEN
    // Normal - good
ELSE IF response_time < 3s THEN
    // Acceptable
ELSE IF response_time < 10s THEN
    SHOW loading_spinner("Đang xử lý...")
ELSE
    SHOW error("Kết nối không ổn định, vui lòng thử lại")
END IF
```

**Rules**:
1. Normal response: < 1 second
2. Acceptable: < 3 seconds
3. Loading spinner: Max 10 seconds
4. Timeout: Show error "Kết nối không ổn định"

**Feedback on Success**:
- Haptic feedback: 1 pulse (vibrate nhẹ)
- Sound: "bíp" ngắn
- Visual: Green checkmark on screen

---

### BR-M01-08: Security & Brute Force Protection (NEW)

| Field | Value |
|-------|-------|
| Rule ID | BR-M01-08 |
| Rule Name | Security & Brute Force Protection |
| Status | SPECIFIED |
| Priority | HIGH |
| Source | AC-M01-05, AC-M01-06 |

**Description**: Lock account after failed scan attempts to prevent brute force/spam.

**Logic**:
```
failed_attempts = 0
MAX_ATTEMPTS = 5
LOCK_DURATION = 1-5 minutes

WHEN scan_failed:
    failed_attempts++
    IF failed_attempts >= MAX_ATTEMPTS THEN
        LOCK_ACCOUNT(employee_id, duration=LOCK_DURATION)
        SHOW "Tài khoản đã bị khóa do nhập sai quá nhiều lần"
    END IF
WHEN scan_success:
    failed_attempts = 0
END WHEN
```

**Rules**:
1. Max failed attempts: 5
2. Lock duration: 1-5 minutes (configurable)
3. Counter resets on successful scan
4. Prevents spam/brute force attacks

---

### BR-M01-09: Offline & Network Requirement (NEW)

| Field | Value |
|-------|-------|
| Rule ID | BR-M01-09 |
| Rule Name | Offline & Network Requirement |
| Status | SPECIFIED |
| Priority | HIGH |
| Source | AC-M01-07 |

**Description**: No offline support for GPS-based attendance. Must have network for server time.

**Logic**:
```
IF network_available == FALSE THEN
    REJECT "Không có kết nối mạng. Vui lòng thử lại."
    // No offline caching for GPS system
END IF

// Get server time (not device time)
server_time = get_server_time()
```

**Rules**:
1. No offline support (GPS anti-fraud requirement)
2. Must have network to get server time
3. Device time is not trusted (prevents time manipulation)
4. If no network: Show error, block attendance

**Exception Handling**:
- No network: "Kết nối không ổn định, vui lòng thử lại"
- Server time sync required for all attendance records

---

### BR-M01-10: Device Compatibility (NEW)

| Field | Value |
|-------|-------|
| Rule ID | BR-M01-10 |
| Rule Name | Device Compatibility |
| Status | SPECIFIED |
| Priority | MEDIUM |
| Source | AC-M01-08 |

**Description**: Minimum device requirements and browser support.

**Rules**:
1. Minimum width: 320px (iPhone SE compatible)
2. Browsers: Last 2 versions of Chrome, Safari, Edge, Firefox
3. PWA sufficient (no native app required)
4. Camera and GPS access required

---

## Summary

| Rule | Status | Source | Key Requirement |
|------|--------|--------|-----------------|
| BR-M01-01: QR Validity | SPECIFIED | AC-M01-05/06 | Dynamic QR, refresh 15-30s |
| BR-M01-02: Duplicate Prevention | SPECIFIED | AC-M01-02/04 | Min interval 1-3min, grace period |
| BR-M01-03: Type Detection | SPECIFIED | AC-M01-02/03 | Auto-detect, only first IN |
| BR-M01-04: QR Display | SPECIFIED | AC-M01-05/06 | Company device, auto-refresh |
| BR-M01-05: GPS Verification | SPECIFIED | AC-M01-09/10 | Threshold 20-50m, WiFi fallback |
| BR-M01-06: Success Condition | SPECIFIED | AC-M01-11/12 | QR AND GPS must pass |
| BR-M01-07: Response Time | SPECIFIED | AC-M01-01 | <1s normal, haptic+sound |
| BR-M01-08: Security | SPECIFIED | AC-M01-05/06 | 5 attempts then lock |
| BR-M01-09: Network | SPECIFIED | AC-M01-07 | No offline, server time |
| BR-M01-10: Device | SPECIFIED | AC-M01-08 | 320px min, PWA OK |

## Recommendations

All critical business rules are now specified. Key implementation notes:
1. Dynamic QR with 15-30s refresh on company devices
2. GPS threshold should be configurable (20-50m recommended for indoor)
3. WiFi fallback option for indoor GPS issues
4. Haptic + sound + visual feedback on success
5. No offline support for GPS anti-fraud
6. Server time only (not device time)
