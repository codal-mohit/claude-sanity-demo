# Repository overview

Source of truth for project context. The `repo-overview` skill and the `code-analyzer` agent read this file instead of scanning the tree, which keeps token use low. Update it when the structure changes.

## Stack

| Area | Choice |
|---|---|
| Framework | Next.js 15, App Router, static rendering by default |
| UI | React 19, Server Components by default |
| Language | TypeScript, strict mode, `@/*` maps to `src/*` |
| Styling | Tailwind CSS v4, tokens declared with `@theme inline` in `globals.css` |
| Fonts | Manrope (`font-sans`, `font-mono`) via `next/font/google` |
| Tests | Vitest, jsdom, Testing Library |
| Lint | ESLint 9 with `eslint-config-next` |

## Layout

```
src/
  app/
    globals.css        brand tokens (the only file with color values)
    layout.tsx         root layout: fonts, SiteHeader, <main>, SiteFooter
    page.tsx           home page (/)
    docs/page.tsx      setup page (/docs)
  components/ui/       shared components + co-located tests, barrel index.ts
  components/sections/ page-level blocks + sections.test.tsx, barrel index.ts
  data/                typed page content: site.ts, store.ts, docs.ts
  lib/cn.ts            class-name joiner (+ cn.test.ts)
  lib/format.ts        formatPrice (USD)
scripts/check-brand.mjs  brand-token linter
docs/                    this overview, setup guide, validation results
.claude/                 Claude Code config (see below)
CLAUDE.md                project instructions loaded every session
```

## Components

| Component | Purpose | Notes |
|---|---|---|
| `Button` | Action button | `primary` / `secondary` variants, extends button attributes. Exports `buttonClasses` |
| `ButtonLink` | Link styled as a button | wraps `next/link`, same variants as `Button` |
| `ProductCard` | Product tile | image, optional badge, category, `Price` |
| `Price` | Price display | strikes through `compareAt` when on sale |
| `ImagePlaceholder` | Image stand-in | `role="img"` with a label |
| `Card` | Content tile | optional `tag` and `footer` |
| `Tag` | Small label | Manrope, uppercase |
| `Breadcrumb` | Navigation trail | Manrope, last item is `aria-current="page"` |
| `Alert` | Inline message | `info` / `emphasis` tones, `role="status"` |

## Routes and sections

| Route | Composes | Data |
|---|---|---|
| `/` (demo store) | `StoreHero`, `PerksStrip`, `CategoryGrid`, `ProductGrid`, `Newsletter` (client) | `data/store.ts` |
| `/docs` | `Breadcrumb`, `StepList`, `FeatureGrid`, `SampleTask` | `data/docs.ts` |
| Both (layout) | `SiteHeader`, `SiteFooter` | `data/site.ts` |

`SectionHeading` gives every section a consistent h2 that the section's `aria-labelledby` points at.

See [website-flow.md](website-flow.md) for the home page flow, module by module.

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
