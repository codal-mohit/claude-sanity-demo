import { MenuIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  icon: MenuIcon,
  fields: [
    defineField({
      name: 'header',
      title: 'Header links',
      type: 'array',
      of: [defineArrayMember({ type: 'link' })],
      validation: (rule) => rule.max(7),
    }),
    defineField({
      name: 'footerColumns',
      title: 'Footer columns',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'footerColumn',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required() }),
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [defineArrayMember({ type: 'link' })],
            }),
          ],
        }),
      ],
      validation: (rule) => rule.max(4),
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Navigation' }),
  },
});
