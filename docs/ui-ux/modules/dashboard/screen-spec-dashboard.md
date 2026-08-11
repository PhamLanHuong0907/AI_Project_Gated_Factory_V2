# SCR-02 — Dashboard (`/`)

## General

| Field | Value |
|-------|-------|
| Screen ID | SCR-02 |
| Screen Name | Dashboard |
| Route | `/` |
| Use Case | UC-08 |
| Actors | ADMIN, HR_MANAGER |
| Priority | P1 |
| Layout | App Shell with content area |

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
│  │  │...  │      │      │      │        │  │  │
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
| weeklyChart | chart data | API | Biểu đồ chấm công tuần |
| recentActivity | list | API | 10 hoạt động gần nhất |

## Actions

| Action | Trigger | API Call | Behavior |
|--------|---------|----------|----------|
| Change period | Tab click | `GET /api/v1/attendance/report` | Reload data for selected period |
| Filter by date | Date picker | `GET /api/v1/attendance/report` | Filter data by date range |
| View employee detail | Row click | — | Navigate to attendance detail |
| Quick action: Tạo QR | Button click | — | Navigate to `/qr/generate` |
| Quick action: Báo cáo | Button click | — | Navigate to `/admin/salary-report` |

## API Operations

| Operation | Method | Endpoint | Request | Response |
|-----------|--------|----------|---------|----------|
| getMonthlyReport | GET | `/api/v1/reports/monthly` | `?month={m}&year={y}` | `{ data: { employees: [...] } }` |
| getAttendance | GET | `/api/v1/attendance/my` | `?page=0&size=10` | `{ data: { content: [...] } }` |

## Loading State

| State | Behavior |
|-------|----------|
| Loading | Skeleton loaders on stat cards and table |
| Success | Render data with transition animation |
| Error | Error card with retry button |
| Empty | "Chưa có dữ liệu chấm công" with illustration |

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

## Error Display

| Error Code | Display | Message |
|------------|---------|---------|
| NETWORK_ERROR | Error card | "Không thể tải dữ liệu. Thử lại" |
| UNAUTHORIZED | Redirect | → `/login` |

## Responsive Rules

| Breakpoint | Behavior |
|------------|----------|
| Mobile | 2-column stat cards, chart full-width, table scrollable |
| Tablet | 3-column stat cards, chart + table side-by-side |
| Desktop | 4-column stat cards, chart + table in grid layout |

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
