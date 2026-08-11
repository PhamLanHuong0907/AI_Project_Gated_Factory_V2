# Screen Map - Hệ thống Chấm công QR & GPS

## 1. Screen Inventory

| ID | Screen Name | Route | Use Case | Primary Actor | Priority |
|----|-------------|-------|----------|---------------|----------|
| SCR-01 | Đăng nhập | `/login` | UC-01 | All | P0 |
| SCR-02 | Dashboard | `/` | UC-08 | ADMIN, HR_MANAGER | P1 |
| SCR-03 | Tạo mã QR | `/qr/generate` | UC-02 | ADMIN | P0 |
| SCR-04 | Quét mã QR & GPS | `/qr/scan` | UC-03 | EMPLOYEE | P0 |
| SCR-05 | Lịch sử chấm công | `/attendance` | UC-04 | All | P1 |
| SCR-06 | Quản lý ca làm việc | `/admin/shifts` | UC-05 | ADMIN | P1 |
| SCR-07 | **Cấu hình lương** | `/admin/salary-config` | UC-06 | ADMIN | P1 |
| SCR-08 | Báo cáo lương | `/admin/salary-report` | UC-07 | ADMIN, HR_MANAGER | P1 |
| SCR-09 | Quản lý nhân viên | `/admin/users` | — (Admin CRUD) | ADMIN | P2 |
| SCR-10 | Cài đặt | `/admin/settings` | — (Admin Config) | ADMIN | P2 |
| SCR-11 | Đơn xin nghỉ (Nhân viên) | `/my/leave-requests` | UC-11 | EMPLOYEE | P1 |
| SCR-12 | Duyệt đơn xin nghỉ | `/admin/leave-requests` | UC-12 | ADMIN, HR_MANAGER | P1 |

> **Lưu ý SCR-07**: Screen gộp tất cả cấu hình lương với 5 tabs:
> - Tab 1: Vị trí (salary_positions)
> - Tab 2: Kinh nghiệm (salary_experience)
> - Tab 3: Phạt chấm công (salary_penalties)
> - Tab 4: Thưởng (salary_bonus)
> - Tab 5: Công thức tính lương (salary_formulas) — visual builder với component selector

---

## 2. Screen Relationships

```
                            ┌─────────────┐
                            │  SCR-01     │
                            │  Login      │
                            └──────┬──────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
            ┌──────────────┐ ┌──────────┐ ┌──────────────┐
            │   SCR-02     │ │  SCR-04  │ │   SCR-05     │
            │  Dashboard   │ │ QR Scan  │ │  Attendance  │
            │  (Admin/HR)  │ │ (Employee│ │   History    │
            └──────┬───────┘ └──────────┘ └──────────────┘
                   │
    ┌──────────────┼──────────────┬──────────────┐
    │              │              │              │
    ▼              ▼              ▼              ▼
┌────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ SCR-09 │  │  SCR-06  │  │  SCR-07  │  │  SCR-08  │
│ Users  │  │  Shifts  │  │  Salary  │  │  Salary  │
│ Mgmt   │  │  Config  │  │  Config  │  │  Report  │
└────────┘  └──────────┘  └──────────┘  └──────────┘

            ┌──────────────┐
            │   SCR-03     │
            │  QR Generate │
            │  (Admin)     │
            └──────────────┘
```

---

## 3. Screen-to-Use-Case Mapping

| Screen | Use Case | Use Case Description | Notes |
|--------|----------|---------------------|-------|
| SCR-01 | UC-01 | Employee/Admin login with username + password | Standalone (no shell) |
| SCR-02 | UC-08 | Dashboard overview: attendance stats, recent activity | Tabs: Hôm nay / Tuần / Tháng |
| SCR-03 | UC-02 | Admin generates QR code for workplace | Button-to-generate, auto-refresh |
| SCR-04 | UC-03 | Employee scans QR + GPS verification | Camera viewfinder, GPS capture |
| SCR-05 | UC-04 | Employee views own attendance history | Filters: date range, status |
| SCR-06 | UC-05 | Admin manages work shifts | Table + create/edit modal |
| SCR-07 | UC-06 | HR configures salary for employees | Table + edit modal per user |
| SCR-08 | UC-07 | HR generates monthly salary report | Filters + table + export |
| SCR-09 | — | Admin CRUD for employee accounts | Table + create/edit modal |
| SCR-10 | — | Admin configures GPS, QR expiration, late threshold | 3 config sections |

---

## 4. Screen Descriptions

### SCR-01 — Đăng nhập (`/login`)

**Purpose**: Authenticate user with username and password.

**Layout**: Centered card on full-screen background. Logo at top, form in middle, footer at bottom.

**Key Elements**:
- Username input (text, required)
- Password input (password toggle, required)
- "Đăng nhập" button (primary)
- Error message display (inline below form)
- Company logo and name

**Actors**: All (unauthenticated)

---

### SCR-02 — Dashboard (`/`)

**Purpose**: Overview of attendance data, quick stats, and recent activity.

**Layout**: Grid of stat cards at top, charts/table below.

**Key Elements**:
- Stat cards: Tổng nhân viên, Đúng giờ, Đi trễ, Vắng mặt
- Attendance summary chart (bar or pie)
- Recent attendance list (last 10 entries)
- Quick action buttons: Tạo QR, Xem báo cáo

**Actors**: ADMIN, HR_MANAGER

---

### SCR-03 — Tạo mã QR (`/qr/generate`)

**Purpose**: Generate and display QR code for workplace attendance scanning.

**Layout**: Centered QR code display with countdown timer.

**Key Elements**:
- "Tạo mã QR" button (primary, full-width)
- QR code display (large, centered)
- Countdown timer (MM:SS) showing time until expiry
- Auto-refresh indicator
- Status: Đang chờ / Đã hết hạn

**Actors**: ADMIN

---

### SCR-04 — Quét mã QR & GPS (`/qr/scan`)

**Purpose**: Employee scans QR code and verifies GPS location for attendance.

**Layout**: Camera viewfinder overlay with GPS status.

**Key Elements**:
- Camera viewfinder (full screen)
- GPS status indicator (acquiring / verified / failed)
- Distance display (e.g., "Khoảng cách: 12m")
- Scan result overlay (success/failure)
- Manual trigger: "Quét lại" button

**Actors**: EMPLOYEE

---

### SCR-05 — Lịch sử chấm công (`/attendance`)

**Purpose**: View attendance history with filtering and details.

**Layout**: Filter bar at top, table below, pagination at bottom.

**Key Elements**:
- Date range picker (from/to)
- Status filter dropdown (Tất cả, Đúng giờ, Đi trễ, Vắng mặt)
- Attendance table: Ngày, Giờ vào, Giờ ra, Trạng thái, Khoảng cách
- Status badges: ON_TIME (green), LATE (yellow), ABSENT (red)
- Monthly summary row at bottom
- Tab switcher: Hôm nay / Tuần này / Tháng này / Tùy chỉnh

**Actors**: All (EMPLOYEE sees own data; ADMIN/HR_MANAGER sees all)

---

### SCR-06 — Quản lý ca làm việc (`/admin/shifts`)

**Purpose**: Admin manages work shift configurations.

**Layout**: Table of shifts with create/edit/delete actions.

**Key Elements**:
- Shifts table: Tên ca, Giờ bắt đầu, Giờ kết thúc, Thời gian chờ, Ngày làm, Trạng thái
- "Thêm ca mới" button (opens modal)
- Edit action (opens modal with pre-filled data)
- Delete action (confirmation dialog)
- Active/inactive toggle

**Actors**: ADMIN

---

### SCR-07 — Cấu hình lương (`/admin/salary-config`)

**Purpose**: Configure salary parameters for employees.

**Layout**: Table of employees with salary config, edit modal.

**Key Elements**:
- Employee list table: Họ tên, Ca làm việc, Danh mục lương, Lương cơ bản, Phạt trễ, Phạt nghỉ
- Search/filter by employee name
- Edit action (opens modal per employee)
- Salary categories: FULL_TIME, PART_TIME, INTERN
- Default penalty rates display

**Actors**: ADMIN, HR_MANAGER

---

### SCR-08 — Báo cáo lương (`/admin/salary-report`)

**Purpose**: Generate and view monthly salary reports.

**Layout**: Month/year picker at top, summary cards, detailed table, export button.

**Key Elements**:
- Month/year picker (default: current month)
- Summary cards: Tổng quỹ lương, Số nhân viên, Trung bình
- Salary table: Họ tên, Lương cơ bản, Phạt, Tổng lương
- Export button (CSV/Excel)
- Print button

**Actors**: ADMIN, HR_MANAGER

---

### SCR-09 — Quản lý nhân viên (`/admin/users`)

**Purpose**: Admin manages employee accounts (CRUD).

**Layout**: Table of users with create/edit/delete actions.

**Key Elements**:
- Users table: Họ tên, Tên đăng nhập, Vai trò, Ca làm việc, Trạng thái
- Search by name/username
- Filter by role, status
- "Thêm nhân viên" button (opens modal)
- Edit action (opens modal)
- Delete action (confirmation dialog)
- Status badges: ACTIVE (green), INACTIVE (gray), LOCKED (red)

**Actors**: ADMIN

---

### SCR-10 — Cài đặt (`/admin/settings`)

**Purpose**: Configure system settings: GPS office location, QR code expiration time, and attendance late threshold.

**Layout**: Single form with map preview (optional).

**Key Elements**:
- Vĩ độ (latitude) input
- Kinh độ (longitude) input
- Bán kính giới hạn (threshold) input (20-50m)
- WiFi fallback toggle
- Map preview showing office location (optional)
- "Lưu" button

**Actors**: ADMIN

---

## 5. Screen Exclusions (Not Created)

The following screens are explicitly **NOT** created per CLAUDE.md rules:

| Excluded | Reason |
|----------|--------|
| CRUD per database table | Only create screens from use cases, not tables |
| Audit Log viewer | No use case requires it (backend logging only) |
| Session Management | No use case for session management UI |
| Report viewer for Admin | Merged into Dashboard (SCR-02) |
| QR History | Not in use cases; QR is ephemeral |
| Settings page | Merged into SCR-10 (GPS + QR + Attendance config) |
| User Profile edit | Merged into "Cá nhân" tab (not a full screen) |
