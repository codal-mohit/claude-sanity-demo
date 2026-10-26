import type { Lang } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionary';

// Shown when a detail page falls back to English because the requested translation is missing.
export function TranslationNotice({ lang, contentLang }: { lang: Lang; contentLang: string | null | undefined }) {
  if (!contentLang || contentLang === lang) return null;
  return (
    <p role="status" className="border-border bg-surface text-headline mb-8 rounded-xl border px-4 py-3 font-mono text-xs">
      {getDictionary(lang).notTranslated}
    </p>
  );
}
