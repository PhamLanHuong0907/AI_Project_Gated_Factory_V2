# MOD-06: GPS Location Verification - Reports

## Report Types

### RPT-M06-01: GPS Verification Report

| Field | Value |
|-------|-------|
| Report ID | RPT-M06-01 |
| Report Name | GPS Verification Report |
| Status | NOT SPECIFIED |
| Priority | MEDIUM |

**Description**: Report of GPS verification attempts.

**Columns**:
- Employee ID
- Scan Time
- Employee GPS
- Company GPS
- Distance
- Result (Pass/Fail)

---

### RPT-M06-02: GPS Error Report

| Field | Value |
|-------|-------|
| Report ID | RPT-M06-02 |
| Report Name | GPS Error Report |
| Status | NOT SPECIFIED |
| Priority | MEDIUM |

**Description**: Report of GPS errors and failures.

**Columns**:
- Employee ID
- Scan Time
- Error Type
- Error Message
- Action Taken

---

## Open Questions

| ID | Question |
|----|----------|
| OQ-M06-R01 | Are GPS reports required? |
| OQ-M06-R02 | What metrics are needed? |
| OQ-M06-R03 | Can reports be exported? |
