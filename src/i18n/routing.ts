import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['ar', 'en'],
  defaultLocale: 'ar',
  // Always force Arabic as the landing locale — never auto-translate to English
  // based on the browser's Accept-Language header.
  localeDetection: false,
});
