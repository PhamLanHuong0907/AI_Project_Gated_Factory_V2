# Screen Specification — SCR-12: Duyệt đơn xin nghỉ (Admin/HR)

| Field | Value |
|-------|-------|
| Screen ID | SCR-12 |
| Screen Name | Duyệt đơn xin nghỉ làm |
| Route | `/admin/leave-requests` |
| Use Case | UC-12: Duyệt đơn xin nghỉ làm |
| Actors | ADMIN, HR_MANAGER |
| Priority | P1 — Must Have |
| Layout | Desktop table list + Approve/Reject modals |

---

## 1. Layout — Danh sách đơn xin nghỉ

### Desktop

```
┌─────────────────────────────────────────────────────────────────────────┐
│  📋 Duyệt đơn xin nghỉ                                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [Tất cả (12)] [⏳ Chờ duyệt (5)] [✅ Đã duyệt (5)] [❌ Từ chối (2)]  │
│                                                                         │
│  [👤 Nhân viên ▼]  [📅 Từ: ___]  [Đến: ___]  [🔍 Tìm kiếm...]         │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  │ ID │ Nhân viên   │ Ngày nghỉ  │ Trạng thái     │ File │ Tác vụ│  │
│  │  ─────────────────────────────────────────────────────────────── │  │
│  │  │ 12 │ Nguyễn A    │ 12/08/2026  │ ⏳ Chờ duyệt   │ 2    │ 👁️ ✅❌│  │
│  │  │ 11 │ Trần B      │ 12/08/2026  │ ⏳ Chờ duyệt   │ 0    │ 👁️ ✅❌│  │
│  │  │ 10 │ Lê C        │ 11/08/2026  │ ⏳ Chờ duyệt   │ 1    │ 👁️ ✅❌│  │
│  │  │  9 │ Phạm D      │ 10/08/2026  │ ✅ Đã duyệt    │ 3    │ 👁️    │  │
│  │  │  8 │ Hoàng E     │ 09/08/2026  │ ❌ Từ chối     │ 1    │ 👁️    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  Trang 1/3  [< prev] [next >]                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### Mobile

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
│ │ ─────────────────────────────── │ │
│ │ [👁️ Chi tiết] [✅ Duyệt] [❌]  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Trần B — 12/08/2026            │ │
│ │ Lý do: Đi đám cưới             │ │
│ │ ─────────────────────────────── │ │
│ │ [👁️ Chi tiết] [✅ Duyệt] [❌]  │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

---

## 2. Fields

| Field | Type | Display |
|-------|------|---------|
| id | INTEGER | Mã đơn |
| userName | STRING | Tên nhân viên |
| leaveDate | DATE | Ngày xin nghỉ |
| reason | TEXT | Lý do |
| status | ENUM | PENDING / APPROVED / REJECTED |
| attachmentUrls | ARRAY | Số lượng file đính kèm |
| reviewedByName | STRING | Người duyệt |
| reviewedAt | DATETIME | Thời gian duyệt |
| rejectReason | TEXT | Lý do từ chối |

---

## 3. Filters

| Filter | Type | Options | Default |
|--------|------|---------|---------|
| Status | Tab/Chip | Tất cả, Chờ duyệt, Đã duyệt, Từ chối | Tất cả |
| Employee | Dropdown | Danh sách nhân viên | Tất cả |
| Date range | DatePicker | Từ ngày / Đến ngày | — |
| Search | Text | Tìm theo tên NV hoặc lý do | — |

---

## 4. Actions

| Action | Trigger | API Call | Behavior |
|--------|---------|----------|----------|
| Xem chi tiết | Button [👁️] | `GET /leave-requests/{id}` | Mở Detail Modal |
| Duyệt đơn | Button [✅ Duyệt] | — | Mở Approve Confirm |
| Từ chối đơn | Button [❌ Từ chối] | — | Mở Reject Modal |
| Xác nhận duyệt | Button [Duyệt] | `POST /leave-requests/{id}/approve` | Duyệt + tạo attendance |
| Xác nhận từ chối | Button [Từ chối] | `POST /leave-requests/{id}/reject` | Từ chối với lý do |
| Đổi tab | Tab/Chip | — | Filter theo status |

---

## 5. Detail Modal

### Desktop

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Chi tiết đơn xin nghỉ                                          [✕]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  Trạng thái: ⏳ Chờ duyệt                                     │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  👤 Nhân viên: Nguyễn Văn A (NV001)                                   │
│  📅 Ngày xin nghỉ: 12/08/2026 (Thứ Ba)                               │
│                                                                         │
│  📝 Lý do:                                                             │
│  Nhà có việc gia đình phải về quê gấp. Xin nghỉ 1 ngày.              │
│                                                                         │
│  📎 File đính kèm:                                                     │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │  🖼️ [Xem ảnh] anh-minhchung.jpg    2.1 MB                     │    │
│  │  📄 [Xem PDF] giaykhambenh.pdf     1.3 MB                     │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ────────────────────────────────────────────────────────────────────  │
│                                                                         │
│  📋 Thông tin xử lý:                                                   │
│  Người duyệt: —                                                        │
│  Thời gian: —                                                          │
│  Lý do từ chối: —                                                      │
│                                                                         │
│  Tạo lúc: 10/08/2026 14:30                                             │
│                                                                         │
│                              [❌ Từ chối]  [✅ Duyệt đơn]               │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Approve Confirmation

### Desktop (Dialog)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ✅ Duyệt đơn xin nghỉ                                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Bạn có chắc chắn duyệt đơn xin nghỉ của                              │
│  Nguyễn Văn A vào ngày 12/08/2026?                                     │
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

---

## 7. Reject Modal

### Desktop (Dialog)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ❌ Từ chối đơn xin nghỉ                                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Từ chối đơn xin nghỉ của Nguyễn Văn A vào ngày 12/08/2026?           │
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

### Mobile (Bottom Sheet)

```
┌─────────────────────────────────────┐
│                                     │
│  ─────────                          │
│                                     │
│  ❌ Từ chối đơn xin nghỉ?          │
│                                     │
│  📝 Lý do từ chối *                │
│  ┌─────────────────────────────────┐│
│  │ Nhập lý do...                  ││
│  └─────────────────────────────────┘│
│                                     │
│  [Không]   [❌ Từ chối]             │
└─────────────────────────────────────┘
```

---

## 8. Toast Notifications

| Action | Icon | Color | Message |
|--------|------|-------|---------|
| Duyệt thành công | ✅ | Green | "Đã duyệt đơn. Lịch sử chấm công đã được cập nhật" |
| Từ chối thành công | ✅ | Green | "Đã từ chối đơn xin nghỉ" |
| Lỗi duyệt | ❌ | Red | "Không thể duyệt đơn. Vui lòng thử lại" |
| Lỗi từ chối | ❌ | Red | "Không thể từ chối đơn. Vui lòng thử lại" |
| Đơn đã được xử lý | ⚠️ | Yellow | "Đơn này đã được xử lý bởi người khác" |

---

## 9. API Operations

| Operation | Method | Endpoint | Request | Response |
|-----------|--------|----------|---------|----------|
| List all requests | GET | `/leave-requests?page={p}&size={s}&status={status}&userId={userId}` | — | `LeaveRequestPageResponse` |
| Get detail | GET | `/leave-requests/{id}` | — | `LeaveRequestResponse` |
| Approve | POST | `/leave-requests/{id}/approve` | `{ note? }` | `LeaveRequestResponse` |
| Reject | POST | `/leave-requests/{id}/reject` | `{ rejectReason }` | `LeaveRequestResponse` |

---

## 10. Loading State

| State | Behavior |
|-------|----------|
| Loading | Skeleton table rows (5 placeholder rows) |
| Success | Render table |
| Error | Error message + [Thử lại] button |
| Empty (filtered) | "Không có đơn xin nghỉ phù hợp" |
| Empty (no requests) | "Chưa có đơn xin nghỉ nào" |

---

## 11. Empty State

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                              📋                                         │
│                                                                         │
│                     Chưa có đơn xin nghỉ nào                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 12. Error Display

| Error Code | Display | Message |
|------------|---------|---------|
| 400 | Toast | "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại" |
| 403 | Toast | "Bạn không có quyền duyệt đơn" |
| 404 | Toast | "Đơn xin nghỉ không tồn tại" |
| 409 | Toast | "Đơn đã được xử lý bởi người khác" |
| 500 | Toast | "Lỗi hệ thống. Vui lòng thử lại sau" |

---

## 13. Responsive Rules

| Breakpoint | Behavior |
|------------|----------|
| Mobile (< 768px) | Card list, bottom sheet for reject, full-screen detail |
| Tablet (768-1024px) | Condensed table, modal dialogs |
| Desktop (> 1024px) | Full table, centered modal dialogs |

---

## 14. Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-SCR12-01 | ADMIN/HR_MANAGER có thể xem danh sách tất cả đơn xin nghỉ |
| AC-SCR12-02 | Có thể lọc theo trạng thái, nhân viên, khoảng ngày |
| AC-SCR12-03 | Có thể tìm kiếm theo tên nhân viên hoặc lý do |
| AC-SCR12-04 | Xem chi tiết đơn + file đính kèm |
| AC-SCR12-05 | Duyệt đơn → tự động tạo attendance record với status XIN_NGHI |
| AC-SCR12-06 | Từ chối đơn → phải nhập lý do (tối thiểu 5 ký tự) |
| AC-SCR12-07 | Hiển thị toast thông báo cho mọi thao tác |
| AC-SCR12-08 | Nếu đơn đã được xử lý bởi người khác → hiển thị thông báo cảnh báo |
| AC-SCR12-09 | HR_MANAGER có quyền duyệt/từ chối giống ADMIN |
| AC-SCR12-10 | Responsive: Mobile card list, Desktop table |
