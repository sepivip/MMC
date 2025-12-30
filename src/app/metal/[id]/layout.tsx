import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | MetalMarketCap',
    default: 'Metal Details | MetalMarketCap',
  },
  description: 'Detailed market data, price charts, and analysis for precious and industrial metals.',
  openGraph: {
    title: 'Metal Details | MetalMarketCap',
    description: 'Detailed market data, price charts, and analysis for metals.',
  },
  twitter: {
    title: 'Metal Details | MetalMarketCap',
    description: 'Detailed market data, price charts, and analysis for metals.',
  },
};

export default function MetalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
