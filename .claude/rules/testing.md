---
paths:
  - "src/**/*.test.{ts,tsx}"
  - "src/components/**"
---

# Testing

- Vitest + Testing Library. Co-locate tests: `Button.tsx` next to `Button.test.tsx`.
- Query by role and accessible name (`getByRole("button", { name: "Save" })`). Use test IDs only as a last resort.
- Test behavior and public props: rendering, variants, events, accessibility attributes. Don't snapshot.
- Every new component in `src/components/ui/` ships with a test.
- `npm run test` must pass before a task is done.
