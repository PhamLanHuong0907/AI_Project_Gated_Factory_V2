> ⚠️ **OBSOLETE**: This screen has been merged into SCR-07 Tab 2. See `screen-spec-salary-config.md`.

# SCR-12 — Cấu hình lương theo kinh nghiệm (`/admin/salary-experience`) [OBSOLETE]

## General

| Field | Value |
|-------|-------|
| Screen ID | SCR-12 |
| Screen Name | Cấu hình lương theo đãi ngộ theo số năm làm việc |
| Route | `/admin/salary-experience` |
| Use Case | — (Admin Config) |
| Actors | ADMIN |
| Priority | P1 |
| Layout | App Shell with content area |

## Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Cấu hình lương theo kinh nghiệm         [+ Thêm bậc mới]              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Vị trí: [Tất cả ▼]                                                    │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  Mã BL   Tên bậc        Vị trí   Từ năm   Đến năm   % Tăng     │  │
│  │  ─────────────────────────────────────────────────────────────── │  │
│  │  KN-NV1  1-2 năm        NV       1        2         10%        │  │
│  │  KN-NV2  3-5 năm        NV       3        5         20%        │  │
│  │  KN-NV3  5+ năm         NV       5        NULL      30%        │  │
│  │  KN-QL1  1-3 năm        QL       1        3         15%        │  │
│  │                                                                   │  │
│  │  [✏️ Sửa]  [🗑️ Xoá]                                              │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

### Create/Edit Modal

```
┌─────────────────────────────────────────┐
│  Thêm bậc kinh nghiệm            [X]   │
├─────────────────────────────────────────┤
│                                         │
│  Mã bậc lương *                         │
│  ┌─────────────────────────────┐       │
│  │ KN-NV1                       │       │
│  └─────────────────────────────┘       │
│                                         │
│  Tên bậc *                              │
│  ┌─────────────────────────────┐       │
│  │ 1-2 năm kinh nghiệm         │       │
│  └─────────────────────────────┘       │
│                                         │
│  Vị trí áp dụng *                       │
│  [Nhân viên ▼]                          │
│                                         │
│  Số năm tối thiểu *    Số năm tối đa    │
│  ┌──────────┐          ┌──────────┐     │
│  │ 1         │          │ 2         │   │
│  └──────────┘          └──────────┘     │
│  (để trống = không giới hạn)            │
│                                         │
│  % Tăng lương so với vị trí *           │
│  ┌─────────────────────────────┐       │
│  │ 10                            │       │
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
| positionId | select | Yes | From positions API | — |
| minYears | number | Yes | Min 0 | — |
| maxYears | number | No | ≥ minYears, nullable | NULL |
| percentIncrease | number | Yes | 0-200% | — |
| isActive | boolean | No | — | true |

## Actions

| Action | Trigger | API Call | Behavior |
|--------|---------|----------|----------|
| Thêm bậc mới | Button click | — | Open create modal |
| Lưu | Modal save | `POST /api/v1/salary/experience` | Create tier |
| Sửa | Row action | — | Open edit modal |
| Cập nhật | Modal save | `PUT /api/v1/salary/experience/{id}` | Update tier |
| Xoá | Row action | — | Confirmation dialog |
| Xác nhận xoá | Dialog confirm | `DELETE /api/v1/salary/experience/{id}` | Delete tier |
| Filter by position | Select change | — | Client-side filter |

## API Operations

| Operation | Method | Endpoint | Request | Response |
|-----------|--------|----------|---------|----------|
| getExperience | GET | `/api/v1/salary/experience` | `?positionId={id}` | `[{ id, code, name, positionId, minYears, maxYears, percentIncrease }]` |
| getPositions | GET | `/api/v1/salary/positions` | — | Position list |
| createExperience | POST | `/api/v1/salary/experience` | `{ code, name, positionId, minYears, maxYears, percentIncrease }` | `{ id, ... }` |
| updateExperience | PUT | `/api/v1/salary/experience/{id}` | `{ ... }` | `{ id, ... }` |
| deleteExperience | DELETE | `/api/v1/salary/experience/{id}` | — | 204 |

## Error Display

| Error Code | Display | Message |
|------------|---------|---------|
| CODE_EXISTS | Modal inline | "Mã bậc lương đã tồn tại" |
| OVERLAPPING_YEARS | Modal inline | "Khoảng năm bị trùng với bậc khác" |
| VALIDATION_ERROR | Modal inline | Field-level errors |

## Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-SCR12-01 | List shows all experience tiers |
| AC-SCR12-02 | Filter by position works |
| AC-SCR12-03 | Create modal has all required fields |
| AC-SCR12-04 | Position select shows available positions |
| AC-SCR12-05 | Min years validated |
| AC-SCR12-06 | Max years optional (NULL = unlimited) |
| AC-SCR12-07 | Percent increase 0-200% |
| AC-SCR12-08 | Year overlap validation |
| AC-SCR12-09 | Touch target ≥ 44px |
| AC-SCR12-10 | Works at 320px minimum width |
