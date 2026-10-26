---
name: new-feature
description: Build a new site page or feature in this Next.js + Sanity repo following its conventions (localized route under [lang], feature folder, typed GROQ, dictionary strings, tests). Use when the user asks for a new page, section, listing or UI component on the public site.
---

# New site feature

1. **Plan the route.** Public pages live in `src/app/(site)/[lang]/<route>/page.tsx`. Always call `assertLang(params.lang)` from `@/i18n/server` first.
2. **Data.** Add the query to `src/sanity/queries.ts` with `defineQuery`, pass `{ lang, ... }` as params, then run `npm run typegen`. Fetch with `sanityFetch` from `@/sanity/live` (use `stega: false` in `generateMetadata`).
3. **Components** go in `src/features/<feature>/<Name>/index.tsx`, server components by default. Read the closest existing one first (for example `src/features/blog/ArticleCard/index.tsx`) and match it.
   - Every component that builds links takes a `lang` prop and uses `localizePath` or `resolveHref(target, lang)`.
   - Shared primitives come from `src/app/ui` (Button, Card, Breadcrumb).
   - Use theme tokens (`text-headline`, `bg-surface`, `border-border`, `text-accent`), not raw colors.
4. **Copy.** Interface text goes in `src/i18n/dictionary.ts` for `en`, `fr` and `de`. Content text comes from Sanity.
5. **Metadata.** Export `generateMetadata` with title, description and `alternates` (`buildAlternates` for translated documents).
6. **Tests** beside each new component or helper, querying by role or label, no network.
7. **Verify** with `npm run verify`, then check the route on the user's dev server at http://localhost:3000 (never start a second dev server).
