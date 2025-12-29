'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockMetals } from '@/data/mockMetals';
import { Metal } from '@/types/metal';
import { MarketsTable } from '@/components/markets/MarketsTable';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Star } from 'lucide-react';

export default function WatchlistPage() {
  const router = useRouter();
  const [metals, setMetals] = useState<Metal[]>(
    mockMetals.map((m, i) => ({ ...m, isWatchlisted: i < 3 }))
  );

  const watchlistedMetals = metals.filter((m) => m.isWatchlisted);

  const handleMetalClick = (metalId: string) => {
    router.push(`/metal/${metalId}`);
  };

  const handleWatchlistToggle = (metalId: string) => {
    setMetals((prev) =>
      prev.map((metal) =>
        metal.id === metalId
          ? { ...metal, isWatchlisted: !metal.isWatchlisted }
          : metal
      )
    );
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
            <h1 className="text-xl font-bold">Watchlist</h1>
            <div className="w-[100px]"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-2">My Watchlist</h2>
          <p className="text-muted-foreground">
            {watchlistedMetals.length} metal{watchlistedMetals.length !== 1 ? 's' : ''} in your watchlist
          </p>
        </div>

        {watchlistedMetals.length > 0 ? (
          <MarketsTable
            metals={watchlistedMetals}
            onMetalClick={handleMetalClick}
            onWatchlistToggle={handleWatchlistToggle}
          />
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Star className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your watchlist is empty</h3>
              <p className="text-muted-foreground text-center mb-6">
                Add metals to your watchlist to track them easily
              </p>
              <Button onClick={() => router.push('/')}>
                Browse Markets
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
