import { CodeIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const codeBlock = defineType({
  name: 'codeBlock',
  title: 'Code block',
  type: 'object',
  icon: CodeIcon,
  fields: [
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: {
        list: ['bash', 'json', 'yaml', 'typescript', 'tsx', 'javascript', 'groq', 'css', 'html', 'python', 'go', 'sql'],
      },
      initialValue: 'typescript',
    }),
    defineField({
      name: 'filename',
      title: 'File name',
      type: 'string',
    }),
    defineField({
      name: 'code',
      title: 'Code',
      type: 'text',
      rows: 10,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: 'filename', subtitle: 'language' },
    prepare: ({ title, subtitle }) => ({ title: title || 'Code block', subtitle }),
  },
});
