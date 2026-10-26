import { at, defineMigration, setIfMissing } from 'sanity/migrate';

// Documents created before i18n have no language. The site already treats them as English;
// this makes it explicit so the i18n plugin lists them correctly in the Studio.
export default defineMigration({
  title: 'Backfill language "en" on translatable documents',
  documentTypes: ['post', 'page', 'series', 'event', 'docsArticle'],
  filter: '!defined(language)',
  migrate: {
    document() {
      return [at('language', setIfMissing('en'))];
    },
  },
});
