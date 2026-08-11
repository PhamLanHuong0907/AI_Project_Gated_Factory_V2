# Screen Specification — SCR-11: Đơn từ (Nhân viên)

| Field | Value |
|-------|-------|
| Screen ID | SCR-11 |
| Screen Name | Đơn xin nghỉ làm — Nhân viên |
| Route | `/my/leave-requests` |
| Use Case | UC-11: Gửi đơn xin nghỉ làm |
| Actors | EMPLOYEE |
| Priority | P1 — Must Have |
| Layout | Mobile-first card list + Create modal |

---

## 1. Layout — Danh sách đơn của tôi

### Mobile (default)

```
┌─────────────────────────────────────┐
│ ◀ Đơn từ của tôi        [+ Tạo đơn]│
├─────────────────────────────────────┤
│ [🔄 Tất cả] [⏳ Chờ] [✅ Đã duyệt] [❌ Từ chối]│
├─────────────────────────────────────┤
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📅 12/08/2026        ⏳ Chờ duyệt│ │
│ │ Lý do: Nhà có việc gia đình     │ │
│ │ 📎 2 file đính kèm              │ │
│ │ ─────────────────────────────── │ │
│ │ [✏️ Sửa]  [🗑️ Hủy]            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📅 05/08/2026        ✅ Đã duyệt│ │
│ │ Lý do: Đi khám bệnh             │ │
│ │ 📎 1 file đính kèm              │ │
│ │ ─────────────────────────────── │ │
│ │ Duyệt bởi: Quản lý A           │ │
│ │ Thời gian: 06/08 09:15          │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ 📅 01/08/2026        ❌ Từ chối │ │
│ │ Lý do: Nghỉ phép năm           │ │
│ │ ─────────────────────────────── │ │
│ │ Lý do từ chối: Đơn gấp, cần    │ │
│ │ hoàn thành task trước           │ │
│ └─────────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

### Desktop

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Đơn xin nghỉ làm của tôi                                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [+ Tạo đơn mới]     [Tất cả ▼]  [🔍 Tìm kiếm...]                      │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  │ Ngày nghỉ  │ Trạng thái     │ Lý do           │ File │ Thao tác│ │
│  │  ─────────────────────────────────────────────────────────────── │  │
│  │  │ 12/08/2026  │ ⏳ Chờ duyệt   │ Nhà có việc     │ 2    │ ✏️ 🗑️  │  │
│  │  │ 05/08/2026  │ ✅ Đã duyệt    │ Đi khám bệnh    │ 1    │ 👁️     │  │
│  │  │ 01/08/2026  │ ❌ Từ chối     │ Nghỉ phép năm   │ 0    │ 👁️     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                         │
│  Trang 1/1                                                              │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Fields

| Field | Type | Required | Validation | Default |
|-------|------|----------|------------|---------|
| leaveDate | DATE | ✅ | Phải >= hôm nay | Hôm nay |
| reason | TEXT | ✅ | Tối thiểu 10 ký tự | — |
| attachmentUrls | FILE[] | ❌ | Tối đa 3 file, mỗi file ≤ 5MB. Định dạng: JPG, PNG, PDF | — |

---

## 3. Filters

| Filter | Type | Options | Default |
|--------|------|---------|---------|
| Status | Tab/Chip | Tất cả, Chờ duyệt, Đã duyệt, Từ chối | Tất cả |
| Search | Text | Tìm theo lý do | — |

---

## 4. Actions

| Action | Trigger | API Call | Behavior |
|--------|---------|----------|----------|
| Tạo đơn | Button [+ Tạo đơn] | — | Mở Create Modal |
| Upload file | Button [📎 Thêm file] | `POST /leave-requests/upload` | Upload file, nhận URL |
| Gửi đơn | Button [Gửi đơn] | `POST /leave-requests` | Tạo đơn, refresh list |
| Sửa đơn | Button [✏️ Sửa] | — | Mở Edit Modal (chỉ khi PENDING) |
| Hủy đơn | Button [🗑️ Hủy] | `DELETE /leave-requests/{id}` | Confirm → Xóa |
| Xem chi tiết | Click card | — | Mở Detail Modal |
| Đổi tab | Tab/Chip | — | Filter theo status |

---

## 5. Create Modal

### Mobile (Full-screen)

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
│  📝 Lý do *                        │
│  ┌─────────────────────────────────┐│
│  │ Nhập lý do xin nghỉ...        ││
│  │                                 ││
│  └─────────────────────────────────┘│
│  Tối thiểu 10 ký tự                │
│                                     │
│  📎 File đính kèm (tối đa 3)       │
│  ┌─────────────────────────────────┐│
│  │ [📎 Chọn file]                 ││
│  └─────────────────────────────────┘│
│  Chấp nhận: JPG, PNG, PDF (≤ 5MB)  │
│                                     │
│  ┌─────────────────────────────────┐│
│  │ 🖼️ anh-minhchung.jpg  (2.1MB)  ││
│  │              [✕]               ││
│  │ 📄 giaykhambenh.pdf   (1.3MB)  ││
│  │              [✕]               ││
│  └─────────────────────────────────┘│
│                                     │
│  ┌─────────────────────────────────┐│
│  │        [Gửi đơn]               ││
│  └─────────────────────────────────┘│
└─────────────────────────────────────┘
```

### Desktop (Modal)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Tạo đơn xin nghỉ làm                                            [✕]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  📅 Ngày xin nghỉ *                                                    │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ [📅 Chọn ngày]                                                 │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  📝 Lý do *                                                            │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ Nhập lý do xin nghỉ làm...                                    │    │
│  │                                                                │    │
│  │                                                                │    │
│  └────────────────────────────────────────────────────────────────┘    │
│  Tối thiểu 10 ký tự                                                     │
│                                                                         │
│  📎 File đính kèm (tối đa 3 file, mỗi file ≤ 5MB)                     │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ [📎 Chọn file] — JPG, PNG, PDF                                 │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  File đã chọn:                                                         │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │ 🖼️ anh-minhchung.jpg   2.1 MB   [✕ Xóa]                       │    │
│  │ 📄 giaykhambenh.pdf    1.3 MB   [✕ Xóa]                       │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│                              [Hủy]  [Gửi đơn]                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Edit Modal

> Giống Create Modal nhưng:
> - Pre-fill: leaveDate (locked/disabled), reason, attachmentUrls
> - Button: [Cập nhật] thay vì [Gửi đơn]
> - Chỉ hiện khi status = PENDING

---

## 7. Delete Confirmation

### Mobile (Bottom Sheet)

```
┌─────────────────────────────────────┐
│                                     │
│  ─────────                          │
│                                     │
│  🗑️ Hủy đơn xin nghỉ?             │
│                                     │
│  Đơn ngày 12/08/2026 sẽ bị xóa.   │
│  Hành động này không thể hoàn tác. │
│                                     │
│  [Không, giữ lại]   [🗑️ Xóa đơn]   │
└─────────────────────────────────────┘
```

---

## 8. Detail Modal

### Mobile (Full-screen)

```
┌─────────────────────────────────────┐
│ ◀ Chi tiết đơn xin nghỉ            │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────────┐│
│  │ Trạng thái: ⏳ Chờ duyệt       ││
│  └─────────────────────────────────┘│
│                                     │
│  📅 Ngày xin nghỉ: 12/08/2026     │
│                                     │
│  📝 Lý do:                         │
│  Nhà có việc gia đình phải về quê  │
│                                     │
│  📎 File đính kèm:                 │
│  ┌─────────────────────────────────┐│
│  │ 🖼️ [Xem ảnh] anh-minhchung.jpg ││
│  │ 📄 [Xem PDF] giaykhambenh.pdf  ││
│  └─────────────────────────────────┘│
│                                     │
│  📋 Thông tin xử lý:               │
│  Người duyệt: Chưa có              │
│  Thời gian: Chưa có                │
│  Lý do từ chối: —                  │
│                                     │
│  ─────────────────────────────────  │
│  Tạo lúc: 10/08 14:30              │
│                                     │
└─────────────────────────────────────┘
```

---

## 9. Toast Notifications

| Action | Icon | Color | Message |
|--------|------|-------|---------|
| Tạo đơn thành công | ✅ | Green | "Đã gửi đơn xin nghỉ thành công" |
| Cập nhật đơn | ✅ | Green | "Đã cập nhật đơn xin nghỉ" |
| Xóa đơn | ✅ | Green | "Đã hủy đơn xin nghỉ" |
| Upload file thành công | ✅ | Green | "Đã tải file lên thành công" |
| Upload file thất bại | ❌ | Red | "Tải file lên thất bại. Vui lòng thử lại" |
| Lỗi server | ❌ | Red | "Có lỗi xảy ra. Vui lòng thử lại sau" |

---

## 10. API Operations

| Operation | Method | Endpoint | Request | Response |
|-----------|--------|----------|---------|----------|
| List my requests | GET | `/leave-requests?page={p}&size={s}&status={status}` | — | `LeaveRequestPageResponse` |
| Get detail | GET | `/leave-requests/{id}` | — | `LeaveRequestResponse` |
| Create request | POST | `/leave-requests` | `LeaveRequestCreateRequest` | `LeaveRequestResponse` |
| Update request | PUT | `/leave-requests/{id}` | `LeaveRequestUpdateRequest` | `LeaveRequestResponse` |
| Delete request | DELETE | `/leave-requests/{id}` | — | 204 |
| Upload file | POST | `/leave-requests/upload` | `multipart/form-data` | `FileUploadResponse` |

---

## 11. Loading State

| State | Behavior |
|-------|----------|
| Loading | Skeleton cards (3 placeholder cards) |
| Success | Render card list |
| Error | Error message + [Thử lại] button |
| Empty | "Chưa có đơn xin nghỉ nào" + [Tạo đơn mới] |

---

## 12. Empty State

```
┌─────────────────────────────────────┐
│                                     │
│         📋                          │
│                                     │
│   Chưa có đơn xin nghỉ nào         │
│                                     │
│   [Tạo đơn mới]                     │
│                                     │
└─────────────────────────────────────┘
```

---

## 13. Error Display

| Error Code | Display | Message |
|------------|---------|---------|
| 400 | Field error | "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại" |
| 403 | Toast | "Bạn không có quyền thực hiện thao tác này" |
| 404 | Toast | "Đơn xin nghỉ không tồn tại" |
| 409 | Toast | "Đơn xin nghỉ cho ngày này đã tồn tại" |
| 500 | Toast | "Lỗi hệ thống. Vui lòng thử lại sau" |

---

## 14. Responsive Rules

| Breakpoint | Behavior |
|------------|----------|
| Mobile (< 768px) | Full-screen modals, card list, bottom sheet confirm |
| Tablet (768-1024px) | Same as mobile |
| Desktop (> 1024px) | Table list, centered modal dialogs |

---

## 15. Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-SCR11-01 | Employee có thể tạo đơn xin nghỉ với ngày, lý do, file đính kèm |
| AC-SCR11-02 | Employee có thể upload file ảnh (JPG/PNG) và PDF, tối đa 3 file, mỗi file ≤ 5MB |
| AC-SCR11-03 | Employee chỉ thấy đơn của mình, không thấy đơn người khác |
| AC-SCR11-04 | Employee có thể lọc đơn theo trạng thái (Tất cả, Chờ duyệt, Đã duyệt, Từ chối) |
| AC-SCR11-05 | Employee có thể xem chi tiết đơn + file đính kèm |
| AC-SCR11-06 | Employee có thể sửa đơn khi trạng thái = PENDING |
| AC-SCR11-07 | Employee có thể hủy đơn khi trạng thái = PENDING |
| AC-SCR11-08 | Employee không thể sửa/xóa đơn khi trạng thái = APPROVED hoặc REJECTED |
| AC-SCR11-09 | Hiển thị lý do từ chối khi đơn bị từ chối |
| AC-SCR11-10 | Hiển thị thông tin người duyệt và thời gian duyệt |
| AC-SCR11-11 | Toast thông báo cho mọi thao tác (tạo, sửa, xóa, upload) |
| AC-SCR11-12 | Responsive: Mobile card list, Desktop table |
