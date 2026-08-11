# MOD-01: QR Attendance - Reports

## Report Types

### RPT-M01-01: Individual Attendance Report

| Field | Value |
|-------|-------|
| Report ID | RPT-M01-01 |
| Report Name | Individual Attendance Report |
| Status | NOT SPECIFIED |
| Priority | MEDIUM |

**Description**: Report showing individual employee attendance records.

**Scope**:
- Single employee
- Date range (daily, weekly, monthly)
- Clock IN/OUT times
- Duration calculations

**Columns**:
| Column | Description | Status |
|--------|-------------|--------|
| Date | Attendance date | INFERRED |
| Clock IN Time | Time of IN scan | INFERRED |
| Clock OUT Time | Time of OUT scan | INFERRED |
| Duration | Total working hours | INFERRED |
| Status | On time, Late, Early | NOT SPECIFIED |
| Location | Attendance location | NOT SPECIFIED |

**Filters**:
- Employee ID/Name
- Date range
- Status (All, Present, Absent, Late)

**Open Questions**:
- Can employees view this report?
- What export formats are supported?
- How is duration calculated (hours, minutes)?

---

### RPT-M01-02: Daily Attendance Summary

| Field | Value |
|-------|-------|
| Report ID | RPT-M01-02 |
| Report Name | Daily Attendance Summary |
| Status | NOT SPECIFIED |
| Priority | MEDIUM |

**Description**: Summary of all employee attendance for a specific day.

**Scope**:
- All employees or filtered by department
- Single day
- Attendance status summary

**Columns**:
| Column | Description | Status |
|--------|-------------|--------|
| Employee ID | Employee identifier | INFERRED |
| Employee Name | Employee name | INFERRED |
| Department | Department | NOT SPECIFIED |
| Clock IN Time | IN time | INFERRED |
| Clock OUT Time | OUT time | INFERRED |
| Duration | Working hours | INFERRED |
| Status | Present, Absent, Late | NOT SPECIFIED |

**Filters**:
- Date
- Department
- Status

**Open Questions**:
- Who can access this report?
- Is there drill-down to individual records?
- How are absences detected?

---

### RPT-M01-03: Monthly Attendance Report

| Field | Value |
|-------|-------|
| Report ID | RPT-M01-03 |
| Report Name | Monthly Attendance Report |
| Status | SPECIFIED (from source) |
| Priority | HIGH |

**Description**: Monthly report of all employee attendance (from source requirement).

**Source**: "báo cáo danh sách nhân viên đi làm trong tháng"

**Scope**:
- All employees
- Full month
- Summary statistics

**Columns**:
| Column | Description | Status |
|--------|-------------|--------|
| Employee ID | Employee identifier | INFERRED |
| Employee Name | Employee name | INFERRED |
| Department | Department | NOT SPECIFIED |
| Total Working Days | Days present | INFERRED |
| Total Working Hours | Hours worked | INFERRED |
| Late Days | Days with late arrival | NOT SPECIFIED |
| Early Departure Days | Days with early departure | NOT SPECIFIED |
| Absent Days | Days absent | NOT SPECIFIED |
| Overtime Hours | Extra hours worked | NOT SPECIFIED |

**Filters**:
- Month/Year
- Department
- Employee

**Export Formats**: NOT SPECIFIED

**Open Questions**:
- What export formats are supported? (PDF, Excel, CSV)
- Can report be filtered by team/department?
- How are holidays/weekends handled?
- Is there drill-down capability?

---

### RPT-M01-04: Attendance Statistics Report

| Field | Value |
|-------|-------|
| Report ID | RPT-M01-04 |
| Report Name | Attendance Statistics Report |
| Status | NOT SPECIFIED |
| Priority | MEDIUM |

**Description**: Statistical analysis of attendance patterns.

**Scope**:
- Aggregated statistics
- Trend analysis
- Comparison periods

**Statistics**:
| Metric | Description | Status |
|--------|-------------|--------|
| Average Attendance Rate | % of days present | NOT SPECIFIED |
| Average Working Hours | Mean hours per day | NOT SPECIFIED |
| Late Arrival Rate | % of days late | NOT SPECIFIED |
| Overtime Rate | % of employees with OT | NOT SPECIFIED |

**Open Questions**:
- What statistical metrics are required?
- Is trend analysis required?
- Can reports be compared across periods?

---

## Report Generation Rules

| Rule | Description | Status |
|------|-------------|--------|
| Auto-generation | Reports generated automatically | NOT SPECIFIED |
| Manual generation | User requests report | NOT SPECIFIED |
| Scheduled generation | Reports run on schedule | NOT SPECIFIED |
| Caching | Report caching strategy | NOT SPECIFIED |

## Report Access Control

| Report | Employee | Administrator | Status |
|--------|----------|---------------|--------|
| Individual | Own only | All | NOT SPECIFIED |
| Daily Summary | ❌ | ✅ | NOT SPECIFIED |
| Monthly Report | ❌ | ✅ | NOT SPECIFIED |
| Statistics | ❌ | ✅ | NOT SPECIFIED |

## Open Questions

| ID | Question | Impact |
|----|----------|--------|
| OQ-R01-01 | What export formats are supported? | Feature |
| OQ-R01-02 | Can reports be scheduled? | Feature |
| OQ-R01-03 | Is there report caching? | Performance |
| OQ-R01-04 | Can reports be emailed? | Feature |
| OQ-R01-05 | What is data retention policy? | Compliance |

## Recommendation

Reports need specification:
1. Define all required reports
2. Define report columns and calculations
3. Define filters and drill-down
4. Define export formats
5. Define access control
