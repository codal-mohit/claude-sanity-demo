import type { MetadataRoute } from 'next';

import { client } from '@/sanity/client';
import { resolveHref } from '@/sanity/links';
import { SITEMAP_QUERY } from '@/sanity/queries';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs = await client.fetch(SITEMAP_QUERY, {}, { perspective: 'published', stega: false });
  return docs.flatMap((doc) => {
    const href = resolveHref(doc, doc.language);
    return href ? [{ url: new URL(href, SITE_URL).toString(), lastModified: doc._updatedAt }] : [];
  });
}
