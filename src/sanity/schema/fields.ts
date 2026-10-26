import { defineField, type SlugValidationContext } from 'sanity';

import { REVIEW_STATUSES } from '../workflow';

export const contentGroups = [
  { name: 'content', title: 'Content', default: true },
  { name: 'media', title: 'Media' },
  { name: 'meta', title: 'Meta' },
  { name: 'seo', title: 'SEO' },
];

// Translations share slugs across languages, so a slug only has to be unique within its type and language.
async function isUniquePerLanguage(slug: string, context: SlugValidationContext) {
  const { document, getClient } = context;
  if (!document) return true;
  const id = document._id.replace(/^drafts\./, '');
  const count = await getClient({ apiVersion: '2026-10-01' }).fetch<number>(
    `count(*[
      _type == $type
      && slug.current == $slug
      && coalesce(language, "") == $language
      && !(_id in [$id, $draft])
    ])`,
    { type: document._type, slug, language: (document.language as string | undefined) ?? '', id, draft: `drafts.${id}` },
  );
  return count === 0;
}

export function slugField(source = 'title') {
  return defineField({
    name: 'slug',
    title: 'Slug',
    type: 'slug',
    group: 'meta',
    options: { source, maxLength: 96, isUnique: isUniquePerLanguage },
    validation: (rule) => rule.required(),
  });
}

// Set and managed by the document internationalization plugin.
export const languageField = defineField({
  name: 'language',
  type: 'string',
  readOnly: true,
  hidden: true,
});

// Review status, changed through the Request review / Approve document actions.
export const reviewStatusField = defineField({
  name: 'reviewStatus',
  title: 'Review status',
  type: 'string',
  group: 'meta',
  readOnly: true,
  initialValue: 'draft',
  options: { list: REVIEW_STATUSES, layout: 'radio', direction: 'horizontal' },
});

export const seoField = defineField({
  name: 'seo',
  title: 'SEO',
  type: 'seo',
  group: 'seo',
});
