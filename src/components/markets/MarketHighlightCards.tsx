'use client';

import { Metal } from '@/types/metal';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Flame, Target, Trophy, AlertTriangle } from 'lucide-react';
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
  bgGradient: string;
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

  const formatPrice = (price: number, unit: string) => {
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/${unit}`;
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
      iconColor: 'text-green-500',
      bgGradient: 'from-green-500/5 to-transparent',
      metal: topGainer,
      subtitle: topGainer ? `Best 24h performance` : undefined,
    },
    {
      title: 'Top Loser',
      icon: TrendingDown,
      iconColor: 'text-red-500',
      bgGradient: 'from-red-500/5 to-transparent',
      metal: topLoser,
      subtitle: topLoser ? `Worst 24h performance` : undefined,
    },
    {
      title: 'Trending',
      icon: Flame,
      iconColor: 'text-orange-500',
      bgGradient: 'from-orange-500/5 to-transparent',
      metal: trending,
      subtitle: trending ? `#1 by market cap` : undefined,
    },
    {
      title: 'Near ATH',
      icon: Target,
      iconColor: 'text-primary',
      bgGradient: 'from-primary/5 to-transparent',
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {validCards.map(({ title, icon: Icon, iconColor, bgGradient, metal, subtitle }) => {
        if (!metal) return null;

        const isPositive = metal.change24h >= 0;

        return (
          <Card
            key={title}
            className={cn(
              'cursor-pointer transition-all duration-200',
              'hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20',
              'border-border/50 hover:border-border',
              `bg-gradient-to-br ${bgGradient}`
            )}
            onClick={() => onMetalClick(metal.id)}
          >
            <CardContent className="p-4">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={cn('p-1.5 rounded-md', getCategoryBgColor(metal.category))}>
                    <Icon className={cn('h-4 w-4', iconColor)} />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {title}
                  </span>
                </div>
                <span className={cn(
                  'text-xs font-medium px-2 py-0.5 rounded-full',
                  getCategoryBgColor(metal.category),
                  getCategoryColor(metal.category)
                )}>
                  {metal.category}
                </span>
              </div>

              {/* Metal Info */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-lg truncate">{metal.name}</div>
                  <div className="text-sm text-muted-foreground font-mono">{metal.symbol}</div>
                </div>
                <div className="w-20 h-12 flex-shrink-0">
                  <MiniChart data={metal.sparklineData} isPositive={metal.change7d >= 0} />
                </div>
              </div>

              {/* Price & Change */}
              <div className="mt-3 flex items-end justify-between gap-2">
                <div className="font-mono text-sm font-medium truncate">
                  {formatPrice(metal.price, metal.priceUnit)}
                </div>
                <div
                  className={cn(
                    'flex items-center gap-1 text-sm font-bold flex-shrink-0',
                    isPositive ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-3.5 w-3.5" />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" />
                  )}
                  {isPositive ? '+' : ''}
                  {metal.change24h.toFixed(2)}%
                </div>
              </div>

              {/* Subtitle */}
              {subtitle && (
                <div className="mt-2 pt-2 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">
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
