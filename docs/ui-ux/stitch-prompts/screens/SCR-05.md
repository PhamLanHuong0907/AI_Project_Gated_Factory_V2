# Stitch Prompt: SCR-05 — Lịch sử chấm công (LIST TIÊU BIỂU)

## Screen Identity

| Field | Value |
|-------|-------|
| Screen ID | SCR-05 |
| Screen Name | Lịch sử chấm công |
| Route | `/attendance` |
| Use Case | UC-04 |
| Actors | EMPLOYEE (cá nhân), ADMIN, HR_MANAGER (tổng hợp + cá nhân) |
| Layout | App Shell with content area |
| Pattern | **List (tiêu biểu)** — 2 view modes theo role |

## User Role & Goal

- **ADMIN/HR_MANAGER**: Xem tổng hợp chấm công của tất cả nhân viên (theo ngày, tháng, khoảng ngày). Có thể chọn 1 nhân viên để xem chi tiết.
- **EMPLOYEE**: Chỉ xem lịch sử chấm công của bản thân.

## GLOBAL APP SHELL LOCK

> This screen uses the approved App Shell. DO NOT modify the shell. Only design the content area.

## View Switcher (Admin/Manager only)

```
┌─────────────────────────────────────────────────┐
│  Lịch sử chấm công                              │
├─────────────────────────────────────────────────┤
│                                                 │
│  [📋 Tổng hợp] [👤 Cá nhân]                    │
│  ───────────────────────────────────────────    │
│                                                 │
│          ↓ Nội dung view hiện tại ↓              │
│                                                 │
└─────────────────────────────────────────────────┘
```

- **EMPLOYEE**: Không thấy view switcher, mặc định vào view "Cá nhân"
- **ADMIN/HR_MANAGER**: Thấy 2 tabs, mặc định vào "Tổng hợp"

---

## VIEW 1: Tổng hợp (Admin/Manager)

### Sub-tabs

| Tab | Nội dung |
|-----|----------|
| **Theo ngày** | Danh sách chấm công của 1 ngày |
| **Theo tháng** | Tổng hợp cả tháng — mỗi NV 1 dòng |
| **Khoảng ngày** | Từ ngày A đến ngày B — nhóm theo trạng thái |

### Layout — Theo ngày

```
┌─────────────────────────────────────────────────┐
│  Lịch sử chấm công — Tổng hợp                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  [📋 Theo ngày] [📊 Theo tháng] [📅 Khoảng ngày]│
│                                                 │
│  📅 Ngày: [10/08/2026]  [◀️] [▶️]              │
│  👤 Nhân viên: [Tất cả ▼]                       │
│  📋 Trạng thái: [Tất cả ▼]                      │
│                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │ 👥       │ │ ✅       │ │ ⏰       │ │ 🏖️       │ │
│  │ 45       │ │ 38       │ │ 4        │ │ 3        │ │
│  │ Tổng NV  │ │ Đúng giờ │ │ Đi trễ   │ │ Xin nghỉ │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  STT  Mã NV  Tên NV   Vào    Ra   Trạng thái│  │
│  │  ──────────────────────────────────────── │  │
│  │  1    NV001  Nguyễn A 08:00 17:00 ✅ Đúng giờ│  │
│  │  2    NV002  Trần B   08:15 17:00 ⏰ Trễ 5p │  │
│  │  3    NV003  Lê C     --    --    ❌ Vắng mặt │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  Tổng: 45 │ ✅ 38 │ ⏰ 4 │ ❌ 3           │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  [📥 Xuất CSV]                                  │
└─────────────────────────────────────────────────┘
```

### Layout — Theo tháng

```
┌─────────────────────────────────────────────────┐
│  📅 Tháng: [08 ▼]  Năm: [2026 ▼]  [Xem]       │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  Mã NV   Tên NV    Đúng giờ  Trễ   Vắng  │  │
│  │  ──────────────────────────────────────── │  │
│  │  NV001   Nguyễn A  22       0     0      │  │
│  │  NV002   Trần B    18       3     1      │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  [📥 Xuất CSV]                                  │
└─────────────────────────────────────────────────┘
```

### Layout — Khoảng ngày

```
┌─────────────────────────────────────────────────┐
│  📅 Từ: [01/08/2026]  Đến: [10/08/2026]  [Xem]│
├─────────────────────────────────────────────────┤
│                                                 │
│  📋 Nhóm theo: [Trạng thái ▼]                   │
│                                                 │
│  ┌─ ✅ Đúng giờ (18 người) ──────────────────┐  │
│  │  NV001 Nguyễn A, NV005 Hoàng E, ...       │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌─ ⏰ Đi trễ (4 người) ────────────────────┐  │
│  │  NV002 Trần B (3 lần), NV007 Vũ G (1 lần)│  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌─ ❌ Vắng mặt (2 người) ──────────────────┐  │
│  │  NV003 Lê C (1 lần, có phép)              │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌─ 🏖️ Xin nghỉ (3 người) ─────────────────┐  │
│  │  NV004 Phạm D (Nghỉ phép năm)            │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  [📥 Xuất CSV]                                  │
└─────────────────────────────────────────────────┘
```

---

## VIEW 2: Cá nhân

### Layout — Admin/Manager chọn NV

```
┌─────────────────────────────────────────────────┐
│  Lịch sử chấm công — Cá nhân                    │
├─────────────────────────────────────────────────┤
│                                                 │
│  👤 Nguyễn Văn A (NV001)          [Chọn NV ▼]  │
│                                                 │
│  [Hôm nay] [Tuần này] [Tháng này] [Tùy chỉnh] │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  📅 Ngày    Quét      Vào      Ra         │  │
│  │              Loại     Trạng thái           │  │
│  │  ──────────────────────────────────────── │  │
│  │  10/08/26  08:00     08:00    17:00      │  │
│  │            IN        ✅ Đúng giờ           │  │
│  │  09/08/26  08:15     08:15    17:00      │  │
│  │            IN        ⏰ Đi trễ 5 phút     │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  Tổng: 22 ngày │ ✅ 18 │ ⏰ 3 │ ❌ 1      │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  Trang 1/3  [< prev]  [next >]                 │
└─────────────────────────────────────────────────┘
```

### Layout — Employee tự xem

```
┌─────────────────────────────────────────────────┐
│  Lịch sử chấm công của tôi                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Hôm nay] [Tuần này] [Tháng này] [Tùy chỉnh] │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  📅 Ngày    Quét      Vào      Ra         │  │
│  │              Loại     Trạng thái           │  │
│  │  ──────────────────────────────────────── │  │
│  │  10/08/26  08:00     08:00    17:00      │  │
│  │            IN        ✅ Đúng giờ           │  │
│  │  09/08/26  08:15     08:15    17:00      │  │
│  │            IN        ⏰ Đi trễ 5 phút     │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  Tổng: 22 ngày │ ✅ 18 │ ⏰ 3 │ ❌ 1      │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  Trang 1/3  [< prev]  [next >]                 │
└─────────────────────────────────────────────────┘
```

---

## Fields

### Tổng hợp — Bảng chi tiết

| Field | Kiểu | Hiển thị | Mô tả |
|-------|------|----------|-------|
| stt | computed | STT | Số thứ tự |
| employeeCode | string | Mã NV | Mã nhân viên |
| employeeName | string | Tên NV | Họ tên |
| scanTime | time | Giờ quét | Thời gian quét QR |
| scanType | enum | Loại | CHECK_IN / CHECK_OUT |
| checkInTime | time | Vào | Giờ check-in |
| checkOutTime | time | Ra | Giờ check-out |
| status | enum | Trạng thái | ON_TIME, LATE, ABSENT, EXCUSED_ABSENCE |
| lateMinutes | number | Phút trễ | Số phút đi trễ |
| reason | string | Lý do | Lý do xin nghỉ |

### Tổng hợp — Bảng tháng

| Field | Kiểu | Hiển thị | Mô tả |
|-------|------|----------|-------|
| employeeCode | string | Mã NV | Mã nhân viên |
| employeeName | string | Tên NV | Họ tên |
| onTimeDays | number | Đúng giờ | Số ngày đúng giờ |
| lateDays | number | Trễ | Số ngày đi trễ |
| absentDays | number | Vắng | Số ngày vắng mặt |
| excusedDays | number | Xin nghỉ | Số ngày xin nghỉ |

### Cá nhân — Bảng lịch sử

| Field | Kiểu | Hiển thị | Mô tả |
|-------|------|----------|-------|
| attendanceDate | date | Ngày | Ngày chấm công |
| scanTime | time | Giờ quét | Thời gian quét QR |
| scanType | enum | Loại | CHECK_IN / CHECK_OUT |
| checkInTime | time | Vào | Giờ check-in |
| checkOutTime | time | Ra | Giờ check-out |
| status | enum | Trạng thái | ON_TIME, LATE, ABSENT, EXCUSED_ABSENCE |
| lateMinutes | number | Phút trễ | Số phút đi trễ |
| reason | string | Lý do | Lý do xin nghỉ |
| distance | number | Khoảng cách | GPS distance (m) |

---

## Status Badges

| Status | Label | Background | Text Color |
|--------|-------|------------|------------|
| `ON_TIME` | ✅ Đúng giờ | `#DCFCE7` | `#16A34A` |
| `LATE` | ⏰ Đi trễ | `#FEF3C7` | `#D97706` |
| `ABSENT` | ❌ Vắng mặt | `#FEE2E2` | `#DC2626` |
| `EXCUSED_ABSENCE` | 🏖️ Xin nghỉ | `#DBEAFE` | `#2563EB` |

---

## Filters

### Tổng hợp

| Filter | Type | Options | Default |
|--------|------|---------|---------|
| Sub-tab | Tabs | Theo ngày, Theo tháng, Khoảng ngày | Theo ngày |
| Ngày | DatePicker + arrows | Calendar + ◀️/▶️ | Hôm nay |
| Tháng/Năm | Select | 1-12 / 2024-2030 | Tháng hiện tại |
| Từ ngày | DatePicker | Calendar | Đầu tháng |
| Đến ngày | DatePicker | Calendar | Hôm nay |
| Nhân viên | Select | Tất cả + list NV | Tất cả |
| Trạng thái | Select | Tất cả, Đúng giờ, Đi trễ, Vắng mặt, Xin nghỉ | Tất cả |
| Nhóm theo | Select | Trạng thái, Nhân viên | Trạng thái |

### Cá nhân

| Filter | Type | Options | Default |
|--------|------|---------|---------|
| Nhân viên (Admin only) | Select | List tất cả NV | NV đang xem |
| Kỳ | Tabs | Hôm nay, Tuần này, Tháng này, Tùy chỉnh | Tháng này |

---

## Actions

### Tổng hợp

| Action | Trigger | API Call | Behavior |
|--------|---------|----------|----------|
| Chuyển sub-tab | Tab click | `GET /api/v1/attendance/report/*` | Load data theo tab |
| Chuyển ngày | ◀️/▶️ click | `GET /api/v1/attendance/report/daily` | Ngày trước/sau |
| Filter NV | Select change | Reload API | Reload theo NV |
| Filter status | Select change | Reload API | Reload theo status |
| Nhóm theo | Select change | — | Client-side regroup |
| Xem chi tiết NV | Row click | `GET /api/v1/attendance/employee/{id}` | Chuyển Cá nhân |
| Xuất CSV | Button click | `GET /api/v1/attendance/export` | Download CSV |

### Cá nhân

| Action | Trigger | API Call | Behavior |
|--------|---------|----------|----------|
| Chuyển kỳ | Tab click | `GET /api/v1/attendance/my` | Reload theo kỳ |
| Chọn NV (Admin) | Select change | `GET /api/v1/attendance/employee/{userId}` | Reload data NV |
| Phân trang | Page click | `GET /api/v1/attendance/my` | Load trang tiếp |

---

## API Operations

### Tổng hợp

| Operation | Method | Endpoint | Request | Response |
|-----------|--------|----------|---------|----------|
| getDailyReport | GET | `/api/v1/attendance/report/daily` | `?date={YYYY-MM-DD}&employeeId={id}&status={s}` | `{ data: { date, records: [...], summary: {total, onTime, late, absent, excused} } }` |
| getMonthlyReport | GET | `/api/v1/attendance/report/monthly` | `?month={m}&year={y}&employeeId={id}` | `{ data: { employees: [{id, code, name, onTime, late, absent, excused}], summary } }` |
| getRangeReport | GET | `/api/v1/attendance/report/range` | `?from={date}&to={date}&employeeId={id}&status={s}&groupBy={status\|employee}` | `{ data: { groups: [...], summary } }` |
| getEmployeeDetail | GET | `/api/v1/attendance/employee/{userId}` | `?from={date}&to={date}&page={p}&size=20` | `{ data: { employee, records, summary } }` |

### Cá nhân

| Operation | Method | Endpoint | Request | Response |
|-----------|--------|----------|---------|----------|
| getMyAttendance | GET | `/api/v1/attendance/my` | `?page={p}&size=20&from={date}&to={date}` | `{ data: { content: [...], summary } }` |

---

## Loading State

| State | Behavior |
|-------|----------|
| Loading | Skeleton rows (5 placeholder) + skeleton stat cards |
| Success | Data with fade-in transition |
| Error | Error card with retry |
| Empty | "Chưa có dữ liệu chấm công" + calendar illustration |

## Responsive Rules

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Table → card list, filters stack vertically, stat cards 2-column |
| Tablet | Full table horizontal scroll, stat cards 4-column |
| Desktop | Full table all columns, stat cards 4-column |

### Mobile Card Layout — Tổng hợp (Admin/Manager)

**Theo ngày:**
```
┌─────────────────────────────────────┐
│  📊 Hôm nay — 10/08/2026            │
│  ◀ [10/08/2026] ▶                   │
├─────────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐       │
│  │  45  │ │  38  │ │  4   │       │
│  │Tổng  │ │✅    │ │⏰    │       │
│  └──────┘ └──────┘ └──────┘       │
│  ┌──────┐ ┌──────┐                │
│  │  3   │ │  0   │                │
│  │❌    │ │🏖️    │                │
│  └──────┘ └──────┘                │
│                                     │
│  👤 [Tất cả nhân viên ▼]           │
│  🏷️ [Tất cả trạng thái ▼]         │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ NV001 — Nguyễn Văn A        │   │
│  │ 🕐 Vào: 08:00  Ra: 17:00    │   │
│  │ ✅ Đúng giờ                  │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ NV002 — Trần Văn B          │   │
│  │ 🕐 Vào: 08:15  Ra: 17:00    │   │
│  │ ⏰ Đi trễ 5 phút            │   │
│  └─────────────────────────────┘   │
│                                     │
│  [📥 Xuất CSV]                      │
│  Trang 1/3  [< prev] [next >]      │
└─────────────────────────────────────┘
```

**Theo tháng:**
```
┌─────────────────────────────────────┐
│  📊 Tháng 8/2026                    │
│  [Tháng ▼] [Năm ▼]                 │
├─────────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐       │
│  │  45  │ │  38  │ │  4   │       │
│  │Tổng  │ │✅    │ │⏰    │       │
│  └──────┘ └──────┘ └──────┘       │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ NV001 — Nguyễn A            │   │
│  │ ✅ 22 │ ⏰ 0 │ ❌ 0 │ 🏖️ 0  │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ NV002 — Trần B              │   │
│  │ ✅ 18 │ ⏰ 3 │ ❌ 1 │ 🏖️ 0  │   │
│  └─────────────────────────────┘   │
│                                     │
│  [📥 Xuất CSV]                      │
│  Trang 1/3  [< prev] [next >]      │
└─────────────────────────────────────┘
```

**Khoảng ngày:**
```
┌─────────────────────────────────────┐
│  📊 01/08 → 10/08/2026              │
│  📅 [01/08] → [10/08] [Xem]        │
│  📋 Nhóm: [Trạng thái ▼]           │
├─────────────────────────────────────┤
│  ── ✅ Đúng giờ (18 người) ──       │
│  ┌─────────────────────────────┐   │
│  │ NV001 Nguyễn A (22 lần)     │   │
│  │ NV003 Lê C (20 lần)         │   │
│  │ Xem thêm...                 │   │
│  └─────────────────────────────┘   │
│  ── ⏰ Đi trễ (4 người) ──         │
│  ┌─────────────────────────────┐   │
│  │ NV002 Trần B (3 lần)        │   │
│  └─────────────────────────────┘   │
│  ── ❌ Vắng mặt (2 người) ──       │
│  ┌─────────────────────────────┐   │
│  │ NV003 Lê C (có phép)        │   │
│  └─────────────────────────────┘   │
│                                     │
│  [📥 Xuất CSV]                      │
└─────────────────────────────────────┘
```

### Mobile Card Layout — Cá nhân (Employee)

```
┌─────────────────────────────────────┐
│  📊 Lịch sử chấm công của tôi       │
├─────────────────────────────────────┤
│  [Hôm nay] [Tuần] [Tháng] [Tùy]    │
│                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐       │
│  │  22  │ │  18  │ │  3   │       │
│  │Tổng  │ │✅    │ │⏰    │       │
│  └──────┘ └──────┘ └──────┘       │
│  ┌──────┐                          │
│  │  1   │                          │
│  │❌    │                          │
│  └──────┘                          │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📅 10/08/2026               │   │
│  │ 🕐 08:00 → 17:00            │   │
│  │ ✅ Đúng giờ │ 📏 12m        │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 📅 09/08/2026               │   │
│  │ 🕐 08:15 → 17:00            │   │
│  │ ⏰ Đi trễ 5 phút │ 📏 15m  │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 📅 08/08/2026               │   │
│  │ ❌ Vắng mặt                 │   │
│  └─────────────────────────────┘   │
│                                     │
│  Trang 1/3  [< prev] [next >]      │
└─────────────────────────────────────┘
```

### Mobile Card Layout — Admin xem nhân viên cụ thể

```
┌─────────────────────────────────────┐
│  📊 Lịch sử chấm công              │
├─────────────────────────────────────┤
│  👤 [NV005 — Hoàng Văn E ▼]       │
│  [Hôm nay] [Tuần] [Tháng] [Tùy]    │
│                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐       │
│  │  18  │ │  15  │ │  2   │       │
│  │Tổng  │ │✅    │ │⏰    │       │
│  └──────┘ └──────┘ └──────┘       │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📅 10/08/2026               │   │
│  │ 🕐 08:00 → 17:00            │   │
│  │ ✅ Đúng giờ                 │   │
│  └─────────────────────────────┘   │
│                                     │
│  [📥 Xuất CSV]                      │
│  Trang 1/3  [< prev] [next >]      │
└─────────────────────────────────────┘
```

---

## Forbidden

- DO NOT add real-time updates
- DO NOT add bulk actions (select multiple, delete)
- DO NOT add inline editing
- DO NOT add QR scan from this screen
- DO NOT change the status badge colors
- DO NOT add salary information on this screen
- DO NOT add GPS map view on this screen

## Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-SCR05-01 | View switcher works for Admin/Manager |
| AC-SCR05-02 | Tab "Theo ngày" shows all employees for selected date |
| AC-SCR05-03 | Tab "Theo tháng" shows monthly summary per employee |
| AC-SCR05-04 | Tab "Khoảng ngày" shows grouped results |
| AC-SCR05-05 | Date navigation (◀️/▶️) changes day correctly |
| AC-SCR05-06 | Employee filter works correctly |
| AC-SCR05-07 | Status filter works correctly |
| AC-SCR05-08 | Stat cards show correct counts |
| AC-SCR05-09 | Summary bar matches table data |
| AC-SCR05-10 | CSV export downloads correct data |
| AC-SCR05-11 | Row click navigates to employee detail |
| AC-SCR05-12 | Employee dropdown visible for Admin/Manager only |
| AC-SCR05-13 | Employee view shows only selected employee's data |
| AC-SCR05-14 | Period tabs filter correctly |
| AC-SCR05-15 | Status badges colored correctly |
| AC-SCR05-16 | Pagination works correctly |
| AC-SCR05-17 | EMPLOYEE can only see own data (no dropdown) |
| AC-SCR05-18 | Skeleton loader during data fetch |
| AC-SCR05-19 | Empty state when no records |
| AC-SCR05-20 | Mobile card layout on small screens |
| AC-SCR05-21 | Works at 320px minimum width |
| AC-SCR05-22 | Touch target ≥ 44px |
