'use client';

import { useState, useEffect } from 'react';
import { ChartTimeframe, ChartDataPoint } from '@/types/metal';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface PriceChartProps {
  metalId: string;
  timeframe: ChartTimeframe;
}

export function PriceChart({ metalId, timeframe }: PriceChartProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchHistoricalData() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/metals/${metalId}/history?timeframe=${timeframe}`);
        if (response.ok) {
          const data = await response.json();
          // Format dates for display
          const formattedData = data.map((point: ChartDataPoint) => ({
            ...point,
            date: timeframe === '1D'
              ? new Date(point.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
              : new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          }));
          setChartData(formattedData);
        }
      } catch (error) {
        console.error('Failed to fetch historical data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchHistoricalData();
  }, [metalId, timeframe]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px] text-muted-foreground">
        Loading chart data...
      </div>
    );
  }

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
