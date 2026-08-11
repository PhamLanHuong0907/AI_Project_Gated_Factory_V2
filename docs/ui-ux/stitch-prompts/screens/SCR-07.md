# Stitch Prompt: SCR-07 — Cấu hình lương (Tabbed + Formula Builder)

## Screen Identity

| Field | Value |
|-------|-------|
| Screen ID | SCR-07 |
| Screen Name | Cấu hình lương |
| Route | `/admin/salary-config` |
| Use Case | UC-06 |
| Actors | ADMIN (full CRUD), HR_MANAGER (read-only tabs) |
| Layout | App Shell with content area, Tab-based |
| Complexity | **Most complex screen** — 5 tabs + employee assignment |

## User Role & Goal

ADMIN configures all salary components: position-based salary, experience tiers, attendance penalties, bonuses, and the salary calculation formula. HR_MANAGER has read-only access to tabs.

## GLOBAL APP SHELL LOCK

> This screen uses the approved App Shell. DO NOT modify the shell. Only design the content area.

## Tab Navigation

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Cấu hình lương                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [💼 Vị trí] [📈 Kinh nghiệm] [⚠️ Phạt] [🎁 Thưởng] [🔧 Công thức]  │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│                    ↓ Nội dung tab hiện tại ↓                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

| Tab | Icon | Content |
|-----|------|---------|
| Vị trí | 💼 | CRUD salary positions |
| Kinh nghiệm | 📈 | CRUD experience tiers |
| Phạt chấm công | ⚠️ | CRUD penalty rules |
| Thưởng | 🎁 | CRUD bonus configs |
| Công thức tính | 🔧 | Formula builder with variables |

## Tab 1: Vị trí 💼

### Table

| Column | Width | Description |
|--------|-------|-------------|
| Mã VT | 15% | Position code (unique) |
| Tên vịtrie | 30% | Position name |
| Lương cơ bản | 25% | Base salary (VND, formatted) |
| Trạng thái | 15% | Active/Inactive badge |
| Thao tác | 15% | Edit/Delete buttons |

### Create/Edit Modal Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Mã vị trí | text | Yes | Unique, max 10 chars |
| Tên vị trí | text | Yes | Max 50 chars |
| Lương cơ bản (VND) | number | Yes | Min 0, step 100,000 |
| Trạng thái | toggle | No | Default: true |

### Create/Edit Modal Layout (Desktop)

```
┌─────────────────────────────────────────────┐
│  Thêm vị trí mới                     [X]   │
├─────────────────────────────────────────────┤
│                                             │
│  Mã vị trí *                                │
│  ┌─────────────────────────────────────┐   │
│  │ NV                                   │   │
│  └─────────────────────────────────────┘   │
│  Tối đa 10 ký tự, phải là duy nhất         │
│                                             │
│  Tên vị trí *                               │
│  ┌─────────────────────────────────────┐   │
│  │ Nhân viên                            │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Lương cơ bản (VND) *                      │
│  ┌─────────────────────────────────────┐   │
│  │ 8,000,000                            │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Mô tả                                      │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Trạng thái: [✅ ON]  ← Toggle             │
│                                             │
│  ────────────────────────────────────────  │
│  [Huỷ]                      [✓ Tạo]       │
└─────────────────────────────────────────────┘
```

**Mobile:** Full-screen modal, nút "Lưu" trên header phải.

### Delete Confirmation (Desktop)

```
┌─────────────────────────────────────────────┐
│  ⚠️ Xoá vị trí?                            │
├─────────────────────────────────────────────┤
│  Bạn có chắc chắn muốn xoá vị trí          │
│  "Nhân viên" (NV)?                          │
│                                             │
│  5 nhân viên đang được phân công            │
│  vị trí này. Việc xoá sẽ ảnh hưởng          │
│  đến tính lương của họ.                      │
│                                             │
│  [Huỷ]                      [🗑️ Xoá]      │
└─────────────────────────────────────────────┘
```

**Mobile:** Bottom sheet dialog.

### Toast Notifications

| Action | Icon | Color | Message |
|--------|------|-------|---------|
| Tạo thành công | ✅ | Green | "Đã tạo vị trí [Tên] thành công" |
| Sửa thành công | ✅ | Green | "Đã cập nhật vị trí" |
| Xoá thành công | ✅ | Green | "Đã xoá vị trí [Tên]" |
| Mã trùng | ❌ | Red | "Mã vị trí đã tồn tại" |
| Lỗi server | ❌ | Red | "Không thể lưu. Vui lòng thử lại" |

## Tab 2: Kinh nghiệm 📈

### Filter

| Filter | Type | Options |
|--------|------|---------|
| Vị trí | Select | Tất cả + all positions from Tab 1 |

### Table

| Column | Width | Description |
|--------|-------|-------------|
| Mã BL | 12% | Tier code |
| Tên bậc | 20% | Tier name |
| Vị trí | 18% | Position name |
| Từ năm | 12% | Min years |
| Đến năm | 12% | Max years (∞ if null) |
| % Tăng | 12% | Percentage increase |
| Thao tác | 14% | Edit/Delete |

### Create/Edit Modal Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Mã bậc | text | Yes | Unique, max 10 chars |
| Tên bậc | text | Yes | Max 50 chars |
| Vị trí áp dụng | select | Yes | From positions API |
| Số năm tối thiểu | number | Yes | Min 0 |
| Số năm tối đa | number | No | Nullable = unlimited |
| % Tăng lương | number | Yes | 0-200% |

### Create/Edit Modal Layout (Desktop)

```
┌─────────────────────────────────────────────┐
│  Thêm bậc kinh nghiệm               [X]   │
├─────────────────────────────────────────────┤
│                                             │
│  Mã bậc *                                   │
│  ┌─────────────────────────────────────┐   │
│  │ KN-NV1                               │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Tên bậc *                                  │
│  ┌─────────────────────────────────────┐   │
│  │ 1-2 năm kinh nghiệm                 │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Vị trí áp dụng *                           │
│  ┌─────────────────────────────────────┐   │
│  │ Nhân viên (NV)              ▼       │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Số năm tối thiểu *     Số năm tối đa      │
│  ┌──────────────┐       ┌──────────────┐   │
│  │ 1             │       │ 2             │   │
│  └──────────────┘       └──────────────┘   │
│                                             │
│  % Tăng lương *                             │
│  ┌─────────────────────────────────────┐   │
│  │ 10                                   │   │
│  └─────────────────────────────────────┘   │
│  Từ 0 đến 200%                             │
│                                             │
│  ────────────────────────────────────────  │
│  [Huỷ]                      [✓ Tạo]       │
└─────────────────────────────────────────────┘
```

**Mobile:** Full-screen modal.

### Delete Confirmation

```
┌─────────────────────────────────────────────┐
│  ⚠️ Xoá bậc kinh nghiệm?                   │
├─────────────────────────────────────────────┤
│  Xoá bậc "1-2 năm kinh nghiệm" (KN-NV1)?   │
│  3 nhân viên đang áp dụng bậc này.           │
│                                             │
│  [Huỷ]                      [🗑️ Xoá]      │
└─────────────────────────────────────────────┘
```

## Tab 3: Phạt chấm công ⚠️

### Filter

| Filter | Type | Options |
|--------|------|---------|
| Loại | Select | Tất cả, LATE, ABSENT |

### Table

| Column | Width | Description |
|--------|-------|-------------|
| Mã MP | 12% | Penalty code |
| Tên mức phạt | 22% | Penalty name |
| Loại | 12% | LATE/ABSENT badge |
| Từ phút | 12% | Min minutes |
| Đến phút | 12% | Max minutes (∞ if null) |
| Phạt (VND) | 15% | Penalty amount |
| Thao tác | 15% | Edit/Delete |

### Create/Edit Modal Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Mã mức phạt | text | Yes | Unique, max 10 chars |
| Tên mức phạt | text | Yes | Max 50 chars |
| Loại phạt | select | Yes | LATE / ABSENT |
| Số phút tối thiểu | number | Yes | Min 0 |
| Số phút tối đa | number | No | Nullable |
| Số tiền phạt (VND) | number | Yes | Min 0, step 10,000 |

### Create/Edit Modal Layout (Desktop)

```
┌─────────────────────────────────────────────┐
│  Thêm mức phạt mới                  [X]   │
├─────────────────────────────────────────────┤
│                                             │
│  Mã mức phạt *                              │
│  ┌─────────────────────────────────────┐   │
│  │ PT-01                                │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Tên mức phạt *                             │
│  ┌─────────────────────────────────────┐   │
│  │ Trễ 1-5 phút                        │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Loại phạt *                                │
│  ┌─────────────────────────────────────┐   │
│  │ Đi trễ (LATE)               ▼       │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Số phút tối thiểu *    Số phút tối đa     │
│  ┌──────────────┐       ┌──────────────┐   │
│  │ 1             │       │ 5             │   │
│  └──────────────┘       └──────────────┘   │
│                                             │
│  Số tiền phạt (VND) *                       │
│  ┌─────────────────────────────────────┐   │
│  │ 50,000                               │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ────────────────────────────────────────  │
│  [Huỷ]                      [✓ Tạo]       │
└─────────────────────────────────────────────┘
```

**Validation:** Overlapping ranges → "Mức phạt bị trùng khoảng phút với mức khác"

### Delete Confirmation

```
┌─────────────────────────────────────────────┐
│  ⚠️ Xoá mức phạt?                          │
├─────────────────────────────────────────────┤
│  Xoá "Trễ 1-5 phút" (PT-01)?               │
│                                             │
│  [Huỷ]                      [🗑️ Xoá]      │
└─────────────────────────────────────────────┘
```

## Tab 4: Thưởng 🎁

### Table

| Column | Width | Description |
|--------|-------|-------------|
| Mã TL | 15% | Bonus code |
| Tên thưởng | 30% | Bonus name |
| Số tiền (VND) | 25% | Amount |
| Mô tả | 15% | Description |
| Thao tác | 15% | Edit/Delete |

### Create/Edit Modal Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Mã thưởng | text | Yes | Unique, max 10 chars |
| Tên thưởng | text | Yes | Max 50 chars |
| Số tiền thưởng (VND) | number | Yes | Min 0, step 10,000 |
| Mô tả | textarea | No | Max 200 chars |

### Create/Edit Modal Layout (Desktop)

```
┌─────────────────────────────────────────────┐
│  Thêm thưởng mới                     [X]   │
├─────────────────────────────────────────────┤
│                                             │
│  Mã thưởng *                                │
│  ┌─────────────────────────────────────┐   │
│  │ TH-HQ                                │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Tên thưởng *                               │
│  ┌─────────────────────────────────────┐   │
│  │ Thưởng hiệu quả                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Số tiền thưởng (VND) *                     │
│  ┌─────────────────────────────────────┐   │
│  │ 2,000,000                            │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Mô tả                                      │
│  ┌─────────────────────────────────────┐   │
│  │ Thưởng cho nhân viên có hiệu quả   │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ────────────────────────────────────────  │
│  [Huỷ]                      [✓ Tạo]       │
└─────────────────────────────────────────────┘
```

### Delete Confirmation

```
┌─────────────────────────────────────────────┐
│  ⚠️ Xoá thưởng?                             │
├─────────────────────────────────────────────┤
│  Xoá "Thưởng hiệu quả" (TH-HQ)?            │
│  8 nhân viên đang được phân công thưởng này. │
│                                             │
│  [Huỷ]                      [🗑️ Xoá]      │
└─────────────────────────────────────────────┘
```

### Toast Notifications (Tabs 1-4)

| Action | Icon | Color | Message |
|--------|------|-------|---------|
| Tạo thành công | ✅ | Green | "Đã tạo [entity] thành công" |
| Sửa thành công | ✅ | Green | "Đã cập nhật [entity]" |
| Xoá thành công | ✅ | Green | "Đã xoá [entity]" |
| Mã trùng | ❌ | Red | "Mã đã tồn tại" |
| Lỗi server | ❌ | Red | "Không thể lưu. Vui lòng thử lại" |

## Tab 5: Công thức tính lương 🔧

### Component Selector (Sidebar)

```
┌──────────────┐
│ THÀNH PHẦN   │
│              │
│ 💼 Lương CB  │
│  base_salary │
│              │
│ 📈 % KN      │
│  experience_ │
│  pct         │
│              │
│ 🎁 Thưởng    │
│  bonus_total │
│              │
│ ⚠️ Phạt      │
│  penalty_    │
│  total       │
│              │
│ 📅 Ngày CT   │
│  days_worked │
│              │
│ 📅 Tổng ngày │
│  total_work_ │
│  days        │
│              │
│ 🔢 Số năm KN │
│  years_of_   │
│  work        │
└──────────────┘
```

### Formula Input

- **Type**: Textarea (multiline)
- **Operators**: `+`, `-`, `*`, `/`, `(`, `)`
- **Click component** → variable inserted at cursor position
- **Default formula**: `base_salary * (1 + experience_pct / 100) + bonus_total - penalty_total`

### Formula Actions

| Action | Trigger | API Call | Behavior |
|--------|---------|----------|----------|
| Chọn component | Click component | — | Chèn variable vào formula |
| Xoá công thức | Button click | — | Clear formula textarea |
| Lưu công thức | Button click | `PUT /api/v1/salary/formula` | Save formula |
| Validate | Auto on save | `POST /api/v1/salary/formula/validate` | Check syntax |
| Preview | Button click | `POST /api/v1/salary/formula/preview` | Show calculated result |

### Available Variables

| Variable | Giá trị | Nguồn |
|----------|---------|-------|
| `base_salary` | Số tiền | salary_positions.base_salary |
| `experience_pct` | Phần trăm | salary_experience.percent_increase |
| `bonus_total` | Số tiền | SUM(salary_bonus.amount) |
| `penalty_total` | Số tiền | SUM(salary_penalties.penalty_amount) |
| `days_worked` | Số ngày | attendance records |
| `total_work_days` | Số ngày | shifts.work_days count |
| `years_of_work` | Số năm | users.years_of_work |

## All API Operations

### Tab 1-4 (CRUD pattern)

| Operation | Method | Endpoint |
|-----------|--------|----------|
| get{Entity} | GET | `/api/v1/salary/{entity}` |
| create{Entity} | POST | `/api/v1/salary/{entity}` |
| update{Entity} | PUT | `/api/v1/salary/{entity}/{id}` |
| delete{Entity} | DELETE | `/api/v1/salary/{entity}/{id}` |

### Tab 5 (Formula)

| Operation | Method | Endpoint |
|-----------|--------|----------|
| getFormula | GET | `/api/v1/salary/formula` |
| saveFormula | PUT | `/api/v1/salary/formula` |
| validateFormula | POST | `/api/v1/salary/formula/validate` |
| previewFormula | POST | `/api/v1/salary/formula/preview` |

## Responsive Rules

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Tabs scrollable horizontally, tables → cards, formula builder stacks vertically |
| Tablet | Tabs in row, full tables, formula builder side-by-side |
| Desktop | Tabs in row, full tables, formula builder wider layout |

## Forbidden

- DO NOT add employee assignment on this screen (that's a separate workflow)
- DO NOT add salary preview/calculator on this screen
- DO NOT add import/export for salary configs
- DO NOT add history/audit log for config changes
- DO NOT change the formula variable names

## Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-SCR07-01 | Tab navigation works correctly |
| AC-SCR07-02 | Tab 1: CRUD positions with modals |
| AC-SCR07-03 | Tab 2: CRUD experience tiers with position filter |
| AC-SCR07-04 | Tab 3: CRUD penalties with type filter |
| AC-SCR07-05 | Tab 4: CRUD bonus configs |
| AC-SCR07-06 | Tab 5: Formula builder with component selector |
| AC-SCR07-07 | Formula validation (syntax, variables, operators) |
| AC-SCR07-08 | Formula save/load from API |
| AC-SCR07-09 | Formula preview shows calculated result |
| AC-SCR07-10 | Default formula provided |
| AC-SCR07-11 | Touch target ≥ 44px |
| AC-SCR07-12 | Works at 320px minimum width |
| AC-SCR07-13 | Mobile full-screen modals |
| AC-SCR07-14 | Delete confirmation with dependency warning |
| AC-SCR07-15 | Toast notifications for all CRUD actions |
| AC-SCR07-16 | Unsaved changes warning on tab switch |
