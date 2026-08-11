# Stitch Prompt Index

## Overview

| Field | Value |
|-------|-------|
| Project | QR & GPS Attendance System |
| Version | 2.0 |
| Total Screens | 12 |
| Total Prompts | 13 (1 App Shell + 12 Screens) |
| Created | 2026-08-10 |
| Status | READY_FOR_STITCH |

## Master Visual Language Reference

All prompts reference the approved design tokens from `docs/ui-ux/DESIGN.md`:

- **Primary**: `#2563EB` (buttons, links, active states)
- **Success**: `#16A34A` / **Warning**: `#D97706` / **Error**: `#DC2626`
- **Font**: Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
- **Radius**: sm=4px, md=8px, lg=12px, full=9999px
- **Spacing**: xs=4, sm=8, md=16, lg=24, xl=32, 2xl=48
- **Shadows**: sm, md, lg
- **Min touch target**: 44px × 44px

## Prompt List

| # | Screen ID | File | Screen Name | Route | Pattern |
|---|-----------|------|-------------|-------|---------|
| 1 | APP-SHELL | [APP-SHELL.md](screens/APP-SHELL.md) | App Shell (Global Layout) | — | Shell |
| 2 | SCR-01 | [SCR-01.md](screens/SCR-01.md) | Đăng nhập | `/login` | Form (standalone) |
| 3 | SCR-02 | [SCR-02.md](screens/SCR-02.md) | Dashboard | `/` | Dashboard |
| 4 | SCR-03 | [SCR-03.md](screens/SCR-03.md) | Tạo mã QR | `/qr/generate` | Feature |
| 5 | SCR-04 | [SCR-04.md](screens/SCR-04.md) | Quét mã QR & GPS | `/qr/scan` | Camera/Feature |
| 6 | SCR-05 | [SCR-05.md](screens/SCR-05.md) | Lịch sử chấm công | `/attendance` | **List (tiêu biểu)** |
| 7 | SCR-06 | [SCR-06.md](screens/SCR-06.md) | Quản lý ca làm việc | `/admin/shifts` | **CRUD List + Create/Edit** |
| 8 | SCR-07 | [SCR-07.md](screens/SCR-07.md) | Cấu hình lương | `/admin/salary-config` | Tabbed CRUD + Formula Builder |
| 9 | SCR-08 | [SCR-08.md](screens/SCR-08.md) | Báo cáo lương | `/admin/salary-report` | Report |
| 10 | SCR-09 | [SCR-09.md](screens/SCR-09.md) | Quản lý nhân viên | `/admin/users` | CRUD List |
| 11 | SCR-10 | [SCR-10.md](screens/SCR-10.md) | Cài đặt (GPS + QR + Chấm công) | `/admin/settings` | Config Form (3 sections) |
| 12 | SCR-11 | [SCR-11.md](screens/SCR-11.md) | Đơn xin nghỉ (Nhân viên) | `/my/leave-requests` | Card List + Create Modal |
| 13 | SCR-12 | [SCR-12.md](screens/SCR-12.md) | Duyệt đơn xin nghỉ (Admin/HR) | `/admin/leave-requests` | Table List + Approve/Reject |

## Pattern Legend

| Pattern | Description | Priority |
|---------|-------------|----------|
| Shell | Global app layout, navigation, top bar | Must-have |
| Form (standalone) | Login form without app shell | Must-have |
| Dashboard | Stat cards + charts + recent activity | Must-have |
| Feature | Single-purpose feature screen | Must-have |
| Camera/Feature | Camera-based feature with overlays | Must-have |
| List (tiêu biểu) | Data table with filters, pagination | Must-have |
| CRUD List + Create/Edit | Table + modal form for create/edit | Must-have |
| Tabbed CRUD + Formula | Complex multi-tab with CRUD per tab | Must-have |
| Report | Filter + summary stats + data table | Must-have |
| Config Form | Read+Update config with map | Must-have |

## Usage Instructions

1. **Copy each prompt** into Google Stitch as a separate design request
2. **Start with APP-SHELL** — it defines the global layout used by all other screens
3. **Then SCR-01 (Login)** — standalone, no shell dependency
4. **Then SCR-06 (Shifts)** — representative CRUD pattern for all admin screens
5. **Then remaining screens** in any order

## Cross-Check

- [x] 10 screens in INDEX = 10 screen spec files
- [x] 11 prompts = 10 screens + 1 App Shell
- [x] Each prompt references approved DESIGN.md tokens
- [x] No custom branding, sidebar redesign, or navigation changes in prompts
- [x] All fields/actions match screen spec files exactly
