# MOD-03: Reports - Business Rules

## Business Rules

### BR-M03-01: Monthly Report Generation

| Field | Value |
|-------|-------|
| Rule ID | BR-M03-01 |
| Rule Name | Monthly Report Generation |
| Status | SPECIFIED |
| Priority | HIGH |

**Description**: Generate monthly attendance report for all employees.

**Logic**:
```
FOR each employee IN employees
    attendance = get_attendance(employee.id, month, year)
    total_days = count_days(attendance)
    total_hours = calculate_hours(attendance)
    report.add_row(employee, total_days, total_hours)
END FOR
```

---

### BR-M03-02: Salary Calculation

| Field | Value |
|-------|-------|
| Rule ID | BR-M03-02 |
| Rule Name | Salary Calculation |
| Status | SPECIFIED |
| Priority | HIGH |
| Source | OQ-028 ANSWERED |

**Description**: Calculate salary based on attendance data and salary configuration.

**Logic**:
```
salary_config = get_salary_config(employee.category)
base_salary = salary_config.base_salary
formula = salary_config.formula

attendance = get_attendance(employee.id, month, year)
late_minutes = calculate_late_minutes(attendance)
leave_days = calculate_leave_days(attendance)

late_penalty = calculate_late_penalty(late_minutes, salary_config)
leave_penalty = calculate_leave_penalty(leave_days, salary_config)

total_salary = base_salary - late_penalty - leave_penalty
```

**Salary Formula**:
```
Total Salary = Base Salary - Late Penalty - Leave Penalty - Other Deductions

Where:
- Base Salary = From salary configuration
- Late Penalty = Late Minutes × Rate per Minute (from config)
- Leave Penalty = Leave Days × Rate per Day (from config)
- Other Deductions = Configurable
```

---

### BR-M03-03: Salary Configuration

| Field | Value |
|-------|-------|
| Rule ID | BR-M03-03 |
| Rule Name | Salary Configuration |
| Status | SPECIFIED |
| Priority | HIGH |
| Source | OQ-028 ANSWERED |

**Description**: Admin can configure salary categories, base amounts, and formulas.

**Logic**:
```
WHEN admin configures salary:
    salary_category = create_or_update_category()
    base_salary = set_base_amount()
    formula = set_calculation_formula()
    penalties = configure_penalty_rules()
    store_in_database(salary_config)
END WHEN
```

**Configuration Components**:
| Component | Description | Configurable |
|-----------|-------------|--------------|
| Danh mục lương | Salary categories (e.g., NV, QL, etc.) | Yes |
| Lương cơ bản | Base salary amount per category | Yes |
| Công thức tính | Calculation formula | Yes |
| Quy tắc phạt | Penalty rules for late/leave | Yes |

---

### BR-M03-04: Default Penalty Rules

| Field | Value |
|-------|-------|
| Rule ID | BR-M03-04 |
| Rule Name | Default Penalty Rules |
| Status | SPECIFIED |
| Priority | HIGH |
| Source | OQ-028 ANSWERED |

**Description**: System has default penalty rules for late arrival and leave.

**Logic**:
```
DEFAULT penalty_rules:
    late_arrival:
        rate_per_minute = configurable (default: 0)
        max_deduction = configurable (default: base_salary * 0.3)
    leave:
        rate_per_day = configurable (default: 0)
        max_deduction = configurable (default: base_salary * 0.5)
END DEFAULT
```

**Default Penalty Rules**:
| Penalty Type | Default Rate | Max Deduction | Configurable |
|--------------|--------------|---------------|--------------|
| Đi làm trễ | 0 per minute | 30% of base salary | Yes |
| Nghỉ phép không phép | 0 per day | 50% of base salary | Yes |
| Nghỉ phép có phép | 0 per day | 0 | Yes |

---

### BR-M03-05: Report Filtering

| Field | Value |
|-------|-------|
| Rule ID | BR-M03-05 |
| Rule Name | Report Filtering |
| Status | NOT SPECIFIED |
| Priority | MEDIUM |

**Description**: Allow filtering of reports by various criteria.

**Open Questions**:
- What filters are available?
- Can reports be filtered by department?
- Can reports be filtered by date range?

---

## Open Questions

| ID | Question | Status |
|----|----------|--------|
| OQ-M03-BR01 | What salary components are included? | ANSWERED |
| OQ-M03-BR02 | Is there a standard pay grade system? | ANSWERED (Categories) |
| OQ-M03-BR03 | How are holidays/weekends handled? | OPEN |
| OQ-M03-BR04 | Is overtime tracked separately? | OPEN |
