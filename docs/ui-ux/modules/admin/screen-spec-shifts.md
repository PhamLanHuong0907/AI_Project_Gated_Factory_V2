# SCR-06 — Quản lý ca làm việc (`/admin/shifts`)

## General

| Field | Value |
|-------|-------|
| Screen ID | SCR-06 |
| Screen Name | Quản lý ca làm việc |
| Route | `/admin/shifts` |
| Use Case | UC-05 |
| Actors | ADMIN |
| Priority | P1 |
| Layout | App Shell with content area |

---

## 1. Danh sách (List View)

### Desktop

```
┌─────────────────────────────────────────────────┐
│  Quản lý ca làm việc           [+ Thêm ca mới] │
├─────────────────────────────────────────────────┤
│                                                 │
│  🔍 Tìm kiếm: [________________]               │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  Tên ca      Giờ vào  Giờ ra  Ngày LV    │  │
│  │              Chờ (phút) Trạng thái        │  │
│  │  ──────────────────────────────────────── │  │
│  │  Ca sáng      08:00   17:00   T2-T6      │  │
│  │              15 ph    ✅                   │  │
│  │                                         │  │
│  │  Ca chiều     13:00   22:00   T2-T6      │  │
│  │              15 ph    ✅                   │  │
│  │                                         │  │
│  │  Ca đêm       22:00   06:00   T2-T7      │  │
│  │              15 ph    ❌                   │  │
│  │                                         │  │
│  │  ──────────────────────────────────────── │  │
│  │  [✏️ Sửa]  [🗑️ Xoá]  [Toggle ✅/❌]     │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  Tổng: 3 ca │ Đang hoạt động: 2 │ Ngừng: 1     │
└─────────────────────────────────────────────────┘
```

### Mobile (Card List)

```
┌─────────────────────────────────────┐
│  Ca sáng                     ✅     │
│  🕐 08:00 — 17:00                  │
│  📅 T2, T3, T4, T5, T6            │
│  ⏱️ Chờ: 15 phút                   │
│                                     │
│  [✏️ Sửa]  [🗑️ Xoá]              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Ca chiều                    ✅     │
│  🕐 13:00 — 22:00                  │
│  📅 T2, T3, T4, T5, T6            │
│  ⏱️ Chờ: 15 phút                   │
│                                     │
│  [✏️ Sửa]  [🗑️ Xoá]              │
└─────────────────────────────────────┘
```

---

## 2. Màn Thêm ca mới (Create Modal)

### Desktop

```
┌─────────────────────────────────────────────┐
│  Thêm ca làm việc                    [X]   │
├─────────────────────────────────────────────┤
│                                             │
│  Tên ca *                                   │
│  ┌─────────────────────────────────────┐   │
│  │ Ca sáng                              │   │
│  └─────────────────────────────────────┘   │
│  Tối đa 50 ký tự                           │
│                                             │
│  Giờ bắt đầu *         Giờ kết thúc *     │
│  ┌──────────────┐       ┌──────────────┐   │
│  │ 08:00         │       │ 17:00         │   │
│  └──────────────┘       └──────────────┘   │
│                                             │
│  Thời gian chờ (phút)                      │
│  ┌─────────────────────────────────────┐   │
│  │ 15                                  │   │
│  └─────────────────────────────────────┘   │
│  Từ 5 đến 15 phút                          │
│                                             │
│  Ngày làm việc *                            │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐    │
│  │✓T2│ │✓T3│ │✓T4│ │✓T5│ │✓T6│ │ T7│    │
│  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘    │
│  Phải chọn ít nhất 1 ngày                   │
│                                             │
│  Mô tả                                      │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│  Tối đa 200 ký tự (không bắt buộc)         │
│                                             │
│  ────────────────────────────────────────  │
│  [Huỷ]                      [✓ Tạo ca]    │
└─────────────────────────────────────────────┘
```

### Mobile (Full-screen Modal)

```
┌─────────────────────────────────────┐
│  ← Thêm ca làm việc         [Lưu]  │
├─────────────────────────────────────┤
│                                     │
│  Tên ca *                           │
│  ┌─────────────────────────────┐   │
│  │                              │   │
│  └─────────────────────────────┘   │
│                                     │
│  Giờ bắt đầu *                     │
│  ┌─────────────────────────────┐   │
│  │ 08:00                        │   │
│  └─────────────────────────────┘   │
│                                     │
│  Giờ kết thúc *                    │
│  ┌─────────────────────────────┐   │
│  │ 17:00                        │   │
│  └─────────────────────────────┘   │
│                                     │
│  Thời gian chờ (phút)              │
│  ┌─────────────────────────────┐   │
│  │ 15                           │   │
│  └─────────────────────────────┘   │
│                                     │
│  Ngày làm việc *                    │
│  ┌───┐┌───┐┌───┐┌───┐┌───┐┌───┐  │
│  │✓T2││✓T3││✓T4││✓T5││✓T6││ T7│  │
│  └───┘└───┘└───┘└───┘└───┘└───┘  │
│                                     │
│  Mô tả                              │
│  ┌─────────────────────────────┐   │
│  │                              │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Fields

| Field | Kiểu | Bắt buộc | Validate | Mặc định | Ghi chú |
|-------|------|----------|----------|----------|---------|
| name | text | ✅ | Max 50 chars, unique | — | Tên ca không trùng |
| startTime | time | ✅ | HH:mm format | — | — |
| endTime | time | ✅ | HH:mm format, > startTime | — | Phải sau giờ bắt đầu |
| gracePeriod | number | ❌ | 5-15 minutes | 15 | Thời gian chờ |
| workDays | checkboxes | ✅ | At least 1 day | T2-T6 | T2, T3, T4, T5, T6, CN |
| description | textarea | ❌ | Max 200 chars | — | Mô tả (optional) |

### Validation Rules

| Rule | Message | Location |
|------|---------|----------|
| Name required | "Tên ca không được để trống" | Below field |
| Name unique | "Tên ca đã tồn tại" | Below field |
| endTime > startTime | "Giờ kết thúc phải sau giờ bắt đầu" | Below endTime |
| Overlapping shifts | "Ca bị trùng giờ với ca khác" | Below endTime |
| At least 1 work day | "Phải chọn ít nhất 1 ngày làm việc" | Below checkboxes |
| Grace period range | "Thời gian chờ phải từ 5-15 phút" | Below field |

### Actions

| Action | Trigger | Component | Behavior |
|--------|---------|-----------|----------|
| Mở modal tạo | Button "+ Thêm ca mới" | Primary Button | Open empty form |
| Đóng modal | ❌ or "Huỷ" | IconButton / Ghost Button | Close without saving |
| Tạo ca | "✓ Tạo ca" or "Lưu" | Primary Button | Validate → POST → Close → Toast "Tạo thành công" |

---

## 3. Màn Sửa ca (Edit Modal)

### Desktop

```
┌─────────────────────────────────────────────┐
│  Sửa ca làm việc — Ca sáng          [X]   │
├─────────────────────────────────────────────┤
│                                             │
│  Tên ca *                                   │
│  ┌─────────────────────────────────────┐   │
│  │ Ca sáng                              │   │  ← Pre-filled
│  └─────────────────────────────────────┘   │
│                                             │
│  Giờ bắt đầu *         Giờ kết thúc *     │
│  ┌──────────────┐       ┌──────────────┐   │
│  │ 08:00         │       │ 17:00         │   │  ← Pre-filled
│  └──────────────┘       └──────────────┘   │
│                                             │
│  ... (tương tự Create)                      │
│                                             │
│  ────────────────────────────────────────  │
│  [Huỷ]                      [✓ Cập nhật]  │
└─────────────────────────────────────────────┘
```

### Hành động

| Action | Trigger | Component | Behavior |
|--------|---------|-----------|----------|
| Mở modal sửa | ✏️ icon trên row | IconButton | Open form with pre-filled data |
| Đóng modal | ❌ or "Huỷ" | — | Close without saving |
| Cập nhật | "✓ Cập nhật" | Primary Button | Validate → PUT → Close → Toast "Cập nhật thành công" |

---

## 4. Màn Xóa ca (Delete Confirmation)

### Desktop

```
┌─────────────────────────────────────────────┐
│  Xoá ca làm việc?                           │
├─────────────────────────────────────────────┤
│                                             │
│  ⚠️ Bạn có chắc chắn muốn xoá              │
│  ca "Ca sáng"?                              │
│                                             │
│  Hành động này không thể hoàn tác.          │
│  Ca đang được 5 nhân viên sử dụng.           │
│                                             │
│  ────────────────────────────────────────  │
│  [Huỷ]                      [🗑️ Xoá]      │
└─────────────────────────────────────────────┘
```

### Mobile

```
┌─────────────────────────────────────┐
│  ⚠️ Xoá ca làm việc?               │
├─────────────────────────────────────┤
│                                     │
│  Bạn có chắc chắn muốn xoá         │
│  ca "Ca sáng"?                      │
│                                     │
│  Hành động này không thể hoàn tác.  │
│  Ca đang được 5 nhân viên sử dụng.  │
│                                     │
│  [Huỷ]              [🗑️ Xoá]      │
└─────────────────────────────────────┘
```

### Hành động

| Action | Trigger | Component | Behavior |
|--------|---------|-----------|----------|
| Mở dialog xóa | 🗑️ icon trên row | IconButton (danger) | Open confirmation dialog |
| Huỷ | "Huỷ" | Ghost Button | Close dialog |
| Xác nhận xóa | "🗑️ Xoá" | Danger Button | DELETE → Close → Toast "Đã xoá" |

### Validation khi xóa

| Rule | Message | Behavior |
|------|---------|----------|
| Shift in use | "Ca đang được sử dụng. Không thể xoá" | Block delete, show toast |
| Shift has attendance | "Ca có dữ liệu chấm công. Chỉ có thể ngừng hoạt động" | Suggest toggle instead |

---

## 5. Toggle Active/Inactive

### Hành động

| Action | Trigger | Component | Behavior |
|--------|---------|-----------|----------|
| Toggle | Switch click | Toggle Switch | PUT with !isActive → Toast "Đã cập nhật" |

### Toggle States

```
┌─────────┐         ┌─────────┐
│ ✅ ON   │  →→→    │ ❌ OFF  │
│ (green) │         │ (gray)  │
└─────────┘         └─────────┘
```

---

## 6. Toast Notifications

| Event | Type | Message | Duration |
|-------|------|---------|----------|
| Tạo thành công | Success | "Đã tạo ca thành công" | 3s |
| Cập nhật thành công | Success | "Đã cập nhật ca thành công" | 3s |
| Xoá thành công | Success | "Đã xoá ca thành công" | 3s |
| Lỗi trùng tên | Error | "Tên ca đã tồn tại" | 5s |
| Lỗi trùng giờ | Error | "Ca bị trùng giờ với ca khác" | 5s |
| Lỗi ca đang dùng | Error | "Ca đang được sử dụng. Không thể xoá" | 5s |
| Lỗi mạng | Error | "Lỗi mạng. Thử lại" | 5s |

---

## 7. Responsive Breakpoints

| Breakpoint | List | Create/Edit Modal | Delete Dialog |
|------------|------|-------------------|---------------|
| Mobile (≤480px) | Card list | Full-screen modal | Bottom sheet |
| Tablet (481-768px) | Full table | Centered modal (480px) | Centered dialog |
| Desktop (≥769px) | Full table | Centered modal (480px) | Centered dialog |

---

## 8. API Operations

| Operation | Method | Endpoint | Request | Response |
|-----------|--------|----------|---------|----------|
| getShifts | GET | `/api/v1/shifts` | — | `[{ id, name, startTime, endTime, gracePeriod, workDays, isActive }]` |
| createShift | POST | `/api/v1/shifts` | `{ name, startTime, endTime, gracePeriod, workDays, description }` | `{ id, name, ... }` |
| updateShift | PUT | `/api/v1/shifts/{id}` | `{ name, startTime, endTime, gracePeriod, workDays, description }` | `{ id, name, ... }` |
| deleteShift | DELETE | `/api/v1/shifts/{id}` | — | 204 |

---

## 9. Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-SCR06-01 | List shows all shifts with correct data |
| AC-SCR06-02 | Create modal opens with empty form |
| AC-SCR06-03 | Edit modal opens with pre-filled data |
| AC-SCR06-04 | Form validates required fields |
| AC-SCR06-05 | Grace period limited to 5-15 minutes |
| AC-SCR06-06 | Work days selection requires at least 1 day |
| AC-SCR06-07 | Delete shows confirmation dialog with warning |
| AC-SCR06-08 | Toggle active/inactive works |
| AC-SCR06-09 | Overlapping time validation |
| AC-SCR06-10 | Touch target ≥ 44px |
| AC-SCR06-11 | Unsaved changes warning on navigate |
| AC-SCR06-12 | Works at 320px minimum width |
| AC-SCR06-13 | Mobile card list layout |
| AC-SCR06-14 | Mobile full-screen modal |
| AC-SCR06-15 | Toast notifications for all actions |
