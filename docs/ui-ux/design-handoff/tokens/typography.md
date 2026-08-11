# Typography Tokens

> Extracted from Stitch export: `stitch_custom_page_layout_design/.../precision_attendance_system/DESIGN.md`

## Font Families

| Token | Family | Fallback | Usage |
|-------|--------|----------|-------|
| `--font-sans` | Inter | system-ui, sans-serif | All UI text |
| `--font-mono` | JetBrains Mono | monospace | System logs, ID strings |

## Type Scale

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `headline-3xl` | 30px | 700 (Bold) | 36px | High-impact dashboard numbers (e.g., total present) |
| `headline-2xl` | 24px | 700 (Bold) | 32px | Page titles |
| `headline-xl` | 20px | 600 (SemiBold) | 28px | Section headers |
| `headline-lg` | 18px | 600 (SemiBold) | 28px | Card titles, subsection headers |
| `body-base` | 16px | 400 (Regular) | 24px | Default content text |
| `body-sm` | 14px | 400 (Regular) | 20px | Dense data tables, form labels |
| `label-xs` | 12px | 400 (Regular) | 16px | Bottom nav labels, tags, small UI text |
| `mono-code` | 14px | 400 (Regular) | 20px | Code, logs, system IDs |

## CSS Custom Properties

```css
:root {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  --text-headline-3xl: 700 30px/36px var(--font-sans);
  --text-headline-2xl: 700 24px/32px var(--font-sans);
  --text-headline-xl: 600 20px/28px var(--font-sans);
  --text-headline-lg: 600 18px/28px var(--font-sans);
  --text-body-base: 400 16px/24px var(--font-sans);
  --text-body-sm: 400 14px/20px var(--font-sans);
  --text-label-xs: 400 12px/16px var(--font-sans);
  --text-mono-code: 400 14px/20px var(--font-mono);
}
```

## Usage Rules

- **Dashboard hero numbers**: Use `headline-3xl` — e.g., "128" employees present today
- **Page titles**: Use `headline-2xl` — e.g., "Bảng điều khiển"
- **Section headers**: Use `headline-xl` — e.g., "Lịch sử chấm công"
- **Card titles**: Use `headline-lg` — e.g., employee card name
- **Body text**: Use `body-base` for most readable content
- **Dense data**: Use `body-sm` for table cells, form labels, data-heavy views
- **Small UI**: Use `label-xs` for bottom nav labels, badge text, timestamps
- **Monospace**: Use `mono-code` only for QR codes, system logs, unique IDs
