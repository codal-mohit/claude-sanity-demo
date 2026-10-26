import { LinkIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const linkableTypes = [
  { type: 'page' },
  { type: 'post' },
  { type: 'series' },
  { type: 'event' },
  { type: 'docsArticle' },
] as const;

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Link type',
      type: 'string',
      options: {
        list: [
          { title: 'Internal', value: 'internal' },
          { title: 'URL or path', value: 'external' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'internal',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'reference',
      title: 'Page',
      type: 'reference',
      to: [...linkableTypes],
      hidden: ({ parent }) => parent?.type !== 'internal',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { type?: string } | undefined;
          return parent?.type === 'internal' && !value ? 'Choose a page.' : true;
        }),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'A full URL, or a site path such as /blog.',
      hidden: ({ parent }) => parent?.type !== 'external',
      validation: (rule) =>
        rule
          .uri({ scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: true })
          .custom((value, context) => {
            const parent = context.parent as { type?: string } | undefined;
            return parent?.type === 'external' && !value ? 'Enter a URL.' : true;
          }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => parent?.type !== 'external',
    }),
  ],
  preview: {
    select: { title: 'label', type: 'type', url: 'url', refTitle: 'reference.title' },
    prepare: ({ title, type, url, refTitle }) => ({
      title,
      subtitle: type === 'external' ? url : refTitle,
    }),
  },
});
