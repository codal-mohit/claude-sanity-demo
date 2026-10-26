import { DocumentIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

import { contentGroups, seoField, slugField } from '../fields';

export const pageBlockTypes = ['hero', 'storyGrid', 'cta', 'faqBlock', 'gallery', 'formBlock'];

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
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
      name: 'blocks',
      title: 'Page builder',
      type: 'array',
      group: 'content',
      of: pageBlockTypes.map((type) => defineArrayMember({ type })),
      options: {
        insertMenu: {
          views: [{ name: 'list' }, { name: 'grid' }],
        },
      },
    }),
    seoField,
  ],
  preview: {
    select: { title: 'title', slug: 'slug.current' },
    prepare: ({ title, slug }) => ({ title, subtitle: slug ? `/${slug}` : 'No slug' }),
  },
});
