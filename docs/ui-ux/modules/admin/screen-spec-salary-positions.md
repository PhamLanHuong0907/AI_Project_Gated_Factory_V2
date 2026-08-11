> ⚠️ **OBSOLETE**: This screen has been merged into SCR-07 Tab 1. See `screen-spec-salary-config.md`.

# SCR-11 — Cấu hình lương theo vị trí (`/admin/salary-positions`) [OBSOLETE]

## General

| Field | Value |
|-------|-------|
| Screen ID | SCR-11 |
| Screen Name | Cấu hình lương theo vị trí |
| Route | `/admin/salary-positions` |
| Use Case | — (Admin Config) |
| Actors | ADMIN |
| Priority | P1 |
| Layout | App Shell with content area |

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Cấu hình lương theo vị trí        [+ Thêm vị trí mới]     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Mã VT   Tên vị trí        Lương cơ bản    Trạng thái│  │
│  │  ──────────────────────────────────────────────────── │  │
│  │  NV      Nhân viên         8,000,000       ✅        │  │
│  │  QL      Quản lý           15,000,000      ✅        │  │
│  │  GD      Giám đốc          25,000,000      ✅        │  │
│  │  KT      Kế toán           12,000,000      ❌        │  │
│  │                                                     │  │
│  │  [✏️ Sửa]  [🗑️ Xoá]                                │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Create/Edit Modal

```
┌─────────────────────────────────────┐
│  Thêm vị trí mới              [X]   │
├─────────────────────────────────────┤
│                                     │
│  Mã vị trí *                        │
│  ┌─────────────────────────────┐   │
│  │ NV                            │   │
│  └─────────────────────────────┘   │
│                                     │
│  Tên vị trí *                       │
│  ┌─────────────────────────────┐   │
│  │ Nhân viên                    │   │
│  └─────────────────────────────┘   │
│                                     │
│  Lương cơ bản (VND) *              │
│  ┌─────────────────────────────┐   │
│  │ 8000000                      │   │
│  └─────────────────────────────┘   │
│                                     │
│  Trạng thái                         │
│  [Kích hoạt ✓]                     │
│                                     │
│  [Huỷ]              [Lưu]          │
└─────────────────────────────────────┘
```

## Fields

| Field | Type | Required | Validation | Default |
|-------|------|----------|------------|---------|
| code | text | Yes | 2-50 chars, unique | — |
| name | text | Yes | 2-100 chars | — |
| baseSalary | number | Yes | Min 0, step 100000 | — |
| isActive | boolean | No | — | true |

## Actions

| Action | Trigger | API Call | Behavior |
|--------|---------|----------|----------|
| Thêm vị trí mới | Button click | — | Open create modal |
| Lưu | Modal save | `POST /api/v1/salary/positions` | Create position |
| Sửa | Row action | — | Open edit modal |
| Cập nhật | Modal save | `PUT /api/v1/salary/positions/{id}` | Update position |
| Xoá | Row action | — | Confirmation dialog |
| Xác nhận xoá | Dialog confirm | `DELETE /api/v1/salary/positions/{id}` | Delete position |

## API Operations

| Operation | Method | Endpoint | Request | Response |
|-----------|--------|----------|---------|----------|
| getPositions | GET | `/api/v1/salary/positions` | — | `[{ id, code, name, baseSalary, isActive }]` |
| createPosition | POST | `/api/v1/salary/positions` | `{ code, name, baseSalary }` | `{ id, ... }` |
| updatePosition | PUT | `/api/v1/salary/positions/{id}` | `{ code, name, baseSalary, isActive }` | `{ id, ... }` |
| deletePosition | DELETE | `/api/v1/salary/positions/{id}` | — | 204 |

## Error Display

| Error Code | Display | Message |
|------------|---------|---------|
| CODE_EXISTS | Modal inline | "Mã vị trí đã tồn tại" |
| POSITION_IN_USE | Toast | "Vị trí đang được sử dụng. Không thể xoá" |
| VALIDATION_ERROR | Modal inline | Field-level errors |

## Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-SCR11-01 | List shows all positions with correct data |
| AC-SCR11-02 | Create modal opens with empty form |
| AC-SCR11-03 | Edit modal opens with pre-filled data |
| AC-SCR11-04 | Code is unique across positions |
| AC-SCR11-05 | Base salary accepts numeric input only |
| AC-SCR11-06 | Delete shows confirmation dialog |
| AC-SCR11-07 | Cannot delete position in use by employee |
| AC-SCR11-08 | Touch target ≥ 44px |
| AC-SCR11-09 | Works at 320px minimum width |
