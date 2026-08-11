# MOD-06: GPS Location Verification - Validations

## Validation Rules

### VAL-M06-01: GPS Coordinate Validation

| Field | Value |
|-------|-------|
| Validation ID | VAL-M06-01 |
| Rule Name | GPS Coordinate Validation |
| Status | SPECIFIED |
| Priority | HIGH |

**Description**: Validate GPS coordinates are valid.

**Validation Logic**:
```
IF latitude >= -90 AND latitude <= 90 AND
   longitude >= -180 AND longitude <= 180 THEN
    Coordinates VALID
ELSE
    Coordinates INVALID
END IF
```

---

### VAL-M06-02: GPS Accuracy Validation

| Field | Value |
|-------|-------|
| Validation ID | VAL-M06-02 |
| Rule Name | GPS Accuracy Validation |
| Status | NOT SPECIFIED |
| Priority | HIGH |

**Description**: Validate GPS accuracy is within acceptable threshold.

**Validation Logic**:
```
IF gps_accuracy <= accuracy_threshold THEN
    Accuracy ACCEPTABLE
ELSE
    Accuracy NOT ACCEPTABLE
    Warn user
END IF
```

**Open Questions**:
- What is accuracy threshold? (e.g., ±5m, ±10m)
- Is accuracy validation required?

---

### VAL-M06-03: Distance Calculation Validation

| Field | Value |
|-------|-------|
| Validation ID | VAL-M06-03 |
| Rule Name | Distance Calculation Validation |
| Status | SPECIFIED |
| Priority | CRITICAL |

**Description**: Validate distance calculation is correct.

**Validation Logic**:
```
calculated_distance = haversine_distance(employee_gps, company_gps)
expected_distance = calculate_manually()

IF abs(calculated_distance - expected_distance) < 0.01 THEN
    Calculation VALID
ELSE
    Calculation INVALID
END IF
```

---

### VAL-M06-04: Distance Threshold Validation

| Field | Value |
|-------|-------|
| Validation ID | VAL-M06-04 |
| Rule Name | Distance Threshold Validation |
| Status | SPECIFIED |
| Priority | CRITICAL |

**Description**: Validate distance is ≤ 10 meters.

**Validation Logic**:
```
IF distance <= 10 THEN
    GPS_VALIDATION = PASSED
ELSE
    GPS_VALIDATION = FAILED
END IF
```

**Threshold**: 10 meters

---

### VAL-M06-05: Company GPS Validation

| Field | Value |
|-------|-------|
| Validation ID | VAL-M06-05 |
| Rule Name | Company GPS Validation |
| Status | SPECIFIED |
| Priority | HIGH |

**Description**: Validate company GPS coordinates are configured.

**Validation Logic**:
```
company_gps = get_company_gps()
IF company_gps IS NOT NULL AND company_gps IS VALID THEN
    Company GPS CONFIGURED
ELSE
    Company GPS NOT CONFIGURED
    Reject attendance
END IF
```

---

## Validation Summary

| Validation | Status | Priority |
|------------|--------|----------|
| VAL-M06-01: GPS Coordinate | SPECIFIED | HIGH |
| VAL-M06-02: GPS Accuracy | NOT SPECIFIED | HIGH |
| VAL-M06-03: Distance Calculation | SPECIFIED | CRITICAL |
| VAL-M06-04: Distance Threshold | SPECIFIED | CRITICAL |
| VAL-M06-05: Company GPS | SPECIFIED | HIGH |
