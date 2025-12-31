/**
 * Financial Modeling Prep (FMP) API Provider
 * Fetches commodity/metal prices from FMP's quote endpoint
 * Free tier: 250 requests/day
 */

import { MetalPriceProvider, MetalQuote } from './types';
import { fmpTickers } from '@/lib/fmpTickers';

interface FMPQuoteResponse {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  change: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  marketCap: number | null;
  priceAvg50: number;
  priceAvg200: number;
  volume: number;
  avgVolume: number;
  exchange: string;
  open: number;
  previousClose: number;
  eps: number | null;
  pe: number | null;
  earningsAnnouncement: string | null;
  sharesOutstanding: number | null;
  timestamp: number;
}

export class FMPProvider implements MetalPriceProvider {
  name = 'Financial Modeling Prep';
  private apiKey: string;
  private baseUrl = 'https://financialmodelingprep.com/api/v3';

  constructor() {
    this.apiKey = process.env.FMP_API_KEY || '';
  }

  async isAvailable(): Promise<boolean> {
    if (!this.apiKey) {
      console.warn('FMP API key not configured');
      return false;
    }

    try {
      // Test with a simple quote request for gold
      const response = await fetch(
        `${this.baseUrl}/quote/GCUSD?apikey=${this.apiKey}`,
        { next: { revalidate: 300 } }
      );

      if (!response.ok) {
        console.error(`FMP availability check failed: ${response.status} ${response.statusText}`);
        return false;
      }

      const data = await response.json();
      return Array.isArray(data) && data.length > 0;
    } catch (error) {
      console.error('FMP availability check error:', error);
      return false;
    }
  }

  async fetchPrices(metalIds: string[]): Promise<Map<string, MetalQuote>> {
    const quotes = new Map<string, MetalQuote>();

    if (!this.apiKey) {
      throw new Error('FMP API key not configured');
    }

    try {
      // Get FMP symbols for the requested metals
      const symbols = metalIds
        .map(id => fmpTickers[id])
        .filter((symbol): symbol is string => symbol !== undefined);

      if (symbols.length === 0) {
        console.warn('No valid FMP symbols found for metals:', metalIds);
        return quotes;
      }

      // Batch request: comma-separated symbols
      const symbolsParam = symbols.join(',');
      const url = `${this.baseUrl}/quote/${symbolsParam}?apikey=${this.apiKey}`;

      console.log(`[FMP] Fetching ${symbols.length} metals: ${symbolsParam}`);

      const response = await fetch(url, {
        next: { revalidate: parseInt(process.env.PRICE_CACHE_DURATION || '360') }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`FMP API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: FMPQuoteResponse[] = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('FMP API returned invalid data format');
      }

      console.log(`[FMP] Received ${data.length} quotes`);

      // Process each quote
      data.forEach((quote) => {
        const metalId = this.getMetalIdFromSymbol(quote.symbol);
        if (!metalId) {
          console.warn(`Unknown FMP symbol: ${quote.symbol}`);
          return;
        }

        // Determine price unit based on metal
        const priceUnit = this.getPriceUnit(metalId);

        quotes.set(metalId, {
          symbol: quote.symbol,
          price: quote.price,
          priceUnit,
          change: quote.change,
          changePercent: quote.changesPercentage,
          previousClose: quote.previousClose,
          timestamp: new Date(quote.timestamp * 1000),
        });
      });

      return quotes;
    } catch (error) {
      console.error('FMP fetchPrices error:', error);
      throw error;
    }
  }

  /**
   * Map FMP symbol back to metal ID
   */
  private getMetalIdFromSymbol(symbol: string): string | undefined {
    const entry = Object.entries(fmpTickers).find(([_, fmpSymbol]) => fmpSymbol === symbol);
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
