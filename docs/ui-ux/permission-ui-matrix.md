# Permission UI Matrix

## Role Access Matrix

| Screen | Route | EMPLOYEE | ADMIN | HR_MANAGER |
|--------|-------|----------|-------|------------|
| SCR-01 (Login) | `/login` | ✅ | ✅ | ✅ |
| SCR-02 (Dashboard) | `/` | ❌ → `/qr/scan` | ✅ | ✅ |
| SCR-03 (QR Generate) | `/qr/generate` | ❌ → `/qr/scan` | ✅ | ❌ → `/qr/scan` |
| SCR-04 (QR Scan) | `/qr/scan` | ✅ | ✅ | ✅ |
| SCR-05 (Attendance) | `/attendance` | ✅ (own) | ✅ (all) | ✅ (all) |
| SCR-06 (Shifts) | `/admin/shifts` | ❌ 403 | ✅ | ❌ 403 |
| SCR-07 (Salary Config) | `/admin/salary-config` | ❌ 403 | ✅ | ✅ (read-only tabs) |
| SCR-08 (Salary Report) | `/admin/salary-report` | ❌ 403 | ✅ | ✅ |
| SCR-09 (Users) | `/admin/users` | ❌ 403 | ✅ | ❌ 403 |
| SCR-10 (Settings) | `/admin/settings` | ❌ 403 | ✅ (edit) | ✅ (read-only) |
| SCR-11 (Đơn từ - Nhân viên) | `/my/leave-requests` | ✅ (own) | ✅ (all) | ✅ (all) |
| SCR-12 (Duyệt đơn) | `/admin/leave-requests` | ❌ 403 | ✅ | ✅ |

## SCR-07 Tab-Level Permission Matrix

| Tab | ADMIN | HR_MANAGER |
|-----|-------|------------|
| Tab 1: Vị trí (salary_positions) | CRUD | Read-only |
| Tab 2: Kinh nghiệm (salary_experience) | CRUD | Read-only |
| Tab 3: Phạt chấm công (salary_penalties) | CRUD | Read-only |
| Tab 4: Thưởng (salary_bonus) | CRUD | Read-only |
| Tab 5: Công thức tính lương | CRUD | Read-only |
| Phân công NV (employee assignment) | CRUD | Read + Update |

## Data Scope Matrix

| Screen | EMPLOYEE | ADMIN | HR_MANAGER |
|--------|----------|-------|------------|
| Attendance History | Own records only | All employees | All employees |
| Shift Config | Read-only (current shift) | Full CRUD | No access |
| Salary Config | No access | Full CRUD | Read + Update |
| Salary Report | No access | Full access | Full access |
| User Management | No access | Full CRUD | No access |
| Settings (GPS/QR/CC) | No access | Full access | Read-only |
| Leave Requests (Own) | Own requests only | All requests | All requests |
| Leave Requests (Approve) | No access | Full access | Full access |

## UI Element Visibility

| Element | EMPLOYEE | ADMIN | HR_MANAGER |
|---------|----------|-------|------------|
| Sidebar: Nhân viên | Hidden | Visible | Hidden |
| Sidebar: Ca làm việc | Hidden | Visible | Hidden |
| Sidebar: Cấu hình lương | Hidden | Visible | Visible |
| Sidebar: Báo cáo lương | Hidden | Visible | Visible |
| Button: Tạo QR | Hidden | Visible | Hidden |
| Button: Thêm nhân viên | Hidden | Visible | Hidden |
| Button: Thêm ca mới | Hidden | Visible | Hidden |
| Button: Xuất CSV | Hidden | Visible | Visible |
| Button: Lưu GPS | Hidden | Visible | Hidden |

## Navigation Tab Configuration

### EMPLOYEE Bottom Nav

| Tab | Route | Icon |
|-----|-------|------|
| Trang chủ | `/qr/scan` | QrCode |
| Lịch sử | `/attendance` | History |
| Cá nhân | `/profile` | User |

### ADMIN Bottom Nav (Mobile)

| Tab | Route | Icon |
|-----|-------|------|
| Trang chủ | `/` | Home |
| Quản lý | `/admin/shifts` | Settings |
| QR Code | `/qr/generate` | QrCode |
| Cá nhân | `/profile` | User |

### HR_MANAGER Bottom Nav (Mobile)

| Tab | Route | Icon |
|-----|-------|------|
| Trang chủ | `/` | Home |
| Quản lý | `/admin/salary-config` | Settings |
| QR Code | `/qr/scan` | QrCode |
| Cá nhân | `/profile` | User |

## Route Guard Implementation

```typescript
const routePermissions = {
  '/':                    ['ADMIN', 'HR_MANAGER'],
  '/qr/generate':         ['ADMIN'],
  '/qr/scan':             ['EMPLOYEE', 'ADMIN', 'HR_MANAGER'],
  '/attendance':          ['EMPLOYEE', 'ADMIN', 'HR_MANAGER'],
  '/my/leave-requests':   ['EMPLOYEE', 'ADMIN', 'HR_MANAGER'],
  '/admin/leave-requests': ['ADMIN', 'HR_MANAGER'],
  '/admin/shifts':        ['ADMIN'],
  '/admin/salary-config': ['ADMIN', 'HR_MANAGER'],
  '/admin/salary-report': ['ADMIN', 'HR_MANAGER'],
  '/admin/users':         ['ADMIN'],
  '/admin/settings':      ['ADMIN'],
};
```
