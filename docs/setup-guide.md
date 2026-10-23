# Claude Code setup guide

How this demo project is configured, how to use it day to day, and how to copy the setup into a real project.

## 1. Prerequisites

- Node.js 20 or later (tested on 24.12)
- Claude Code CLI or the VS Code extension, signed in

```bash
npm install
npm run verify   # lint, typecheck, brand check, tests
npm run dev      # http://localhost:3000
```

Open the folder in Claude Code. `CLAUDE.md`, the rules, skills, commands, agents and hook load automatically.

## 2. What each piece does

| Piece | Location | Loaded | Use it for |
|---|---|---|---|
| Project instructions | `CLAUDE.md` | Every session | Stack, commands, layout, working style. Keep it short. |
| Rules | `.claude/rules/*.md` | When Claude touches a matching path (`paths:` frontmatter) | Standards that apply to specific files |
| Skills | `.claude/skills/<name>/SKILL.md` | When the task matches the skill's `description` | Multi-step workflows |
| Slash commands | `.claude/commands/*.md` | When you type `/<name>` | Repeatable prompts you trigger yourself |
| Agents | `.claude/agents/*.md` | When Claude delegates, or you ask for one by name | Focused work with limited tools and its own context |
| Hooks | `.claude/settings.json` | On tool events | Checks that must always run |
| Permissions | `.claude/settings.json` | Always | Safe commands run without prompts. Risky ones are denied. |
| MCP servers | `.mcp.json` | On first use, after you approve the server | External tools such as Jira and Confluence |
| Headless / CI | `.github/workflows/claude-review.yml` | On every pull request | Automated review with the same rules and agents |

### Rules

- `coding-standards.md`: TypeScript, exports, Server Components, `cn()`, imports, accessibility.
- `brand-tokens.md`: token table, font usage, what is forbidden.
- `testing.md`: Vitest and Testing Library conventions.

Rules use `paths:` frontmatter, so they only take up context when relevant files are in play.

### Skills

| Skill | Triggers on | Does |
|---|---|---|
| `new-component` | "add a component", "build a badge" | Component + test + export + verify |
| `brand-check` | "check brand", "fix colors" | Runs the linter, swaps raw values for tokens |
| `write-tests` | "add tests for X" | Behavior tests by role, no snapshots |
| `repo-overview` | Start of non-trivial work | Reads `docs/repository-overview.md` instead of scanning |

### Commands

| Command | Does |
|---|---|
| `/verify` | Runs `npm run verify`, lists failures without fixing them |
| `/review [focus]` | Sends the uncommitted diff to the `code-reviewer` agent |
| `/component <Name> <description>` | Runs the `new-component` skill |
| `/commit` | Verifies, drafts a Conventional Commit, waits for approval |

### Agents

| Agent | Model | Tools | Role |
|---|---|---|---|
| `code-analyzer` | Haiku | Read, Grep, Glob | Maps code and impact. Never edits. |
| `implementer` | Sonnet | Read, Grep, Glob, Edit, Write, Bash | Builds scoped changes and runs verify |
| `code-reviewer` | Sonnet | Read, Grep, Glob, Bash | One-line findings by severity. Never edits. |

The analyzer runs on Haiku because it only reads and summarizes. That is the cheapest way to get context into the main session.

### Hooks

| Event | Script | Does |
|---|---|---|
| `PreToolUse` on `Bash\|PowerShell` | `block-risky-commands.mjs` | Blocks recursive force deletes, `git reset --hard`, force push, `git clean -f` and `npm run build` before they run |
| `PostToolUse` on `Edit\|Write\|MultiEdit` | `brand-check-on-edit.mjs` | Checks the edited file under `src/` for off-brand colors and fonts |
| `Stop` | `brand-check-on-stop.mjs` | Runs the brand check on all of `src/` before Claude ends its turn |

Each hook exits with code 2 on a problem, which sends the message back to Claude so it fixes it in the same turn. The `Stop` hook skips when `stop_hook_active` is set, so it never loops.

### MCP servers

`.mcp.json` registers the Atlassian remote MCP server, so Claude can read and update Jira tickets and Confluence pages. Claude Code asks you to approve the server the first time, then you sign in to Atlassian in the browser. Check the endpoint in `.mcp.json` against Atlassian's current docs if the connection fails.

Example: "Read CIT-1334 and list which scope items this repo covers."

### Headless and CI

Claude Code runs without a chat with `claude -p`:

```bash
claude -p "Use the code-reviewer agent to review the uncommitted diff"
```

`.github/workflows/claude-review.yml` does the same on every pull request: it runs `npm run verify`, then `anthropics/claude-code-action` reviews the PR with the `code-reviewer` agent and posts the findings. Add an `ANTHROPIC_API_KEY` repository secret to enable it.

## 3. Typical workflow

1. **Understand:** "Use code-analyzer: what would change to add a pricing section?"
2. **Build:** `/component PricingCard plan name, price, feature list, CTA button`
3. **Check:** `/review`
4. **Ship:** `/commit`

## 4. Keeping token use low

- `CLAUDE.md` is about 30 lines and links out to details instead of including them.
- Rules are path-scoped, so they stay out of context unless needed.
- `docs/repository-overview.md` replaces repo-wide scans.
- The read-only analyzer runs on Haiku and returns `path:line` lists, not file dumps.
- Commands and agents specify short, fixed output formats.
- `settings.json` pre-approves verify commands, which avoids permission round trips.

## 5. Copying this into another project

1. Copy `.claude/`, `CLAUDE.md`, `.mcp.json` and `.github/workflows/claude-review.yml`.
2. Rewrite `CLAUDE.md` commands and layout for that repo.
3. Update `brand-tokens.md` and `scripts/check-brand.mjs` with the client's tokens.
4. Replace the reference component named in the skills (`Button.tsx`) with one from that repo.
5. Regenerate `docs/repository-overview.md` (ask Claude: "update the repository overview").
6. Run the validation task in [validation-results.md](validation-results.md) to confirm everything works.

## 6. Recommendations

- Commit `.claude/settings.json`. Keep `.claude/settings.local.json` personal (it is git-ignored).
- Review rules when the team changes a convention. Stale rules are worse than none.
- Add a skill only after a workflow has been repeated three times or more.
- Keep agents narrow. A reviewer that can edit stops being a reviewer.
- Wire `npm run verify` into CI so humans and Claude use the same gate.
