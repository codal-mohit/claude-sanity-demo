---
paths:
  - "src/**/*.{ts,tsx,css}"
---

# Brand tokens

Tokens are defined once in `src/app/globals.css` and exposed as Tailwind utilities.

| Token | Utility | Light | Dark |
|---|---|---|---|
| Background | `bg-surface` | #F9F9F9 | #0B111F |
| Headline | `text-heading` | #0B111F | #FFFFFF |
| Body | `text-body` | #393C45 | #F9F9F9 |
| Links, accents | `text-accent`, `bg-accent`, `border-accent` | #3416F5 | #D7D5FD |
| Text on accent | `text-accent-contrast` | #FFFFFF | #0B111F |
| Divider | `border-border` | #E3E4E8 | #262C3A |

The first five rows are the core palette, fixed by org brand settings: never change them.

Usage:

- Page background `bg-surface`.
- Primary CTAs: `bg-accent text-accent-contrast` (`<Button>`). Outline CTAs: `border-accent text-accent` (`<Button variant="secondary">`).
- `text-accent` is for links, hover states and focus rings.

Type:

- `font-sans` (Manrope): headlines and body.
- `font-mono` (Manrope): small links, breadcrumbs, tags.

Rules:

- Prefer the brand tokens above for default UI. They are a default, not a limit.
- Other colors are allowed when the task needs them (Tailwind palette colors, arbitrary values, hex in components). Keep them readable in both light and dark themes.
- Headlines use `text-heading`, paragraphs use `text-body`, links use `text-accent`.
- No hook enforces colors. `npm run check:brand` is optional.
