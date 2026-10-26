import { defineField } from 'sanity';

export const contentGroups = [
  { name: 'content', title: 'Content', default: true },
  { name: 'media', title: 'Media' },
  { name: 'meta', title: 'Meta' },
  { name: 'seo', title: 'SEO' },
];

export function slugField(source = 'title') {
  return defineField({
    name: 'slug',
    title: 'Slug',
    type: 'slug',
    group: 'meta',
    options: { source, maxLength: 96 },
    validation: (rule) => rule.required(),
  });
}

export const seoField = defineField({
  name: 'seo',
  title: 'SEO',
  type: 'seo',
  group: 'seo',
});
