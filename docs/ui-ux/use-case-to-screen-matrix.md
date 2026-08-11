# Use Case to Screen Matrix

## Mapping

| Use Case | Use Case Name | Screen(s) | Coverage |
|----------|--------------|-----------|----------|
| UC-01 | Đăng nhập | SCR-01 (Login) | ✅ Full |
| UC-02 | Tạo QR Code | SCR-03 (QR Generate) | ✅ Full |
| UC-03 | Quét QR & GPS Verify | SCR-04 (QR Scan) | ✅ Full |
| UC-04 | Xem lịch sử chấm công | SCR-05 (Attendance History) | ✅ Full |
| UC-05 | Quản lý ca làm việc | SCR-06 (Shift Config) | ✅ Full |
| UC-06 | Cấu hình lương | SCR-07 (Salary Config - 5 tabs) | ✅ Full |
| UC-07 | Tạo bảng lương | SCR-08 (Salary Report) | ✅ Full |
| UC-08 | Dashboard tổng quan | SCR-02 (Dashboard) | ✅ Full |

## Coverage Summary

| Metric | Value |
|--------|-------|
| Total Use Cases | 8 |
| Use Cases with Screen | 8 |
| Coverage | **100%** |
| Orphan Screens (no UC) | 2 (SCR-09, SCR-10) |

## Orphan Screens Analysis

| Screen | Reason | Justification |
|--------|--------|---------------|
| SCR-09 (Quản lý nhân viên) | Admin CRUD | OpenAPI endpoints: `GET/POST /users`, `GET/PUT/DELETE /users/{id}` |
| SCR-10 (Cài đặt GPS) | Admin Config | OpenAPI endpoints: `GET/PUT /config/gps` |

## SCR-07 Tab Coverage

SCR-07 consolidates all salary configuration into a single tabbed screen:

| Tab | Content | API Endpoints |
|-----|---------|---------------|
| Tab 1: Vị trí | Position-based salary | `salary/positions` CRUD |
| Tab 2: Kinh nghiệm | Experience tiers | `salary/experience` CRUD |
| Tab 3: Phạt chấm công | Attendance penalties | `salary/penalties` CRUD |
| Tab 4: Thưởng | Bonus/allowance | `salary/bonus` CRUD |
| Tab 5: Công thức | Formula builder | `salary/formula` |
| Employee Assignment | Assign configs to employees | `salary/assign/*`, `salary/employee/*` |

## Notes

- No use case is missing a screen.
- All 8 original use cases have 1:1 screen mapping.
- SCR-09 and SCR-10 are supplementary admin screens derived from API endpoints (not use cases).
- SCR-07 was redesigned: now handles ALL salary configuration (position, experience, penalty, bonus, formula) plus employee assignment in a tabbed interface.
