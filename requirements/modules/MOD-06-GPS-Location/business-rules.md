# MOD-06: GPS Location Verification - Business Rules

## Business Rules

### BR-M06-01: GPS Location Capture

| Field | Value |
|-------|-------|
| Rule ID | BR-M06-01 |
| Rule Name | GPS Location Capture |
| Status | SPECIFIED |
| Priority | HIGH |

**Description**: Capture employee GPS location when scanning QR code.

**Logic**:
```
gps_location = get_current_location()
IF gps_location IS NULL OR gps_location IS INVALID THEN
    Reject with error "Vui lòng bật GPS"
END IF
RETURN gps_location
```

**Validation**:
- GPS coordinates are valid (latitude: -90 to 90, longitude: -180 to 180)
- GPS accuracy is within acceptable threshold
- GPS timestamp is recent

---

### BR-M06-02: Distance Calculation

| Field | Value |
|-------|-------|
| Rule ID | BR-M06-02 |
| Rule Name | Distance Calculation |
| Status | SPECIFIED |
| Priority | CRITICAL |

**Description**: Calculate distance between employee GPS and company GPS using Haversine formula.

**Logic**:
```
function haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371000  // Earth's radius in meters
    
    φ1 = lat1 × π / 180
    φ2 = lat2 × π / 180
    Δφ = (lat2 - lat1) × π / 180
    Δλ = (lon2 - lon1) × π / 180
    
    a = sin²(Δφ/2) + cos(φ1) × cos(φ2) × sin²(Δλ/2)
    c = 2 × atan2(√a, √(1-a))
    
    d = R × c
    RETURN d  // distance in meters
```

**Validation**:
- Inputs are valid GPS coordinates
- Calculation uses correct Earth radius
- Result is in meters

---

### BR-M06-03: Distance Validation

| Field | Value |
|-------|-------|
| Rule ID | BR-M06-03 |
| Rule Name | Distance Validation |
| Status | SPECIFIED |
| Priority | CRITICAL |

**Description**: Validate that employee distance is ≤ 10 meters from company.

**Logic**:
```
distance = haversine_distance(employee_gps, company_gps)

IF distance <= 10 THEN
    GPS_VALIDATION = PASSED
ELSE
    GPS_VALIDATION = FAILED
    reject_attendance("Khoảng cách {distance}m > 10m")
END IF
```

**Threshold**: 10 meters (configurable)

**Validation**:
- Distance calculation is accurate
- Threshold is applied correctly
- Result is logged

---

### BR-M06-04: Company Location Management

| Field | Value |
|-------|-------|
| Rule ID | BR-M06-04 |
| Rule Name | Company Location Management |
| Status | SPECIFIED |
| Priority | HIGH |

**Description**: Store and manage company GPS coordinates.

**Logic**:
```
company_location = {
    latitude: configured_lat,
    longitude: configured_lon,
    name: company_name,
    address: company_address
}
```

**Validation**:
- Company GPS coordinates are configured
- Coordinates are valid
- Location name is provided

**Open Questions**:
- Can multiple company locations be configured?
- Who can configure company location?
- Is location change logged?

---

### BR-M06-05: GPS Error Handling

| Field | Value |
|-------|-------|
| Rule ID | BR-M06-05 |
| Rule Name | GPS Error Handling |
| Status | SPECIFIED |
| Priority | HIGH |

**Description**: Handle GPS-related errors gracefully.

**Logic**:
```
SWITCH gps_error:
    CASE "UNAVAILABLE":
        Display "Vui lòng bật GPS"
        Prompt to enable GPS
    CASE "INACCURATE":
        Display "GPS chính xác thấp"
        Warn user
    CASE "TIMEOUT":
        Display "GPS không phản hồi"
        Retry or fail
    CASE "PERMISSION_DENIED":
        Display "Vui lòng cấp quyền vị trí"
        Prompt for permission
END SWITCH
```

---

## Summary

| Rule | Status | Key Requirement |
|------|--------|-----------------|
| BR-M06-01: GPS Capture | SPECIFIED | Get valid GPS coordinates |
| BR-M06-02: Distance Calculation | SPECIFIED | Haversine formula |
| BR-M06-03: Distance Validation | SPECIFIED | ≤ 10 meters |
| BR-M06-04: Company Location | SPECIFIED | Store company GPS |
| BR-M06-05: Error Handling | SPECIFIED | Graceful error handling |

## Recommendation

GPS verification rules are specified. Key decisions needed:
1. GPS accuracy threshold configuration
2. Multi-location support
3. Manual override options
4. GPS caching strategy
