# Component Specs

> Extracted from Stitch export: `stitch_custom_page_layout_design/.../precision_attendance_system/DESIGN.md`

## Buttons

### Primary Button
- Background: `--color-primary` (#2563EB)
- Text: White (#FFFFFF)
- Min height: **44px** (mobile accessibility)
- Radius: `--radius` (8px)
- Hover: `--color-primary-dark` (#1D4ED8)
- Padding: 12px 24px

### Secondary Button
- Style: Ghost (transparent background)
- Border: 1px `--color-secondary` (#475569)
- Text: `--color-secondary`
- Min height: **44px** (mobile)
- Radius: `--radius` (8px)

### Danger Button
- Background: `--color-error` (#DC2626)
- Text: White (#FFFFFF)
- Used for: Delete, reject actions

## Input Fields

- Radius: `--radius` (8px)
- Border: 1px `--color-border`
- Padding: 16px horizontal
- Active/Focus: 2px `--color-primary` ring
- Height: ~44px (mobile accessible)

## Attendance Badges

- Shape: **Pill** (`--radius-full`)
- Background: Light variant of status color
- Text: Status color
- Variants:
  - `ON_TIME` → success-light bg, success text
  - `LATE` → warning-light bg, warning text
  - `ABSENT` → error-light bg, error text
  - `XIN_NGHI` → primary-container bg, primary text

## Cards

- Background: `--color-background` (#FFFFFF)
- Shadow: `--shadow-md`
- Border: 1px `--color-border`
- Padding: `--spacing-md` (16px)
- Mobile: full-width, 16px horizontal margins

## QR Viewfinder (Mobile)

- Semi-transparent dark overlay
- Clear "cut-out" square in center
- Primary blue (#2563EB) corners to guide user
- Full-screen on mobile

## Bottom Navigation (Mobile)

- Fixed to bottom
- Icons centered
- Labels: 12px (`label-xs`), centered below icons
- Min touch target: **44px**
- Active state: `--color-primary` icon + label

## Data Table (Desktop)

- Full container width
- Header: `--color-surface` background, `body-sm` weight 600
- Rows: alternating white/surface
- Cell padding: `--spacing-sm` horizontal, `--spacing-md` vertical
- Borders: 1px `--color-border` between rows

## Modal / Dialog

- Overlay: semi-transparent black (0.5 opacity)
- Container: white bg, `--radius-md` (12px), `--shadow-lg`
- Desktop: centered, max-width 480-560px
- Mobile: full-screen or bottom sheet
- Header: `headline-xl`, body padding `--spacing-lg`
- Footer: right-aligned buttons, padding `--spacing-lg`

## Status Tabs

- Horizontal tab bar
- Active tab: `--color-primary` bottom border + text
- Inactive: `--color-text-muted` text
- Used in: Leave request list, attendance history

## Toast / Notification

- Fixed top-right (desktop) or top-center (mobile)
- Auto-dismiss: 3-5 seconds
- Background: semantic light color (success-light, warning-light, error-light)
- Border-left: 4px semantic color
- Icon + message text
