> ⚠️ **OBSOLETE**: This screen has been merged into SCR-07 Tab 3. See `screen-spec-salary-config.md`.

# SCR-13 — Cấu hình lương thưởng phạt chấm công (`/admin/salary-penalties`) [OBSOLETE]

## General

| Field | Value |
|-------|-------|
| Screen ID | SCR-13 |
| Screen Name | Cấu hình lương thưởng phạt chấm công |
| Route | `/admin/salary-penalties` |
| Use Case | — (Admin Config) |
| Actors | ADMIN |
| Priority | P1 |
| Layout | App Shell with content area |

## Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Cấu hình phạt chấm công              [+ Thêm mức phạt mới]            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Loại: [Tất cả ▼]                                                      │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  Mã MP   Tên mức phạt       Loại     Từ phút  Đến phút  Phạt   │  │
│  │  ─────────────────────────────────────────────────────────────── │  │
│  │  PT-01   Trễ 1-5 phút       LATE     1        5         50,000  │  │
│  │  PT-02   Trễ 6-15 phút      LATE     6        15        100,000 │  │
│  │  PT-03   Trễ 16-30 phút     LATE     16       30        200,000 │  │
│  │  PT-04   Trễ > 30 phút      LATE     31       NULL      500,000 │  │
│  │  PT-05   Vắng mặt không P   ABSENT   0        NULL      1,000,000│ │
│  │                                                                   │  │
│  │  [✏️ Sửa]  [🗑️ Xoá]                                              │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Create/Edit Modal

```
┌─────────────────────────────────────────┐
│  Thêm mức phạt mới               [X]   │
├─────────────────────────────────────────┤
│                                         │
│  Mã mức phạt *                          │
│  ┌─────────────────────────────┐       │
│  │ PT-01                        │       │
│  └─────────────────────────────┘       │
│                                         │
│  Tên mức phạt *                         │
│  ┌─────────────────────────────┐       │
│  │ Trễ 1-5 phút                │       │
│  └─────────────────────────────┘       │
│                                         │
│  Loại phạt *                            │
│  [Đi trễ (LATE) ▼]                     │
│                                         │
│  Số phút tối thiểu *   Số phút tối đa   │
│  ┌──────────┐          ┌──────────┐     │
│  │ 1         │          │ 5         │   │
│  └──────────┘          └──────────┘     │
│  (để trống = không giới hạn)            │
│                                         │
│  Số tiền phạt (VND) *                   │
│  ┌─────────────────────────────┐       │
│  │ 50000                         │       │
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
| penaltyType | select | Yes | LATE, ABSENT | LATE |
| minMinutes | number | Yes | Min 0 | — |
| maxMinutes | number | No | ≥ minMinutes, nullable | NULL |
| penaltyAmount | number | Yes | Min 0, step 10000 | — |
| isActive | boolean | No | — | true |

## Actions

| Action | Trigger | API Call | Behavior |
|--------|---------|----------|----------|
| Thêm mức phạt mới | Button click | — | Open create modal |
| Lưu | Modal save | `POST /api/v1/salary/penalties` | Create penalty |
| Sửa | Row action | — | Open edit modal |
| Cập nhật | Modal save | `PUT /api/v1/salary/penalties/{id}` | Update penalty |
| Xoá | Row action | — | Confirmation dialog |
| Xác nhận xoá | Dialog confirm | `DELETE /api/v1/salary/penalties/{id}` | Delete penalty |
| Filter by type | Select change | — | Client-side filter |

## API Operations

| Operation | Method | Endpoint | Request | Response |
|-----------|--------|----------|---------|----------|
| getPenalties | GET | `/api/v1/salary/penalties` | — | `[{ id, code, name, penaltyType, minMinutes, maxMinutes, penaltyAmount }]` |
| createPenalty | POST | `/api/v1/salary/penalties` | `{ code, name, penaltyType, minMinutes, maxMinutes, penaltyAmount }` | `{ id, ... }` |
| updatePenalty | PUT | `/api/v1/salary/penalties/{id}` | `{ ... }` | `{ id, ... }` |
| deletePenalty | DELETE | `/api/v1/salary/penalties/{id}` | — | 204 |

## Error Display

| Error Code | Display | Message |
|------------|---------|---------|
| CODE_EXISTS | Modal inline | "Mã mức phạt đã tồn tại" |
| OVERLAPPING_MINUTES | Modal inline | "Khoảng phút bị trùng với mức khác" |
| VALIDATION_ERROR | Modal inline | Field-level errors |

## Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-SCR13-01 | List shows all penalty rules |
| AC-SCR13-02 | Filter by type (LATE/ABSENT) works |
| AC-SCR13-03 | Create modal has all required fields |
| AC-SCR13-04 | Penalty type select has 2 options |
| AC-SCR13-05 | Min minutes validated |
| AC-SCR13-06 | Max minutes optional (NULL = unlimited) |
| AC-SCR13-07 | Penalty amount ≥ 0 |
| AC-SCR13-08 | Minute overlap validation |
| AC-SCR13-09 | Touch target ≥ 44px |
| AC-SCR13-10 | Works at 320px minimum width |
