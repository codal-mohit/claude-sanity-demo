import { ImageIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  icon: ImageIcon,
  options: { hotspot: true, metadata: ['lqip', 'palette', 'blurhash'] },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description: 'Describe the image for screen readers. Leave empty only for decorative images.',
      validation: (rule) =>
        rule.custom((alt, context) => {
          const parent = context.parent as { asset?: unknown; decorative?: boolean } | undefined;
          if (parent?.asset && !parent.decorative && !alt) {
            return 'Alt text is required unless the image is decorative.';
          }
          return true;
        }),
    }),
    defineField({
      name: 'decorative',
      title: 'Decorative image',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
    }),
  ],
});
