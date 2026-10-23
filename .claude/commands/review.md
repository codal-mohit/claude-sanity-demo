---
description: Review uncommitted changes against project rules using the code-reviewer agent
argument-hint: "[optional path or focus]"
allowed-tools: Bash(git diff:*), Bash(git status:*)
---

Changed files:

!`git status --short`

Use the `code-reviewer` agent to review the current uncommitted diff (`git diff HEAD`). Focus: $ARGUMENTS

Pass the agent the diff and tell it to check against `.claude/rules/`. Relay its findings unchanged.
