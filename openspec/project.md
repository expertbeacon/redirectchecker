# Project Context

## Purpose
Redirect Checker is an open-source tool that analyzes and verifies URL redirects. It helps webmasters, SEO professionals, and developers understand redirect chains, identify issues, and optimize website performance.

## Tech Stack
- Next.js 14.2.5 (React framework)
- TypeScript
- Tailwind CSS (styling)
- Cloudflare Pages (deployment platform)
- Radix UI (component library)
- React Hook Form + Zod (form validation)
- Axios (HTTP client)
- next-intl (internationalization)

## Project Conventions

### Code Style
- TypeScript strict mode
- ESLint with Next.js config
- Functional React components with hooks
- Tailwind CSS for styling (no CSS modules)
- Server-side rendering where appropriate

### Architecture Patterns
- Next.js App Router architecture
- API routes for redirect checking logic
- Component-based UI with Radix UI primitives
- Form state management with react-hook-form
- Type-safe API responses

### Testing Strategy
[To be defined - currently no test framework configured]

### Git Workflow
- pre-commit hooks for markdown data generation
- Feature branches merged to main
- Deployment via GitHub Actions or local wrangler

## Domain Context
- Redirect types: 301, 302, 303, 307, 308, meta refresh, JavaScript redirects
- SEO considerations for redirect chains
- User-agent specific redirects (mobile vs desktop)
- Redirect loop detection
- HTTP header analysis (Status Code, X-Robots-Tag, Rel Canonical)
- URL parameter stripping for tracking cleanup

## Important Constraints
- Deployed to Cloudflare Pages (edge runtime constraints)
- Must support custom user-agent selection
- Multi-language support required
- Free API must remain performant and abuse-resistant

## External Dependencies
- Cloudflare Pages/Workers runtime
- @cloudflare/next-on-pages for adapter
- Public internet access for URL checking
