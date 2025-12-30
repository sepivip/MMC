import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Watchlist | MetalMarketCap',
  description: 'Track your favorite metals in one place. Monitor prices, changes, and market caps for gold, silver, platinum, copper, lithium, and more.',
  openGraph: {
    title: 'Watchlist | MetalMarketCap',
    description: 'Track your favorite metals in one place.',
    url: 'https://metalmarketcap.com/watchlist',
  },
  twitter: {
    title: 'Watchlist | MetalMarketCap',
    description: 'Track your favorite metals in one place.',
  },
};

export default function WatchlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
