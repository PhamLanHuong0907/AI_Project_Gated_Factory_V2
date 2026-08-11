# Stitch Prompt: SCR-02 — Dashboard

## Screen Identity

| Field | Value |
|-------|-------|
| Screen ID | SCR-02 |
| Screen Name | Dashboard Tổng quan |
| Route | `/` |
| Use Case | UC-08 |
| Actors | ADMIN, HR_MANAGER |
| Layout | App Shell with content area |

## User Role & Goal

ADMIN and HR_MANAGER see an overview of today's attendance statistics, a weekly attendance chart, and recent activity. Quick actions allow navigating to QR generation or salary reports.

## GLOBAL APP SHELL LOCK

> This screen uses the approved App Shell. DO NOT modify the shell. Only design the content area below the top bar / sidebar.

## Layout

```
┌─────────────────────────────────────────────────┐
│  Dashboard          [Tuần này ▼]   [📅 Filter]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ 👥       │ │ ✅       │ │ ⏰       │       │
│  │ 45       │ │ 38       │ │ 5        │       │
│  │ Nhân viên│ │ Đúng giờ │ │ Đi trễ   │       │
│  └──────────┘ └──────────┘ └──────────┘       │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  Biểu đồ chấm công                       │  │
│  │  [Bar chart: T2-T6 attendance]           │  │
│  └──────────────────────────────────────────┘  │
│                                                 │
│  ┌──────────────────────────────────────────┐  │
│  │  Hoạt động gần đây                       │  │
│  │  ┌─────┬──────┬──────┬──────┬────────┐  │  │
│  │  │Tên  │Giờ vào│Giờ ra│Trạng thái│     │  │  │
│  │  ├─────┼──────┼──────┼──────┼────────┤  │  │
│  │  │ANV  │08:00 │17:00 │✅    │        │  │  │
│  │  │BHC  │08:15 │17:00 │⏰    │        │  │  │
│  │  └─────┴──────┴──────┴──────┴────────┘  │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Fields

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| totalEmployees | number | API | Tổng số nhân viên |
| onTimeCount | number | API | Số nhân viên đúng giờ |
| lateCount | number | API | Số nhân viên đi trễ |
| absentCount | number | API | Số nhân viên vắng mặt |
| weeklyChart | chart data | API | Biểu đồ chấm công tuần (bar chart T2-T6) |
| recentActivity | list | API | 10 hoạt động gần nhất |

## Stat Cards

| Card | Icon | Color | Value Source |
|------|------|-------|-------------|
| Nhân viên | 👥 | Primary `#2563EB` | `totalEmployees` |
| Đúng giờ | ✅ | Success `#16A34A` | `onTimeCount` |
| Đi trễ | ⏰ | Warning `#D97706` | `lateCount` |

Each card: `--color-surface` background, `--shadow-sm`, `--radius-md`, padding 16px.

## Chart

- **Type**: Bar chart (vertical bars)
- **X-axis**: T2, T3, T4, T5, T6 (Mon-Fri)
- **Y-axis**: Number of employees
- **Colors**: Success `#16A34A` for on-time, Warning `#D97706` for late
- **Height**: 200px on mobile, 300px on desktop

## Recent Activity Table

| Column | Width | Description |
|--------|-------|-------------|
| Tên | 30% | Employee name |
| Giờ vào | 20% | Check-in time |
| Giờ ra | 20% | Check-out time |
| Trạng thái | 15% | Badge: ✅ Đúng giờ / ⏰ Đi trễ / ❌ Vắng |
| Ca | 15% | Shift name |

## Actions

| Action | Trigger | API Call | Behavior |
|--------|---------|----------|----------|
| Change period | Dropdown select | `GET /api/v1/reports/monthly` | Reload data for selected period |
| Filter by date | Date picker | `GET /api/v1/attendance/report` | Filter data by date range |
| Quick action: Tạo QR | Button click | — | Navigate to `/qr/generate` |
| Quick action: Báo cáo | Button click | — | Navigate to `/admin/salary-report` |

## API Operations

| Operation | Method | Endpoint | Request | Response |
|-----------|--------|----------|---------|----------|
| getMonthlyReport | GET | `/api/v1/reports/monthly` | `?month={m}&year={y}` | `{ data: { employees: [...] } }` |
| getAttendance | GET | `GET /api/v1/attendance/my` | `?page=0&size=10` | `{ data: { content: [...] } }` |

## Loading State

| State | Behavior |
|-------|----------|
| Loading | Skeleton loaders on stat cards (3 rectangles) and table (5 rows) |
| Success | Data with fade-in transition |
| Error | Error card with retry button |
| Empty | "Chưa có dữ liệu chấm công" with calendar illustration |

## Responsive Rules

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Stat cards: 2-column grid, chart full-width, table horizontally scrollable |
| Tablet | Stat cards: 3-column grid, chart + table stacked |
| Desktop | Stat cards: 3-column grid, chart + table in 2-column grid |

## Forbidden

- DO NOT add new stat cards beyond the 3 specified
- DO NOT change the chart type (must be bar chart)
- DO NOT add real-time WebSocket updates
- DO NOT add export functionality on this screen
- DO NOT add employee list/detail navigation

## Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-SCR02-01 | Stat cards show correct counts from API |
| AC-SCR02-02 | Period filter (Hôm nay/Tuần/Tháng) works correctly |
| AC-SCR02-03 | Chart renders with attendance data |
| AC-SCR02-04 | Recent activity table shows last 10 entries |
| AC-SCR02-05 | Skeleton loader shows during data fetch |
| AC-SCR02-06 | Empty state shown when no data available |
| AC-SCR02-07 | Quick action buttons navigate to correct screens |
| AC-SCR02-08 | Data refreshes when period changes |
| AC-SCR02-09 | Responsive layout adapts to screen size |
