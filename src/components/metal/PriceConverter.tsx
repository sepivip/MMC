'use client';

import { useState, useEffect, useId } from 'react';
import { Metal } from '@/types/metal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRightLeft, Calculator, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PriceConverterProps {
  metal: Metal;
}

export function PriceConverter({ metal }: PriceConverterProps) {
  const [metalAmount, setMetalAmount] = useState('1');
  const [usdAmount, setUsdAmount] = useState(metal.price.toFixed(2));
  const [activeField, setActiveField] = useState<'metal' | 'usd' | null>(null);
  const metalInputId = useId();
  const usdInputId = useId();

  useEffect(() => {
    const amount = parseFloat(metalAmount) || 0;
    setUsdAmount((amount * metal.price).toFixed(2));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metal.price]);

  const handleMetalChange = (value: string) => {
    setMetalAmount(value);
    const amount = parseFloat(value) || 0;
    setUsdAmount((amount * metal.price).toFixed(2));
  };

  const handleUsdChange = (value: string) => {
    setUsdAmount(value);
    const amount = parseFloat(value) || 0;
    setMetalAmount((amount / metal.price).toFixed(6));
  };

  if (metal.isMockData) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{metal.symbol} to USD Converter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-4">
            Price data unavailable
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          {metal.symbol} to USD Converter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-stretch gap-2">
          {/* Metal Input */}
          <div className="flex-1 space-y-1.5">
            <label
              htmlFor={metalInputId}
              className={cn(
                'text-xs font-medium transition-colors block',
                activeField === 'metal' ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {metal.symbol} ({metal.priceUnit})
            </label>
            <div className="relative">
              <Input
                id={metalInputId}
                type="number"
                value={metalAmount}
                onChange={(e) => handleMetalChange(e.target.value)}
                onFocus={() => setActiveField('metal')}
                onBlur={() => setActiveField(null)}
                className={cn(
                  'font-mono text-right pr-3 tabular-nums',
                  'transition-all duration-200',
                  activeField === 'metal' && 'ring-2 ring-primary/20'
                )}
                step="any"
                aria-describedby={`${metalInputId}-desc`}
              />
            </div>
          </div>

          {/* Exchange Icon */}
          <div className="flex items-center justify-center pt-6">
            <div
              className={cn(
                'p-2 rounded-lg bg-muted/50 transition-all duration-300',
                activeField && 'bg-primary/10'
              )}
            >
              <ArrowRightLeft
                className={cn(
                  'h-4 w-4 transition-all duration-300',
                  activeField ? 'text-primary' : 'text-muted-foreground'
                )}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* USD Input */}
          <div className="flex-1 space-y-1.5">
            <label
              htmlFor={usdInputId}
              className={cn(
                'text-xs font-medium transition-colors flex items-center gap-1',
                activeField === 'usd' ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <DollarSign className="h-3 w-3" aria-hidden="true" />
              USD
            </label>
            <div className="relative">
              <Input
                id={usdInputId}
                type="number"
                value={usdAmount}
                onChange={(e) => handleUsdChange(e.target.value)}
                onFocus={() => setActiveField('usd')}
                onBlur={() => setActiveField(null)}
                className={cn(
                  'font-mono text-right pr-3 tabular-nums',
                  'transition-all duration-200',
                  activeField === 'usd' && 'ring-2 ring-primary/20'
                )}
                step="any"
                aria-describedby={`${usdInputId}-desc`}
              />
            </div>
          </div>
        </div>

        {/* Exchange Rate Display */}
        <div className="mt-4 pt-3 border-t border-border/50">
          <div className="flex items-center justify-center gap-2 text-xs">
            <span className="text-muted-foreground">Current rate:</span>
            <span className="font-mono font-semibold text-foreground tabular-nums">
              1 {metal.symbol} = ${metal.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
