import { ArrowRightIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const cta = defineType({
  name: 'cta',
  title: 'Call to action',
  type: 'object',
  icon: ArrowRightIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'text', title: 'Text', type: 'text', rows: 2 }),
    defineField({
      name: 'link',
      title: 'Button',
      type: 'link',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tone',
      title: 'Tone',
      type: 'string',
      options: { list: ['light', 'dark', 'accent'], layout: 'radio', direction: 'horizontal' },
      initialValue: 'accent',
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title, subtitle: 'Call to action' }),
  },
});
