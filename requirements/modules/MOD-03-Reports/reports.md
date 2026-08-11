# MOD-03: Reports - Reports

## Report Types

### RPT-M03-01: Monthly Attendance Report

| Field | Value |
|-------|-------|
| Report ID | RPT-M03-01 |
| Report Name | Monthly Attendance Report |
| Status | SPECIFIED |
| Priority | HIGH |

**Description**: Monthly report of all employee attendance.

**Source**: "báo cáo danh sách nhân viên đi làm trong tháng"

**Columns**:
| Column | Description | Status |
|--------|-------------|--------|
| Employee ID | Employee identifier | INFERRED |
| Employee Name | Employee name | INFERRED |
| Department | Department | NOT SPECIFIED |
| Total Working Days | Days present | INFERRED |
| Total Working Hours | Hours worked | INFERRED |
| Late Days | Days with late arrival | NOT SPECIFIED |
| Absent Days | Days absent | NOT SPECIFIED |

### RPT-M03-02: Salary Report

| Field | Value |
|-------|-------|
| Report ID | RPT-M03-02 |
| Report Name | Salary Report |
| Status | SPECIFIED |
| Priority | HIGH |

**Description**: Salary calculation based on attendance.

**Source**: "tính lương"

**Columns**: NOT SPECIFIED

**Open Questions**:
- What salary components are included?
- What is the calculation formula?
- Is there approval workflow?

## Open Questions

| ID | Question |
|----|----------|
| OQ-M03-R01 | What export formats are supported? |
| OQ-M03-R02 | Can reports be scheduled? |
| OQ-M03-R03 | Is there report caching? |
| OQ-M03-R04 | Can reports be emailed? |
