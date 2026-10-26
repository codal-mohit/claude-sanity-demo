import { TagIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

import { slugField } from '../fields';

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  groups: [{ name: 'meta', title: 'Meta' }],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    slugField(),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 2 }),
    defineField({
      name: 'parent',
      title: 'Parent category',
      type: 'reference',
      to: [{ type: 'category' }],
      options: { filter: ({ document }) => ({ filter: '_id != $id', params: { id: document._id.replace(/^drafts\./, '') } }) },
    }),
  ],
  preview: {
    select: { title: 'title', parent: 'parent.title' },
    prepare: ({ title, parent }) => ({ title, subtitle: parent ? `in ${parent}` : undefined }),
  },
});
