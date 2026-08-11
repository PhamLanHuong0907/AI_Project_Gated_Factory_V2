# SCR-05 — Lịch sử chấm công (`/attendance`)

## General

| Field | Value |
|-------|-------|
| Screen ID | SCR-05 |
| Screen Name | Lịch sử chấm công |
| Route | `/attendance` |
| Use Case | UC-04 |
| Actors | EMPLOYEE (cá nhân), ADMIN, HR_MANAGER (tổng hợp + cá nhân) |
| Priority | P1 |
| Layout | App Shell with content area |
| Pattern | List (tiêu biểu) — 2 view modes theo role |

---

## View Modes

| Role | View | Mô tả |
|------|------|-------|
| ADMIN, HR_MANAGER | **Tổng hợp** | Xem danh sách tất cả nhân viên, tổng hợp theo ngày/tháng/khoảng ngày |
| ADMIN, HR_MANAGER | **Cá nhân** | Chọn 1 nhân viên để xem chi tiết lịch sử |
| EMPLOYEE | **Cá nhân** | Chỉ xem lịch sử của mình (tự động, không cần chọn) |

### View Switcher (Admin/Manager only)

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

---

## VIEW 1: Tổng hợp (Admin/Manager)

### Layout

```
┌─────────────────────────────────────────────────┐
│  Lịch sử chấm công — Tổng hợp                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  📅 Kỳ: [Tháng này ▼]  Từ: [__/__/] Đến: [__/__] │
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
│  │  Mã NV   Tên NV    Vào      Ra     Trạng thái │  │
│  │  ──────────────────────────────────────── │  │
│  │  NV001   Nguyễn A  08:00   17:00  ✅ Đúng giờ │  │
│  │  NV002   Trần B    08:15   17:00  ⏰ Đi trễ 5p│  │
│  │  NV003   Lê C      --      --     ❌ Vắng mặt  │  │
│  │  NV004   Phạm D    08:00   12:00  🏖️ Xin nghỉ │  │
│  │                                         │  │
│  │  [✏️ Chi tiết]                           │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  Tổng: 45 │ ✅ 38 │ ⏰ 4 │ 🏖️ 3          │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  [📥 Xuất CSV]                                  │
└─────────────────────────────────────────────────┘
```

### Sub-tabs Tổng hợp (Admin/Manager)

| Tab | Nội dung |
|-----|----------|
| **Theo ngày** | Danh sách chấm công của 1 ngày (mặc định: hôm nay) |
| **Theo tháng** | Tổng hợp cả tháng — mỗi NV 1 dòng tổng kết |
| **Khoảng ngày** | Từ ngày A đến ngày B — lọc + tổng hợp |

#### Tab: Theo ngày

```
┌─────────────────────────────────────────────────┐
│  📅 Ngày: [__/__/____]  [◀️] [▶️]               │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  STT  Mã NV   Tên NV    Vào     Ra       │  │
│  │       Loại    Trạng thái  Lý do           │  │
│  │  ──────────────────────────────────────── │  │
│  │  1    NV001   Nguyễn A  08:00  17:00     │  │
│  │       CHECK_IN ✅ Đúng giờ   —            │  │
│  │                                         │  │
│  │  2    NV002   Trần B    08:15  17:00     │  │
│  │       CHECK_IN ⏰ Trễ 5 phút  —          │  │
│  │                                         │  │
│  │  3    NV003   Lê C      --     --        │  │
│  │       —       ❌ Vắng mặt   Có phép      │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  Tổng: 45 │ ✅ 38 │ ⏰ 4 │ ❌ 3           │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

#### Tab: Theo tháng

```
┌─────────────────────────────────────────────────┐
│  📅 Tháng: [08 ▼]  Năm: [2026 ▼]               │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  Mã NV   Tên NV    Đúng giờ  Trễ   Vắng  │  │
│  │  ──────────────────────────────────────── │  │
│  │  NV001   Nguyễn A  22       0     0      │  │
│  │  NV002   Trần B    18       3     1      │  │
│  │  NV003   Lê C      20       1     0      │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  [📥 Xuất CSV]                                  │
└─────────────────────────────────────────────────┘
```

#### Tab: Khoảng ngày

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
│  │  NV009 Hoàng I (1 lần, không phép)        │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌─ 🏖️ Xin nghỉ (3 người) ─────────────────┐  │
│  │  NV004 Phạm D (Nghỉ phép năm)            │  │
│  │  NV010 Đặng J (Nghỉ ốm)                  │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  [📥 Xuất CSV]                                  │
└─────────────────────────────────────────────────┘
```

---

## VIEW 2: Cá nhân (Employee / Admin chọn NV)

### Layout

```
┌─────────────────────────────────────────────────┐
│  Lịch sử chấm công — Cá nhân                    │
├─────────────────────────────────────────────────┤
│                                                 │
│  👤 Nguyễn Văn A (NV001)          [Chọn NV ▼]  │  ← Chỉ Admin/Manager thấy dropdown
│                                                 │
│  [Hôm nay] [Tuần này] [Tháng này] [Tùy chỉnh] │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  📅 Ngày    Vào      Ra      Trạng thái  │  │
│  │  ──────────────────────────────────────── │  │
│  │  10/08/26  08:00    17:00    ✅ Đúng giờ  │  │
│  │  09/08/26  08:15    17:00    ⏰ Đi trễ    │  │
│  │  08/08/26  --        --       ❌ Vắng mặt  │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  Tổng: 22 ngày │ ✅ 18 │ ⏰ 3 │ ❌ 1      │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  Trang 1/3  [< prev]  [next >]                 │
└─────────────────────────────────────────────────┘
```

### Employee View (Employee tự xem)

```
┌─────────────────────────────────────────────────┐
│  Lịch sử chấm công của tôi                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Hôm nay] [Tuần này] [Tháng này] [Tùy chỉnh] │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  📅 Ngày    Vào      Ra      Trạng thái  │  │
│  │  ──────────────────────────────────────── │  │
│  │  10/08/26  08:00    17:00    ✅ Đúng giờ  │  │
│  │  09/08/26  08:15    17:00    ⏰ Đi trễ    │  │
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

### Tổng hợp — Bảng chi tiết (ngày/khoảng ngày)

| Field | Kiểu | Nguồn | Hiển thị | Mô tả |
|-------|------|-------|----------|-------|
| stt | computed | Client | STT | Số thứ tự |
| employeeCode | string | API | Mã NV | Mã nhân viên |
| employeeName | string | API | Tên NV | Họ tên nhân viên |
| scanTime | time | API | Giờ quét | Thời gian quét QR |
| scanType | enum | API | Loại | `CHECK_IN` / `CHECK_OUT` |
| checkInTime | time | API | Vào | Giờ check-in |
| checkOutTime | time | API | Ra | Giờ check-out |
| status | enum | API | Trạng thái | `ON_TIME`, `LATE`, `ABSENT`, `EXCUSED_ABSENCE` |
| lateMinutes | number | API | Phút trễ | Số phút đi trễ (nếu có) |
| reason | string | API | Lý do | Lý do xin nghỉ (nếu có) |

### Tổng hợp — Bảng tháng

| Field | Kiểu | Nguồn | Hiển thị | Mô tả |
|-------|------|-------|----------|-------|
| employeeCode | string | API | Mã NV | Mã nhân viên |
| employeeName | string | API | Tên NV | Họ tên |
| onTimeDays | number | API | Đúng giờ | Số ngày đúng giờ |
| lateDays | number | API | Trễ | Số ngày đi trễ |
| absentDays | number | API | Vắng | Số ngày vắng mặt |
| excusedDays | number | API | Xin nghỉ | Số ngày xin nghỉ có phép |

### Cá nhân — Bảng lịch sử

| Field | Kiểu | Nguồn | Hiển thị | Mô tả |
|-------|------|-------|----------|-------|
| attendanceDate | date | API | Ngày | Ngày chấm công |
| scanTime | time | API | Giờ quét | Thời gian quét QR |
| scanType | enum | API | Loại | `CHECK_IN` / `CHECK_OUT` |
| checkInTime | time | API | Vào | Giờ check-in |
| checkOutTime | time | API | Ra | Giờ check-out |
| status | enum | API | Trạng thái | `ON_TIME`, `LATE`, `ABSENT`, `EXCUSED_ABSENCE` |
| lateMinutes | number | API | Phút trễ | Số phút đi trễ |
| reason | string | API | Lý do | Lý do xin nghỉ |
| distance | number | API | Khoảng cách | GPS distance (m) |

---

## Badge Trạng thái

| Status | Label | Background | Text Color |
|--------|-------|------------|------------|
| `ON_TIME` | ✅ Đúng giờ | `#DCFCE7` | `#16A34A` |
| `LATE` | ⏰ Đi trễ | `#FEF3C7` | `#D97706` |
| `ABSENT` | ❌ Vắng mặt | `#FEE2E2` | `#DC2626` |
| `EXCUSED_ABSENCE` | 🏖️ Xin nghỉ | `#DBEAFE` | `#2563EB` |

---

## Bộ lọc (Filters)

### Tổng hợp View

| Filter | Kiểu | Tùy chọn | Mặc định |
|--------|------|----------|----------|
| Kỳ | Select | Hôm nay, Tuần này, Tháng này, Khoảng ngày | Hôm nay |
| Ngày (theo ngày) | DatePicker + arrows | Calendar + ◀️/▶️ | Hôm nay |
| Tháng/Năm (theo tháng) | Select | 1-12 / 2024-2030 | Tháng hiện tại |
| Từ ngày (khoảng ngày) | DatePicker | Calendar | Đầu tháng |
| Đến ngày (khoảng ngày) | DatePicker | Calendar | Hôm nay |
| Nhân viên | Select | Tất cả + list NV | Tất cả |
| Trạng thái | Select | Tất cả, Đúng giờ, Đi trễ, Vắng mặt, Xin nghỉ | Tất cả |
| Nhóm theo (khoảng ngày) | Select | Trạng thái, Nhân viên | Trạng thái |

### Cá nhân View

| Filter | Kiểu | Tùy chọn | Mặc định |
|--------|------|----------|----------|
| Nhân viên (Admin only) | Select | List tất cả NV | NV đang xem |
| Kỳ | Tabs | Hôm nay, Tuần này, Tháng này, Tùy chỉnh | Tháng này |
| Ngày/Tuần/Tháng | DatePicker | Calendar | Current |

---

## Hành động (Actions)

### Tổng hợp

| Action | Trigger | API Call | Behavior |
|--------|---------|----------|----------|
| Chuyển kỳ | Tab/Select change | `GET /api/v1/attendance/report/daily` hoặc `/monthly` hoặc `/range` | Reload dữ liệu |
| Chuyển ngày | ◀️/▶️ click | `GET /api/v1/attendance/report/daily` | Ngày trước/sau |
| Filter nhân viên | Select change | `GET /api/v1/attendance/report/*` | Reload theo NV |
| Filter trạng thái | Select change | `GET /api/v1/attendance/report/*` | Reload theo status |
| Nhóm theo | Select change | — | Client-side regroup |
| Xem chi tiết NV | Row click | `GET /api/v1/attendance/employee/{id}` | Chuyển sang view Cá nhân |
| Xuất CSV | Button click | `GET /api/v1/attendance/export` | Download CSV |

### Cá nhân

| Action | Trigger | API Call | Behavior |
|--------|---------|----------|----------|
| Chuyển kỳ | Tab click | `GET /api/v1/attendance/my` | Reload theo kỳ |
| Chọn NV (Admin) | Select change | `GET /api/v1/attendance/employee/{userId}` | Reload data NV khác |
| Phân trang | Page click | `GET /api/v1/attendance/my` | Load trang tiếp |
| Xuất CSV | Button click | — | Download CSV |

---

## API Operations

### Tổng hợp

| Operation | Method | Endpoint | Request | Response |
|-----------|--------|----------|---------|----------|
| getDailyReport | GET | `/api/v1/attendance/report/daily` | `?date={YYYY-MM-DD}&employeeId={id}&status={s}` | `{ data: { date, records: [...], summary: {total, onTime, late, absent, excused} } }` |
| getMonthlyReport | GET | `/api/v1/attendance/report/monthly` | `?month={m}&year={y}&employeeId={id}` | `{ data: { month, year, employees: [{id, code, name, onTime, late, absent, excused}], summary } }` |
| getRangeReport | GET | `/api/v1/attendance/report/range` | `?from={date}&to={date}&employeeId={id}&status={s}&groupBy={status\|employee}` | `{ data: { from, to, groups: [...], summary } }` |
| getEmployeeAttendance | GET | `/api/v1/attendance/employee/{userId}` | `?from={date}&to={date}&page={p}&size=20` | `{ data: { employee: {...}, records: [...], summary } }` |
| exportAttendance | GET | `/api/v1/attendance/export` | `?from={date}&to={date}&format=csv` | CSV file |

### Cá nhân

| Operation | Method | Endpoint | Request | Response |
|-----------|--------|----------|---------|----------|
| getMyAttendance | GET | `/api/v1/attendance/my` | `?page={p}&size=20&from={date}&to={date}` | `{ data: { content: [...], page, size, totalElements, summary } }` |

---

## Loading State

| State | Behavior |
|-------|----------|
| Loading | Skeleton rows (5 placeholder rows) + skeleton stat cards |
| Success | Data with fade-in transition |
| Error | Error card with retry button |
| Empty | "Chưa có dữ liệu chấm công" + calendar illustration |

## Empty State

```
┌─────────────────────────────────────────┐
│                                         │
│         [Calendar Illustration]         │
│                                         │
│    "Chưa có dữ liệu chấm công"          │
│    Dữ liệu sẽ hiển thị khi nhân viên   │
│    bắt đầu chấm công                    │
│                                         │
└─────────────────────────────────────────┘
```

---

## Error Display

| Error Code | Display | Message |
|------------|---------|---------|
| UNAUTHORIZED | Redirect | → `/login` |
| FORBIDDEN | Toast | "Bạn không có quyền xem dữ liệu này" |
| NETWORK_ERROR | Error card | "Không thể tải dữ liệu. Thử lại" |
| EMPLOYEE_NOT_FOUND | Toast | "Không tìm thấy nhân viên" |

---

## Responsive Rules

| Breakpoint | Behavior |
|------------|----------|
| Mobile (≤480px) | Table → card list, filters stack vertically, stat cards 2-column |
| Tablet (481-768px) | Full table with horizontal scroll, stat cards 4-column |
| Desktop (≥769px) | Full table, all columns visible, stat cards 4-column |

### Mobile Card Layout — Tổng hợp (Admin/Manager)

**Theo ngày:**
```
┌─────────────────────────────────────┐
│  📊 Hôm nay — 10/08/2026            │
│  ◀ [10/08/2026] ▶                   │
├─────────────────────────────────────┤
│                                     │
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
│  ── Danh sách ──                    │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ NV001 — Nguyễn Văn A        │   │
│  │ 🕐 Vào: 08:00  Ra: 17:00    │   │
│  │ ✅ Đúng giờ                  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ NV002 — Trần Văn B          │   │
│  │ 🕐 Vào: 08:15  Ra: 17:00    │   │
│  │ ⏰ Đi trễ 5 phút            │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ NV003 — Lê Thị C            │   │
│  │ ❌ Vắng mặt                 │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ NV004 — Phạm Văn D          │   │
│  │ 🏖️ Xin nghỉ — Nghỉ phép năm│   │
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
│                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐       │
│  │  45  │ │  38  │ │  4   │       │
│  │Tổng  │ │✅    │ │⏰    │       │
│  └──────┘ └──────┘ └──────┘       │
│  ┌──────┐ ┌──────┐                │
│  │  3   │ │  0   │                │
│  │❌    │ │🏖️    │                │
│  └──────┘ └──────┘                │
│                                     │
│  ── Tổng hợp theo nhân viên ──     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ NV001 — Nguyễn Văn A        │   │
│  │ ✅ 22 │ ⏰ 0 │ ❌ 0 │ 🏖️ 0  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ NV002 — Trần Văn B          │   │
│  │ ✅ 18 │ ⏰ 3 │ ❌ 1 │ 🏖️ 0  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ NV003 — Lê Thị C            │   │
│  │ ✅ 20 │ ⏰ 1 │ ❌ 0 │ 🏖️ 0  │   │
│  └─────────────────────────────┘   │
│                                     │
│  [📥 Xuất CSV]                      │
│  Trang 1/3  [< prev] [next >]      │
└─────────────────────────────────────┘
```

**Khoảng ngày — Nhóm theo trạng thái:**
```
┌─────────────────────────────────────┐
│  📊 01/08 → 10/08/2026              │
│  📅 [01/08] → [10/08] [Xem]        │
│  📋 Nhóm: [Trạng thái ▼]           │
├─────────────────────────────────────┤
│                                     │
│  ── ✅ Đúng giờ (18 người) ──       │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ NV001 Nguyễn A (22 lần)     │   │
│  │ NV003 Lê C (20 lần)         │   │
│  │ NV005 Hoàng E (18 lần)      │   │
│  │ Xem thêm...                 │   │
│  └─────────────────────────────┘   │
│                                     │
│  ── ⏰ Đi trễ (4 người) ──         │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ NV002 Trần B (3 lần)        │   │
│  │ NV007 Vũ G (1 lần)          │   │
│  └─────────────────────────────┘   │
│                                     │
│  ── ❌ Vắng mặt (2 người) ──       │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ NV003 Lê C (có phép)        │   │
│  │ NV009 Hoàng I (không phép)  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ── 🏖️ Xin nghỉ (3 người) ──      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ NV004 Phạm D (Nghỉ phép năm)│   │
│  │ NV010 Đặng J (Nghỉ ốm)     │   │
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
│                                     │
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
│  ── Tháng 8/2026 ──                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📅 10/08/2026               │   │
│  │ 🕐 08:00 → 17:00            │   │
│  │ ✅ Đúng giờ                 │   │
│  │ 📏 12m                      │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📅 09/08/2026               │   │
│  │ 🕐 08:15 → 17:00            │   │
│  │ ⏰ Đi trễ 5 phút            │   │
│  │ 📏 15m                      │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📅 08/08/2026               │   │
│  │ ❌ Vắng mặt                 │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📅 07/08/2026               │   │
│  │ 🕐 07:55 → 16:58            │   │
│  │ ✅ Đúng giờ                 │   │
│  │ 📏 10m                      │   │
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
│                                     │
│  👤 [NV005 — Hoàng Văn E ▼]       │
│  (Admin/Manager thấy dropdown)      │
│                                     │
│  [Hôm nay] [Tuần] [Tháng] [Tùy]    │
│                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐       │
│  │  18  │ │  15  │ │  2   │       │
│  │Tổng  │ │✅    │ │⏰    │       │
│  └──────┘ └──────┘ └──────┘       │
│  ┌──────┐ ┌──────┐                │
│  │  1   │ │  0   │                │
│  │❌    │ │🏖️    │                │
│  └──────┘ └──────┘                │
│                                     │
│  ── Chi tiết ──                     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📅 10/08/2026               │   │
│  │ 🕐 08:00 → 17:00            │   │
│  │ ✅ Đúng giờ                 │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📅 09/08/2026               │   │
│  │ 🕐 08:20 → 17:00            │   │
│  │ ⏰ Đi trễ 10 phút           │   │
│  └─────────────────────────────┘   │
│                                     │
│  [📥 Xuất CSV]                      │
│  Trang 1/3  [< prev] [next >]      │
└─────────────────────────────────────┘
```

---

## Acceptance Criteria

### Tổng hợp View

| ID | Criterion |
|----|-----------|
| AC-SCR05-01 | View switcher (Tổng hợp/Cá nhân) works for Admin/Manager |
| AC-SCR05-02 | Tab "Theo ngày" shows all employees for selected date |
| AC-SCR05-03 | Tab "Theo tháng" shows monthly summary per employee |
| AC-SCR05-04 | Tab "Khoảng ngày" shows grouped results by status/employee |
| AC-SCR05-05 | Date navigation (◀️/▶️) changes day correctly |
| AC-SCR05-06 | Employee filter works correctly |
| AC-SCR05-07 | Status filter works correctly |
| AC-SCR05-08 | Stat cards show correct counts |
| AC-SCR05-09 | Summary bar matches table data |
| AC-SCR05-10 | CSV export downloads correct data |
| AC-SCR05-11 | Row click navigates to employee detail view |

### Cá nhân View

| ID | Criterion |
|----|-----------|
| AC-SCR05-12 | Employee dropdown visible for Admin/Manager only |
| AC-SCR05-13 | Employee view shows only selected employee's data |
| AC-SCR05-14 | Period tabs filter correctly |
| AC-SCR05-15 | Status badges colored correctly |
| AC-SCR05-16 | Pagination works with correct page count |
| AC-SCR05-17 | EMPLOYEE can only see own data (no dropdown) |
| AC-SCR05-18 | Summary row shows correct totals |

### General

| ID | Criterion |
|----|-----------|
| AC-SCR05-19 | Skeleton loader during data fetch |
| AC-SCR05-20 | Empty state when no records |
| AC-SCR05-21 | Mobile card layout on small screens |
| AC-SCR05-22 | Works at 320px minimum width |
| AC-SCR05-23 | Touch target ≥ 44px |
