'use client';

import { Metal } from '@/types/metal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AboutMetalProps {
  metal: Metal;
}

export function AboutMetal({ metal }: AboutMetalProps) {
  if (!metal.description) return null;

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'precious':
        return 'Precious Metal';
      case 'industrial':
        return 'Industrial Metal';
      case 'battery':
        return 'Battery Metal';
      default:
        return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'precious':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'industrial':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'battery':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      default:
        return 'text-muted-foreground bg-muted/10 border-border';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Info className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            About {metal.name}
          </CardTitle>
          <span className={cn(
            'text-xs font-medium px-2.5 py-1 rounded-full border',
            getCategoryColor(metal.category)
          )}>
            {getCategoryLabel(metal.category)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Description with better typography */}
        <div className="relative">
          <p className="text-sm text-muted-foreground leading-relaxed tracking-wide first-letter:text-lg first-letter:font-semibold first-letter:text-foreground">
            {metal.description}
          </p>
        </div>

        {/* Quick Facts Section */}
        <div className="pt-4 border-t border-border/50">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Quick Facts
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <div className="text-xs text-muted-foreground mb-1">Trading Symbol</div>
              <div className="font-mono font-semibold text-sm">{metal.symbol}</div>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <div className="text-xs text-muted-foreground mb-1">Price Unit</div>
              <div className="font-semibold text-sm capitalize">per {metal.priceUnit}</div>
            </div>
          </div>
        </div>

        {/* Learn More Link */}
        <div className="pt-2">
          <a
            href={`https://en.wikipedia.org/wiki/${metal.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center gap-1.5 text-xs text-primary',
              'hover:text-primary/80 transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded'
            )}
          >
            Learn more about {metal.name}
            <ExternalLink className="h-3 w-3" aria-hidden="true" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
