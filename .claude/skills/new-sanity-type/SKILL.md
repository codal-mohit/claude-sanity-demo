---
name: new-sanity-type
description: Add a new Sanity document or object type to this repo end to end (schema file, registration, Studio wiring, GROQ query, typegen, test). Use when the user asks for a new content type, a new field group, or a new page builder block.
---

# New Sanity type

Follow `.claude/rules/sanity.md`. Work in this order and run each check before moving on.

1. **Read the nearest existing type first.** Documents: `src/sanity/schema/documents/post.ts`. Objects: `src/sanity/schema/objects/callout.ts`. Blocks: `src/sanity/schema/blocks/cta.ts`. Match its imports, icon, groups and preview.
2. **Create the schema file** in the matching folder, one type per file, using `defineType`, `defineField`, `defineArrayMember`.
   - Documents that have a public page: add `languageField`, `slugField()`, `reviewStatusField` and `seoField` from `../fields`.
   - Required fields get `validation`. Images use `imageWithAlt`.
3. **Register it** in `src/sanity/schema/index.ts` (keep the Documents / Objects / Blocks grouping).
4. **Wire the Studio** when it is a document with a page:
   - Add it to `I18N_TYPES` in `src/i18n/config.ts` if it is translated.
   - Add it to `CHECKED_TYPES` in `src/sanity/checks.ts` if it gets publish checks.
   - Add a route to `ROUTES` in `src/sanity/links.ts` and a location in `src/sanity/presentation.ts`.
   - Add a case to `revalidateTargets` in `src/sanity/revalidate.ts`.
   - New page builder block: add it to `pageBlockTypes` in `documents/page.ts` and render it in `src/features/pages/PageBuilder/index.tsx`.
5. **Query it** in `src/sanity/queries.ts` with `defineQuery`. Filter lists with the shared `inLang` fragment and pass `$lang`.
6. **Run `npm run typegen`** and use the generated `*Result` type. Never hand-write result types.
7. **Test**: add or extend a test for any helper or component you touched (`.claude/rules/testing.md`).
8. **Run `npm run verify`** and report the result.

Do not write sample content to the `production` dataset without explicit approval. Use `npm run seed` only when asked.
