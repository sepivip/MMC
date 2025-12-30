export type MetalCategory = 'precious' | 'industrial' | 'battery';

export interface Metal {
  id: string;
  rank: number;
  name: string;
  symbol: string;
  category: MetalCategory;
  price: number; // USD per unit (oz, lb, ton, or kg)
  priceUnit: 'oz' | 'lb' | 'ton' | 'kg';
  change24h: number; // percentage
  change7d: number; // percentage
  marketCap: number; // USD
  supply: number; // in tons
  demand: number; // in tons
  production: number; // in tons per year
  sparklineData: number[]; // last 7 days prices for mini chart
  isWatchlisted?: boolean;
  athPrice?: number; // All-time high price
  athDate?: string; // ISO date of ATH
  percentFromAth?: number; // % below ATH (negative number)
  description?: string; // About text for metal
}

export interface MetalNews {
  id: string;
  metalId?: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  imageUrl?: string;
}

export interface PriceAlert {
  id: string;
  metalId: string;
  metalName: string;
  type: 'above' | 'below';
  targetPrice: number;
  currentPrice: number;
  isActive: boolean;
  createdAt: string;
}

export interface ChartDataPoint {
  date: string;
  price: number;
}

export type ChartTimeframe = '1D' | '7D' | '1M' | '1Y' | 'ALL';
