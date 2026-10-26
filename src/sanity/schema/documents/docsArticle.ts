import { BookIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

import { contentGroups, languageField, reviewStatusField, seoField, slugField } from '../fields';

export const docsArticle = defineType({
  name: 'docsArticle',
  title: 'Docs article',
  type: 'document',
  icon: BookIcon,
  groups: contentGroups,
  fields: [
    languageField,
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    slugField(),
    defineField({
      name: 'parent',
      title: 'Parent article',
      type: 'reference',
      to: [{ type: 'docsArticle' }],
      group: 'meta',
      description: 'Builds the docs tree and the URL path.',
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      group: 'meta',
      initialValue: 0,
      validation: (rule) => rule.integer(),
    }),
    defineField({ name: 'summary', title: 'Summary', type: 'text', rows: 2, group: 'content' }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'portableText',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'version',
      title: 'Version',
      type: 'string',
      group: 'meta',
      options: { list: ['v1', 'v2'] },
      initialValue: 'v2',
    }),
    reviewStatusField,
    seoField,
  ],
  orderings: [{ title: 'Manual order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', parent: 'parent.title', version: 'version' },
    prepare: ({ title, parent, version }) => ({
      title,
      subtitle: [version, parent && `in ${parent}`].filter(Boolean).join(' · '),
    }),
  },
});
