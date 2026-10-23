# Validation results

Run date: 2026-10-16. Environment: Windows 11, Node 24.12.0, Next.js 15.5.4.

## Sample task

> Add an `Alert` component with `info` and `emphasis` tones, a title and optional body.

Followed the `new-component` skill:

| Step | Result |
|---|---|
| Read reference components | Matched the `Button` pattern: variant map, `cn()`, extended native attributes |
| Path rules loaded on edit | `coding-standards`, `brand-tokens` and `testing` loaded automatically when `src/` files were touched |
| Created `src/components/ui/Alert.tsx` | Brand utilities only, `role="status"`, Server Component |
| Created `src/components/ui/Alert.test.tsx` | 3 tests: default tone, emphasis tone, body content |
| Updated barrel `index.ts` | Alphabetical |
| `npm run verify` | Passed |

## Demo page and config audit (2026-10-20)

> Build a proper demo page, remove the company name, and confirm rules, skills, commands, agents and the hook work.

| Step | Result |
|---|---|
| Demo page | Header nav, hero, "How it works" steps, 5 feature cards, live `Alert` sample with verify results, footer. Existing components and brand tokens only |
| Company name | Removed from page, metadata, CSS comment, `CLAUDE.md`, `README.md`, rules, skills and docs |
| Out-of-scope files | Removed other-tool rule files (`.clinerules`, `.cursor`, `.windsurf`, `.opencode`, `.github`, `AGENTS.md`) and `pnpm-lock.yaml` |
| Docs, rules, skills | Aligned with the code: removed references to components, folders and tokens that do not exist |
| Brand script | Gap found: `font-serif` was not caught. Added an `off-brand font utility` rule |
| Tests | Gap found: `Card`, `Tag`, `Breadcrumb` had no tests, against `testing.md`. Added 8 tests |
| Config files | `settings.json` parses; all agents, skills and commands have valid frontmatter and reference existing files |

## Capability additions (2026-10-20)

| Addition | Validation |
|---|---|
| `PreToolUse` hook `block-risky-commands.mjs` | 10 payloads: recursive force delete (3 forms plus PowerShell), hard reset, force push, `npm run build` blocked with exit 2; plain `rm`, `npm run verify`, `git status` allowed. Also blocked a live test command in this session |
| `Stop` hook `brand-check-on-stop.mjs` | Clean tree exits 0; `stop_hook_active` payload exits 0 (no loop) |
| `.mcp.json` (Atlassian) | JSON valid. Jira ticket read through the Atlassian MCP in this session |
| `.github/workflows/claude-review.yml` | Written; not run (needs a GitHub remote and `ANTHROPIC_API_KEY`) |

## Agent runs (2026-10-20)

| Agent | Task | Result |
|---|---|---|
| `code-analyzer` | Impact of adding a `ghost` Button variant | Read-only. Returned file:line findings, impact and rule risks. No edits |
| `implementer` | Add tests for `src/lib/cn.ts` | Created `cn.test.ts` (7 tests), ran `npm run verify`: pass. No other files touched |
| `code-reviewer` (the `/review` flow) | Review all uncommitted changes | 23 one-line findings by severity. Fixed: fork-PR secret exposure in the workflow (high), verify blocking review, unrestricted CI tools, `rm` split-flag and PowerShell gaps in the hook, stale Hooks card, hard-coded "passed" labels. Left as backlog: section and data split for `page.tsx`, a `ButtonLink` component, stricter role-based test queries, `Card` heading level |

## Gate results (2026-10-20)

| Check | Result |
|---|---|
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npm run check:brand` | Pass, 16 files |
| `npm run test` | Pass, 6 files, 21 tests |

## Gate results (initial setup)

| Check | Result |
|---|---|
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npm run check:brand` | Pass, 12 files |
| `npm run test` | Pass, 2 files, 6 tests |
| `npm run build` | Pass, `/` prerendered static |

## Hook test

Hook payloads were piped into `.claude/hooks/brand-check-on-edit.mjs`:

| Input | Expected | Actual |
|---|---|---|
| `src/` file containing `text-gray-700` | exit 2 with message | exit 2, `default Tailwind palette color: text-gray-700` |
| Clean `Button.tsx` | exit 0 | exit 0 |
| `README.md` (outside scope) | exit 0, skipped | exit 0 |
| `src/` file with hex, rgb, arbitrary and palette colors (2026-10-20) | exit 2, every violation listed | exit 2, 4 violations |
| Same payload with a UTF-8 BOM | exit 2 | exit 2 |
| Invalid JSON | exit 0 | exit 0 |

## Issue found and fixed

The first hook version parsed stdin with `JSON.parse` directly. Input piped from PowerShell starts with a UTF-8 BOM, so parsing failed and the hook passed every file silently. The fix strips a leading BOM and resolves the project directory from the hook's own path, so it works from any working directory.

## Not yet validated

- `/commit`: creates a real commit, so it waits for the author to run it.
- The GitHub workflow: needs a remote repository and the API key secret.
