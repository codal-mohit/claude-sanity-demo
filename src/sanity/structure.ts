import { CheckmarkCircleIcon, CogIcon, EyeOpenIcon, MenuIcon } from '@sanity/icons';
import type { StructureResolver } from 'sanity/structure';

const SINGLETONS = ['siteSettings', 'navigation'];
// translation.metadata is created by the i18n plugin and edited through it, not directly.
const HIDDEN_TYPES = [...SINGLETONS, 'translation.metadata'];

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem()
        .title('Navigation')
        .icon(MenuIcon)
        .child(S.document().schemaType('navigation').documentId('navigation')),
      S.divider(),
      S.listItem()
        .title('In review')
        .icon(EyeOpenIcon)
        .child(
          S.documentList()
            .title('In review')
            .filter('reviewStatus == "in-review"')
            .defaultOrdering([{ field: '_updatedAt', direction: 'desc' }]),
        ),
      S.listItem()
        .title('Approved, not published')
        .icon(CheckmarkCircleIcon)
        .child(
          S.documentList()
            .title('Approved, not published')
            .filter('reviewStatus == "approved" && _id in path("drafts.**")')
            .defaultOrdering([{ field: '_updatedAt', direction: 'desc' }]),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => !HIDDEN_TYPES.includes(item.getId() ?? '')),
    ]);

export const singletonTypes = new Set(SINGLETONS);
