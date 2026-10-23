---
paths:
  - "src/**/*.{ts,tsx}"
---

# Coding standards

- TypeScript strict. No `any`; use `unknown` and narrow.
- Named exports only. One component per file, file name in PascalCase matching the component.
- Props type is `<Name>Props`, exported, declared above the component. Extend the native element's attributes when the component wraps one (see `Button.tsx`).
- Server Components by default. Add `"use client"` only when the file uses state, effects or browser APIs.
- Compose class names with `cn()` from `@/lib/cn`. No template-string class concatenation for conditional classes.
- Import with the `@/` alias, never `../../`.
- Accessibility: semantic elements first, visible focus styles, `aria-*` only when semantics are not enough.
- Comments explain why, not what. Short JSDoc on exported components when the purpose is not obvious.
