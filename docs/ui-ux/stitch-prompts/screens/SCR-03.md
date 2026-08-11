# Stitch Prompt: SCR-03 — Tạo mã QR

## Screen Identity

| Field | Value |
|-------|-------|
| Screen ID | SCR-03 |
| Screen Name | Tạo mã QR Chấm công |
| Route | `/qr/generate` |
| Use Case | UC-02 |
| Actors | ADMIN |
| Layout | App Shell with centered content |

## User Role & Goal

ADMIN generates a dynamic QR code for employees to scan. The QR code auto-expires after a configurable time (15-30s) and can be manually refreshed.

## GLOBAL APP SHELL LOCK

> This screen uses the approved App Shell. DO NOT modify the shell. Only design the content area.

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
| qrCode | string | API | Mã QR code content (base64 image) |
| expiresAt | datetime | API | Thời gian hết hạn |
| countdown | timer | Client | Đếm ngược thời gian còn lại |
| status | enum | Client | `WAITING` / `ACTIVE` / `EXPIRED` |

## QR Code Display

- **Size**: 180×180px (mobile), 200×200px (tablet), 240×240px (desktop)
- **Border**: 2px solid `--color-border`
- **Background**: White
- **Shadow**: `--shadow-md`

## Countdown Timer

- **Display**: "⏱️ MM:SS còn lại"
- **Progress bar**: Horizontal, height 8px, `--color-primary` fill, `--color-border` background
- **Colors**: Green when >50%, Yellow when 20-50%, Red when <20%
- **Auto-refresh**: When countdown reaches 0, auto-generate new QR

## Actions

| Action | Trigger | API Call | Behavior |
|--------|---------|----------|----------|
| Tạo mã QR | Button click (or auto on mount) | `POST /api/v1/qr/generate` | Generate new QR code |
| Tạo lại khi hết hạn | Auto / Button | `POST /api/v1/qr/generate` | Auto-refresh on expiry |
| Copy mã QR | Icon click | — | Copy QR content to clipboard |

## API Operations

| Operation | Method | Endpoint | Request | Response |
|-----------|--------|----------|---------|----------|
| generateQR | POST | `/api/v1/qr/generate` | — | `{ data: { id: string, code: string, expiresAt: string } }` |
| getCurrentQR | GET | `/api/v1/qr/current` | — | `{ data: { id: string, code: string, expiresAt: string } }` |

## States

### Loading State
- Spinner in QR area (40×40px, primary color)

### Active State
- QR displayed with countdown timer
- Status: "Trạng thái: Đang hoạt động" (green badge)

### Expired State
- QR grayed out (opacity: 0.5)
- Status: "Mã đã hết hạn" (red badge)
- "Tạo mã mới" button becomes prominent (larger, primary color)

### Empty State
- QR Code illustration
- "Chưa có mã QR"
- "Nhấn nút bên dưới để tạo mã mới"
- [🔄 Tạo mã QR] button

## Responsive Rules

| Breakpoint | Behavior |
|------------|----------|
| Mobile | QR 180×180px, full-width card |
| Tablet | QR 200×200px, centered card |
| Desktop | QR 240×240px, centered with shadow |

## Forbidden

- DO NOT add shift selection on this screen
- DO NOT add employee list below QR
- DO NOT add QR download/print functionality
- DO NOT add QR history
- DO NOT change the countdown timer behavior

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
