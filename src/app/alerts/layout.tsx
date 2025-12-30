import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Price Alerts | MetalMarketCap',
  description: 'Set up price alerts for precious and industrial metals. Get notified when gold, silver, copper, lithium, or other metals reach your target prices.',
  openGraph: {
    title: 'Price Alerts | MetalMarketCap',
    description: 'Set up price alerts for precious and industrial metals.',
    url: 'https://metalmarketcap.com/alerts',
  },
  twitter: {
    title: 'Price Alerts | MetalMarketCap',
    description: 'Set up price alerts for precious and industrial metals.',
  },
};

export default function AlertsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
