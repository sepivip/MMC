import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import { metalTickers, yahooFinanceUnits } from '@/lib/yahooTickers';
import { mockMetals } from '@/data/mockMetals';
import { Metal } from '@/types/metal';

const yahooFinance = new YahooFinance({
  suppressNotices: ['yahooSurvey']
});

// Cache response for 60 seconds - all users share the same cached data
// This prevents hitting Yahoo Finance rate limits
export const revalidate = 60;

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

    // Fetch quotes individually for better error handling
    const quotePromises = tickers.map(ticker =>
      yahooFinance.quote(ticker).catch(err => {
        console.error(`Failed to fetch ${ticker}:`, err.message);
        return null;
      })
    );

    const quotes = await Promise.all(quotePromises);

    // Convert quotes array to map for easier lookup
    interface QuoteData {
      regularMarketPrice?: number;
      regularMarketPreviousClose?: number;
      fiftyTwoWeekLow?: number;
      fiftyTwoWeekHigh?: number;
      regularMarketChangePercent?: number;
    }

    const quotesMap = new Map<string, QuoteData>();

    quotes.forEach((quote, index) => {
      if (quote && typeof quote === 'object') {
        const ticker = tickers[index];
        quotesMap.set(ticker, quote as QuoteData);
      }
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

      return {
        ...metal,
        price: parseFloat(currentPrice.toFixed(2)),
        priceUnit: realUnit, // Use actual Yahoo Finance unit
        change24h: parseFloat(change24h.toFixed(2)),
        change7d: parseFloat(change7d.toFixed(2)),
        marketCap: Math.round(calculatedMarketCap), // Dynamic market cap
        sparklineData: generateRealisticSparkline(currentPrice, change7d),
      };
    });

    return NextResponse.json(updatedMetals);
  } catch (error) {
    console.error('Error fetching metal prices:', error);

    // Return mock data as fallback
    return NextResponse.json(mockMetals);
  }
}
