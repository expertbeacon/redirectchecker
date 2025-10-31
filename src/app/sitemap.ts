import { appConfig } from '@/config';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = `https://${appConfig.appRootDomain}`;
  const lastModified = new Date();

  // Generate URLs for all locales with proper alternate references
  const localeUrls = appConfig.i18n.locales.flatMap((locale) => {
    const localePrefix = locale === appConfig.i18n.defaultLocale ? '' : `/${locale}`;

    // Generate alternates for all languages
    const alternates = {
      languages: {} as Record<string, string>
    };

    appConfig.i18n.locales.forEach((altLocale) => {
      const altPrefix = altLocale === appConfig.i18n.defaultLocale ? '' : `/${altLocale}`;
      alternates.languages[altLocale] = `${baseUrl}${altPrefix}`;
    });

    return [
      {
        url: `${baseUrl}${localePrefix}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 1.0,
        alternates,
      },
    ];
  });

  return localeUrls;
}
