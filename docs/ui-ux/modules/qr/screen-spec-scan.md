# SCR-04 — Quét mã QR & GPS (`/qr/scan`)

## General

| Field | Value |
|-------|-------|
| Screen ID | SCR-04 |
| Screen Name | Quét mã QR & GPS |
| Route | `/qr/scan` |
| Use Case | UC-03 |
| Actors | EMPLOYEE |
| Priority | P0 |
| Layout | Full-screen camera overlay (inside App Shell) |

## Layout

```
┌─────────────────────────────────────────────────┐
│  ← Quét mã QR                         [⚙️]    │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │                                           │  │
│  │          CAMERA VIEWFINDER                │  │
│  │                                           │  │
│  │    ┌─────────────────────────────┐        │  │
│  │    │                             │        │  │
│  │    │     [QR Scan Frame]         │        │  │
│  │    │     (centered, animated)    │        │  │
│  │    │                             │        │  │
│  │    └─────────────────────────────┘        │  │
│  │                                           │  │
│  │    📍 GPS: Đang lấy vị trí...             │  │
│  │    📏 Khoảng cách: -- m                   │  │
│  │                                           │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  Trạng thái: Sẵn sàng quét               │  │
│  │  Ca làm việc: Ca sáng (08:00 - 17:00)     │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Success Overlay

```
┌─────────────────────────────────────────────────┐
│                                                 │
│          ┌─────────────────────┐                │
│          │                     │                │
│          │    ✅               │                │
│          │    CHẤM CÔNG        │                │
│          │    THÀNH CÔNG!      │                │
│          │                     │                │
│          │    Loại: VÀO        │                │
│          │    Thời gian: 08:02 │                │
│          │    Khoảng cách: 12m │                │
│          │                     │                │
│          │    [Đóng]           │                │
│          └─────────────────────┘                │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Failure Overlay

```
┌─────────────────────────────────────────────────┐
│                                                 │
│          ┌─────────────────────┐                │
│          │                     │                │
│          │    ❌               │                │
│          │    CHẤM CÔNG        │                │
│          │    THẤT BẠI!        │                │
│          │                     │                │
│          │    Lý do:           │                │
│          │    Khoảng cách      │                │
│          │    vượt ngưỡng      │                │
│          │    (85m > 50m)      │                │
│          │                     │                │
│          │    [Quét lại]       │                │
│          └─────────────────────┘                │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Fields

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| camera | stream | Device | Camera viewfinder stream |
| gpsStatus | enum | Device | `ACQUIRING` / `VERIFIED` / `FAILED` |
| gpsLat | number | Device | Vĩ độ hiện tại |
| gpsLng | number | Device | Kinh độ hiện tại |
| distance | number | Calculated | Khoảng cách đến văn phòng (m) |
| scanResult | object | API | Kết quả chấm công |
| scanType | enum | Logic | `IN` / `OUT` (tự xác định) |

## Actions

| Action | Trigger | API Call | Behavior |
|--------|---------|----------|----------|
| Scan QR | Camera auto-detect | `POST /api/v1/attendance/scan` | Send QR + GPS to server |
| Quét lại | Button click | — | Reset scanner, dismiss overlay |
| Close overlay | Button click | — | Dismiss success/failure overlay |
| Switch camera | Icon click | — | Toggle front/rear camera |

## API Operations

| Operation | Method | Endpoint | Request | Response |
|-----------|--------|----------|---------|----------|
| scanAttendance | POST | `/api/v1/attendance/scan` | `{ qrCode, gpsLat, gpsLng }` | `{ data: { id, type, timestamp, distance, status, message } }` |
| getCurrentShift | GET | `/api/v1/shifts` | — | `{ data: [{ name, startTime, endTime }] }` |

## GPS Acquisition Flow

```
1. On screen mount, request GPS permission
2. If denied → Show error: "Cần cấp quyền GPS để chấm công"
3. If granted → Show "Đang lấy vị trí..." with spinner
4. On GPS lock → Show distance, set status = VERIFIED
5. On GPS error → Show "Không thể lấy vị trí", allow retry
6. On QR scan → Send qrCode + gpsLat + gpsLng to server
```

## Scan Type Logic

```
1. Check today's attendance records for current user
2. If last record is IN → scanType = OUT
3. If no record or last record is OUT → scanType = IN
4. Auto-OUT at 23:59 if employee forgets to scan OUT
```

## Loading State

| State | Behavior |
|-------|----------|
| Camera loading | Spinner with "Đang khởi động camera..." |
| GPS acquiring | Status bar: "Đang lấy vị trí..." with spinner |
| Scanning | Scan frame animates (pulsing border) |
| Submitting | "Đang xử lý..." overlay on scan result |
| Success | Green checkmark overlay with details |
| Failure | Red X overlay with reason |

## Empty State

Not applicable (camera is always active on this screen).

## Error Display

| Error Code | Display | Message |
|------------|---------|---------|
| QR_EXPIRED | Failure overlay | "Mã QR đã hết hạn. Vui lòng quét lại mã mới" |
| GPS_DISTANCE_EXCEEDED | Failure overlay | "Khoảng cách {distance}m vượt ngưỡng {threshold}m" |
| INVALID_QR | Failure overlay | "Mã QR không hợp lệ" |
| ALREADY_CHECKED_IN | Toast | "Bạn đã chấm công vào hôm nay" |
| CAMERA_DENIED | Error card | "Cần cấp quyền camera để quét mã QR" |
| GPS_DENIED | Error card | "Cần cấp quyền GPS để chấm công" |
| NETWORK_ERROR | Toast | "Mất kết nối. Kiểm tra mạng" |
| MAX_ATTEMPTS | Lockout | "Quá nhiều lần thử. Tài khoản tạm khóa 15 phút" |

## Mobile Layout Chi tiết (Employee)

### Trạng thái mặc định — Camera Sẵn sàng

```
┌─────────────────────────────────────┐
│ ◀ Quét mã QR              ⚙️      │ ← Header trong suốt
├─────────────────────────────────────┤
│                                     │
│                                     │
│         CAMERA VIEWFINDER           │
│         (Toàn màn hình)            │
│                                     │
│    ┌───────────────────────────┐   │
│    │  ·  ·  ·  ·  ·  ·  ·  · │   │
│    │  ·                     · │   │
│    │  ·   ┌─────────────┐   · │   │
│    │  ·   │             │   · │   │
│    │  ·   │  QR FRAME   │   · │   │ ← Khung quét, viền animation
│    │  ·   │  (animated) │   · │   │
│    │  ·   │             │   · │   │
│    │  ·   └─────────────┘   · │   │
│    │  ·                     · │   │
│    │  ·  ·  ·  ·  ·  ·  ·  · │   │
│    └───────────────────────────┘   │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 📍 GPS: ✅ Đã xác định       │ │ ← Bottom bar
│  │ 📏 Khoảng cách: 12m          │ │
│  │ 🕐 Ca: Sáng (06:00-14:00)   │ │
│  │ ─────────────────────────────│ │
│  │ Trạng thái: Sẵn sàng quét   │ │
│  └───────────────────────────────┘ │
│                                     │
│    ┌───────────────────────────┐   │
│    │      🔄 Đổi camera        │   │ ← Nút chuyển camera
│    └───────────────────────────┘   │
└─────────────────────────────────────┘
```

### Đang lấy GPS

```
┌─────────────────────────────────────┐
│ ◀ Quét mã QR              ⚙️      │
├─────────────────────────────────────┤
│                                     │
│         CAMERA VIEWFINDER           │
│                                     │
│    ┌───────────────────────────┐   │
│    │                           │   │
│    │   ┌─────────────────┐    │   │
│    │   │   📍 Đang lấy   │    │   │
│    │   │   vị trí...      │    │   │
│    │   │   ◌ ◌ ◌ ◌ ◌     │    │   │ ← GPS spinner
│    │   └─────────────────┘    │   │
│    │                           │   │
│    └───────────────────────────┘   │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 📍 GPS: ⏳ Đang xác định...  │ │
│  │ 📏 Khoảng cách: -- m         │ │
│  │ 🕐 Ca: Sáng (06:00-14:00)   │ │
│  │ ─────────────────────────────│ │
│  │ ⚠️ Vui lòng chờ GPS          │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Quét thành công — Check-in

```
┌─────────────────────────────────────┐
│ ◀ Quét mã QR              ⚙️      │
├─────────────────────────────────────┤
│                                     │
│         CAMERA VIEWFINDER           │
│         (dimmed overlay)            │
│                                     │
│    ┌───────────────────────────┐   │
│    │                           │   │
│    │      ✅                   │   │
│    │   CHẤM CÔNG VÀO          │   │ ← Overlay thành công
│    │   THÀNH CÔNG!            │   │
│    │                           │   │
│    │   🕐 08:02:15             │   │
│    │   📏 Khoảng cách: 12m    │   │
│    │   📋 Ca: Sáng            │   │
│    │                           │   │
│    │   ┌───────────────────┐  │   │
│    │   │    ✕ Đóng         │  │   │ ← Nút đóng
│    │   └───────────────────┘  │   │
│    │                           │   │
│    └───────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Quét thành công — Check-out

```
┌─────────────────────────────────────┐
│ ◀ Quét mã QR              ⚙️      │
├─────────────────────────────────────┤
│                                     │
│         CAMERA VIEWFINDER           │
│         (dimmed overlay)            │
│                                     │
│    ┌───────────────────────────┐   │
│    │                           │   │
│    │      ✅                   │   │
│    │   CHẤM CÔNG RA           │   │
│    │   THÀNH CÔNG!            │   │
│    │                           │   │
│    │   🕐 17:05:30             │   │
│    │   📏 Khoảng cách: 8m     │   │
│    │   ⏱️ Thời gian làm: 9h3m │   │
│    │   📋 Ca: Sáng            │   │
│    │                           │   │
│    │   ┌───────────────────┐  │   │
│    │   │    ✕ Đóng         │  │   │
│    │   └───────────────────┘  │   │
│    │                           │   │
│    └───────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Quét thất bại — Khoảng cách vượt ngưỡng

```
┌─────────────────────────────────────┐
│ ◀ Quét mã QR              ⚙️      │
├─────────────────────────────────────┤
│                                     │
│         CAMERA VIEWFINDER           │
│         (dimmed overlay)            │
│                                     │
│    ┌───────────────────────────┐   │
│    │                           │   │
│    │      ❌                   │   │
│    │   CHẤM CÔNG              │   │
│    │   THẤT BẠI!              │   │
│    │                           │   │
│    │   Lý do:                  │   │
│    │   Khoảng cách vượt ngưỡng │   │
│    │   📏 85m > 50m            │   │
│    │                           │   │
│    │   ┌───────────────────┐  │   │
│    │   │  🔄 Quét lại      │  │   │ ← Nút quét lại
│    │   └───────────────────┘  │   │
│    │                           │   │
│    └───────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Lỗi Camera / GPS bị từ chối

```
┌─────────────────────────────────────┐
│ ◀ Quét mã QR              ⚙️      │
├─────────────────────────────────────┤
│                                     │
│    ┌───────────────────────────┐   │
│    │                           │   │
│    │      📷                   │   │
│    │   Camera bị từ chối       │   │
│    │                           │   │
│    │   Vui lòng cấp quyền     │   │
│    │   camera trong cài đặt    │   │
│    │   thiết bị để sử dụng    │   │
│    │   tính năng quét QR.      │   │
│    │                           │   │
│    │   ┌───────────────────┐  │   │
│    │   │  ⚙️ Mở cài đặt   │  │   │
│    │   └───────────────────┘  │   │
│    │                           │   │
│    │   ┌───────────────────┐  │   │
│    │   │  🔄 Thử lại       │  │   │
│    │   └───────────────────┘  │   │
│    │                           │   │
│    └───────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Touch Target & Safe Areas

| Element | Min Size | Notes |
|---------|----------|-------|
| QR Frame | 200×200px centered | Camera auto-detect, no tap needed |
| Đóng button | 48×48px | Bottom of success overlay |
| Quét lại button | 48×48px | Bottom of failure overlay |
| Đổi camera | 44×44px | Top-right corner |
| Header back | 44×44px | Top-left, safe area inset |
| Bottom status bar | Full width × 80px | Safe area bottom inset |

### Animation Details

| Element | Animation | Duration |
|---------|-----------|----------|
| QR frame border | Pulsing glow (blue → transparent) | 2s loop |
| Success checkmark | Scale 0→1 + bounce | 0.5s |
| Failure X | Shake left-right | 0.3s |
| GPS spinner | Rotating | 1s loop |
| Overlay fade-in | Opacity 0→0.8 | 0.2s |

## Responsive Rules

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Full-screen camera, bottom status bar, safe area insets |
| Tablet | Camera in centered card (max 480px), status panel on right |
| Desktop | Camera in centered card (max 480px), status panel below |

## Haptic Feedback

| Event | Pattern |
|-------|---------|
| QR scanned successfully | Light vibration (10ms) |
| Check-in success | Medium vibration (20ms) |
| Check-in failed | Heavy vibration (30ms) |

## Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-SCR04-01 | Camera viewfinder opens within 2 seconds |
| AC-SCR04-02 | GPS acquired within 5 seconds (or shows error) |
| AC-SCR04-03 | QR code auto-detected from camera feed |
| AC-SCR04-04 | Scan result shows within 1 second of QR detection |
| AC-SCR04-05 | Distance displayed accurately (Haversine formula) |
| AC-SCR04-06 | Success overlay shows: type (IN/OUT), time, distance |
| AC-SCR04-07 | Failure overlay shows: reason and distance if applicable |
| AC-SCR04-08 | "Quét lại" button resets scanner properly |
| AC-SCR04-09 | Haptic feedback on scan result |
| AC-SCR04-10 | Camera permission denied shows helpful error |
| AC-SCR04-11 | GPS permission denied shows helpful error |
| AC-SCR04-12 | Auto-detects IN vs OUT based on attendance history |
| AC-SCR04-13 | Works on 320px minimum width |
| AC-SCR04-14 | No manual location input allowed |
| AC-SCR04-15 | Unlimited scan retry (no lock on distance failure) |
