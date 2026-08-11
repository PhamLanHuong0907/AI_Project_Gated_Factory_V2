# REQ-04: Requirement Inventory

## Requirement Summary

| Req ID | Title | Priority | Status | Source |
|--------|-------|----------|--------|--------|
| REQ-01 | QR Code Attendance (IN/OUT) | HIGH | SPECIFIED | Yêu cầu dự án |
| REQ-02 | Mobile Responsive | HIGH | SPECIFIED | Yêu cầu dự án |
| REQ-03 | Monthly Attendance Report & Salary Calculation | HIGH | SPECIFIED | Yêu cầu dự án |
| REQ-04 | Dashboard | MEDIUM | SPECIFIED | Yêu cầu dự án |
| REQ-05 | QR Code Generation | HIGH | SPECIFIED | Bổ sung |
| REQ-06 | GPS Location Verification | HIGH | SPECIFIED | Bổ sung |
| REQ-07 | User Authentication | HIGH | SPECIFIED | Stakeholder |
| REQ-08 | Salary Configuration | HIGH | SPECIFIED | Stakeholder |
| REQ-09 | Shift Configuration | HIGH | SPECIFIED | Stakeholder |

## Detailed Requirements

### REQ-01: QR Code Attendance (IN/OUT)

**Description**: Employees can clock in/out by scanning QR codes

**Source Text**: "Chấm công bằng mã QR (IN/OUT)"

**Acceptance Criteria**:
- [ ] Employee can scan QR code via mobile device
- [ ] System records attendance timestamp
- [ ] System distinguishes between IN and OUT
- [ ] Duplicate scans are prevented
- [ ] Invalid/expired QR codes are rejected
- [ ] GPS verification required (≤10m)

**Dependencies**:
- Authentication system (REQ-07)
- Camera access on mobile device
- GPS service

**Related Modules**: MOD-01 (QR Attendance), MOD-02 (Mobile Responsive)

---

### REQ-02: Mobile Responsive

**Description**: System must be responsive on mobile devices

**Source Text**: "Responsive trên mobile chấm công"

**Acceptance Criteria**:
- [ ] Attendance screen works on mobile browsers
- [ ] QR scanning works on mobile devices
- [ ] UI adapts to different screen sizes
- [ ] Touch interactions are supported

**Dependencies**: None

**Related Modules**: MOD-02 (Mobile Responsive)

---

### REQ-03: Monthly Attendance Report & Salary Calculation

**Description**: Generate reports of employee attendance and calculate salary

**Source Text**: "Đầu ra là báo cáo danh sách nhân viên đi làm trong tháng và tính lương"

**Acceptance Criteria**:
- [ ] Generate monthly attendance report
- [ ] List all employees with attendance data
- [ ] Calculate total working days/hours
- [ ] Calculate salary based on attendance
- [ ] Apply penalties for late/leave
- [ ] Export report (format TBD)

**Dependencies**:
- Attendance data from REQ-01
- Salary configuration (REQ-08)

**Related Modules**: MOD-03 (Reports)

---

### REQ-04: Dashboard

**Description**: Dashboard for viewing attendance statistics

**Source Text**: "Dashboard"

**Acceptance Criteria**:
- [ ] Display attendance statistics
- [ ] Show real-time or near-real-time data
- [ ] Provide visual charts/graphs
- [ ] Allow date range selection

**Dependencies**:
- Attendance data from REQ-01
- User permissions

**Related Modules**: MOD-04 (Dashboard)

---

### REQ-05: QR Code Generation

**Description**: User presses button to generate QR code with configured validity

**Source Text**: "ấn tạo mã QR để gen mã, thời gian hiệu lực dựa theo cấu hình"

**Acceptance Criteria**:
- [ ] User can press button to generate QR code
- [ ] QR code validity is based on configuration
- [ ] QR codes are unique
- [ ] QR codes can be displayed on screen
- [ ] System reminds if approaching work time without QR

**Dependencies**:
- Shift configuration (REQ-09)

**Related Modules**: MOD-05 (QR Code Generation)

---

### REQ-06: GPS Location Verification

**Description**: Verify employee location is within 10 meters of company location

**Source Text**: "Kiểm tra khoảng cách giữa vị trí GPS của nhân viên và GPS công ty. Khoảng cách GPS <= 10 mét"

**Acceptance Criteria**:
- [ ] System can get employee GPS location
- [ ] System can get company GPS location
- [ ] System calculates distance between locations
- [ ] Attendance is rejected if distance > 10 meters
- [ ] Attendance is accepted if distance <= 10 meters

**Dependencies**:
- GPS service on mobile device
- Company location configuration

**Related Modules**: MOD-06 (GPS Location Verification)

---

### REQ-07: User Authentication (NEW)

**Description**: Users login with personal account, then use personal device to scan QR

**Source Text**: "Đăng nhập tài khoản cá nhân rồi dùng thiết bị cá nhân quét mã để nhận diện"

**Acceptance Criteria**:
- [ ] User can login with username/password
- [ ] Session is created after login
- [ ] User can scan QR after login
- [ ] Invalid credentials are rejected
- [ ] Account lockout after failed attempts

**Dependencies**:
- User management system

**Related Modules**: MOD-07 (Authentication)

---

### REQ-08: Salary Configuration (NEW)

**Description**: Configure salary components, categories, and calculation formulas

**Source Text**: "Cấu hình lương gồm danh mục lương, lương, công thức tính lương; mặc định có sẵn mục lương bị phạt khi đi làm trễ/nghỉ phép"

**Acceptance Criteria**:
- [ ] Admin can configure salary categories
- [ ] Admin can set base salary
- [ ] Admin can define calculation formula
- [ ] Default penalty rules exist (late, leave)
- [ ] Salary list can be printed based on configuration

**Dependencies**:
- Attendance data from REQ-01

**Related Modules**: MOD-03 (Reports), MOD-08 (Salary Config)

---

### REQ-09: Shift Configuration (NEW)

**Description**: Configure working shifts for employees

**Source Text**: "Có cấu hình ca làm việc"

**Acceptance Criteria**:
- [ ] Admin can create shift configurations
- [ ] Shift includes start time, end time
- [ ] Shift includes work days
- [ ] Grace period can be configured
- [ ] Employee can be assigned to shift

**Dependencies**:
- User management system

**Related Modules**: MOD-09 (Shift Config)

---

## Missing Requirements (Still Not in Source)

| ID | Inferred Requirement | Rationale | Status |
|----|---------------------|-----------|--------|
| REQ-M01 | User Management | Need to manage employees | NOT IN SOURCE |
| REQ-M02 | Attendance History | Employees may want to view history | NOT IN SOURCE |
| REQ-M03 | Data Export | Reports likely need export | NOT IN SOURCE |
| REQ-M04 | Notification System | Late/absence notifications? | NOT IN SOURCE |
| REQ-M05 | API for Integration | May need to integrate with HR system | NOT IN SOURCE |
| REQ-M06 | Company Location Management | Store company GPS coordinates | NOT IN SOURCE |

## Requirement Completeness Assessment

| Aspect | Status | Notes |
|--------|--------|-------|
| Functional Requirements | 75% | 9 requirements specified |
| Non-Functional Requirements | 10% | Performance not mentioned |
| Data Requirements | 30% | GPS, QR, salary, shift mentioned |
| Integration Requirements | 0% | External system integration not mentioned |
| UI/UX Requirements | 20% | Responsive, dashboard mentioned |
| Security Requirements | 40% | Authentication specified |

## Recommendation

Requirements are significantly improved. Implementation can proceed with:
1. Complete user management requirements
2. Define non-functional requirements
3. Specify data model
4. Create UI/UX wireframes
