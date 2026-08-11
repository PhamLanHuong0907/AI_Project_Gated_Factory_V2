# MOD-06: GPS Location Verification - Acceptance Criteria

## Acceptance Criteria

### AC-M06-01: GPS Location Capture

| Field | Value |
|-------|-------|
| Criteria ID | AC-M06-01 |
| Feature | GPS Location Capture |
| Status | SPECIFIED |
| Priority | HIGH |

**Given**: Employee scans QR code
**When**: System requests GPS location
**Then**:
- System obtains GPS coordinates
- Coordinates are valid
- Coordinates are sent to server

**Acceptance Criteria**:
- [ ] GPS coordinates are obtained
- [ ] Coordinates are valid (lat: -90 to 90, lon: -180 to 180)
- [ ] Coordinates are sent within 3 seconds
- [ ] GPS permission is handled

---

### AC-M06-02: Distance Calculation

| Field | Value |
|-------|-------|
| Criteria ID | AC-M06-02 |
| Feature | Distance Calculation |
| Status | SPECIFIED |
| Priority | CRITICAL |

**Given**: Employee GPS and company GPS are available
**When**: System calculates distance
**Then**:
- Distance is calculated using Haversine formula
- Distance is accurate (±1 meter)
- Distance is returned in meters

**Acceptance Criteria**:
- [ ] Haversine formula is implemented correctly
- [ ] Distance is accurate (±1 meter)
- [ ] Calculation completes within 1 second
- [ ] Distance is in meters

---

### AC-M06-03: Distance Validation (≤10m)

| Field | Value |
|-------|-------|
| Criteria ID | AC-M06-03 |
| Feature | Distance Validation |
| Status | SPECIFIED |
| Priority | CRITICAL |

**Given**: Distance is calculated
**When**: System validates distance
**Then**:
- If distance ≤ 10m: GPS validation PASSED
- If distance > 10m: GPS validation FAILED
- Result is returned to caller

**Acceptance Criteria**:
- [ ] Distance ≤ 10m: PASSED
- [ ] Distance > 10m: FAILED
- [ ] Threshold is configurable
- [ ] Result is logged

---

### AC-M06-04: GPS Unavailable Handling

| Field | Value |
|-------|-------|
| Criteria ID | AC-M06-04 |
| Feature | GPS Unavailable Handling |
| Status | SPECIFIED |
| Priority | HIGH |

**Given**: GPS is unavailable
**When**: System cannot get location
**Then**:
- System detects GPS unavailability
- System displays error message
- System prompts to enable GPS
- Attendance is NOT recorded

**Acceptance Criteria**:
- [ ] GPS unavailability is detected
- [ ] Error message is clear
- [ ] User is prompted to enable GPS
- [ ] Attendance is not recorded

---

### AC-M06-05: Company GPS Configuration

| Field | Value |
|-------|-------|
| Criteria ID | AC-M06-05 |
| Feature | Company GPS Configuration |
| Status | SPECIFIED |
| Priority | HIGH |

**Given**: Admin configures company location
**When**: Admin saves GPS coordinates
**Then**:
- GPS coordinates are stored
- Coordinates are validated
- Location is named

**Acceptance Criteria**:
- [ ] GPS coordinates can be configured
- [ ] Coordinates are validated
- [ ] Location name is required
- [ ] Changes are logged

---

### AC-M06-06: Attendance Success Condition

| Field | Value |
|-------|-------|
| Criteria ID | AC-M06-06 |
| Feature | Attendance Success Condition |
| Status | SPECIFIED |
| Priority | CRITICAL |

**Given**: Employee scans QR code
**When**: System validates both QR and GPS
**Then**:
- Attendance recorded ONLY if QR valid AND GPS valid
- Both validations happen atomically
- No partial attendance records

**Acceptance Criteria**:
- [ ] Attendance recorded only when both pass
- [ ] Attendance rejected if either fails
- [ ] Validations are atomic
- [ ] No partial records

---

## Acceptance Criteria Summary

| Criteria | Status | Priority |
|----------|--------|----------|
| AC-M06-01: GPS Location Capture | SPECIFIED | HIGH |
| AC-M06-02: Distance Calculation | SPECIFIED | CRITICAL |
| AC-M06-03: Distance Validation | SPECIFIED | CRITICAL |
| AC-M06-04: GPS Unavailable | SPECIFIED | HIGH |
| AC-M06-05: Company GPS Config | SPECIFIED | HIGH |
| AC-M06-06: Success Condition | SPECIFIED | CRITICAL |
