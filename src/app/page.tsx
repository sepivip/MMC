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
import { RefreshCw, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">Market Overview</h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                {isLoading ? 'Loading market data...' : `Track live prices, market caps, and trends for ${metals.length} metals`}
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              {lastUpdated && (
                <div className="text-xs text-muted-foreground text-right hidden sm:block">
                  <div className="font-medium">Last updated</div>
                  <time dateTime={lastUpdated.toISOString()} className="tabular-nums">
                    {lastUpdated.toLocaleTimeString()}
                  </time>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleManualRefresh}
                disabled={isRefreshing || isLoading}
                aria-label="Refresh market data"
                className={cn(
                  'gap-2 transition-all duration-200',
                  'hover:bg-accent/50'
                )}
              >
                <RefreshCw className={cn(
                  'h-4 w-4 transition-transform duration-500',
                  isRefreshing && 'animate-spin'
                )} />
                <span className="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </Button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="relative">
                <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
                <div className="absolute inset-0 h-10 w-10 rounded-full bg-primary/20 animate-ping mx-auto" />
              </div>
              <div>
                <p className="text-foreground font-medium mb-1">Loading market data</p>
                <p className="text-sm text-muted-foreground">Fetching real-time prices from Yahoo Finance...</p>
              </div>
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
