
import { appConfig, type LocaleType } from "@/config";
import getRequestConfig from "@/i18n";
import { cn, createAlternates } from "@/lib/utils";
import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { JetBrains_Mono as FontMono } from "next/font/google";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import Script from "next/script";
import "./globals.css";
export const runtime = 'edge';

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export async function generateMetadata(locale: LocaleType): Promise<Metadata> { 
  const t = await getTranslations(locale); 
  const headersList = headers();
  return {
    title: {
      absolute: t('frontend.meta.default.title'),
      default: t('frontend.meta.default.title'),
      template: `%s - ${appConfig.appRootDomain}`,
    },
    description: t('frontend.meta.default.description'),
    alternates: createAlternates({ headers: headersList })
  };
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
 
  const { locale } = params as { locale: LocaleType };

  if (!appConfig.i18n.locales.includes(locale)) {
    notFound();
  }
  const { messages } = await getRequestConfig({locale});

  // Organization and Website structured data
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Redirect Checker",
    "url": `https://${appConfig.appRootDomain}`,
    "logo": `https://${appConfig.appRootDomain}/logo.png`,
    "description": "Professional redirect analysis tool for webmasters, SEO experts, and developers",
    "sameAs": []
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Redirect Checker",
    "url": `https://${appConfig.appRootDomain}`,
    "description": "Free online tool to check URL redirects, analyze redirect chains, and optimize your website's SEO performance",
    "inLanguage": appConfig.i18n.locales,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `https://${appConfig.appRootDomain}/?url={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <head>
        <Script
          id="structured-data-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
        />
        <Script
          id="structured-data-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
        />
      </head>
     <body
        className={cn(
          "min-h-screen bg-background font-mono antialiased",
          fontMono.variable
        )}
      >
        <NextTopLoader color="var(--colors-primary)" />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
          {children}
          </ThemeProvider>
        </NextIntlClientProvider>
        {appConfig.gaId && <GoogleAnalytics gaId={appConfig.gaId} />}
      </body>
    </html>
  );
}
