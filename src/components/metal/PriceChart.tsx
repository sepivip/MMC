'use client';

import { useMemo } from 'react';
import { ChartTimeframe, ChartDataPoint } from '@/types/metal';
import { mockMetals } from '@/data/mockMetals';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface PriceChartProps {
  metalId: string;
  timeframe: ChartTimeframe;
}

export function PriceChart({ metalId, timeframe }: PriceChartProps) {
  const chartData = useMemo(() => {
    const metal = mockMetals.find((m) => m.id === metalId);
    if (!metal) return [];

    // Generate mock historical data based on timeframe
    const dataPoints: ChartDataPoint[] = [];
    const now = new Date();
    let numPoints = 7;
    let interval = 1; // days

    switch (timeframe) {
      case '1D':
        numPoints = 24;
        interval = 1 / 24; // hours
        break;
      case '7D':
        numPoints = 7;
        interval = 1;
        break;
      case '1M':
        numPoints = 30;
        interval = 1;
        break;
      case '1Y':
        numPoints = 12;
        interval = 30;
        break;
      case 'ALL':
        numPoints = 24;
        interval = 30;
        break;
    }

    let currentPrice = metal.price;
    const volatility = 0.02;

    for (let i = numPoints - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i * interval);

      dataPoints.push({
        date: timeframe === '1D'
          ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
          : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        price: currentPrice,
      });

      // Random walk for next point
      const change = (Math.random() - 0.5) * 2 * volatility * currentPrice;
      currentPrice += change;
    }

    // Ensure last point matches current price
    dataPoints[dataPoints.length - 1].price = metal.price;

    return dataPoints;
  }, [metalId, timeframe]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
        No data available
      </div>
    );
  }

  const minPrice = Math.min(...chartData.map((d) => d.price));
  const maxPrice = Math.max(...chartData.map((d) => d.price));
  const isPositive = chartData[chartData.length - 1].price >= chartData[0].price;

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={[minPrice * 0.995, maxPrice * 1.005]}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--popover))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
            itemStyle={{ color: 'hsl(var(--foreground))' }}
            formatter={(value: number) => [
              `$${value.toFixed(2)}`,
              'Price',
            ]}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={isPositive ? '#22c55e' : '#ef4444'}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: isPositive ? '#22c55e' : '#ef4444' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
