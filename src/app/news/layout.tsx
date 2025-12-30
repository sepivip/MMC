import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Metal Market News | MetalMarketCap',
  description: 'Latest news and updates on precious and industrial metals markets. Stay informed about gold, silver, platinum, copper, lithium, and other metal commodities.',
  openGraph: {
    title: 'Metal Market News | MetalMarketCap',
    description: 'Latest news and updates on precious and industrial metals markets.',
    url: 'https://metalmarketcap.com/news',
  },
  twitter: {
    title: 'Metal Market News | MetalMarketCap',
    description: 'Latest news and updates on precious and industrial metals markets.',
  },
};

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
