# Testing

- Vitest with Testing Library and jsdom. Globals are on; still import `describe`, `it`, `expect` from `vitest` for typecheck.
- Colocate tests: `Name/Name.test.tsx` beside `Name/index.tsx`.
- Query by role or label, not by class or test id, unless there is no accessible handle.
- Every new component and every new GROQ query mapper gets a test.
- No network in tests. Use fixtures in `src/test/fixtures/` and `vi.mock` for clients.
- Run `npm run verify` before calling work done.
