import { CalendarIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

import { contentGroups, seoField, slugField } from '../fields';

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  groups: [...contentGroups, { name: 'when', title: 'When and where' }],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    slugField(),
    defineField({ name: 'summary', title: 'Summary', type: 'text', rows: 2, group: 'content' }),
    defineField({ name: 'body', title: 'Details', type: 'portableText', group: 'content' }),
    defineField({ name: 'image', title: 'Image', type: 'imageWithAlt', group: 'media' }),
    defineField({
      name: 'startsAt',
      title: 'Starts at',
      type: 'datetime',
      group: 'when',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endsAt',
      title: 'Ends at',
      type: 'datetime',
      group: 'when',
      validation: (rule) =>
        rule.custom((value, context) => {
          const startsAt = (context.document as { startsAt?: string } | undefined)?.startsAt;
          return !value || !startsAt || value > startsAt ? true : 'Must be after the start.';
        }),
    }),
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
      group: 'when',
      options: { list: ['in-person', 'online', 'hybrid'], layout: 'radio', direction: 'horizontal' },
      initialValue: 'in-person',
    }),
    defineField({
      name: 'venue',
      title: 'Venue',
      type: 'string',
      group: 'when',
      hidden: ({ document }) => document?.format === 'online',
    }),
    defineField({
      name: 'location',
      title: 'Map location',
      type: 'geopoint',
      group: 'when',
      hidden: ({ document }) => document?.format === 'online',
    }),
    defineField({
      name: 'onlineUrl',
      title: 'Online URL',
      type: 'url',
      group: 'when',
      hidden: ({ document }) => document?.format === 'in-person',
    }),
    defineField({ name: 'ticketUrl', title: 'Ticket URL', type: 'url', group: 'meta' }),
    seoField,
  ],
  orderings: [{ title: 'Soonest first', name: 'startsAtAsc', by: [{ field: 'startsAt', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', startsAt: 'startsAt', media: 'image', format: 'format' },
    prepare: ({ title, startsAt, media, format }) => ({
      title,
      subtitle: [startsAt ? new Date(startsAt).toLocaleDateString() : 'No date', format].filter(Boolean).join(' · '),
      media,
    }),
  },
});
