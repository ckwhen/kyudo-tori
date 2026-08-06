import { defineRouting } from 'next-intl/routing';

export const locales = [ 'zh-tw', 'ja', 'en' ] as const;
export type Locale = typeof routing.locales[number];

export const routing = defineRouting({
  locales: locales,
  defaultLocale: 'en',
});
