import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

const loaders = {
  en: {
    auth: () => import('../messages/en/auth.json'),
    common: () => import('../messages/en/common.json'),
  },
  ru: {
    auth: () => import('../messages/ru/auth.json'),
    common: () => import('../messages/ru/common.json'),
  },
} as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale =
    requested && routing.locales.includes(requested as 'en' | 'ru')
      ? requested
      : routing.defaultLocale;

  const namespaces = loaders[locale as keyof typeof loaders];
  const messages: Record<string, Record<string, string>> = {};

  for (const [name, load] of Object.entries(namespaces)) {
    messages[name] = (await load()).default;
  }

  return { locale, messages };
});
