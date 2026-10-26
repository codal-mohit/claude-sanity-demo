# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Sanity Claude Demo: a tech blog (articles, series, tags, docs, events) built with Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, Vitest and Sanity CMS. It is also a learning project for Claude Code capabilities. The product has no AI features and makes no Claude API calls.

## Commands

- `npm run dev`: start the dev server on http://localhost:3000
- `npm run verify`: lint, typecheck and tests. Run before calling any task done.
- `npx vitest run src/app/ui/Button/Button.test.tsx`: one test file. Add `-t "name"` to filter by test name.
- `npm run typegen`: extract the schema and regenerate `src/sanity/types.ts`. CI fails if it is stale.
- `npm run seed`: sample content (see the `seed-content` skill). `npm run migrate:dry <id>`: dry-run a migration in `migrations/`.
- Test against the user's dev server on http://localhost:3000; do not start a second one.
- Never run `npm run build` while `npm run dev` is running: both write `.next` and the dev site breaks. If it happens: stop dev, delete `.next`, restart.

## Layout

- `src/app/`: routes, `layout.tsx`, `globals.css`. `globals.css` holds the theme tokens.
- `src/app/ui/<Name>/index.tsx`: shared primitives (Button, Card, Breadcrumb). One folder per component, with its test beside it.
- `src/utils/`: `cn` helper. `src/icons/`: SVG icon components.
- `@/*` maps to `src/*`.
- `src/app/(site)/[lang]/`: public routes (blog, series, events, docs, authors, page builder). `src/app/studio/`: embedded Studio.
- i18n: `src/i18n/` (languages, `localizePath`, UI dictionary). English is unprefixed: `src/middleware.ts` rewrites `/blog` to `/en/blog` and redirects `/en/*` to `/*`. Pass `lang` to queries (`$lang`) and to components that build links.
- `src/sanity/`: schema, `queries.ts` (all GROQ, `defineQuery`), client, live fetch, Studio customization. Run `npm run typegen` after schema or query changes.
- `src/features/`: `blog`, `content` (image, link, portable text), `docs`, `events`, `pages` (page builder), `search`, `site` (header, footer, language switcher).
- Studio workflow: `src/sanity/workflow.ts` (review status rules), `actions/`, `badges/`, `tools/` (content health). Webhook revalidation: `src/app/api/revalidate` and `src/sanity/revalidate.ts`.
- `tools/seed.mjs`: sample content, `npm run seed`. Dark-first theme: `<html class="dark">`, tokens in `globals.css`.

## Rules

Detailed rules live in `.claude/rules/` and must be followed:

- [code.md](.claude/rules/code.md)
- [testing.md](.claude/rules/testing.md)
- [sanity.md](.claude/rules/sanity.md)

## Claude Code setup

Skills (`.claude/skills/`), commands (`/verify`, `/review`), subagents (`reviewer`, `content-modeler`, `implementer`), hooks and MCP servers are described in [docs/claude-code.md](docs/claude-code.md). Use the `new-sanity-type` and `new-feature` skills for schema and page work, and `ship` to open PRs.

## Working style

- Read the nearest existing component before writing a new one and match it.
- Keep changes small. Ask before adding dependencies.
- Do not write to the `production` Sanity dataset without the user's explicit approval in the current conversation. Prefer `staging`.
- Never read or print `.env*` files or tokens.
- Avoid em dashes and double hyphens in UI copy and docs.
