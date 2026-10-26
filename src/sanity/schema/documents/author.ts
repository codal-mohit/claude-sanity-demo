import { UserIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

import { slugField } from '../fields';

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: UserIcon,
  groups: [{ name: 'meta', title: 'Meta' }],
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    slugField('name'),
    defineField({ name: 'role', title: 'Role', type: 'string' }),
    defineField({ name: 'avatar', title: 'Avatar', type: 'imageWithAlt' }),
    defineField({ name: 'bio', title: 'Bio', type: 'text', rows: 4 }),
    defineField({
      name: 'socials',
      title: 'Social links',
      type: 'array',
      of: [defineArrayMember({ type: 'url' })],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'avatar' },
  },
});
