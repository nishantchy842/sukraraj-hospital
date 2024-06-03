export const i18n = {
   defaultLocale: 'np',
   locales: ['np', 'en'],
} as const;

export type Locale = (typeof i18n)['locales'][number];
