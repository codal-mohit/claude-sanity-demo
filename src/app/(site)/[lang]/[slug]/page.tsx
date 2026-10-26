import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { PageBuilder } from '@/features/pages/PageBuilder';
import { TranslationNotice } from '@/features/site/TranslationNotice';
import { buildAlternates } from '@/i18n/alternates';
import { assertLang } from '@/i18n/server';
import { sanityFetch } from '@/sanity/live';
import { PAGE_QUERY } from '@/sanity/queries';

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  const lang = assertLang(raw);
  const { data: page } = await sanityFetch({ query: PAGE_QUERY, params: { slug, lang }, stega: false });
  return {
    title: page?.seo?.title ?? page?.title ?? undefined,
    description: page?.seo?.description ?? undefined,
    robots: page?.seo?.noIndex ? { index: false } : undefined,
    alternates: buildAlternates('page', page?.translations, { lang, slug }),
  };
}

export default async function Page({ params }: Props) {
  const { lang: raw, slug } = await params;
  const lang = assertLang(raw);
  const { data: page } = await sanityFetch({ query: PAGE_QUERY, params: { slug, lang } });
  if (!page) notFound();
  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <TranslationNotice lang={lang} contentLang={page.language} />
      </div>
      <PageBuilder blocks={page.blocks} lang={lang} />
    </>
  );
}
