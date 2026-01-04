'use client';

import { Metal } from '@/types/metal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { BarChart3, TrendingUp, Package, Factory, ShoppingCart, Target } from 'lucide-react';

interface KeyStatisticsProps {
  metal: Metal;
}

export function KeyStatistics({ metal }: KeyStatisticsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const formatSupply = (supply: number) => {
    if (supply >= 1e9) return `${(supply / 1e9).toFixed(2)}B tons`;
    if (supply >= 1e6) return `${(supply / 1e6).toFixed(2)}M tons`;
    if (supply >= 1e3) return `${(supply / 1e3).toFixed(2)}K tons`;
    return `${supply.toLocaleString()} tons`;
  };

  const stats = [
    {
      label: 'Market Cap',
      value: metal.isMockData ? '-' : formatNumber(metal.marketCap),
      icon: BarChart3,
      iconColor: 'text-primary/60',
    },
    {
      label: 'All-Time High',
      value: metal.isMockData ? '-' : (metal.athPrice
        ? `$${metal.athPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : '-'),
      sublabel: metal.isMockData ? undefined : (metal.athDate
        ? new Date(metal.athDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : undefined),
      icon: TrendingUp,
      iconColor: 'text-amber-400/60',
    },
    {
      label: '% from ATH',
      value: metal.isMockData ? '-' : (metal.percentFromAth !== undefined ? `${metal.percentFromAth.toFixed(2)}%` : '-'),
      valueClass: metal.isMockData ? undefined : (metal.percentFromAth !== undefined && metal.percentFromAth >= -5 ? 'text-green-400' : 'text-red-400'),
      icon: Target,
      iconColor: metal.isMockData ? 'text-muted-foreground/60' : (metal.percentFromAth !== undefined && metal.percentFromAth >= -5 ? 'text-green-400/60' : 'text-red-400/60'),
    },
    {
      label: 'Total Supply',
      value: formatSupply(metal.supply),
      icon: Package,
      iconColor: 'text-blue-400/60',
    },
    {
      label: 'Annual Demand',
      value: formatSupply(metal.demand),
      icon: ShoppingCart,
      iconColor: 'text-purple-400/60',
    },
    {
      label: 'Annual Production',
      value: formatSupply(metal.production),
      icon: Factory,
      iconColor: 'text-emerald-400/60',
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          Key Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={cn(
                'flex items-center justify-between py-2.5 px-2 -mx-2 rounded-lg',
                'transition-colors duration-200',
                'hover:bg-accent/50',
                'group'
              )}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={cn('h-4 w-4 transition-colors', stat.iconColor, 'group-hover:opacity-100')}
                  aria-hidden="true"
                />
                <span className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">
                  {stat.label}
                </span>
              </div>
              <div className="text-right">
                <span className={cn(
                  'text-sm font-semibold tabular-nums',
                  stat.valueClass || 'text-foreground'
                )}>
                  {stat.value}
                </span>
                {stat.sublabel && (
                  <div className="text-[11px] text-muted-foreground/70 mt-0.5">{stat.sublabel}</div>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
