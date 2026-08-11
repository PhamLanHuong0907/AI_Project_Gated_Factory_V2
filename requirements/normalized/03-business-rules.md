# REQ-03: Business Rules

## Business Rule Inventory

| Rule ID | Rule Name | Source | Status |
|---------|-----------|--------|--------|
| BR-01 | QR Code Validity | Implicit | INFERRED |
| BR-02 | Attendance Window | "cấu hình ca làm việc" | SPECIFIED |
| BR-03 | Duplicate Prevention | Implicit | INFERRED |
| BR-04 | Late/Early Detection | "phạt khi đi làm trễ" | SPECIFIED |
| BR-05 | Holiday/Weekend Handling | Not in source | NOT SPECIFIED |
| BR-06 | Overtime Calculation | Not in source | NOT SPECIFIED |
| BR-07 | Salary Calculation Rules | "công thức tính lương" | SPECIFIED |
| BR-08 | GPS Location Verification | "khoảng cách GPS <= 10 mét" | SPECIFIED |
| BR-09 | QR Code Generation | "ấn tạo mã QR" | SPECIFIED |
| BR-10 | Attendance Success Condition | "quét thành công VÀ khoảng cách GPS <= 10m" | SPECIFIED |
| BR-11 | User Authentication | "đăng nhập tài khoản cá nhân" | SPECIFIED |
| BR-12 | Salary Configuration | "cấu hình lương" | SPECIFIED |
| BR-13 | Shift Configuration | "cấu hình ca làm việc" | SPECIFIED |
| BR-14 | QR Code Reminder | "nhắc nhở nếu gần đến giờ làm việc" | SPECIFIED |

## Business Rules Detail

### BR-01: QR Code Validity

- **Description**: QR codes used for attendance must be valid and time-limited
- **Status**: INFERRED - Not explicitly stated in source
- **Logic**:
  - QR code expires after configured duration
  - QR code is unique per session/location
  - Invalid/expired QR code rejected
- **Validation**:
  - QR code exists in system
  - QR code not expired
  - QR code not already used (if single-use)
- **Exception Handling**:
  - Expired QR: Display error, request new QR
  - Invalid QR: Log attempt, notify admin
- **Open Questions**:
  - How long is QR code valid?
  - Is QR code single-use or reusable?
  - Who generates QR codes?

### BR-02: Attendance Window (UPDATED)

- **Description**: Valid times for clocking in/out based on shift configuration
- **Source**: "có cấu hình ca làm việc"
- **Status**: SPECIFIED
- **Logic**:
  ```
  shift = get_shift_config(employee_id)
  current_time = get_current_time()
  
  IF current_time >= shift.start_time AND current_time <= shift.end_time THEN
      Attendance ALLOWED
  ELSE
      Attendance ALLOWED but marked as outside shift
  END IF
  ```
- **Validation**:
  - Shift configuration exists
  - Current time is within shift window (or outside with flag)
- **Exception Handling**:
  - No shift configured: Use default working hours
  - Outside shift: Allow but mark as overtime/undertime

### BR-03: Duplicate Prevention

- **Description**: Prevent duplicate attendance records
- **Status**: INFERRED - Logical requirement
- **Logic**:
  - Employee cannot clock IN twice without clocking OUT
  - Employee cannot clock OUT twice without clocking IN
  - Minimum time gap between consecutive scans
- **Validation**:
  - Check last attendance status
  - Enforce minimum interval (e.g., 5 minutes)
- **Exception Handling**:
  - Duplicate attempt: Display warning, show last record
- **Open Questions**:
  - What is minimum interval between scans?
  - How to handle system errors during scan?

### BR-04: Late/Early Detection (UPDATED)

- **Description**: Identify late arrivals and early departures for penalty calculation
- **Source**: "phạt khi đi làm trễ/nghỉ phép"
- **Status**: SPECIFIED
- **Logic**:
  ```
  shift = get_shift_config(employee_id)
  attendance_time = get_attendance_time()
  
  IF attendance_time > shift.start_time THEN
      late_minutes = attendance_time - shift.start_time
      apply_penalty(late_minutes)
  END IF
  ```
- **Validation**:
  - Shift start time is configured
  - Attendance time is recorded
  - Late minutes are calculated correctly
- **Exception Handling**:
  - Grace period: Allow X minutes without penalty
  - Multiple late occurrences: Escalating penalties

### BR-05: Holiday/Weekend Handling

- **Description**: System behavior on non-working days
- **Status**: NOT SPECIFIED
- **Logic**: TBD
- **Validation**: TBD
- **Exception Handling**: TBD
- **Open Questions**:
  - Does the system track holidays?
  - Can employees work on weekends?
  - How to handle holiday overtime?

### BR-06: Overtime Calculation

- **Description**: Rules for calculating overtime hours
- **Status**: NOT SPECIFIED
- **Logic**: TBD
- **Validation**: TBD
- **Exception Handling**: TBD
- **Open Questions**:
  - Is overtime tracked automatically?
  - What is overtime rate (1.5x, 2x, etc.)?
  - Is overtime approval required?

### BR-07: Salary Calculation Rules (UPDATED)

- **Description**: Rules for calculating salary based on attendance and configuration
- **Source**: "công thức tính lương"
- **Status**: SPECIFIED
- **Logic**:
  ```
  salary_config = get_salary_config(employee_id)
  attendance_data = get_attendance(employee_id, month)
  
  base_salary = salary_config.base_salary
  deductions = calculate_deductions(attendance_data, salary_config)
  bonuses = calculate_bonuses(attendance_data, salary_config)
  
  total_salary = base_salary - deductions + bonuses
  ```
- **Components**:
  - Base salary (lương cơ bản)
  - Late penalty (phạt đi trễ)
  - Leave penalty (phạt nghỉ phép)
  - Overtime bonus (thưởng overtime)
  - Other deductions/bonuses
- **Validation**:
  - Salary configuration exists
  - Attendance data is complete
  - Calculation formula is correct
- **Exception Handling**:
  - Missing configuration: Use default values
  - Calculation error: Log and notify admin

### BR-08: GPS Location Verification

- **Description**: Verify employee location is within 10 meters of company location
- **Source**: "khoảng cách GPS <= 10 mét"
- **Status**: SPECIFIED
- **Priority**: HIGH
- **Logic**:
  ```
  employee_gps = get_employee_location()
  company_gps = get_company_location()
  distance = calculate_distance(employee_gps, company_gps)
  
  IF distance <= 10 meters THEN
      GPS validation PASSED
  ELSE
      GPS validation FAILED
      Reject attendance
  END IF
  ```

### BR-09: QR Code Generation (UPDATED)

- **Description**: User presses button to generate QR code with configured validity
- **Source**: "ấn tạo mã QR để gen mã, thời gian hiệu lực dựa theo cấu hình"
- **Status**: SPECIFIED
- **Priority**: HIGH
- **Logic**:
  ```
  user_clicks_generate_button()
  qr_code = generate_unique_code()
  validity_period = get_validity_config()
  expiration_time = current_time + validity_period
  store_qr_code(qr_code, expiration_time)
  display_qr_code(qr_code)
  ```
- **Validation**:
  - User has permission to generate
  - Validity period is configured
  - QR code is unique
- **Exception Handling**:
  - Generation failure: Show error, allow retry
  - Already has active QR: Show warning

### BR-10: Attendance Success Condition

- **Description**: Attendance is successful ONLY when both QR scan AND GPS verification pass
- **Source**: "quét thành công VÀ khoảng cách GPS <= 10 mét"
- **Status**: SPECIFIED
- **Priority**: CRITICAL

### BR-11: User Authentication (NEW)

- **Description**: Users login with personal account, then use personal device to scan QR
- **Source**: "đăng nhập tài khoản cá nhân rồi dùng thiết bị cá nhân quét mã để nhận diện"
- **Status**: SPECIFIED
- **Priority**: CRITICAL
- **Logic**:
  ```
  user = login(username, password)
  IF login_success THEN
      session = create_session(user)
      device = register_device(user, device_info)
      // User can now scan QR codes
  END IF
  ```
- **Validation**:
  - Username/password are valid
  - Account is active
  - Device is registered (optional)
- **Exception Handling**:
  - Invalid credentials: Show error
  - Account locked: Show message
  - Device not recognized: Optional verification

### BR-12: Salary Configuration (NEW)

- **Description**: Configure salary components, categories, and calculation formulas
- **Source**: "cấu hình lương gồm danh mục lương, lương, công thức tính lương"
- **Status**: SPECIFIED
- **Priority**: HIGH
- **Logic**:
  ```
  salary_config = {
      categories: [list of salary categories],
      base_salary: amount,
      deduction_rules: [late_penalty, leave_penalty],
      bonus_rules: [overtime_bonus, performance_bonus],
      calculation_formula: formula_expression
  }
  ```
- **Components**:
  - Danh mục lương (Salary categories)
  - Lương cơ bản (Base salary)
  - Công thức tính lương (Calculation formula)
  - Quy tắc phạt (Penalty rules)
  - Quy tắc thưởng (Bonus rules)
- **Default Rules**:
  - Phạt đi trễ (Late penalty)
  - Phạt nghỉ phép (Leave penalty)

### BR-13: Shift Configuration (NEW)

- **Description**: Configure working shifts for employees
- **Source**: "có cấu hình ca làm việc"
- **Status**: SPECIFIED
- **Priority**: HIGH
- **Logic**:
  ```
  shift_config = {
      shift_name: string,
      start_time: time,
      end_time: time,
      grace_period: minutes,  // optional
      work_days: [list of days]
  }
  ```
- **Validation**:
  - Shift times are valid
  - Work days are specified
  - Grace period is reasonable

### BR-14: QR Code Reminder (NEW)

- **Description**: Remind user to generate QR code if approaching work time
- **Source**: "nhắc nhở nếu gần đến giờ làm việc mà vẫn chưa ấn tạo mã QR"
- **Status**: SPECIFIED
- **Priority**: MEDIUM
- **Logic**:
  ```
  shift = get_shift_config(user_id)
  time_to_start = shift.start_time - current_time
  
  IF time_to_start <= reminder_threshold AND no_active_qr THEN
      send_reminder("Vui lòng tạo mã QR để chấm công")
  END IF
  ```
- **Validation**:
  - Shift configuration exists
  - Reminder threshold is configured
  - User has not generated QR yet
- **Exception Handling**:
  - No shift: No reminder
  - User ignores: No action (reminder only)

## Summary of Business Rule Updates

| Rule | Status | Key Update |
|------|--------|------------|
| BR-02: Attendance Window | SPECIFIED | Shift configuration |
| BR-04: Late/Early Detection | SPECIFIED | Penalty rules |
| BR-07: Salary Calculation | SPECIFIED | Formula and components |
| BR-09: QR Generation | UPDATED | Button to generate, config-based validity |
| BR-11: Authentication | NEW | Login + QR scan |
| BR-12: Salary Configuration | NEW | Categories, formula, penalties |
| BR-13: Shift Configuration | NEW | Working shifts |
| BR-14: QR Reminder | NEW | Reminder before shift |

## Remaining Gaps

| Category | Gaps |
|----------|------|
| Holiday/Weekend | Not specified |
| Overtime | Not specified |
| Multi-location | Not specified |

## Recommendation

Most business rules are now specified. Remaining gaps:
1. Holiday/weekend handling
2. Overtime calculation rules
3. Multi-location support (if needed)
