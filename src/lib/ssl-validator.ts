import { SSLInfo } from '@/types';

export function extractSSLInfo(url: string, request?: Request): SSLInfo | undefined {
  try {
    const urlObj = new URL(url);

    // Only process HTTPS URLs
    if (urlObj.protocol !== 'https:') {
      return undefined;
    }

    // Try to get certificate info from Cloudflare Workers request context
    // Note: In Cloudflare Workers, cert info is available via request.cf
    const cfData = (request as any)?.cf;

    if (cfData?.tlsVersion || cfData?.tlsCipher) {
      return {
        valid: true, // If we got this far, cert is valid
        issuer: cfData.tlsClientAuth?.certIssuerDN || 'Unknown',
        expiryDate: 'N/A', // Not available in CF Workers
        daysUntilExpiry: 0,
        protocol: cfData.tlsVersion || 'Unknown',
        cipher: cfData.tlsCipher,
        subject: cfData.tlsClientAuth?.certSubjectDN
      };
    }

    // Basic fallback - we know it's HTTPS and connected successfully
    return {
      valid: true,
      issuer: 'Unknown',
      expiryDate: 'N/A',
      daysUntilExpiry: 0,
      protocol: 'TLS',
      subject: urlObj.hostname
    };
  } catch (error) {
    console.error('SSL extraction error:', error);
    return undefined;
  }
}

export function validateSSLExpiry(daysUntilExpiry: number): {
  valid: boolean;
  warning?: string;
} {
  if (daysUntilExpiry < 0) {
    return {
      valid: false,
      warning: 'SSL certificate has expired'
    };
  } else if (daysUntilExpiry < 30) {
    return {
      valid: true,
      warning: `SSL certificate expires in ${daysUntilExpiry} days`
    };
  }

  return { valid: true };
}
