import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PageBuilder } from '@/features/pages/PageBuilder';
import { client } from '@/sanity/client';
import { sanityFetch } from '@/sanity/live';
import { PAGE_QUERY, PAGE_SLUGS_QUERY } from '@/sanity/queries';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await client.fetch(PAGE_SLUGS_QUERY, {}, { perspective: 'published', stega: false });
  return slugs.filter(Boolean).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: page } = await sanityFetch({ query: PAGE_QUERY, params, stega: false });
  return {
    title: page?.seo?.title ?? page?.title ?? undefined,
    description: page?.seo?.description ?? undefined,
    robots: page?.seo?.noIndex ? { index: false } : undefined,
  };
}

export default async function Page({ params }: Props) {
  const { data: page } = await sanityFetch({ query: PAGE_QUERY, params });
  if (!page) notFound();
  return <PageBuilder blocks={page.blocks} />;
}
