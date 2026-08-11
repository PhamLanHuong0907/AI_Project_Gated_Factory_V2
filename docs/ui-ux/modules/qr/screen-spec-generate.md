# SCR-03 — Tạo mã QR (`/qr/generate`)

## General

| Field | Value |
|-------|-------|
| Screen ID | SCR-03 |
| Screen Name | Tạo mã QR |
| Route | `/qr/generate` |
| Use Case | UC-02 |
| Actors | ADMIN |
| Priority | P0 |
| Layout | App Shell with centered content |

## Layout

```
┌─────────────────────────────────────────────────┐
│                                                 │
│              TẠO MÃ QR CHẤM CÔNG               │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │                                           │  │
│  │         ┌─────────────────────┐           │  │
│  │         │                     │           │  │
│  │         │    [QR CODE]        │           │  │
│  │         │    (200x200px)      │           │  │
│  │         │                     │           │  │
│  │         └─────────────────────┘           │  │
│  │                                           │  │
│  │         ⏱️ 02:30 còn lại                   │  │
│  │         ████████████░░░░ 60%              │  │
│  │                                           │  │
│  │         Trạng thái: Đang hoạt động        │  │
│  │                                           │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  [🔄 Tạo mã mới]                               │
│                                                 │
│  ℹ️ Mã QR tự động làm mới sau khi hết hạn      │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Fields

| Field | Type | Source | Description |
|-------|------|--------|-------------|
| qrCode | string | API | Mã QR code content |
| expiresAt | datetime | API | Thời gian hết hạn |
| countdown | timer | Client | Đếm ngược thời gian còn lại |
| status | enum | Client | `WAITING` / `ACTIVE` / `EXPIRED` |

## Actions

| Action | Trigger | API Call | Behavior |
|--------|---------|----------|----------|
| Tạo mã QR | Button click | `POST /api/v1/qr/generate` | Generate new QR code |
| Tạo lại khi hết hạn | Auto / Button | `POST /api/v1/qr/generate` | Auto-refresh on expiry |
| Copy mã QR | Icon click | — | Copy QR content to clipboard |

## API Operations

| Operation | Method | Endpoint | Request | Response |
|-----------|--------|----------|---------|----------|
| generateQR | POST | `/api/v1/qr/generate` | — | `{ data: { id, code, expiresAt } }` |
| getCurrentQR | GET | `/api/v1/qr/current` | — | `{ data: { id, code, expiresAt } }` |

## Loading State

| State | Behavior |
|-------|----------|
| Loading (initial) | Spinner in QR area |
| Loading (refresh) | Countdown pauses, spinner overlay on QR |
| Active | QR displayed with countdown timer |
| Expired | QR grayed out, "Mã đã hết hạn" badge, "Tạo mã mới" button prominent |

## Empty State

```
┌─────────────────────────────────────────┐
│                                         │
│         [QR Code Illustration]          │
│                                         │
│    "Chưa có mã QR"                      │
│    Nhấn nút bên dưới để tạo mã mới     │
│                                         │
│         [🔄 Tạo mã QR]                  │
│                                         │
└─────────────────────────────────────────┘
```

## Error Display

| Error Code | Display | Message |
|------------|---------|---------|
| RATE_LIMITED | Toast | "Tạo quá nhanh. Vui lòng thử lại sau {retryAfter}s" |
| QR_GENERATION_FAILED | Toast | "Không thể tạo mã QR. Thử lại" |
| NETWORK_ERROR | Toast | "Mất kết nối. Kiểm tra mạng" |

## Responsive Rules

| Breakpoint | Behavior |
|------------|----------|
| Mobile | QR code 180x180px, full-width card |
| Tablet | QR code 200x200px, centered card |
| Desktop | QR code 240x240px, centered with shadow |

## Countdown Timer Logic

```
1. On QR generate response, store expiresAt
2. Start interval: countdown = expiresAt - now
3. When countdown ≤ 0:
   - Set status = EXPIRED
   - Show "Tạo mã mới" button
   - Stop interval
4. On "Tạo mã mới" click:
   - Call POST /api/v1/qr/generate
   - Reset countdown
```

## Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-SCR03-01 | QR code displays correctly after generation |
| AC-SCR03-02 | Countdown timer shows remaining time accurately |
| AC-SCR03-03 | QR auto-expires when countdown reaches 0 |
| AC-SCR03-04 | "Tạo mã mới" button generates fresh QR |
| AC-SCR03-05 | QR code is large enough to scan (≥ 180px) |
| AC-SCR03-06 | Status indicator shows current state |
| AC-SCR03-07 | Loading spinner during QR generation |
| AC-SCR03-08 | Touch target ≥ 44px for all buttons |
| AC-SCR03-09 | Works at 320px minimum width |
| AC-SCR03-10 | QR content is valid (server-side encrypted, 15-30s TTL) |
