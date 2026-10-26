import { ThListIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const storyGrid = defineType({
  name: 'storyGrid',
  title: 'Article grid',
  type: 'object',
  icon: ThListIcon,
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'mode',
      title: 'Source',
      type: 'string',
      options: {
        list: [
          { title: 'Latest articles', value: 'latest' },
          { title: 'By category', value: 'category' },
          { title: 'Hand picked', value: 'manual' },
        ],
        layout: 'radio',
      },
      initialValue: 'latest',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      hidden: ({ parent }) => parent?.mode !== 'category',
    }),
    defineField({
      name: 'posts',
      title: 'Articles',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'post' }] })],
      hidden: ({ parent }) => parent?.mode !== 'manual',
      validation: (rule) => rule.unique().max(12),
    }),
    defineField({
      name: 'limit',
      title: 'Number of articles',
      type: 'number',
      initialValue: 6,
      hidden: ({ parent }) => parent?.mode === 'manual',
      validation: (rule) => rule.min(1).max(12).integer(),
    }),
  ],
  preview: {
    select: { title: 'heading', mode: 'mode' },
    prepare: ({ title, mode }) => ({ title: title || 'Article grid', subtitle: `Article grid: ${mode}` }),
  },
});
