import { RocketIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  icon: RocketIcon,
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string' }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required().max(90),
    }),
    defineField({ name: 'text', title: 'Text', type: 'text', rows: 3 }),
    defineField({ name: 'image', title: 'Image', type: 'imageWithAlt' }),
    defineField({
      name: 'links',
      title: 'Buttons',
      type: 'array',
      of: [defineArrayMember({ type: 'link' })],
      validation: (rule) => rule.max(2),
    }),
  ],
  preview: {
    select: { title: 'heading', media: 'image' },
    prepare: ({ title, media }) => ({ title, subtitle: 'Hero', media }),
  },
});
