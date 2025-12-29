# MetalMarketCap

A mobile-first web application for tracking real-time market data for precious and industrial metals, inspired by CoinMarketCap.

## Features

### Markets Dashboard
- **Sortable Table**: Click any column header to sort metals by rank, price, 24h change, 7d change, or market cap
- **Search & Filter**: Quickly find metals by name or symbol, filter by category (precious, industrial, battery metals)
- **Mini Charts**: Sparkline charts showing 7-day price trends
- **Watchlist**: Star your favorite metals for quick access

### Metal Detail Page
- **Interactive Price Charts**: View price history across multiple timeframes (1D, 7D, 1M, 1Y, ALL)
- **Key Metrics**: Market cap, total supply, annual demand, and production data
- **Price Changes**: See 24h and 7d percentage changes at a glance
- **Related News**: Stay updated with metal-specific market news

### News Feed
- **Latest Updates**: Browse metal market news from top financial sources
- **Filter by Metal**: View news for specific metals
- **Clean Layout**: Easy-to-scan news cards with source and timestamp

### Price Alerts
- **Custom Alerts**: Set price targets (above/below) for any metal
- **Alert Management**: Pause, resume, or delete alerts
- **Visual Status**: See which alerts are active or triggered

### Watchlist
- **Personal Tracking**: Keep your favorite metals in one place
- **Full Table View**: All watchlisted metals with complete data

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React

## Design System

- **Dark Mode First**: Premium dark theme with metallic accents
- **Gold Primary**: Accent color inspired by precious metals
- **Color Palette**:
  - Gold for precious metals
  - Blue for industrial metals
  - Purple for battery metals
- **Typography**: Geist Sans & Geist Mono fonts
- **Mobile-First**: Responsive design optimized for all screen sizes

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Navigate to the project directory:
```bash
cd metalmarketcap
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── alerts/            # Price alerts page
│   ├── metal/[id]/        # Metal detail page
│   ├── news/              # News feed page
│   ├── watchlist/         # Watchlist page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Markets home page
├── components/
│   ├── layout/            # Layout components (MobileNav)
│   ├── markets/           # Markets table & mini chart
│   ├── metal/             # Metal detail components (PriceChart)
│   └── ui/                # shadcn/ui components
├── data/
│   └── mockMetals.ts      # Mock market data
├── types/
│   └── metal.ts           # TypeScript interfaces
└── lib/
    └── utils.ts           # Utility functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Metals Tracked

### Precious Metals
- Gold (XAU)
- Silver (XAG)
- Platinum (XPT)
- Palladium (XPD)

### Industrial Metals
- Copper (HG)
- Aluminum (ALU)
- Zinc (ZN)
- Lead (PB)
- Tin (SN)

### Battery Metals
- Lithium (Li)
- Nickel (NI)
- Cobalt (Co)

## Future Enhancements

- Real-time data integration with metal market APIs
- User authentication and persistent watchlists
- Push notifications for price alerts
- Advanced charting with technical indicators
- Historical data export
- Mobile app (React Native)
- Portfolio tracking
- Price calculator

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
