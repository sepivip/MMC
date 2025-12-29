'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockNews, mockMetals } from '@/data/mockMetals';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function NewsPage() {
  const router = useRouter();
  const [metalFilter, setMetalFilter] = useState<string>('all');

  const filteredNews = mockNews.filter(
    (news) => metalFilter === 'all' || news.metalId === metalFilter || !news.metalId
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
            <h1 className="text-xl font-bold">Metal Market News</h1>
            <div className="w-[100px]"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Latest News</h2>
          <p className="text-muted-foreground mb-6">
            Stay updated with the latest metal market news and trends
          </p>

          {/* Filter */}
          <Select value={metalFilter} onValueChange={setMetalFilter}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by metal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All News</SelectItem>
              {mockMetals.map((metal) => (
                <SelectItem key={metal.id} value={metal.id}>
                  {metal.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* News List */}
        <div className="space-y-4">
          {filteredNews.map((news) => {
            const metal = mockMetals.find((m) => m.id === news.metalId);

            return (
              <Card key={news.id} className="hover:bg-accent/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 leading-tight">
                        {news.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                        <span className="font-medium">{news.source}</span>
                        <span>•</span>
                        <span>{formatDate(news.publishedAt)}</span>
                        {metal && (
                          <>
                            <span>•</span>
                            <span className="text-primary">{metal.name}</span>
                          </>
                        )}
                      </div>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-primary hover:text-primary/80"
                        onClick={() => window.open(news.url, '_blank')}
                      >
                        Read more <ExternalLink className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            No news found for the selected filter.
          </div>
        )}
      </main>
    </div>
  );
}
