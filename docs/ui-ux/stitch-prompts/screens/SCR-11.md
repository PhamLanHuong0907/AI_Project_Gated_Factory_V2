# Stitch Prompt: SCR-11 — Đơn xin nghỉ (Nhân viên)

## Screen Identity

| Field | Value |
|-------|-------|
| Screen ID | SCR-11 |
| Screen Name | Đơn xin nghỉ làm — Nhân viên |
| Route | `/my/leave-requests` |
| Use Case | UC-11: Gửi đơn xin nghỉ làm |
| Actors | EMPLOYEE |
| Layout | Mobile-first card list + Create modal |

## User Role & Goal

EMPLOYEE creates and manages leave requests: view own requests, create new with file attachments, edit/cancel pending requests, view approval status and rejection reasons.

## GLOBAL APP SHELL LOCK

> This screen uses the approved App Shell. DO NOT modify the shell. Only design the content area.

## Layout — Mobile Card List

```
┌─────────────────────────────────────┐
│ ◀ Đơn từ của tôi        [+ Tạo đơn]│
├─────────────────────────────────────┤
│ [Tất cả] [⏳ Chờ] [✅ Duyệt] [❌]  │
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📅 12/08/2026    ⏳ Chờ duyệt   │ │
│ │ Lý do: Nhà có việc gia đình    │ │
│ │ 📎 2 file                       │ │
│ │ ─────────────────────────────── │ │
│ │ [✏️ Sửa]  [🗑️ Hủy]            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📅 05/08/2026    ✅ Đã duyệt    │ │
│ │ Lý do: Đi khám bệnh            │ │
│ │ 📎 1 file                       │ │
│ │ ─────────────────────────────── │ │
│ │ Duyệt bởi: Quản lý A          │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📅 01/08/2026    ❌ Từ chối     │ │
│ │ Lý do: Nghỉ phép năm          │ │
│ │ ─────────────────────────────── │ │
│ │ Lý do từ chối: Đơn gấp...     │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

## Layout — Create Modal (Mobile Full-screen)

```
┌─────────────────────────────────────┐
│ ◀ Tạo đơn xin nghỉ                 │
├─────────────────────────────────────┤
│                                     │
│  📅 Ngày xin nghỉ *               │
│  ┌─────────────────────────────────┐│
│  │ [📅 Chọn ngày]                 ││
│  └─────────────────────────────────┘│
│                                     │
│  📝 Lýdo *                         │
│  ┌─────────────────────────────────┐│
│  │ Nhập lý do xin nghỉ...        ││
│  └─────────────────────────────────┘│
│  Tối thiểu 10 ký tự                │
│                                     │
│  📎 File đính kèm (tối đa 3)       │
│  ┌─────────────────────────────────┐│
│  │ [📎 Chọn file] JPG, PNG, PDF   ││
│  └─────────────────────────────────┘│
│                                     │
│  🖼️ anh-minhchung.jpg  (2.1MB) [✕] │
│  📄 giaykhambenh.pdf   (1.3MB) [✕] │
│                                     │
│  ┌─────────────────────────────────┐│
│  │        [Gửi đơn]               ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

## Layout — Detail Modal (Mobile Full-screen)

```
┌─────────────────────────────────────┐
│ ◀ Chi tiết đơn xin nghỉ            │
├─────────────────────────────────────┤
│  Trạng thái: ⏳ Chờ duyệt          │
│                                     │
│  📅 Ngày: 12/08/2026               │
│  📝 Lý do: Nhà có việc gia đình   │
│                                     │
│  📎 File đính kèm:                 │
│  🖼️ [Xem] anh-minhchung.jpg       │
│  📄 [Xem] giaykhambenh.pdf        │
│                                     │
│  📋 Xử lý:                         │
│  Người duyệt: Chưa có              │
│  Lý do từ chối: —                  │
│  Tạo lúc: 10/08 14:30              │
└─────────────────────────────────────┘
```

## Table Columns (Desktop)

| Column | Width | Sortable | Description |
|--------|-------|----------|-------------|
| Ngày nghỉ | 120px | Yes | `leaveDate` — formatted DD/MM/YYYY |
| Trạng thái | 120px | Yes | Badge: ⏳ Chờ / ✅ Đã duyệt / ❌ Từ chối |
| Lý do | auto | No | `reason` — truncated to 50 chars |
| File | 80px | No | Attachment count with icon |
| Thao tác | 120px | No | Edit/Delete buttons (PENDING only) |

## Status Badges

| Status | Badge | Color |
|--------|-------|-------|
| PENDING | ⏳ Chờ duyệt | Yellow (`#D97706`) |
| APPROVED | ✅ Đã duyệt | Green (`#16A34A`) |
| REJECTED | ❌ Từ chối | Red (`#DC2626`) |

## Fields

| Field | Type | Required | Validation | Default |
|-------|------|----------|------------|---------|
| leaveDate | DATE | ✅ | >= today | Today |
| reason | TEXT | ✅ | minLength: 10 | — |
| attachmentUrls | FILE[] | ❌ | maxItems: 3, maxSize: 5MB each, types: jpg/png/pdf | — |

## Actions

| Action | Trigger | API | Behavior |
|--------|---------|-----|----------|
| Create | POST `/leave-requests` | — | Toast + refresh list |
| Upload | POST `/leave-requests/upload` | multipart | Return URL |
| Edit | PUT `/leave-requests/{id}` | — | Only when PENDING |
| Delete | DELETE `/leave-requests/{id}` | — | Confirm dialog |
| View detail | GET `/leave-requests/{id}` | — | Open detail modal |

## Toast Notifications

| Action | Icon | Color | Message |
|--------|------|-------|---------|
| Create success | ✅ | Green | "Đã gửi đơn xin nghỉ thành công" |
| Edit success | ✅ | Green | "Đã cập nhật đơn xin nghỉ" |
| Delete success | ✅ | Green | "Đã hủy đơn xin nghỉ" |
| Upload success | ✅ | Green | "Đã tải file lên thành công" |
| Upload fail | ❌ | Red | "Tải file lên thất bại" |
| Error | ❌ | Red | "Có lỗi xảy ra. Vui lòng thử lại" |

## Responsive

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Full-screen modals, card list |
| Tablet | Same as mobile |
| Desktop | Table list, centered modals |

## Forbidden

DO NOT:
- Add navigation items
- Modify App Shell
- Add real-time/WebSocket
- Add social login
- Change color scheme

## Acceptance Criteria

- AC-SCR11-01: Employee tạo đơn với ngày, lý do, file đính kèm
- AC-SCR11-02: Upload ảnh JPG/PNG và PDF, max 5MB/file, max 3 files
- AC-SCR11-03: Chỉ thấy đơn của mình
- AC-SCR11-04: Lọc theo trạng thái
- AC-SCR11-05: Xem chi tiết + file đính kèm
- AC-SCR11-06: Sửa đơn khi PENDING
- AC-SCR11-07: Hủy đơn khi PENDING
- AC-SCR11-08: Không sửa/xóa khi APPROVED/REJECTED
- AC-SCR11-09: Hiển thị lý do từ chối
- AC-SCR11-10: Hiển thị người duyệt + thời gian
- AC-SCR11-11: Toast mọi thao tác
- AC-SCR11-12: Responsive mobile/desktop
