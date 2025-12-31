'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockMetals, mockNews } from '@/data/mockMetals';
import { ChartTimeframe, Metal } from '@/types/metal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, TrendingUp, TrendingDown, ChevronRight, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PriceChart } from '@/components/metal/PriceChart';
import { KeyStatistics } from '@/components/metal/KeyStatistics';
import { PriceConverter } from '@/components/metal/PriceConverter';
import { RelatedMetals } from '@/components/metal/RelatedMetals';
import { AboutMetal } from '@/components/metal/AboutMetal';
import { ShareModal } from '@/components/metal/ShareModal';

interface MetalDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function MetalDetailPage({ params }: MetalDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('7D');
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [metal, setMetal] = useState<Metal | undefined>(mockMetals.find((m) => m.id === id));
  const [allMetals, setAllMetals] = useState<Metal[]>(mockMetals);
  const [isLoading, setIsLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    async function fetchMetal() {
      try {
        const response = await fetch('/api/metals');
        if (response.ok) {
          const metals = await response.json();
          setAllMetals(metals);
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
    const interval = setInterval(fetchMetal, 60000);
    return () => clearInterval(interval);
  }, [id]);

  const handleMetalClick = (metalId: string) => {
    router.push(`/metal/${metalId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
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

  const relatedNews = mockNews.filter((news) => news.metalId === metal.id || !news.metalId).slice(0, 3);

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

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'precious':
        return 'Precious Metal';
      case 'industrial':
        return 'Industrial Metal';
      case 'battery':
        return 'Battery Metal';
      default:
        return category;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            <button onClick={() => router.push('/')} className="hover:text-foreground transition-colors">
              Commodities
            </button>
            <ChevronRight className="h-4 w-4" />
            <span>{getCategoryLabel(metal.category)}</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{metal.name} ({metal.symbol})</span>
          </nav>

           <div className="flex items-center gap-2">
              <Button
                variant={isWatchlisted ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsWatchlisted(!isWatchlisted)}
                className="gap-2"
              >
                <Star className={cn('h-4 w-4', isWatchlisted && 'fill-current')} />
                <span className="hidden sm:inline">{isWatchlisted ? 'Watchlisted' : 'Watchlist'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShareModalOpen(true)}
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </div>
        </div>
        {/* Metal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{metal.name} Price</h1>
            <Badge variant="outline" className="text-xs">
              {metal.symbol}
            </Badge>
            <Badge variant="outline" className={cn('text-xs', getCategoryColor(metal.category))}>
              {getCategoryLabel(metal.category)}
            </Badge>
          </div>

          {/* Price Display */}
          <div className="flex flex-wrap items-baseline gap-4">
            <div className="text-4xl font-bold tracking-tight">
              {metal.isMockData ? '-' : `$${metal.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </div>
            {!metal.isMockData && <div className="text-muted-foreground">per {metal.priceUnit}</div>}
            {!metal.isMockData && (
              <div
                className={cn(
                  'flex items-center gap-1 text-lg font-semibold',
                  metal.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                )}
              >
                {metal.change24h >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                {metal.change24h >= 0 ? '+' : ''}{metal.change24h.toFixed(2)}%
                <span className="text-sm font-normal text-muted-foreground">(24h)</span>
              </div>
            )}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Chart */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>Price Chart</CardTitle>
                  <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as ChartTimeframe)}>
                    <TabsList className="h-8">
                      <TabsTrigger value="1D" className="text-xs px-2">1D</TabsTrigger>
                      <TabsTrigger value="7D" className="text-xs px-2">7D</TabsTrigger>
                      <TabsTrigger value="1M" className="text-xs px-2">1M</TabsTrigger>
                      <TabsTrigger value="1Y" className="text-xs px-2">1Y</TabsTrigger>
                      <TabsTrigger value="ALL" className="text-xs px-2">ALL</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <PriceChart metalId={metal.id} timeframe={timeframe} />
              </CardContent>
            </Card>

            {/* About Section */}
            <AboutMetal metal={metal} />

            {/* Related News */}
            {relatedNews.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Latest News</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => router.push('/news')}>
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {relatedNews.map((news) => (
                      <div
                        key={news.id}
                        className="p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                      >
                        <h3 className="font-medium text-sm mb-1">{news.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{news.source}</span>
                          <span>•</span>
                          <span>{new Date(news.publishedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Stats & Converter */}
          <div className="space-y-6">
            <KeyStatistics metal={metal} />
            <PriceConverter metal={metal} />
            <RelatedMetals
              currentMetal={metal}
              allMetals={allMetals}
              onMetalClick={handleMetalClick}
            />
          </div>
        </div>
      </main>

      {/* Share Modal */}
      <ShareModal
        metal={metal}
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
      />
    </div>
  );
}
