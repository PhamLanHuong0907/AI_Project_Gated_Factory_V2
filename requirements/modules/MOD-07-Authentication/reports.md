# MOD-07: Authentication - Reports

## Report Types

### RPT-M07-01: Login History Report

| Field | Value |
|-------|-------|
| Report ID | RPT-M07-01 |
| Report Name | Login History Report |
| Status | NOT SPECIFIED |
| Priority | MEDIUM |

**Description**: Report of user login attempts.

**Columns**:
- User ID
- Username
- Login Time
- IP Address
- Device Info
- Result (Success/Failure)

---

### RPT-M07-02: Active Sessions Report

| Field | Value |
|-------|-------|
| Report ID | RPT-M07-02 |
| Report Name | Active Sessions Report |
| Status | NOT SPECIFIED |
| Priority | LOW |

**Description**: Report of currently active sessions.

**Columns**:
- Session ID
- User ID
- Login Time
- Last Activity
- IP Address

---

## Open Questions

| ID | Question |
|----|----------|
| OQ-M07-R01 | Are login reports required? |
| OQ-M07-R02 | What metrics are needed? |
| OQ-M07-R03 | Can reports be exported? |
