import { BookIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

import { contentGroups, seoField, slugField } from '../fields';

export const series = defineType({
  name: 'series',
  title: 'Series',
  type: 'document',
  icon: BookIcon,
  groups: contentGroups,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    slugField(),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      group: 'content',
      validation: (rule) => rule.required().max(240),
    }),
    defineField({ name: 'coverImage', title: 'Cover image', type: 'imageWithAlt', group: 'media' }),
    defineField({
      name: 'articles',
      title: 'Articles in order',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'post' }] })],
      validation: (rule) => rule.required().min(2).unique(),
    }),
    seoField,
  ],
  preview: {
    select: { title: 'title', articles: 'articles', media: 'coverImage' },
    prepare: ({ title, articles, media }) => ({
      title,
      subtitle: `${Array.isArray(articles) ? articles.length : 0} parts`,
      media,
    }),
  },
});
