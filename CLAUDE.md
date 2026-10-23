# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Demo app for AI-assisted development: a single branded landing page that shows how Claude Code follows the project's architecture, brand tokens and coding standards. Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, Vitest.

## Commands

- `npm run dev`: start the dev server on http://localhost:3000
- `npm run verify`: lint, typecheck, brand check and tests. Run before calling any task done.
- `npm run test`: Vitest, single run
- `npx vitest run src/components/ui/Button.test.tsx`: one test file. Add `-t "name"` to filter by test name.
- `npm run lint` / `npm run typecheck`: ESLint 9 / `tsc --noEmit`
- `npm run check:brand`: fails on raw colors or off-brand fonts
- Never run `npm run build` while `npm run dev` is running: both write `.next` and the dev site breaks (404 on CSS/JS, then 500). If it happens: stop dev, delete `.next`, restart.

## Layout

- `src/app/`: routes. `globals.css` holds the brand tokens and is the only file allowed to contain color values.
- `src/app/`: routes. `/` is a demo store home page, `/docs` explains the Claude Code setup. `layout.tsx` renders the shared header and footer.
- `src/components/ui/`: shared presentational components. Export each one from `src/components/ui/index.ts`.
- `src/components/sections/`: page-level blocks (header, store hero, product grid, footer) composed by the routes. Export from its `index.ts`.
- `src/data/`: typed content for the pages (`site.ts`, `store.ts`, `docs.ts`). Put copy and lists here, not inline in components.
- `src/lib/`: framework-free helpers. Only `cn.ts` (class names) exists today.
- `scripts/`: repo tooling (`check-brand.mjs`). A PostToolUse hook (`.claude/hooks/brand-check-on-edit.mjs`) runs the brand check after edits.
- `@/*` maps to `src/*`.
- `docs/`: setup guide and validation results.

See [docs/repository-overview.md](docs/repository-overview.md) for the full architecture.

## Rules

Detailed rules live in `.claude/rules/`. They are short and must be followed:

- [coding-standards.md](.claude/rules/coding-standards.md)
- [brand-tokens.md](.claude/rules/brand-tokens.md)
- [testing.md](.claude/rules/testing.md)

## Working style

- Read the nearest existing component before writing a new one and match it.
- Keep changes small. Don't add dependencies without asking.
- Avoid em dashes and double hyphens in UI copy and docs.
