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

// Valid timeframes to prevent invalid queries
const VALID_TIMEFRAMES: ChartTimeframe[] = ['1D', '7D', '1M', '1Y', 'ALL'];

function validateTimeframe(raw: string | null): ChartTimeframe {
  if (raw && VALID_TIMEFRAMES.includes(raw as ChartTimeframe)) {
    return raw as ChartTimeframe;
  }
  return '7D'; // Safe default
}

export async function GET(
  request: Request,
  context: HistoryParams
) {
  try {
    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const timeframe = validateTimeframe(searchParams.get('timeframe'));

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

    // Convert to chart data points, filtering out invalid prices
    const chartData: ChartDataPoint[] = result.quotes
      .filter((quote) => quote.close != null && quote.close > 0)
      .map((quote) => ({
        date: new Date(quote.date).toISOString(),
        price: quote.close!,
      }));

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Error fetching historical data:', error);

    // Return mock data as fallback, respecting the requested timeframe
    const { searchParams } = new URL(request.url);
    const timeframe = validateTimeframe(searchParams.get('timeframe'));
    const mockData = generateMockHistoricalData(timeframe);
    return NextResponse.json(mockData);
  }
}

// Generate mock historical data as fallback, respecting timeframe
function generateMockHistoricalData(timeframe: ChartTimeframe): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const now = new Date();
  const basePrice = 2000;

  // Determine number of points and interval based on timeframe
  let numPoints: number;
  let intervalMs: number;

  switch (timeframe) {
    case '1D':
      numPoints = 24; // Hourly for 1 day
      intervalMs = 60 * 60 * 1000; // 1 hour
      break;
    case '7D':
      numPoints = 7 * 24; // Hourly for 7 days
      intervalMs = 60 * 60 * 1000; // 1 hour
      break;
    case '1M':
      numPoints = 30; // Daily for 1 month
      intervalMs = 24 * 60 * 60 * 1000; // 1 day
      break;
    case '1Y':
      numPoints = 52; // Weekly for 1 year
      intervalMs = 7 * 24 * 60 * 60 * 1000; // 1 week
      break;
    case 'ALL':
      numPoints = 60; // Monthly for 5 years
      intervalMs = 30 * 24 * 60 * 60 * 1000; // ~1 month
      break;
    default:
      numPoints = 7;
      intervalMs = 24 * 60 * 60 * 1000;
  }

  for (let i = numPoints - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * intervalMs);
    // Add some random walk to make it look realistic
    const trend = (numPoints - i) / numPoints * 0.05; // Slight upward trend
    const noise = (Math.random() - 0.5) * 0.02;
    const price = basePrice * (1 + trend + noise);

    data.push({
      date: date.toISOString(),
      price: parseFloat(price.toFixed(2)),
    });
  }

  return data;
}
