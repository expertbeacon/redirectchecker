import { ServerInfo, TimingBreakdown } from '@/types';

export function normalizeHeaders(headers: Headers): Record<string, string> {
  const normalized: Record<string, string> = {};

  headers.forEach((value, key) => {
    normalized[key.toLowerCase()] = value;
  });

  return normalized;
}

export function detectServer(headers: Record<string, string>): ServerInfo | undefined {
  const server = headers['server'];
  const poweredBy = headers['x-powered-by'];
  const technology: string[] = [];

  if (!server && !poweredBy) {
    return undefined;
  }

  let name: string | undefined;
  let version: string | undefined;

  if (server) {
    // Parse server header like "nginx/1.21.0" or "Apache/2.4.41"
    const match = server.match(/^([^\s\/]+)(?:\/([^\s]+))?/);
    if (match) {
      name = match[1];
      version = match[2];
    }
  }

  // Detect technologies from headers
  if (poweredBy) {
    technology.push(poweredBy);
  }

  if (headers['x-aspnet-version']) {
    technology.push('ASP.NET ' + headers['x-aspnet-version']);
  }

  if (headers['x-drupal-cache']) {
    technology.push('Drupal');
  }

  if (headers['x-nextjs-cache']) {
    technology.push('Next.js');
  }

  return {
    name,
    version,
    technology: technology.length > 0 ? technology : undefined,
    poweredBy
  };
}

export function detectCompression(headers: Record<string, string>): string | undefined {
  const contentEncoding = headers['content-encoding'];
  return contentEncoding || undefined;
}

export function parseContentLength(headers: Record<string, string>): number | undefined {
  const contentLength = headers['content-length'];
  return contentLength ? parseInt(contentLength, 10) : undefined;
}

export function createTimingBreakdown(startTime: number, endTime: number): TimingBreakdown {
  const total = endTime - startTime;

  return {
    ttfb: total, // In edge environment, we can't separate these easily
    total
  };
}

export function detectJavaScriptRedirect(html: string): string | null {
  // Patterns to detect JavaScript redirects
  const patterns = [
    /window\.location\s*=\s*["']([^"']+)["']/i,
    /window\.location\.href\s*=\s*["']([^"']+)["']/i,
    /window\.location\.replace\s*\(\s*["']([^"']+)["']\s*\)/i,
    /location\.href\s*=\s*["']([^"']+)["']/i,
    /location\.replace\s*\(\s*["']([^"']+)["']\s*\)/i,
    /document\.location\s*=\s*["']([^"']+)["']/i,
    /document\.location\.href\s*=\s*["']([^"']+)["']/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

export function extractMetaRefreshUrl(html: string): { url: string; delay: number } | null {
  // Match meta refresh with various formats
  const patterns = [
    /<meta[^>]*http-equiv=["']refresh["'][^>]*content=["'](\d+)\s*;\s*url=([^"']+)["']/i,
    /<meta[^>]*content=["'](\d+)\s*;\s*url=([^"']+)["'][^>]*http-equiv=["']refresh["']/i
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      return {
        delay: parseInt(match[1], 10),
        url: match[2]
      };
    }
  }

  return null;
}
