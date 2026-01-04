'use client';

import { Metal } from '@/types/metal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Sparkles, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RelatedMetalsProps {
  currentMetal: Metal;
  allMetals: Metal[];
  onMetalClick: (metalId: string) => void;
}

export function RelatedMetals({ currentMetal, allMetals, onMetalClick }: RelatedMetalsProps) {
  // Get metals in the same category, excluding current metal
  const relatedMetals = allMetals
    .filter((m) => m.category === currentMetal.category && m.id !== currentMetal.id)
    .slice(0, 3);

  // If not enough metals in same category, add some from other categories
  if (relatedMetals.length < 3) {
    const otherMetals = allMetals
      .filter((m) => m.id !== currentMetal.id && !relatedMetals.some((r) => r.id === m.id))
      .slice(0, 3 - relatedMetals.length);
    relatedMetals.push(...otherMetals);
  }

  if (relatedMetals.length === 0) return null;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'precious':
        return 'text-amber-400 bg-amber-500/10';
      case 'industrial':
        return 'text-blue-400 bg-blue-500/10';
      case 'battery':
        return 'text-purple-400 bg-purple-500/10';
      default:
        return 'text-muted-foreground bg-muted/10';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          You might be interested in
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {relatedMetals.map((metal) => {
          const isPositive = metal.change24h >= 0;
          const isSameCategory = metal.category === currentMetal.category;

          return (
            <div
              key={metal.id}
              onClick={() => onMetalClick(metal.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onMetalClick(metal.id);
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`View ${metal.name} - ${isPositive ? '+' : ''}${metal.change24h.toFixed(2)}%`}
              className={cn(
                'flex items-center justify-between p-3 rounded-lg',
                'border border-border/50',
                'transition-all duration-200 ease-out',
                'hover:bg-accent/40 hover:border-border hover:translate-x-1',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                'cursor-pointer group'
              )}
            >
              <div className="flex items-center gap-3">
                {/* Metal Symbol Badge */}
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  'text-xs font-bold transition-transform duration-200 group-hover:scale-105',
                  getCategoryColor(metal.category)
                )}>
                  {metal.symbol.slice(0, 3)}
                </div>
                <div>
                  <div className="font-medium text-sm group-hover:text-foreground transition-colors">
                    {metal.name}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground font-mono">{metal.symbol}</span>
                    {isSameCategory && (
                      <span className="text-[10px] text-muted-foreground/60 px-1.5 py-0.5 bg-muted/30 rounded">
                        Same category
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-mono text-sm font-semibold tabular-nums">
                    ${metal.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div
                    className={cn(
                      'flex items-center justify-end gap-1 text-xs font-semibold tabular-nums',
                      isPositive ? 'text-green-400' : 'text-red-400'
                    )}
                  >
                    {isPositive ? (
                      <TrendingUp className="h-3 w-3" aria-hidden="true" />
                    ) : (
                      <TrendingDown className="h-3 w-3" aria-hidden="true" />
                    )}
                    {isPositive ? '+' : ''}{metal.change24h.toFixed(2)}%
                  </div>
                </div>
                <ChevronRight
                  className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground group-hover:translate-x-0.5 transition-all"
                  aria-hidden="true"
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
