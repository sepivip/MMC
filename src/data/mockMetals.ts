import { Metal, MetalNews } from '@/types/metal';

const generateSparkline = (basePrice: number, volatility: number = 0.05): number[] => {
  const data: number[] = [];
  let price = basePrice;

  for (let i = 0; i < 7; i++) {
    const change = (Math.random() - 0.5) * 2 * volatility * price;
    price += change;
    data.push(parseFloat(price.toFixed(2)));
  }

  return data;
};

export const mockMetals: Metal[] = [
  {
    id: 'gold',
    rank: 1,
    name: 'Gold',
    symbol: 'XAU',
    category: 'precious',
    price: 2063.45,
    priceUnit: 'oz',
    change24h: 1.23,
    change7d: 3.45,
    marketCap: 13500000000000,
    supply: 216265,      // Above-ground stock (World Gold Council 2024)
    demand: 4500,        // Annual demand in tonnes
    production: 3500,    // Annual mine production (USGS 2024)
    sparklineData: generateSparkline(2063.45, 0.02),
  },
  {
    id: 'silver',
    rank: 2,
    name: 'Silver',
    symbol: 'XAG',
    category: 'precious',
    price: 24.18,
    priceUnit: 'oz',
    change24h: 2.15,
    change7d: 5.32,
    marketCap: 1400000000000,
    supply: 1700000,     // Above-ground stock estimate (Silver Institute)
    demand: 30000,       // Annual demand in tonnes
    production: 26000,   // Annual mine production (USGS 2024)
    sparklineData: generateSparkline(24.18, 0.03),
  },
  {
    id: 'platinum',
    rank: 3,
    name: 'Platinum',
    symbol: 'XPT',
    category: 'precious',
    price: 912.34,
    priceUnit: 'oz',
    change24h: -0.45,
    change7d: -1.23,
    marketCap: 185000000000,
    supply: 8000,        // Above-ground stock estimate (World Platinum Council)
    demand: 250,         // Annual demand in tonnes
    production: 190,     // Annual mine production (USGS 2024)
    sparklineData: generateSparkline(912.34, 0.025),
  },
  {
    id: 'palladium',
    rank: 4,
    name: 'Palladium',
    symbol: 'XPD',
    category: 'precious',
    price: 1034.67,
    priceUnit: 'oz',
    change24h: 1.89,
    change7d: 4.12,
    marketCap: 95000000000,
    supply: 7000,        // Above-ground stock estimate (Johnson Matthey)
    demand: 300,         // Annual demand in tonnes
    production: 210,     // Annual mine production (USGS 2024)
    sparklineData: generateSparkline(1034.67, 0.035),
  },
  {
    id: 'copper',
    rank: 5,
    name: 'Copper',
    symbol: 'HG',
    category: 'industrial',
    price: 8245.50,
    priceUnit: 'ton',
    change24h: 0.87,
    change7d: 2.34,
    marketCap: 980000000000,
    supply: 1000000000,  // Global reserves in tonnes (USGS 2024)
    demand: 28000000,    // Annual demand in tonnes
    production: 23000000, // Annual mine production (USGS 2024)
    sparklineData: generateSparkline(8245.50, 0.02),
  },
  {
    id: 'aluminum',
    rank: 6,
    name: 'Aluminum',
    symbol: 'ALU',
    category: 'industrial',
    price: 2289.75,
    priceUnit: 'ton',
    change24h: -0.34,
    change7d: 1.12,
    marketCap: 450000000000,
    supply: 1200000000,  // Estimated global stock (International Aluminium Institute)
    demand: 70000000,    // Annual demand in tonnes
    production: 73000000, // Annual primary production (IAI 2024)
    sparklineData: generateSparkline(2289.75, 0.015),
  },
  {
    id: 'lithium',
    rank: 7,
    name: 'Lithium',
    symbol: 'Li',
    category: 'battery',
    price: 18500.00,
    priceUnit: 'ton',
    change24h: 3.45,
    change7d: 8.76,
    marketCap: 125000000000,
    supply: 28000000,    // Global resources in tonnes (USGS 2024)
    demand: 200000,      // Annual demand in tonnes
    production: 240000,  // Annual mine production (USGS 2024)
    sparklineData: generateSparkline(18500.00, 0.05),
  },
  {
    id: 'nickel',
    rank: 8,
    name: 'Nickel',
    symbol: 'NI',
    category: 'battery',
    price: 17820.25,
    priceUnit: 'ton',
    change24h: 1.56,
    change7d: 3.21,
    marketCap: 78000000000,
    supply: 130000000,   // Global reserves in tonnes (USGS 2024)
    demand: 3500000,     // Annual demand in tonnes
    production: 3700000, // Annual mine production (USGS 2024)
    sparklineData: generateSparkline(17820.25, 0.03),
  },
  {
    id: 'zinc',
    rank: 9,
    name: 'Zinc',
    symbol: 'ZN',
    category: 'industrial',
    price: 2567.80,
    priceUnit: 'ton',
    change24h: -0.89,
    change7d: -2.15,
    marketCap: 65000000000,
    supply: 224000000,   // Global reserves in tonnes (USGS 2024)
    demand: 14000000,    // Annual demand in tonnes
    production: 12000000, // Annual mine production (USGS 2024)
    sparklineData: generateSparkline(2567.80, 0.025),
  },
  {
    id: 'cobalt',
    rank: 10,
    name: 'Cobalt',
    symbol: 'Co',
    category: 'battery',
    price: 28900.00,
    priceUnit: 'ton',
    change24h: 2.34,
    change7d: 5.67,
    marketCap: 42000000000,
    supply: 11000000,    // Global reserves in tonnes (USGS 2024)
    demand: 220000,      // Annual demand in tonnes
    production: 290000,  // Annual mine production (Cobalt Institute 2024)
    sparklineData: generateSparkline(28900.00, 0.04),
  },
  {
    id: 'lead',
    rank: 11,
    name: 'Lead',
    symbol: 'PB',
    category: 'industrial',
    price: 2089.45,
    priceUnit: 'ton',
    change24h: 0.45,
    change7d: 1.23,
    marketCap: 38000000000,
    supply: 90000000,    // Global reserves in tonnes (USGS 2024)
    demand: 13000000,    // Annual demand in tonnes
    production: 4500000, // Annual mine production (USGS 2024)
    sparklineData: generateSparkline(2089.45, 0.02),
  },
  {
    id: 'tin',
    rank: 12,
    name: 'Tin',
    symbol: 'SN',
    category: 'industrial',
    price: 25670.50,
    priceUnit: 'ton',
    change24h: 1.12,
    change7d: 2.89,
    marketCap: 28000000000,
    supply: 4900000,     // Global reserves in tonnes (USGS 2024)
    demand: 380000,      // Annual demand in tonnes
    production: 300000,  // Annual mine production (USGS 2024)
    sparklineData: generateSparkline(25670.50, 0.03),
  },
];

export const mockNews: MetalNews[] = [
  {
    id: '1',
    metalId: 'gold',
    title: 'Gold Prices Surge Amid Global Economic Uncertainty',
    source: 'Reuters',
    url: '#',
    publishedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    metalId: 'lithium',
    title: 'Lithium Demand Expected to Triple by 2030 Due to EV Growth',
    source: 'Bloomberg',
    url: '#',
    publishedAt: '2024-01-15T09:15:00Z',
  },
  {
    id: '3',
    metalId: 'copper',
    title: 'Copper Supply Concerns Drive Price Rally',
    source: 'Financial Times',
    url: '#',
    publishedAt: '2024-01-15T08:45:00Z',
  },
  {
    id: '4',
    title: 'Central Banks Increase Precious Metal Reserves',
    source: 'WSJ',
    url: '#',
    publishedAt: '2024-01-14T16:20:00Z',
  },
  {
    id: '5',
    metalId: 'nickel',
    title: 'Indonesia Nickel Export Ban Reshapes Global Market',
    source: 'CNBC',
    url: '#',
    publishedAt: '2024-01-14T14:00:00Z',
  },
];
