# Physical ERD v2 - Hệ thống Chấm công (Cấu hình Lương mở rộng)

## 1. Physical ERD Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         PHYSICAL ERD v2 DIAGRAM                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌──────────────────────┐                                                      │
│  │       shifts         │                                                      │
│  │──────────────────────│                                                      │
│  │ PK id                │                                                      │
│  │    name              │                                                      │
│  │    start_time        │                                                      │
│  │    end_time          │                                                      │
│  │    grace_period      │                                                      │
│  │    work_days         │                                                      │
│  │    is_active         │                                                      │
│  └──────────┬───────────┘                                                      │
│             │ 1:N                                                              │
│             ▼                                                                  │
│  ┌──────────────────────┐      ┌──────────────────────┐                       │
│  │       users          │      │   salary_positions   │                       │
│  │──────────────────────│      │──────────────────────│                       │
│  │ PK id                │      │ PK id                │                       │
│  │    username          │      │    code              │                       │
│  │    password          │      │    name              │                       │
│  │    full_name         │      │    base_salary       │                       │
│  │    email             │      │    is_active         │                       │
│  │    role              │      └──────────┬───────────┘                       │
│  │ FK shift_id ─────────┤                 │ 1:N                               │
│  │ FK position_id ──────┼─────┐           │                                   │
│  │    hire_date         │     │           │                                   │
│  │    years_of_work     │     │           ▼                                   │
│  │    status            │     │  ┌──────────────────────┐                    │
│  │    created_at        │     │  │  salary_experience   │                    │
│  │    updated_at        │     │  │──────────────────────│                    │
│  └──────────┬───────────┘     │  │ PK id                │                    │
│             │                 │  │    code              │                    │
│             │                 │  │    name              │                    │
│             │                 │  │ FK position_id       │                    │
│             │                 │  │    min_years         │                    │
│             │                 │  │    max_years         │                    │
│             │                 │  │    percent_increase  │                    │
│             │                 │  │    is_active         │                    │
│             │                 │  └──────────────────────┘                    │
│             │                 │                                               │
│             │                 │  ┌──────────────────────┐                    │
│             │                 │  │ salary_penalties     │                    │
│             │                 │  │──────────────────────│                    │
│             │                 │  │ PK id                │                    │
│             │                 │  │    code              │                    │
│             │                 │  │    name              │                    │
│             │                 │  │    penalty_type      │                    │
│             │                 │  │    min_minutes       │                    │
│             │                 │  │    max_minutes       │                    │
│             │                 │  │    penalty_amount    │                    │
│             │                 │  │    is_active         │                    │
│             │                 │  └──────────────────────┘                    │
│             │                 │                                               │
│             │                 │  ┌──────────────────────┐                    │
│             │                 │  │    salary_bonus      │                    │
│             │                 │  │──────────────────────│                    │
│             │                 │  │ PK id                │                    │
│             │                 │  │    code              │                    │
│             │                 │  │    name              │                    │
│             │                 │  │    amount            │                    │
│             │                 │  │    description       │                    │
│             │                 │  │    is_active         │                    │
│             │                 │  └──────────────────────┘                    │
│             │                 │                                               │
│             │    ┌────────────┼───────────────┐                              │
│             │    │            │               │                              │
│             ▼    ▼            ▼               ▼                              │
│  ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐ │
│  │ emp_salary_position  │ │ emp_salary_experience│ │ emp_salary_bonus     │ │
│  │──────────────────────│ │──────────────────────│ │──────────────────────│ │
│  │ PK id                │ │ PK id                │ │ PK id                │ │
│  │ FK user_id           │ │ FK user_id           │ │ FK user_id           │ │
│  │ FK position_id       │ │ FK experience_id     │ │ FK bonus_id          │ │
│  │    is_active         │ │    is_active         │ │    is_active         │ │
│  └──────────────────────┘ └──────────────────────┘ └──────────────────────┘ │
│                                                                                 │
│  ┌──────────────────────┐      ┌──────────────────────┐                      │
│  │     attendance       │      │      qr_codes        │                      │
│  │──────────────────────│      │──────────────────────│                      │
│  │ PK id                │      │ PK id                │                      │
│  │ FK user_id           │      │ FK user_id           │                      │
│  │ FK qr_id             │──────│    code              │                      │
│  │    type              │      │    expires_at        │                      │
│  │    timestamp         │      │    status            │                      │
│  │    distance          │      └──────────────────────┘                      │
│  │    status            │                                                     │
│  └──────────────────────┘      ┌──────────────────────┐                      │
│                                │    system_config     │                      │
│  ┌──────────────────────┐      │──────────────────────│                      │
│  │      audit_log       │      │ PK id                │                      │
│  │──────────────────────│      │    config_key        │                      │
│  │ PK id                │      │    config_value      │                      │
│  │ FK user_id           │      │    description       │                      │
│  │    event_type        │      └──────────────────────┘                      │
│  │    details (JSONB)   │                                                     │
│  │    created_at        │      ┌──────────────────────┐                      │
│  └──────────────────────┘      │   leave_requests     │                      │
│                                │──────────────────────│                      │
│                                │ PK id                │                      │
│                                │ FK user_id ──────────┤──→ users            │
│                                │    leave_date        │                      │
│                                │    reason            │                      │
│                                │    status            │                      │
│                                │    attachment_urls   │                      │
│                                │ FK reviewed_by ──────┤──→ users            │
│                                │    reviewed_at       │                      │
│                                │    reject_reason     │                      │
│                                │    created_at        │                      │
│                                │    updated_at        │                      │
│                                └──────────────────────┘                      │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## 2. New Table Specifications

### 2.1 salary_positions (Bảng lương theo vị trí)

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NO | auto | Primary key |
| code | VARCHAR(50) | NO | - | Mã vị trí (VD: NV, QL, GD) |
| name | VARCHAR(100) | NO | - | Tên vị trí (VD: Nhân viên, Quản lý) |
| base_salary | DECIMAL(15,2) | NO | - | Lương cơ bản theo vị trí |
| is_active | BOOLEAN | NO | true | Trạng thái kích hoạt |
| created_at | TIMESTAMP | NO | NOW() | Thời gian tạo |
| updated_at | TIMESTAMP | NO | NOW() | Thời gian cập nhật |

**Constraints**: PK: id, UQ: code

---

### 2.2 salary_experience (Đãi ngộ theo số năm kinh nghiệm)

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NO | auto | Primary key |
| code | VARCHAR(50) | NO | - | Mã bậc lương |
| name | VARCHAR(100) | NO | - | Tên bậc (VD: 1-2 năm, 3-5 năm) |
| position_id | BIGINT | NO | - | FK → salary_positions |
| min_years | INTEGER | NO | - | Số năm tối thiểu |
| max_years | INTEGER | YES | NULL | Số năm tối đa (NULL = không giới hạn) |
| percent_increase | DECIMAL(5,2) | NO | 0 | % tăng lương so với base |
| is_active | BOOLEAN | NO | true | Trạng thái kích hoạt |
| created_at | TIMESTAMP | NO | NOW() | Thời gian tạo |
| updated_at | TIMESTAMP | NO | NOW() | Thời gian cập nhật |

**Constraints**: PK: id, FK: position_id → salary_positions, CHECK: min_years >= 0, CHECK: percent_increase >= 0

---

### 2.3 salary_penalties (Phạt chấm công)

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NO | auto | Primary key |
| code | VARCHAR(50) | NO | - | Mã mức phạt |
| name | VARCHAR(100) | NO | - | Tên mức phạt (VD: Trễ 1-5 phút) |
| penalty_type | VARCHAR(20) | NO | - | LATE (trễ) / ABSENT (vắng mặt) |
| min_minutes | INTEGER | NO | - | Số phút tối thiểu |
| max_minutes | INTEGER | YES | NULL | Số phút tối đa (NULL = không giới hạn) |
| penalty_amount | DECIMAL(15,2) | NO | - | Số tiền phạt (VND) |
| is_active | BOOLEAN | NO | true | Trạng thái kích hoạt |
| created_at | TIMESTAMP | NO | NOW() | Thời gian tạo |
| updated_at | TIMESTAMP | NO | NOW() | Thời gian cập nhật |

**Constraints**: PK: id, UQ: code, CHECK: penalty_type IN ('LATE', 'ABSENT'), CHECK: min_minutes >= 0, CHECK: penalty_amount >= 0

---

### 2.4 salary_bonus (Thưởng khác)

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NO | auto | Primary key |
| code | VARCHAR(50) | NO | - | Mã thưởng |
| name | VARCHAR(100) | NO | - | Tên thưởng (VD: Thưởng hiệu quả) |
| amount | DECIMAL(15,2) | NO | - | Số tiền thưởng (VND) |
| description | TEXT | YES | NULL | Mô tả |
| is_active | BOOLEAN | NO | true | Trạng thái kích hoạt |
| created_at | TIMESTAMP | NO | NOW() | Thời gian tạo |
| updated_at | TIMESTAMP | NO | NOW() | Thời gian cập nhật |

**Constraints**: PK: id, UQ: code, CHECK: amount >= 0

---

### 2.4b salary_formulas (Công thức tính lương)

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NO | auto | Primary key |
| formula_text | TEXT | NO | - | Công thức tính (VD: base_salary * ...) |
| description | TEXT | YES | NULL | Mô tả công thức |
| is_active | BOOLEAN | NO | true | Công thức đang dùng |
| created_at | TIMESTAMP | NO | NOW() | Thời gian tạo |
| updated_at | TIMESTAMP | NO | NOW() | Thời gian cập nhật |

**Constraints**: PK: id, CHECK: is_active = true (chỉ 1 công thức active)

**Default formula**: `base_salary * (1 + experience_pct / 100) + bonus_total - penalty_total`

**Available variables**:
- `base_salary` — Lương cơ bản theo vị trí
- `experience_pct` — % tăng theo kinh nghiệm
- `bonus_total` — Tổng thưởng
- `penalty_total` — Tổng phạt
- `days_worked` — Số ngày làm việc thực tế
- `total_work_days` — Tổng ngày làm việc trong tháng
- `years_of_work` — Số năm kinh nghiệm

---

### 2.5 emp_salary_position (Phân công vị trí cho nhân viên)

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NO | auto | Primary key |
| user_id | BIGINT | NO | - | FK → users |
| position_id | BIGINT | NO | - | FK → salary_positions |
| is_active | BOOLEAN | NO | true | Trạng thái phân công |
| created_at | TIMESTAMP | NO | NOW() | Thời gian tạo |

**Constraints**: PK: id, UQ: (user_id, position_id), FK: user_id → users, FK: position_id → salary_positions

---

### 2.6 emp_salary_experience (Phân công bậc lương kinh nghiệm)

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NO | auto | Primary key |
| user_id | BIGINT | NO | - | FK → users |
| experience_id | BIGINT | NO | - | FK → salary_experience |
| is_active | BOOLEAN | NO | true | Trạng thái phân công |
| created_at | TIMESTAMP | NO | NOW() | Thời gian tạo |

**Constraints**: PK: id, UQ: (user_id, experience_id)

---

### 2.7 emp_salary_bonus (Phân công thưởng cho nhân viên)

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NO | auto | Primary key |
| user_id | BIGINT | NO | - | FK → users |
| bonus_id | BIGINT | NO | - | FK → salary_bonus |
| is_active | BOOLEAN | NO | true | Trạng thái phân công |
| created_at | TIMESTAMP | NO | NOW() | Thời gian tạo |

**Constraints**: PK: id, UQ: (user_id, bonus_id)

---

### 2.8 leave_requests (Đơn xin nghỉ làm)

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NO | auto | Primary key |
| user_id | BIGINT | NO | - | FK → users (người gửi đơn) |
| leave_date | DATE | NO | - | Ngày xin nghỉ |
| reason | TEXT | NO | - | Lý do xin nghỉ |
| status | VARCHAR(20) | NO | 'PENDING' | Trạng thái: PENDING / APPROVED / REJECTED |
| attachment_urls | JSONB | NO | '[]' | Danh sách URL file đính kèm (ảnh/PDF) |
| reviewed_by | BIGINT | YES | NULL | FK → users (người duyệt) |
| reviewed_at | TIMESTAMP | YES | NULL | Thời gian duyệt |
| reject_reason | TEXT | YES | NULL | Lý do từ chối (khi status = REJECTED) |
| created_at | TIMESTAMP | NO | NOW() | Thời gian tạo |
| updated_at | TIMESTAMP | NO | NOW() | Thời gian cập nhật |

**Constraints**: PK: id, FK: user_id → users, FK: reviewed_by → users, CHECK: status IN ('PENDING', 'APPROVED', 'REJECTED')

**Trigger**: Khi status chuyển sang APPROVED → Tự động tạo bản ghi trong `attendance` với:
- `user_id` = leave_requests.user_id
- `type` = 'CHECK_OUT' (hoặc type phù hợp)
- `timestamp` = leave_date + giờ kết thúc ca làm việc
- `status` = 'XIN_NGHI'
- `qr_id` = NULL

---

## 3. Updated users Table

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NO | auto | Primary key |
| username | VARCHAR(50) | NO | - | Tên đăng nhập |
| password | VARCHAR(255) | NO | - | Mật khẩu BCrypt |
| full_name | VARCHAR(100) | NO | - | Họ tên |
| email | VARCHAR(100) | YES | NULL | Email |
| role | VARCHAR(20) | NO | 'EMPLOYEE' | Vai trò |
| shift_id | BIGINT | YES | NULL | Ca làm việc |
| **position_id** | BIGINT | **YES** | **NULL** | **Vị trí công việc (FK → salary_positions)** |
| **hire_date** | DATE | **YES** | **NULL** | **Ngày vào làm** |
| **years_of_work** | INTEGER | **NO** | **0** | **Số năm làm việc (auto-calculated)** |
| status | VARCHAR(20) | NO | 'ACTIVE' | Trạng thái |
| failed_attempts | INTEGER | NO | 0 | Số lần đăng nhập sai |
| locked_until | TIMESTAMP | NO | '1970-01-01' | Thời gian hết khóa |
| created_at | TIMESTAMP | NO | NOW() | Thời gian tạo |
| updated_at | TIMESTAMP | NO | NOW() | Thời gian cập nhật |

**New columns**: position_id, hire_date, years_of_work

---

## 4. Salary Calculation Formula

```
Tổng lương = Lương cơ bản (vị trí) × (1 + % tăng kinh nghiệm) + Tổng thưởng - Tổng phạt

Trong đó:
- Lương cơ bản = salary_positions.base_salary (theo vị trí được assign)
- % tăng kinh nghiệm = salary_experience.percent_increase (theo bậc kinh nghiệm được assign)
- Tổng thưởng = SUM(salary_bonus.amount) (theo các thưởng được assign)
- Tổng phạt = SUM(salary_penalties.penalty_amount) (theo mức phạt chấm công thực tế)
```

---

## 5. Entity Relationships Summary

| Entity | Relationships |
|--------|---------------|
| salary_positions | 1:N salary_experience, 1:N emp_salary_position |
| salary_experience | N:1 salary_positions, 1:N emp_salary_experience |
| salary_penalties | Standalone (configurable) |
| salary_bonus | 1:N emp_salary_bonus |
| emp_salary_position | N:1 users, N:1 salary_positions |
| emp_salary_experience | N:1 users, N:1 salary_experience |
| emp_salary_bonus | N:1 users, N:1 salary_bonus |
| leave_requests | N:1 users (user_id), N:1 users (reviewed_by), triggers attendance insert on APPROVED |
| users | 1:N emp_salary_position, 1:N emp_salary_experience, 1:N emp_salary_bonus, 1:N leave_requests |
