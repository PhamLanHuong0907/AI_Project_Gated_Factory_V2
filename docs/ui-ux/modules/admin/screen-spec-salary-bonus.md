> ⚠️ **OBSOLETE**: This screen has been merged into SCR-07 Tab 4. See `screen-spec-salary-config.md`.

# SCR-14 — Cấu hình lương khác (Thưởng) (`/admin/salary-bonus`) [OBSOLETE]

## General

| Field | Value |
|-------|-------|
| Screen ID | SCR-14 |
| Screen Name | Cấu hình lương khác (Thưởng) |
| Route | `/admin/salary-bonus` |
| Use Case | — (Admin Config) |
| Actors | ADMIN |
| Priority | P1 |
| Layout | App Shell with content area |

## Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Cấu hình thưởng               [+ Thêm thưởng mới]         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Mã TL   Tên thưởng           Số tiền    Mô tả       │  │
│  │  ──────────────────────────────────────────────────── │  │
│  │  TH-HQ   Thưởng hiệu quả     2,000,000  Đánh giá Q1 │  │
│  │  TH-HT   Thưởng hoàn thành   1,000,000  Hoàn thành  │  │
│  │  TH-ST   Thưởng sáng tạo     500,000    Ý tưởng mới │  │
│  │  TH-TN   Thưởng trách nhiệm  1,500,000  Đảm bảo Q2  │  │
│  │                                                     │  │
│  │  [✏️ Sửa]  [🗑️ Xoá]                                │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Create/Edit Modal

```
┌─────────────────────────────────────────┐
│  Thêm thưởng mới                 [X]   │
├─────────────────────────────────────────┤
│                                         │
│  Mã thưởng *                            │
│  ┌─────────────────────────────┐       │
│  │ TH-HQ                        │       │
│  └─────────────────────────────┘       │
│                                         │
│  Tên thưởng *                           │
│  ┌─────────────────────────────┐       │
│  │ Thưởng hiệu quả             │       │
│  └─────────────────────────────┘       │
│                                         │
│  Số tiền thưởng (VND) *                 │
│  ┌─────────────────────────────┐       │
│  │ 2000000                      │       │
│  └─────────────────────────────┘       │
│                                         │
│  Mô tả                                 │
│  ┌─────────────────────────────┐       │
│  │ Thưởng cho nhân viên có     │       │
│  │ thành tích xuất sắc         │       │
│  └─────────────────────────────┘       │
│                                         │
│  [Huỷ]              [Lưu]              │
└─────────────────────────────────────────┘
```

## Fields

| Field | Type | Required | Validation | Default |
|-------|------|----------|------------|---------|
| code | text | Yes | 2-50 chars, unique | — |
| name | text | Yes | 2-100 chars | — |
| amount | number | Yes | Min 0, step 10000 | — |
| description | textarea | No | Max 500 chars | — |
| isActive | boolean | No | — | true |

## Actions

| Action | Trigger | API Call | Behavior |
|--------|---------|----------|----------|
| Thêm thưởng mới | Button click | — | Open create modal |
| Lưu | Modal save | `POST /api/v1/salary/bonus` | Create bonus |
| Sửa | Row action | — | Open edit modal |
| Cập nhật | Modal save | `PUT /api/v1/salary/bonus/{id}` | Update bonus |
| Xoá | Row action | — | Confirmation dialog |
| Xác nhận xoá | Dialog confirm | `DELETE /api/v1/salary/bonus/{id}` | Delete bonus |

## API Operations

| Operation | Method | Endpoint | Request | Response |
|-----------|--------|----------|---------|----------|
| getBonus | GET | `/api/v1/salary/bonus` | — | `[{ id, code, name, amount, description, isActive }]` |
| createBonus | POST | `/api/v1/salary/bonus` | `{ code, name, amount, description }` | `{ id, ... }` |
| updateBonus | PUT | `/api/v1/salary/bonus/{id}` | `{ code, name, amount, description, isActive }` | `{ id, ... }` |
| deleteBonus | DELETE | `/api/v1/salary/bonus/{id}` | — | 204 |

## Error Display

| Error Code | Display | Message |
|------------|---------|---------|
| CODE_EXISTS | Modal inline | "Mã thưởng đã tồn tại" |
| BONUS_IN_USE | Toast | "Thưởng đang được sử dụng. Không thể xoá" |
| VALIDATION_ERROR | Modal inline | Field-level errors |

## Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-SCR14-01 | List shows all bonus configs |
| AC-SCR14-02 | Create modal has all required fields |
| AC-SCR14-03 | Code is unique across bonuses |
| AC-SCR14-04 | Amount ≥ 0 |
| AC-SCR14-05 | Description is optional |
| AC-SCR14-06 | Edit modal pre-fills data |
| AC-SCR14-07 | Delete shows confirmation |
| AC-SCR14-08 | Cannot delete bonus in use |
| AC-SCR14-09 | Touch target ≥ 44px |
| AC-SCR14-10 | Works at 320px minimum width |
