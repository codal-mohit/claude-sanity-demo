import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Breadcrumbs } from '@/app/ui/Breadcrumb';
import { ArticleCard, ArticleMeta, TagList } from '@/features/blog/ArticleCard';
import { SeriesNav } from '@/features/blog/SeriesNav';
import { PortableTextBody } from '@/features/content/PortableTextBody';
import { SanityImage } from '@/features/content/SanityImage';
import { TranslationNotice } from '@/features/site/TranslationNotice';
import { buildAlternates } from '@/i18n/alternates';
import { localizePath } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { assertLang } from '@/i18n/server';
import { sanityFetch } from '@/sanity/live';
import { POST_QUERY } from '@/sanity/queries';

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: raw, slug } = await params;
  const lang = assertLang(raw);
  const { data: post } = await sanityFetch({ query: POST_QUERY, params: { slug, lang }, stega: false });
  return {
    title: post?.seo?.title ?? post?.title ?? undefined,
    description: post?.seo?.description ?? post?.excerpt ?? undefined,
    robots: post?.seo?.noIndex ? { index: false } : undefined,
    alternates: buildAlternates('post', post?.translations, { lang, slug }),
  };
}

export default async function ArticlePage({ params }: Props) {
  const { lang: raw, slug } = await params;
  const lang = assertLang(raw);
  const t = getDictionary(lang);
  const { data: post } = await sanityFetch({ query: POST_QUERY, params: { slug, lang } });
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <TranslationNotice lang={lang} contentLang={post.language} />
      <Breadcrumbs
        className="font-mono"
        items={[
          { label: t.home, href: localizePath('/', lang) },
          { label: t.blog, href: localizePath('/blog', lang) },
          { label: post.title },
        ]}
      />
      <header className="mt-8 max-w-3xl">
        {post.categories?.length ? (
          <p className="text-accent font-mono text-xs uppercase tracking-wider">
            {post.categories.map((category) => category.title).join(' / ')}
          </p>
        ) : null}
        <h1 className="text-headline mt-3 text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl">{post.title}</h1>
        {post.excerpt ? <p className="mt-4 text-lg leading-8">{post.excerpt}</p> : null}
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          {post.author ? (
            <div className="flex items-center gap-3">
              <div className="border-border size-10 overflow-hidden rounded-full border">
                <SanityImage image={post.author.avatar} width={80} height={80} />
              </div>
              <div>
                <p className="text-headline text-sm font-semibold">
                  {post.author.slug ? (
                    <Link href={localizePath(`/authors/${post.author.slug}`, lang)} className="hover:text-accent transition-colors">
                      {post.author.name}
                    </Link>
                  ) : (
                    post.author.name
                  )}
                </p>
                {post.author.role ? <p className="font-mono text-xs">{post.author.role}</p> : null}
              </div>
            </div>
          ) : null}
          <ArticleMeta article={post} lang={lang} />
        </div>
      </header>

      <div className="border-border bg-surface mt-10 overflow-hidden rounded-3xl border p-2">
        <SanityImage
          image={post.coverImage}
          width={1440}
          height={680}
          priority
          sizes="(min-width: 1152px) 1152px, 100vw"
          className="rounded-2xl"
        />
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="max-w-3xl">
          <PortableTextBody value={post.body} lang={lang} />
          <div className="border-border mt-12 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
            <TagList tags={post.tags} lang={lang} />
            {post.repoUrl ? (
              <a
                href={post.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent font-mono text-sm underline underline-offset-4"
              >
                {t.viewRepo}
              </a>
            ) : null}
          </div>
        </div>
        <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <SeriesNav series={post.series} currentId={post._id} lang={lang} />
        </aside>
      </div>

      {post.related?.length ? (
        <section className="mt-20">
          <h2 className="text-headline mb-6 flex items-center gap-3 text-2xl font-bold">
            <span aria-hidden="true" className="text-accent font-mono text-base">
              {'//'}
            </span>
            {t.relatedArticles}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {post.related.map((article) => (
              <ArticleCard key={article._id} article={article} lang={lang} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
