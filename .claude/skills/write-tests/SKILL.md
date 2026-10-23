---
name: write-tests
description: Write or extend Vitest + Testing Library tests for a component or helper in this repo. Use when asked to add tests, raise coverage, or test a specific file.
---

# Write tests

## Steps

1. Read the target file and `src/components/ui/Button.test.tsx` as the style reference.
2. List the behaviors from the public API: default render, each prop and variant, events, accessibility attributes, edge cases (empty arrays, missing optional props).
3. Write `<file>.test.tsx` next to the target. Query by role and accessible name. Use `vi.fn()` for callbacks. No snapshots.
4. Run `npx vitest run <test file>`. Fix failing tests. If a test exposes a real bug, stop and report it instead of changing the test to pass.

## Report

Behaviors covered, test count, pass or fail.
