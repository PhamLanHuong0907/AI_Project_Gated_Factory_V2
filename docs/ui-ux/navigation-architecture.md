# Navigation Architecture - Hệ thống Chấm công QR & GPS

## 1. Navigation Structure

### 1.1 Mobile Navigation (≤768px) — Bottom Tab Bar

```
┌─────────────────────────────────────────────┐
│                                             │
│              MAIN CONTENT                   │
│                                             │
├─────────────────────────────────────────────┤
│  🏠        📱         📋         👤        │
│  Trang chủ  QR Code   Lịch sử   Cá nhân    │
│  (active)                                      │
└─────────────────────────────────────────────┘
```

| Tab | Route | Icon | Badge | Roles |
|-----|-------|------|-------|-------|
| Trang chủ | `/` | Home | — | ADMIN, HR_MANAGER |
| QR Code | `/qr/scan` or `/qr/generate` | QrCode | — | All |
| Lịch sử | `/attendance` | History | — | All |
| Cá nhân | `/profile` | User | — | All |

> **Lưu ý**: Tab "Quản lý" (cài đặt ⚙️) xuất hiện trên mobile cho ADMIN và HR_MANAGER, thay thế tab "Trang chủ".

### 1.2 Desktop Navigation (≥769px) — Sidebar

```
┌──────────┬─────────────────────────────────────────┐
│ SIDEBAR  │              MAIN CONTENT                │
│          │                                         │
│ 🏠 Trang chủ │                                       │
│          │                                         │
│ 📱 QR Code  │                                       │
│ 📋 Lịch sử  │                                       │
│          │                                         │
│ ─────── │                                         │
│ QUẢN LÝ  │                                         │
│ 👥 Nhân viên│                                       │
│ 🕐 Ca làm việc│                                     │
│ 💰 Cấu hình lương│                                   │
│ 📊 Báo cáo lương│                                   │
│ ⚙️ Cài đặt     │                                       │
│          │                                         │
│ ─────── │                                         │
│ 👤 Cá nhân │                                       │
│ 🚪 Đăng xuất│                                      │
└──────────┴─────────────────────────────────────────┘
```

| Sidebar Item | Route | Roles |
|-------------|-------|-------|
| Trang chủ | `/` | ADMIN, HR_MANAGER |
| QR Code | `/qr/scan` or `/qr/generate` | All |
| Lịch sử | `/attendance` | All |
| Đơn từ | `/my/leave-requests` (EMPLOYEE), `/admin/leave-requests` (ADMIN, HR_MANAGER) | All |
| Nhân viên | `/admin/users` | ADMIN |
| Ca làm việc | `/admin/shifts` | ADMIN |
| **Cấu hình lương** | `/admin/salary-config` | ADMIN |
| Báo cáo lương | `/admin/salary-report` | ADMIN, HR_MANAGER |
| **Cài đặt** | `/admin/settings` | ADMIN |
| Cá nhân | `/profile` | All |
| Đăng xuất | — (action) | All |

### 1.3 QR Code Navigation Decision

QR tab routing depends on user role:

| Role | QR Tab Route | Behavior |
|------|-------------|----------|
| EMPLOYEE | `/qr/scan` | Camera viewfinder for scanning |
| ADMIN | `/qr/generate` | Generate and display QR code |
| HR_MANAGER | `/qr/scan` | Same as employee (scan to check in) |

---

## 2. Route Guard / Auth Logic

```
if (not authenticated) → redirect to /login
if (authenticated && path = /login) → redirect to /
if (path starts with /admin && role !== ADMIN && role !== HR_MANAGER) → redirect to /
```

### Route Permission Matrix

| Route | EMPLOYEE | ADMIN | HR_MANAGER |
|-------|----------|-------|------------|
| `/login` | ✅ (unauth) | ✅ (unauth) | ✅ (unauth) |
| `/` | ❌ Redirect | ✅ | ✅ |
| `/qr/scan` | ✅ | ✅ | ✅ |
| `/qr/generate` | ❌ Redirect to `/qr/scan` | ✅ | ❌ Redirect to `/qr/scan` |
| `/attendance` | ✅ (own data) | ✅ (all data) | ✅ (all data) |
| `/admin/users` | ❌ 403 | ✅ | ❌ 403 |
| `/admin/shifts` | ❌ 403 | ✅ | ❌ 403 |
| `/admin/salary-config` | ❌ 403 | ✅ | ✅ (read-only tabs) |
| `/admin/salary-report` | ❌ 403 | ✅ | ✅ |
| `/profile` | ✅ (own) | ✅ (own) | ✅ (own) |

---

## 3. Deep Linking

| Screen | Deep Link | Behavior |
|--------|-----------|----------|
| QR Scan | `/qr/scan` | Opens camera immediately |
| QR Generate | `/qr/generate` | Generates new QR on mount |
| Attendance | `/attendance` | Default tab: "Tháng này" |
| Attendance | `/attendance?month=7&year=2026` | Pre-filtered view |
| Salary Report | `/admin/salary-report?month=7&year=2026` | Pre-filtered report |

---

## 4. Navigation State

### 4.1 Active State Indicators

- **Mobile Bottom Nav**: Active tab has filled icon + primary color + label
- **Desktop Sidebar**: Active item has primary color background + left border accent
- **Breadcrumb** (optional for nested routes): `Trang chủ / Quản lý / Ca làm việc`

### 4.2 Back Navigation

| Screen | Back Button | Target |
|--------|-------------|--------|
| QR Scan | ❌ No back (tab) | — |
| QR Generate | ❌ No back (tab) | — |
| Attendance | ❌ No back (tab) | — |
| Shift Config | ✅ Back | `/` or previous |
| Salary Config | ✅ Back | `/` or previous |
| Salary Report | ✅ Back | `/` or previous |
| User Management | ✅ Back | `/` or previous |

### 4.3 Unsaved Changes Warning

When user has unsaved form data and tries to navigate away:

```
┌─────────────────────────────────────┐
│  ⚠️ Thoát mà không lưu?             │
│                                     │
│  Bạn có thay đổi chưa được lưu.    │
│  Bạn có chắc chắn muốn thoát?      │
│                                     │
│  [Huỷ]          [Thoát]            │
└─────────────────────────────────────┘
```

Applies to: Shift Config form, Salary Config form, User Create/Edit form.

---

## 5. Post-Login Redirect

| Role | Default Route After Login |
|------|--------------------------|
| EMPLOYEE | `/qr/scan` |
| ADMIN | `/` |
| HR_MANAGER | `/` |
