// Mapping of metal IDs to Yahoo Finance ticker symbols
export const metalTickers: Record<string, string> = {
  gold: 'GC=F',       // Gold Futures
  silver: 'SI=F',     // Silver Futures
  platinum: 'PL=F',   // Platinum Futures
  palladium: 'PA=F',  // Palladium Futures
  copper: 'HG=F',     // Copper Futures
  aluminum: 'ALI=F',  // Aluminum Futures
  zinc: 'ZN=F',       // Zinc Futures
  lead: 'LD=F',       // Lead Futures
  tin: 'SN=F',        // Tin Futures
  lithium: 'LTHM',    // Livent Corp (Lithium proxy)
  nickel: 'NI=F',     // Nickel Futures
  cobalt: 'OBTX',     // Blue Ocean Technologies (Cobalt proxy)
};

// Reverse mapping for lookup
export const tickerToMetalId = Object.fromEntries(
  Object.entries(metalTickers).map(([id, ticker]) => [ticker, id])
);

// Actual units returned by Yahoo Finance for each ticker
// Based on observed prices and typical commodity pricing
export const yahooFinanceUnits: Record<string, 'oz' | 'lb' | 'ton' | 'kg'> = {
  gold: 'oz',       // GC=F: $/troy oz (~$4,350)
  silver: 'oz',     // SI=F: $/troy oz (~$72)
  platinum: 'oz',   // PL=F: $/troy oz (~$2,137)
  palladium: 'oz',  // PA=F: $/troy oz (~$1,695)
  copper: 'lb',     // HG=F: $/lb (~$5.58) ✓
  aluminum: 'ton',  // ALI=F: $/ton (~$2,941) - NOT $/lb!
  zinc: 'lb',       // ZN=F: $/lb (~$112 likely $1.12/lb)
  lead: 'lb',       // LD=F: $/lb
  tin: 'lb',        // SN=F: $/lb
  nickel: 'ton',    // NI=F: $/ton (~$17,820) - NOT $/lb!
  lithium: 'ton',   // LTHM: Stock price, use ton as default
  cobalt: 'ton',    // OBTX: Stock price, use ton as default
};
