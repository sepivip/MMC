'use client';

import { Metal } from '@/types/metal';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface ShareCardProps {
  metal: Metal;
  format: 'landscape' | 'square';
}

export const ShareCard = forwardRef<HTMLDivElement, ShareCardProps>(
  function ShareCard({ metal, format }, ref) {
    const isLandscape = format === 'landscape';
    const isPositive = metal.change24h >= 0;

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

    const getCategoryColors = (category: string) => {
      switch (category) {
        case 'precious':
          return { bg: 'bg-amber-500/20', text: 'text-amber-400', gradient: 'from-amber-500/10' };
        case 'industrial':
          return { bg: 'bg-blue-500/20', text: 'text-blue-400', gradient: 'from-blue-500/10' };
        case 'battery':
          return { bg: 'bg-purple-500/20', text: 'text-purple-400', gradient: 'from-purple-500/10' };
        default:
          return { bg: 'bg-gray-500/20', text: 'text-gray-400', gradient: 'from-gray-500/10' };
      }
    };

    const categoryColors = getCategoryColors(metal.category);

    return (
      <div
        ref={ref}
        className={cn(
          'relative overflow-hidden text-white',
          isLandscape ? 'w-[600px] h-[315px]' : 'w-[540px] h-[540px]'
        )}
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        }}
      >
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Accent gradient based on category */}
        <div className={cn(
          'absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl to-transparent opacity-30',
          categoryColors.gradient
        )} />

        {/* Content */}
        <div className={cn(
          'relative h-full flex flex-col',
          isLandscape ? 'p-6' : 'p-8'
        )}>
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className={cn(
                'rounded-xl flex items-center justify-center font-bold shadow-lg',
                categoryColors.bg,
                categoryColors.text,
                isLandscape ? 'w-14 h-14 text-xl' : 'w-16 h-16 text-2xl'
              )}>
                {metal.symbol.slice(0, 2)}
              </div>
              <div>
                <div className={cn(
                  'font-bold',
                  isLandscape ? 'text-2xl' : 'text-3xl'
                )}>{metal.name}</div>
                <div className="text-sm text-slate-400 font-mono mt-0.5">{metal.symbol}/USD</div>
              </div>
            </div>
            <div className="text-right">
              <div className={cn(
                'text-xs px-2.5 py-1 rounded-full inline-block mb-1.5',
                categoryColors.bg,
                categoryColors.text
              )}>
                {getCategoryLabel(metal.category)}
              </div>
              <div className={cn(
                'text-sm font-bold px-3 py-1 rounded-lg inline-block',
                isPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              )}>
                {isPositive ? 'BULLISH' : 'BEARISH'}
              </div>
            </div>
          </div>

          {/* Sparkline Visual */}
          <div className={cn('flex-1 relative', isLandscape ? 'my-2' : 'my-4')}>
            <svg
              viewBox="0 0 100 40"
              className="w-full h-full"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id={`gradient-${metal.id}-share`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity="0.4" />
                  <stop offset="50%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity="0.1" />
                  <stop offset="100%" stopColor={isPositive ? '#22c55e' : '#ef4444'} stopOpacity="0" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              {metal.sparklineData && metal.sparklineData.length > 1 && (
                <>
                  <path
                    d={generateSparklinePath(metal.sparklineData, true)}
                    fill={`url(#gradient-${metal.id}-share)`}
                  />
                  <path
                    d={generateSparklinePath(metal.sparklineData, false)}
                    fill="none"
                    stroke={isPositive ? '#22c55e' : '#ef4444'}
                    strokeWidth="2"
                    filter="url(#glow)"
                  />
                </>
              )}
            </svg>
          </div>

          {/* Price Section */}
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wider mb-1.5">Current Price</div>
              <div className={cn(
                'font-bold tracking-tight tabular-nums',
                isLandscape ? 'text-4xl' : 'text-5xl'
              )}>
                ${metal.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-sm text-slate-400 mt-1">per {metal.priceUnit}</div>
            </div>
            <div className="text-right">
              <div className={cn(
                'flex items-center justify-end gap-2 font-bold tabular-nums',
                isPositive ? 'text-green-400' : 'text-red-400',
                isLandscape ? 'text-2xl' : 'text-3xl'
              )}>
                {isPositive ? <TrendingUp className={isLandscape ? 'h-6 w-6' : 'h-7 w-7'} /> : <TrendingDown className={isLandscape ? 'h-6 w-6' : 'h-7 w-7'} />}
                {isPositive ? '+' : ''}{metal.change24h.toFixed(2)}%
              </div>
              <div className="text-sm text-slate-500 mt-1">24h change</div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/50">
            <div className="text-xs text-slate-500 font-mono">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <div className="text-sm text-slate-300 font-semibold tracking-wide">
                MetalMarketCap
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

function generateSparklinePath(data: number[], filled: boolean): string {
  if (!data || data.length < 2) return '';

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 40 - ((value - min) / range) * 35;
    return `${x},${y}`;
  });

  if (filled) {
    return `M0,40 L${points.join(' L')} L100,40 Z`;
  }

  return `M${points.join(' L')}`;
}
