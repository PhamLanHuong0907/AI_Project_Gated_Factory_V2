# MOD-01: QR Attendance - Overview

## Module Identity

| Field | Value |
|-------|-------|
| Module ID | MOD-01 |
| Module Name | QR Attendance |
| Requirement Reference | REQ-01, REQ-06 |
| Status | PARTIALLY SPECIFIED |

## Purpose

Enable employees to record attendance (clock IN/OUT) by scanning QR codes with GPS location verification using their mobile devices.

## Actors

| Actor | Role | Access Level |
|-------|------|--------------|
| Employee (ACT-01) | Primary user | Scan QR, view own attendance |

## Features

| Feature ID | Feature Name | Status |
|------------|--------------|--------|
| F-01-01 | QR Code Scanning | SPECIFIED |
| F-01-02 | Attendance Recording | SPECIFIED |
| F-01-03 | Duplicate Prevention | INFERRED |
| F-01-04 | QR Code Generation | SPECIFIED (via MOD-05) |
| F-01-05 | Attendance History View | NOT SPECIFIED |
| F-01-06 | GPS Location Verification | SPECIFIED (NEW) |
| F-01-07 | Distance Calculation | SPECIFIED (NEW) |

## Module Dependencies

| Dependency | Module/System | Status |
|------------|---------------|--------|
| QR Code Generation | MOD-05 | SPECIFIED |
| GPS Location Verification | MOD-06 | SPECIFIED |
| Authentication | MOD-07 | NOT SPECIFIED |
| User Management | MOD-08 | NOT SPECIFIED |
| Camera Access | Mobile Device | REQUIRED |
| GPS Service | Mobile Device | REQUIRED (NEW) |

## Constraints

1. Must work on mobile devices with camera and GPS
2. Must distinguish between IN and OUT
3. Must prevent duplicate attendance records
4. **GPS distance must be ≤ 10 meters from company location** (NEW)
5. **Both QR scan AND GPS verification must pass** (NEW)

## Assumptions

1. Employee is already authenticated before scanning
2. QR code is displayed somewhere accessible (screen, printed, badge)
3. System has network connectivity during scan
4. **GPS is enabled on employee's mobile device** (NEW)
5. **Company GPS coordinates are configured in system** (NEW)

## Open Questions

| ID | Question |
|----|----------|
| OQ-M01-01 | How are QR codes generated and displayed? |
| OQ-M01-02 | Is QR code single-use or multi-use? |
| OQ-M01-03 | What happens when scan fails? |
| OQ-M01-04 | Is there a retry mechanism? |
| OQ-M01-05 | Can attendance be edited manually? |
| OQ-M01-06 | What happens when GPS is unavailable? (NEW) |
| OQ-M01-07 | Is GPS accuracy threshold configurable? (NEW) |
| OQ-M01-08 | Can attendance be recorded if GPS fails but QR is valid? (NEW) |

## Source Traceability

| Source Section | Requirement |
|----------------|-------------|
| Yêu cầu dựán | "Chấm công bằng mã QR (IN/OUT)" |
| Bổ sung | "Kiểm tra khoảng cách giữa vị trí GPS của nhân viên và GPS công ty" |
| Bổ sung | "khoảng cách GPS <= 10 mét" |
