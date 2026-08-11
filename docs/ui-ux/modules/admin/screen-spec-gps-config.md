# SCR-10 — Cài đặt GPS (`/admin/gps-config`)

## General

| Field | Value |
|-------|-------|
| Screen ID | SCR-10 |
| Screen Name | Cài đặt GPS |
| Route | `/admin/gps-config` |
| Use Case | — (Admin Config, not in original use cases) |
| Actors | ADMIN |
| Priority | P2 |
| Layout | App Shell with content area |

> **Lưu ý**: Screen này được tạo từ OpenAPI endpoints (`GET/PUT /config/gps`). Không có use case tương ứng trong requirement inventory, nhưng cần thiết cho cấu hình GPS verification.

## Layout

```
┌─────────────────────────────────────────────────┐
│  Cài đặt GPS                                     │
├─────────────────────────────────────────────────┤
│                                                 │
│  📍 Vị trí văn phòng                            │
│  ┌───────────────────────────────────────────┐  │
│  │  Vĩ độ (Latitude) *                       │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │ 10.762622                           │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │                                           │  │
│  │  Kinh độ (Longitude) *                    │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │ 106.660172                          │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  📏 Cài đặt xác minh                            │
│  ┌───────────────────────────────────────────┐  │
│  │  Bán kính giới hạn (mét) *                │  │
│  │  ┌─────────────────────────────────────┐  │  │
│  │  │ 50                                  │  │  │
│  │  └─────────────────────────────────────┘  │  │
│  │  (Giá trị hợp lệ: 20-50m)               │  │
│  │                                           │  │
│  │  Fallback WiFi                            │  │
│  │  [Toggle: Bật/Tắt]                        │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  [Bản đồ preview]                         │  │
│  │  (Hiển thị vị trí văn phòng trên bản đồ) │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  [💾 Lưu cài đặt]                               │
└─────────────────────────────────────────────────┘
```

## Fields

| Field | Type | Required | Validation | Default |
|-------|------|----------|------------|---------|
| latitude | number | Yes | -90 to 90, 6 decimal places | Company GPS |
| longitude | number | Yes | -180 to 180, 6 decimal places | Company GPS |
| threshold | number | Yes | 20–50 meters | 50 |
| wifiFallback | boolean | No | — | false |

## Actions

| Action | Trigger | API Call | Behavior |
|--------|---------|----------|----------|
| Load config | Screen mount | `GET /api/v1/config/gps` | Load current GPS config |
| Save config | Button click | `PUT /api/v1/config/gps` | Save GPS configuration |
| Use current location | Button click | — | Get device GPS and fill lat/lng |

## API Operations

| Operation | Method | Endpoint | Request | Response |
|-----------|--------|----------|---------|----------|
| getGPSConfig | GET | `/api/v1/config/gps` | — | `{ latitude, longitude, threshold, wifiFallback }` |
| updateGPSConfig | PUT | `/api/v1/config/gps` | `{ latitude, longitude, threshold, wifiFallback }` | `{ latitude, longitude, threshold, wifiFallback }` |

## Loading State

| State | Behavior |
|-------|----------|
| Loading | Skeleton form |
| Success | Form with data |
| Saving | Button spinner, form disabled |
| Error | Error card with retry |

## Empty State

Not applicable (form always has fields with defaults).

## Error Display

| Error Code | Display | Message |
|------------|---------|---------|
| VALIDATION_ERROR | Inline | Field-level errors (threshold out of range) |
| INVALID_COORDINATES | Inline | "Tọa độ không hợp lệ" |
| UNAUTHORIZED | Redirect | → `/login` |
| NETWORK_ERROR | Toast | "Lỗi mạng. Thử lại" |

## Responsive Rules

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Full-width form, map below form |
| Tablet | Form + map side by side |
| Desktop | Form + map side by side, larger map |

## Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-SCR10-01 | Form loads current GPS config |
| AC-SCR10-02 | Latitude validated: -90 to 90 |
| AC-SCR10-03 | Longitude validated: -180 to 180 |
| AC-SCR10-04 | Threshold validated: 20-50m |
| AC-SCR10-05 | WiFi fallback toggle works |
| AC-SCR10-06 | Save calls correct API |
| AC-SCR10-07 | Map preview shows office location |
| AC-SCR10-08 | "Use current location" fills coordinates |
| AC-SCR10-09 | Touch target ≥ 44px |
| AC-SCR10-10 | Works at 320px minimum width |
