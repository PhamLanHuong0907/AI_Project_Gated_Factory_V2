---
name: Precision Attendance System
colors:
  surface: '#F8FAFC'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#DC2626'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
  success: '#16A34A'
  warning: '#D97706'
  border: '#E2E8F0'
  success-light: '#DCFCE7'
  warning-light: '#FEF3C7'
  error-light: '#FEE2E2'
  primary-light: '#DBEAFE'
typography:
  headline-3xl:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
  headline-2xl:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-xl:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-xs:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  mono-code:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is engineered for a **Corporate / Modern** aesthetic, prioritizing efficiency, reliability, and professional trust. As a QR and GPS-based attendance system, the UI must feel high-tech yet grounded and utilitarian. 

The primary target audience consists of HR administrators (desktop users) requiring data density and clarity, and employees (mobile users) who need high-speed, "one-tap" interactions for clocking in/out. 

The visual language utilizes clean lines, a structured grid, and a neutral palette punctuated by high-contrast semantic colors to provide immediate feedback on system status (success, late, or error).

## Colors

The palette is anchored by a deep **Primary Blue (#2563EB)**, symbolizing stability and corporate professionalism. 

- **Primary:** Used for main actions, active navigation states, and key interactive elements.
- **Secondary:** A cool slate used for supporting information and secondary actions.
- **Semantic Colors:** Green (Success), Amber (Warning), and Red (Error) are used strictly for attendance status and system alerts. Each has a corresponding "light" tint for background badges or toast containers.
- **Neutral:** A dark navy-slate is used for primary text to ensure high readability, while lighter slates define the surface architecture and borders.

**Dark Mode Support:** When the system detects a dark preference, the background shifts to `#0F172A` and surfaces to `#1E293B`, with text transitioning to high-contrast off-whites.

## Typography

This design system uses **Inter** for all UI elements to ensure maximum legibility across various screen resolutions. It is a highly functional, humanist sans-serif that excels in data-rich environments.

- **Scale:** Use `headline-3xl` exclusively for high-impact dashboard numbers (e.g., total employees present).
- **Hierarchy:** Page titles use `headline-2xl`. Section headers use `headline-xl`.
- **Readability:** The `body-base` (16px) is the default for most content. `body-sm` (14px) is reserved for dense data tables and form labels.
- **Monospace:** Use JetBrains Mono for system logs or specific ID strings where character distinction is critical.

## Layout & Spacing

The system employs a **Fluid Grid** model for desktop and a **Single Column** stacked model for mobile.

- **Desktop (≥769px):** A fixed 260px sidebar for navigation with a flexible main content area. Data tables and reports should expand to fill the container width.
- **Mobile (≤480px):** Content uses a standard 16px margin on both sides. Navigation moves to a fixed Bottom Nav bar with a minimum touch target of 44px for each item.
- **Spacing Rhythm:** Based on an 8px incremental scale. Use `md` (16px) for standard padding within cards and `lg` (24px) for spacing between major sections.

## Elevation & Depth

Visual hierarchy is managed through **Tonal Layers** combined with **Ambient Shadows**.

- **Background:** The default page background is `#FFFFFF`.
- **Surfaces:** Use `#F8FAFC` for secondary containers or card backgrounds to differentiate them from the base.
- **Shadows:** 
    - `sm`: Used for subtle separation of buttons and small input fields.
    - `md`: The standard for primary cards and dropdown menus.
    - `lg`: Reserved for modals and floating action buttons (FABs) like the QR scan trigger.
- **Borders:** Use a 1px border (`#E2E8F0`) for all cards and input fields even when shadows are present to maintain a crisp, professional structure.

## Shapes

The design system uses a **Rounded** shape language to soften the corporate aesthetic and make the interface more approachable.

- **Standard (8px):** Applied to most primary elements including buttons, cards, and input containers.
- **Small (4px):** Applied to small utility elements like tags, tooltips, and checkboxes.
- **Large (12px):** Reserved for large overlays such as modals or bottom sheets on mobile.
- **Pill (Full):** Used exclusively for status badges (e.g., "On Time") and user avatars.

## Components

- **Buttons:** Primary buttons use a solid blue background with white text. Secondary buttons use a ghost style with a slate border. Every button must maintain a minimum height of 44px on mobile for accessibility.
- **Input Fields:** Use 8px rounding, a 1px border, and a 16px internal horizontal padding. Active states must feature a 2px blue ring.
- **Attendance Badges:** Pill-shaped with a "light" background color corresponding to the status (e.g., Success-Light background with Success-Green text).
- **Cards:** White background with a `md` shadow and 1px border. On mobile, cards should be full-width with 16px horizontal margins.
- **QR Viewfinder:** A specialized component for mobile scanning. Use a semi-transparent dark overlay with a clear "cut-out" square in the center, accented by primary blue corners to guide the user.
- **Bottom Navigation:** Fixed to the bottom on mobile. Icons should be centered with 12px labels underneath using the `label-xs` typography.