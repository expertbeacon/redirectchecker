# Technical Design Document

## Context

The Redirect Checker currently provides basic redirect chain analysis with user-agent customization. To compete with and surpass leading redirect analysis tools, we need to add comprehensive HTTP analysis, security assessment, SEO insights, and bulk processing capabilities. The application runs on Cloudflare Pages with edge functions, requiring careful consideration of runtime limitations and performance.

## Goals

- Provide the most comprehensive redirect analysis tool in the market
- Maintain excellent performance (<3s for single URL checks, <30s for bulk batches)
- Deliver actionable SEO and security insights
- Ensure scalability and abuse prevention
- Maintain backward compatibility with existing API
- Optimize for Core Web Vitals and SEO ranking

## Non-Goals

- Real-time monitoring or scheduled checks (future feature)
- Authentication system for saved history (future feature)
- Custom user dashboard (future feature)
- Integration with third-party SEO tools (future feature)

## Decisions

### 1. Response Data Structure

**Decision**: Extend existing `ResponseInfo` type with nested objects for headers, SSL, SEO, and security data.

```typescript
interface EnhancedResponseInfo extends ResponseInfo {
  headers: Record<string, string>;
  ssl?: SSLInfo;
  seo: SEOAnalysis;
  security: SecurityAnalysis;
  timing: TimingBreakdown;
  server?: ServerInfo;
}

interface SSLInfo {
  valid: boolean;
  issuer: string;
  expiryDate: string;
  daysUntilExpiry: number;
  protocol: string;
  cipher?: string;
}

interface SEOAnalysis {
  canonical?: string;
  robotsTag?: string;
  metaRobots?: string;
  hreflang?: string[];
  sitemap?: boolean;
  recommendations: string[];
  impactScore: number; // 0-100
}

interface SecurityAnalysis {
  score: number; // 0-100
  headers: {
    hsts?: boolean;
    csp?: string;
    xFrameOptions?: string;
    xContentTypeOptions?: boolean;
    referrerPolicy?: string;
  };
  recommendations: string[];
  issues: SecurityIssue[];
}

interface TimingBreakdown {
  dns?: number;
  tcp?: number;
  tls?: number;
  ttfb: number;
  total: number;
}
```

**Alternatives Considered**:
- Flat structure: Rejected due to poor organization and naming conflicts
- Separate API endpoints: Rejected to minimize API calls and improve performance

### 2. SSL Certificate Validation

**Decision**: Use Cloudflare's built-in certificate information where available, fallback to parsing connection details.

**Rationale**: Edge runtime limitations prevent direct SSL socket inspection. Cloudflare Workers provide certificate information via `request.cf` object.

**Implementation**:
```typescript
const sslInfo = request.cf?.tlsClientAuth || extractFromResponse(response);
```

**Alternatives Considered**:
- External SSL API: Rejected due to added latency and dependency
- Skip SSL validation: Rejected as it's a critical feature for security analysis

### 3. JavaScript Redirect Detection

**Decision**: Parse HTML response body for common JavaScript redirect patterns using regex.

**Patterns to Detect**:
```javascript
- window.location = "url"
- window.location.href = "url"
- window.location.replace("url")
- location.href = "url"
- document.location = "url"
```

**Rationale**: Full JavaScript execution requires browser environment. Pattern matching covers 95%+ of real-world cases.

**Alternatives Considered**:
- Headless browser (Puppeteer): Rejected due to edge runtime limitations and performance cost
- External service: Rejected due to added latency and cost

### 4. Bulk Processing Architecture

**Decision**: Implement serverless queue-based processing with progressive result streaming.

**Architecture**:
```
Client Upload → API Endpoint → Job Queue (Durable Objects) → Worker Pool → Stream Results
```

**Flow**:
1. Client uploads URLs (max 100 per batch)
2. API creates job and returns job ID
3. Durable Object processes URLs concurrently (5 at a time)
4. Results stream back via Server-Sent Events (SSE)
5. Client displays results progressively

**Rationale**: Balances performance, cost, and user experience. SSE provides real-time feedback.

**Alternatives Considered**:
- Synchronous processing: Rejected due to timeout limits (30s on Cloudflare)
- Polling: Rejected as less efficient than SSE
- WebSockets: Considered but SSE simpler for one-way streaming

### 5. Export Functionality

**Decision**: Generate exports server-side with streaming for large datasets.

**Formats**:
- CSV: Flattened data structure, all metrics as columns
- JSON: Complete data structure preservation
- PDF: Future feature using external service (e.g., Cloudflare Browser Rendering API)

**Implementation**:
```typescript
// CSV streaming for large datasets
return new Response(generateCSVStream(results), {
  headers: {
    'Content-Type': 'text/csv',
    'Content-Disposition': 'attachment; filename="redirect-analysis.csv"'
  }
});
```

**Alternatives Considered**:
- Client-side generation: Rejected for large datasets due to memory constraints
- External service: Rejected to minimize dependencies

### 6. Caching Strategy

**Decision**: Implement Cloudflare KV-based caching with 5-minute TTL.

**Cache Key**: `url:${url}:ua:${userAgent}`

**Rationale**: Balances freshness with performance. Many users check same popular URLs.

**Implementation**:
```typescript
const cacheKey = `check:${hashURL(url)}:${hashUA(userAgent)}`;
const cached = await env.REDIRECT_CACHE.get(cacheKey, { type: 'json' });
if (cached && Date.now() - cached.timestamp < 300000) {
  return cached.data;
}
// Perform check...
await env.REDIRECT_CACHE.put(cacheKey, JSON.stringify({
  timestamp: Date.now(),
  data: results
}), { expirationTtl: 300 });
```

**Alternatives Considered**:
- No caching: Rejected due to performance and cost implications
- Longer TTL: Rejected as redirects can change frequently
- Cache API: Considered but KV provides better control

### 7. Rate Limiting

**Decision**: Implement per-IP rate limiting using Durable Objects.

**Limits**:
- Anonymous: 20 requests/minute, 200 requests/hour
- Bulk: 5 batches/hour, max 100 URLs per batch

**Implementation**:
```typescript
const rateLimiter = env.RATE_LIMITER.get(id);
const allowed = await rateLimiter.checkLimit(ip);
if (!allowed) {
  return new Response('Rate limit exceeded', { status: 429 });
}
```

**Alternatives Considered**:
- KV-based: Rejected due to eventual consistency issues
- No limits: Rejected due to abuse potential

### 8. Visual Redirect Chain

**Decision**: Use React Flow library for interactive redirect chain diagram.

**Rationale**: Provides professional visualization with minimal custom code. Supports zoom, pan, and interactive elements.

**Implementation**:
- Nodes represent URLs
- Edges represent redirects (labeled with status codes)
- Color coding for status types (green=200, yellow=3xx, red=4xx/5xx)
- Timing displayed on edges

**Alternatives Considered**:
- Custom SVG: Rejected due to development time
- Mermaid.js: Rejected as less interactive
- D3.js: Considered but React Flow better suited for this use case

### 9. SEO Analysis Algorithm

**Decision**: Rule-based scoring system with weighted factors.

**Factors**:
- Redirect chain length (1 hop = 100, 2 hops = 85, 3+ hops = 50)
- Status code appropriateness (301 permanent = 100, 302 temporary = 80)
- Security headers presence (+10 for HSTS, +5 for others)
- Canonical tag consistency (+10)
- Meta robots conflicts (-20)

**Rationale**: Simple, explainable, and actionable. Aligns with Google's documented best practices.

**Alternatives Considered**:
- ML-based scoring: Rejected due to complexity and interpretability
- External API (e.g., Lighthouse): Rejected due to latency

### 10. UI/UX Design

**Decision**: Tab-based interface for different analysis sections with collapsible details.

**Sections**:
1. Overview (redirect chain, status)
2. Headers (all HTTP headers)
3. Security (security analysis)
4. SEO (SEO insights)
5. Performance (timing metrics)

**Rationale**: Organizes complex information without overwhelming users. Progressive disclosure principle.

**Alternatives Considered**:
- Single scrolling page: Rejected as too long for comprehensive data
- Separate pages: Rejected as requires more clicks

## Risks / Trade-offs

### Risk: Edge Runtime Limitations
**Impact**: Cannot use native Node.js modules for SSL inspection or PDF generation.
**Mitigation**: Use Web APIs and Cloudflare-specific features. Consider external services for PDF.

### Risk: Performance Degradation
**Impact**: Adding comprehensive analysis could slow response times.
**Mitigation**:
- Parallel processing where possible
- Caching strategy
- Progressive result streaming
- Timeout safeguards (max 25s per URL)

### Risk: Rate Limiting Too Strict
**Impact**: Legitimate users might hit limits.
**Mitigation**:
- Monitor usage patterns
- Provide clear error messages
- Consider authentication for higher limits (future)

### Risk: Abuse and Cost
**Impact**: Bulk processing could be abused, increasing Cloudflare costs.
**Mitigation**:
- Strict rate limits
- Maximum batch size (100 URLs)
- Monitor costs and adjust limits

### Trade-off: Feature Completeness vs. Simplicity
**Decision**: Prioritize comprehensive features with good UX.
**Rationale**: Target audience (SEO professionals, developers) values thoroughness. Simple tools exist already.

### Trade-off: Server-side vs. Client-side Processing
**Decision**: Server-side for core analysis, client-side for visualization.
**Rationale**: Server has access to APIs and better performance; client handles presentation.

## Migration Plan

### Phase 1: Backend Enhancements (Week 1-2)
1. Extend API types and response structure
2. Implement header analysis and SSL validation
3. Add security and SEO analyzers
4. Deploy with backward compatibility flag

### Phase 2: UI Updates (Week 2-3)
1. Create new analysis components
2. Implement tab-based interface
3. Add visual chain diagram
4. Deploy UI updates

### Phase 3: Bulk Processing (Week 3-4)
1. Implement bulk API endpoint
2. Create bulk processing UI
3. Add export functionality
4. Test with load testing

### Phase 4: SEO & Polish (Week 4-5)
1. Add structured data
2. Optimize meta tags
3. Implement sitemap
4. Performance optimization
5. Documentation updates

### Rollback Strategy
- Feature flags for new capabilities
- Backward compatible API ensures old clients work
- Database-free design allows instant rollback

## Open Questions

1. Should we implement user accounts for history tracking?
   - **Decision**: Not in initial release. Evaluate based on user feedback.

2. What's the optimal cache TTL?
   - **Decision**: Start with 5 minutes, monitor cache hit rate and adjust.

3. Should we offer a paid tier with higher limits?
   - **Decision**: Launch as free, evaluate monetization post-launch.

4. Which PDF generation service to use?
   - **Decision**: Defer PDF feature to phase 2, evaluate Cloudflare Browser Rendering API.

5. Should we support custom user-agent strings?
   - **Decision**: Yes, add in phase 2 as "Advanced Mode".
