import { LinkIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

import { linkableTypes } from './link';

export const portableText = defineType({
  name: 'portableText',
  title: 'Rich text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading 2', value: 'h2' },
        { title: 'Heading 3', value: 'h3' },
        { title: 'Heading 4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Code', value: 'code' },
        ],
        annotations: [
          defineField({
            name: 'externalLink',
            title: 'External link',
            type: 'object',
            icon: LinkIcon,
            fields: [
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (rule) =>
                  rule.required().uri({ scheme: ['http', 'https', 'mailto', 'tel'] }),
              }),
              defineField({
                name: 'openInNewTab',
                title: 'Open in new tab',
                type: 'boolean',
                initialValue: true,
              }),
            ],
          }),
          defineField({
            name: 'internalLink',
            title: 'Internal link',
            type: 'object',
            fields: [
              defineField({
                name: 'reference',
                title: 'Page',
                type: 'reference',
                to: [...linkableTypes],
                validation: (rule) => rule.required(),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({ type: 'imageWithAlt' }),
    defineArrayMember({ type: 'callout' }),
    defineArrayMember({ type: 'codeBlock' }),
  ],
});
