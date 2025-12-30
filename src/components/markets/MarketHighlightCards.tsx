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
  accentColor: string;
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

  // 4. Near ATH - closest to all-time high
  const nearATH = findUniqueMetal(
    (a, b) => (b.percentFromAth ?? -100) - (a.percentFromAth ?? -100),
    (m) => m.percentFromAth !== undefined
  );

  const formatPrice = (price: number, unit: string) => {
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/${unit}`;
  };

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'precious':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/20';
      case 'industrial':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/20';
      case 'battery':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/20';
      default:
        return 'bg-muted/15 text-muted-foreground border-muted/20';
    }
  };

  const cards: CardData[] = [
    {
      title: 'TOP GAINER',
      icon: TrendingUp,
      iconColor: 'text-green-500',
      accentColor: 'border-l-green-500',
      metal: topGainer,
      subtitle: 'Best 24h performance',
    },
    {
      title: 'TOP LOSER',
      icon: TrendingDown,
      iconColor: 'text-red-500',
      accentColor: 'border-l-red-500',
      metal: topLoser,
      subtitle: 'Worst 24h performance',
    },
    {
      title: 'TRENDING',
      icon: Flame,
      iconColor: 'text-orange-500',
      accentColor: 'border-l-orange-500',
      metal: trending,
      subtitle: '#1 by market cap',
    },
    {
      title: 'NEAR ATH',
      icon: Target,
      iconColor: 'text-primary',
      accentColor: 'border-l-primary',
      metal: nearATH,
      subtitle: nearATH?.percentFromAth !== undefined
        ? `${nearATH.percentFromAth.toFixed(1)}% from all-time high`
        : 'Closest to ATH',
    },
  ];

  // Filter out cards without metals
  const validCards = cards.filter((card) => card.metal !== null);

  if (validCards.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {validCards.map(({ title, icon: Icon, iconColor, accentColor, metal, subtitle }) => {
        if (!metal) return null;

        const isPositive = metal.change24h >= 0;

        return (
          <Card
            key={title}
            className={cn(
              'cursor-pointer transition-all duration-200 min-h-[180px]',
              'hover:shadow-lg hover:shadow-black/10 hover:border-border',
              'border-l-4',
              accentColor
            )}
            onClick={() => onMetalClick(metal.id)}
          >
            <CardContent className="p-4 h-full flex flex-col">
              {/* Row 1: Header - Icon + Title | Category Badge */}
              <div className="flex items-center justify-between h-6 mb-3">
                <div className="flex items-center gap-2">
                  <Icon className={cn('h-4 w-4 flex-shrink-0', iconColor)} />
                  <span className="text-[11px] font-semibold tracking-wider text-muted-foreground">
                    {title}
                  </span>
                </div>
                <span className={cn(
                  'text-[10px] font-medium px-2 py-0.5 rounded border',
                  getCategoryStyles(metal.category)
                )}>
                  {metal.category}
                </span>
              </div>

              {/* Row 2: Metal Info - Name + Symbol | Chart */}
              <div className="flex items-start justify-between gap-3 flex-1">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-base leading-tight truncate">
                    {metal.name}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">
                    {metal.symbol}
                  </div>
                </div>
                <div className="w-16 h-10 flex-shrink-0">
                  <MiniChart data={metal.sparklineData} isPositive={metal.change7d >= 0} />
                </div>
              </div>

              {/* Row 3: Price | Change */}
              <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-border/50">
                <div className="font-mono text-sm font-medium text-foreground truncate">
                  {formatPrice(metal.price, metal.priceUnit)}
                </div>
                <div
                  className={cn(
                    'flex items-center gap-1 text-sm font-bold flex-shrink-0 w-20 justify-end',
                    isPositive ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span>
                    {isPositive ? '+' : ''}
                    {metal.change24h.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Row 4: Footer Subtitle */}
              <div className="mt-2">
                <span className="text-[11px] text-muted-foreground leading-tight">
                  {subtitle}
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
