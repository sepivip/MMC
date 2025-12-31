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
    description: 'Gold is a dense, soft, malleable, and ductile metal with a bright yellow color and luster. It is one of the least reactive chemical elements and is solid under standard conditions. Gold has been a valuable and highly sought-after precious metal for coinage, jewelry, and other arts since long before the beginning of recorded history. Today, gold is used for investment, jewelry, and industrial applications. It serves as a hedge against inflation and a store of value.',
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
    description: 'Silver is a lustrous white metal known for its high electrical and thermal conductivity. It has been used for millennia in jewelry, currency, and industrial applications. Today, silver plays a crucial role in electronics, solar panels, and medical equipment due to its antimicrobial properties. Silver is often considered both a precious metal investment and an industrial commodity.',
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
    description: 'Platinum is a dense, malleable, highly unreactive precious metal with a silvery-white appearance. It is rarer than gold and is primarily used in catalytic converters for vehicles, jewelry, and various industrial applications. Platinum is also used in laboratory equipment, electrical contacts, and dentistry. South Africa produces about 70% of the world\'s platinum supply.',
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
    description: 'Palladium is a rare silvery-white metal belonging to the platinum group. It is the most valuable of the four major precious metals. Palladium is primarily used in catalytic converters for gasoline engines, electronics, and dentistry. The automotive industry accounts for about 85% of palladium demand. Russia and South Africa are the largest producers.',
  },
  {
    id: 'copper',
    rank: 5,
    name: 'Copper',
    symbol: 'HG',
    category: 'industrial',
    price: 3.74,
    priceUnit: 'lb',
    change24h: 0.87,
    change7d: 2.34,
    marketCap: 980000000000,
    supply: 1000000000,  // Global reserves in tonnes (USGS 2024)
    demand: 28000000,    // Annual demand in tonnes
    production: 23000000, // Annual mine production (USGS 2024)
    sparklineData: generateSparkline(3.74, 0.02),
    description: 'Copper is a reddish-brown metal with excellent electrical and thermal conductivity. It has been used by humans for over 10,000 years and is essential for modern infrastructure. Copper is widely used in electrical wiring, plumbing, roofing, and electronics. It is often viewed as an economic indicator due to its widespread use in construction and manufacturing.',
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
    description: 'Aluminum is a lightweight, silvery-white metal that is the most abundant metal in the Earth\'s crust. It is highly resistant to corrosion and has excellent strength-to-weight ratio. Aluminum is used extensively in transportation, packaging, construction, and consumer electronics. The production of aluminum is energy-intensive, making electricity costs a key factor in its pricing.',
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
    description: 'Lithium is a soft, silvery-white alkali metal and the lightest of all metals. It has become essential for the modern economy due to its use in rechargeable batteries for electric vehicles, smartphones, and laptops. Lithium demand has surged with the global transition to electric mobility. Australia, Chile, and China are the leading lithium producers.',
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
    description: 'Nickel is a silvery-white lustrous metal with a slight golden tinge. It is hard and ductile, with high resistance to corrosion. Nickel is primarily used in stainless steel production and increasingly in electric vehicle batteries. The growth of EV adoption has significantly increased nickel demand. Indonesia and the Philippines are major nickel producers.',
  },
  {
    id: 'zinc',
    rank: 9,
    name: 'Zinc',
    symbol: 'ZN',
    category: 'industrial',
    price: 1.16,
    priceUnit: 'lb',
    change24h: -0.89,
    change7d: -2.15,
    marketCap: 65000000000,
    supply: 224000000,   // Global reserves in tonnes (USGS 2024)
    demand: 14000000,    // Annual demand in tonnes
    production: 12000000, // Annual mine production (USGS 2024)
    sparklineData: generateSparkline(1.16, 0.025),
    description: 'Zinc is a bluish-white metal that is brittle at room temperature but becomes malleable when heated. It is primarily used for galvanizing steel to prevent rust and corrosion. Zinc is also used in alloys such as brass, die casting, and in batteries. China is the largest producer and consumer of zinc globally.',
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
    description: 'Cobalt is a hard, lustrous, silver-gray metal that is essential for lithium-ion battery cathodes. It is primarily obtained as a byproduct of copper and nickel mining. The Democratic Republic of Congo produces over 70% of the world\'s cobalt, raising supply chain and ethical sourcing concerns. Cobalt is also used in superalloys for jet engines and in magnetic alloys.',
  },
  {
    id: 'lead',
    rank: 11,
    name: 'Lead',
    symbol: 'PB',
    category: 'industrial',
    price: 0.95,
    priceUnit: 'lb',
    change24h: 0.45,
    change7d: 1.23,
    marketCap: 38000000000,
    supply: 90000000,    // Global reserves in tonnes (USGS 2024)
    demand: 13000000,    // Annual demand in tonnes
    production: 4500000, // Annual mine production (USGS 2024)
    sparklineData: generateSparkline(0.95, 0.02),
    description: 'Lead is a heavy, soft, malleable metal with a bluish-white color when freshly cut. Despite toxicity concerns, lead remains important for lead-acid batteries used in vehicles, backup power systems, and energy storage. The majority of lead demand comes from battery recycling and production. China is the largest producer and consumer of lead.',
  },
  {
    id: 'tin',
    rank: 12,
    name: 'Tin',
    symbol: 'SN',
    category: 'industrial',
    price: 11.64,
    priceUnit: 'lb',
    change24h: 1.12,
    change7d: 2.89,
    marketCap: 28000000000,
    supply: 4900000,     // Global reserves in tonnes (USGS 2024)
    demand: 380000,      // Annual demand in tonnes
    production: 300000,  // Annual mine production (USGS 2024)
    sparklineData: generateSparkline(11.64, 0.03),
    description: 'Tin is a silvery-white metal that is soft and malleable. It has been used since ancient times, primarily in bronze alloys. Today, tin is mainly used in solder for electronics, tin plating for food containers, and various chemical applications. China and Indonesia are the world\'s largest tin producers. Tin prices are influenced by electronics manufacturing demand.',
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
