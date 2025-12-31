/**
 * Type definitions for metal price API providers
 * Supports multiple data sources with a unified interface
 */

export interface MetalQuote {
  symbol: string;
  price: number;
  priceUnit: 'oz' | 'lb' | 'ton' | 'kg';
  change: number;
  changePercent: number;
  previousClose: number;
  timestamp?: Date;
}

export interface MetalPriceProvider {
  name: string;

  /**
   * Fetch current prices for multiple metals
   * @param metalIds - Array of metal IDs (e.g., ['gold', 'silver', 'copper'])
   * @returns Map of metal IDs to quote data
   */
  fetchPrices(metalIds: string[]): Promise<Map<string, MetalQuote>>;

  /**
   * Check if the provider is available and working
   * @returns true if provider can be used
   */
  isAvailable(): Promise<boolean>;
}

export type ProviderType = 'fmp' | 'yahoo' | 'auto';

export interface ProviderConfig {
  type: ProviderType;
  enableFallback: boolean;
  cacheDuration: number;
}
