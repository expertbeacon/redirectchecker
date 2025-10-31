import { SEOAnalysis, HreflangLink, ResponseInfo } from '@/types';

export function analyzeSEO(
  response: { headers: Record<string, string>; body?: string; status: number },
  chain: ResponseInfo[]
): SEOAnalysis {
  const recommendations: string[] = [];
  let impactScore = 100;

  // Parse HTML if available
  const canonical = extractCanonical(response.headers, response.body);
  const robotsTag = response.headers['x-robots-tag'];
  const metaRobots = extractMetaRobots(response.body);
  const hreflang = extractHreflang(response.body);
  const hasStructuredData = detectStructuredData(response.body);
  const title = extractTitle(response.body);
  const metaDescription = extractMetaDescription(response.body);
  const h1 = extractH1(response.body);

  // Analyze redirect chain impact
  const redirectCount = chain.length - 1;

  if (redirectCount === 0) {
    // No redirects - perfect
    impactScore = 100;
  } else if (redirectCount === 1) {
    const redirect = chain[0];
    if (redirect.status === 301) {
      impactScore = 95; // Slight equity loss with 301
    } else if (redirect.status === 302) {
      impactScore = 80;
      recommendations.push('Use 301 (permanent) redirect instead of 302 (temporary) for better SEO');
    } else {
      impactScore = 85;
    }
  } else if (redirectCount === 2) {
    impactScore = 70;
    recommendations.push('Reduce redirect chain to a single hop for better SEO and performance');
  } else {
    impactScore = 50;
    recommendations.push('Critical: Multiple redirects detected. Consolidate to single redirect for optimal SEO');
  }

  // Check for redirect type issues
  for (const item of chain) {
    if (item.metaRefresh) {
      impactScore -= 10;
      recommendations.push('Meta refresh redirects are slower and less SEO-friendly than HTTP redirects');
    }
    if (item.redirectType === 'javascript') {
      impactScore -= 15;
      recommendations.push('JavaScript redirects may not be followed by all search engine crawlers');
    }
  }

  // Canonical analysis
  if (canonical && chain.length > 0) {
    const finalUrl = chain[chain.length - 1].url;
    if (canonical !== finalUrl && !canonical.startsWith(new URL(finalUrl).origin)) {
      recommendations.push('Canonical URL points to different domain - verify this is intentional');
    }
  }

  // Robots directives
  if (robotsTag?.includes('noindex') || metaRobots?.includes('noindex')) {
    impactScore = 0;
    recommendations.push('Warning: Page has noindex directive and will not be indexed by search engines');
  }

  if (robotsTag?.includes('nofollow') || metaRobots?.includes('nofollow')) {
    recommendations.push('Page has nofollow directive - links will not pass authority');
  }

  // Structured data
  if (!hasStructuredData) {
    recommendations.push('Consider adding structured data (JSON-LD) for rich snippets in search results');
  }

  // Meta tags
  if (!title || title.length < 10) {
    recommendations.push('Add descriptive title tag (50-60 characters recommended)');
  } else if (title.length > 60) {
    recommendations.push('Title tag is too long - keep it under 60 characters');
  }

  if (!metaDescription || metaDescription.length < 50) {
    recommendations.push('Add meta description (150-160 characters recommended)');
  } else if (metaDescription.length > 160) {
    recommendations.push('Meta description is too long - keep it under 160 characters');
  }

  if (!h1) {
    recommendations.push('Add H1 heading tag for better content structure');
  }

  // Ensure score is within 0-100
  impactScore = Math.max(0, Math.min(100, impactScore));

  return {
    canonical,
    robotsTag,
    metaRobots,
    hreflang: hreflang.length > 0 ? hreflang : undefined,
    hasStructuredData,
    title,
    metaDescription,
    h1,
    recommendations,
    impactScore
  };
}

function extractCanonical(headers: Record<string, string>, body?: string): string | undefined {
  // Check Link header first
  const linkHeader = headers['link'];
  if (linkHeader) {
    const match = linkHeader.match(/<([^>]+)>;\s*rel=["']?canonical["']?/i);
    if (match) {
      return match[1];
    }
  }

  // Check HTML meta tag
  if (body) {
    const match = body.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i) ||
                  body.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i);
    if (match) {
      return match[1];
    }
  }

  return undefined;
}

function extractMetaRobots(body?: string): string | undefined {
  if (!body) return undefined;

  const match = body.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i) ||
                body.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']robots["']/i);

  return match ? match[1] : undefined;
}

function extractHreflang(body?: string): HreflangLink[] {
  if (!body) return [];

  const hreflangLinks: HreflangLink[] = [];
  const regex = /<link[^>]+rel=["']alternate["'][^>]+hreflang=["']([^"']+)["'][^>]+href=["']([^"']+)["']/gi;

  let match;
  while ((match = regex.exec(body)) !== null) {
    hreflangLinks.push({
      lang: match[1],
      url: match[2]
    });
  }

  return hreflangLinks;
}

function detectStructuredData(body?: string): boolean {
  if (!body) return false;

  return body.includes('application/ld+json') ||
         body.includes('itemscope') ||
         body.includes('itemtype');
}

function extractTitle(body?: string): string | undefined {
  if (!body) return undefined;

  const match = body.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match ? match[1].trim() : undefined;
}

function extractMetaDescription(body?: string): string | undefined {
  if (!body) return undefined;

  const match = body.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
                body.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);

  return match ? match[1].trim() : undefined;
}

function extractH1(body?: string): string | undefined {
  if (!body) return undefined;

  const match = body.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  return match ? match[1].trim() : undefined;
}

export function calculateLinkEquity(chain: ResponseInfo[]): number[] {
  const equity: number[] = [];
  let current = 100;

  for (let i = 0; i < chain.length; i++) {
    equity.push(current);

    if (i < chain.length - 1) {
      // Each redirect loses some equity
      if (chain[i].status === 301) {
        current *= 0.99; // 301 passes ~99%
      } else if (chain[i].status === 302) {
        current *= 0.95; // 302 passes ~95%
      } else {
        current *= 0.97; // Other redirects ~97%
      }

      // Meta refresh and JS redirects lose more
      if (chain[i].metaRefresh || chain[i].redirectType === 'javascript') {
        current *= 0.90;
      }
    }
  }

  return equity;
}
