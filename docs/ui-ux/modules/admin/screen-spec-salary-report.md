# SCR-08 — Báo cáo lương (`/admin/salary-report`)

## General

| Field | Value |
|-------|-------|
| Screen ID | SCR-08 |
| Screen Name | Báo cáo lương |
| Route | `/admin/salary-report` |
| Use Case | UC-07 |
| Actors | ADMIN, HR_MANAGER |
| Priority | P1 |
| Layout | App Shell with content area |

## Layout

```
┌─────────────────────────────────────────────────┐
│  Báo cáo lương              [📥 Xuất CSV] [🖨️] │
├─────────────────────────────────────────────────┤
│                                                 │
│  📅 Tháng: [08 ▼]  Năm: [2026 ▼]  [Xem]       │
│                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ 💰       │ │ 👥       │ │ 📊       │       │
│  │ 450M     │ │ 45       │ │ 10M      │       │
│  │ Tổng quỹ │ │ Nhân viên│ │ Trung bình│      │
│  └──────────┘ └──────────┘ └──────────┘       │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  Họ tên     Lương CB   Phạt     Tổng     │  │
│  │  ──────────────────────────────────────── │  │
│  │  Nguyễn A   8,000,000  200,000  7,800,000│  │
│  │  Trần B     5,000,000  100,000  4,900,000│  │
│  │  Lê C       3,000,000   50,000  2,950,000│  │
│  │                                         │  │
│  │  ──────────────────────────────────────── │  │
│  │  TỔNG CỘNG            450,000,000       │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Fields

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| month | select | User | Tháng (1-12) |
| year | select | User | Năm |
| totalFund | number | API | Tổng quỹ lương |
| employeeCount | number | API | Số nhân viên |
| averageSalary | number | API | Lương trung bình |
| employees | list | API | Danh sách lương chi tiết |

## Filters

| Filter | Type | Options | Default |
|--------|------|---------|---------|
| Tháng | Select | 1-12 | Current month |
| Năm | Select | 2024-2030 | Current year |

## Actions

| Action | Trigger | API Call | Behavior |
|--------|---------|----------|----------|
| Xem báo cáo | Button click / filter change | `GET /api/v1/reports/salary` | Load salary report |
| Xuất CSV | Button click | — | Download CSV file |
| In báo cáo | Button click | — | Print dialog |
| Sort columns | Column header click | — | Client-side sort |

## API Operations

| Operation | Method | Endpoint | Request | Response |
|-----------|--------|----------|---------|----------|
| getSalaryReport | GET | `/api/v1/reports/salary` | `?month={m}&year={y}` | `{ data: { month, year, employees: [...] } }` |

## Loading State

| State | Behavior |
|-------|----------|
| Loading | Skeleton rows + stat cards |
| Success | Data with transition |
| Error | Error card with retry |
| Empty | "Chưa có dữ liệu lương cho tháng này" |

## Empty State

```
┌─────────────────────────────────────────┐
│                                         │
│         [Money Illustration]            │
│                                         │
│    "Chưa có dữ liệu lương"              │
│    Dữ liệu sẽ hiển thị khi có          │
│    dữ liệu chấm công trong tháng       │
│                                         │
└─────────────────────────────────────────┘
```

## Error Display

| Error Code | Display | Message |
|------------|---------|---------|
| NO_DATA | Empty state | "Chưa có dữ liệu lương cho tháng này" |
| UNAUTHORIZED | Redirect | → `/login` |
| NETWORK_ERROR | Error card | "Không thể tải báo cáo. Thử lại" |

## Responsive Rules

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Stat cards 2-column, table → card list, modals full-screen |
| Tablet | Stat cards 3-column, full table, modals centered |
| Desktop | Stat cards 3-column, full table with print layout, modals centered |

### Mobile Layout Chi tiết — Admin/Manager

```
┌─────────────────────────────────────┐
│  💰 Báo cáo lương                  │
├─────────────────────────────────────┤
│                                     │
│  📅 Tháng: [08 ▼]  Năm: [2026 ▼]  │
│                                     │
│  ┌──────┐ ┌──────┐ ┌──────┐       │
│  │  45  │ │ 380M │ │ 12M  │       │
│  │NV    │ │Tổng  │ │Phạt  │       │
│  └──────┘ └──────┘ └──────┘       │
│  ┌──────┐                          │
│  │  25M │                          │
│  │Thưởng│                          │
│  └──────┘                          │
│                                     │
│  ── Danh sách lương ──              │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ NV001 — Nguyễn Văn A        │   │
│  │ 📋 NV / Kỹ sư              │   │
│  │ 💰 Lương CB: 8,000,000      │   │
│  │ 📈 +KN: +800,000 (10%)     │   │
│  │ 🏆 Thưởng: +2,000,000       │   │
│  │ ⚠️ Phạt: -50,000           │   │
│  │ ═══════════════════════════│   │
│  │ 🧮 Thực nhận: 10,750,000    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ NV002 — Trần Văn B          │   │
│  │ 📋 QL / Quản lý             │   │
│  │ 💰 Lương CB: 15,000,000     │   │
│  │ 📈 +KN: +2,250,000 (15%)   │   │
│  │ 🏆 Thưởng: +3,000,000       │   │
│  │ ⚠️ Phạt: -150,000          │   │
│  │ ═══════════════════════════│   │
│  │ 🧮 Thực nhận: 20,100,000    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ NV003 — Lê Thị C            │   │
│  │ 📋 NV / Kế toán             │   │
│  │ 💰 Lương CB: 10,000,000     │   │
│  │ 📈 +KN: +1,500,000 (15%)   │   │
│  │ 🏆 Thưởng: +0               │   │
│  │ ⚠️ Phạt: -0                 │   │
│  │ ═══════════════════════════│   │
│  │ 🧮 Thực nhận: 11,500,000    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ── Tổng kết ──                     │
│  ┌─────────────────────────────┐   │
│  │ 🧮 Tổng lương: 380,000,000  │   │
│  │ 📥 [Xuất CSV]  🖨️ [In]     │   │
│  └─────────────────────────────┘   │
│                                     │
│  Trang 1/3  [< prev] [next >]      │
└─────────────────────────────────────┘
```

### Mobile Layout Chi tiết — Employee tự xem

```
┌─────────────────────────────────────┐
│  💰 Lương của tôi                   │
├─────────────────────────────────────┤
│                                     │
│  📅 Tháng: [08 ▼]  Năm: [2026 ▼]  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📋 Nguyễn Văn A (NV001)    │   │
│  │ 🏢 Kỹ sư                   │   │
│  │ 💼 3 năm kinh nghiệm        │   │
│  └─────────────────────────────┘   │
│                                     │
│  ── Chi tiết lương ──               │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 💰 Lương cơ bản             │   │
│  │                    8,000,000│   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📈 Phụ cấp kinh nghiệm     │   │
│  │ 3 năm (+10%)        +800,000│   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🏆 Thưởng hiệu quả          │   │
│  │                    +2,000,000│   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ⚠️ Phạt đi trễ              │   │
│  │ 1 lần (5 phút)       -50,000│   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ═══════════════════════════ │   │
│  │ 🧮 Lương thực nhận          │   │
│  │                   10,750,000│   │
│  └─────────────────────────────┘   │
│                                     │
│  ── Bảng chấm công tháng ──        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ✅ Đúng giờ:     20 ngày    │   │
│  │ ⏰ Đi trễ:        2 ngày    │   │
│  │ ❌ Vắng mặt:      0 ngày    │   │
│  │ 🏖️ Xin nghỉ:     0 ngày    │   │
│  └─────────────────────────────┘   │
│                                     │
│  📥 [Xuất phiếu lương]             │
│                                     │
└─────────────────────────────────────┘
```

### Mobile Touch Targets

| Element | Min Size | Notes |
|---------|----------|-------|
| Month/Year dropdown | 44×44px | Trigger area |
| Export button | 44×44px | Bottom fixed or inline |
| Print button | 44×44px | Desktop only |
| Card tap | Full card width | Expand to see details |
| Pagination | 44×44px | Previous/Next buttons |

### Mobile Card Animation

| Element | Animation | Duration |
|---------|-----------|----------|
| Salary card | Fade-in + slide up | 0.3s |
| Stat cards | Stagger fade-in | 0.1s delay each |
| Expand details | Slide down | 0.2s |

## Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-SCR08-01 | Default shows current month report |
| AC-SCR08-02 | Month/year filter loads correct data |
| AC-SCR08-03 | Stat cards show accurate totals |
| AC-SCR08-04 | Employee list shows all with correct salary calculation |
| AC-SCR08-05 | Total row matches sum of individual salaries |
| AC-SCR08-06 | CSV export downloads correct data |
| AC-SCR08-07 | Print opens browser print dialog |
| AC-SCR08-08 | Sort by column works |
| AC-SCR08-09 | Empty state for months with no data |
| AC-SCR08-10 | Touch target ≥ 44px |
| AC-SCR08-11 | Works at 320px minimum width |
