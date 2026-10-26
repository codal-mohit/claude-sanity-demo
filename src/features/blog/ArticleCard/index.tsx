import Link from 'next/link';

import { SanityImage } from '@/features/content/SanityImage';
import { DEFAULT_LANG, localizePath, type Lang } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';
import { readingMinutes } from '@/sanity/links';
import type { POSTS_QUERYResult } from '@/sanity/types';
import { cn } from '@/utils';

export type ArticleCardData = POSTS_QUERYResult[number];

const DATE_LOCALES: Record<Lang, string> = { en: 'en-US', fr: 'fr-FR', de: 'de-DE' };

export function ArticleMeta({
  article,
  lang = DEFAULT_LANG,
  className,
}: {
  article: Pick<ArticleCardData, 'publishedAt' | 'characters'>;
  lang?: Lang;
  className?: string;
}) {
  const dateFormat = new Intl.DateTimeFormat(DATE_LOCALES[lang], { dateStyle: 'medium', timeZone: 'UTC' });
  return (
    <p className={cn('text-foreground/80 font-mono text-xs', className)}>
      {article.publishedAt ? <time dateTime={article.publishedAt}>{dateFormat.format(new Date(article.publishedAt))}</time> : null}
      <span aria-hidden="true"> · </span>
      {readingMinutes(article.characters)} {getDictionary(lang).minRead}
    </p>
  );
}

export function TagList({ tags, lang = DEFAULT_LANG, className }: { tags: string[] | null | undefined; lang?: Lang; className?: string }) {
  if (!tags?.length) return null;
  return (
    <ul className={cn('flex flex-wrap gap-2', className)} aria-label="Tags">
      {tags.map((tag) => (
        <li key={tag}>
          <Link
            href={localizePath(`/blog?tag=${tag}`, lang)}
            className="border-border text-accent hover:border-accent rounded-md border px-2 py-0.5 font-mono text-xs transition-colors"
          >
            #{tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function ArticleCard({
  article,
  lang = DEFAULT_LANG,
  showImage = true,
}: {
  article: ArticleCardData;
  lang?: Lang;
  showImage?: boolean;
}) {
  if (!article.slug) return null;
  const href = localizePath(`/blog/${article.slug}`, lang);
  return (
    <article
      lang={article.language !== lang ? article.language : undefined}
      className="group border-border bg-surface hover:border-accent/60 flex flex-col overflow-hidden rounded-2xl border transition-colors"
    >
      {showImage ? (
        <Link href={href} tabIndex={-1} aria-hidden="true" className="border-border overflow-hidden border-b">
          <SanityImage
            image={article.coverImage}
            width={640}
            height={336}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="transition duration-300 group-hover:scale-[1.03]"
          />
        </Link>
      ) : null}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {article.categories?.length ? (
          <p className="text-accent font-mono text-xs tracking-wider uppercase">
            {article.categories.map((category) => category.title).join(' / ')}
          </p>
        ) : null}
        <h3 className="text-headline text-lg leading-snug font-bold">
          <Link href={href} className="hover:text-accent transition-colors">
            {article.title}
          </Link>
        </h3>
        {article.excerpt ? <p className="line-clamp-3 text-sm leading-6">{article.excerpt}</p> : null}
        <div className="mt-auto flex flex-col gap-3 pt-2">
          <TagList tags={article.tags} lang={lang} />
          <ArticleMeta article={article} lang={lang} />
        </div>
      </div>
    </article>
  );
}
