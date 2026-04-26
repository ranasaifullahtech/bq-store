# Design Tokens

Extracted from Figma design handoff.

## Colors

| Token | Hex | Use |
|-------|-----|-----|
| surface | #FAFAFA | Page background |
| surface-raised | #FFFFFF | Cards, modals |
| text-primary | #111827 | Headings, body |
| text-muted | #6B7280 | Labels, hints |
| border | #E5E7EB | Dividers, input borders |
| primary | #111111 | Primary button background, links |
| primary-hover | #000000 | Primary button hover |
| danger | #DC2626 | Destructive actions, errors |
| danger-soft | #FEE2E2 | Destructive backgrounds |
| success | #16A34A | Confirmation toasts |
| success-soft | #DCFCE7 | Success backgrounds |

## Typography

Font family: Inter, system-ui, -apple-system, sans-serif.

| Token | Size / Line-height | Weight | Use |
|-------|------------------|-------|-----|
| display | 2.5rem / 3rem | 600 | Login page title |
| h1 | 1.75rem / 2.25rem | 600 | Section headers |
| h2 | 1.25rem / 1.75rem | 600 | Card titles |
| body | 0.875rem / 1.25rem | 400 | Body text, labels |
| small | 0.75rem / 1rem | 400 | Captions, hints |
| button | 0.875rem / 1.25rem | 500 | Button labels |

## Spacing (multiples of 4)

| Token | Value | Use |
|-------|------|-----|
| 1 | 4px | Icon-to-text gap |
| 2 | 8px | Form field inner spacing |
| 3 | 12px | Stack of small elements |
| 4 | 16px | Card padding, section gaps |
| 6 | 24px | Section spacing |
| 8 | 32px | Major section break |
| 12 | 48px | Page-level top/bottom |

## Radius

| Token | Value | Use |
|-------|------|-----|
| sm | 6px | Inputs, small buttons |
| md | 10px | Cards, modals |
| lg | 16px | Primary hero elements |
| full | 9999px | Avatars, pill badges |

## Components

- **Button primary** — black bg, white text, 10px radius, 12×20px padding
- **Button secondary** — white bg, border, 10px radius
- **Button destructive** — danger color text, no bg, underline on hover
- **Input** — 14px text, 6px radius, 1px border, focus ring 2px
- **Product card** — image top, title + price below, 16px padding, 10px radius
- **Category row** — table row with name, slug, product count, actions
- **Modal** — 560px max-width, 24px padding, close button top-right
- **Toast** — bottom-right, auto-dismiss 3s, color by status

## Breakpoints

| Breakpoint | Width |
|-----------|-------|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| 2xl | 1536px |