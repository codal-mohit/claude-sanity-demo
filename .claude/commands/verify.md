---
description: Run lint, typecheck and tests, then summarize failures with file and line.
allowed-tools: Bash(npm run verify:*), Bash(npm run typegen:*)
---

Run `npm run verify`.

- If it passes, reply with one line: the number of test files and tests that passed.
- If it fails, list each failure as `path:line: problem`, grouped by lint, typecheck and tests, and propose the smallest fix for each. Do not edit files unless the user asks.
- If the failure is a missing or stale Sanity type, run `npm run typegen` once and re-run verify.

$ARGUMENTS
