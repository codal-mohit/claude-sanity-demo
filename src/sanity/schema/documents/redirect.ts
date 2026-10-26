import { TransferIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

const pathRule = (value: string | undefined) =>
  !value || value.startsWith('/') ? true : 'Path must start with /.';

export const redirect = defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'document',
  icon: TransferIcon,
  fields: [
    defineField({
      name: 'source',
      title: 'From',
      type: 'string',
      validation: (rule) => rule.required().custom(pathRule),
    }),
    defineField({
      name: 'destination',
      title: 'To',
      type: 'string',
      description: 'A path starting with / or a full URL.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'permanent',
      title: 'Permanent (308)',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: { source: 'source', destination: 'destination', permanent: 'permanent' },
    prepare: ({ source, destination, permanent }) => ({
      title: `${source} → ${destination}`,
      subtitle: permanent ? 'Permanent' : 'Temporary',
    }),
  },
});
