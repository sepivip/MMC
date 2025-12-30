'use client';

import { cn } from '@/lib/utils';

interface MiniChartProps {
  data: number[];
  isPositive: boolean;
  width?: number;
  height?: number;
}

export function MiniChart({ data, isPositive, width = 100, height = 40 }: MiniChartProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="block w-full h-full overflow-hidden"
      preserveAspectRatio="none"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          isPositive ? 'text-green-500' : 'text-red-500'
        )}
      />
    </svg>
  );
}
