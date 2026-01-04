'use client';

import { useState, use, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { mockMetals, mockNews } from '@/data/mockMetals';
import { ChartTimeframe, Metal } from '@/types/metal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Star, TrendingUp, TrendingDown, ChevronRight, Share2, Newspaper, Loader2 } from 'lucide-react';
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
        <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/')}
                className="gap-2 text-muted-foreground hover:text-foreground"
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
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
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
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
            <TrendingDown className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Metal not found</h1>
          <p className="text-muted-foreground">The metal you&apos;re looking for doesn&apos;t exist.</p>
          <Button onClick={() => router.push('/')} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Markets
          </Button>
        </div>
      </div>
    );
  }

  const relatedNews = mockNews.filter((news) => news.metalId === metal.id || !news.metalId).slice(0, 3);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'precious':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'industrial':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'battery':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
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

  const isPositive = metal.change24h >= 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/')}
              className="gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Markets</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant={isWatchlisted ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsWatchlisted(!isWatchlisted)}
                className={cn(
                  'gap-2 transition-all duration-200',
                  isWatchlisted && 'bg-primary hover:bg-primary/90'
                )}
              >
                <Star className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  isWatchlisted && 'fill-current scale-110'
                )} />
                <span className="hidden sm:inline">{isWatchlisted ? 'Watchlisted' : 'Watchlist'}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShareModalOpen(true)}
                className="gap-2 hover:bg-accent/50 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-1.5 text-sm mb-6 overflow-x-auto scrollbar-none"
          aria-label="Breadcrumb"
        >
          <button
            onClick={() => router.push('/')}
            className="text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
          >
            Commodities
          </button>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0" />
          <span className="text-muted-foreground whitespace-nowrap">{getCategoryLabel(metal.category)}</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0" />
          <span className="text-foreground font-medium whitespace-nowrap">{metal.name}</span>
        </nav>

        {/* Metal Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{metal.name} Price</h1>
            <Badge variant="outline" className="text-xs font-mono h-6">
              {metal.symbol}
            </Badge>
            <Badge variant="outline" className={cn('text-xs h-6', getCategoryColor(metal.category))}>
              {getCategoryLabel(metal.category)}
            </Badge>
          </div>

          {/* Price Display */}
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
            <div className="text-4xl sm:text-5xl font-bold tracking-tight tabular-nums">
              {metal.isMockData ? '-' : `$${metal.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </div>
            {!metal.isMockData && <div className="text-muted-foreground text-lg">per {metal.priceUnit}</div>}
            {!metal.isMockData && (
              <div
                className={cn(
                  'flex items-center gap-1.5 text-lg font-semibold px-3 py-1 rounded-lg',
                  isPositive
                    ? 'text-green-400 bg-green-500/10'
                    : 'text-red-400 bg-red-500/10'
                )}
              >
                {isPositive ? (
                  <TrendingUp className="h-5 w-5" />
                ) : (
                  <TrendingDown className="h-5 w-5" />
                )}
                <span className="tabular-nums">{isPositive ? '+' : ''}{metal.change24h.toFixed(2)}%</span>
                <span className="text-sm font-normal text-muted-foreground ml-1">(24h)</span>
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <CardTitle className="text-lg">Price Chart</CardTitle>
                  <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as ChartTimeframe)}>
                    <TabsList className="h-9 bg-muted/50">
                      {['1D', '7D', '1M', '1Y', 'ALL'].map((tf) => (
                        <TabsTrigger
                          key={tf}
                          value={tf}
                          className={cn(
                            'text-xs px-3 data-[state=active]:bg-background',
                            'transition-all duration-200'
                          )}
                        >
                          {tf}
                        </TabsTrigger>
                      ))}
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
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Newspaper className="h-4 w-4 text-muted-foreground" />
                      Latest News
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push('/news')}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      View All
                      <ChevronRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {relatedNews.map((news) => (
                      <article
                        key={news.id}
                        className={cn(
                          'p-3 rounded-lg border border-border/50',
                          'hover:bg-accent/40 hover:border-border',
                          'transition-all duration-200 cursor-pointer group'
                        )}
                      >
                        <h3 className="font-medium text-sm mb-1.5 group-hover:text-foreground transition-colors line-clamp-2">
                          {news.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="font-medium">{news.source}</span>
                          <span className="text-muted-foreground/50">|</span>
                          <time dateTime={news.publishedAt}>
                            {new Date(news.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </time>
                        </div>
                      </article>
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
