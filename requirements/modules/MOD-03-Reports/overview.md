# MOD-03: Reports - Overview

## Module Identity

| Field | Value |
|-------|-------|
| Module ID | MOD-03 |
| Module Name | Reports |
| Requirement Reference | REQ-03 |
| Status | IMPROVED |

## Purpose

Generate monthly attendance reports and calculate employee salary based on attendance data and salary configuration.

## Actors

| Actor | Role | Access Level |
|-------|------|--------------|
| Administrator (ACT-02) | Report generator, Salary config | Full access |
| HR Manager (ACT-03) | Report viewer | View access |
| Employee (ACT-01) | View own salary | View own data only |

## Features

| Feature ID | Feature Name | Status |
|------------|--------------|--------|
| F-03-01 | Monthly Attendance Report | SPECIFIED |
| F-03-02 | Salary Calculation | SPECIFIED |
| F-03-03 | Salary Configuration | SPECIFIED |
| F-03-04 | Default Penalty Rules | SPECIFIED |
| F-03-05 | Report Export | NOT SPECIFIED |
| F-03-06 | Report Filtering | NOT SPECIFIED |

## Salary Configuration (from stakeholder)

### Salary Components

| Component | Description | Configurable |
|-----------|-------------|--------------|
| Danh mục lương (Salary Category) | Base salary categories | Yes |
| Lương (Base Salary) | Fixed salary amount | Yes |
| Công thức tính lương (Salary Formula) | Calculation formula | Yes |

### Default Penalty Rules

| Penalty Type | Condition | Deduction |
|--------------|-----------|-----------|
| Đi làm trễ (Late arrival) | Clock-in after shift start | Configurable per minute |
| Nghỉ phép (Leave) | Approved/unapproved leave | Configurable per day |

### Salary Formula

```
Total Salary = Base Salary + Overtime Pay - Penalties

Penalties = Late Penalty + Leave Penalty + Other Deductions

Late Penalty = (Late Minutes × Rate per Minute)
Leave Penalty = (Leave Days × Rate per Day)
```

## Business Requirements (from source)

1. Generate monthly attendance report showing:
   - List of employees
   - Days worked in month
   - Attendance status

2. Calculate salary based on attendance:
   - Base salary from configuration
   - Deductions for late arrival
   - Deductions for leave

3. Salary configuration:
   - Admin can configure salary categories
   - Admin can set base salary amounts
   - Admin can configure penalty rules
   - Default penalty rules are pre-configured

## Open Questions

| ID | Question | Status |
|----|----------|--------|
| OQ-M03-01 | What report formats are supported? | OPEN |
| OQ-M03-02 | What salary components are calculated? | ANSWERED |
| OQ-M03-03 | Is salary calculation automatic? | ANSWERED (Yes) |
| OQ-M03-04 | What filters are available? | OPEN |
| OQ-M03-05 | Can employees view own salary? | ANSWERED (Yes) |
| OQ-M03-06 | What is historical data retention? | OPEN |
| OQ-M03-07 | Are there different pay grades? | ANSWERED (Yes, categories) |
| OQ-M03-08 | How are absences deducted? | ANSWERED (Configurable) |

## Source Traceability

| Source Section | Requirement |
|----------------|-------------|
| Yêu cầu dự án | "Đầu ra là báo cáo danh sách nhân viên đi làm trong tháng và tính lương" |
| Bổ sung | "Cho thêm mục tạo cấu hình lương gồm danh mục lương, lương, công thức tính lương; sau đó dựa vào đó để in ra danh sách lương. Mặc định có sẵn mục lương bị phạt khi đi làm trễ/ nghỉ phép" |
