/**
 * Metal Price Service
 * Abstraction layer for fetching metal prices from multiple providers
 * Implements smart fallback: FMP → Yahoo Finance → Mock Data
 */

import { MetalPriceProvider, ProviderType } from './providers/types';
import { FMPProvider } from './providers/fmp';
import { YahooProvider } from './providers/yahoo';

export class MetalPriceService {
  private fmpProvider: FMPProvider;
  private yahooProvider: YahooProvider;
  private providerType: ProviderType;
  private enableFallback: boolean;

  constructor() {
    this.fmpProvider = new FMPProvider();
    this.yahooProvider = new YahooProvider();
    this.providerType = (process.env.METAL_PRICE_PROVIDER as ProviderType) || 'fmp';
    this.enableFallback = process.env.ENABLE_API_FALLBACK !== 'false';
  }

  /**
   * Get the primary provider based on configuration
   */
  private getPrimaryProvider(): MetalPriceProvider {
    switch (this.providerType) {
      case 'fmp':
        return this.fmpProvider;
      case 'yahoo':
        return this.yahooProvider;
      case 'auto':
      default:
        return this.fmpProvider; // Auto mode defaults to FMP
    }
  }

  /**
   * Get fallback provider
   */
  private getFallbackProvider(): MetalPriceProvider | null {
    if (!this.enableFallback) {
      return null;
    }

    // If primary is FMP, fallback to Yahoo
    if (this.providerType === 'fmp' || this.providerType === 'auto') {
      return this.yahooProvider;
    }

    // If primary is Yahoo, fallback to FMP (if configured)
    if (this.providerType === 'yahoo' && process.env.FMP_API_KEY) {
      return this.fmpProvider;
    }

    return null;
  }

  /**
   * Fetch metal prices with automatic fallback
   */
  async fetchMetalPrices(metalIds: string[]) {
    const primaryProvider = this.getPrimaryProvider();
    const fallbackProvider = this.getFallbackProvider();

    console.log(`[MetalPriceService] Using primary provider: ${primaryProvider.name}`);

    // Try primary provider
    try {
      const isAvailable = await primaryProvider.isAvailable();

      if (isAvailable) {
        console.log(`[MetalPriceService] ${primaryProvider.name} is available`);
        const quotes = await primaryProvider.fetchPrices(metalIds);

        if (quotes.size > 0) {
          console.log(`[MetalPriceService] Successfully fetched ${quotes.size} quotes from ${primaryProvider.name}`);
          return {
            quotes,
            provider: primaryProvider.name,
            isMockData: false,
          };
        }
      } else {
        console.warn(`[MetalPriceService] ${primaryProvider.name} is not available`);
      }
    } catch (error) {
      console.error(`[MetalPriceService] ${primaryProvider.name} failed:`, error);
    }

    // Try fallback provider
    if (fallbackProvider) {
      console.log(`[MetalPriceService] Falling back to ${fallbackProvider.name}`);

      try {
        const isAvailable = await fallbackProvider.isAvailable();

        if (isAvailable) {
          console.log(`[MetalPriceService] ${fallbackProvider.name} is available`);
          const quotes = await fallbackProvider.fetchPrices(metalIds);

          if (quotes.size > 0) {
            console.log(`[MetalPriceService] Successfully fetched ${quotes.size} quotes from ${fallbackProvider.name} (fallback)`);
            return {
              quotes,
              provider: fallbackProvider.name,
              isMockData: false,
            };
          }
        } else {
          console.warn(`[MetalPriceService] ${fallbackProvider.name} is not available`);
        }
      } catch (error) {
        console.error(`[MetalPriceService] ${fallbackProvider.name} failed:`, error);
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
