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

export function MarketHighlightCards({ metals, onMetalClick }: MarketHighlightCardsProps) {
  // Find top gainer (highest 24h change)
  const topGainer = [...metals].sort((a, b) => b.change24h - a.change24h)[0];

  // Find top loser (lowest 24h change)
  const topLoser = [...metals].sort((a, b) => a.change24h - b.change24h)[0];

  // Find trending (use highest market cap change as proxy)
  const trending = [...metals].sort((a, b) => b.marketCap - a.marketCap)[0];

  // Find nearest to ATH
  const nearATH = [...metals]
    .filter((m) => m.percentFromAth !== undefined)
    .sort((a, b) => (b.percentFromAth || -100) - (a.percentFromAth || -100))[0];

  const formatPrice = (price: number, unit: string) => {
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/${unit}`;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'precious':
        return 'text-primary';
      case 'industrial':
        return 'text-blue-400';
      case 'battery':
        return 'text-purple-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const cards = [
    {
      title: 'Trending',
      icon: Flame,
      iconColor: 'text-orange-500',
      metal: trending,
    },
    {
      title: 'Top Gainer',
      icon: TrendingUp,
      iconColor: 'text-green-500',
      metal: topGainer,
    },
    {
      title: 'Top Loser',
      icon: TrendingDown,
      iconColor: 'text-red-500',
      metal: topLoser,
    },
    {
      title: 'Near ATH',
      icon: Target,
      iconColor: 'text-primary',
      metal: nearATH,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map(({ title, icon: Icon, iconColor, metal }) => {
        if (!metal) return null;

        return (
          <Card
            key={title}
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => onMetalClick(metal.id)}
          >
            <CardContent className="p-4">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className={cn('h-4 w-4', iconColor)} />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {title}
                  </span>
                </div>
                <span className={cn('text-xs font-medium', getCategoryColor(metal.category))}>
                  {metal.category}
                </span>
              </div>

              {/* Metal Info */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-lg">{metal.name}</div>
                  <div className="text-sm text-muted-foreground">{metal.symbol}</div>
                </div>
                <div className="w-16 h-10">
                  <MiniChart data={metal.sparklineData} isPositive={metal.change7d >= 0} />
                </div>
              </div>

              {/* Price & Change */}
              <div className="mt-3 flex items-end justify-between">
                <div className="font-mono text-sm">
                  {formatPrice(metal.price, metal.priceUnit)}
                </div>
                <div
                  className={cn(
                    'flex items-center gap-1 text-sm font-semibold',
                    metal.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {metal.change24h >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {metal.change24h >= 0 ? '+' : ''}
                  {metal.change24h.toFixed(2)}%
                </div>
              </div>

              {/* ATH info for Near ATH card */}
              {title === 'Near ATH' && metal.percentFromAth !== undefined && (
                <div className="mt-2 text-xs text-muted-foreground">
                  {metal.percentFromAth.toFixed(1)}% from ATH
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
