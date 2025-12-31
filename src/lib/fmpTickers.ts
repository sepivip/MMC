/**
 * Financial Modeling Prep (FMP) ticker symbol mappings for metals
 * FMP uses commodities symbols in USD (e.g., GCUSD for Gold in USD)
 */

export const fmpTickers: Record<string, string> = {
  gold: 'GCUSD',        // Gold Futures
  silver: 'SIUSD',      // Silver Futures
  platinum: 'PLUSD',    // Platinum Futures
  palladium: 'PAUSD',   // Palladium Futures
  copper: 'HGUSD',      // Copper Futures
  aluminum: 'ALIUSD',   // Aluminum Futures
  zinc: 'ZSUSD',        // Zinc Futures
  nickel: 'NIUSD',      // Nickel Futures
  lead: 'LDUSD',        // Lead Futures
  tin: 'SNUSD',         // Tin Futures
  lithium: 'LIUSD',     // Lithium (if available)
  cobalt: 'COUSD',      // Cobalt (if available)
};

/**
 * Map metal ID to FMP symbol
 */
export function getMetalFMPSymbol(metalId: string): string | undefined {
  return fmpTickers[metalId];
}

/**
 * Get all FMP symbols for batch request
 */
export function getAllFMPSymbols(): string[] {
  return Object.values(fmpTickers);
}

/**
 * Get FMP symbols for specific metal IDs
 */
export function getFMPSymbolsForMetals(metalIds: string[]): string[] {
  return metalIds
    .map(id => fmpTickers[id])
    .filter((symbol): symbol is string => symbol !== undefined);
}
