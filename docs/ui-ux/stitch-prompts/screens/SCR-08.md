# Stitch Prompt: SCR-08 — Báo cáo lương

## Screen Identity

| Field | Value |
|-------|-------|
| Screen ID | SCR-08 |
| Screen Name | Báo cáo lương |
| Route | `/admin/salary-report` |
| Use Case | UC-07 |
| Actors | ADMIN, HR_MANAGER |
| Layout | App Shell with content area |

## User Role & Goal

ADMIN and HR_MANAGER view monthly salary reports with summary stats and detailed employee salary breakdown. Export to CSV and print.

## GLOBAL APP SHELL LOCK

> This screen uses the approved App Shell. DO NOT modify the shell. Only design the content area.

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

## Filters

| Filter | Type | Options | Default |
|--------|------|---------|---------|
| Tháng | Select | 1-12 | Current month |
| Năm | Select | 2024-2030 | Current year |

## Stat Cards

| Card | Icon | Color | Value Source |
|------|------|-------|-------------|
| Tổng quỹ | 💰 | Primary `#2563EB` | Sum of all salaries |
| Nhân viên | 👥 | Success `#16A34A` | Employee count |
| Trung bình | 📊 | Warning `#D97706` | Average salary |

## Table Columns

| Column | Width | Sortable | Description |
|--------|-------|----------|-------------|
| Họ tên | 30% | Yes | Employee name |
| Lương CB | 20% | Yes | Base salary (VND) |
| Phạt | 20% | Yes | Total penalties (VND) |
| Tổng | 30% | Yes | Net salary (VND) |

## Summary Row

```
─────────────────────────────────────────
TỔNG CỘNG            450,000,000
```

- Background: `--color-surface` (#F8FAFC)
- Font: text-sm, font-weight 700
- Border-top: 2px solid `--color-border`

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
| getSalaryReport | GET | `/api/v1/reports/salary` | `?month={m}&year={y}` | `{ data: { month, year, employees: [{ name, baseSalary, penalties, total }] } }` |

## Loading State

| State | Behavior |
|-------|----------|
| Loading | Skeleton rows + stat cards |
| Success | Data with transition |
| Error | Error card with retry |
| Empty | "Chưa có dữ liệu lương cho tháng này" with money illustration |

## Responsive Rules

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Stat cards: 2-column, table → card list, modals full-screen |
| Tablet | Stat cards: 3-column, full table, modals centered |
| Desktop | Stat cards: 3-column, full table with print layout, modals centered |

### Mobile Layout — Admin/Manager

```
┌─────────────────────────────────────┐
│  💰 Báo cáo lương                  │
├─────────────────────────────────────┤
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
│  ┌─────────────────────────────┐   │
│  │ NV001 — Nguyễn Văn A        │   │
│  │ 📋 NV / Kỹ sư              │   │
│  │ 💰 CB: 8,000,000            │   │
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
│  │ 💰 CB: 15,000,000           │   │
│  │ 📈 +KN: +2,250,000 (15%)   │   │
│  │ 🏆 Thưởng: +3,000,000       │   │
│  │ ⚠️ Phạt: -150,000          │   │
│  │ ═══════════════════════════│   │
│  │ 🧮 Thực nhận: 20,100,000    │   │
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

### Mobile Layout — Employee tự xem

```
┌─────────────────────────────────────┐
│  💰 Lương của tôi                   │
├─────────────────────────────────────┤
│  📅 Tháng: [08 ▼]  Năm: [2026 ▼]  │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 📋 Nguyễn Văn A (NV001)    │   │
│  │ 🏢 Kỹ sư │ 💼 3 năm KN     │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 💰 Lương cơ bản    8,000,000│   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 📈 KN 3 năm (+10%)  +800,000│   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 🏆 Thưởng hiệu quả +2,000,000│   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ ⚠️ Phạt trễ 1 lần   -50,000│   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ ═══════════════════════════ │   │
│  │ 🧮 Thực nhận:  10,750,000   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ── Bảng chấm công tháng ──        │
│  ┌─────────────────────────────┐   │
│  │ ✅ Đúng giờ: 20 │ ⏰ Trễ: 2 │   │
│  │ ❌ Vắng: 0 │ 🏖️ Nghỉ: 0    │   │
│  └─────────────────────────────┘   │
│                                     │
│  📥 [Xuất phiếu lương]             │
└─────────────────────────────────────┘
```

## Forbidden

- DO NOT add salary comparison between months
- DO NOT add charts/graphs on this screen
- DO NOT add individual employee salary detail view
- DO NOT add salary approval workflow
- DO NOT add email sending functionality

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
