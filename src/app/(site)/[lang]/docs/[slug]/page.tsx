import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/app/ui/Breadcrumb';
import { PortableTextBody } from '@/features/content/PortableTextBody';
import { buildDocsTree } from '@/features/docs/buildDocsTree';
import { DocsSidebar } from '@/features/docs/DocsSidebar';
import { TranslationNotice } from '@/features/site/TranslationNotice';
import { buildAlternates } from '@/i18n/alternates';
import { localizePath, type Lang } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { assertLang } from '@/i18n/server';
import { sanityFetch } from '@/sanity/live';
import { DOCS_ARTICLE_QUERY, DOCS_NAV_QUERY } from '@/sanity/queries';

type Props = { params: Promise<{ lang: string; slug: string }> };

const DATE_LOCALES: Record<Lang, string> = { en: 'en-US', fr: 'fr-FR', de: 'de-DE' };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  const lang = assertLang(raw);
  const { data: doc } = await sanityFetch({ query: DOCS_ARTICLE_QUERY, params: { slug, lang }, stega: false });
  return {
    title: doc?.seo?.title ?? doc?.title ?? undefined,
    description: doc?.seo?.description ?? doc?.summary ?? undefined,
    alternates: buildAlternates('docsArticle', doc?.translations, { lang, slug }),
  };
}

export default async function DocsArticlePage({ params }: Props) {
  const { lang: raw, slug } = await params;
  const lang = assertLang(raw);
  const t = getDictionary(lang);
  const [{ data: doc }, { data: nav }] = await Promise.all([
    sanityFetch({ query: DOCS_ARTICLE_QUERY, params: { slug, lang } }),
    sanityFetch({ query: DOCS_NAV_QUERY, params: { lang } }),
  ]);
  if (!doc) notFound();

  const dateFormat = new Intl.DateTimeFormat(DATE_LOCALES[lang], { dateStyle: 'medium', timeZone: 'UTC' });
  const crumbs = [
    { label: t.docs, href: localizePath('/docs', lang) },
    ...(doc.parent?.slug ? [{ label: doc.parent.title, href: localizePath(`/docs/${doc.parent.slug}`, lang) }] : []),
    { label: doc.title },
  ];

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <DocsSidebar tree={buildDocsTree(nav)} currentSlug={slug} lang={lang} />
      </aside>
      <article className="max-w-3xl">
        <TranslationNotice lang={lang} contentLang={doc.language} />
        <Breadcrumbs className="font-mono" items={crumbs} />
        <h1 className="text-headline mt-6 text-4xl font-extrabold tracking-tight">{doc.title}</h1>
        {doc.summary ? <p className="mt-4 text-lg leading-8">{doc.summary}</p> : null}
        <p className="mt-3 font-mono text-xs">
          {doc.version ? `${doc.version} · ` : null}
          {t.updated} {dateFormat.format(new Date(doc._updatedAt))}
        </p>
        <div className="mt-8">
          <PortableTextBody value={doc.body} lang={lang} />
        </div>
      </article>
    </div>
  );
}
