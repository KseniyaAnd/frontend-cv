import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

const NAMESPACES = ['auth', 'common'] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = routing.locales.includes(requested as 'en' | 'ru')
    ? (requested as 'en' | 'ru')
    : routing.defaultLocale;

  const loaded = await Promise.all(
    NAMESPACES.map(async (ns) => [ns, (await import(`../messages/${locale}/${ns}.json`)).default]),
  );

  return {
    locale,
    messages: Object.fromEntries(loaded),
  };
});
