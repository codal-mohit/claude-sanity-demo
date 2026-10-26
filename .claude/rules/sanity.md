# Sanity

- Schema files live in `src/sanity/schema/`, one type per file, registered in `index.ts`. Use `defineType`, `defineField`, `defineArrayMember`.
- Every document type has a `title` and `icon`, a `preview`, and validation on required fields. Images require alt text.
- All GROQ lives in `src/sanity/queries.ts` and uses `defineQuery`. Project only the fields the page needs, and filter translated types with `$lang`.
- After any schema or query change run `sanity typegen` and commit the generated types.
- Do not write to the `production` dataset without explicit user approval in the current conversation. Prefer `staging`.
- Tokens and secrets only in `.env.local` and CI secrets. Never print them.
- Destructive CLI commands (`sanity dataset delete`, `dataset import --replace`) need explicit user approval.
