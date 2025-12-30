# MetalMarketCap - Development Plan

## ✅ Completed Features

### Core Application (v1.0.0)
- [x] Next.js 15 setup with TypeScript and Tailwind CSS
- [x] shadcn/ui component library integration
- [x] Dark mode theme with premium metallic design
- [x] Markets dashboard with sortable table
- [x] Search and filter functionality
- [x] Mini sparkline charts (7-day trends)
- [x] Metal detail pages with interactive charts
- [x] Multiple chart timeframes (1D, 7D, 1M, 1Y, ALL)
- [x] News feed with filtering
- [x] Price alerts system (create, pause, delete)
- [x] Watchlist functionality
- [x] Mobile-responsive navigation with hamburger menu
- [x] Mock data for 12 metals
- [x] GitHub repository setup

### Phase 1 Polish (v1.1.0)
- [x] Real-time data integration with Yahoo Finance API
- [x] Auto-refresh every 60 seconds
- [x] Price per KG column in markets table
- [x] SVG app icon with gold metallic M design
- [x] manifest.json for PWA support
- [x] robots.txt for SEO
- [x] Comprehensive meta tags (OpenGraph, Twitter Cards)
- [x] Error boundaries (error.tsx, global-error.tsx)
- [x] Loading states with skeleton screens
- [x] Toast notification system (Sonner)
- [x] ARIA labels and keyboard navigation
- [x] Skip-to-content link
- [x] Version tracking in footer
- [x] CHANGELOG.md documentation

---

## 🎯 Phase 1: Polish & Refinement

### Branding & Assets
- [x] Design app logo/icon (SVG with gold metallic M)
- [x] Add manifest.json for PWA support
- [ ] Create favicon-16x16.png (referenced but missing)
- [ ] Create favicon-32x32.png (referenced but missing)
- [ ] Create apple-touch-icon.png (referenced but missing)
- [ ] Create og-image.png for social sharing (referenced but missing)
- [ ] Create icon-192.png for PWA (referenced in manifest)
- [ ] Create icon-512.png for PWA (referenced in manifest)
- [ ] Create screenshot-desktop.png (referenced in manifest)
- [ ] Create screenshot-mobile.png (referenced in manifest)
- [ ] Create metal category icons

### SEO & Meta Tags
- [x] Add meta descriptions to all pages (added in layout.tsx)
- [x] Add Open Graph tags (og:title, og:description, og:image)
- [x] Add Twitter Card meta tags
- [x] Create robots.txt
- [x] Optimize page titles for SEO (template added)
- [ ] Add canonical URLs (not set in metadata yet)
- [ ] Create sitemap.xml (not present)
- [ ] Add structured data (JSON-LD) for metals
- [ ] Replace placeholder Google verification code

### Accessibility (a11y)
- [x] Add ARIA labels to interactive elements
- [x] Add keyboard navigation support (Enter key on table)
- [x] Add skip-to-content link
- [x] Add focus indicators for all interactive elements
- [x] Add alt text for all images/icons (aria-hidden where appropriate)
- [ ] Ensure proper heading hierarchy (h1 -> h6) - needs review
- [ ] Test with screen readers
- [ ] Ensure color contrast meets WCAG AA standards - needs testing

### Performance Optimization
- [x] Add loading skeletons for data fetching (loading.tsx)
- [ ] Implement lazy loading for images
- [ ] Add React.memo() to heavy components
- [ ] Optimize bundle size (analyze with @next/bundle-analyzer)
- [ ] Implement virtual scrolling for large tables
- [ ] Add image optimization (next/image)
- [ ] Implement code splitting
- [ ] Add service worker for offline support

### UI/UX Improvements
- [x] Add loading states to all async operations (spinner + loading.tsx)
- [x] Add error boundaries for graceful error handling (error.tsx + global-error.tsx)
- [x] Add toast notifications for user actions (Sonner integration)
- [x] Add empty states for all lists/tables (already in components)
- [ ] Add confirmation dialogs for destructive actions
- [ ] Add pagination or infinite scroll for tables
- [ ] Add table column visibility toggles
- [ ] Add table density options (compact/comfortable)
- [ ] Add dark/light mode toggle (currently only dark)
- [ ] Add chart tooltips with more details
- [ ] Add price change arrows/indicators
- [ ] Add "last updated" timestamp
- [ ] Add refresh button for data

### Mobile Enhancements
- [ ] Add pull-to-refresh on mobile
- [ ] Optimize touch targets (min 44x44px)
- [ ] Add swipe gestures for navigation
- [ ] Test on various mobile devices
- [ ] Add iOS Safari status bar styling
- [ ] Test landscape orientation
- [ ] Optimize for tablet sizes

---

## 🚀 Phase 2: Data Integration

### Real-Time Data
- [x] Research metal market data APIs (using Yahoo Finance)
- [x] Implement API client/service layer (/api/metals route)
- [x] Add data fetching (native fetch with useEffect)
- [x] Add fallback to mock data if API fails
- [x] Auto-refresh every 60 seconds
- [ ] Add data fetching with SWR or React Query (for better caching)
- [ ] Implement WebSocket for real-time updates
- [ ] Add data caching strategy (beyond auto-refresh)
- [ ] Handle API rate limits
- [ ] Display API status indicator

### Historical Data
- [ ] Store historical price data
- [ ] Implement data aggregation (daily, weekly, monthly)
- [ ] Add more chart types (candlestick, area, bar)
- [ ] Add technical indicators (MA, RSI, MACD)
- [ ] Add volume data
- [ ] Add historical news correlation

### News Integration
- [ ] Integrate real news API (NewsAPI, Finnhub, etc.)
- [ ] Add news sentiment analysis
- [ ] Add news images
- [ ] Implement news search
- [ ] Add news categories/tags
- [ ] Add RSS feed support

---

## 👤 Phase 3: User Features

### Authentication
- [ ] Set up authentication (NextAuth.js, Clerk, or Supabase)
- [ ] Add sign up / sign in pages
- [ ] Add social login (Google, GitHub)
- [ ] Add password reset flow
- [ ] Add email verification
- [ ] Add user profile page
- [ ] Add session management

### User Preferences
- [ ] Persist watchlist across sessions
- [ ] Persist alerts across sessions
- [ ] Add user settings page
- [ ] Add currency preference (USD, EUR, GBP)
- [ ] Add unit preference (oz, kg, ton)
- [ ] Add notification preferences
- [ ] Add theme preferences
- [ ] Add table column preferences

### Social Features
- [ ] Add ability to share metals/charts
- [ ] Add public watchlists
- [ ] Add comments/discussion threads
- [ ] Add user ratings/reviews
- [ ] Add follow other users
- [ ] Add portfolio sharing

---

## 📊 Phase 4: Advanced Features

### Portfolio Tracking
- [ ] Add portfolio page
- [ ] Add transactions (buy/sell)
- [ ] Calculate portfolio value
- [ ] Show P&L (profit/loss)
- [ ] Add portfolio charts
- [ ] Add cost basis tracking
- [ ] Add import from CSV
- [ ] Add export to CSV/PDF

### Advanced Alerts
- [ ] Add percentage change alerts
- [ ] Add volume alerts
- [ ] Add multi-condition alerts (AND/OR)
- [ ] Add recurring alerts
- [ ] Add email notifications
- [ ] Add push notifications (PWA)
- [ ] Add SMS notifications (Twilio)
- [ ] Add Telegram/Discord webhooks
- [ ] Add alert history

### Calculators & Tools
- [ ] Add currency converter
- [ ] Add unit converter (oz to kg, etc.)
- [ ] Add investment calculator
- [ ] Add comparison tool (compare 2+ metals)
- [ ] Add correlation matrix
- [ ] Add volatility calculator
- [ ] Add risk assessment tool

### Analytics & Insights
- [ ] Add market overview dashboard
- [ ] Add trending metals
- [ ] Add biggest gainers/losers
- [ ] Add market sentiment indicators
- [ ] Add AI-powered insights
- [ ] Add price predictions (ML)
- [ ] Add pattern recognition
- [ ] Add anomaly detection

### Advanced Charts
- [ ] Add drawing tools (trend lines, etc.)
- [ ] Add chart annotations
- [ ] Add multiple chart layouts
- [ ] Add chart comparison (overlay multiple metals)
- [ ] Add chart export (PNG, SVG, PDF)
- [ ] Add custom indicators
- [ ] Add chart templates/presets

---

## 🏗️ Phase 5: Infrastructure

### Database
- [ ] Set up database (PostgreSQL, MongoDB, or Supabase)
- [ ] Design database schema
- [ ] Add database migrations
- [ ] Set up ORM (Prisma, Drizzle)
- [ ] Add database backups
- [ ] Add database monitoring

### Backend API
- [ ] Create API routes for metals data
- [ ] Create API routes for user data
- [ ] Add API authentication
- [ ] Add API rate limiting
- [ ] Add API versioning
- [ ] Add API documentation (Swagger)
- [ ] Add API testing

### Caching
- [ ] Implement Redis for caching
- [ ] Cache API responses
- [ ] Cache computed data
- [ ] Implement CDN caching
- [ ] Add cache invalidation strategy

### Monitoring & Analytics
- [ ] Add error tracking (Sentry)
- [ ] Add analytics (Google Analytics, Plausible)
- [ ] Add performance monitoring (Vercel Analytics)
- [ ] Add uptime monitoring
- [ ] Add user behavior analytics
- [ ] Add A/B testing framework

### Testing
- [ ] Add unit tests (Jest, Vitest)
- [ ] Add component tests (React Testing Library)
- [ ] Add E2E tests (Playwright, Cypress)
- [ ] Add visual regression tests
- [ ] Add API tests
- [ ] Set up CI/CD pipeline
- [ ] Add pre-commit hooks (Husky)
- [ ] Add test coverage reporting

### Security
- [ ] Add CSRF protection
- [ ] Add rate limiting
- [ ] Add input validation
- [ ] Add XSS protection
- [ ] Add SQL injection protection
- [ ] Add security headers
- [ ] Add HTTPS enforcement
- [ ] Run security audit
- [ ] Add dependency scanning
- [ ] Add penetration testing

---

## 🎨 Phase 6: Additional Pages

### Informational Pages
- [ ] Add About page
- [ ] Add FAQ page
- [ ] Add Contact page
- [ ] Add Privacy Policy
- [ ] Add Terms of Service
- [ ] Add Cookie Policy
- [ ] Add Help/Documentation
- [ ] Add API documentation page
- [ ] Add Metal education/guide pages

### Marketing Pages
- [ ] Add landing page variant
- [ ] Add pricing page (if premium features)
- [ ] Add features comparison
- [ ] Add testimonials
- [ ] Add blog/articles section
- [ ] Add press kit
- [ ] Add affiliate program page

### Community
- [ ] Add forum/community page
- [ ] Add leaderboards
- [ ] Add user achievements/badges
- [ ] Add events calendar
- [ ] Add metal market events

---

## 📱 Phase 7: Mobile App

### React Native App
- [ ] Set up React Native project
- [ ] Share components with web app
- [ ] Add native navigation
- [ ] Add native notifications
- [ ] Add biometric authentication
- [ ] Test on iOS
- [ ] Test on Android
- [ ] Submit to App Store
- [ ] Submit to Google Play

---

## 🌍 Phase 8: Internationalization

### i18n Setup
- [ ] Set up next-intl or react-i18next
- [ ] Add language selector
- [ ] Translate UI to Spanish
- [ ] Translate UI to French
- [ ] Translate UI to German
- [ ] Translate UI to Chinese
- [ ] Add RTL support for Arabic/Hebrew
- [ ] Add currency localization
- [ ] Add date/time localization

---

## 💰 Phase 9: Monetization (Optional)

### Premium Features
- [ ] Define free vs premium tiers
- [ ] Add subscription payment (Stripe)
- [ ] Add premium-only features
- [ ] Add usage limits for free tier
- [ ] Add billing management
- [ ] Add invoices/receipts

### Advertising
- [ ] Add ad slots (Google AdSense)
- [ ] Add sponsored content sections
- [ ] Add affiliate links

---

## 📈 Phase 10: Growth & Marketing

### SEO & Content
- [ ] Create metal guide content
- [ ] Add blog posts
- [ ] Optimize for metal-related keywords
- [ ] Build backlinks
- [ ] Submit to directories

### Social Media
- [ ] Create Twitter account
- [ ] Create LinkedIn page
- [ ] Create YouTube channel (tutorials)
- [ ] Create Discord server
- [ ] Regular social media updates

### Partnerships
- [ ] Partner with metal dealers
- [ ] Partner with news outlets
- [ ] Partner with financial educators
- [ ] Partner with trading platforms

---

## 🐛 Known Issues / Bugs

- [ ] Test all features in production environment
- [ ] Fix any console warnings/errors
- [ ] Test cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Test on different screen sizes
- [ ] Validate all forms
- [ ] Test error scenarios

---

## 📝 Documentation

### Developer Docs
- [ ] Add contributing guidelines (CONTRIBUTING.md)
- [ ] Add code of conduct (CODE_OF_CONDUCT.md)
- [ ] Add architecture documentation
- [ ] Add component library documentation
- [ ] Add API documentation
- [ ] Add deployment guide
- [ ] Add troubleshooting guide

### User Docs
- [ ] Create user guide
- [ ] Create video tutorials
- [ ] Add tooltips throughout app
- [ ] Add onboarding tour for new users
- [ ] Add keyboard shortcuts documentation

---

## 🎯 Priority Levels

**P0 (Critical)**: Branding assets, SEO basics, accessibility basics, error handling
**P1 (High)**: Real data integration, authentication, performance optimization
**P2 (Medium)**: Advanced features, portfolio tracking, advanced alerts
**P3 (Low)**: Mobile app, i18n, monetization

---

## 📅 Timeline Estimates

- Phase 1 (Polish): 1-2 weeks
- Phase 2 (Data): 2-3 weeks
- Phase 3 (Users): 2-3 weeks
- Phase 4 (Advanced): 3-4 weeks
- Phase 5 (Infrastructure): 2-3 weeks
- Phase 6+ (Additional): Ongoing

---

**Last Updated**: 2024-12-30
**Status**: MVP Complete, Moving to Phase 1

---

## 📝 Feedback TODOs
- [x] Mark completed: global meta description, Open Graph, Twitter Card, and robots settings exist in `src/app/layout.tsx`
- [x] Mark completed: `manifest.json` exists at `public/manifest.json`
- [x] Mark completed: `robots.txt` exists at `public/robots.txt`
- [x] Mark completed: error boundaries exist (`src/app/error.tsx`, `src/app/global-error.tsx`)
- [x] Mark completed: empty states already exist for markets filter, alerts, watchlist, and news lists
- [ ] Add canonical URLs (not set in metadata)
- [x] Add page-specific metadata for `/news`, `/alerts`, `/watchlist`, and dynamic `/metal/[id]`
- [ ] Add JSON-LD structured data for metals (not present)
- [ ] Add sitemap at `public/sitemap.xml` (currently missing but referenced by `public/robots.txt`)
- [ ] Replace placeholder Google verification code in metadata
- [ ] Add missing assets referenced by metadata/manifest: `public/favicon-16x16.png`, `public/favicon-32x32.png`, `public/apple-touch-icon.png`, `public/og-image.png`, `public/icon-192.png`, `public/icon-512.png`, `public/screenshot-desktop.png`, `public/screenshot-mobile.png`
- [ ] Decide on app logo/icon usage in UI (icon exists at `public/icon.svg` but header is text-only)
- [x] Add aria-label to the mobile menu icon button in `src/components/layout/MobileNav.tsx`
- [x] Add aria-label to the delete alert icon button in `src/app/alerts/page.tsx`
- [x] Move the skip-to-content link into `src/app/layout.tsx` so it appears on all pages
- [ ] Ensure visible focus styles for non-button interactive elements (sortable table headers and clickable rows in `src/components/markets/MarketsTable.tsx`)
- [x] Add confirmation dialog for destructive actions (alert deletion)
- [x] Add "last updated" timestamp and manual refresh control on market data pages
- [ ] Add light mode toggle (currently `html` hard-sets `className="dark"`)
- [ ] Add code-splitting or dynamic import for `recharts` on `src/components/metal/PriceChart.tsx`
- [ ] Add API status indicator for Yahoo Finance fetch health/fallback mode
- [ ] Add mobile enhancements: pull-to-refresh, swipe navigation, iOS Safari status bar styling
- [x] Re-check "Skip-to-content link" completed item: now in `src/app/layout.tsx` and global
- [x] Re-check "ARIA labels and keyboard navigation" completed item: icon-only buttons now have labels
- [ ] Re-check "Loading states with skeleton screens" completed item: only root `src/app/loading.tsx` exists; other routes use spinners
