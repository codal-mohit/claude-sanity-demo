import { at, defineMigration, setIfMissing } from 'sanity/migrate';

// The review workflow treats a missing status as "draft". Setting it explicitly keeps
// the In review / Approved lists and GROQ filters simple.
export default defineMigration({
  title: 'Backfill reviewStatus "draft" on reviewed document types',
  documentTypes: ['post', 'page', 'series', 'event', 'docsArticle'],
  filter: '!defined(reviewStatus)',
  migrate: {
    document() {
      return [at('reviewStatus', setIfMissing('draft'))];
    },
  },
});
