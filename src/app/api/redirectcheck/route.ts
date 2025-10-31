import { ResponseInfo, RedirectType } from '@/types';
import type { NextRequest } from 'next/server';
import z from 'zod';
import { normalizeHeaders, detectServer, detectCompression, parseContentLength, createTimingBreakdown, detectJavaScriptRedirect, extractMetaRefreshUrl } from '@/lib/header-utils';
import { extractSSLInfo } from '@/lib/ssl-validator';
import { analyzeSecurityHeaders, detectMixedContent } from '@/lib/security-analyzer';
import { analyzeSEO } from '@/lib/seo-analyzer';

export const runtime = 'edge'; // Specifies that this function will run in a serverless edge environment

// Define a schema for the request body using Zod for validation
const BodySchema = z.object({
  url: z.string().url(), // 'url' must be a valid URL string
  headers: z.record(z.string()).optional(), // 'headers' is an optional object with string keys and string values
  includeBody: z.boolean().optional().default(true) // Whether to parse response bodies
});

/**
 * Fetches a URL and returns detailed information about the response.
 *
 * @param {Object} param0 - An object containing the URL to fetch and optional headers.
 * @param {string} param0.url - The URL to fetch.
 * @param {Headers} [param0.headers] - Optional headers to include in the request.
 * @param {boolean} [param0.includeBody] - Whether to parse response body for analysis.
 * @param {NextRequest} [param0.request] - Original request for SSL info extraction.
 * @returns {Promise<ResponseInfo>} - A promise that resolves to an object containing response information.
 */
const fetchUrl = async ({
  url,
  headers,
  includeBody = true,
  request,
  isLastInChain = false
}: {
  url: string;
  headers?: Headers;
  includeBody?: boolean;
  request?: NextRequest;
  isLastInChain?: boolean;
}): Promise<ResponseInfo> => {
  const startTime = Date.now(); // Record the start time for calculating the request duration
  const newUrl = new URL(url); // Create a URL object to extract the host
  let metaRefresh = false;
  let redirectType: RedirectType = 'none';

  // Perform the fetch request with optional headers and no automatic redirection
  const response = await fetch(url, {
    method: "GET",
    redirect: "manual", // Do not follow redirects automatically
    headers
  });

  const endTime = Date.now();

  // Calculate the duration of the fetch request
  const duration = ((Date.now() - startTime) / 1000).toFixed(3);

  // Capture all response headers
  const allHeaders = normalizeHeaders(response.headers);

  let location: string | null = null;
  let body: string | undefined;

  if ([301, 302, 303, 307, 308].includes(response.status)) {
    location = response.headers.get('location'); // Get the 'location' header if a redirect is indicated
    redirectType = 'http';
  } else if (includeBody) {
    body = await response.text();

    // Check for meta refresh
    const metaRefreshData = extractMetaRefreshUrl(body);
    if (metaRefreshData) {
      location = metaRefreshData.url;
      metaRefresh = true;
      redirectType = 'meta-refresh';
    } else {
      // Check for JavaScript redirect
      const jsRedirect = detectJavaScriptRedirect(body);
      if (jsRedirect) {
        location = jsRedirect;
        redirectType = 'javascript';
      }
    }
  }

  // Extract server information
  const server = detectServer(allHeaders);

  // Extract SSL information for HTTPS URLs
  const ssl = extractSSLInfo(url, request);

  // Detect compression
  const compression = detectCompression(allHeaders);

  // Get body size
  const bodySize = parseContentLength(allHeaders);

  // Create timing breakdown
  const timing = createTimingBreakdown(startTime, endTime);

  // Build base response
  const responseInfo: ResponseInfo = {
    url: url,
    host: newUrl.host,
    status: response.status,
    statusText: response.statusText,
    duration: `${duration} s`,
    metaRefresh,
    location,
    headers: allHeaders,
    ssl,
    server,
    timing,
    redirectType,
    bodySize,
    compression
  };

  // Only perform deep analysis on the final destination (200 responses)
  if (isLastInChain && response.status === 200 && body) {
    // Analyze security headers
    responseInfo.security = analyzeSecurityHeaders(allHeaders);

    // Note: SEO analysis will be done at chain level
  }

  return responseInfo;
};

/**
 * Handles POST requests by accepting JSON data, validating it, and performing a fetch operation.
 *
 * The request body should contain a JSON object with the following structure:
 * {
 *   url: string; // The URL to fetch
 *   headers?: Record<string, string> // Optional headers to include in the request
 *   includeBody?: boolean // Whether to parse response bodies (default: true)
 * }
 *
 * The function will handle redirects up to 10 times, returning an array of response information objects.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<Response>} - A promise that resolves to a response containing the fetch results as JSON.
 */
export async function POST(request: NextRequest) {
  let url: string;
  let headers: Headers | undefined;
  let includeBody: boolean;

  try {
    // Parse and validate the request body using the Zod schema
    const jsonData = await request.json();
    const parsed = BodySchema.parse(jsonData);
    url = parsed.url;
    headers = parsed.headers as Headers | undefined;
    includeBody = parsed.includeBody ?? true;
  } catch (error: any) {
    // If validation fails, return a 400 Bad Request response with an error message
    return new Response(JSON.stringify({ error: { message: error.message } }, null, 2), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  let process = true; // Flag to control the loop for handling redirects
  let data: ResponseInfo[] = []; // Array to store response details
  const visitedUrls = new Set<string>(); // Track visited URLs to detect loops

  // Initialize headers, merging any provided headers with the original request headers
  headers = new Headers(headers || request.headers);
  headers.delete('Content-Length'); // Remove 'Content-Length' header to avoid potential issues

  const maxTry = 10; // Maximum number of redirects to follow
  let i = 0;

  // Loop to handle possible redirects
  while (process && i < maxTry) {
    try {
      // Check for redirect loop
      if (visitedUrls.has(url)) {
        data.push({
          url,
          host: new URL(url).host,
          status: 0,
          statusText: "Redirect loop detected",
          duration: "N/A",
          metaRefresh: false,
          location: null,
          redirectType: 'none'
        });
        process = false;
        break;
      }

      visitedUrls.add(url);

      const isLastInChain = i === maxTry - 1; // Flag to indicate if this might be the last request
      const responseInfo = await fetchUrl({
        url,
        headers,
        includeBody,
        request,
        isLastInChain: !process || !data.some(d => d.location) // Will be last if no more redirects
      });

      data.push(responseInfo); // Store the response information

      if (responseInfo.location) {
        // Handle relative URLs
        const baseUrl = new URL(url);
        url = new URL(responseInfo.location, baseUrl).href;
      } else {
        // This is the final destination
        process = false;

        // Perform comprehensive analysis on final destination
        if (responseInfo.status === 200) {
          // Analyze SEO for the entire chain
          const lastResponse = {
            headers: responseInfo.headers || {},
            body: undefined, // Body already analyzed in fetchUrl
            status: responseInfo.status
          };

          // Add SEO analysis to the last item
          responseInfo.seo = analyzeSEO(lastResponse, data);

          // Check for mixed content in the chain
          if (detectMixedContent(data)) {
            if (responseInfo.security) {
              responseInfo.security.mixedContent = true;
              responseInfo.security.issues.push({
                severity: 'high',
                title: 'Mixed Content Detected',
                description: 'The redirect chain includes both HTTPS and HTTP URLs, which can expose users to security risks.',
                recommendation: 'Ensure all URLs in the redirect chain use HTTPS'
              });
              responseInfo.security.score = Math.max(0, responseInfo.security.score - 15);
            }
          }
        }
      }

      i++; // Increment the counter for the number of redirects handled
    } catch (error) {
      // Handle fetch errors and stop further processing
      console.error(error);
      data.push({
        url,
        host: new URL(url).host,
        status: 0,
        statusText: "Fetch failed",
        duration: "N/A",
        metaRefresh: false,
        location: null,
        redirectType: 'none'
      });
      process = false; // Stop the loop on error
    }
  }

  // Return the collected response information as JSON
  return new Response(JSON.stringify(data, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
