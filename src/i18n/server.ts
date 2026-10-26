import { notFound } from 'next/navigation';

import { isLang, type Lang } from './config';

// Narrows the [lang] route param, returning a 404 for unknown locales.
export function assertLang(value: string): Lang {
  if (!isLang(value)) notFound();
  return value;
}
