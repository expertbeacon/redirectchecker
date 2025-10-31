import { SecurityAnalysis, SecurityHeaders, SecurityIssue, HSTSConfig } from '@/types';

export function analyzeSecurityHeaders(headers: Record<string, string>): SecurityAnalysis {
  const securityHeaders = extractSecurityHeaders(headers);
  const issues: SecurityIssue[] = [];
  const recommendations: string[] = [];

  let score = 50; // Base score

  // HSTS Analysis
  if (securityHeaders.hsts) {
    score += 20;
    if (securityHeaders.hsts.maxAge < 31536000) {
      issues.push({
        severity: 'medium',
        title: 'HSTS max-age too short',
        description: `HSTS max-age is ${securityHeaders.hsts.maxAge} seconds. Recommended minimum is 31536000 (1 year).`,
        recommendation: 'Increase HSTS max-age to at least 31536000 seconds'
      });
      score -= 5;
    }
    if (!securityHeaders.hsts.includeSubDomains) {
      recommendations.push('Consider adding includeSubDomains to HSTS header');
    }
  } else {
    issues.push({
      severity: 'high',
      title: 'Missing HSTS header',
      description: 'Strict-Transport-Security header is not set, leaving the site vulnerable to SSL stripping attacks.',
      recommendation: 'Add Strict-Transport-Security: max-age=31536000; includeSubDomains; preload'
    });
    score -= 20;
  }

  // CSP Analysis
  if (securityHeaders.csp) {
    score += 15;
    if (securityHeaders.csp.includes("'unsafe-inline'") || securityHeaders.csp.includes("'unsafe-eval'")) {
      issues.push({
        severity: 'medium',
        title: 'Weak Content Security Policy',
        description: "CSP contains 'unsafe-inline' or 'unsafe-eval', reducing its effectiveness.",
        recommendation: "Remove 'unsafe-inline' and 'unsafe-eval' from CSP, use nonces or hashes instead"
      });
      score -= 5;
    }
  } else {
    recommendations.push('Consider adding Content-Security-Policy header to prevent XSS attacks');
    score -= 10;
  }

  // X-Frame-Options Analysis
  if (securityHeaders.xFrameOptions) {
    score += 10;
  } else {
    issues.push({
      severity: 'medium',
      title: 'Missing X-Frame-Options',
      description: 'X-Frame-Options header is not set, making the site vulnerable to clickjacking.',
      recommendation: 'Add X-Frame-Options: DENY or SAMEORIGIN'
    });
    score -= 10;
  }

  // X-Content-Type-Options Analysis
  if (securityHeaders.xContentTypeOptions) {
    score += 5;
  } else {
    recommendations.push('Add X-Content-Type-Options: nosniff to prevent MIME type sniffing');
    score -= 5;
  }

  // Referrer-Policy Analysis
  if (securityHeaders.referrerPolicy) {
    score += 5;
  } else {
    recommendations.push('Add Referrer-Policy header to control referrer information');
  }

  // Permissions-Policy Analysis
  if (securityHeaders.permissionsPolicy) {
    score += 5;
  }

  // Ensure score is within 0-100
  score = Math.max(0, Math.min(100, score));

  return {
    score,
    headers: securityHeaders,
    issues,
    recommendations
  };
}

function extractSecurityHeaders(headers: Record<string, string>): SecurityHeaders {
  const securityHeaders: SecurityHeaders = {};

  // Extract HSTS
  const hsts = headers['strict-transport-security'];
  if (hsts) {
    securityHeaders.hsts = parseHSTS(hsts);
  }

  // Extract CSP
  const csp = headers['content-security-policy'];
  if (csp) {
    securityHeaders.csp = csp;
  }

  // Extract X-Frame-Options
  const xFrameOptions = headers['x-frame-options'];
  if (xFrameOptions) {
    securityHeaders.xFrameOptions = xFrameOptions;
  }

  // Extract X-Content-Type-Options
  const xContentTypeOptions = headers['x-content-type-options'];
  if (xContentTypeOptions && xContentTypeOptions.toLowerCase() === 'nosniff') {
    securityHeaders.xContentTypeOptions = true;
  }

  // Extract Referrer-Policy
  const referrerPolicy = headers['referrer-policy'];
  if (referrerPolicy) {
    securityHeaders.referrerPolicy = referrerPolicy;
  }

  // Extract Permissions-Policy
  const permissionsPolicy = headers['permissions-policy'];
  if (permissionsPolicy) {
    securityHeaders.permissionsPolicy = permissionsPolicy;
  }

  // Extract Expect-CT
  const expectCT = headers['expect-ct'];
  if (expectCT) {
    securityHeaders.expectCT = expectCT;
  }

  return securityHeaders;
}

function parseHSTS(hstsHeader: string): HSTSConfig {
  const config: HSTSConfig = {
    maxAge: 0,
    includeSubDomains: false,
    preload: false
  };

  const directives = hstsHeader.split(';').map(d => d.trim());

  for (const directive of directives) {
    if (directive.startsWith('max-age=')) {
      config.maxAge = parseInt(directive.split('=')[1], 10) || 0;
    } else if (directive.toLowerCase() === 'includesubdomains') {
      config.includeSubDomains = true;
    } else if (directive.toLowerCase() === 'preload') {
      config.preload = true;
    }
  }

  return config;
}

export function detectMixedContent(chain: Array<{ url: string }>): boolean {
  let hadHttps = false;

  for (const item of chain) {
    const isHttps = item.url.startsWith('https://');
    if (isHttps) {
      hadHttps = true;
    } else if (hadHttps && item.url.startsWith('http://')) {
      // Found HTTP after HTTPS - mixed content!
      return true;
    }
  }

  return false;
}
