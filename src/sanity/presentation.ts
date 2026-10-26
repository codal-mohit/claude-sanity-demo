import { defineDocuments, defineLocations, type PresentationPluginOptions } from 'sanity/presentation';

import { resolveHref } from './links';

function locationsFor(type: string, label: string, listHref?: string) {
  return defineLocations({
    select: { title: 'title', slug: 'slug.current' },
    resolve: (doc) => {
      const href = resolveHref({ _type: type, slug: doc?.slug });
      if (!href) return { locations: [] };
      return {
        locations: [
          { title: doc?.title || 'Untitled', href },
          ...(listHref ? [{ title: label, href: listHref }] : []),
        ],
      };
    },
  });
}

export const resolve: PresentationPluginOptions['resolve'] = {
  mainDocuments: defineDocuments([
    { route: '/', filter: `_type == "page" && slug.current == "home"` },
    { route: '/blog/:slug', filter: `_type == "post" && slug.current == $slug` },
    { route: '/series/:slug', filter: `_type == "series" && slug.current == $slug` },
    { route: '/:slug', filter: `_type == "page" && slug.current == $slug` },
  ]),
  locations: {
    page: locationsFor('page', 'Pages'),
    post: locationsFor('post', 'Blog', '/blog'),
    series: locationsFor('series', 'Blog', '/blog'),
    siteSettings: defineLocations({ message: 'Used on every page', tone: 'positive', locations: [{ title: 'Home', href: '/' }] }),
    navigation: defineLocations({ message: 'Used on every page', tone: 'positive', locations: [{ title: 'Home', href: '/' }] }),
  },
};
