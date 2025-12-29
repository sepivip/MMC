'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MarketsTable } from '@/components/markets/MarketsTable';
import { MobileNav } from '@/components/layout/MobileNav';
import { mockMetals } from '@/data/mockMetals';
import { Metal } from '@/types/metal';

export default function Home() {
  const router = useRouter();
  const [metals, setMetals] = useState<Metal[]>(mockMetals);

  const handleMetalClick = (metalId: string) => {
    router.push(`/metal/${metalId}`);
  };

  const handleWatchlistToggle = (metalId: string) => {
    setMetals((prev) =>
      prev.map((metal) =>
        metal.id === metalId
          ? { ...metal, isWatchlisted: !metal.isWatchlisted }
          : metal
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Metal<span className="text-primary">Market</span>Cap
              </h1>
              <p className="text-sm text-muted-foreground">
                Real-time precious & industrial metal market data
              </p>
            </div>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6">
                <a href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                  Markets
                </a>
                <a href="/news" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  News
                </a>
                <a href="/alerts" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Alerts
                </a>
                <a href="/watchlist" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Watchlist
                </a>
              </nav>
              <MobileNav />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Market Overview</h2>
          <p className="text-muted-foreground">
            Track live prices, market caps, and trends for {metals.length} metals
          </p>
        </div>

        <MarketsTable
          metals={metals}
          onMetalClick={handleMetalClick}
          onWatchlistToggle={handleWatchlistToggle}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            MetalMarketCap - Market data for precious and industrial metals
          </p>
        </div>
      </footer>
    </div>
  );
}
