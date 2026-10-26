---
description: Review the current branch diff against the project rules, using the reviewer subagent.
---

Use the `reviewer` subagent to review `git diff main...HEAD` plus uncommitted changes against `.claude/rules/` and `CLAUDE.md`.

Report findings most severe first as `path:line: problem. fix.` If nothing is wrong, say so in one line. Do not edit files.

$ARGUMENTS
