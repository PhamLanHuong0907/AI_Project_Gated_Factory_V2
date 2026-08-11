# MOD-06: GPS Location Verification - Overview

## Module Identity

| Field | Value |
|-------|-------|
| Module ID | MOD-06 |
| Module Name | GPS Location Verification |
| Requirement Reference | REQ-06 |
| Status | SPECIFIED |

## Purpose

Verify employee location is within 10 meters of company location using GPS coordinates. This is a critical validation for attendance success.

## Actors

| Actor | Role | Access Level |
|-------|------|--------------|
| Employee (ACT-01) | Provide GPS location | View own location |
| Administrator (ACT-02) | Configure company location | Manage GPS settings |
| System (ACT-SYS) | Verify GPS distance | Calculate and validate |

## Features

| Feature ID | Feature Name | Status |
|------------|--------------|--------|
| F-06-01 | GPS Location Capture | SPECIFIED |
| F-06-02 | Distance Calculation | SPECIFIED |
| F-06-03 | Distance Validation (≤10m) | SPECIFIED |
| F-06-04 | Company Location Management | SPECIFIED |
| F-06-05 | GPS Error Handling | SPECIFIED |
| F-06-06 | GPS Accuracy Validation | NOT SPECIFIED |

## Distance Calculation

**Formula**: Haversine formula for calculating distance between two GPS coordinates

```
d = 2r × arcsin(√(sin²((φ₂-φ₁)/2) + cos(φ₁) × cos(φ₂) × sin²((λ₂-λ₁)/2)))
```

Where:
- φ₁, φ₂ = latitude of point 1 and 2
- λ₁, λ₂ = longitude of point 1 and 2
- r = Earth's radius (6,371 km)

## Validation Rules

| Rule | Condition | Result |
|------|-----------|--------|
| GPS Valid | distance ≤ 10 meters | ✅ PASS |
| GPS Invalid | distance > 10 meters | ❌ FAIL |
| GPS Unavailable | Cannot get location | ❌ FAIL |
| GPS Inaccurate | Accuracy > threshold | ⚠️ WARNING |

## Module Dependencies

| Dependency | Module/System | Status |
|------------|---------------|--------|
| Geolocation API | Mobile Browser | REQUIRED |
| Company Location | Database | REQUIRED |
| Attendance | MOD-01 | REQUIRED |

## Constraints

1. GPS must be enabled on device
2. Distance must be ≤ 10 meters
3. GPS accuracy must be acceptable
4. Company GPS must be configured

## Assumptions

1. Employee's mobile device has GPS capability
2. GPS permission is granted
3. Company GPS coordinates are configured
4. Network connectivity available for calculation

## Open Questions

| ID | Question |
|----|----------|
| OQ-M06-01 | How are company GPS coordinates configured? |
| OQ-M06-02 | Is GPS accuracy threshold configurable? |
| OQ-M06-03 | What happens when GPS is unavailable? |
| OQ-M06-04 | Is there a manual override for GPS failure? |
| OQ-M06-05 | How to handle multi-location companies? |
| OQ-M06-06 | What is minimum GPS accuracy required? |

## Source Traceability

| Source Section | Requirement |
|----------------|-------------|
| Bổ sung | "Tính năng nhận vị trí GPS: Kiểm tra khoảng cách giữa vị trí GPS của nhân viên và GPS công ty" |
| Bổ sung | "Điều kiện chấm công thành công: Khi quét mã QR thành công VÀ khoảng cách GPS <= 10 mét" |
