# Redirect Analysis Specification

## ADDED Requirements

### Requirement: Comprehensive HTTP Header Capture
The system SHALL capture and display all HTTP response headers for each request in the redirect chain.

#### Scenario: All headers captured
- **WHEN** a redirect check is performed
- **THEN** all response headers are captured (Server, Content-Type, Cache-Control, etc.)
- **AND** headers are displayed in a readable format in the UI

### Requirement: SSL Certificate Validation
The system SHALL extract and validate SSL certificate information for HTTPS URLs.

#### Scenario: Valid SSL certificate
- **WHEN** checking an HTTPS URL with valid SSL
- **THEN** certificate issuer, expiry date, and protocol version are displayed
- **AND** days until expiry is calculated and shown

#### Scenario: Invalid or expired SSL
- **WHEN** checking an HTTPS URL with invalid/expired SSL
- **THEN** a warning is displayed with details of the issue
- **AND** the check continues but flags the security concern

### Requirement: JavaScript Redirect Detection
The system SHALL detect and track JavaScript-based redirects in addition to HTTP redirects.

#### Scenario: JavaScript window.location redirect
- **WHEN** a page contains `window.location = "url"` or similar JS redirect
- **THEN** the redirect is detected and added to the chain
- **AND** it is labeled as "JavaScript Redirect" in results

#### Scenario: Meta refresh with delay
- **WHEN** a page contains `<meta http-equiv="refresh" content="5;url=...">`
- **THEN** the redirect is detected with the delay time shown
- **AND** it is labeled as "Meta Refresh (5s)" in results

### Requirement: Performance Timing Breakdown
The system SHALL provide detailed timing metrics for each request in the redirect chain.

#### Scenario: Timing metrics displayed
- **WHEN** a redirect check completes
- **THEN** timing breakdown includes DNS resolution, TCP connection, TLS handshake, TTFB, and content download times
- **AND** total request time is calculated and displayed

### Requirement: Server and Technology Detection
The system SHALL identify the web server and technologies from response headers.

#### Scenario: Server detection from headers
- **WHEN** response includes Server header
- **THEN** server type and version are identified (e.g., "nginx/1.21.0")
- **AND** technology stack is inferred from headers (e.g., PHP, ASP.NET)

### Requirement: Enhanced Redirect Loop Detection
The system SHALL detect and clearly indicate redirect loops with visualization.

#### Scenario: Redirect loop detected
- **WHEN** a URL redirects back to itself or a previous URL in the chain
- **THEN** the loop is detected and processing stops
- **AND** the loop path is highlighted in the visual diagram
- **AND** a warning message explains the loop with affected URLs

### Requirement: Response Body Analysis
The system SHALL parse response bodies for additional redirect information and meta tags.

#### Scenario: Meta tags extracted
- **WHEN** a 200 response is received
- **THEN** meta tags are parsed for canonical, robots, and other SEO directives
- **AND** JavaScript redirect patterns are detected in scripts
