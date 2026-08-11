# MOD-05: QR Code Generation - Reports

## Report Types

### RPT-M05-01: QR Code Generation Report

| Field | Value |
|-------|-------|
| Report ID | RPT-M05-01 |
| Report Name | QR Code Generation Report |
| Status | NOT SPECIFIED |
| Priority | MEDIUM |

**Description**: Report of generated QR codes.

**Columns**:
- QR Code ID
- Generated Time
- Expiration Time
- Associated Employee/Shift
- Status (Active/Expired/Invalidated)

---

### RPT-M05-02: QR Code Usage Report

| Field | Value |
|-------|-------|
| Report ID | RPT-M05-02 |
| Report Name | QR Code Usage Report |
| Status | NOT SPECIFIED |
| Priority | MEDIUM |

**Description**: Report of QR code usage (scans).

**Columns**:
- QR Code ID
- Scan Time
- Employee ID
- GPS Distance
- Attendance Status

---

## Open Questions

| ID | Question |
|----|----------|
| OQ-M05-R01 | Are QR code reports required? |
| OQ-M05-R02 | What metrics are needed? |
| OQ-M05-R03 | Can reports be exported? |
