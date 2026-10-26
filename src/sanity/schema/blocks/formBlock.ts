import { EnvelopeIcon } from '@sanity/icons';
import { defineArrayMember, defineField, defineType } from 'sanity';

export const formBlock = defineType({
  name: 'formBlock',
  title: 'Form',
  type: 'object',
  icon: EnvelopeIcon,
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({
      name: 'kind',
      title: 'Form type',
      type: 'string',
      options: {
        list: [
          { title: 'Newsletter', value: 'newsletter' },
          { title: 'Contact', value: 'contact' },
        ],
        layout: 'radio',
      },
      initialValue: 'newsletter',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'fields',
      title: 'Extra fields',
      type: 'array',
      hidden: ({ parent }) => parent?.kind !== 'contact',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'formField',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (rule) => rule.required() }),
            defineField({
              name: 'inputType',
              title: 'Input type',
              type: 'string',
              options: { list: ['text', 'email', 'tel', 'textarea'] },
              initialValue: 'text',
            }),
            defineField({ name: 'required', title: 'Required', type: 'boolean', initialValue: false }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'submitLabel',
      title: 'Button label',
      type: 'string',
      initialValue: 'Submit',
    }),
    defineField({
      name: 'successMessage',
      title: 'Success message',
      type: 'string',
      initialValue: 'Thanks, we got it.',
    }),
  ],
  preview: {
    select: { title: 'heading', kind: 'kind' },
    prepare: ({ title, kind }) => ({ title: title || 'Form', subtitle: `Form: ${kind}` }),
  },
});
