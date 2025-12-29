'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockMetals, mockNews } from '@/data/mockMetals';
import { ChartTimeframe, Metal } from '@/types/metal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PriceChart } from '@/components/metal/PriceChart';

interface MetalDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function MetalDetailPage({ params }: MetalDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('7D');
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [metal, setMetal] = useState<Metal | undefined>(mockMetals.find((m) => m.id === id));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    async function fetchMetal() {
      try {
        const response = await fetch('/api/metals');
        if (response.ok) {
          const metals = await response.json();
          const foundMetal = metals.find((m: Metal) => m.id === id);
          if (foundMetal) {
            setMetal(foundMetal);
          }
        }
      } catch (error) {
        console.error('Failed to fetch metal data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMetal();
    // Refresh data every 60 seconds
    const interval = setInterval(fetchMetal, 60000);
    return () => clearInterval(interval);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Markets
              </Button>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
              <p className="text-muted-foreground">Loading metal data from Yahoo Finance...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!metal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Metal not found</h1>
          <Button onClick={() => router.push('/')}>Back to Markets</Button>
        </div>
      </div>
    );
  }

  const relatedNews = mockNews.filter((news) => news.metalId === metal.id || !news.metalId).slice(0, 5);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'precious':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'industrial':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'battery':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return '';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  };

  const formatSupply = (supply: number) => {
    if (supply >= 1e9) return `${(supply / 1e9).toFixed(2)}B tons`;
    if (supply >= 1e6) return `${(supply / 1e6).toFixed(2)}M tons`;
    if (supply >= 1e3) return `${(supply / 1e3).toFixed(2)}K tons`;
    return `${supply.toLocaleString()} tons`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Markets
            </Button>
            <Button
              variant={isWatchlisted ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsWatchlisted(!isWatchlisted)}
              className="gap-2"
            >
              <Star className={cn('h-4 w-4', isWatchlisted && 'fill-current')} />
              {isWatchlisted ? 'Watchlisted' : 'Add to Watchlist'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Metal Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl font-bold">{metal.name}</h1>
            <Badge variant="outline" className={cn('text-sm', getCategoryColor(metal.category))}>
              {metal.category}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground mb-6">
            <span className="text-lg">{metal.symbol}</span>
            <span>•</span>
            <span>Rank #{metal.rank}</span>
          </div>

          {/* Price Display */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-8">
            <div>
              <div className="text-5xl font-bold tracking-tight">
                ${metal.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-muted-foreground">per {metal.priceUnit}</div>
            </div>
            <div className="flex gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">24h Change</div>
                <div className={cn('text-2xl font-semibold flex items-center gap-1', metal.change24h >= 0 ? 'text-green-500' : 'text-red-500')}>
                  {metal.change24h >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                  {metal.change24h >= 0 ? '+' : ''}{metal.change24h.toFixed(2)}%
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">7d Change</div>
                <div className={cn('text-2xl font-semibold flex items-center gap-1', metal.change7d >= 0 ? 'text-green-500' : 'text-red-500')}>
                  {metal.change7d >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                  {metal.change7d >= 0 ? '+' : ''}{metal.change7d.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Price Chart</CardTitle>
              <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as ChartTimeframe)}>
                <TabsList>
                  <TabsTrigger value="1D">1D</TabsTrigger>
                  <TabsTrigger value="7D">7D</TabsTrigger>
                  <TabsTrigger value="1M">1M</TabsTrigger>
                  <TabsTrigger value="1Y">1Y</TabsTrigger>
                  <TabsTrigger value="ALL">ALL</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            <PriceChart metalId={metal.id} timeframe={timeframe} />
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Market Cap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(metal.marketCap)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Supply</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatSupply(metal.supply)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Annual Demand</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatSupply(metal.demand)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Annual Production</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatSupply(metal.production)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Related News</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {relatedNews.map((news) => (
                  <div
                    key={news.id}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                  >
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{news.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{news.source}</span>
                        <span>•</span>
                        <span>{new Date(news.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
