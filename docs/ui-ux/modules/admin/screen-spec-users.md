# SCR-09 — Quản lý nhân viên (`/admin/users`)

## General

| Field | Value |
|-------|-------|
| Screen ID | SCR-09 |
| Screen Name | Quản lý nhân viên |
| Route | `/admin/users` |
| Use Case | — (Admin CRUD, not in original use cases) |
| Actors | ADMIN |
| Priority | P2 |
| Layout | App Shell with content area |

> **Lưu ý**: Screen này được tạo từ OpenAPI endpoints (`GET/POST /users`, `GET/PUT/DELETE /users/{id}`). Không có use case tương ứng trong requirement inventory, nhưng cần thiết cho admin workflow quản lý tài khoản nhân viên.

## Layout

```
┌─────────────────────────────────────────────────┐
│  Quản lý nhân viên         [+ Thêm nhân viên]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  🔍 Tìm kiếm: [________________]               │
│  📋 Vai trò: [Tất cả ▼]  Trạng thái: [Tất cả ▼]│
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  Họ tên     Tên đăng nhập  Vai trò  Status│ │
│  │  ──────────────────────────────────────── │  │
│  │  Nguyễn A   nguyena        EMPLOYEE  ✅   │  │
│  │  Trần B     tranb          ADMIN     ✅   │  │
│  │  Lê C       lec            HR_MGR    ❌   │  │
│  │                                         │  │
│  │  [✏️ Sửa]  [🗑️ Xoá]                    │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  Trang 1/2  [< prev]  [next >]                 │
└─────────────────────────────────────────────────┘
```

### Create/Edit Modal

```
┌─────────────────────────────────────┐
│  Thêm nhân viên              [X]   │
├─────────────────────────────────────┤
│                                     │
│  Họ tên *                           │
│  ┌─────────────────────────────┐   │
│  │ Nguyễn Văn A                 │   │
│  └─────────────────────────────┘   │
│                                     │
│  Tên đăng nhập *   Email           │
│  ┌──────────────┐  ┌───────────┐  │
│  │ nguyenvana   │  │ a@co.vn   │  │
│  └──────────────┘  └───────────┘  │
│                                     │
│  Mật khẩu * (chỉ khi tạo mới)      │
│  ┌─────────────────────────────┐   │
│  │ ••••••••                     │   │
│  └─────────────────────────────┘   │
│                                     │
│  Vai trò *         Ca làm việc *    │
│  [EMPLOYEE ▼]      [Ca sáng ▼]      │
│                                     │
│  Trạng thái                         │
│  [ACTIVE ▼]                         │
│                                     │
│  [Huỷ]              [Lưu]          │
└─────────────────────────────────────┘
```

## Fields

| Field | Type | Required | Validation | Default |
|-------|------|----------|------------|---------|
| fullName | text | Yes | Max 100 chars | — |
| username | text | Yes | Min 3, Max 50 chars | — |
| email | email | No | Valid email format | — |
| password | password | Yes (create) | Min 8 chars | — |
| role | select | Yes | EMPLOYEE, ADMIN, HR_MANAGER | EMPLOYEE |
| shiftId | select | Yes | From shifts API | — |
| status | select | No | ACTIVE, INACTIVE, LOCKED | ACTIVE |

## Filters

| Filter | Type | Options | Default |
|--------|------|---------|---------|
| Search | Text | — | — |
| Role | Select | Tất cả, EMPLOYEE, ADMIN, HR_MANAGER | Tất cả |
| Status | Select | Tất cả, ACTIVE, INACTIVE, LOCKED | Tất cả |

## Actions

| Action | Trigger | API Call | Behavior |
|--------|---------|----------|----------|
| Thêm nhân viên | Button click | — | Open create modal |
| Lưu nhân viên | Modal save | `POST /api/v1/users` | Create new user |
| Sửa nhân viên | Row action | — | Open edit modal |
| Cập nhật | Modal save | `PUT /api/v1/users/{id}` | Update user |
| Xoá nhân viên | Row action | — | Show confirmation dialog |
| Xác nhận xoá | Dialog confirm | `DELETE /api/v1/users/{id}` | Delete user |
| Phân trang | Page click | `GET /api/v1/users` | Load next page |

## CRUD Modals Chi tiết

### Tạo nhân viên mới (Create User)

**Desktop:**
```
┌─────────────────────────────────────────────────┐
│  Tạo nhân viên mới                       [X]   │
├─────────────────────────────────────────────────┤
│                                                 │
│  ── Thông tin cơ bản ──                         │
│                                                 │
│  Mã nhân viên *       Họ và tên *               │
│  ┌──────────────┐     ┌─────────────────────┐  │
│  │ NV-006         │     │ Nguyễn Văn F         │  │
│  └──────────────┘     └─────────────────────┘  │
│  Để trống = tự động                             │
│                                                 │
│  Email *                 Số điện thoại            │
│  ┌─────────────────────┐ ┌───────────────────┐  │
│  │ nvanf@company.com   │ │ 0901234567        │  │
│  └─────────────────────┘ └───────────────────┘  │
│                                                 │
│  ── Phân quyền ──                               │
│                                                 │
│  Vai trò *                                      │
│  ┌─────────┐  ┌──────────┐  ┌─────────┐       │
│  │ EMPLOYEE│  │ HR_MANAGER│  │ ADMIN   │       │
│  └─────────┘  └──────────┘  └─────────┘       │
│                                                 │
│  ── Phân công ──                                │
│                                                 │
│  Ca làm việc *                                  │
│  ┌─────────────────────────────────────┐       │
│  │ ☑ Ca sáng (06:00-14:00)             │       │
│  │ ☐ Ca chiều (14:00-22:00)            │       │
│  │ ☐ Ca tối (22:00-06:00)              │       │
│  └─────────────────────────────────────┘       │
│  Chọn nhiều                                     │
│                                                 │
│  ── Mật khẩu ──                                │
│                                                 │
│  Mật khẩu *               Xác nhận *            │
│  ┌─────────────────────┐  ┌─────────────────┐  │
│  │ ••••••••             │  │ ••••••••         │  │
│  └─────────────────────┘  └─────────────────┘  │
│  Tối thiểu 8 ký tự                              │
│                                                 │
│  ────────────────────────────────────────────  │
│  [Huỷ]                            [✓ Tạo]     │
└─────────────────────────────────────────────────┘
```

**Mobile:** Full-screen modal, nút "Tạo" trên header phải.

| Field | Kiểu | Bắt buộc | Validate | Mặc định |
|-------|------|----------|----------|----------|
| employeeCode | text | ❌ | Max 10, pattern `NV-\d{3}` | Auto-generate |
| fullName | text | ✅ | Max 100 chars | — |
| email | email | ✅ | Valid email, unique | — |
| phone | tel | ❌ | Pattern `0\d{9}` | — |
| role | radio | ✅ | EMPLOYEE / HR_MANAGER / ADMIN | EMPLOYEE |
| shiftIds | checkbox | ✅ | Min 1 selected | — |
| password | password | ✅ | Min 8 chars | — |
| confirmPassword | password | ✅ | Must match password | — |

---

### Sửa thông tin nhân viên (Edit User)

**Desktop:**
```
┌─────────────────────────────────────────────────┐
│  Sửa nhân viên — NV-005 (Nguyễn Văn E)  [X]   │
├─────────────────────────────────────────────────┤
│                                                 │
│  Mã nhân viên: NV-005 (không thể sửa)          │
│                                                 │
│  ── Thông tin cơ bản ──                         │
│  Họ và tên *                                    │
│  ┌─────────────────────────────────────────┐   │
│  │ Nguyễn Văn E                             │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Email *                  Số điện thoại          │
│  ┌─────────────────────┐  ┌─────────────────┐  │
│  │ nvane@company.com   │  │ 0901234568      │  │
│  └─────────────────────┘  └─────────────────┘  │
│                                                 │
│  ── Phân quyền ──                               │
│  Vai trò *                                      │
│  [EMPLOYEE ●] [HR_MANAGER ○] [ADMIN ○]         │
│                                                 │
│  ── Phân công ──                                │
│  Ca làm việc *                                  │
│  [☑] Ca sáng (06:00-14:00)                     │
│  [ ] Ca chiều (14:00-22:00)                    │
│  [ ] Ca tối (22:00-06:00)                      │
│                                                 │
│  ── Mật khẩu (để trống nếu không đổi) ──      │
│  Mật khẩu mới *           Xác nhận *           │
│  ┌─────────────────────┐  ┌─────────────────┐  │
│  │ ••••••••             │  │ ••••••••         │  │
│  └─────────────────────┘  └─────────────────┘  │
│                                                 │
│  ── Trạng thái ──                               │
│  [✅ Đang hoạt động]  ← Toggle                 │
│                                                 │
│  ────────────────────────────────────────────  │
│  [Huỷ]                     [✓ Lưu thay đổi]   │
└─────────────────────────────────────────────────┘
```

**Mobile:** Full-screen modal, same fields.

| Field | Kiểu | Bắt buộc | Validate |
|-------|------|----------|----------|
| employeeCode | disabled | — | Hiển thị, không sửa |
| fullName | text | ✅ | Max 100 |
| email | email | ✅ | Valid, unique |
| phone | tel | ❌ | Pattern `0\d{9}` |
| role | radio | ✅ | EMPLOYEE / HR_MANAGER / ADMIN |
| shiftIds | checkbox | ✅ | Min 1 |
| password | password | ❌ | Min 8, để trống nếu không đổi |
| confirmPassword | password | ❌ | Must match |
| isActive | toggle | — | true/false |

---

### Xoá nhân viên (Delete User)

```
┌─────────────────────────────────────────────┐
│  ⚠️ Xoá nhân viên?                         │
├─────────────────────────────────────────────┤
│                                             │
│  Bạn có chắc chắn muốn xoá nhân viên       │
│  "Nguyễn Văn E" (NV-005)?                   │
│                                             │
│  ℹ️ Đây là thao tác xoá mềm. Nhân viên      │
│  sẽ bị ẩn khỏi danh sách nhưng dữ liệu    │
│  lịch sử vẫn được giữ lại.                   │
│                                             │
│  Hành động này có thể hoàn tác.             │
│                                             │
│  [Huỷ]                      [🗑️ Xoá]      │
└─────────────────────────────────────────────┘
```

**Mobile:** Bottom sheet dialog.

---

### Toast Notifications

| Action | Icon | Color | Message |
|--------|------|-------|---------|
| Tạo thành công | ✅ | Green | "Đã tạo nhân viên [Họ tên] thành công" |
| Sửa thành công | ✅ | Green | "Đã cập nhật thông tin nhân viên" |
| Xoá thành công | ✅ | Green | "Đã xoá nhân viên [Họ tên]" |
| Mã trùng | ❌ | Red | "Mã nhân viên đã tồn tại" |
| Email trùng | ❌ | Red | "Email đã được sử dụng" |
| Lỗi server | ❌ | Red | "Không thể lưu. Vui lòng thử lại" |
| Không thể xoá self | ❌ | Red | "Không thể xoá tài khoản đang đăng nhập" |

---

## API Operations

| Operation | Method | Endpoint | Request | Response |
|-----------|--------|----------|---------|----------|
| getUsers | GET | `/api/v1/users` | `?page={p}&size=20&role={r}&status={s}` | `{ data: { content: [...], page, size, totalElements } }` |
| createUser | POST | `/api/v1/users` | `{ username, password, fullName, email, role, shiftId }` | `{ data: { id, ... } }` |
| updateUser | PUT | `/api/v1/users/{id}` | `{ fullName, email, role, shiftId, status }` | `{ data: { id, ... } }` |
| deleteUser | DELETE | `/api/v1/users/{id}` | — | 204 |
| getShifts | GET | `/api/v1/shifts` | — | `[{ id, name, ... }]` |

## Loading State

| State | Behavior |
|-------|----------|
| Loading | Skeleton rows |
| Success | Table with data |
| Error | Error card with retry |
| Empty | "Chưa có nhân viên nào" |

## Empty State

```
┌─────────────────────────────────────────┐
│                                         │
│         [People Illustration]           │
│                                         │
│    "Chưa có nhân viên"                  │
│    Thêm nhân viên đầu tiên              │
│                                         │
│         [+ Thêm nhân viên]              │
│                                         │
└─────────────────────────────────────────┘
```

## Error Display

| Error Code | Display | Message |
|------------|---------|---------|
| USERNAME_EXISTS | Modal inline | "Tên đăng nhập đã tồn tại" |
| VALIDATION_ERROR | Modal inline | Field-level errors |
| CANNOT_DELETE_SELF | Toast | "Không thể xoá tài khoản đang đăng nhập" |
| UNAUTHORIZED | Redirect | → `/login` |
| FORBIDDEN | Toast | "Bạn không có quyền thực hiện" |
| NETWORK_ERROR | Toast | "Lỗi mạng. Thử lại" |

## Responsive Rules

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Table → card list, modal full-screen |
| Tablet | Full table, modal centered |
| Desktop | Full table with all columns, modal centered |

## Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-SCR09-01 | List shows all users with pagination |
| AC-SCR09-02 | Search filters by name/username |
| AC-SCR09-03 | Role/status filters work correctly |
| AC-SCR09-04 | Create modal has all required fields |
| AC-SCR09-05 | Password field only shown on create (not edit) |
| AC-SCR09-06 | Username uniqueness validated |
| AC-SCR09-07 | Edit modal pre-fills existing data |
| AC-SCR09-08 | Delete shows confirmation dialog |
| AC-SCR09-09 | Cannot delete own account |
| AC-SCR09-10 | Touch target ≥ 44px |
| AC-SCR09-11 | Works at 320px minimum width |
| AC-SCR09-12 | Mobile full-screen modals |
| AC-SCR09-13 | Toast notifications for all CRUD actions |
| AC-SCR09-14 | Email uniqueness validated |
| AC-SCR09-15 | Password confirmation match validated |
| AC-SCR09-16 | Employee code auto-generate when empty |
