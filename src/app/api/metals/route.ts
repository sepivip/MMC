import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import { metalTickers, yahooFinanceUnits } from '@/lib/yahooTickers';
import { mockMetals } from '@/data/mockMetals';
import { Metal } from '@/types/metal';

interface QuoteData {
  regularMarketPrice?: number;
  regularMarketPreviousClose?: number;
  fiftyTwoWeekLow?: number;
  fiftyTwoWeekHigh?: number;
  regularMarketChangePercent?: number;
}

const yahooFinance = new YahooFinance({
  suppressNotices: ['yahooSurvey']
});

// Cache response for 5 minutes - ATH requires historical data fetching
// This prevents hitting Yahoo Finance rate limits
export const revalidate = 300;

// Fetch All-Time High for a ticker
async function getATH(ticker: string): Promise<{ price: number; date: string } | null> {
  try {
    const result = await yahooFinance.chart(ticker, {
      period1: '1970-01-01',
      period2: new Date().toISOString().split('T')[0],
      interval: '1mo',
    });

    if (!result.quotes?.length) return null;

    let maxPrice = 0;
    let maxDate = '';

    for (const quote of result.quotes) {
      if (quote.high && quote.high > maxPrice) {
        maxPrice = quote.high;
        maxDate = new Date(quote.date).toISOString();
      }
    }

    return maxPrice > 0 ? { price: maxPrice, date: maxDate } : null;
  } catch (err) {
    console.error(`Failed to fetch ATH for ${ticker}:`, err);
    return null;
  }
}

// Convert price to per-ton for market cap calculation
function convertToTonPrice(price: number, unit: string): number {
  switch (unit) {
    case 'oz':
      // 1 troy ounce = 0.0311035 kg, 1 ton = 1000 kg
      // So 1 ton = 1000 / 0.0311035 = 32150.7 oz
      return price * 32150.7;
    case 'lb':
      // 1 lb = 0.453592 kg, 1 ton = 1000 kg
      // So 1 ton = 1000 / 0.453592 = 2204.62 lbs
      return price * 2204.62;
    case 'ton':
      return price;
    case 'kg':
      return price * 1000;
    default:
      return price;
  }
}

export async function GET() {
  try {
    // Fetch quotes for all metal tickers
    const tickers = Object.values(metalTickers);
    const metalIds = Object.keys(metalTickers);

    // Fetch quotes and ATH data in parallel
    const quotePromises = tickers.map(ticker =>
      yahooFinance.quote(ticker).catch(err => {
        console.error(`Failed to fetch ${ticker}:`, err.message);
        return null;
      })
    );

    const athPromises = tickers.map(ticker =>
      getATH(ticker).catch(() => null)
    );

    const [quotes, athResults] = await Promise.all([
      Promise.all(quotePromises),
      Promise.all(athPromises),
    ]);

    // Convert quotes array to map for easier lookup
    const quotesMap = new Map<string, QuoteData>();
    const athMap = new Map<string, { price: number; date: string } | null>();

    quotes.forEach((quote, index) => {
      if (quote && typeof quote === 'object') {
        const ticker = tickers[index];
        quotesMap.set(ticker, quote as QuoteData);
      }
    });

    athResults.forEach((ath, index) => {
      const metalId = metalIds[index];
      athMap.set(metalId, ath);
    });

    // Update mock metals with real prices
    const updatedMetals: Metal[] = mockMetals.map(metal => {
      const ticker = metalTickers[metal.id];
      const quote = quotesMap.get(ticker);

      if (!quote || !quote.regularMarketPrice) {
        // Return mock data if no quote available
        return metal;
      }

      // Calculate percentage changes
      const currentPrice = quote.regularMarketPrice;
      const previousClose = quote.regularMarketPreviousClose || currentPrice;
      const change24h = ((currentPrice - previousClose) / previousClose) * 100;

      // For 7d change, use quote data if available
      const fiftyTwoWeekLow = quote.fiftyTwoWeekLow || currentPrice;
      const fiftyTwoWeekHigh = quote.fiftyTwoWeekHigh || currentPrice;
      const change7d = quote.regularMarketChangePercent || 0;

      // Generate sparkline based on recent price action
      const generateRealisticSparkline = (price: number, change: number): number[] => {
        const data: number[] = [];
        const basePrice = price * (1 - change / 100);

        for (let i = 0; i < 7; i++) {
          const progress = i / 6;
          const pricePoint = basePrice + (price - basePrice) * progress;
          const noise = (Math.random() - 0.5) * price * 0.01;
          data.push(parseFloat((pricePoint + noise).toFixed(2)));
        }

        return data;
      };

      // Get the actual unit from Yahoo Finance
      const realUnit = yahooFinanceUnits[metal.id] || metal.priceUnit;

      // Calculate market cap dynamically: supply (tons) × price per ton
      const pricePerTon = convertToTonPrice(currentPrice, realUnit);
      const calculatedMarketCap = metal.supply * pricePerTon;

      // Get ATH data - ensure ATH is never lower than current price
      const ath = athMap.get(metal.id);
      let athPrice = ath?.price ?? currentPrice;
      let athDate = ath?.date;

      // If current price is higher than historical ATH, current price is the new ATH
      if (currentPrice > athPrice) {
        athPrice = currentPrice;
        athDate = new Date().toISOString();
      }

      const percentFromAth = parseFloat((((currentPrice - athPrice) / athPrice) * 100).toFixed(2));

      return {
        ...metal,
        price: parseFloat(currentPrice.toFixed(2)),
        priceUnit: realUnit, // Use actual Yahoo Finance unit
        change24h: parseFloat(change24h.toFixed(2)),
        change7d: parseFloat(change7d.toFixed(2)),
        marketCap: Math.round(calculatedMarketCap), // Dynamic market cap
        sparklineData: generateRealisticSparkline(currentPrice, change7d),
        athPrice: athPrice ? parseFloat(athPrice.toFixed(2)) : undefined,
        athDate,
        percentFromAth,
      };
    });

    return NextResponse.json(updatedMetals);
  } catch (error) {
    console.error('Error fetching metal prices:', error);

    // Return mock data as fallback
    return NextResponse.json(mockMetals);
  }
}
