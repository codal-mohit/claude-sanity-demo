---
name: new-component
description: Create a new shared UI component in src/components/ui with brand tokens, typed props, a co-located test and a barrel export. Use when asked to add, build or scaffold a component, card, badge, banner, or any reusable UI piece.
---

# New component

Builds a component that matches the existing ones in `src/components/ui/`.

## Steps

1. Read `src/components/ui/Button.tsx` and one other component closest to the request (`Card.tsx` for content tiles, `Alert.tsx` for messages). Match their structure.
2. Create `src/components/ui/<Name>.tsx`:
   - Export `type <Name>Props` above the component. Extend the native element's attributes if it wraps one.
   - Named export `function <Name>`.
   - Classes through `cn()` from `@/lib/cn`, with `className` merged last.
   - Only brand utilities: `bg-surface`, `text-heading`, `text-body`, `text-accent`, `bg-accent`, `border-accent`, `text-accent-contrast`, `border-border`, `font-sans`, `font-mono`. Follow the usage list in `.claude/rules/brand-tokens.md`.
   - No `"use client"` unless it needs state, effects or browser APIs.
3. Create `src/components/ui/<Name>.test.tsx` following `.claude/rules/testing.md`. Cover default render, each variant or optional prop, and any event.
4. Add `export * from "./<Name>";` to `src/components/ui/index.ts`, keeping alphabetical order.
5. Run `npm run verify`. Fix every failure before reporting.

## Report

List the files created, the props, and the verify result. Nothing else.
