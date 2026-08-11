# Stitch Prompt: SCR-12 — Duyệt đơn xin nghỉ (Admin/HR)

## Screen Identity

| Field | Value |
|-------|-------|
| Screen ID | SCR-12 |
| Screen Name | Duyệt đơn xin nghỉ làm |
| Route | `/admin/leave-requests` |
| Use Case | UC-12: Duyệt đơn xin nghỉ làm |
| Actors | ADMIN, HR_MANAGER |
| Layout | App Shell with content area |

## User Role & Goal

ADMIN/HR_MANAGER reviews and processes employee leave requests: view all requests, approve (auto-creates attendance record), reject with reason.

## GLOBAL APP SHELL LOCK

> This screen uses the approved App Shell. DO NOT modify the shell. Only design the content area.

## Layout — Desktop Table View

```
┌─────────────────────────────────────────────────────────────────────────┐
│  📋 Duyệt đơn xin nghỉ                                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [Tất cả (12)] [⏳ Chờ (5)] [✅ Đã duyệt (5)] [❌ Từ chối (2)]        │
│                                                                         │
│  [👤 Nhân viên ▼]  [📅 Từ: ___]  [Đến: ___]  [🔍 Tìm...]              │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  │ ID │ Nhân viên   │ Ngày nghỉ  │ Trạng thái   │ File │ Tác vụ │  │
│  │  ─────────────────────────────────────────────────────────────── │  │
│  │  │ 12 │ Nguyễn A    │ 12/08/2026  │ ⏳ Chờ        │ 2    │ 👁️ ✅❌ │  │
│  │  │ 11 │ Trần B      │ 12/08/2026  │ ⏳ Chờ        │ 0    │ 👁️ ✅❌ │  │
│  │  │ 10 │ Lê C        │ 11/08/2026  │ ⏳ Chờ        │ 1    │ 👁️ ✅❌ │  │
│  │  │  9 │ Phạm D      │ 10/08/2026  │ ✅ Duyệt      │ 3    │ 👁️     │  │
│  │  │  8 │ Hoàng E     │ 09/08/2026  │ ❌ Từ chối    │ 1    │ 👁️     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  Trang 1/3  [< prev] [next >]                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Layout — Mobile Card List

```
┌─────────────────────────────────────┐
│ ◀ Duyệt đơn xin nghỉ               │
├─────────────────────────────────────┤
│ [Tất cả] [⏳ Chờ] [✅] [❌]        │
├─────────────────────────────────────┤
│ 🔍 Tìm kiếm...                      │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Nguyễn A — 12/08/2026          │ │
│ │ Lý do: Nhà có việc gia đình    │ │
│ │ 📎 2 file                       │ │
│ │ [👁️] [✅ Duyệt] [❌ Từ chối]   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Trần B — 12/08/2026            │ │
│ │ Lý do: Đi đám cưới             │ │
│ │ [👁️] [✅ Duyệt] [❌ Từ chối]   │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

## Layout — Detail Modal (Desktop)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Chi tiết đơn xin nghỉ                                          [✕]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Trạng thái: ⏳ Chờ duyệt                                              │
│                                                                         │
│  👤 Nhân viên: Nguyễn Văn A (NV001)                                   │
│  📅 Ngày: 12/08/2026 (Thứ Ba)                                         │
│  📝 Lý do: Nhà có việc gia đình phải về quê gấp.                     │
│                                                                         │
│  📎 File đính kèm:                                                     │
│  🖼️ [Xem] anh-minhchung.jpg   2.1 MB                                  │
│  📄 [Xem] giaykhambenh.pdf    1.3 MB                                  │
│                                                                         │
│  ────────────────────────────────────────────────────────────────────  │
│  📋 Xử lý: Người duyệt: — | Thời gian: — | Lý do từ chối: —         │
│  Tạo lúc: 10/08/2026 14:30                                             │
│                                                                         │
│                              [❌ Từ chối]  [✅ Duyệt đơn]               │
└─────────────────────────────────────────────────────────────────────────┘
```

## Layout — Approve Confirmation (Desktop Dialog)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ✅ Duyệt đơn xin nghỉ                                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Duyệt đơn của Nguyễn Văn A ngày 12/08/2026?                          │
│                                                                         │
│  ⚠️ Hệ thống sẽ tự động cập nhật lịch sử chấm công                   │
│  với trạng thái "Xin nghỉ" cho ngày này.                               │
│                                                                         │
│  📝 Ghi chú (tùy chọn):                                                │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                                                                │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│                              [Hủy]  [✅ Xác nhận duyệt]                │
└─────────────────────────────────────────────────────────────────────────┘
```

## Layout — Reject Modal (Desktop Dialog)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ❌ Từ chối đơn xin nghỉ                                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Từ chối đơn của Nguyễn Văn A ngày 12/08/2026?                        │
│                                                                         │
│  📝 Lý do từ chối *                                                    │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ Nhập lý do từ chối...                                         │    │
│  └────────────────────────────────────────────────────────────────┘    │
│  Tối thiểu 5 ký tự                                                     │
│                                                                         │
│                              [Hủy]  [❌ Xác nhận từ chối]              │
└─────────────────────────────────────────────────────────────────────────┘
```

## Table Columns (Desktop)

| Column | Width | Sortable | Description |
|--------|-------|----------|-------------|
| ID | 60px | Yes | `id` |
| Nhân viên | 150px | Yes | `userName` |
| Ngày nghỉ | 120px | Yes | `leaveDate` — DD/MM/YYYY |
| Trạng thái | 120px | Yes | Badge: ⏳ / ✅ / ❌ |
| File | 80px | No | Attachment count |
| Tác vụ | 120px | No | View/Approve/Reject buttons |

## Status Badges

| Status | Badge | Color |
|--------|-------|-------|
| PENDING | ⏳ Chờ duyệt | Yellow (`#D97706`) |
| APPROVED | ✅ Đã duyệt | Green (`#16A34A`) |
| REJECTED | ❌ Từ chối | Red (`#DC2626`) |

## Actions

| Action | Trigger | API | Behavior |
|--------|---------|-----|----------|
| View detail | GET `/leave-requests/{id}` | — | Open detail modal |
| Approve | POST `/leave-requests/{id}/approve` | `{ note? }` | Auto-create attendance XIN_NGHI |
| Reject | POST `/leave-requests/{id}/reject` | `{ rejectReason }` | Required rejectReason |

## Toast Notifications

| Action | Icon | Color | Message |
|--------|------|-------|---------|
| Approve success | ✅ | Green | "Đã duyệt đơn. Lịch sử chấm công đã cập nhật" |
| Reject success | ✅ | Green | "Đã từ chối đơn xin nghỉ" |
| Approve error | ❌ | Red | "Không thể duyệt đơn. Vui lòng thử lại" |
| Reject error | ❌ | Red | "Không thể từ chối đơn. Vui lòng thử lại" |
| Already processed | ⚠️ | Yellow | "Đơn đã được xử lý bởi người khác" |

## Responsive

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Card list, bottom sheet reject, full-screen detail |
| Tablet | Condensed table, modal dialogs |
| Desktop | Full table, centered modals |

## Forbidden

DO NOT:
- Add navigation items
- Modify App Shell
- Add real-time/WebSocket
- Add social login
- Change color scheme

## Acceptance Criteria

- AC-SCR12-01: ADMIN/HR xem danh sách tất cả đơn
- AC-SCR12-02: Lọc theo trạng thái, nhân viên, khoảng ngày
- AC-SCR12-03: Tìm kiếm theo tên NV hoặc lý do
- AC-SCR12-04: Xem chi tiết + file đính kèm
- AC-SCR12-05: Duyệt → tự tạo attendance XIN_NGHI
- AC-SCR12-06: Từ chối → nhập lý do (≥ 5 ký tự)
- AC-SCR12-07: Toast mọi thao tác
- AC-SCR12-08: Cảnh báo đơn đã xử lý
- AC-SCR12-09: HR_MANAGER có quyền duyệt
- AC-SCR12-10: Responsive mobile/desktop
