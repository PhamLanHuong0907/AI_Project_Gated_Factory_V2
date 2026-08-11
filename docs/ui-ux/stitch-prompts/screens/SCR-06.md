# Stitch Prompt: SCR-06 — Quản lý ca làm việc (CRUD TIÊU BIỂU)

## Screen Identity

| Field | Value |
|-------|-------|
| Screen ID | SCR-06 |
| Screen Name | Quản lý ca làm việc |
| Route | `/admin/shifts` |
| Use Case | UC-05 |
| Actors | ADMIN |
| Layout | App Shell with content area |
| Pattern | **CRUD List + Create/Edit Modal** — represents the standard CRUD pattern for all admin screens |

## User Role & Goal

ADMIN manages work shifts (ca làm việc): view list, create new, edit, delete, toggle active/inactive.

## GLOBAL APP SHELL LOCK

> This screen uses the approved App Shell. DO NOT modify the shell. Only design the content area.

## Layout — List View

```
┌─────────────────────────────────────────────────┐
│  Quản lý ca làm việc           [+ Thêm ca mới] │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  Tên ca      Giờ vào  Giờ ra   Trạng thái│  │
│  │  ─────────────────────────────────────── │  │
│  │  Ca sáng      08:00   17:00    ✅        │  │
│  │  Ca chiều     13:00   22:00    ✅        │  │
│  │  Ca đêm       22:00   06:00    ❌        │  │
│  │                                         │  │
│  │  [✏️ Sửa]  [🗑️ Xoá]                    │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Layout — Create/Edit Modal

```
┌─────────────────────────────────────┐
│  Thêm ca làm việc            [X]   │
├─────────────────────────────────────┤
│                                     │
│  Tên ca *                           │
│  ┌─────────────────────────────┐   │
│  │ Ca sáng                      │   │
│  └─────────────────────────────┘   │
│                                     │
│  Giờ bắt đầu *    Giờ kết thúc *  │
│  ┌──────────┐     ┌──────────┐     │
│  │ 08:00    │     │ 17:00    │     │
│  └──────────┘     └──────────┘     │
│                                     │
│  Thời gian chờ (phút)              │
│  ┌─────────────────────────────┐   │
│  │ 15                           │   │
│  └─────────────────────────────┘   │
│                                     │
│  Ngày làm việc *                    │
│  [✓T2] [✓T3] [✓T4] [✓T5] [✓T6] [ ]CN │
│                                     │
│  [Huỷ]              [Lưu]          │
└─────────────────────────────────────┘
```

## Table Columns

| Column | Width | Sortable | Description |
|--------|-------|----------|-------------|
| Tên ca | 30% | Yes | Shift name |
| Giờ vào | 20% | Yes | Start time (HH:mm) |
| Giờ ra | 20% | Yes | End time (HH:mm) |
| Trạng thái | 15% | Yes | Active/Inactive badge |
| Thao tác | 15% | No | Edit/Delete/Toggle buttons |

## Status Badge

| Status | Label | Background | Text Color |
|--------|-------|------------|------------|
| Active | ✅ | `#DCFCE7` | `#16A34A` |
| Inactive | ❌ | `#FEE2E2` | `#DC2626` |

## Fields

| Field | Type | Required | Validation | Default |
|-------|------|----------|------------|---------|
| name | text | Yes | Max 50 chars | — |
| startTime | time | Yes | Valid time format (HH:mm) | — |
| endTime | time | Yes | Valid time format (HH:mm) | — |
| gracePeriod | number | No | 5–15 minutes | 15 |
| workDays | checkboxes | Yes | At least 1 day selected | T2-T6 |
| isActive | boolean | No | — | true |

## Work Days Checkboxes

```
[✓T2] [✓T3] [✓T4] [✓T5] [✓T6] [ ]CN
```

- Each checkbox: 44×44px touch target
- Selected: primary color background
- Unselected: border only

## Actions

| Action | Trigger | Component | API Call | Behavior |
|--------|---------|-----------|----------|----------|
| Thêm ca mới | Button click | Primary Button | — | Open create modal |
| Lưu ca (create) | Modal save | Primary Button | `POST /api/v1/shifts` | Create new shift |
| Sửa ca | Row action | IconButton (edit) | — | Open edit modal with pre-filled data |
| Lưu ca (update) | Modal save | Primary Button | `PUT /api/v1/shifts/{id}` | Update shift |
| Xoá ca | Row action | IconButton (delete) | — | Show confirmation dialog |
| Xác nhận xoá | Dialog confirm | Danger Button | `DELETE /api/v1/shifts/{id}` | Delete shift |
| Toggle active | Row action | Toggle switch | `PUT /api/v1/shifts/{id}` | Toggle isActive |

## Confirmation Dialog (Delete)

```
┌─────────────────────────────────────┐
│  Xoá ca làm việc?                   │
│                                     │
│  Bạn có chắc chắn muốn xoá         │
│  ca "[shift name]"?                 │
│  Hành động này không thể hoàn tác.  │
│                                     │
│  [Huỷ]              [Xoá]          │
└─────────────────────────────────────┘
```

## API Operations

| Operation | Method | Endpoint | Request | Response |
|-----------|--------|----------|---------|----------|
| getShifts | GET | `/api/v1/shifts` | — | `[{ id, name, startTime, endTime, gracePeriod, workDays, isActive }]` |
| createShift | POST | `/api/v1/shifts` | `{ name, startTime, endTime, gracePeriod, workDays }` | `{ id, name, ... }` |
| updateShift | PUT | `/api/v1/shifts/{id}` | `{ name, startTime, endTime, gracePeriod, workDays }` | `{ id, name, ... }` |
| deleteShift | DELETE | `/api/v1/shifts/{id}` | — | 204 |

## Loading State

| State | Behavior |
|-------|----------|
| Loading | Skeleton rows (3 placeholder rows) |
| Success | Table with fade-in |
| Error | Error card with retry |
| Empty | "Chưa có ca làm việc nào" + clock illustration + [+ Thêm ca mới] button |

## Validation Rules

| Rule | Message |
|------|---------|
| endTime > startTime | "Giờ kết thúc phải sau giờ bắt đầu" |
| Overlapping shifts | "Ca bị trùng giờ với ca khác" |
| Name required | "Tên ca không được để trống" |
| Name unique | "Tên ca đã tồn tại" |
| At least 1 work day | "Phải chọn ít nhất 1 ngày làm việc" |

## Responsive Rules

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Table → card list, modal full-screen |
| Tablet | Full table, modal centered (max-width 480px) |
| Desktop | Full table with all columns, modal centered |

## Forbidden

- DO NOT add shift assignment to employees on this screen
- DO OT add shift schedule/calendar view
- DO NOT add shift copy/duplicate
- DO NOT add bulk delete
- DO NOT add shift import/export

## Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-SCR06-01 | List shows all shifts with correct data |
| AC-SCR06-02 | Create modal opens with empty form |
| AC-SCR06-03 | Edit modal opens with pre-filled data |
| AC-SCR06-04 | Form validates required fields |
| AC-SCR06-05 | Grace period limited to 5-15 minutes |
| AC-SCR06-06 | Work days selection requires at least 1 day |
| AC-SCR06-07 | Delete shows confirmation dialog |
| AC-SCR06-08 | Toggle active/inactive works |
| AC-SCR06-09 | Overlapping time validation |
| AC-SCR06-10 | Touch target ≥ 44px |
| AC-SCR06-11 | Unsaved changes warning on navigate |
| AC-SCR06-12 | Works at 320px minimum width |
