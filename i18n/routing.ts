import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: [ 'zh-TW', 'ja', 'en' ],
  defaultLocale: 'en',
});

export type Locale = typeof routing.locales[number];
