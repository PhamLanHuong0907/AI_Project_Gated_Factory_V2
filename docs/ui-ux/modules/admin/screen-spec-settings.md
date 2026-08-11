# SCR-10 — Cài đặt (`/admin/settings`)

## General

| Field | Value |
|-------|-------|
| Screen ID | SCR-10 |
| Screen Name | Cài đặt |
| Route | `/admin/settings` |
| Use Case | — (Admin Config) |
| Actors | ADMIN (full access), HR_MANAGER (read-only) |
| Layout | App Shell with content area, 3 sections |
| Priority | P2 |

## Layout — Desktop

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ⚙️ Cài đặt                                                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📍 Cài đặt GPS                                                │   │
│  │  ─────────────────────────────────────────────────────────────  │   │
│  │                                                                 │   │
│  │  Vị trí văn phòng                                              │   │
│  │  ┌──────────────────────┐  ┌──────────────────────┐           │   │
│  │  │ Vĩ độ *              │  │ Kinh độ *             │           │   │
│  │  │ 10.762622            │  │ 106.660172            │           │   │
│  │  └──────────────────────┘  └──────────────────────┘           │   │
│  │  [📍 Dùng vị trí hiện tại]                                     │   │
│  │                                                                 │   │
│  │  Xác minh khoảng cách                                          │   │
│  │  ┌──────────────────────┐  ┌──────────────────────┐           │   │
│  │  │ Bán kính (mét) *     │  │ Fallback WiFi         │           │   │
│  │  │ 50                   │  │ [Tắt]                 │           │   │
│  │  └──────────────────────┘  └──────────────────────┘           │   │
│  │                                                                 │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │  [Bản đồ preview — vị trí văn phòng]                    │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │
│  │                                                                 │   │
│  │                                          [💾 Lưu GPS]          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🔑 Cài đặt mã QR                                              │   │
│  │  ─────────────────────────────────────────────────────────────  │   │
│  │                                                                 │   │
│  │  Thời gian hết hạn mã QR                                       │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │ 30  giây                                                 │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │
│  │  Mã QR sẽ tự động hết hạn sau thời gian này.                  │   │
│  │  Nhân viên phải quét mã trước khi hết hạn.                     │   │
│  │  Giá trị phải lớn hơn 0.                                      │   │
│  │                                                                 │   │
│  │                                          [💾 Lưu QR]          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ⏰ Cài đặt chấm công                                          │   │
│  │  ─────────────────────────────────────────────────────────────  │   │
│  │                                                                 │   │
│  │  Ngưỡng đi trễ tối đa                                         │   │
│  │  ┌─────────────────────────────────────────────────────────┐   │   │
│  │  │ 5  phút                                                   │   │   │
│  │  └─────────────────────────────────────────────────────────┘   │   │
│  │  Nhân viên đi trễ trong vòng thời gian này vẫn được            │   │
│  │  tính là "Đúng giờ". Vượt quá sẽ tính là "Đi trễ".           │   │
│  │  Giá trị phải lớn hơn 0.                                      │   │
│  │                                                                 │   │
│  │                                          [💾 Lưu CC]          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Layout — Mobile

```
┌─────────────────────────────────────┐
│ ⚙️ Cài đặt                         │
├─────────────────────────────────────┤
│                                     │
│  ── 📍 Cài đặt GPS ──              │
│                                     │
│  Vĩ độ *                            │
│  ┌─────────────────────────────┐   │
│  │ 10.762622                   │   │
│  └─────────────────────────────┘   │
│                                     │
│  Kinh độ *                          │
│  ┌─────────────────────────────┐   │
│  │ 106.660172                  │   │
│  └─────────────────────────────┘   │
│                                     │
│  [📍 Dùng vị trí hiện tại]         │
│                                     │
│  Bán kính (mét) *                   │
│  ┌─────────────────────────────┐   │
│  │ 50                          │   │
│  └─────────────────────────────┘   │
│                                     │
│  Fallback WiFi  [Tắt]              │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ [Bản đồ preview]            │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │        💾 Lưu GPS           │   │
│  └─────────────────────────────┘   │
│                                     │
│  ── 🔑 Cài đặt mã QR ──           │
│                                     │
│  Thời gian hết hạn (giây) *        │
│  ┌─────────────────────────────┐   │
│  │ 30                          │   │
│  └─────────────────────────────┘   │
│  Mã QR sẽ tự động hết hạn         │
│  sau thời gian này.                │
│                                     │
│  ┌─────────────────────────────┐   │
│  │        💾 Lưu QR            │   │
│  └─────────────────────────────┘   │
│                                     │
│  ── ⏰ Cài đặt chấm công ──       │
│                                     │
│  Ngưỡng đi trễ tối đa (phút) *    │
│  ┌─────────────────────────────┐   │
│  │ 5                           │   │
│  └─────────────────────────────┘   │
│  Đi trễ trong vòng thời gian này   │
│  vẫn tính là "Đúng giờ".          │
│                                     │
│  ┌─────────────────────────────┐   │
│  │        💾 Lưu CC            │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

---

## Section 1: Cài đặt GPS

### Fields

| Field | Type | Required | Validation | Default | Mô tả |
|-------|------|----------|------------|---------|-------|
| latitude | number | Yes | -90 to 90, max 6 decimal | Company GPS | Vĩ độ văn phòng |
| longitude | number | Yes | -180 to 180, max 6 decimal | Company GPS | Kinh độ văn phòng |
| threshold | number | Yes | Min: 1 meter | 50 | Bán kính xác minh GPS |
| wifiFallback | boolean | No | — | false | Fallback WiFi khi GPS mất |

### Actions

| Action | Trigger | API Call | Behavior |
|--------|---------|----------|----------|
| Load config | Screen mount | `GET /api/v1/config/gps` | Load GPS config |
| Save GPS | Button click | `PUT /api/v1/config/gps` | Save GPS config |
| Dùng vị trí hiện tại | Button click | — | Get device GPS, fill lat/lng |

---

## Section 2: Cài đặt mã QR

### Fields

| Field | Type | Required | Validation | Default | Mô tả |
|-------|------|----------|------------|---------|-------|
| qrExpirationSeconds | number | Yes | Min: 1 (giây) | 30 | Thời gian hết hạn mã QR |

### Actions

| Action | Trigger | API Call | Behavior |
|--------|---------|----------|----------|
| Load config | Screen mount | `GET /api/v1/config/qr` | Load QR config |
| Save QR | Button click | `PUT /api/v1/config/qr` | Save QR config |

### Validation

| Rule | Message |
|------|---------|
| Required | "Thời gian hết hạn không được để trống" |
| Min 1 | "Thời gian hết hạn phải lớn hơn 0 giây" |

---

## Section 3: Cài đặt chấm công

### Fields

| Field | Type | Required | Validation | Default | Mô tả |
|-------|------|----------|------------|---------|-------|
| lateThresholdMinutes | number | Yes | Min: 1 (phút) | 5 | Ngưỡng đi trễ tối đa vẫn tính đúng giờ |

### Actions

| Action | Trigger | API Call | Behavior |
|--------|---------|----------|----------|
| Load config | Screen mount | `GET /api/v1/config/attendance` | Load attendance config |
| Save CC | Button click | `PUT /api/v1/config/attendance` | Save attendance config |

### Validation

| Rule | Message |
|------|---------|
| Required | "Ngưỡng đi trễ không được để trống" |
| Min 1 | "Ngưỡng đi trễ phải lớn hơn 0 phút" |

---

## API Operations

| Operation | Method | Endpoint | Request | Response |
|-----------|--------|----------|---------|----------|
| getGPSConfig | GET | `/api/v1/config/gps` | — | `{ latitude, longitude, threshold, wifiFallback }` |
| updateGPSConfig | PUT | `/api/v1/config/gps` | `{ latitude, longitude, threshold, wifiFallback }` | `{ latitude, longitude, threshold, wifiFallback }` |
| getQRConfig | GET | `/api/v1/config/qr` | — | `{ qrExpirationSeconds }` |
| updateQRConfig | PUT | `/api/v1/config/qr` | `{ qrExpirationSeconds }` | `{ qrExpirationSeconds }` |
| getAttendanceConfig | GET | `/api/v1/config/attendance` | — | `{ lateThresholdMinutes }` |
| updateAttendanceConfig | PUT | `/api/v1/config/attendance` | `{ lateThresholdMinutes }` | `{ lateThresholdMinutes }` |

---

## Loading State

| State | Behavior |
|-------|----------|
| Loading | Skeleton form (3 sections) |
| Saving | Button spinner, form disabled |
| Success | Toast "Đã lưu cài đặt thành công" |
| Error | Error card with retry |

## Error Display

| Error Code | Display | Message |
|------------|---------|---------|
| VALIDATION_ERROR | Inline | Field-level errors |
| INVALID_COORDINATES | Inline | "Tọa độ không hợp lệ" |
| UNAUTHORIZED | Redirect | → `/login` |
| FORBIDDEN | Toast | "Bạn không có quyền truy cập" |
| NETWORK_ERROR | Toast | "Lỗi mạng. Thử lại" |

---

## Toast Notifications

| Action | Icon | Color | Message |
|--------|------|-------|---------|
| Lưu GPS thành công | ✅ | Green | "Đã lưu cài đặt GPS" |
| Lưu QR thành công | ✅ | Green | "Đã lưu cài đặt mã QR" |
| Lưu CC thành công | ✅ | Green | "Đã lưu cài đặt chấm công" |
| Lỗi server | ❌ | Red | "Không thể lưu. Vui lòng thử lại" |
| Lấy vị trí thành công | ✅ | Green | "Đã xác định vị trí hiện tại" |
| Lấy vị trí thất bại | ❌ | Red | "Không thể lấy vị trí. Vui lòng nhập thủ công" |

---

## Responsive Rules

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Full-width sections stacked vertically |
| Tablet | Sections stacked, map side-by-side with form |
| Desktop | Sections stacked, form + map side-by-side |

---

## Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-SCR10-01 | GPS form loads current config on mount |
| AC-SCR10-02 | GPS: Latitude validated (-90 to 90) |
| AC-SCR10-03 | GPS: Longitude validated (-180 to 180) |
| AC-SCR10-04 | GPS: Threshold validated (min 1m) |
| AC-SCR10-05 | GPS: WiFi fallback toggle works |
| AC-SCR10-06 | GPS: Save calls correct API |
| AC-SCR10-07 | GPS: Map preview shows office location |
| AC-SCR10-08 | GPS: "Dùng vị trí hiện tại" fills coordinates |
| AC-SCR10-09 | QR: Form loads current config on mount |
| AC-SCR10-10 | QR: Expiration validated (min 1s) |
| AC-SCR10-11 | QR: Save calls correct API |
| AC-SCR10-12 | Attendance: Form loads current config on mount |
| AC-SCR10-13 | Attendance: Late threshold validated (min 1 min) |
| AC-SCR10-14 | Attendance: Save calls correct API |
| AC-SCR10-15 | Each section saves independently |
| AC-SCR10-16 | Toast notifications for all save actions |
| AC-SCR10-17 | HR_MANAGER has read-only access |
| AC-SCR10-18 | Touch target ≥ 44px |
| AC-SCR10-19 | Works at 320px minimum width |
| AC-SCR10-20 | Loading skeleton on initial load |
