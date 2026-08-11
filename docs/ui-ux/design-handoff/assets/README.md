# Asset Map

## Source Locations

All design assets are exported from Google Stitch:

```
stitch_custom_page_layout_design/
└── stitch_custom_page_layout_design/
    └── precision_attendance_system/
        ├── DESIGN.md              ← Design tokens + brand guidelines
        ├── index.html             ← Interactive component showcase
        ├── index-export.html      ← Static export
        └── screenshots/
            ├── login-screen.png
            ├── screenshot-2026-03-25-at-45343-pm.png   (Dashboard 1)
            ├── screenshot-2026-03-25-at-45349-pm.png   (Dashboard 2)
            ├── screenshot-2026-03-25-at-45421-pm.png   (Create QR)
            ├── screenshot-2026-03-25-at-45458-pm.png   (Scan QR 1)
            ├── screenshot-2026-03-25-at-45504-pm.png   (Scan QR 2)
            ├── screenshot-2026-03-25-at-45544-pm.png   (History - Total)
            ├── screenshot-2026-03-25-at-45554-pm.png   (History - Personal)
            ├── screenshot-2026-03-25-at-46020-pm.png   (Shift Management)
            ├── screenshot-2026-03-25-at-46100-pm.png   (Salary Config)
            ├── screenshot-2026-03-25-at-46136-pm.png   (Salary Report)
            ├── screenshot-2026-03-25-at-46217-pm.png   (Personal Slip)
            ├── screenshot-2026-03-25-at-46253-pm.png   (HR Management)
            ├── screenshot-2026-03-25-at-46291-pm.png   (Settings)
            ├── screenshot-2026-03-25-at-46343-pm.png   (Leave Request)
            └── screenshot-2026-03-25-at-46357-pm.png   (Leave Approve)
```

## Asset Types

| Type | Location | Notes |
|------|----------|-------|
| Screenshots | `stitch/.../screenshots/` | PNG, visual reference only |
| HTML Showcase | `stitch/.../index.html` | Interactive, local server needed |
| Static Export | `stitch/.../index-export.html` | Standalone HTML |
| Design Tokens | `stitch/.../DESIGN.md` | YAML frontmatter + markdown |
| Screen Specs | `docs/ui-ux/modules/*/screen-spec-*.md` | 12 screens |
| Stitch Prompts | `docs/ui-ux/stitch-prompts/screens/SCR-*.md` | 13 prompts |

## Missing Assets

| Asset | Status | Impact |
|-------|--------|--------|
| SVG Icons | ❌ Not exported | Use Phosphor Icons (outlined) as replacement |
| Illustrations | ❌ Not exported | Use emoji-based placeholders |
| Logo | ❌ Not exported | Use text "PAS" (Precision Attendance System) |
| Favicon | ❌ Not exported | Use ⏰ emoji |
| Fonts | 🔗 Google Fonts | Inter + JetBrains Mono via CDN |
