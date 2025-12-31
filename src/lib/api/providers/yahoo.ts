/**
 * Yahoo Finance API Provider
 * Fetches commodity/metal prices from Yahoo Finance
 * Uses yahoo-finance2 v3 npm package
 * Fallback provider when FMP is unavailable
 */

import YahooFinance from 'yahoo-finance2';
import { MetalPriceProvider, MetalQuote } from './types';
import { metalTickers } from '@/lib/yahooTickers';

// Create YahooFinance instance (v3 API)
const yahooFinance = new YahooFinance();

interface QuoteData {
  symbol: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketPreviousClose?: number;
  regularMarketTime?: Date;
}

export class YahooProvider implements MetalPriceProvider {
  name = 'Yahoo Finance';

  async isAvailable(): Promise<boolean> {
    try {
      // Test with a simple quote request for gold
      const testQuote: any = await yahooFinance.quote('GC=F');
      return !!(testQuote && typeof testQuote === 'object' && testQuote.regularMarketPrice);
    } catch (error) {
      console.error('Yahoo Finance availability check failed:', error);
      return false;
    }
  }

  async fetchPrices(metalIds: string[]): Promise<Map<string, MetalQuote>> {
    const quotes = new Map<string, MetalQuote>();

    try {
      // Get Yahoo symbols for the requested metals
      const tickers = metalIds
        .map(id => metalTickers[id as keyof typeof metalTickers])
        .filter((ticker): ticker is string => ticker !== undefined);

      if (tickers.length === 0) {
        console.warn('No valid Yahoo tickers found for metals:', metalIds);
        return quotes;
      }

      console.log(`[Yahoo] Fetching ${tickers.length} metals: ${tickers.join(', ')}`);

      // Batch request: fetch all quotes at once
      let rawQuotes: any[] = [];
      try {
        const batchQuotes = await yahooFinance.quote(tickers);
        rawQuotes = Array.isArray(batchQuotes) ? batchQuotes : [batchQuotes];
      } catch (err: any) {
        console.error('[Yahoo] Batch quote request failed:', err.message);
        throw err;
      }

      console.log(`[Yahoo] Received ${rawQuotes.length} quotes`);

      // Process each quote
      rawQuotes.forEach((quote) => {
        if (!quote || typeof quote !== 'object' || !quote.symbol) {
          return;
        }

        const typedQuote = quote as QuoteData;
        const metalId = this.getMetalIdFromSymbol(typedQuote.symbol);

        if (!metalId) {
          console.warn(`Unknown Yahoo symbol: ${typedQuote.symbol}`);
          return;
        }

        if (!typedQuote.regularMarketPrice || !typedQuote.regularMarketPreviousClose) {
          console.warn(`Incomplete data for ${typedQuote.symbol}`);
          return;
        }

        // Calculate change and change percentage
        const price = typedQuote.regularMarketPrice;
        const previousClose = typedQuote.regularMarketPreviousClose;
        const change = typedQuote.regularMarketChange || (price - previousClose);
        const changePercent = typedQuote.regularMarketChangePercent || ((change / previousClose) * 100);

        // Determine price unit based on metal
        const priceUnit = this.getPriceUnit(metalId);

        quotes.set(metalId, {
          symbol: typedQuote.symbol,
          price,
          priceUnit,
          change,
          changePercent,
          previousClose,
          timestamp: typedQuote.regularMarketTime,
        });
      });

      return quotes;
    } catch (error) {
      console.error('Yahoo fetchPrices error:', error);
      throw error;
    }
  }

  /**
   * Map Yahoo symbol back to metal ID
   */
  private getMetalIdFromSymbol(symbol: string): string | undefined {
    const entry = Object.entries(metalTickers).find(([_, ticker]) => ticker === symbol);
    return entry?.[0];
  }

  /**
   * Get the appropriate price unit for a metal
   */
  private getPriceUnit(metalId: string): 'oz' | 'lb' | 'ton' | 'kg' {
    const preciousMetals = ['gold', 'silver', 'platinum', 'palladium'];
    const poundMetals = ['copper', 'zinc', 'lead', 'tin', 'nickel'];

    if (preciousMetals.includes(metalId)) {
      return 'oz';
    } else if (poundMetals.includes(metalId)) {
      return 'lb';
    } else {
      return 'ton'; // Default for industrial metals
    }
  }
}
