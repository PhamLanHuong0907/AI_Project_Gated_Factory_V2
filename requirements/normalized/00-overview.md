# REQ-00: Project Overview

## Project Identity

| Field | Value |
|-------|-------|
| Project Name | Phần mềm chấm công |
| Project Code | CHANGE_ME |
| Source Document | requirements/source/Requirement.docx |
| Language | Vietnamese (vi) |
| Timezone | Asia/Ho_Chi_Minh |

## Project Description

Phần mềm chấm công (Attendance Management System) enables employees to clock in/out via QR code scanning with GPS location verification, with mobile-responsive interface, reporting, and salary calculation capabilities.

## Technical Stack (from source)

| Layer | Technology |
|-------|------------|
| Backend | Java 21, Spring Boot |
| Frontend | ReactJS |
| Database | TBD (suggestion: PostgreSQL) |

## High-Level Requirements Summary

| ID | Requirement | Source Section |
|----|-------------|----------------|
| REQ-01 | QR Code Attendance (IN/OUT) | Yêu cầu dự án |
| REQ-02 | Mobile Responsive | Yêu cầu dự án |
| REQ-03 | Monthly Attendance Report & Salary Calculation | Yêu cầu dự án |
| REQ-04 | Dashboard | Yêu cầu dự án |
| REQ-05 | QR Code Generation | Bổ sung |
| REQ-06 | GPS Location Verification | Bổ sung |
| REQ-07 | User Authentication | Stakeholder clarification |
| REQ-08 | Salary Configuration | Stakeholder clarification |
| REQ-09 | Shift Configuration | Stakeholder clarification |

## Assumptions

1. **ASSUMPTION-00-01**: Database technology is flexible - PostgreSQL is suggested but not mandatory
2. **ASSUMPTION-00-02**: System will have at least two actor types: employees and administrators
3. **ASSUMPTION-00-03**: QR code scanning will be done via mobile device camera
4. **ASSUMPTION-00-04**: GPS location is required for attendance validation
5. **ASSUMPTION-00-05**: Maximum allowed distance for attendance is 10 meters from company location
6. **ASSUMPTION-00-06**: Users login with personal account, then use personal device to scan QR
7. **ASSUMPTION-00-07**: Salary configuration includes categories, amounts, and calculation formulas
8. **ASSUMPTION-00-08**: Default penalty rules exist for late arrival and leave
9. **ASSUMPTION-00-09**: Shift configuration is available for working hours
10. **ASSUMPTION-00-10**: QR code validity is based on configuration

## Answered Questions

| ID | Question | Answer |
|----|----------|--------|
| OQ-00-03 | What authentication method should be used? | Login with personal account, scan QR with personal device |
| OQ-00-08 | How are company GPS coordinates configured? | Admin configures company location |
| OQ-00-11 | How are QR codes generated? | User presses button to generate, validity based on config |
| OQ-00-12 | What is QR code validity period? | Based on configuration |

## Remaining Open Questions

| ID | Question | Impact |
|----|----------|--------|
| OQ-00-01 | What is the specific project name and code? | Project identity |
| OQ-00-02 | Is this a web-based, mobile app, or both? | Architecture |
| OQ-00-04 | Is this for a single company or multi-tenant? | Data model |
| OQ-00-05 | What is the expected number of users? | Scalability |
| OQ-00-06 | Is offline attendance supported? | Feature scope |
| OQ-00-07 | Are there integration requirements with existing HR/payroll systems? | Integration |

## Status

**REQUIREMENT_STATUS**: IMPROVED - Most critical questions answered, new requirements added
