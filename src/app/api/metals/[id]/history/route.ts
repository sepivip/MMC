import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import { metalTickers } from '@/lib/yahooTickers';
import { ChartTimeframe, ChartDataPoint } from '@/types/metal';

const yahooFinance = new YahooFinance({
  suppressNotices: ['yahooSurvey']
});

// Cache response for 5 minutes - historical data doesn't change frequently
// This prevents hitting Yahoo Finance rate limits
export const revalidate = 300;

interface HistoryParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  request: Request,
  context: HistoryParams
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const timeframe = (searchParams.get('timeframe') as ChartTimeframe) || '7D';

    const ticker = metalTickers[id];
    if (!ticker) {
      return NextResponse.json(
        { error: 'Metal not found' },
        { status: 404 }
      );
    }

    // Calculate date range based on timeframe
    const now = new Date();
    const getStartDate = (tf: ChartTimeframe): Date => {
      const date = new Date();
      switch (tf) {
        case '1D':
          date.setDate(now.getDate() - 1);
          break;
        case '7D':
          date.setDate(now.getDate() - 7);
          break;
        case '1M':
          date.setMonth(now.getMonth() - 1);
          break;
        case '1Y':
          date.setFullYear(now.getFullYear() - 1);
          break;
        case 'ALL':
          date.setFullYear(now.getFullYear() - 5);
          break;
      }
      return date;
    };

    // Get interval based on timeframe
    const getInterval = (tf: ChartTimeframe): '1m' | '5m' | '1h' | '1d' => {
      switch (tf) {
        case '1D':
          return '5m';
        case '7D':
          return '1h';
        case '1M':
          return '1d';
        case '1Y':
        case 'ALL':
          return '1d';
        default:
          return '1d';
      }
    };

    const startDate = getStartDate(timeframe);
    const interval = getInterval(timeframe);

    // Fetch historical data
    const result = await yahooFinance.chart(ticker, {
      period1: startDate,
      period2: now,
      interval: interval,
    });

    // Convert to chart data points
    const chartData: ChartDataPoint[] = result.quotes.map((quote) => ({
      date: new Date(quote.date).toISOString(),
      price: quote.close || 0,
    }));

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Error fetching historical data:', error);

    // Return mock data as fallback
    const mockData = generateMockHistoricalData();
    return NextResponse.json(mockData);
  }
}

// Generate mock historical data as fallback
function generateMockHistoricalData(): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const now = new Date();
  const basePrice = 2000;

  for (let i = 7; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const price = basePrice + (Math.random() - 0.5) * 200;

    data.push({
      date: date.toISOString(),
      price: parseFloat(price.toFixed(2)),
    });
  }

  return data;
}
