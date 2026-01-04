'use client';

import { cn } from '@/lib/utils';
import { useMemo, useId } from 'react';

interface MiniChartProps {
  data: number[];
  isPositive: boolean;
  width?: number;
  height?: number;
  showGradient?: boolean;
}

export function MiniChart({ data, isPositive, width = 100, height = 40, showGradient = true }: MiniChartProps) {
  const gradientId = useId();

  const { linePath, areaPath } = useMemo(() => {
    if (data.length < 2) return { linePath: '', areaPath: '' };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    // Generate points with slight padding
    const padding = height * 0.1;
    const effectiveHeight = height - padding * 2;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = padding + effectiveHeight - ((value - min) / range) * effectiveHeight;
      return { x, y };
    });

    // Create smooth curve using cardinal spline interpolation
    const linePath = createSmoothPath(points);

    // Create area path for gradient fill
    const areaPath = linePath + ` L${width},${height} L0,${height} Z`;

    return { linePath, areaPath };
  }, [data, width, height]);

  if (data.length < 2) return null;

  const strokeColor = isPositive ? '#22c55e' : '#ef4444';
  const gradientStartColor = isPositive ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)';
  const gradientEndColor = isPositive ? 'rgba(34, 197, 94, 0)' : 'rgba(239, 68, 68, 0)';

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="block w-full h-full overflow-visible"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={gradientStartColor} />
          <stop offset="100%" stopColor={gradientEndColor} />
        </linearGradient>
      </defs>

      {/* Gradient fill area */}
      {showGradient && (
        <path
          d={areaPath}
          fill={`url(#${gradientId})`}
          className="transition-opacity duration-300"
        />
      )}

      {/* Main line */}
      <path
        d={linePath}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-all duration-300"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// Create a smooth curve path using Catmull-Rom to Bezier conversion
function createSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  if (points.length === 2) {
    return `M${points[0].x},${points[0].y} L${points[1].x},${points[1].y}`;
  }

  const tension = 0.3; // Controls the smoothness (0 = straight lines, 1 = very curved)

  let path = `M${points[0].x},${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    // Calculate control points
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    path += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }

  return path;
}
