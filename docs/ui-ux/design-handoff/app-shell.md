# App Shell Specification

> Derived from Stitch export screenshots and DESIGN.md

## Overview

The Precision Attendance System uses a **responsive shell** with two distinct layouts:

| Breakpoint | Layout | Navigation |
|------------|--------|------------|
| Desktop (≥ 769px) | Sidebar + Content | Left sidebar, 260px fixed |
| Mobile (≤ 480px) | Top Bar + Content + Bottom Nav | Fixed bottom nav, 44px height |

## Desktop Layout

```
┌──────────────────────────────────────────────────────┐
│ Top Bar (h: 64px)                                    │
│ [☰] [Logo/App Name]           [🔍] [🔔] [👤 Avatar] │
├──────────┬───────────────────────────────────────────┤
│          │                                           │
│ Sidebar  │         Main Content Area                 │
│  260px   │         (flex: 1, scrollable)             │
│          │                                           │
│ 📊 Dashboard│    ┌─────────────────────────────┐     │
│ ⏰ Chấm công│    │  Page Header (headline-2xl)  │     │
│ 📋 Lịch sử │    │  Filters / Actions Bar       │     │
│ 📅 Ca làm  │    │  Content (cards/table)       │     │
│ 💰 Lương   │    │                               │     │
│ 👥 Nhân sự │    └─────────────────────────────┘     │
│ 📄 Đơn từ  │                                           │
│ ⚙️ Cài đặt │                                           │
│          │                                           │
└──────────┴───────────────────────────────────────────┘
```

### Sidebar
- Width: **260px** fixed
- Background: `--color-background` (#FFFFFF)
- Border-right: 1px `--color-border`
- Logo area: top, padding `--spacing-lg`
- Nav items: icon + label, 48px height
- Active item: `--color-primary` background tint + icon color
- Hover: `--color-surface` background

### Top Bar
- Height: **64px**
- Background: `--color-background`
- Border-bottom: 1px `--color-border`
- Left: hamburger (mobile toggle), app name
- Right: search icon, notifications bell, user avatar dropdown

## Mobile Layout

```
┌─────────────────────────┐
│ Top Bar (h: 56px)       │
│ [☰] [Title]    [🔔][👤] │
├─────────────────────────┤
│                         │
│   Main Content          │
│   (16px margins)        │
│   (scrollable)          │
│                         │
│                         │
├─────────────────────────┤
│ Bottom Nav (h: 64px)    │
│  🏠  ⏰  📋  👤  ⚙️    │
│ Home Clock History Me Set│
└─────────────────────────┘
```

### Bottom Navigation
- Height: **64px** (includes label)
- Fixed to bottom
- 5 items: Home, Clock In, History, Me, Settings
- Icon: 24px, centered
- Label: 12px (`label-xs`), centered below icon
- Active: `--color-primary` icon + label
- Inactive: `--color-text-muted`
- Min touch target: **44px**

## Navigation Rules

| From | To | Trigger |
|------|----|---------|
| Any page | Dashboard | Sidebar "Dashboard" / Bottom Nav "Home" |
| Any page | Clock In | Sidebar "Chấm công" / Bottom Nav "Clock" |
| Any page | History | Sidebar "Lịch sử" / Bottom Nav "History" |
| Any page | Profile | Sidebar avatar / Bottom Nav "Me" |
| Any page | Settings | Sidebar "Cài đặt" / Bottom Nav "Settings" |
| Employee | Leave Requests | Sidebar "Đơn từ" |
| Admin/HR | Leave Approvals | Sidebar "Đơn từ" → "Duyệt đơn" |

## Responsive Breakpoints

| Breakpoint | Width | Layout Change |
|------------|-------|---------------|
| Mobile | ≤ 480px | Single column, bottom nav, 16px margins |
| Tablet | 481-768px | Single column, no sidebar, top nav only |
| Desktop | ≥ 769px | Sidebar + content, top bar |
| Wide | ≥ 1280px | Max-width container, centered content |

## Page Structure Pattern

Every page follows this structure:

```html
<div class="page">
  <header class="page-header">
    <h1 class="headline-2xl">Page Title</h1>
    <div class="page-actions"><!-- Action buttons --></div>
  </header>
  <div class="page-filters"><!-- Filter bar (if needed) --></div>
  <main class="page-content">
    <!-- Cards, tables, or forms -->
  </main>
</div>
```
