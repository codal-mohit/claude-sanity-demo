# Claude Code in this repo

How each Claude Code feature is set up here, where it lives, and how to use it.

## Project memory and rules

| What | Where | How it is used |
| ---- | ----- | -------------- |
| Project instructions | `CLAUDE.md` | Loaded at the start of every session: commands, layout, working style. |
| Detailed rules | `.claude/rules/*.md` | Linked from `CLAUDE.md`: code, testing and Sanity conventions. |
| Shared permissions | `.claude/settings.json` | Allows `npm run *`, read-only git; denies `.env` reads, force push, `rm -rf`, dataset delete. |
| Personal settings | `.claude/settings.local.json` | Your own overrides, not shared. |

## Skills (`.claude/skills/`)

Claude loads a skill automatically when the request matches its description, or you call it by name.

| Skill | Use it for |
| ----- | ---------- |
| `new-sanity-type` | A new document, object or page builder block, wired through schema, Studio, queries, typegen and tests. |
| `new-feature` | A new localized page or component on the public site. |
| `seed-content` | Changing sample content in `tools/seed.mjs` and running it safely. |
| `ship` | Commit, push and open a PR with a feature list and screenshots. Asks before pushing. |

## Slash commands (`.claude/commands/`)

| Command | What it does |
| ------- | ------------ |
| `/verify` | Runs `npm run verify` and summarizes failures as `path:line`. |
| `/review` | Reviews the branch diff with the `reviewer` subagent. |
| `/ship` | Provided by the `ship` skill. |

## Subagents (`.claude/agents/`)

| Agent | Tools | Role |
| ----- | ----- | ---- |
| `reviewer` | Read-only plus git diff | Checks a diff against the rules. Used by `/review` and CI. |
| `content-modeler` | Read-only | Proposes schema and GROQ before code is written. |
| `implementer` | Edit plus verify | Makes one agreed change and proves it with `npm run verify`. |

A typical schema change: `content-modeler` proposes, you agree, `implementer` builds it, `reviewer` checks it.

## Hooks (`.claude/hooks/`, wired in `.claude/settings.json`)

| Hook | Event | Effect |
| ---- | ----- | ------ |
| `guard-bash.mjs` | Before every Bash command | Blocks recursive force delete, force push, `reset --hard`, `--no-verify`, destructive dataset commands, `--allow-production` seeding, staging `.env` files, and `npm run build` while the dev server runs. |
| `typegen-reminder.mjs` | After Edit or Write | When a schema or query file changes, tells Claude to run `npm run typegen`. |

Hooks are code, so they apply every time; rules in `CLAUDE.md` are guidance. Use both.

## MCP servers (`.mcp.json`)

| Server | Use it for | Setup |
| ------ | ---------- | ----- |
| `sanity` | Query and edit content, deploy schema, from chat. | Run `/mcp` and sign in to Sanity. |
| `chrome-devtools` | Screenshots, console and network checks, Lighthouse audits on the dev server. | Needs Chrome installed. |
| `atlassian` | Read the Jira ticket from the branch name, comment the PR link. | Run `/mcp` and sign in to Atlassian. |

## CI (`.github/workflows/`)

| Workflow | What it does | Setup |
| -------- | ------------ | ----- |
| `ci.yml` | `npm run verify` and a check that generated Sanity types are committed. | Repository variable `NEXT_PUBLIC_SANITY_PROJECT_ID`. |
| `claude-review.yml` | Claude reviews each PR with the `reviewer` agent and posts one comment. | Repository secret `ANTHROPIC_API_KEY`. |

`.github/pull_request_template.md` is the PR body that `/ship` fills in.

## More features worth trying

- **Plan mode** (Shift+Tab twice): agree on a plan before any file changes. Good for schema changes.
- **Worktrees**: ask Claude to try two designs in separate git worktrees, then compare.
- **Scheduled routines** (`/schedule`): for example a weekly run of `npm outdated` and a Lighthouse audit, reported as a PR comment.
- **Plugins**: the `.claude/` folder (skills, commands, agents, hooks) can be packaged as one plugin with a `.claude-plugin/plugin.json` manifest, so other Next.js + Sanity repos can install the same setup.
- **Context habits**: `/clear` between unrelated tasks, `/compact` in long sessions, `@path/to/file` to point at files directly.
