'use client';

import { Metal } from '@/types/metal';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Flame, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MiniChart } from './MiniChart';

interface MarketHighlightCardsProps {
  metals: Metal[];
  onMetalClick: (metalId: string) => void;
}

interface CardData {
  title: string;
  icon: typeof Flame;
  iconColor: string;
  iconBgColor: string;
  borderAccent: string;
  metal: Metal | null;
  subtitle?: string;
}

export function MarketHighlightCards({ metals, onMetalClick }: MarketHighlightCardsProps) {
  // Track used metal IDs to prevent duplicates
  const usedIds = new Set<string>();

  // Helper to find metal and mark as used
  const findUniqueMetal = (
    sortFn: (a: Metal, b: Metal) => number,
    filterFn?: (m: Metal) => boolean
  ): Metal | null => {
    const sorted = [...metals]
      .filter((m) => !usedIds.has(m.id) && (filterFn ? filterFn(m) : true))
      .sort(sortFn);

    if (sorted.length > 0) {
      usedIds.add(sorted[0].id);
      return sorted[0];
    }
    return null;
  };

  // 1. Top Gainer - highest 24h positive change
  const topGainer = findUniqueMetal(
    (a, b) => b.change24h - a.change24h,
    (m) => m.change24h > 0
  );

  // 2. Top Loser - lowest 24h change (negative)
  const topLoser = findUniqueMetal(
    (a, b) => a.change24h - b.change24h,
    (m) => m.change24h < 0
  );

  // 3. Trending - highest market cap (should be Gold)
  const trending = findUniqueMetal((a, b) => b.marketCap - a.marketCap);

  // 4. Near ATH - closest to all-time high (highest percentFromAth, which is negative or 0)
  const nearATH = findUniqueMetal(
    (a, b) => (b.percentFromAth ?? -100) - (a.percentFromAth ?? -100),
    (m) => m.percentFromAth !== undefined
  );

  const formatPrice = (metal: Metal) => {
    if (metal.isMockData) {
      return '-';
    }
    return `$${metal.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/${metal.priceUnit}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'precious':
        return 'text-amber-400';
      case 'industrial':
        return 'text-blue-400';
      case 'battery':
        return 'text-purple-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const getCategoryBgColor = (category: string) => {
    switch (category) {
      case 'precious':
        return 'bg-amber-500/10';
      case 'industrial':
        return 'bg-blue-500/10';
      case 'battery':
        return 'bg-purple-500/10';
      default:
        return 'bg-muted/10';
    }
  };

  const cards: CardData[] = [
    {
      title: 'Top Gainer',
      icon: TrendingUp,
      iconColor: 'text-green-400',
      iconBgColor: 'bg-green-500/15',
      borderAccent: 'hover:border-green-500/50',
      metal: topGainer,
      subtitle: topGainer ? `Best 24h performance` : undefined,
    },
    {
      title: 'Top Loser',
      icon: TrendingDown,
      iconColor: 'text-red-400',
      iconBgColor: 'bg-red-500/15',
      borderAccent: 'hover:border-red-500/50',
      metal: topLoser,
      subtitle: topLoser ? `Worst 24h performance` : undefined,
    },
    {
      title: 'Trending',
      icon: Flame,
      iconColor: 'text-orange-400',
      iconBgColor: 'bg-orange-500/15',
      borderAccent: 'hover:border-orange-500/50',
      metal: trending,
      subtitle: trending ? `#1 by market cap` : undefined,
    },
    {
      title: 'Near ATH',
      icon: Target,
      iconColor: 'text-primary',
      iconBgColor: 'bg-primary/15',
      borderAccent: 'hover:border-primary/50',
      metal: nearATH,
      subtitle: nearATH?.percentFromAth !== undefined
        ? `${nearATH.percentFromAth.toFixed(1)}% from ATH`
        : undefined,
    },
  ];

  // Filter out cards without metals
  const validCards = cards.filter((card) => card.metal !== null);

  if (validCards.length === 0) {
    return null;
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      role="region"
      aria-label="Market highlights"
    >
      {validCards.map(({ title, icon: Icon, iconColor, iconBgColor, borderAccent, metal, subtitle }) => {
        if (!metal) return null;

        const isPositive = metal.change24h >= 0;

        return (
          <Card
            key={title}
            className={cn(
              'cursor-pointer group relative overflow-hidden',
              'transition-all duration-300 ease-out',
              'hover:translate-y-[-2px]',
              'hover:shadow-xl hover:shadow-black/25',
              'border-border/40',
              borderAccent,
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background'
            )}
            onClick={() => onMetalClick(metal.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onMetalClick(metal.id);
              }
            }}
            tabIndex={0}
            role="button"
            aria-label={`View ${metal.name} details - ${title}: ${isPositive ? '+' : ''}${metal.change24h.toFixed(2)}%`}
          >
            {/* Subtle gradient overlay on hover */}
            <div className={cn(
              'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
              'bg-gradient-to-br from-white/[0.02] to-transparent'
            )} />

            <CardContent className="p-4 relative">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    'p-2 rounded-lg transition-transform duration-300 group-hover:scale-110',
                    iconBgColor
                  )}>
                    <Icon className={cn('h-4 w-4', iconColor)} aria-hidden="true" />
                  </div>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                    {title}
                  </span>
                </div>
                <span className={cn(
                  'text-[10px] font-medium px-2 py-1 rounded-full capitalize',
                  'transition-colors duration-200',
                  getCategoryBgColor(metal.category),
                  getCategoryColor(metal.category)
                )}>
                  {metal.category}
                </span>
              </div>

              {/* Metal Info */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-lg truncate leading-tight">{metal.name}</div>
                  <div className="text-sm text-muted-foreground/80 font-mono mt-0.5">{metal.symbol}</div>
                </div>
                <div className="w-20 h-12 flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                  {metal.isMockData ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
                      -
                    </div>
                  ) : (
                    <MiniChart data={metal.sparklineData} isPositive={metal.change7d >= 0} />
                  )}
                </div>
              </div>

              {/* Price & Change */}
              <div className="mt-4 flex items-end justify-between gap-2">
                <div className="font-mono text-sm font-semibold text-foreground/90 truncate">
                  {formatPrice(metal)}
                </div>
                {metal.isMockData ? (
                  <div className="text-sm text-muted-foreground flex-shrink-0">
                    -
                  </div>
                ) : (
                  <div
                    className={cn(
                      'flex items-center gap-1 text-sm font-bold flex-shrink-0',
                      'px-2 py-0.5 rounded-md',
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
                    <span>{isPositive ? '+' : ''}{metal.change24h.toFixed(2)}%</span>
                  </div>
                )}
              </div>

              {/* Subtitle */}
              {subtitle && (
                <div className="mt-3 pt-3 border-t border-border/30">
                  <span className="text-xs text-muted-foreground/70">
                    {subtitle}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
