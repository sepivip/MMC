/**
 * Yahoo Finance Direct Chart API Provider
 * Bypasses yahoo-finance2 library and uses raw v8/chart endpoint
 * This endpoint may have different rate limits than the quote endpoint
 */

import { MetalPriceProvider, MetalQuote } from './types';
import { metalTickers, yahooFinanceUnits } from '@/lib/yahooTickers';

interface ChartMeta {
  symbol: string;
  regularMarketPrice: number;
  previousClose: number;
  currency: string;
}

interface ChartResponse {
  chart: {
    result: Array<{
      meta: ChartMeta;
    }>;
    error: any;
  };
}

export class YahooDirectProvider implements MetalPriceProvider {
  name = 'Yahoo Finance Direct';

  async isAvailable(): Promise<boolean> {
    try {
      // Test with gold futures
      const response = await fetch(
        'https://query1.finance.yahoo.com/v8/finance/chart/GC=F',
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          },
        }
      );

      if (!response.ok) {
        console.error(`[YahooDirect] Availability check failed: ${response.status} ${response.statusText}`);
        return false;
      }

      const data: ChartResponse = await response.json();
      return !!(data.chart?.result?.[0]?.meta?.regularMarketPrice);
    } catch (error) {
      console.error('[YahooDirect] Availability check error:', error);
      return false;
    }
  }

  async fetchPrices(metalIds: string[]): Promise<Map<string, MetalQuote>> {
    const quotes = new Map<string, MetalQuote>();

    // Get Yahoo symbols for the requested metals
    const tickers = metalIds
      .map((id) => metalTickers[id as keyof typeof metalTickers])
      .filter((ticker): ticker is string => ticker !== undefined);

    if (tickers.length === 0) {
      console.warn('[YahooDirect] No valid Yahoo tickers found');
      return quotes;
    }

    console.log(`[YahooDirect] Fetching ${tickers.length} metals:`, tickers.join(', '));

    // Fetch each ticker individually (chart endpoint doesn't support batch)
    const fetchPromises = tickers.map(async (ticker) => {
      try {
        const response = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`,
          {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            },
          }
        );

        if (!response.ok) {
          console.error(`[YahooDirect] ${ticker} failed: ${response.status}`);
          return null;
        }

        const data: ChartResponse = await response.json();
        const meta = data.chart?.result?.[0]?.meta;

        if (!meta || !meta.regularMarketPrice || !meta.previousClose) {
          console.warn(`[YahooDirect] ${ticker} incomplete data`);
          return null;
        }

        return { ticker, meta };
      } catch (error) {
        console.error(`[YahooDirect] ${ticker} error:`, error);
        return null;
      }
    });

    const results = await Promise.all(fetchPromises);

    // Process successful results
    results.forEach((result) => {
      if (!result) return;

      const { ticker, meta } = result;
      const metalId = this.getMetalIdFromSymbol(ticker);

      if (!metalId) {
        console.warn(`[YahooDirect] Unknown ticker: ${ticker}`);
        return;
      }

      const price = meta.regularMarketPrice;
      const previousClose = meta.previousClose;
      const change = price - previousClose;
      const changePercent = (change / previousClose) * 100;
      const priceUnit = this.getPriceUnit(metalId);

      quotes.set(metalId, {
        symbol: ticker,
        price,
        priceUnit,
        change,
        changePercent,
        previousClose,
      });
    });

    console.log(`[YahooDirect] Successfully fetched ${quotes.size}/${tickers.length} metals`);

    return quotes;
  }

  private getMetalIdFromSymbol(symbol: string): string | undefined {
    const entry = Object.entries(metalTickers).find(([_, ticker]) => ticker === symbol);
    return entry?.[0];
  }

  private getPriceUnit(metalId: string): 'oz' | 'lb' | 'ton' | 'kg' {
    // Use authoritative unit mapping from yahooTickers
    return yahooFinanceUnits[metalId] || 'ton';
  }
}
