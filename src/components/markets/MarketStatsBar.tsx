'use client';

import { Metal } from '@/types/metal';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketStatsBarProps {
  metals: Metal[];
}

export function MarketStatsBar({ metals }: MarketStatsBarProps) {
  // Calculate total market cap
  const totalMarketCap = metals.reduce((sum, metal) => sum + metal.marketCap, 0);

  // Calculate gold dominance
  const goldMetal = metals.find((m) => m.id === 'gold');
  const goldDominance = goldMetal
    ? ((goldMetal.marketCap / totalMarketCap) * 100).toFixed(1)
    : '0';

  // Calculate weighted average 24h change
  const weightedChange = metals.reduce((sum, metal) => {
    const weight = metal.marketCap / totalMarketCap;
    return sum + metal.change24h * weight;
  }, 0);

  // Estimate 24h volume (mock - approximately 2% of market cap)
  const estimatedVolume = totalMarketCap * 0.02;

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const isPositive = weightedChange >= 0;

  return (
    <div className="bg-card/30 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 py-2 overflow-x-auto text-sm">
          {/* Global Market Cap */}
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-muted-foreground">Global Market Cap:</span>
            <span className="font-semibold">{formatNumber(totalMarketCap)}</span>
          </div>

          {/* 24h Volume */}
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-muted-foreground">24h Vol:</span>
            <span className="font-semibold">{formatNumber(estimatedVolume)}</span>
          </div>

          {/* Gold Dominance */}
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-muted-foreground">Dominance:</span>
            <span className="font-semibold text-primary">Gold {goldDominance}%</span>
          </div>

          {/* Market Change */}
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span
              className={cn(
                'flex items-center gap-1 font-semibold',
                isPositive ? 'text-green-500' : 'text-red-500'
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              Metals Market is {isPositive ? 'up' : 'down'} {Math.abs(weightedChange).toFixed(1)}% today
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
