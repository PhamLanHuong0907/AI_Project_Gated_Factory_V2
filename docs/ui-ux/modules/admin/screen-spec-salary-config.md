# SCR-07 — Cấu hình lương (`/admin/salary-config`)

## General

| Field | Value |
|-------|-------|
| Screen ID | SCR-07 |
| Screen Name | Cấu hình lương |
| Route | `/admin/salary-config` |
| Use Case | UC-06 |
| Actors | ADMIN |
| Priority | P1 |
| Layout | App Shell with content area, Tab-based |

---

## Tab Navigation

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Cấu hình lương                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  [Vị trí] [Kinh nghiệm] [Phạt chấm công] [Thưởng] [Công thức tính]    │
│  ─────────────────────────────────────────────────────────────────────  │
│                                                                         │
│                    ↓ Nội dung tab hiện tại ↓                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

| Tab | Icon | Nội dung |
|-----|------|----------|
| Vị trí | 💼 | Quản lý lương theo vị trí |
| Kinh nghiệm | 📈 | Quản lý bậc lương theo năm KN |
| Phạt chấm công | ⚠️ | Quản lý mức phạt |
| Thưởng | 🎁 | Quản lý thưởng khác |
| Công thức tính | 🔧 | Xây dựng công thức tính lương |

---

## Tab 1: Vị trí 💼

```
┌─────────────────────────────────────────────────────────────┐
│  [+ Thêm vị trí mới]                                        │
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

**Modal Thêm/Sửa vị trí:**
- Mã vị trí * (text, unique)
- Tên vị trí * (text)
- Lương cơ bản (VND) * (number)
- Trạng thái (toggle)

---

## Tab 2: Kinh nghiệm 📈

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Vị trí: [Tất cả ▼]                    [+ Thêm bậc mới]               │
├─────────────────────────────────────────────────────────────────────────┤
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

**Modal Thêm/Sửa bậc KN:**
- Mã bậc * (text)
- Tên bậc * (text)
- Vị trí áp dụng * (select từ positions)
- Số năm tối thiểu * (number)
- Số năm tối đa (number, nullable = không giới hạn)
- % Tăng lương * (number, 0-200%)

---

## Tab 3: Phạt chấm công ⚠️

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Loại: [Tất cả ▼]                    [+ Thêm mức phạt mới]             │
├─────────────────────────────────────────────────────────────────────────┤
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

**Modal Thêm/Sửa phạt:**
- Mã mức phạt *
- Tên mức phạt *
- Loại phạt * (LATE / ABSENT)
- Số phút tối thiểu *
- Số phút tối đa (nullable)
- Số tiền phạt (VND) *

---

## Tab 4: Thưởng 🎁

```
┌─────────────────────────────────────────────────────────────┐
│  [+ Thêm thưởng mới]                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Mã TL   Tên thưởng           Số tiền    Mô tả       │  │
│  │  ──────────────────────────────────────────────────── │  │
│  │  TH-HQ   Thưởng hiệu quả     2,000,000  Đánh giá Q1 │  │
│  │  TH-HT   Thưởng hoàn thành   1,000,000  Hoàn thành  │  │
│  │  TH-ST   Thưởng sáng tạo     500,000    Ý tưởng mới │  │
│  │                                                     │  │
│  │  [✏️ Sửa]  [🗑️ Xoá]                                │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Modal Thêm/Sửa thưởng:**
- Mã thưởng *
- Tên thưởng *
- Số tiền thưởng (VND) *
- Mô tả (textarea)

---

## Tab 5: Công thức tính lương 🔧

### Concept

Công thức tính lương được xây dựng bằng cách **kéo/thành phần lương** từ danh sách có sẵn vào ô công thức. Hệ thống sẽ tính toán theo công thức đã nhập.

### Component Selector (Sidebar trái)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Công thức tính lương                                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐  ┌─────────────────────────────────────────────────┐  │
│  │ THÀNH PHẦN   │  │  CÔNG THỨC HIỆN TẠI                           │  │
│  │              │  │                                                 │  │
│  │ 💼 Lương CB  │  │  ┌───────────────────────────────────────────┐ │  │
│  │   base_salary│  │  │ base_salary * (1 + experience_pct / 100)  │ │  │
│  │              │  │  │ + bonus_total - penalty_total              │ │  │
│  │ 📈 % KN      │  │  └───────────────────────────────────────────┘ │  │
│  │  experience_ │  │                                                 │  │
│  │  pct         │  │  [Xoá công thức]  [Lưu công thức]              │  │
│  │              │  │                                                 │  │
│  │ 🎁 Thưởng    │  │  ────────────────────────────────────────────  │  │
│  │  bonus_total │  │                                                 │  │
│  │              │  │  VÍ DỤ CÔNG THỨC:                              │  │
│  │ ⚠️ Phạt      │  │  ┌─────────────────────────────────────────┐  │  │
│  │  penalty_    │  │  │ base_salary * days_worked /              │  │  │
│  │  total       │  │  │ total_work_days *                        │  │  │
│  │              │  │  │ (1 + experience_pct / 100) +             │  │  │
│  │ 📅 Ngày CT   │  │  │ bonus_total - penalty_total              │  │  │
│  │  days_worked │  │  └─────────────────────────────────────────┘  │  │
│  │              │  │                                                 │  │
│  │ 📅 Tổng ngày │  │  Operators: +  -  *  /  (  )                  │  │
│  │  total_work_ │  │                                                 │  │
│  │  days        │  │                                                 │  │
│  │              │  │                                                 │  │
│  │ 🔢 Số năm KN │  │                                                 │  │
│  │  years_of_   │  │                                                 │  │
│  │  work        │  │                                                 │  │
│  └──────────────┘  └─────────────────────────────────────────────────┘  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Available Components

| Component | Variable | Giá trị | Nguồn |
|-----------|----------|---------|-------|
| 💼 Lương cơ bản | `base_salary` | Số tiền | salary_positions.base_salary |
| 📈 % Tăng KN | `experience_pct` | Phần trăm | salary_experience.percent_increase |
| 🎁 Tổng thưởng | `bonus_total` | Số tiền | SUM(salary_bonus.amount) |
| ⚠️ Tổng phạt | `penalty_total` | Số tiền | SUM(salary_penalties.penalty_amount) |
| 📅 Ngày làm việc | `days_worked` | Số ngày | attendance records |
| 📅 Tổng ngày CT | `total_work_days` | Số ngày | shifts.work_days count |
| 🔢 Số năm KN | `years_of_work` | Số năm | users.years_of_work |

### Formula Input

- **Type**: Textarea (multiline) hoặc visual builder
- **Operators**: `+`, `-`, `*`, `/`, `(`, `)`
- **Validation**: Check syntax before save
- **Default formula**: `base_salary * (1 + experience_pct / 100) + bonus_total - penalty_total`

### Formula Examples

```
# Cơ bản:
base_salary

# Theo vị trí + kinh nghiệm:
base_salary * (1 + experience_pct / 100)

# Đầy đủ:
base_salary * days_worked / total_work_days * (1 + experience_pct / 100) + bonus_total - penalty_total

# Chỉ theo ngày:
base_salary / total_work_days * days_worked - penalty_total
```

### Actions

| Action | Trigger | API Call | Behavior |
|--------|---------|----------|----------|
| Chọn component | Click component | — | Chèn variable vào formula |
| Nhập operators | Keyboard | — | Type +, -, *, /, (, ) |
| Xoá công thức | Button click | — | Clear formula textarea |
| Lưu công thức | Button click | `PUT /api/v1/salary/formula` | Save formula |
| Test công thức | Button click | — | Validate syntax, show preview |
| Xem trước | Auto | `GET /api/v1/salary/preview` | Show calculated result |

### Formula Validation Rules

| Rule | Mô tả |
|------|-------|
| Syntax check | Kiểm tra cú pháp (dấu ngoặc, operators) |
| Division by zero | Cảnh báo nếu chia cho 0 |
| Unknown variable | Báo lỗi nếu dùng biến không tồn tại |
| Empty formula | Bắt buộc phải có công thức |

---

## API Operations (Combined)

### Tab 1: Positions

| Operation | Method | Endpoint |
|-----------|--------|----------|
| getPositions | GET | `/api/v1/salary/positions` |
| createPosition | POST | `/api/v1/salary/positions` |
| updatePosition | PUT | `/api/v1/salary/positions/{id}` |
| deletePosition | DELETE | `/api/v1/salary/positions/{id}` |

### Tab 2: Experience

| Operation | Method | Endpoint |
|-----------|--------|----------|
| getExperience | GET | `/api/v1/salary/experience` |
| createExperience | POST | `/api/v1/salary/experience` |
| updateExperience | PUT | `/api/v1/salary/experience/{id}` |
| deleteExperience | DELETE | `/api/v1/salary/experience/{id}` |

### Tab 3: Penalties

| Operation | Method | Endpoint |
|-----------|--------|----------|
| getPenalties | GET | `/api/v1/salary/penalties` |
| createPenalty | POST | `/api/v1/salary/penalties` |
| updatePenalty | PUT | `/api/v1/salary/penalties/{id}` |
| deletePenalty | DELETE | `/api/v1/salary/penalties/{id}` |

### Tab 4: Bonus

| Operation | Method | Endpoint |
|-----------|--------|----------|
| getBonus | GET | `/api/v1/salary/bonus` |
| createBonus | POST | `/api/v1/salary/bonus` |
| updateBonus | PUT | `/api/v1/salary/bonus/{id}` |
| deleteBonus | DELETE | `/api/v1/salary/bonus/{id}` |

### Tab 5: Formula

| Operation | Method | Endpoint |
|-----------|--------|----------|
| getFormula | GET | `/api/v1/salary/formula` |
| saveFormula | PUT | `/api/v1/salary/formula` |
| validateFormula | POST | `/api/v1/salary/formula/validate` |
| previewFormula | POST | `/api/v1/salary/formula/preview` |

### Employee Assignment (từ screen khác)

| Operation | Method | Endpoint |
|-----------|--------|----------|
| getEmployees | GET | `/api/v1/users?role=EMPLOYEE` |
| getEmployeeDetail | GET | `/api/v1/salary/employee/{userId}` |
| assignPosition | POST | `/api/v1/salary/assign/position` |
| assignExperience | POST | `/api/v1/salary/assign/experience` |
| assignBonus | POST | `/api/v1/salary/assign/bonus` |
| unassignBonus | DELETE | `/api/v1/salary/assign/bonus` |

---

## CRUD Modals Chi tiết

---

### TAB 1: Vị trí — CRUD Modals

#### Thêm vị trí mới (Create)

**Desktop:**
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
│  Tối đa 50 ký tự                           │
│                                             │
│  Lương cơ bản (VND) *                      │
│  ┌─────────────────────────────────────┐   │
│  │ 8,000,000                            │   │
│  └─────────────────────────────────────┘   │
│  Bước nhảy: 100,000 VND                    │
│                                             │
│  Mô tả                                      │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Trạng thái                                 │
│  ┌─────────┐                                │
│  │ ✅ ON   │  ← Toggle                     │
│  └─────────┘                                │
│                                             │
│  ────────────────────────────────────────  │
│  [Huỷ]                      [✓ Tạo]       │
└─────────────────────────────────────────────┘
```

**Mobile:** Full-screen modal, nút "Lưu" trên header phải.

| Field | Kiểu | Bắt buộc | Validate | Mặc định |
|-------|------|----------|----------|----------|
| code | text | ✅ | Max 10 chars, unique | — |
| name | text | ✅ | Max 50 chars | — |
| baseSalary | number | ✅ | Min 0, step 100,000 | — |
| description | textarea | ❌ | Max 200 chars | — |
| isActive | toggle | ❌ | — | true |

#### Sửa vị trí (Edit)

Giống Create nhưng pre-filled dữ liệu. Title: "Sửa vị trí — [Tên vị trí]".

#### Xóa vị trí (Delete)

```
┌─────────────────────────────────────────────┐
│  ⚠️ Xoá vị trí?                            │
├─────────────────────────────────────────────┤
│                                             │
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

**Validation khi xóa:**
| Rule | Message |
|------|---------|
| Position has employees | "X位 trí đang được phân công. Không thể xoá" |
| Position has experience tiers | "Vị trí có bậc kinh nghiệm liên kết" |

---

### TAB 2: Kinh nghiệm — CRUD Modals

#### Thêm bậc mới (Create)

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
│  Chọn từ danh sách vị trí                   │
│                                             │
│  Số năm tối thiểu *     Số năm tối đa      │
│  ┌──────────────┐       ┌──────────────┐   │
│  │ 1             │       │ 2             │   │
│  └──────────────┘       └──────────────┘   │
│                        Để trống = không GT  │
│                                             │
│  % Tăng lương *                             │
│  ┌─────────────────────────────────────┐   │
│  │ 10                                   │   │
│  └─────────────────────────────────────┘   │
│  Từ 0 đến 200%                             │
│                                             │
│  Mô tả                                      │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ────────────────────────────────────────  │
│  [Huỷ]                      [✓ Tạo]       │
└─────────────────────────────────────────────┘
```

| Field | Kiểu | Bắt buộc | Validate |
|-------|------|----------|----------|
| code | text | ✅ | Max 10, unique |
| name | text | ✅ | Max 50 |
| positionId | select | ✅ | From positions API |
| minYears | number | ✅ | Min 0 |
| maxYears | number | ❌ | Nullable, ≥ minYears |
| percentIncrease | number | ✅ | 0-200% |
| description | textarea | ❌ | Max 200 |

#### Xóa bậc KN

```
┌─────────────────────────────────────────────┐
│  ⚠️ Xoá bậc kinh nghiệm?                   │
├─────────────────────────────────────────────┤
│                                             │
│  Xoá bậc "1-2 năm kinh nghiệm" (KN-NV1)?   │
│  3 nhân viên đang áp dụng bậc này.           │
│                                             │
│  [Huỷ]                      [🗑️ Xoá]      │
└─────────────────────────────────────────────┘
```

---

### TAB 3: Phạt chấm công — CRUD Modals

#### Thêm mức phạt (Create)

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
│  LATE / ABSENT                              │
│                                             │
│  Số phút tối thiểu *    Số phút tối đa     │
│  ┌──────────────┐       ┌──────────────┐   │
│  │ 1             │       │ 5             │   │
│  └──────────────┘       └──────────────┘   │
│                        Để trống = vô hạn    │
│                                             │
│  Số tiền phạt (VND) *                       │
│  ┌─────────────────────────────────────┐   │
│  │ 50,000                               │   │
│  └─────────────────────────────────────┘   │
│  Bước nhảy: 10,000 VND                      │
│                                             │
│  Mô tả                                      │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ────────────────────────────────────────  │
│  [Huỷ]                      [✓ Tạo]       │
└─────────────────────────────────────────────┘
```

| Field | Kiểu | Bắt buộc | Validate |
|-------|------|----------|----------|
| code | text | ✅ | Max 10, unique |
| name | text | ✅ | Max 50 |
| type | select | ✅ | LATE / ABSENT |
| minMinutes | number | ✅ | Min 0 |
| maxMinutes | number | ❌ | Nullable, ≥ minMinutes |
| penaltyAmount | number | ✅ | Min 0, step 10,000 |
| description | textarea | ❌ | Max 200 |

#### Validation penalty ranges

| Rule | Message |
|------|---------|
| Overlapping ranges | "Mức phạt bị trùng khoảng phút với mức khác" |
| maxMinutes < minMinutes | "Phút tối đa phải lớn hơn phút tối thiểu" |

---

### TAB 4: Thưởng — CRUD Modals

#### Thêm thưởng (Create)

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
│  Bước nhảy: 100,000 VND                     │
│                                             │
│  Mô tả                                      │
│  ┌─────────────────────────────────────┐   │
│  │ Thưởng cho nhân viên có hiệu quả   │   │
│  │ cao trong quý                        │   │
│  └─────────────────────────────────────┘   │
│  Tối đa 200 ký tự                          │
│                                             │
│  ────────────────────────────────────────  │
│  [Huỷ]                      [✓ Tạo]       │
└─────────────────────────────────────────────┘
```

| Field | Kiểu | Bắt buộc | Validate |
|-------|------|----------|----------|
| code | text | ✅ | Max 10, unique |
| name | text | ✅ | Max 50 |
| amount | number | ✅ | Min 0, step 100,000 |
| description | textarea | ❌ | Max 200 |

#### Xóa thưởng

```
┌─────────────────────────────────────────────┐
│  ⚠️ Xoá thưởng?                             │
├─────────────────────────────────────────────┤
│                                             │
│  Xoá "Thưởng hiệu quả" (TH-HQ)?            │
│  8 nhân viên đang được phân công thưởng này. │
│                                             │
│  [Huỷ]                      [🗑️ Xoá]      │
└─────────────────────────────────────────────┘
```

---

### TAB 5: Công thức — Actions

#### Lưu công thức

```
┌─────────────────────────────────────────────┐
│  💾 Lưu công thức tính lương?               │
├─────────────────────────────────────────────┤
│                                             │
│  Công thức hiện tại:                         │
│  base_salary * (1 + experience_pct / 100)   │
│  + bonus_total - penalty_total              │
│                                             │
│  ⚠️ Thay đổi công thức sẽ ảnh hưởng        │
│  đến bảng lương tháng sau.                  │
│                                             │
│  [Huỷ]                      [✓ Lưu]        │
└─────────────────────────────────────────────┘
```

#### Validate kết quả

```
┌─────────────────────────────────────────────┐
│  ✅ Công thức hợp lệ                        │
├─────────────────────────────────────────────┤
│                                             │
│  Ví dụ tính toán:                            │
│  ┌─────────────────────────────────────┐   │
│  │ Lương CB:        8,000,000 VND      │   │
│  │ % Tăng KN:       10%                │   │
│  │ Thưởng:          2,000,000 VND      │   │
│  │ Phạt:            50,000 VND         │   │
│  │ ─────────────────────────────────   │   │
│  │ Kết quả:         10,750,000 VND     │   │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Responsive Rules

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Tabs scrollable horizontally, tables → cards, modals full-screen |
| Tablet | Tabs in row, full tables, modals centered (480px) |
| Desktop | Tabs in row, full tables, formula builder wider, modals centered |

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
