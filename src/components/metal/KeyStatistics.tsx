'use client';

import { Metal } from '@/types/metal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
      value: formatNumber(metal.marketCap),
    },
    {
      label: 'All-Time High',
      value: metal.athPrice
        ? `$${metal.athPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : '-',
      sublabel: metal.athDate
        ? new Date(metal.athDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : undefined,
    },
    {
      label: '% from ATH',
      value: metal.percentFromAth !== undefined ? `${metal.percentFromAth.toFixed(2)}%` : '-',
      valueClass: metal.percentFromAth !== undefined && metal.percentFromAth >= -5 ? 'text-green-500' : 'text-red-500',
    },
    {
      label: 'Total Supply',
      value: formatSupply(metal.supply),
    },
    {
      label: 'Annual Demand',
      value: formatSupply(metal.demand),
    },
    {
      label: 'Annual Production',
      value: formatSupply(metal.production),
    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Key Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <div className="text-right">
              <span className={cn('text-sm font-medium', stat.valueClass)}>
                {stat.value}
              </span>
              {stat.sublabel && (
                <div className="text-xs text-muted-foreground">{stat.sublabel}</div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
