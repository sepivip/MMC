'use client';

import { useState, useEffect } from 'react';
import { Metal } from '@/types/metal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRightLeft } from 'lucide-react';

interface PriceConverterProps {
  metal: Metal;
}

export function PriceConverter({ metal }: PriceConverterProps) {
  const [metalAmount, setMetalAmount] = useState('1');
  const [usdAmount, setUsdAmount] = useState(metal.price.toFixed(2));

  useEffect(() => {
    const amount = parseFloat(metalAmount) || 0;
    setUsdAmount((amount * metal.price).toFixed(2));
  }, [metal.price, metalAmount]);

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

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{metal.symbol} to USD Converter</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">
              {metal.symbol}
            </label>
            <Input
              type="number"
              value={metalAmount}
              onChange={(e) => handleMetalChange(e.target.value)}
              className="font-mono"
              step="any"
            />
          </div>
          <ArrowRightLeft className="h-4 w-4 text-muted-foreground mt-5 flex-shrink-0" />
          <div className="flex-1">
            <label className="text-xs text-muted-foreground mb-1 block">
              USD
            </label>
            <Input
              type="number"
              value={usdAmount}
              onChange={(e) => handleUsdChange(e.target.value)}
              className="font-mono"
              step="any"
            />
          </div>
        </div>
        <div className="mt-3 text-xs text-muted-foreground text-center">
          1 {metal.symbol} = ${metal.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
        </div>
      </CardContent>
    </Card>
  );
}
