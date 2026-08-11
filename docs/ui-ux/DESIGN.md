# DESIGN.md - Hệ thống Chấm công QR & GPS

## 1. App Shell

```
┌─────────────────────────────────────────────────┐
│                   APP SHELL                      │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌───────────────────────────────────────────┐  │
│  │              TOP BAR (Header)              │  │
│  │  [Logo] [App Name]        [🔔] [👤 Menu] │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  ┌───────────────────────────────────────────┐  │
│  │                                           │  │
│  │              MAIN CONTENT                 │  │
│  │           (Route Outlet)                  │  │
│  │                                           │  │
│  │  - Login: standalone (no shell)           │  │
│  │  - Other screens: inside shell            │  │
│  │                                           │  │
│  └───────────────────────────────────────────┘  │
│                                                  │
│  ┌───────────────────────────────────────────┐  │
│  │          BOTTOM NAV (Mobile ≤768px)        │  │
│  │  [🏠 Trang chủ] [📱 QR] [📋 Lịch sử] [👤]│  │
│  └───────────────────────────────────────────┘  │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Shell Roles

| Component | EMPLOYEE | ADMIN | HR_MANAGER |
|-----------|----------|-------|------------|
| Top Bar | ✅ Logo + User menu | ✅ Logo + User menu | ✅ Logo + User menu |
| Bottom Nav | 4 items: Trang chủ, QR, Lịch sử, Cá nhân | 4 items: Trang chủ, QR, Quản lý, Cá nhân | 4 items: Trang chủ, QR, Quản lý, Cá nhân |
| Sidebar (≥769px) | ❌ Không có | ✅ Desktop sidebar thay bottom nav | ✅ Desktop sidebar thay bottom nav |

### Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | ≤ 480px | Single column, bottom nav, stacked cards |
| Tablet | 481–768px | Single column, bottom nav, expanded cards |
| Desktop | ≥ 769px | Sidebar navigation, multi-column layout |

### PWA Meta Tags

```html
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5">
<meta name="theme-color" content="#2563EB">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

---

## 2. Design Tokens

### 2.1 Colors

#### Brand

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#2563EB` | Primary buttons, links, active states |
| `--color-primary-hover` | `#1D4ED8` | Hover state |
| `--color-primary-active` | `#1E40AF` | Active/pressed state |
| `--color-primary-light` | `#DBEAFE` | Backgrounds, badges |
| `--color-secondary` | `#64748B` | Secondary buttons, subtitles |

#### Semantic

| Token | Value | Usage |
|-------|-------|-------|
| `--color-success` | `#16A34A` | Check-in success, approved |
| `--color-success-light` | `#DCFCE7` | Success badge background |
| `--color-warning` | `#D97706` | Late arrival, warnings |
| `--color-warning-light` | `#FEF3C7` | Warning badge background |
| `--color-error` | `#DC2626` | Errors, denied, failed |
| `--color-error-light` | `#FEE2E2` | Error badge background |

#### Neutral

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `#FFFFFF` | Page background |
| `--color-surface` | `#F8FAFC` | Card background |
| `--color-border` | `#E2E8F0` | Borders, dividers |
| `--color-text` | `#0F172A` | Primary text |
| `--color-text-secondary` | `#64748B` | Subtitles, labels |
| `--color-text-disabled` | `#94A3B8` | Disabled text |

#### Dark Mode Overrides

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

### 2.2 Spacing

| Token | Value |
|-------|-------|
| `--space-xs` | `4px` |
| `--space-sm` | `8px` |
| `--space-md` | `16px` |
| `--space-lg` | `24px` |
| `--space-xl` | `32px` |
| `--space-2xl` | `48px` |

### 2.3 Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `4px` | Input fields, small elements |
| `--radius-md` | `8px` | Cards, buttons |
| `--radius-lg` | `12px` | Modals, large cards |
| `--radius-full` | `9999px` | Avatars, badges |

### 2.4 Shadows

| Token | Value |
|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` |

### 2.5 Typography

| Token | Value |
|-------|-------|
| `--font-family` | `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` |
| `--font-mono` | `'JetBrains Mono', 'Fira Code', monospace` |

| Scale | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `--text-xs` | 12px | 400 | 16px | Captions, timestamps |
| `--text-sm` | 14px | 400 | 20px | Body small, labels |
| `--text-base` | 16px | 400 | 24px | Body default |
| `--text-lg` | 18px | 600 | 28px | Subheadings |
| `--text-xl` | 20px | 600 | 28px | Section titles |
| `--text-2xl` | 24px | 700 | 32px | Page titles |
| `--text-3xl` | 30px | 700 | 36px | Hero numbers |

### 2.6 Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--z-base` | 0 | Default |
| `--z-dropdown` | 100 | Dropdowns, popovers |
| `--z-sticky` | 200 | Sticky header |
| `--z-modal` | 300 | Modals, overlays |
| `--z-toast` | 400 | Toast notifications |
| `--z-camera` | 500 | Camera viewfinder |

### 2.7 Animation

| Token | Value |
|-------|-------|
| `--duration-fast` | 150ms |
| `--duration-normal` | 250ms |
| `--duration-slow` | 350ms |
| `--easing` | `cubic-bezier(0.4, 0, 0.2, 1)` |

### 2.8 Touch Target

Minimum touch target: **44px × 44px** (WCAG 2.5.5).

### 2.9 Haptic Feedback

```typescript
// Trigger haptic feedback on supported devices
function hapticFeedback(type: 'light' | 'medium' | 'heavy' = 'light') {
  if ('vibrate' in navigator) {
    const patterns = { light: [10], medium: [20], heavy: [30] };
    navigator.vibrate(patterns[type]);
  }
}
```

---

## 3. Component Inventory

| Component | Description | Used In |
|-----------|-------------|---------|
| `Button` | Primary, secondary, ghost, danger variants | All screens |
| `Input` | Text, password, number with label + error | Login, forms |
| `Select` | Dropdown with search | Forms, filters |
| `Card` | Content container with shadow | Dashboard, lists |
| `Modal` | Overlay dialog for confirmations | Delete confirm, QR display |
| `Toast` | Success/error notification (auto-dismiss 3s) | All screens |
| `Spinner` | Loading indicator (max 10s timeout) | All screens |
| `Table` | Data table with sort, pagination | History, reports |
| `Badge` | Status indicator (ON_TIME, LATE, etc.) | Attendance, reports |
| `Avatar` | User initials or image | Top bar, user list |
| `Tabs` | View switcher within a screen | Attendance history |
| `DatePicker` | Month/year picker for filters | Reports, history |
| `EmptyState` | Illustrated empty message | Lists with no data |
| `QRCode` | Generated QR display with countdown | QR Generate screen |

---

## 4. Loading Strategy

| Scenario | Behavior |
|----------|----------|
| Initial page load | Skeleton loader (300ms delay before showing) |
| API call < 300ms | No spinner (instant feel) |
| API call 300ms–10s | Spinner overlay on content area |
| API call > 10s | Timeout error: "Vui lòng thử lại" |
| QR refresh | Countdown timer + spinner on refresh |
| GPS acquisition | "Đang lấy vị trí..." with spinner |

---

## 5. Error Display Pattern

```
┌─────────────────────────────────────┐
│  ⚠️ [Error Icon]                    │
│                                     │
│  [Error Title - bold]               │
│  [Error message - descriptive]      │
│  [Error code if available]          │
│                                     │
│  [🔄 Thử lại]  [🏠 Về trang chủ]   │
└─────────────────────────────────────┘
```

| HTTP Status | Display |
|-------------|---------|
| 400 | Inline field errors + toast |
| 401 | Redirect to login |
| 403 | "Bạn không có quyền truy cập" + back button |
| 404 | "Không tìm thấy" + back button |
| 409 | Toast with conflict message |
| 429 | "Quá nhiều yêu cầu. Vui lòng thử lại sau [X]s" |
| 500 | Full-page error with retry |

---

## 6. Empty State Pattern

```
┌─────────────────────────────────────┐
│                                     │
│         [Illustration]              │
│                                     │
│    "Chưa có dữ liệu"               │
│    [Descriptive subtitle]           │
│                                     │
│         [Action Button]             │
└─────────────────────────────────────┘
```

---

## 7. Screen Route Map

| Route | Screen | Actor |
|-------|--------|-------|
| `/login` | Đăng nhập | All (unauthenticated) |
| `/` | Dashboard | ADMIN, HR_MANAGER |
| `/qr/generate` | Tạo mã QR | ADMIN |
| `/qr/scan` | Quét mã QR | EMPLOYEE |
| `/attendance` | Lịch sử chấm công | All (authenticated) |
| `/admin/shifts` | Quản lý ca làm việc | ADMIN |
| `/admin/salary-config` | Cấu hình lương | ADMIN, HR_MANAGER |
| `/admin/salary-report` | Báo cáo lương | ADMIN, HR_MANAGER |
| `/admin/users` | Quản lý nhân viên | ADMIN |

> **Lưu ý**: Screens `/admin/users` và GPS config là tính năng quản trị bổ sung, được bổ sung từ OpenAPI endpoints (`GET/POST /users`, `GET/PUT /config/gps`). Không tạo CRUD screen cho mỗi bảng — chỉ tạo khi có use case tương ứng.
