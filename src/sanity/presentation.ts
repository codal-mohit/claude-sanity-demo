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
    { route: '/events/:slug', filter: `_type == "event" && slug.current == $slug` },
    { route: '/docs/:slug', filter: `_type == "docsArticle" && slug.current == $slug` },
    { route: '/authors/:slug', filter: `_type == "author" && slug.current == $slug` },
    { route: '/:slug', filter: `_type == "page" && slug.current == $slug` },
  ]),
  locations: {
    page: locationsFor('page', 'Pages'),
    post: locationsFor('post', 'Blog', '/blog'),
    series: locationsFor('series', 'Blog', '/blog'),
    event: locationsFor('event', 'Events', '/events'),
    docsArticle: locationsFor('docsArticle', 'Docs', '/docs'),
    siteSettings: defineLocations({ message: 'Used on every page', tone: 'positive', locations: [{ title: 'Home', href: '/' }] }),
    navigation: defineLocations({ message: 'Used on every page', tone: 'positive', locations: [{ title: 'Home', href: '/' }] }),
  },
};
