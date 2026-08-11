# MOD-03: Reports - Acceptance Criteria

## Acceptance Criteria

### AC-M03-01: Monthly Report Generation

| Field | Value |
|-------|-------|
| Criteria ID | AC-M03-01 |
| Feature | Monthly Report Generation |
| Status | SPECIFIED |
| Priority | HIGH |

**Given**: Administrator requests monthly report
**When**: Report is generated
**Then**:
- Report contains all employees
- Report shows attendance summary
- Report is accurate

**Acceptance Criteria**:
- [ ] Report includes all active employees
- [ ] Attendance data is accurate
- [ ] Report generates within 30 seconds
- [ ] Report is in correct format

### AC-M03-02: Salary Calculation

| Field | Value |
|-------|-------|
| Criteria ID | AC-M03-02 |
| Feature | Salary Calculation |
| Status | SPECIFIED |
| Priority | HIGH |

**Given**: Attendance data exists
**When**: Salary is calculated
**Then**:
- Salary is calculated correctly
- Components are itemized
- Total is accurate

**Acceptance Criteria**:
- [ ] Salary calculation is accurate
- [ ] All components are included
- [ ] Calculation matches expected formula
- [ ] Results are auditable

### AC-M03-03: Report Export

| Field | Value |
|-------|-------|
| Criteria ID | AC-M03-03 |
| Feature | Report Export |
| Status | NOT SPECIFIED |
| Priority | MEDIUM |

**Given**: Report is generated
**When**: User exports report
**Then**:
- File is generated
- File is downloadable
- File format is correct

**Acceptance Criteria**:
- [ ] Export works for all formats
- [ ] File is not corrupted
- [ ] File size is reasonable
- [ ] Download completes successfully

## Open Questions

| ID | Question |
|----|----------|
| OQ-M03-AC01 | What export formats are supported? |
| OQ-M03-AC02 | What is maximum report size? |
| OQ-M03-AC03 | Is there async generation for large reports? |
