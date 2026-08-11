# Spacing & Layout Tokens

> Extracted from Stitch export: `stitch_custom_page_layout_design/.../precision_attendance_system/DESIGN.md`

## Spacing Scale (8px Base Grid)

| Token | Value | Usage |
|-------|-------|-------|
| `--spacing-xs` | 4px | Tight gaps, icon padding |
| `--spacing-sm` | 8px | Inner padding, small gaps |
| `--spacing-md` | 16px | Standard card padding, mobile margins |
| `--spacing-lg` | 24px | Section spacing |
| `--spacing-xl` | 32px | Desktop margins, large gaps |
| `--spacing-2xl` | 48px | Page section separators |
| `--spacing-gutter` | 16px | Column gutters |

## Responsive Margins

| Token | Value | Breakpoint |
|-------|-------|------------|
| `--margin-mobile` | 16px | ≤ 480px |
| `--margin-desktop` | 32px | ≥ 769px |

## Rounded Corners

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 0.25rem (4px) | Tags, tooltips, checkboxes |
| `--radius` | 0.5rem (8px) | **Standard** — buttons, cards, inputs |
| `--radius-md` | 0.75rem (12px) | Modals, bottom sheets |
| `--radius-lg` | 1rem (16px) | Large overlays |
| `--radius-xl` | 1.5rem (24px) | Extra-large containers |
| `--radius-full` | 9999px | Pill — status badges, avatars |

## Elevation (Shadows)

| Token | Shadow | Usage |
|-------|--------|-------|
| `--shadow-sm` | Subtle | Buttons, small inputs |
| `--shadow-md` | Standard | **Primary cards**, dropdown menus |
| `--shadow-lg` | Prominent | **Modals**, FABs (e.g., QR scan trigger) |

## Borders

| Token | Value | Color | Usage |
|-------|-------|-------|-------|
| `--border-width` | 1px | `--color-border` | All cards, input fields (always present, even with shadows) |
| `--border-focus` | 2px | `--color-primary` | Active input ring |

## Layout Grid

### Desktop (≥ 769px)

```
┌──────────┬─────────────────────────────────┐
│          │                                 │
│ Sidebar  │       Main Content Area         │
│  260px   │       (flex: 1)                 │
│          │                                 │
│          │                                 │
│          │                                 │
└──────────┴─────────────────────────────────┘
```

- Fixed sidebar: **260px** width
- Main content: flexible, fills remaining width
- Data tables expand to container width

### Mobile (≤ 480px)

```
┌─────────────────────────┐
│       Top Bar           │
├─────────────────────────┤
│                         │
│    Main Content         │
│    (16px margins)       │
│                         │
├─────────────────────────┤
│    Bottom Nav (44px)    │
└─────────────────────────┘
```

- Single column, stacked
- Content: **16px** horizontal margins
- Bottom Nav: fixed, min touch target **44px**
