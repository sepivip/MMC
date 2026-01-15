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
    // Normalize provider type to lowercase to handle env vars like 'YAHOO' or 'FMP'
    const rawProvider = (process.env.METAL_PRICE_PROVIDER || 'yahoo').toLowerCase();
    this.providerType = this.validateProviderType(rawProvider);
    this.enableFallback = process.env.ENABLE_API_FALLBACK !== 'false';
  }

  /**
   * Validate and normalize provider type from environment
   */
  private validateProviderType(raw: string): ProviderType {
    const validTypes: ProviderType[] = ['fmp', 'yahoo', 'yahoo-direct', 'auto'];
    if (validTypes.includes(raw as ProviderType)) {
      return raw as ProviderType;
    }
    console.warn(`[MetalPriceService] Invalid provider type '${raw}', defaulting to 'yahoo'`);
    return 'yahoo';
  }

  /**
   * Get the primary provider based on METAL_PRICE_PROVIDER config
   */
  private getPrimaryProvider(): MetalPriceProvider {
    switch (this.providerType) {
      case 'fmp':
        return this.fmpProvider;
      case 'yahoo':
        return this.yahooProvider;
      case 'yahoo-direct':
      default:
        return this.yahooDirectProvider;
    }
  }

  /**
   * Get all providers to try in order
   * Respects METAL_PRICE_PROVIDER for primary, then falls back to others
   */
  private getProvidersToTry(): MetalPriceProvider[] {
    const primary = this.getPrimaryProvider();

    if (!this.enableFallback) {
      // Only use the configured provider, no fallback
      return [primary];
    }

    // Build fallback chain starting with configured provider
    const allProviders = [
      this.yahooDirectProvider,
      this.yahooProvider,
      this.fmpProvider,
    ];

    // Put primary first, then others in default order
    return [
      primary,
      ...allProviders.filter(p => p !== primary),
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
