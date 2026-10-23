---
description: Run lint, typecheck, brand check and tests, then summarize failures
allowed-tools: Bash(npm run verify), Bash(npm run lint), Bash(npm run typecheck), Bash(npm run check:brand), Bash(npm run test)
---

Run `npm run verify`.

If it passes, reply with one line: `verify passed`.

If it fails, list each failure as `step | path:line | message`, grouped by step. Do not fix anything unless I ask.
