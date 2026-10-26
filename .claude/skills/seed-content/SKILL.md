---
name: seed-content
description: Add or change sample content in tools/seed.mjs and run the seed safely. Use when the user wants demo articles, translations, pages or other sample data in Sanity.
---

# Seed content

`tools/seed.mjs` creates every sample document with a fixed `seed-*` ID, so runs are repeatable.

1. Edit the data in `tools/seed.mjs` (articles live in `ARTICLES`, translations in `TRANSLATIONS` and `HOME_TRANSLATIONS`). Every article needs an excerpt, at least one tag and an SEO description so it passes the publish checks.
2. Check the target dataset before running. The script refuses `production` unless `--allow-production` is passed. **Ask the user before passing it.**
3. Run `npm run seed` (add `-- --allow-production` only with approval, `-- --reset-singletons` only when navigation or site settings must be replaced).
4. The script prunes `seed-*` documents that are no longer in the script. Never delete documents without the `seed-` prefix.
5. Verify the affected routes on http://localhost:3000.
