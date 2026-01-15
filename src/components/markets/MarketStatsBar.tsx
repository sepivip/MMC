'use client';

import { Metal } from '@/types/metal';
import { TrendingUp, TrendingDown, Activity, CircleDollarSign, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarketStatsBarProps {
  metals: Metal[];
}

export function MarketStatsBar({ metals }: MarketStatsBarProps) {
  // Check if we're using mock data (if any metal has isMockData flag)
  const isMockData = metals.some((m) => m.isMockData);

  // Calculate total market cap (only for real data)
  const totalMarketCap = isMockData ? 0 : metals.reduce((sum, metal) => sum + metal.marketCap, 0);

  // Calculate gold dominance (only for real data, guard against division by zero)
  const goldMetal = metals.find((m) => m.id === 'gold');
  const goldDominance = isMockData || !goldMetal || totalMarketCap === 0
    ? '0'
    : ((goldMetal.marketCap / totalMarketCap) * 100).toFixed(1);

  // Calculate weighted average 24h change (only for real data, guard against division by zero)
  const weightedChange = isMockData || totalMarketCap === 0 ? 0 : metals.reduce((sum, metal) => {
    const weight = metal.marketCap / totalMarketCap;
    return sum + metal.change24h * weight;
  }, 0);

  // Estimate 24h volume (only for real data - approximately 2% of market cap)
  const estimatedVolume = isMockData ? 0 : totalMarketCap * 0.02;

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const isPositive = weightedChange >= 0;

  const stats = [
    {
      label: 'Market Cap',
      value: isMockData ? '-' : formatNumber(totalMarketCap),
      icon: CircleDollarSign,
      iconColor: 'text-primary/70',
    },
    {
      label: '24h Volume',
      value: isMockData ? '-' : formatNumber(estimatedVolume),
      icon: Activity,
      iconColor: 'text-blue-400/70',
    },
    {
      label: 'Dominance',
      value: isMockData ? '-' : `Gold ${goldDominance}%`,
      icon: Crown,
      iconColor: 'text-amber-400/70',
      valueColor: 'text-primary',
    },
  ];

  return (
    <div
      className="bg-gradient-to-r from-card/50 via-card/30 to-card/50 border-b border-border/50 backdrop-blur-sm"
      role="region"
      aria-label="Market statistics"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-6 py-2.5 overflow-x-auto scrollbar-none">
          {/* Stats Grid */}
          <div className="flex items-center gap-6 min-w-0">
            {stats.map(({ label, value, icon: Icon, iconColor, valueColor }) => (
              <div
                key={label}
                className="flex items-center gap-2 whitespace-nowrap group"
              >
                <Icon
                  className={cn('h-3.5 w-3.5 flex-shrink-0 transition-colors', iconColor)}
                  aria-hidden="true"
                />
                <span className="text-xs text-muted-foreground/80 hidden sm:inline">{label}:</span>
                <span className={cn(
                  'text-sm font-semibold tabular-nums',
                  valueColor || 'text-foreground'
                )}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Separator - visible on larger screens */}
          <div className="hidden md:block h-4 w-px bg-border/50" aria-hidden="true" />

          {/* Market Change Indicator */}
          <div className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
            {isMockData ? (
              <span className="text-muted-foreground font-semibold text-sm">
                Metals Market -
              </span>
            ) : (
              <div
                className={cn(
                  'flex items-center gap-1.5 text-sm font-semibold',
                  'px-3 py-1 rounded-full',
                  'transition-all duration-300',
                  isPositive
                    ? 'text-green-400 bg-green-500/10'
                    : 'text-red-400 bg-red-500/10'
                )}
              >
                {isPositive ? (
                  <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span className="hidden sm:inline">Markets</span>
                <span className={cn(
                  isPositive ? 'text-green-400' : 'text-red-400'
                )}>
                  {isPositive ? '+' : ''}{weightedChange.toFixed(2)}%
                </span>
                <span className="text-muted-foreground/60 text-xs font-normal hidden md:inline">today</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
