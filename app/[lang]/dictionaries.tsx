import 'server-only';
import type { Locale } from '@/i18n';

const dictionaries = {
   en: () =>
      import('../../dictionaries/en.json').then((module) => module.default),
   np: () =>
      import('../../dictionaries/np.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
   dictionaries[locale]?.() ?? dictionaries.np();
