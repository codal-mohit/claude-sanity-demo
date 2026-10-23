# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Meridian: a multilingual editorial and commerce platform built with Next.js 15 (App Router), React 19, TypeScript (strict), Tailwind CSS v4, Vitest and Sanity CMS. It is also a learning project for Claude Code capabilities. The product has no AI features and makes no Claude API calls.

## Commands

- `npm run dev`: start the dev server on http://localhost:3000
- `npm run verify`: lint, typecheck and tests. Run before calling any task done.
- `npx vitest run src/app/ui/Button/Button.test.tsx`: one test file. Add `-t "name"` to filter by test name.
- Never run `npm run build` while `npm run dev` is running: both write `.next` and the dev site breaks. If it happens: stop dev, delete `.next`, restart.

## Layout

- `src/app/`: routes, `layout.tsx`, `globals.css`. `globals.css` holds the theme tokens.
- `src/app/ui/<Name>/index.tsx`: shared primitives (Button, Card, Breadcrumb). One folder per component, with its test beside it.
- `src/utils/`: `cn` helper. `src/icons/`: SVG icon components.
- `@/*` maps to `src/*`.
- Planned: `src/sanity/` (schema, client, Studio customization), `src/features/` (journal, gear, events, docs, site), `migrations/`.

## Rules

Detailed rules live in `.claude/rules/` and must be followed:

- [code.md](.claude/rules/code.md)
- [testing.md](.claude/rules/testing.md)
- [sanity.md](.claude/rules/sanity.md)

## Working style

- Read the nearest existing component before writing a new one and match it.
- Keep changes small. Ask before adding dependencies.
- Never write to the `production` Sanity dataset. Use `staging`.
- Never read or print `.env*` files or tokens.
- Avoid em dashes and double hyphens in UI copy and docs.
