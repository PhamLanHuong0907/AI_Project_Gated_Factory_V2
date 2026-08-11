# Screen to API Matrix

## Mapping

| Screen | Screen Name | API Endpoints | Method |
|--------|-------------|---------------|--------|
| SCR-01 | Login | `/api/v1/auth/login` | POST |
| SCR-02 | Dashboard | `/api/v1/reports/monthly`, `/api/v1/attendance/my` | GET |
| SCR-03 | QR Generate | `/api/v1/qr/generate`, `/api/v1/qr/current` | POST, GET |
| SCR-04 | QR Scan | `/api/v1/attendance/scan`, `/api/v1/shifts` | POST, GET |
| SCR-05 | Attendance History (2 views) | Tổng hợp: `attendance/report/daily`, `attendance/report/monthly`, `attendance/report/range`, `attendance/employee/{userId}`, `attendance/export` | GET |
| | | Cá nhân: `attendance/my` | GET |
| SCR-06 | Shift Config | `/api/v1/shifts`, `/api/v1/shifts/{id}` | GET, POST, PUT, DELETE |
| SCR-07 | Salary Config (All Tabs) | Tab 1: `salary/positions` CRUD | GET, POST, PUT, DELETE |
| | | Tab 2: `salary/experience` CRUD | GET, POST, PUT, DELETE |
| | | Tab 3: `salary/penalties` CRUD | GET, POST, PUT, DELETE |
| | | Tab 4: `salary/bonus` CRUD | GET, POST, PUT, DELETE |
| | | Tab 5: `salary/formula` | GET, PUT, POST validate, POST preview |
| | | Employee Assignment: `salary/assign/*` | POST, DELETE |
| | | Employee Detail: `salary/employee/{userId}` | GET |
| | | Users list: `/api/v1/users` | GET |
| SCR-08 | Salary Report | `/api/v1/reports/salary` | GET |
| SCR-09 | User Management | `/api/v1/users`, `/api/v1/users/{id}`, `/api/v1/shifts` | GET, POST, PUT, DELETE |
| SCR-10 | Cài đặt | `/api/v1/config/gps`, `/api/v1/config/qr`, `/api/v1/config/attendance` | GET, PUT |
| SCR-11 | Đơn từ (Nhân viên) | `/api/v1/leave-requests`, `/api/v1/leave-requests/{id}`, `/api/v1/leave-requests/upload` | GET, POST, PUT, DELETE |
| SCR-12 | Duyệt đơn (Admin/HR) | `/api/v1/leave-requests`, `/api/v1/leave-requests/{id}`, `/api/v1/leave-requests/{id}/approve`, `/api/v1/leave-requests/{id}/reject` | GET, POST |

## API Coverage

| API Endpoint | Method | Used By Screen(s) | Coverage |
|-------------|--------|-------------------|----------|
| `/api/v1/auth/login` | POST | SCR-01 | ✅ |
| `/api/v1/auth/logout` | POST | All (top bar) | ✅ |
| `/api/v1/auth/refresh` | POST | Interceptor | ✅ |
| `/api/v1/users` | GET | SCR-07, SCR-09 | ✅ |
| `/api/v1/users` | POST | SCR-09 | ✅ |
| `/api/v1/users/{id}` | GET | SCR-09 | ✅ |
| `/api/v1/users/{id}` | PUT | SCR-09 | ✅ |
| `/api/v1/users/{id}` | DELETE | SCR-09 | ✅ |
| `/api/v1/attendance/my` | GET | SCR-02, SCR-05 | ✅ |
| `/api/v1/attendance/scan` | POST | SCR-04 | ✅ |
| `/api/v1/reports/monthly` | GET | SCR-02, SCR-05 | ✅ |
| `/api/v1/reports/salary` | GET | SCR-08 | ✅ |
| `/api/v1/qr/generate` | POST | SCR-03 | ✅ |
| `/api/v1/qr/current` | GET | SCR-03 | ✅ |
| `/api/v1/shifts` | GET | SCR-04, SCR-06, SCR-09 | ✅ |
| `/api/v1/shifts` | POST | SCR-06 | ✅ |
| `/api/v1/shifts/{id}` | PUT | SCR-06 | ✅ |
| `/api/v1/shifts/{id}` | DELETE | SCR-06 | ✅ |
| `/api/v1/salary/config` | GET | SCR-07 | ✅ |
| `/api/v1/salary/config` | POST | SCR-07 | ✅ |
| `/api/v1/salary/config/{userId}` | PUT | SCR-07 | ✅ |
| `/api/v1/salary/positions` | GET | SCR-07 | ✅ |
| `/api/v1/salary/positions` | POST | SCR-07 | ✅ |
| `/api/v1/salary/positions/{id}` | PUT | SCR-07 | ✅ |
| `/api/v1/salary/positions/{id}` | DELETE | SCR-07 | ✅ |
| `/api/v1/salary/experience` | GET | SCR-07 | ✅ |
| `/api/v1/salary/experience` | POST | SCR-07 | ✅ |
| `/api/v1/salary/experience/{id}` | PUT | SCR-07 | ✅ |
| `/api/v1/salary/experience/{id}` | DELETE | SCR-07 | ✅ |
| `/api/v1/salary/penalties` | GET | SCR-07 | ✅ |
| `/api/v1/salary/penalties` | POST | SCR-07 | ✅ |
| `/api/v1/salary/penalties/{id}` | PUT | SCR-07 | ✅ |
| `/api/v1/salary/penalties/{id}` | DELETE | SCR-07 | ✅ |
| `/api/v1/salary/bonus` | GET | SCR-07 | ✅ |
| `/api/v1/salary/bonus` | POST | SCR-07 | ✅ |
| `/api/v1/salary/bonus/{id}` | PUT | SCR-07 | ✅ |
| `/api/v1/salary/bonus/{id}` | DELETE | SCR-07 | ✅ |
| `/api/v1/salary/assign/position` | POST, DELETE | SCR-07 | ✅ |
| `/api/v1/salary/assign/experience` | POST, DELETE | SCR-07 | ✅ |
| `/api/v1/salary/assign/bonus` | POST, DELETE | SCR-07 | ✅ |
| `/api/v1/salary/employee/{userId}` | GET | SCR-07, SCR-08 | ✅ |
| `/api/v1/salary/formula` | GET, PUT | SCR-07 | ✅ |
| `/api/v1/salary/formula/validate` | POST | SCR-07 | ✅ |
| `/api/v1/salary/formula/preview` | POST | SCR-07 | ✅ |
| `/api/v1/config/gps` | GET | SCR-10 | ✅ |
| `/api/v1/config/gps` | PUT | SCR-10 | ✅ |
| `/api/v1/config/qr` | GET | SCR-10 | ✅ |
| `/api/v1/config/qr` | PUT | SCR-10 | ✅ |
| `/api/v1/config/attendance` | GET | SCR-10 | ✅ |
| `/api/v1/config/attendance` | PUT | SCR-10 | ✅ |
| `/api/v1/attendance/report/daily` | GET | SCR-05 | ✅ |
| `/api/v1/attendance/report/monthly` | GET | SCR-05 | ✅ |
| `/api/v1/attendance/report/range` | GET | SCR-05 | ✅ |
| `/api/v1/attendance/employee/{userId}` | GET | SCR-05 | ✅ |
| `/api/v1/attendance/export` | GET | SCR-05 | ✅ |
| `/api/v1/leave-requests` | GET | SCR-11, SCR-12 | ✅ |
| `/api/v1/leave-requests` | POST | SCR-11 | ✅ |
| `/api/v1/leave-requests/{id}` | GET | SCR-11, SCR-12 | ✅ |
| `/api/v1/leave-requests/{id}` | PUT | SCR-11 | ✅ |
| `/api/v1/leave-requests/{id}` | DELETE | SCR-11 | ✅ |
| `/api/v1/leave-requests/{id}/approve` | POST | SCR-12 | ✅ |
| `/api/v1/leave-requests/{id}/reject` | POST | SCR-12 | ✅ |
| `/api/v1/leave-requests/upload` | POST | SCR-11 | ✅ |

## Coverage Summary

| Metric | Value |
|--------|-------|
| Total API Endpoints | 59 |
| Endpoints Used in UI | 59 |
| Coverage | **100%** |

## Unmapped Endpoints (if any)

None. All OpenAPI endpoints are mapped to at least one screen.
