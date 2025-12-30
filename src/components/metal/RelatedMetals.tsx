'use client';

import { Metal } from '@/types/metal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">You might be interested in</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {relatedMetals.map((metal) => (
          <div
            key={metal.id}
            onClick={() => onMetalClick(metal.id)}
            className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
          >
            <div>
              <div className="font-medium">{metal.name}</div>
              <div className="text-xs text-muted-foreground">{metal.symbol}</div>
            </div>
            <div className="text-right">
              <div className="font-mono text-sm">
                ${metal.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div
                className={cn(
                  'flex items-center justify-end gap-1 text-xs font-medium',
                  metal.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                )}
              >
                {metal.change24h >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {metal.change24h >= 0 ? '+' : ''}{metal.change24h.toFixed(2)}%
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
