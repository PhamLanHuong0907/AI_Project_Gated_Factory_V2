# Stitch Prompt: SCR-09 — Quản lý nhân viên

## Screen Identity

| Field | Value |
|-------|-------|
| Screen ID | SCR-09 |
| Screen Name | Quản lý nhân viên |
| Route | `/admin/users` |
| Use Case | — (Admin CRUD) |
| Actors | ADMIN |
| Layout | App Shell with content area |

## User Role & Goal

ADMIN manages employee accounts: view list, create new, edit, delete. Includes search, role/status filters, and pagination.

## GLOBAL APP SHELL LOCK

> This screen uses the approved App Shell. DO NOT modify the shell. Only design the content area.

## Layout — List View

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

## Layout — Create/Edit Modal

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

## Table Columns

| Column | Width | Sortable | Description |
|--------|-------|----------|-------------|
| Họ tên | 30% | Yes | Full name |
| Tên đăng nhập | 25% | Yes | Username |
| Vai trò | 20% | Yes | Role badge |
| Trạng thái | 15% | Yes | Status badge |
| Thao tác | 10% | No | Edit/Delete buttons |

## Role Badge

| Role | Label | Background | Text Color |
|------|-------|------------|------------|
| EMPLOYEE | Nhân viên | `#DBEAFE` | `#2563EB` |
| ADMIN | Admin | `#F3E8FF` | `#7C3AED` |
| HR_MANAGER | HR Manager | `#DCFCE7` | `#16A34A` |

## Status Badge

| Status | Label | Background | Text Color |
|--------|-------|------------|------------|
| ACTIVE | Hoạt động | `#DCFCE7` | `#16A34A` |
| INACTIVE | Ngừng HĐ | `#FEE2E2` | `#DC2626` |
| LOCKED | Khóa | `#FEF3C7` | `#D97706` |

## Filters

| Filter | Type | Options | Default |
|--------|------|---------|---------|
| Search | Text input | — | — |
| Role | Select | Tất cả, EMPLOYEE, ADMIN, HR_MANAGER | Tất cả |
| Status | Select | Tất cả, ACTIVE, INACTIVE, LOCKED | Tất cả |

## Fields

| Field | Type | Required | Validation | Default |
|-------|------|----------|------------|---------|
| fullName | text | Yes | Max 100 chars | — |
| username | text | Yes | Min 3, Max 50 chars | — |
| email | email | No | Valid email format | — |
| password | password | Yes (create only) | Min 8 chars | — |
| role | select | Yes | EMPLOYEE, ADMIN, HR_MANAGER | EMPLOYEE |
| shiftId | select | Yes | From shifts API | — |
| status | select | No | ACTIVE, INACTIVE, LOCKED | ACTIVE |

## Actions

| Action | Trigger | Component | API Call | Behavior |
|--------|---------|-----------|----------|----------|
| Thêm nhân viên | Button click | Primary Button | — | Open create modal |
| Lưu (create) | Modal save | Primary Button | `POST /api/v1/users` | Create new user |
| Sửa nhân viên | Row action | IconButton | — | Open edit modal |
| Lưu (update) | Modal save | Primary Button | `PUT /api/v1/users/{id}` | Update user |
| Xoá nhân viên | Row action | IconButton | — | Show confirmation dialog |
| Xác nhận xoá | Dialog confirm | Danger Button | `DELETE /api/v1/users/{id}` | Delete user |
| Search | Input change | Text input | `GET /api/v1/users` | Filter by name/username |
| Filter | Select change | Select | `GET /api/v1/users` | Filter by role/status |
| Pagination | Page click | Pagination | `GET /api/v1/users` | Load next page |

## CRUD Modals Chi tiết

### Tạo nhân viên mới (Create User) — Desktop

```
┌─────────────────────────────────────────────────┐
│  Tạo nhân viên mới                       [X]   │
├─────────────────────────────────────────────────┤
│                                                 │
│  ── Thông tin cơ bản ──                         │
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
│  Vai trò *                                      │
│  ┌─────────┐  ┌──────────┐  ┌─────────┐       │
│  │ EMPLOYEE│  │ HR_MANAGER│  │ ADMIN   │       │
│  └─────────┘  └──────────┘  └─────────┘       │
│                                                 │
│  ── Phân công ──                                │
│  Ca làm việc *                                  │
│  ┌─────────────────────────────────────┐       │
│  │ ☑ Ca sáng (06:00-14:00)             │       │
│  │ ☐ Ca chiều (14:00-22:00)            │       │
│  │ ☐ Ca tối (22:00-06:00)              │       │
│  └─────────────────────────────────────┘       │
│                                                 │
│  ── Mật khẩu ──                                │
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

### Sửa nhân viên (Edit User) — Desktop

```
┌─────────────────────────────────────────────────┐
│  Sửa nhân viên — NV-005 (Nguyễn Văn E)  [X]   │
├─────────────────────────────────────────────────┤
│  Mã nhân viên: NV-005 (không thể sửa)          │
│                                                 │
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
│  Vai trò *                                      │
│  [EMPLOYEE ●] [HR_MANAGER ○] [ADMIN ○]         │
│                                                 │
│  Ca làm việc *                                  │
│  [☑] Ca sáng  [ ] Ca chiều  [ ] Ca tối        │
│                                                 │
│  Mật khẩu mới (để trống nếu không đổi)         │
│  ┌─────────────────────┐  ┌─────────────────┐  │
│  │ ••••••••             │  │ ••••••••         │  │
│  └─────────────────────┘  └─────────────────┘  │
│                                                 │
│  Trạng thái: [✅ Đang hoạt động]  ← Toggle     │
│                                                 │
│  ────────────────────────────────────────────  │
│  [Huỷ]                     [✓ Lưu thay đổi]   │
└─────────────────────────────────────────────────┘
```

### Xoá nhân viên — Confirmation

```
┌─────────────────────────────────────────────┐
│  ⚠️ Xoá nhân viên?                         │
├─────────────────────────────────────────────┤
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
| Loading | Skeleton rows (5 placeholder rows) |
| Success | Table with data |
| Error | Error card with retry |
| Empty | "Chưa có nhân viên nào" + people illustration + [+ Thêm nhân viên] button |

## Validation Rules

| Rule | Message |
|------|---------|
| Username required | "Tên đăng nhập không được để trống" |
| Username unique | "Tên đăng nhập đã tồn tại" |
| Password min 8 chars | "Mật khẩu phải có ít nhất 8 ký tự" |
| Valid email | "Email không hợp lệ" |
| Cannot delete self | "Không thể xoá tài khoản đang đăng nhập" |

## Responsive Rules

| Breakpoint | Behavior |
|------------|----------|
| Mobile | Table → card list, modal full-screen |
| Tablet | Full table, modal centered |
| Desktop | Full table with all columns, modal centered |

## Forbidden

- DO NOT add employee salary assignment on this screen
- DO NOT add employee attendance view
- DO NOT add employee shift reassignment
- DO NOT add bulk import/export
- DO NOT add employee profile photo upload

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
