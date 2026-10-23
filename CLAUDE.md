# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Fresh Next.js 15 (App Router) app with React 19, TypeScript (strict), Tailwind CSS v4 and Vitest.

## Commands

- `npm run dev`: start the dev server on http://localhost:3000
- `npm run verify`: lint, typecheck and tests. Run before calling any task done.
- `npx vitest run src/app/page.test.tsx`: one test file. Add `-t "name"` to filter by test name.
- Never run `npm run build` while `npm run dev` is running: both write `.next` and the dev site breaks. If it happens: stop dev, delete `.next`, restart.

## Layout

- `src/app/`: routes, `layout.tsx` and `globals.css`.
- `@/*` maps to `src/*`.

## Working style

- Keep changes small. Don't add dependencies without asking.
- Avoid em dashes and double hyphens in copy and docs.
