# SEO Tools Specification

## ADDED Requirements

### Requirement: Canonical URL Detection
The system SHALL detect canonical URLs from both HTTP headers and HTML meta tags.

#### Scenario: Link header canonical
- **WHEN** response includes Link: <url>; rel="canonical" header
- **THEN** the canonical URL is extracted and displayed
- **AND** consistency with requested URL is validated

#### Scenario: HTML meta canonical
- **WHEN** HTML response includes <link rel="canonical" href="url">
- **THEN** the canonical URL is extracted and displayed
- **AND** conflicts with Link header are flagged if both exist

### Requirement: Robots Directive Analysis
The system SHALL detect and analyze robots directives from headers and meta tags.

#### Scenario: X-Robots-Tag header
- **WHEN** response includes X-Robots-Tag header
- **THEN** directives (noindex, nofollow, etc.) are displayed
- **AND** SEO impact is explained

#### Scenario: Meta robots tag
- **WHEN** HTML includes <meta name="robots" content="...">
- **THEN** directives are extracted and displayed
- **AND** conflicts with X-Robots-Tag are flagged

### Requirement: Hreflang Detection
The system SHALL detect hreflang annotations for international SEO.

#### Scenario: Hreflang links found
- **WHEN** HTML includes <link rel="alternate" hreflang="..." href="...">
- **THEN** all hreflang variants are listed
- **AND** language codes and target URLs are displayed

### Requirement: SEO Impact Assessment
The system SHALL assess and score the SEO impact of the redirect chain.

#### Scenario: Optimal redirect chain
- **WHEN** a URL has single 301 redirect to final destination
- **THEN** SEO impact score is 95-100 (excellent)
- **AND** green indicator shows optimal configuration

#### Scenario: Problematic redirect chain
- **WHEN** a URL has 3+ redirects or uses 302 instead of 301
- **THEN** SEO impact score is below 70 (poor)
- **AND** issues are explained with recommendations

### Requirement: Link Equity Flow Visualization
The system SHALL visualize how link equity flows through redirect chains.

#### Scenario: Single redirect equity flow
- **WHEN** there is one 301 redirect
- **THEN** visualization shows ~99% equity passes to final URL
- **AND** minimal equity loss is indicated

#### Scenario: Multi-hop equity loss
- **WHEN** there are 3+ redirects
- **THEN** cumulative equity loss is calculated and shown
- **AND** recommendation to reduce chain length is provided

### Requirement: Redirect Best Practice Validation
The system SHALL validate redirects against SEO best practices and provide recommendations.

#### Scenario: Temporary redirect for permanent change
- **WHEN** a 302 redirect is detected
- **THEN** a recommendation to use 301 for permanent moves is shown
- **AND** the impact on SEO is explained

#### Scenario: Redirect chain optimization
- **WHEN** multi-hop redirect chain is detected
- **THEN** recommendation to create direct redirect is provided
- **AND** expected SEO improvement is estimated

### Requirement: Sitemap Reference Detection
The system SHALL detect references to XML sitemaps in robots.txt and response headers.

#### Scenario: Sitemap in robots.txt
- **WHEN** /robots.txt includes Sitemap: directive
- **THEN** sitemap URL is extracted and validated
- **AND** presence is marked as positive SEO signal

### Requirement: Structured Data Detection
The system SHALL detect presence of structured data (JSON-LD, microdata) in final destination.

#### Scenario: JSON-LD structured data found
- **WHEN** final destination includes <script type="application/ld+json">
- **THEN** presence is indicated
- **AND** schema types are identified (if parseable)
