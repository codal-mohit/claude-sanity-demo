# Repository overview

Source of truth for project context. The `repo-overview` skill and the `code-analyzer` agent read this file instead of scanning the tree, which keeps token use low. Update it when the structure changes.

## Stack

| Area | Choice |
|---|---|
| Framework | Next.js 15, App Router, static rendering by default |
| UI | React 19, Server Components by default |
| Language | TypeScript, strict mode, `@/*` maps to `src/*` |
| Styling | Tailwind CSS v4, tokens declared with `@theme inline` in `globals.css` |
| Fonts | DM Sans (`font-sans`), DM Mono (`font-mono`) via `next/font/google` |
| Tests | Vitest, jsdom, Testing Library |
| Lint | ESLint 9 with `eslint-config-next` |

## Layout

```
src/
  app/
    globals.css        brand tokens (the only file with color values)
    layout.tsx         root layout, loads fonts
    page.tsx           demo landing page (breadcrumb, intro, feature cards)
  components/ui/       shared components + co-located tests, barrel index.ts
  lib/cn.ts            class-name joiner
scripts/check-brand.mjs  brand-token linter
docs/                    this overview, setup guide, validation results
.claude/                 Claude Code config (see below)
CLAUDE.md                project instructions loaded every session
```

## Components

| Component | Purpose | Notes |
|---|---|---|
| `Button` | Action button | `primary` / `secondary` variants, extends button attributes |
| `Card` | Content tile | optional `tag` and `footer` |
| `Tag` | Small label | DM Mono, uppercase |
| `Breadcrumb` | Navigation trail | DM Mono, last item is `aria-current="page"` |
| `Alert` | Inline message | `info` / `emphasis` tones, `role="status"` |

## Home page

`page.tsx` renders a header with anchor nav, a hero, a three-step "How it works" list, five `Card`s for the configured rules, skills, commands, agents and hooks, a live `Alert` sample with verify results, and a footer.

## Color tokens

Core (fixed by org brand settings): `surface`, `heading`, `body`, `accent`, `accent-contrast`, plus `border` for dividers. Full table in `.claude/rules/brand-tokens.md`.

## Conventions

- Named exports, one component per file, `<Name>Props` exported above the component.
- Classes through `cn()`, `className` merged last.
- Colors only through token utilities. Dark mode follows `prefers-color-scheme`, or `data-theme` on `<html>` to force a theme.
- Every UI component has a co-located test.

## Claude Code config

```
.claude/
  settings.json        shared permissions + PostToolUse brand hook
  settings.local.json  personal overrides (git-ignored)
  rules/               path-scoped rules: coding-standards, brand-tokens, testing
  skills/              new-component, brand-check, write-tests, repo-overview
  commands/            /verify, /review, /component, /commit
  agents/              code-analyzer, implementer, code-reviewer
  hooks/               block-risky-commands.mjs, brand-check-on-edit.mjs, brand-check-on-stop.mjs
.mcp.json              Atlassian MCP server (Jira, Confluence)
.github/workflows/     claude-review.yml: headless Claude review on pull requests
```
