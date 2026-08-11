# REQ-01: Module Map

## Module Inventory

| Module ID | Module Name | Source Requirement | Status |
|-----------|-------------|-------------------|--------|
| MOD-01 | QR Attendance | REQ-01: QR Code Attendance (IN/OUT) | SPECIFIED |
| MOD-02 | Mobile Responsive | REQ-02: Mobile Responsive | SPECIFIED |
| MOD-03 | Reports | REQ-03: Monthly Attendance Report & Salary Calculation | SPECIFIED |
| MOD-04 | Dashboard | REQ-04: Dashboard | SPECIFIED |
| MOD-05 | QR Code Generation | REQ-05: QR Code Generation | SPECIFIED |
| MOD-06 | GPS Location Verification | REQ-06: GPS Location Verification | SPECIFIED |
| MOD-07 | Authentication | Not in source | MISSING |
| MOD-08 | User Management | Not in source | MISSING |

## Module Dependency Graph

```
┌─────────────────────────────────────────────────────────────┐
│                    Authentication (MOD-07)                  │
│                    MISSING FROM SOURCE                       │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                  User Management (MOD-08)                   │
│                  MISSING FROM SOURCE                         │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│               QR Code Generation (MOD-05)                   │
│               Generate QR codes for attendance               │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│               GPS Location Verification (MOD-06)            │
│               Verify employee location within 10m            │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│               QR Attendance (MOD-01)                        │
│               Scan QR + GPS → Record attendance              │
└─────────────────────────┬───────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
┌───────▼───────┐ ┌───────▼───────┐ ┌───────▼───────┐
│ Mobile        │ │ Reports       │ │ Dashboard     │
│ Responsive    │ │ (MOD-03)      │ │ (MOD-04)      │
│ (MOD-02)      │ │               │ │               │
└───────────────┘ └───────────────┘ └───────────────┘
```

## Module Details

### MOD-01: QR Attendance

- **Purpose**: Enable employees to record attendance by scanning QR codes with GPS verification
- **Actor(s)**: Employee
- **Trigger**: Employee scans QR code via mobile device
- **Preconditions**: Employee is registered, QR code is generated, GPS is enabled
- **Main Flow**: Scan QR → Get GPS → Validate QR + GPS distance → Record timestamp → Confirm
- **Alternative Flow**: Invalid QR, GPS unavailable, distance > 10m, network error, duplicate scan
- **Acceptance Criteria**: TBD - Not specified in source

### MOD-02: Mobile Responsive

- **Purpose**: Ensure attendance system works on mobile devices
- **Actor(s)**: Employee
- **Trigger**: Access system via mobile browser
- **Preconditions**: Responsive design implemented
- **Main Flow**: Access via mobile → Display responsive UI → Complete attendance
- **Alternative Flow**: TBD
- **Acceptance Criteria**: TBD - Not specified in source

### MOD-03: Reports

- **Purpose**: Generate monthly attendance reports and salary calculations
- **Actor(s)**: Administrator, HR
- **Trigger**: Request report generation
- **Preconditions**: Attendance data exists
- **Main Flow**: Select period → Generate report → Export
- **Alternative Flow**: TBD
- **Acceptance Criteria**: TBD - Not specified in source

### MOD-04: Dashboard

- **Purpose**: Provide overview of attendance statistics
- **Actor(s)**: Administrator
- **Trigger**: Access dashboard
- **Preconditions**: Data exists
- **Main Flow**: View dashboard → See statistics
- **Alternative Flow**: TBD
- **Acceptance Criteria**: TBD - Not specified in source

### MOD-05: QR Code Generation (NEW)

- **Purpose**: Generate QR codes for attendance scanning
- **Actor(s)**: System (automatic), Administrator (manual)
- **Trigger**: Shift starts, employee requests, scheduled generation
- **Preconditions**: Employee/shift is configured
- **Main Flow**: Generate QR → Set validity → Display/print QR
- **Alternative Flow**: Generation failure, expired QR
- **Acceptance Criteria**: TBD - New feature

### MOD-06: GPS Location Verification (NEW)

- **Purpose**: Verify employee location is within allowed distance from company
- **Actor(s)**: System (automatic during attendance)
- **Trigger**: Employee scans QR code
- **Preconditions**: GPS is enabled, company location is configured
- **Main Flow**: Get employee GPS → Get company GPS → Calculate distance → Validate ≤ 10m
- **Alternative Flow**: GPS unavailable, distance > 10m, accuracy issues
- **Acceptance Criteria**: TBD - New feature

### MOD-07: Authentication

- **Purpose**: User login and session management
- **Actor(s)**: All users
- **Trigger**: Access system
- **Preconditions**: None
- **Main Flow**: Login → Authenticate → Access system
- **Alternative Flow**: TBD
- **Acceptance Criteria**: TBD - MISSING FROM SOURCE

### MOD-08: User Management

- **Purpose**: CRUD operations for users, roles, and permissions
- **Actor(s)**: Administrator
- **Trigger**: Manage users
- **Preconditions**: Admin logged in
- **Main Flow**: CRUD operations
- **Alternative Flow**: TBD
- **Acceptance Criteria**: TBD - MISSING FROM SOURCE

## Coverage Assessment

| Category | Modules | Status |
|----------|---------|--------|
| Core Business | MOD-01 | PARTIALLY SPECIFIED |
| QR Generation | MOD-05 | SPECIFIED (NEW) |
| GPS Verification | MOD-06 | SPECIFIED (NEW) |
| User Interface | MOD-02, MOD-04 | PARTIALLY SPECIFIED |
| Reporting | MOD-03 | PARTIALLY SPECIFIED |
| Security | MOD-07 | NOT SPECIFIED |
| Administration | MOD-08 | NOT SPECIFIED |

## Recommendation

New features (QR generation, GPS verification) have been added. Additional details required:
1. GPS configuration (company coordinates, accuracy threshold)
2. QR code generation rules (per employee, per shift, validity period)
3. Authentication and user management requirements
4. Detailed acceptance criteria for all modules
5. Business rules and validation logic
6. Permission and role definitions
7. Integration requirements
