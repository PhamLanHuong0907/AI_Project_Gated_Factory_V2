# Stitch Prompt: APP-SHELL (Global Layout)

## Screen Identity

| Field | Value |
|-------|-------|
| Screen ID | APP-SHELL |
| Screen Name | App Shell — Global Layout |
| Route | All authenticated screens |
| Pattern | Shell (Global) |

## User Role & Goal

All authenticated users (EMPLOYEE, ADMIN, HR_MANAGER) see this shell. It provides the global navigation structure, top bar, and content area. The shell adapts based on user role.

## GLOBAL APP SHELL LOCK

> **DO NOT** redesign navigation structure, add new sidebar items, change bottom nav tabs, or modify the top bar layout beyond what is specified below. This shell is approved and locked.

## Layout Specification

### Mobile (≤768px)

```
┌─────────────────────────────────────────────┐
│              TOP BAR (Header)               │
│  [☰ Menu]  [App Name]      [🔔] [👤 Menu] │
├─────────────────────────────────────────────┤
│                                             │
│              MAIN CONTENT                   │
│           (Route Outlet)                    │
│                                             │
├─────────────────────────────────────────────┤
│  🏠        📱         📋         👤        │
│  Trang chủ  QR Code   Lịch sử   Cá nhân    │
│  (active)   (active)                       │
└─────────────────────────────────────────────┘
```

### Desktop (≥769px)

```
┌──────────┬─────────────────────────────────────────┐
│ SIDEBAR  │              TOP BAR                     │
│          │  [Logo] [App Name]     [🔔] [👤 Menu]  │
│ 🏠 Trang chủ├─────────────────────────────────────────┤
│ 📱 QR Code  │                                       │
│ 📋 Lịch sử  │           MAIN CONTENT                │
│            │        (Route Outlet)                  │
│ ─────── │                                       │
│ QUẢN LÝ  │                                       │
│ 👥 Nhân viên│                                       │
│ 🕐 Ca làm việc│                                     │
│ 💰 Cấu hình lương│                                   │
│ 📊 Báo cáo lương│                                   │
│            │                                       │
│ ─────── │                                       │
│ 👤 Cá nhân │                                       │
│ 🚪 Đăng xuất│                                      │
└──────────┴─────────────────────────────────────────┘
```

## Component Details

### Top Bar

| Element | Position | Behavior |
|---------|----------|----------|
| Logo | Left | Static image, max 32px height |
| App Name | Left, after logo | "Hệ thống Chấm công QR & GPS", text-lg, font-weight 600 |
| Notification Bell | Right | Badge with count, click opens dropdown |
| User Avatar | Right | Circle with initials or image, click opens menu |
| User Menu | Dropdown | Profile, Logout |

### Bottom Nav (Mobile, ≤768px)

| Tab | Route | Icon | Roles |
|-----|-------|------|-------|
| Trang chủ | `/` | Home | ADMIN, HR_MANAGER |
| QR Code | `/qr/scan` or `/qr/generate` | QrCode | All |
| Lịch sử | `/attendance` | History | All |
| Cá nhân | `/profile` | User | All |

**Active state**: Filled icon + primary color (`#2563EB`) + label text
**Inactive state**: Outline icon + secondary color (`#64748B`)

### Sidebar (Desktop, ≥769px)

| Sidebar Item | Route | Roles | Icon |
|-------------|-------|-------|------|
| Trang chủ | `/` | ADMIN, HR_MANAGER | Home |
| QR Code | `/qr/scan` or `/qr/generate` | All | QrCode |
| Lịch sử | `/attendance` | All | History |
| Nhân viên | `/admin/users` | ADMIN | Users |
| Ca làm việc | `/admin/shifts` | ADMIN | Clock |
| Cấu hình lương | `/admin/salary-config` | ADMIN | DollarSign |
| Báo cáo lương | `/admin/salary-report` | ADMIN, HR_MANAGER | BarChart |
| Cá nhân | `/profile` | All | User |
| Đăng xuất | — (action) | All | LogOut |

**Active state**: Primary color background + left border accent (3px `#2563EB`)
**Section header**: "QUẢN LÝ" in uppercase, text-xs, color-text-secondary

## Design Tokens (must follow exactly)

| Token | Value |
|-------|-------|
| `--color-primary` | `#2563EB` |
| `--color-primary-hover` | `#1D4ED8` |
| `--color-secondary` | `#64748B` |
| `--color-bg` | `#FFFFFF` |
| `--color-surface` | `#F8FAFC` |
| `--color-border` | `#E2E8F0` |
| `--color-text` | `#0F172A` |
| `--color-text-secondary` | `#64748B` |
| `--font-family` | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` |
| `--radius-md` | `8px` |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` |
| `--space-md` | `16px` |
| `--space-lg` | `24px` |

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | ≤ 480px | Single column, bottom nav, stacked cards |
| Tablet | 481–768px | Single column, bottom nav, expanded cards |
| Desktop | ≥ 769px | Sidebar navigation, multi-column layout |

## Dark Mode

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0F172A;
    --color-surface: #1E293B;
    --color-border: #334155;
    --color-text: #F1F5F9;
    --color-text-secondary: #94A3B8;
  }
}
```

## Forbidden

- DO NOT add new navigation items beyond those listed
- DO NOT change the sidebar/bottom nav structure
- DO NOT redesign the top bar layout
- DO NOT add custom branding or logos beyond the approved design
- DO NOT change the responsive breakpoint values

## Acceptance Criteria

| ID | Criterion |
|----|-----------|
| AC-SHELL-01 | Top bar renders with logo, app name, notification bell, user avatar |
| AC-SHELL-02 | Bottom nav shows 4 tabs on mobile with correct routes |
| AC-SHELL-03 | Sidebar shows all items on desktop with correct routes |
| AC-SHELL-04 | Active nav item highlighted with primary color |
| AC-SHELL-05 | Role-based visibility: Employee sees limited sidebar |
| AC-SHELL-06 | Dark mode toggle respects system preference |
| AC-SHELL-07 | Touch targets ≥ 44px on all nav items |
| AC-SHELL-08 | Smooth transitions between screens (250ms) |
