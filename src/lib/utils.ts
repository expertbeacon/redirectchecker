import { appConfig, LocaleType } from "@/config";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getOrigin = ({ headers }: { headers: Headers }) => {
  const host = headers.get('host') || appConfig.appDomain;

  const protocol = ['localhost', '127.0.0.1'].includes(host.split(":")[0]) ? 'http' : 'https';
  return `${protocol}://${host}`;
}

export const getCanonical = ({ headers }: { headers: Headers }) => {
  const origin = getOrigin({ headers });
  const url = new URL(headers.get("x-request-url")!);
  return `${origin}${url.pathname}`;
}

export const createAlternates = ({ headers }: { headers: Headers; }) => {
  const origin = getOrigin({ headers });
  const url = new URL(headers.get("x-request-url")!);
  const pathname = url.pathname;

  // Extract current locale from pathname
  let currentPath = pathname;
  const localeMatch = pathname.match(/^\/([a-z]{2}(?:-[A-Z]{2})?)(\/|$)/);
  if (localeMatch) {
    currentPath = pathname.substring(localeMatch[1].length + 1) || '/';
  }

  // Generate alternates for all locales programmatically
  let languages: Record<string, string> = {};

  appConfig.i18n.locales.forEach((locale) => {
    // For default locale (en), use path without locale prefix when localePrefix is "as-needed"
    if (locale === appConfig.i18n.defaultLocale) {
      languages[locale] = `${origin}${currentPath}`;
    } else {
      languages[locale] = `${origin}/${locale}${currentPath}`;
    }
  });

  // Add x-default pointing to the default locale (English)
  languages['x-default'] = `${origin}${currentPath}`;

  return {
    canonical: getCanonical({ headers }),
    languages
  }
}