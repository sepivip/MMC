import { NextResponse } from 'next/server';
import { mockMetals } from '@/data/mockMetals';
import { Metal } from '@/types/metal';
import { getMetalPriceService } from '@/lib/api/metalPriceService';

// Cache response for 6 minutes (360 seconds)
// FMP free tier: 250 calls/day, 6 min cache = 240 calls/day (safe margin)
export const revalidate = 360;

// Generate realistic sparkline based on price and change
function generateRealisticSparkline(price: number, change: number): number[] {
  const data: number[] = [];
  const basePrice = price * (1 - change / 100);

  for (let i = 0; i < 7; i++) {
    const progress = i / 6;
    const pricePoint = basePrice + (price - basePrice) * progress;
    const noise = (Math.random() - 0.5) * price * 0.01;
    data.push(parseFloat((pricePoint + noise).toFixed(2)));
  }

  return data;
}

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
    // Get metal IDs to fetch
    const metalIds = mockMetals.map(m => m.id);

    // Use the provider service to fetch prices (with automatic fallback)
    const priceService = getMetalPriceService();
    const { quotes, provider, isMockData } = await priceService.fetchMetalPrices(metalIds);

    console.log(`[API Route] Using provider: ${provider}, isMockData: ${isMockData}`);

    // If all providers failed, return mock data
    if (isMockData || quotes.size === 0) {
      console.warn('[API Route] All providers failed, returning mock data');
      const mockDataWithFlag = mockMetals.map(metal => ({ ...metal, isMockData: true }));
      // Sort by market cap and assign ranks
      const sortedMockData = [...mockDataWithFlag].sort((a, b) => b.marketCap - a.marketCap);
      const rankedMockData = sortedMockData.map((metal, index) => ({
        ...metal,
        rank: index + 1,
      }));
      return NextResponse.json(rankedMockData);
    }

    // Update metals with real price data
    const updatedMetals: Metal[] = mockMetals.map(metal => {
      const quote = quotes.get(metal.id);

      if (!quote) {
        // No quote for this metal - return mock data
        return { ...metal, isMockData: true };
      }

      // Calculate 7d change (for sparkline)
      const change7d = quote.changePercent; // Use 24h change as proxy for now

      // Calculate market cap: supply (tons) × price per ton
      const pricePerTon = convertToTonPrice(quote.price, quote.priceUnit);
      const calculatedMarketCap = metal.supply * pricePerTon;

      // For now, use current price as ATH (can add historical data later)
      const athPrice = quote.price;
      const athDate = new Date().toISOString();
      const percentFromAth = 0; // At ATH

      return {
        ...metal,
        price: parseFloat(quote.price.toFixed(2)),
        priceUnit: quote.priceUnit,
        change24h: parseFloat(quote.changePercent.toFixed(2)),
        change7d: parseFloat(change7d.toFixed(2)),
        marketCap: Math.round(calculatedMarketCap),
        sparklineData: generateRealisticSparkline(quote.price, change7d),
        athPrice: parseFloat(athPrice.toFixed(2)),
        athDate,
        percentFromAth,
        isMockData: false, // Real data from provider
      };
    });

    // Sort by market cap descending and assign ranks dynamically
    const sortedByMarketCap = [...updatedMetals].sort((a, b) => b.marketCap - a.marketCap);
    const metalsWithRank = sortedByMarketCap.map((metal, index) => ({
      ...metal,
      rank: index + 1,
    }));

    return NextResponse.json(metalsWithRank);
  } catch (error) {
    console.error('[API Route] Error fetching metal prices:', error);

    // Return mock data as fallback
    const mockDataWithFlag = mockMetals.map(metal => ({ ...metal, isMockData: true }));
    // Sort by market cap and assign ranks
    const sortedMockData = [...mockDataWithFlag].sort((a, b) => b.marketCap - a.marketCap);
    const rankedMockData = sortedMockData.map((metal, index) => ({
      ...metal,
      rank: index + 1,
    }));
    return NextResponse.json(rankedMockData);
  }
}
