import { CogIcon } from '@sanity/icons';
import type { StructureResolver } from 'sanity/structure';

const SINGLETONS = ['siteSettings'];

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !SINGLETONS.includes(item.getId() ?? '')),
    ]);

export const singletonTypes = new Set(SINGLETONS);
