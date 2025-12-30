# Changelog

All notable changes to MetalMarketCap will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2024-12-30

### Added
- Page-specific SEO metadata for all routes
  - News page metadata with optimized titles and descriptions
  - Alerts page metadata for social sharing
  - Watchlist page metadata
  - Metal detail pages with dynamic metadata templates
  - OpenGraph and Twitter Card tags for each page
- Market data refresh controls
  - "Last updated" timestamp display
  - Manual refresh button with spinning animation
  - Loading state during refresh operations
  - Toast notification on successful refresh
  - Mobile-responsive layout
- Confirmation dialog for alert deletion
  - AlertDialog component with cancel/confirm actions
  - Prevents accidental deletions
  - Toast feedback on deletion

### Changed
- Skip-to-content link moved to root layout (now available on all pages)
- Enhanced ARIA labels for all icon-only buttons
- Improved mobile menu accessibility
- Updated PLAN.md with completed feedback items

### Fixed
- Accessibility improvements for delete buttons
- Keyboard navigation for interactive elements

## [1.1.0] - 2024-12-30

### Added
- Real-time metal price data integration with Yahoo Finance API
- Auto-refresh functionality (60-second intervals)
- Price per KG column in markets table
- Version information in footer (version, build date, git commit)
- Toast notifications system (Sonner)
  - Success notifications for watchlist additions
  - Info notifications for watchlist removals
  - Alert create/pause/delete notifications
  - Form validation error messages
- Comprehensive SEO meta tags
  - Open Graph protocol for social sharing
  - Twitter Card integration
  - Rich structured metadata
- PWA support
  - manifest.json with app shortcuts
  - Theme colors and icons configuration
- Error handling
  - Global error boundary (error.tsx)
  - Critical error handler (global-error.tsx)
  - Loading states with skeleton screens
- Accessibility improvements
  - ARIA labels on all interactive elements
  - Keyboard navigation support (Enter key)
  - Skip-to-content link for screen readers
  - aria-sort for sortable table columns
  - Proper semantic HTML roles
- Branding assets
  - Custom SVG app icon (gold metallic M)
  - robots.txt for SEO
  - Favicon configuration

### Changed
- Enhanced markets table with better sorting and filtering
- Improved mobile navigation with hamburger menu
- Better loading indicators with spinners
- Enhanced footer with version info and GitHub link

### Fixed
- Table column sorting keyboard accessibility
- Search input accessibility labels
- Form validation feedback

## [1.0.0] - 2024-12-29

### Added
- Initial release of MetalMarketCap
- Markets dashboard with sortable table
  - Search and filter by category
  - Sparkline charts (7-day trends)
  - Watchlist functionality with star toggle
- Metal detail pages
  - Interactive price charts (1D, 7D, 1M, 1Y, ALL)
  - Key metrics display (market cap, supply, demand, production)
  - Related news section
- News feed
  - Filter by specific metal
  - Clean card layout
- Price alerts system
  - Create alerts (above/below target price)
  - Pause/resume/delete alerts
  - Visual status indicators
- Watchlist page
  - View all watchlisted metals
  - Full table view with sorting
- Mock data for 12 metals
  - Precious metals: Gold, Silver, Platinum, Palladium
  - Industrial metals: Copper, Aluminum, Zinc, Lead, Tin
  - Battery metals: Lithium, Nickel, Cobalt
- Dark mode theme
  - Premium metallic design
  - Gold accent color
  - Category-coded badges
- Mobile-first responsive design
- Tech stack
  - Next.js 15 with App Router
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - Recharts for data visualization
  - Lucide React icons

---

## Version History

- **1.2.0** (Current) - Enhanced SEO, UX improvements, accessibility fixes
- **1.1.0** - Phase 1 polish, accessibility, real API integration
- **1.0.0** - Initial MVP release

## Upcoming

See [PLAN.md](PLAN.md) for planned features and improvements.

### Next Release (1.3.0)
- User authentication
- Persistent watchlist and alerts
- Portfolio tracking
- More metal coverage
- Advanced charting features
- Image assets (favicons, OG images, PWA icons)
