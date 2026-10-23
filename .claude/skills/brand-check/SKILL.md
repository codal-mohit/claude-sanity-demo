---
name: brand-check
description: Audit and fix brand-token compliance (colors, fonts, light and dark themes) in this repo. Use when asked to check brand, design tokens, colors, fonts or theming, or after a design-related change.
---

# Brand check

## Steps

1. Run `npm run check:brand` (optionally with paths, for example `node scripts/check-brand.mjs src/components`).
2. For each violation, replace the raw value with the matching token from `.claude/rules/brand-tokens.md`:
   - Dark text on headings: `text-heading`. Paragraph text: `text-body`. Links and highlights: `text-accent`.
   - Backgrounds: `bg-surface`.
   - Filled CTAs: `bg-accent text-accent-contrast`. Outline CTAs: `border-accent text-accent`.
   - Borders and dividers: `border-border`.
3. Never edit the five core tokens (surface, heading, body, accent, accent-contrast). If no token fits, add one to `src/app/globals.css` in all three places (`:root`, the dark media query, `[data-theme="dark"]`) and to `@theme inline`. Then update the table in `.claude/rules/brand-tokens.md`.
4. Check font usage the script can't catch: headlines and body use `font-sans`; breadcrumbs, tags and small links use `font-mono`.
5. Re-run `npm run check:brand` until it passes.

## Report

One line per fix: `path:line old -> new`. Then the final check result.
