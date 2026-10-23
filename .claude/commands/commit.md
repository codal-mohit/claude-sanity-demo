---
description: Verify, then write a Conventional Commit for staged changes
allowed-tools: Bash(git diff:*), Bash(git status:*), Bash(git commit:*), Bash(npm run verify)
---

Staged diff:

!`git diff --cached --stat`

1. Run `npm run verify`. If it fails, stop and report the failures.
2. Write a Conventional Commit message (`feat:`, `fix:`, `docs:`, `chore:`, `test:`, `refactor:`). Subject 72 chars max, imperative. Body only if the why is not obvious.
3. Show me the message and wait for my approval before running `git commit`.
