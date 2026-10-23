# Coding standards

- TypeScript strict. No `any`; use `unknown` and narrow.
- Server components by default. Add `"use client"` only for state, effects or browser APIs.
- Import with `@/` aliases, not deep relative paths.
- Components: one folder per component, `index.tsx` exports it, props typed with `React.ComponentPropsWithoutRef`. Use `cn` from `@/utils` for class merging.
- Variants use `class-variance-authority`, matching `src/app/ui/Button/index.tsx`.
- Keep copy and lists out of components when they come from Sanity.
- No dead code, no commented-out code, no console logs.
