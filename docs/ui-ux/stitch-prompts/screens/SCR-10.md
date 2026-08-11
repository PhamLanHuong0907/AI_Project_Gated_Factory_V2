# Stitch Prompt: SCR-10 — Cài đặt (GPS + QR + Chấm công)

## Screen Identity

| Field | Value |
|-------|-------|
| Screen ID | SCR-10 |
| Screen Name | Cài đặt |
| Route | `/admin/settings` |
| Use Case | — (Admin Config) |
| Actors | ADMIN (full access), HR_MANAGER (read-only) |
| Layout | App Shell with content area, 3 independent sections |

## User Role & Goal

ADMIN configures system settings: GPS office location, QR code expiration time, and attendance late threshold. HR_MANAGER has read-only access.

## GLOBAL APP SHELL LOCK

> This screen uses the approved App Shell. DO NOT modify the shell. Only design the content area.

## Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ⚙️ Cài đặt                                                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  📍 Cài đặt GPS                                                │   │
│  │  ─────────────────────────────────────────────────────────────  │   │
│  │  (Section 1 — xem chi tiết bên dưới)                           │   │
│  │                                          [💾 Lưu GPS]          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  🔑 Cài đặt mã QR                                              │   │
│  │  ─────────────────────────────────────────────────────────────  │   │
│  │  (Section 2 — xem chi tiết bên dưới)                           │   │
│  │                                          [💾 Lưu QR]          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  ⏰ Cài đặt chấm công                                          │   │
│  │  ─────────────────────────────────────────────────────────────  │   │
│  │  (Section 3 — xem chi tiết bên dưới)                           │   │
│  │                                          [💾 Lưu CC]          │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Section 1: Cài đặt GPS 📍

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Vị trí văn phòng                                              │
│                                                                 │
│  Vĩ độ (Latitude) *           Kinh độ (Longitude) *            │
│  ┌──────────────────────┐     ┌──────────────────────┐        │
│  │ 10.762622            │     │ 106.660172            │        │
│  └──────────────────────┘     └──────────────────────┘        │
│  [-90 to 90]                [-180 to 180]                      │
│                                                                 │
│  [📍 Dùng vị trí hiện tại]                                     │
│                                                                 │
│  Bán kính (mét) *            Fallback WiFi                      │
│  ┌──────────────────────┐     ┌─────────┐                     │
│  │ 50                   │     │ Tắt  ●─ │                     │
│  └──────────────────────┘     └─────────┘                     │
│  Min: 1m                                                       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  [Bản đồ preview — marker + circle radius]               │   │
│  │  Map: OpenStreetMap | Marker: primary pin                 │   │
│  │  Circle: threshold radius, blue 30% opacity              │   │
│  │  Height: 300px mobile, 400px desktop                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Fields

| Field | Type | Required | Validation | Default |
|-------|------|----------|------------|---------|
| latitude | number | Yes | -90 to 90, 6 decimal | Company GPS |
| longitude | number | Yes | -180 to 180, 6 decimal | Company GPS |
| threshold | number | Yes | Min: 1 | 50 |
| wifiFallback | toggle | No | — | false |

### Validation

| Rule | Message |
|------|---------|
| Latitude range | "Vĩ độ phải từ -90 đến 90" |
| Longitude range | "Kinh độ phải từ -180 đến 180" |
| Threshold min | "Bán kính phải lớn hơn 0 mét" |
| Required | "Vui lòng nhập đầy đủ thông tin" |

---

## Section 2: Cài đặt mã QR 🔑

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Thời gian hết hạn mã QR *                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 30                                                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│  (giây)                                                        │
│                                                                 │
│  Mã QR sẽ tự động hết hạn sau thời gian này.                  │
│  Nhân viên phải quét mã trước khi hết hạn để được              │
│  tính chấm công.                                               │
│  Giá trị phải lớn hơn 0.                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Fields

| Field | Type | Required | Validation | Default |
|-------|------|----------|------------|---------|
| qrExpirationSeconds | number | Yes | Min: 1 | 30 |

### Validation

| Rule | Message |
|------|---------|
| Required | "Thời gian hết hạn không được để trống" |
| Min 1 | "Thời gian hết hạn phải lớn hơn 0 giây" |

---

## Section 3: Cài đặt chấm công ⏰

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Ngưỡng đi trễ tối đa *                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ 5                                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│  (phút)                                                        │
│                                                                 │
│  Nhân viên đi trễ trong vòng thời gian này vẫn được            │
│  tính là "Đúng giờ". Vượt quá sẽ tính là "Đi trễ".           │
│  Giá trị phải lớn hơn 0.                                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Fields

| Field | Type | Required | Validation | Default |
|-------|------|----------|------------|---------|
| lateThresholdMinutes | number | Yes | Min: 1 | 5 |

### Validation

| Rule | Message |
|------|---------|
| Required | "Ngưỡng đi trễ không được để trống" |
| Min 1 | "Ngưỡng đi trễ phải lớn hơn 0 phút" |

---

## All API Operations

| Operation | Method | Endpoint | Request | Response |
|-----------|--------|----------|---------|----------|
| getGPSConfig | GET | `/api/v1/config/gps` | — | `{ latitude, longitude, threshold, wifiFallback }` |
| updateGPSConfig | PUT | `/api/v1/config/gps` | `{ latitude, longitude, threshold, wifiFallback }` | Updated config |
| getQRConfig | GET | `/api/v1/config/qr` | — | `{ qrExpirationSeconds }` |
| updateQRConfig | PUT | `/api/v1/config/qr` | `{ qrExpirationSeconds }` | Updated config |
| getAttendanceConfig | GET | `/api/v1/config/attendance` | — | `{ lateThresholdMinutes }` |
| updateAttendanceConfig | PUT | `/api/v1/config/attendance` | `{ lateThresholdMinutes }` | Updated config |

## States

| State | Behavior |
|-------|----------|
| Loading | Skeleton form (3 sections with placeholder lines) |
| Saving | Button spinner, that section's form disabled |
| Success | Toast "Đã lưu cài đặt thành công" |
| Error | Error card with retry |

## Toast Notifications

| Action | Icon | Color | Message |
|--------|------|-------|---------|
| Lưu GPS thành công | ✅ | Green | "Đã lưu cài đặt GPS" |
| Lưu QR thành công | ✅ | Green | "Đã lưu cài đặt mã QR" |
| Lưu CC thành công | ✅ | Green | "Đã lưu cài đặt chấm công" |
| Lỗi server | ❌ | Red | "Không thể lưu. Vui lòng thử lại" |
| Lấy vị trí thành công | ✅ | Green | "Đã xác định vị trí hiện tại" |
| Lấy vị trí thất bại | ❌ | Red | "Không thể lấy vị trí" |

## Responsive Rules

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Full-width sections stacked vertically |
| Tablet | Sections stacked, GPS map side-by-side with form |
| Desktop | Sections stacked, GPS map side-by-side with form |

## Forbidden

- DO NOT add system language settings
- DO NOT add notification settings
- DO NOT add user avatar/photo settings
- DO NOT add theme/dark mode toggle
- DO NOT add database backup settings
- DO NOT add audit log viewer on this screen
- DO NOT allow HR_MANAGER to edit any settings
- DO NOT add WiFi MAC address configuration
- DO NOT add multiple GPS zones

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
