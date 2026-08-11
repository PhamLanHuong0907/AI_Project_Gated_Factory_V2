# DESIGN_HANDOFF — Precision Attendance System (PAS)

> **Gate Status**: `DESIGN_HANDOFF_READY` (partial — no pixel parity claim)
> **Date**: 2026-08-10
> **Stitch Project ID**: `16050414329059102261`

## 1. What This Handoff Contains

This document provides the design system foundation for implementing the Precision Attendance System UI. All tokens, components, and layout rules are extracted from the Stitch export and screenshots.

### Token Files

| File | Contents |
|------|----------|
| [tokens/colors.md](tokens/colors.md) | Full color palette — brand, semantic, neutral, dark mode |
| [tokens/typography.md](tokens/typography.md) | Inter + JetBrains Mono type scale (8 levels) |
| [tokens/spacing.md](tokens/spacing.md) | 8px grid, responsive margins, rounded corners, elevation |
| [tokens/components.md](tokens/components.md) | Button, input, badge, card, modal, table, toast specs |

### Structural Files

| File | Contents |
|------|----------|
| [app-shell.md](app-shell.md) | Desktop sidebar + mobile bottom nav layout |
| [screen-verification.md](screen-verification.md) | 16/16 screens verified from Stitch export |
| [assets/README.md](assets/README.md) | Asset locations, missing assets, replacement strategy |

## 2. Design Language Summary

- **Style**: Corporate / Modern — clean lines, structured grid, high-contrast semantics
- **Primary Color**: `#2563EB` (Deep Blue — stability, professionalism)
- **Font**: Inter (all UI), JetBrains Mono (logs/IDs)
- **Grid**: 8px base, responsive (sidebar desktop, bottom nav mobile)
- **Elevation**: Tonal layers + ambient shadows (sm/md/lg)
- **Shape**: Rounded (8px standard, pill for badges)

## 3. Implementation Priority

Based on the Stitch export and screen specs:

| Priority | Screens | Reason |
|----------|---------|--------|
| P0 — Core Flow | SCR-01, SCR-03, SCR-04, SCR-05 | Login → QR Create → QR Scan → History |
| P1 — Dashboard | SCR-02 | Admin overview with live stats |
| P2 — Management | SCR-06, SCR-07, SCR-08, SCR-09 | Shifts, Salary, HR |
| P3 — Settings | SCR-10 | System configuration |
| P4 — Leave (New) | SCR-11, SCR-12 | Post-Stitch feature, spec-only |

## 4. Limitations & Known Gaps

### What We Have ✅

- Complete color palette with dark mode
- Full typography scale (Inter + JetBrains Mono)
- Spacing and layout tokens (8px grid)
- Component specs (buttons, inputs, badges, cards, modals, tables)
- App shell layout (desktop sidebar + mobile bottom nav)
- 16 screenshots from Stitch export
- 12 screen specs with acceptance criteria
- 13 stitch prompts for AI-assisted implementation

### What We Don't Have ❌

| Gap | Impact | Mitigation |
|-----|--------|------------|
| **Pixel parity** | Cannot guarantee exact pixel match | Tokens + screenshots as reference |
| **SVG icons** | No icon asset files | Use Phosphor Icons (outlined style) |
| **Illustrations** | No vector illustrations | Emoji-based placeholders |
| **Logo** | No logo asset | Text-based "PAS" branding |
| **Interactive prototype** | Stitch SPA not accessible via MCP | Local `index.html` serves as reference |
| **Animation specs** | No motion/transition definitions | Standard Material Design transitions |
| **Responsive testing** | No tablet breakpoint defined | Infer from mobile/desktop gap |

### Why No Pixel Parity Claim

1. **No Stitch MCP tool** — Stitch is a SPA at stitch.withgoogle.com; no API access exists
2. **Screenshots only** — Visual reference, not extractable code/tokens
3. **DESIGN.md tokens** — Extracted from markdown, not verified against live Stitch
4. **Missing assets** — No SVG icons, illustrations, or logo files exported

> **Recommendation**: Use this handoff as the design foundation. For pixel-perfect implementation,
> manually compare screenshots during development and adjust as needed.

## 5. Verification Checklist

- [x] Stitch project fetched by ID (`16050414329059102261`)
- [x] All 16 Stitch folders mapped to 12 SCR IDs
- [x] All screenshots verified (16/16 found)
- [x] Design tokens extracted (colors, typography, spacing, components)
- [x] App shell documented (desktop + mobile layouts)
- [x] Screen specs exist for all 12 screens
- [x] Navigation architecture documented
- [x] Permission matrix documented
- [x] Screen-to-API matrix complete (59/59 endpoints)
- [x] Limitations documented
- [ ] Pixel parity verification — BLOCKED (no Stitch MCP access)
- [ ] Icon assets — REQUIRES manual export or replacement
- [ ] Illustration assets — REQUIRES manual export or replacement

## 6. Gate Decision

```
DESIGN_HANDOFF_READY
├── Tokens: ✅ Complete
├── App Shell: ✅ Complete
├── Components: ✅ Specified
├── Screens: ✅ 16/16 verified
├── Limitations: ✅ Documented
└── Pixel Parity: ⚠️ Not claimed (no Stitch MCP)
```

**Status**: `DESIGN_HANDOFF_READY` — Ready for implementation to begin.
**Next Gate**: `IMPL_GATE` — Frontend implementation with token compliance.
