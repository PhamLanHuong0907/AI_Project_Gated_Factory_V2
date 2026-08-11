# Color Tokens

> Extracted from Stitch export: `stitch_custom_page_layout_design/.../precision_attendance_system/DESIGN.md`

## Brand Colors

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--color-primary` | `#2563EB` | `rgb(37, 99, 235)` | Main actions, active nav, interactive elements |
| `--color-primary-dark` | `#1D4ED8` | `rgb(29, 78, 216)` | Hover states, emphasis |
| `--color-primary-light` | `#3B82F6` | `rgb(59, 130, 246)` | Lighter accents |
| `--color-primary-container` | `#DBEAFE` | `rgb(219, 234, 254)` | Primary backgrounds, badges |

## Secondary Colors

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--color-secondary` | `#475569` | `rgb(71, 85, 105)` | Supporting info, secondary actions |
| `--color-secondary-container` | `#E2E8F0` | `rgb(226, 232, 240)` | Secondary backgrounds |

## Semantic Colors

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--color-success` | `#16A34A` | `rgb(22, 163, 74)` | On Time status, success feedback |
| `--color-success-light` | `#DCFCE7` | `rgb(220, 252, 231)` | Success badges, toast bg |
| `--color-warning` | `#D97706` | `rgb(217, 119, 6)` | Late status, warning feedback |
| `--color-warning-light` | `#FEF3C7` | `rgb(254, 243, 199)` | Warning badges, toast bg |
| `--color-error` | `#DC2626` | `rgb(220, 38, 38)` | Error status, destructive actions |
| `--color-error-light` | `#FEE2E2` | `rgb(254, 226, 226)` | Error badges, toast bg |

## Neutral Colors

| Token | Hex | RGB | Usage |
|-------|-----|-----|-------|
| `--color-text-primary` | `#0F172A` | `rgb(15, 23, 42)` | Primary text (high readability) |
| `--color-text-secondary` | `#475569` | `rgb(71, 85, 105)` | Secondary text, labels |
| `--color-text-muted` | `#94A3B8` | `rgb(148, 163, 184)` | Muted text, placeholders |
| `--color-background` | `#FFFFFF` | — | Default page background |
| `--color-surface` | `#F8FAFC` | `rgb(248, 250, 252)` | Card backgrounds, secondary containers |
| `--color-border` | `#E2E8F0` | `rgb(226, 232, 240)` | Card borders, input borders, dividers |

## Dark Mode

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-background-dark` | `#0F172A` | Dark page background |
| `--color-surface-dark` | `#1E293B` | Dark card/surface background |
| `--color-text-dark` | `#F1F5F9` | High-contrast off-white text |

## CSS Custom Properties

```css
:root {
  --color-primary: #2563EB;
  --color-primary-dark: #1D4ED8;
  --color-primary-light: #3B82F6;
  --color-primary-container: #DBEAFE;
  --color-secondary: #475569;
  --color-secondary-container: #E2E8F0;
  --color-success: #16A34A;
  --color-success-light: #DCFCE7;
  --color-warning: #D97706;
  --color-warning-light: #FEF3C7;
  --color-error: #DC2626;
  --color-error-light: #FEE2E2;
  --color-text-primary: #0F172A;
  --color-text-secondary: #475569;
  --color-text-muted: #94A3B8;
  --color-background: #FFFFFF;
  --color-surface: #F8FAFC;
  --color-border: #E2E8F0;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-background: #0F172A;
    --color-surface: #1E293B;
    --color-text-primary: #F1F5F9;
    --color-text-secondary: #CBD5E1;
    --color-text-muted: #64748B;
    --color-border: #334155;
  }
}
```
