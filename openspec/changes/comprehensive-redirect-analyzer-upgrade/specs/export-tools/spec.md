# Export Tools Specification

## ADDED Requirements

### Requirement: CSV Export Generation
The system SHALL generate CSV exports of redirect analysis results with all metrics.

#### Scenario: Single URL CSV export
- **WHEN** user exports single URL analysis as CSV
- **THEN** CSV includes columns for URL, status, duration, headers, security score, SEO score
- **AND** redirect chain is represented with multiple rows
- **AND** file is named "redirect-analysis-{domain}-{timestamp}.csv"

#### Scenario: Bulk results CSV export
- **WHEN** user exports bulk analysis results as CSV
- **THEN** CSV includes one row per URL with aggregated metrics
- **AND** nested data (headers, redirects) is formatted appropriately
- **AND** file is named "bulk-redirect-analysis-{timestamp}.csv"

### Requirement: JSON Export Generation
The system SHALL generate JSON exports preserving complete data structure.

#### Scenario: JSON export with full data
- **WHEN** user exports analysis as JSON
- **THEN** complete response structure is included with all nested objects
- **AND** file is properly formatted and indented
- **AND** file is named "redirect-analysis-{domain}-{timestamp}.json"

### Requirement: Copy to Clipboard Functionality
The system SHALL provide copy-to-clipboard buttons for all key data points.

#### Scenario: Copy individual URL
- **WHEN** user clicks copy button next to URL
- **THEN** URL is copied to clipboard
- **AND** success feedback is shown (checkmark or toast)

#### Scenario: Copy all headers
- **WHEN** user clicks "Copy All Headers" button
- **THEN** all headers are copied in "Key: Value" format
- **AND** success feedback is shown

#### Scenario: Copy security recommendations
- **WHEN** user clicks "Copy Recommendations" button
- **THEN** all recommendations are copied as formatted list
- **AND** success feedback is shown

### Requirement: Shareable Result URLs
The system SHALL generate shareable URLs for redirect analysis results with expiration.

#### Scenario: Generate shareable link
- **WHEN** user clicks "Share Results" button
- **THEN** results are stored in KV with unique ID
- **AND** shareable URL is generated (e.g., /share/{id})
- **AND** URL is copied to clipboard automatically
- **AND** expiration time (7 days) is displayed

#### Scenario: Access shared results
- **WHEN** user visits /share/{id} URL
- **THEN** shared results are retrieved from KV and displayed
- **AND** if expired (>7 days), error message is shown
- **AND** option to re-run analysis is provided

### Requirement: PDF Report Generation
The system SHALL generate PDF reports of redirect analysis with branding (future feature).

#### Scenario: Generate PDF report
- **WHEN** user clicks "Export as PDF" button
- **THEN** comprehensive PDF report is generated including:
  - Executive summary with scores
  - Detailed redirect chain visualization
  - Security analysis section
  - SEO analysis section
  - Recommendations
  - Branding (logo, footer)
- **AND** PDF is downloaded automatically
- **AND** file is named "redirect-report-{domain}-{timestamp}.pdf"

**Note**: PDF generation deferred to Phase 2 implementation.

### Requirement: Export Format Selection
The system SHALL allow users to select export format before generating export.

#### Scenario: Format selection dialog
- **WHEN** user clicks "Export" button
- **THEN** modal/dropdown shows available formats (CSV, JSON, PDF)
- **AND** brief description of each format is provided
- **AND** user can select desired format and confirm

### Requirement: Large Dataset Streaming Export
The system SHALL stream large exports to handle bulk results efficiently.

#### Scenario: Large CSV export streaming
- **WHEN** user exports bulk results with 100+ URLs
- **THEN** CSV is generated and streamed to client progressively
- **AND** browser download begins immediately
- **AND** memory usage remains bounded on server

### Requirement: Export Customization
The system SHALL allow users to customize which data fields are included in exports.

#### Scenario: Customize CSV columns
- **WHEN** user opens export settings
- **THEN** checkboxes for each available metric are shown
- **AND** user can select/deselect columns to include
- **AND** selection is remembered for session
- **AND** export includes only selected columns
