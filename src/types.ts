export type ResponseInfo = {
  url: string;
  host: string,
  status: number;
  statusText: string;
  duration: string;
  location: string | null;
  metaRefresh: boolean;
  // Extended fields
  headers?: Record<string, string>;
  ssl?: SSLInfo;
  seo?: SEOAnalysis;
  security?: SecurityAnalysis;
  timing?: TimingBreakdown;
  server?: ServerInfo;
  redirectType?: RedirectType;
  bodySize?: number;
  compression?: string;
}

export type RedirectType = 'http' | 'meta-refresh' | 'javascript' | 'none';

export interface SSLInfo {
  valid: boolean;
  issuer: string;
  expiryDate: string;
  daysUntilExpiry: number;
  protocol: string;
  cipher?: string;
  subject?: string;
}

export interface SEOAnalysis {
  canonical?: string;
  robotsTag?: string;
  metaRobots?: string;
  hreflang?: HreflangLink[];
  sitemap?: boolean;
  recommendations: string[];
  impactScore: number; // 0-100
  hasStructuredData?: boolean;
  title?: string;
  metaDescription?: string;
  h1?: string;
}

export interface HreflangLink {
  lang: string;
  url: string;
}

export interface SecurityAnalysis {
  score: number; // 0-100
  headers: SecurityHeaders;
  recommendations: string[];
  issues: SecurityIssue[];
  mixedContent?: boolean;
}

export interface SecurityHeaders {
  hsts?: HSTSConfig;
  csp?: string;
  xFrameOptions?: string;
  xContentTypeOptions?: boolean;
  referrerPolicy?: string;
  permissionsPolicy?: string;
  expectCT?: string;
}

export interface HSTSConfig {
  maxAge: number;
  includeSubDomains: boolean;
  preload: boolean;
}

export interface SecurityIssue {
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  recommendation: string;
}

export interface TimingBreakdown {
  dns?: number;
  tcp?: number;
  tls?: number;
  ttfb: number;
  download?: number;
  total: number;
}

export interface ServerInfo {
  name?: string;
  version?: string;
  technology?: string[];
  poweredBy?: string;
}

export type SelectOptionType = {
  label: string;
  value: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}
export const browsers = ["chrome", "edge", "firefox", "safari"] as const;
export const devices = ["desktop", "mobile"] as const;
export const desktopOperatingSystems = ["macos", "windows", "linux"] as const;
export const mobileOperatingSystems = ["ios", "android"] as const;
export const operatingSystems = ["windows", "macos", "linux", "android", "ios"] as const;
export type Device = typeof devices[number];
export type Browser = typeof browsers[number];
export type OperatingSystem = typeof operatingSystems[number];
export type DesktopOperatingSystem = typeof desktopOperatingSystems[number];
export type MobileOperatingSystem = typeof mobileOperatingSystems[number];
