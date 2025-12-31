'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { MarketsTable } from '@/components/markets/MarketsTable';
import { MarketStatsBar } from '@/components/markets/MarketStatsBar';
import { MarketHighlightCards } from '@/components/markets/MarketHighlightCards';
import { mockMetals } from '@/data/mockMetals';
import { Metal } from '@/types/metal';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [metals, setMetals] = useState<Metal[]>(mockMetals);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchMetals = async () => {
    try {
      const response = await fetch('/api/metals');
      if (response.ok) {
        const data = await response.json();
        setMetals(data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch metals:', error);
      // Keep using mock data on error
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetals();
    // Refresh data every 60 seconds
    const interval = setInterval(fetchMetals, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchMetals();
    toast.success('Market data refreshed');
  };

  const handleMetalClick = (metalId: string) => {
    router.push(`/metal/${metalId}`);
  };

  const handleWatchlistToggle = (metalId: string) => {
    const metal = metals.find((m) => m.id === metalId);
    const isAdding = !metal?.isWatchlisted;

    setMetals((prev) =>
      prev.map((m) =>
        m.id === metalId
          ? { ...m, isWatchlisted: !m.isWatchlisted }
          : m
      )
    );

    if (isAdding) {
      toast.success(`${metal?.name} added to watchlist`);
    } else {
      toast.info(`${metal?.name} removed from watchlist`);
    }
  };

  return (
    <>
      {/* Market Stats Bar */}
      {!isLoading && <MarketStatsBar metals={metals} />}

      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-4 py-8" role="main">
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Market Overview</h2>
              <p className="text-muted-foreground">
                {isLoading ? 'Loading market data...' : `Track live prices, market caps, and trends for ${metals.length} metals`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {lastUpdated && (
                <div className="text-xs text-muted-foreground text-right">
                  <div className="font-medium">Last updated</div>
                  <div>{lastUpdated.toLocaleTimeString()}</div>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRefresh}
                disabled={isRefreshing || isLoading}
                aria-label="Refresh market data"
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
              <p className="text-muted-foreground">Loading real-time metal prices from Yahoo Finance...</p>
            </div>
          </div>
        ) : (
          <>
            <MarketHighlightCards metals={metals} onMetalClick={handleMetalClick} />
            <MarketsTable
              metals={metals}
              onMetalClick={handleMetalClick}
              onWatchlistToggle={handleWatchlistToggle}
            />
          </>
        )}
      </main>

    </>
  );
}
