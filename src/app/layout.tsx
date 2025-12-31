import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'sonner';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.metalmarketcap.xyz'),
  title: {
    default: "MetalMarketCap - Real-Time Metal Market Data",
    template: "%s | MetalMarketCap"
  },
  description: "Track prices, market caps, and trends for precious and industrial metals including gold, silver, platinum, copper, lithium, and more. Real-time market data at your fingertips.",
  keywords: ["metals", "gold price", "silver price", "platinum", "copper", "lithium", "metal market", "precious metals", "industrial metals", "commodity prices"],
  authors: [{ name: "MetalMarketCap" }],
  creator: "MetalMarketCap",
  publisher: "MetalMarketCap",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.metalmarketcap.xyz',
    siteName: 'MetalMarketCap',
    title: 'MetalMarketCap - Real-Time Metal Market Data',
    description: 'Track prices, market caps, and trends for precious and industrial metals. Gold, silver, platinum, copper, lithium, and more.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MetalMarketCap - Metal Market Data Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MetalMarketCap - Real-Time Metal Market Data',
    description: 'Track prices, market caps, and trends for precious and industrial metals.',
    images: ['/og-image.jpg'],
    creator: '@metalmarketcap',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg"
        >
          Skip to main content
        </a>
        <Header />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
