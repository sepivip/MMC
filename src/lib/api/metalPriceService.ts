/**
 * Metal Price Service
 * Abstraction layer for fetching metal prices from multiple providers
 * Implements smart fallback: Yahoo Direct → Yahoo Finance2 → FMP → Mock Data
 */

import { MetalPriceProvider, ProviderType } from './providers/types';
import { FMPProvider } from './providers/fmp';
import { YahooProvider } from './providers/yahoo';
import { YahooDirectProvider } from './providers/yahoo-direct';

export class MetalPriceService {
  private fmpProvider: FMPProvider;
  private yahooProvider: YahooProvider;
  private yahooDirectProvider: YahooDirectProvider;
  private providerType: ProviderType;
  private enableFallback: boolean;

  constructor() {
    this.fmpProvider = new FMPProvider();
    this.yahooProvider = new YahooProvider();
    this.yahooDirectProvider = new YahooDirectProvider();
    this.providerType = (process.env.METAL_PRICE_PROVIDER as ProviderType) || 'yahoo';
    this.enableFallback = process.env.ENABLE_API_FALLBACK !== 'false';
  }

  /**
   * Get all providers to try in order
   */
  private getProvidersToTry(): MetalPriceProvider[] {
    if (!this.enableFallback) {
      return [this.yahooDirectProvider];
    }

    // Try Yahoo Direct first (uses /v8/chart/ endpoint which may have different rate limits)
    // Then try Yahoo Finance2 (uses /v7/quote/ endpoint)
    // Finally try FMP as last resort
    return [
      this.yahooDirectProvider,
      this.yahooProvider,
      this.fmpProvider,
    ];
  }

  /**
   * Fetch metal prices with automatic fallback through multiple providers
   */
  async fetchMetalPrices(metalIds: string[]) {
    const providers = this.getProvidersToTry();

    // Try each provider in order
    for (const provider of providers) {
      console.log(`[MetalPriceService] Trying provider: ${provider.name}`);

      try {
        const isAvailable = await provider.isAvailable();

        if (isAvailable) {
          console.log(`[MetalPriceService] ${provider.name} is available`);
          const quotes = await provider.fetchPrices(metalIds);

          if (quotes.size > 0) {
            console.log(`[MetalPriceService] Successfully fetched ${quotes.size} quotes from ${provider.name}`);
            return {
              quotes,
              provider: provider.name,
              isMockData: false,
            };
          } else {
            console.warn(`[MetalPriceService] ${provider.name} returned no quotes`);
          }
        } else {
          console.warn(`[MetalPriceService] ${provider.name} is not available`);
        }
      } catch (error) {
        console.error(`[MetalPriceService] ${provider.name} failed:`, error);
      }
    }

    // All providers failed - return empty result indicating mock data should be used
    console.warn('[MetalPriceService] All providers failed, falling back to mock data');
    return {
      quotes: new Map(),
      provider: 'mock',
      isMockData: true,
    };
  }
}

// Singleton instance
let serviceInstance: MetalPriceService | null = null;

export function getMetalPriceService(): MetalPriceService {
  if (!serviceInstance) {
    serviceInstance = new MetalPriceService();
  }
  return serviceInstance;
}
