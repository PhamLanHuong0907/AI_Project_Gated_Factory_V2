# MOD-01: QR Attendance - Acceptance Criteria

## Acceptance Criteria

### AC-M01-01: QR Code Scanning

| Field | Value |
|-------|-------|
| Criteria ID | AC-M01-01 |
| Feature | QR Code Scanning |
| Status | NOT SPECIFIED |
| Priority | HIGH |

**Given**: Employee is authenticated and on attendance screen
**When**: Employee scans valid QR code
**Then**: 
- System captures scan within 3 seconds
- System validates QR code
- System records attendance with timestamp
- System displays success confirmation

**Open Questions**:
- What is acceptable scan-to-confirmation time?
- Is there haptic/visual feedback?
- What happens on slow network?

---

### AC-M01-02: Clock IN Recording

| Field | Value |
|-------|-------|
| Criteria ID | AC-M01-02 |
| Feature | Clock IN Recording |
| Status | INFERRED |
| Priority | HIGH |

**Given**: Employee has not clocked IN today
**When**: Employee scans QR code
**Then**:
- System records clock IN time
- System displays "Đã chấm công IN thành công"
- System shows recorded time

**Acceptance Criteria**:
- [ ] Clock IN time is recorded accurately (within 1 second)
- [ ] Success message is displayed in Vietnamese
- [ ] Recorded time matches scan time

**Open Questions**:
- What if employee clocks in multiple times?
- Is there a grace period for late arrivals?

---

### AC-M01-03: Clock OUT Recording

| Field | Value |
|-------|-------|
| Criteria ID | AC-M01-03 |
| Feature | Clock OUT Recording |
| Status | INFERRED |
| Priority | HIGH |

**Given**: Employee has clocked IN today
**When**: Employee scans QR code
**Then**:
- System records clock OUT time
- System displays "Đã chấm công OUT thành công"
- System shows recorded time and duration

**Acceptance Criteria**:
- [ ] Clock OUT time is recorded accurately
- [ ] Duration is calculated correctly
- [ ] Success message is displayed in Vietnamese

**Open Questions**:
- What if employee forgets to clock OUT?
- Is there automatic clock OUT at end of day?

---

### AC-M01-04: Duplicate Prevention

| Field | Value |
|-------|-------|
| Criteria ID | AC-M01-04 |
| Feature | Duplicate Prevention |
| Status | INFERRED |
| Priority | HIGH |

**Given**: Employee has already clocked IN (or OUT)
**When**: Employee attempts to scan again within minimum interval
**Then**:
- System detects duplicate
- System displays warning message
- System shows last attendance record
- System does NOT record duplicate

**Acceptance Criteria**:
- [ ] Duplicate is detected within 1 second
- [ ] Warning message is clear
- [ ] Last record is displayed
- [ ] No duplicate record is created

**Open Questions**:
- What is minimum interval between scans?
- Can admin override duplicate prevention?

---

### AC-M01-05: Invalid QR Code Handling

| Field | Value |
|-------|-------|
| Criteria ID | AC-M01-05 |
| Feature | Invalid QR Code Handling |
| Status | NOT SPECIFIED |
| Priority | HIGH |

**Given**: Employee scans QR code
**When**: QR code is invalid (not in system, wrong format)
**Then**:
- System rejects scan
- System displays error message
- System logs failed attempt
- System does NOT record attendance

**Acceptance Criteria**:
- [ ] Invalid QR is rejected immediately
- [ ] Error message is user-friendly
- [ ] Failed attempt is logged
- [ ] No attendance record is created

**Open Questions**:
- What is "invalid"? (format, existence, status)
- Is there a maximum failed attempts?

---

### AC-M01-06: Expired QR Code Handling

| Field | Value |
|-------|-------|
| Criteria ID | AC-M01-06 |
| Feature | Expired QR Code Handling |
| Status | NOT SPECIFIED |
| Priority | HIGH |

**Given**: Employee scans QR code
**When**: QR code has expired
**Then**:
- System rejects scan
- System displays "Mã QR đã hết hạn"
- System prompts for new QR code
- System logs expired attempt

**Acceptance Criteria**:
- [ ] Expired QR is detected
- [ ] Error message mentions expiration
- [ ] User is prompted to get new QR
- [ ] Attempt is logged

**Open Questions**:
- How long is QR code valid?
- Can user regenerate QR code?

---

### AC-M01-07: Network Error Handling

| Field | Value |
|-------|-------|
| Criteria ID | AC-M01-07 |
| Feature | Network Error Handling |
| Status | NOT SPECIFIED |
| Priority | MEDIUM |

**Given**: Employee scans QR code
**When**: Network error occurs
**Then**:
- System displays error message
- System offers retry option
- System queues scan for later sync (if offline supported)

**Acceptance Criteria**:
- [ ] Network error is detected
- [ ] Error message is clear
- [ ] Retry option is available
- [ ] Scan is queued if offline supported

**Open Questions**:
- Is offline attendance supported?
- How long to queue failed scans?
- Is there sync mechanism?

---

### AC-M01-08: Mobile Responsiveness

| Field | Value |
|-------|-------|
| Criteria ID | AC-M01-08 |
| Feature | Mobile Responsiveness |
| Status | SPECIFIED (from source) |
| Priority | HIGH |

**Given**: Employee accesses system via mobile device
**When**: Employee navigates to attendance screen
**Then**:
- UI adapts to screen size
- QR scanner is accessible
- All buttons are touch-friendly
- Text is readable without zoom

**Acceptance Criteria**:
- [ ] Works on iOS Safari
- [ ] Works on Android Chrome
- [ ] Minimum screen width: 320px
- [ ] Touch targets minimum 44px
- [ ] No horizontal scrolling required

**Open Questions**:
- What is minimum supported screen size?
- What browsers are supported?
- Is native app required?

---

### AC-M01-09: GPS Location Verification (NEW)

| Field | Value |
|-------|-------|
| Criteria ID | AC-M01-09 |
| Feature | GPS Location Verification |
| Status | SPECIFIED |
| Priority | CRITICAL |

**Given**: Employee scans QR code
**When**: System receives GPS coordinates
**Then**:
- System calculates distance to company location
- System validates distance ≤ 10 meters
- System records GPS coordinates with attendance
- System displays distance to user

**Acceptance Criteria**:
- [ ] GPS coordinates are obtained successfully
- [ ] Distance is calculated accurately (±1 meter)
- [ ] Attendance is rejected if distance > 10m
- [ ] Attendance is accepted if distance ≤ 10m
- [ ] Distance is displayed to user
- [ ] GPS coordinates are stored with attendance record

**Open Questions**:
- What is acceptable GPS accuracy?
- How to handle GPS accuracy issues?
- Can manual override bypass GPS validation?

---

### AC-M01-10: GPS Out of Range Handling (NEW)

| Field | Value |
|-------|-------|
| Criteria ID | AC-M01-10 |
| Feature | GPS Out of Range Handling |
| Status | SPECIFIED |
| Priority | HIGH |

**Given**: Employee scans QR code
**When**: GPS distance > 10 meters from company
**Then**:
- System rejects attendance
- System displays distance and error message
- System suggests moving closer
- System logs failed attempt

**Acceptance Criteria**:
- [ ] Distance > 10m is detected
- [ ] Error message shows actual distance
- [ ] User is prompted to move closer
- [ ] Failed attempt is logged
- [ ] No attendance record is created

**Open Questions**:
- What is maximum allowed distance for warning?
- Is there a retry mechanism?
- Can user override GPS validation?

---

### AC-M01-11: GPS Unavailable Handling (NEW)

| Field | Value |
|-------|-------|
| Criteria ID | AC-M01-11 |
| Feature | GPS Unavailable Handling |
| Status | SPECIFIED |
| Priority | HIGH |

**Given**: Employee scans QR code
**When**: GPS is unavailable or disabled
**Then**:
- System detects GPS unavailability
- System displays error message
- System prompts to enable GPS
- System does NOT record attendance

**Acceptance Criteria**:
- [ ] GPS unavailability is detected
- [ ] Error message is clear
- [ ] User is prompted to enable GPS
- [ ] No attendance record is created
- [ ] User can retry after enabling GPS

**Open Questions**:
- Is there manual location entry fallback?
- Can attendance be recorded without GPS?
- How to handle GPS permission denial?

---

### AC-M01-12: Attendance Success Condition (NEW)

| Field | Value |
|-------|-------|
| Criteria ID | AC-M01-12 |
| Feature | Attendance Success Condition |
| Status | SPECIFIED |
| Priority | CRITICAL |

**Given**: Employee scans QR code
**When**: System validates both QR and GPS
**Then**:
- System validates QR code is valid
- System validates GPS distance ≤ 10m
- System records attendance ONLY if both pass
- System displays success with details

**Acceptance Criteria**:
- [ ] Attendance recorded only when QR valid AND GPS valid
- [ ] Attendance rejected if either fails
- [ ] Success message shows QR status and GPS distance
- [ ] Both QR and GPS validation happen atomically
- [ ] No partial attendance records

**Open Questions**:
- Can attendance be recorded if GPS fails but QR is valid?
- Is there a manual override option?
- How to handle partial failures?

---

## Acceptance Criteria Summary

| Criteria | Status | Priority | Gaps |
|----------|--------|----------|------|
| AC-M01-01: QR Code Scanning | NOT SPECIFIED | HIGH | Performance requirements |
| AC-M01-02: Clock IN Recording | INFERRED | HIGH | Edge cases |
| AC-M01-03: Clock OUT Recording | INFERRED | HIGH | Edge cases |
| AC-M01-04: Duplicate Prevention | INFERRED | HIGH | Interval, override |
| AC-M01-05: Invalid QR Handling | NOT SPECIFIED | HIGH | Definition of invalid |
| AC-M01-06: Expired QR Handling | NOT SPECIFIED | HIGH | Validity period |
| AC-M01-07: Network Error Handling | NOT SPECIFIED | MEDIUM | Offline support |
| AC-M01-08: Mobile Responsiveness | SPECIFIED | HIGH | Browser support |
| AC-M01-09: GPS Location Verification | SPECIFIED | CRITICAL | Accuracy threshold |
| AC-M01-10: GPS Out of Range | SPECIFIED | HIGH | Retry mechanism |
| AC-M01-11: GPS Unavailable | SPECIFIED | HIGH | Fallback options |
| AC-M01-12: Attendance Success | SPECIFIED | CRITICAL | Manual override |

## New Acceptance Criteria Summary

| Criteria | Status | Key Requirement |
|----------|--------|-----------------|
| AC-M01-09: GPS Verification | SPECIFIED | Distance ≤ 10 meters |
| AC-M01-10: GPS Out of Range | SPECIFIED | Reject if > 10m |
| AC-M01-11: GPS Unavailable | SPECIFIED | Prompt to enable GPS |
| AC-M01-12: Success Condition | SPECIFIED | QR valid AND GPS valid |

## Testing Requirements

| Test Type | Status | Notes |
|-----------|--------|-------|
| Unit Tests | NOT SPECIFIED | Need to define |
| Integration Tests | NOT SPECIFIED | Need to define |
| UI Tests | NOT SPECIFIED | Need to define |
| Performance Tests | NOT SPECIFIED | Need to define |
| Security Tests | NOT SPECIFIED | Need to define |
| GPS Tests | NOT SPECIFIED | Need to define (NEW) |

## Definition of Done

For MOD-01 to be considered complete:
1. All acceptance criteria must be defined
2. All open questions must be answered
3. Test cases must be written
4. Test coverage must meet threshold
5. Performance benchmarks must be met
6. Security review must be completed
7. GPS validation tests must pass (NEW)
