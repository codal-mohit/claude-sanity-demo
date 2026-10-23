# Sanity

- Schema files live in `src/sanity/schema/`, one type per file, registered in `index.ts`. Use `defineType`, `defineField`, `defineArrayMember`.
- Every document type has a `title` and `icon`, a `preview`, and validation on required fields. Images require alt text.
- GROQ lives in each feature's `queries.ts` and uses `defineQuery`. Project only the fields the page needs.
- After any schema or query change run `sanity typegen` and commit the generated types.
- Never write to the `production` dataset from Claude. Seed and test on `staging` only.
- Tokens and secrets only in `.env.local` and CI secrets. Never print them.
- Destructive CLI commands (`sanity dataset delete`, `dataset import --replace`) need explicit user approval.
