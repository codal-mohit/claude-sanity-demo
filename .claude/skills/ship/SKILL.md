---
name: ship
description: Commit finished work, push the branch and open a GitHub pull request whose body lists every feature line by line with screenshots. Use when the user says ship, open a PR, or commit and push.
---

# Ship

Push and PR creation are visible to others. **Show the commit list and the PR body and wait for a yes before pushing**, unless the user passed `--yes`.

## 1. Preflight
- `git branch --show-current` must not be `main`. If it is, stop and ask for a branch name.
- Run `npm run verify`. Stop on any failure and report it.
- `git status --short` to see what will be committed.

## 2. Commit
- Group changes into one commit per feature (schema, routes, components, config). Stage files explicitly; never `git add -A` blindly over secrets. Never stage `.env*`.
- Message: `<TICKET>: <type>(<scope>): <summary>` where TICKET comes from the branch name (for example `CSD-1`) and type is feat, fix, refactor, test, docs or chore.
- End every message with the attribution line from the current session instructions.
- Never use `--no-verify`, never amend pushed commits, never force push.

## 3. Screenshots
- Use the user's dev server on http://localhost:3000. Never start another one.
- With the Chrome DevTools MCP, capture each route changed in this branch at 1440 px and 390 px wide.
- Save to `.github/pr-assets/<branch>/<route>-<width>.png` and commit them in a separate `chore: add PR screenshots` commit.

## 4. Push and open the PR
- `git push -u origin <branch>`.
- `gh pr create --base main --title "<TICKET>: <summary>" --body-file <file>` with this body:

```markdown
## Summary
<one or two sentences>

## Features
- <one line per user-visible feature>

## Screenshots
| Route | Desktop | Mobile |
|---|---|---|
| /blog | ![](https://github.com/<owner>/<repo>/blob/<sha>/.github/pr-assets/<branch>/blog-1440.png?raw=true) | ![](...blog-390.png?raw=true) |

## Changes
- Schema / routes / config touched

## Test plan
- `npm run verify`: <result>
- Manual checks: <routes checked>

🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

- Use the pushed commit SHA in image URLs; relative image paths do not render in PR bodies.

## 5. Report
Reply with the PR URL and the commit list. If a Jira ticket is in the branch name and the Atlassian MCP is connected, offer to comment the PR link on it.
