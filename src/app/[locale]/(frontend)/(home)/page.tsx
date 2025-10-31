
import { MainUltraModern as Main } from "@/components/frontend/page/home/main-ultra-modern";
import { LocaleType } from "@/config";
import { getComponentMarkdown } from "@/i18n";
import { getOrigin } from "@/lib/utils";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import Script from "next/script";

export const runtime = 'edge';

export async function generateMetadata({
  params
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale: params.locale });
  const headersList = headers();
  const origin = getOrigin({ headers: headersList });

  return {
    title: "Free Redirect Checker - Analyze URL Redirects, SEO & Security",
    description: "Advanced redirect checker tool to analyze URL redirect chains, HTTP headers, SSL certificates, SEO impact, and security headers. Free online tool for webmasters and SEO professionals.",
    keywords: ["redirect checker", "URL redirect", "HTTP redirect", "301 redirect", "302 redirect", "SEO tool", "redirect analyzer", "security headers", "SSL certificate checker"],
    openGraph: {
      title: "Free Redirect Checker - Analyze URL Redirects, SEO & Security",
      description: "Comprehensive redirect analysis tool with SEO insights and security auditing. Check redirect chains, analyze HTTP headers, validate SSL certificates.",
      url: origin,
      siteName: "Redirect Checker",
      locale: params.locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Free Redirect Checker - Analyze URL Redirects",
      description: "Analyze URL redirect chains, SEO impact, and security headers. Professional tool for webmasters and developers.",
    },
    alternates: {
      canonical: origin,
    },
  };
}

export default async function  Home({
  params
}: Readonly<{
  params: { locale: string; };
}>) {
  const headersList = headers();
  const origin = getOrigin({headers: headersList});
  const t = await getTranslations({ locale: params.locale });

  // Load by key: public/data/generated/components-markdown.json
  const markdownContents = {
    block1: await getComponentMarkdown({
      locale: params.locale as LocaleType,
      componentPathName: "home/block1",
      origin
    })
  }

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Redirect Checker",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Advanced redirect checker tool to analyze URL redirect chains, HTTP headers, SSL certificates, SEO impact, and security headers.",
    "url": origin,
    "featureList": [
      "HTTP redirect chain analysis",
      "301, 302, 303, 307, 308 redirect detection",
      "Meta refresh and JavaScript redirect detection",
      "Security header analysis (HSTS, CSP, X-Frame-Options)",
      "SSL/TLS certificate validation",
      "SEO impact assessment",
      "Canonical URL detection",
      "Custom user-agent selection",
      "Mobile vs desktop redirect comparison",
      "Redirect loop detection",
      "Response header analysis",
      "Performance timing metrics"
    ],
    "browserRequirements": "Requires JavaScript enabled",
    "softwareVersion": "2.0",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  // FAQ Structured Data
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": t('frontend.home.faq.qa1.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('frontend.home.faq.qa1.answer')
        }
      },
      {
        "@type": "Question",
        "name": t('frontend.home.faq.qa2.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('frontend.home.faq.qa2.answer')
        }
      },
      {
        "@type": "Question",
        "name": t('frontend.home.faq.qa3.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('frontend.home.faq.qa3.answer')
        }
      },
      {
        "@type": "Question",
        "name": t('frontend.home.faq.qa4.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('frontend.home.faq.qa4.answer')
        }
      },
      {
        "@type": "Question",
        "name": t('frontend.home.faq.qa5.question'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('frontend.home.faq.qa5.answer')
        }
      }
    ]
  };

  return (
    <>
      <Script
        id="structured-data-webapplication"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Script
        id="structured-data-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <div className="px-8 flex">
        <Main markdownContents={markdownContents} />
      </div>
    </>
  );
}
