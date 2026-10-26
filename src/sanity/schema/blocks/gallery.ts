import { ImagesIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const gallery = defineType({
  name: 'gallery',
  title: 'Gallery',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [defineArrayMember({ type: 'imageWithAlt' })],
      options: { layout: 'grid' },
      validation: (rule) => rule.required().min(2).max(24),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: { list: ['grid', 'carousel', 'masonry'], layout: 'radio', direction: 'horizontal' },
      initialValue: 'grid',
    }),
  ],
  preview: {
    select: { title: 'heading', media: 'images.0', layout: 'layout' },
    prepare: ({ title, media, layout }) => ({ title: title || 'Gallery', subtitle: `Gallery: ${layout}`, media }),
  },
});
