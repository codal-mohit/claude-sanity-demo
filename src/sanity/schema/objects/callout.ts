import { InfoOutlineIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const callout = defineType({
  name: 'callout',
  title: 'Callout',
  type: 'object',
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: 'tone',
      title: 'Tone',
      type: 'string',
      options: {
        list: ['info', 'tip', 'warning'],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'info',
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'text', subtitle: 'tone' },
  },
});
