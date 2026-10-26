'use client';

import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { presentationTool } from 'sanity/presentation';
import { structureTool } from 'sanity/structure';

import { withEditorialChecks } from './src/sanity/actions/checkedPublish';
import { featuredBadge } from './src/sanity/badges/featuredBadge';
import { CHECKED_TYPES } from './src/sanity/checks';
import { apiVersion, dataset, projectId } from './src/sanity/env';
import { resolve } from './src/sanity/presentation';
import { schemaTypes } from './src/sanity/schema';
import { singletonTypes, structure } from './src/sanity/structure';
import { studioTheme } from './src/sanity/theme';
import { contentHealthTool } from './src/sanity/tools/contentHealth';

export default defineConfig({
  basePath: '/studio',
  title: 'Sanity Claude Demo',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },
  theme: studioTheme,
  document: {
    actions: (actions, { schemaType }) => {
      if (singletonTypes.has(schemaType)) {
        return actions.filter(
          ({ action }) =>
            action &&
            ['publish', 'discardChanges', 'restore'].includes(action),
        );
      }
      if (CHECKED_TYPES.includes(schemaType)) {
        return actions.map((action) =>
          action.action === 'publish' ? withEditorialChecks(action) : action,
        );
      }
      return actions;
    },
    badges: (badges, { schemaType }) =>
      schemaType === 'post' ? [...badges, featuredBadge] : badges,
  },
  tools: (tools) => [...tools, contentHealthTool],
  plugins: [
    structureTool({ structure }),
    presentationTool({
      resolve,
      previewUrl: { previewMode: { enable: '/api/draft-mode/enable' } },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
