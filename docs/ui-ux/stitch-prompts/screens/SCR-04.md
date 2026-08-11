# Stitch Prompt: SCR-04 — Quét mã QR & GPS

## Screen Identity

| Field | Value |
|-------|-------|
| Screen ID | SCR-04 |
| Screen Name | Quét mã QR & GPS |
| Route | `/qr/scan` |
| Use Case | UC-03 |
| Actors | EMPLOYEE |
| Layout | Full-screen camera overlay (inside App Shell) |

## User Role & Goal

EMPLOYEE scans a QR code displayed by the admin. The system verifies the QR signature and GPS location (within 50m threshold), then records attendance (check-in or check-out).

## GLOBAL APP SHELL LOCK

> This screen uses the approved App Shell. DO NOT modify the shell. Only design the camera overlay content area.

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

## QR Scan Frame

- **Size**: 250×250px centered
- **Border**: 3px dashed `--color-primary` (#2563EB)
- **Animation**: Pulsing border (scale 1.0 → 1.05 → 1.0, 1.5s loop)
- **Corner markers**: 4 L-shaped corners in primary color

## GPS Status Bar

| State | Display | Color |
|-------|---------|-------|
| ACQUIRING | "📍 GPS: Đang lấy vị trí..." + spinner | Warning `#D97706` |
| VERIFIED | "📍 GPS: Đã xác minh" + distance | Success `#16A34A` |
| FAILED | "📍 GPS: Không thể lấy vị trí" + retry | Error `#DC2626` |

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

## Success Overlay

```
┌─────────────────────────────────────────────────┐
│          ┌─────────────────────┐                │
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
└─────────────────────────────────────────────────┘
```

## Failure Overlay

```
┌─────────────────────────────────────────────────┐
│          ┌─────────────────────┐                │
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
└─────────────────────────────────────────────────┘
```

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
| scanAttendance | POST | `/api/v1/attendance/scan` | `{ qrCode: string, gpsLat: number, gpsLng: number }` | `{ data: { id, type, timestamp, distance, status, message } }` |
| getCurrentShift | GET | `/api/v1/shifts` | — | `{ data: [{ name, startTime, endTime }] }` |

## States

| State | Behavior |
|-------|----------|
| Camera loading | Spinner with "Đang khởi động camera..." |
| GPS acquiring | Status bar: "Đang lấy vị trí..." with spinner |
| Scanning | Scan frame animates (pulsing border) |
| Submitting | "Đang xử lý..." overlay on scan result |
| Success | Green checkmark overlay with details |
| Failure | Red X overlay with reason |

## Haptic Feedback

| Event | Pattern |
|-------|---------|
| QR scanned successfully | Light vibration (10ms) |
| Check-in success | Medium vibration (20ms) |
| Check-in failed | Heavy vibration (30ms) |

## Mobile Layout Chi tiết (Employee)

### Trạng thái mặc định — Camera Sẵn sàng

```
┌─────────────────────────────────────┐
│ ◀ Quét mã QR              ⚙️      │
├─────────────────────────────────────┤
│                                     │
│         CAMERA VIEWFINDER           │
│         (Toàn màn hình)            │
│                                     │
│    ┌───────────────────────────┐   │
│    │  ·  ·  ·  ·  ·  ·  ·  · │   │
│    │  ·   ┌─────────────┐   · │   │
│    │  ·   │  QR FRAME   │   · │   │
│    │  ·   │  (animated) │   · │   │
│    │  ·   └─────────────┘   · │   │
│    │  ·  ·  ·  ·  ·  ·  ·  · │   │
│    └───────────────────────────┘   │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ 📍 GPS: ✅ Đã xác định       │ │
│  │ 📏 Khoảng cách: 12m          │ │
│  │ 🕐 Ca: Sáng (06:00-14:00)   │ │
│  │ ─────────────────────────────│ │
│  │ Trạng thái: Sẵn sàng quét   │ │
│  └───────────────────────────────┘ │
│                                     │
│    ┌───────────────────────────┐   │
│    │      🔄 Đổi camera        │   │
│    └───────────────────────────┘   │
└─────────────────────────────────────┘
```

### Đang lấy GPS

```
┌─────────────────────────────────────┐
│ ◀ Quét mã QR              ⚙️      │
├─────────────────────────────────────┤
│         CAMERA VIEWFINDER           │
│    ┌───────────────────────────┐   │
│    │   ┌─────────────────┐    │   │
│    │   │   📍 Đang lấy   │    │   │
│    │   │   vị trí...      │    │   │
│    │   │   ◌ ◌ ◌ ◌ ◌     │    │   │
│    │   └─────────────────┘    │   │
│    └───────────────────────────┘   │
│  ┌───────────────────────────────┐ │
│  │ 📍 GPS: ⏳ Đang xác định...  │ │
│  │ ⚠️ Vui lòng chờ GPS          │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Quét thành công — Check-in

```
┌─────────────────────────────────────┐
│ ◀ Quét mã QR              ⚙️      │
├─────────────────────────────────────┤
│         CAMERA (dimmed)             │
│    ┌───────────────────────────┐   │
│    │      ✅                   │   │
│    │   CHẤM CÔNG VÀO          │   │
│    │   THÀNH CÔNG!            │   │
│    │   🕐 08:02:15             │   │
│    │   📏 Khoảng cách: 12m    │   │
│    │   ┌───────────────────┐  │   │
│    │   │    ✕ Đóng         │  │   │
│    │   └───────────────────┘  │   │
│    └───────────────────────────┘   │
└─────────────────────────────────────┘
```

### Quét thành công — Check-out

```
┌─────────────────────────────────────┐
│ ◀ Quét mã QR              ⚙️      │
├─────────────────────────────────────┤
│         CAMERA (dimmed)             │
│    ┌───────────────────────────┐   │
│    │      ✅                   │   │
│    │   CHẤM CÔNG RA           │   │
│    │   THÀNH CÔNG!            │   │
│    │   🕐 17:05:30             │   │
│    │   📏 Khoảng cách: 8m     │   │
│    │   ⏱️ Thời gian làm: 9h3m │   │
│    │   ┌───────────────────┐  │   │
│    │   │    ✕ Đóng         │  │   │
│    │   └───────────────────┘  │   │
│    └───────────────────────────┘   │
└─────────────────────────────────────┘
```

### Quét thất bại

```
┌─────────────────────────────────────┐
│ ◀ Quét mã QR              ⚙️      │
├─────────────────────────────────────┤
│         CAMERA (dimmed)             │
│    ┌───────────────────────────┐   │
│    │      ❌                   │   │
│    │   CHẤM CÔNG THẤT BẠI!   │   │
│    │   Lý do:                  │   │
│    │   📏 85m > 50m            │   │
│    │   ┌───────────────────┐  │   │
│    │   │  🔄 Quét lại      │  │   │
│    │   └───────────────────┘  │   │
│    └───────────────────────────┘   │
└─────────────────────────────────────┘
```

### Lỗi Camera / GPS bị từ chối

```
┌─────────────────────────────────────┐
│ ◀ Quét mã QR              ⚙️      │
├─────────────────────────────────────┤
│    ┌───────────────────────────┐   │
│    │      📷                   │   │
│    │   Camera bị từ chối       │   │
│    │   Vui lòng cấp quyền     │   │
│    │   camera trong cài đặt    │   │
│    │   ┌───────────────────┐  │   │
│    │   │  ⚙️ Mở cài đặt   │  │   │
│    │   └───────────────────┘  │   │
│    │   ┌───────────────────┐  │   │
│    │   │  🔄 Thử lại       │  │   │
│    │   └───────────────────┘  │   │
│    └───────────────────────────┘   │
└─────────────────────────────────────┘
```

### Touch Target & Safe Areas

| Element | Min Size | Notes |
|---------|----------|-------|
| QR Frame | 200×200px centered | Camera auto-detect |
| Đóng/Quét lại | 48×48px | Bottom of overlay |
| Đổi camera | 44×44px | Top-right |
| Header back | 44×44px | Safe area inset |

### Animation Details

| Element | Animation | Duration |
|---------|-----------|----------|
| QR frame border | Pulsing glow | 2s loop |
| Success checkmark | Scale 0→1 + bounce | 0.5s |
| Failure X | Shake | 0.3s |
| GPS spinner | Rotating | 1s loop |

## Responsive Rules

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Full-screen camera, bottom status bar, safe area insets |
| Tablet | Camera in centered card (max 480px), status panel on right |
| Desktop | Camera in centered card (max 480px), status panel below |

## Forbidden

- DO NOT allow manual location input
- DO NOT add a map view on this screen
- DO NOT add attendance history on this screen
- DO NOT change the scan type logic (IN/OUT auto-detection)
- DO NOT add scan retry limit (unlimited retries allowed)

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
