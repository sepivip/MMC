'use client';

import { useState, useMemo } from 'react';
import { Metal, MetalCategory } from '@/types/metal';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MiniChart } from './MiniChart';

type SortField = 'rank' | 'name' | 'price' | 'change24h' | 'change7d' | 'marketCap';
type SortDirection = 'asc' | 'desc';

interface MarketsTableProps {
  metals: Metal[];
  onMetalClick: (metalId: string) => void;
  onWatchlistToggle: (metalId: string) => void;
}

export function MarketsTable({ metals, onMetalClick, onWatchlistToggle }: MarketsTableProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<MetalCategory | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('marketCap');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedMetals = useMemo(() => {
    let filtered = metals;

    // Filter by search
    if (search) {
      filtered = filtered.filter(
        (metal) =>
          metal.name.toLowerCase().includes(search.toLowerCase()) ||
          metal.symbol.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((metal) => metal.category === categoryFilter);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      let aValue: number | string = a[sortField];
      let bValue: number | string = b[sortField];

      if (sortField === 'name') {
        aValue = (aValue as string).toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [metals, search, categoryFilter, sortField, sortDirection]);

  const formatPrice = (price: number, unit: string) => {
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/${unit}`;
  };

  const convertToKgPrice = (price: number, unit: string): number => {
    switch (unit) {
      case 'oz':
        // 1 troy ounce = 0.0311035 kg
        return price / 0.0311035;
      case 'lb':
        // 1 pound = 0.453592 kg
        return price / 0.453592;
      case 'ton':
        // 1 metric ton = 1000 kg
        return price / 1000;
      case 'kg':
        return price;
      default:
        return price;
    }
  };

  const formatKgPrice = (price: number, unit: string) => {
    const kgPrice = convertToKgPrice(price, unit);
    return `$${kgPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
    return `$${marketCap.toLocaleString()}`;
  };

  const formatSupply = (supply: number) => {
    if (supply >= 1e9) return `${(supply / 1e9).toFixed(2)}B tons`;
    if (supply >= 1e6) return `${(supply / 1e6).toFixed(2)}M tons`;
    if (supply >= 1e3) return `${(supply / 1e3).toFixed(2)}K tons`;
    return `${supply.toLocaleString()} tons`;
  };

  const formatAthPrice = (price: number | undefined, unit: string) => {
    if (!price) return '-';
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/${unit}`;
  };

  const getCategoryColor = (category: MetalCategory) => {
    switch (category) {
      case 'precious':
        return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
      case 'industrial':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30';
      case 'battery':
        return 'bg-purple-500/15 text-purple-400 border-purple-500/30';
    }
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search metals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          aria-label="Search metals by name or symbol"
          type="search"
        />
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value as MetalCategory | 'all')}
        >
          <SelectTrigger className="sm:w-[180px]" aria-label="Filter by category">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="precious">Precious Metals</SelectItem>
            <SelectItem value="industrial">Industrial Metals</SelectItem>
            <SelectItem value="battery">Battery Metals</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border border-border/50 rounded-xl overflow-x-auto bg-card/30" role="region" aria-label="Metal market data table">
        <Table>
          <TableHeader className="sticky top-0 bg-card/95 backdrop-blur-sm">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="w-12" aria-label="Watchlist"></TableHead>
              <TableHead
                className="cursor-pointer hover:text-foreground"
                onClick={() => handleSort('rank')}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSort('rank')}
                aria-sort={sortField === 'rank' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                #
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-foreground min-w-[200px]"
                onClick={() => handleSort('name')}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSort('name')}
                aria-sort={sortField === 'name' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                Metal
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-foreground text-right"
                onClick={() => handleSort('price')}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSort('price')}
                aria-sort={sortField === 'price' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                Price
              </TableHead>
              <TableHead className="text-right">
                Price (KG)
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-foreground text-right"
                onClick={() => handleSort('change24h')}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSort('change24h')}
                aria-sort={sortField === 'change24h' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                24h %
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-foreground text-right"
                onClick={() => handleSort('change7d')}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSort('change7d')}
                aria-sort={sortField === 'change7d' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                7d %
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-foreground text-right"
                onClick={() => handleSort('marketCap')}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleSort('marketCap')}
                aria-sort={sortField === 'marketCap' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                Market Cap
              </TableHead>
              <TableHead className="text-right">Supply</TableHead>
              <TableHead className="text-right">ATH</TableHead>
              <TableHead className="w-[120px]">Last 7 Days</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedMetals.map((metal) => (
              <TableRow
                key={metal.id}
                className={cn(
                  'cursor-pointer group',
                  'transition-colors duration-200',
                  'hover:bg-accent/40 border-border/30'
                )}
                onClick={() => onMetalClick(metal.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onMetalClick(metal.id)}
                aria-label={`View details for ${metal.name}`}
              >
                <TableCell>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onWatchlistToggle(metal.id);
                    }}
                    className={cn(
                      'p-1.5 rounded-md transition-all duration-200',
                      'hover:bg-primary/10',
                      metal.isWatchlisted
                        ? 'text-primary'
                        : 'text-muted-foreground/50 hover:text-primary'
                    )}
                    aria-label={metal.isWatchlisted ? `Remove ${metal.name} from watchlist` : `Add ${metal.name} to watchlist`}
                    aria-pressed={metal.isWatchlisted}
                  >
                    <Star
                      className={cn(
                        'h-4 w-4 transition-transform duration-200',
                        metal.isWatchlisted && 'fill-current scale-110'
                      )}
                      aria-hidden="true"
                    />
                  </button>
                </TableCell>
                <TableCell className="font-medium text-muted-foreground tabular-nums">{metal.rank}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-semibold group-hover:text-foreground transition-colors">{metal.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="font-mono">{metal.symbol}</span>
                        <Badge variant="outline" className={cn('text-[10px] h-5', getCategoryColor(metal.category))}>
                          {metal.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono font-semibold tabular-nums">
                  {metal.isMockData ? '-' : formatPrice(metal.price, metal.priceUnit)}
                </TableCell>
                <TableCell className="text-right font-mono text-muted-foreground/70 tabular-nums text-sm">
                  {metal.isMockData ? '-' : formatKgPrice(metal.price, metal.priceUnit)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {metal.isMockData ? (
                    '-'
                  ) : (
                    <span
                      className={cn(
                        'font-semibold',
                        metal.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                      )}
                    >
                      {metal.change24h >= 0 ? '+' : ''}
                      {metal.change24h.toFixed(2)}%
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {metal.isMockData ? (
                    '-'
                  ) : (
                    <span
                      className={cn(
                        'font-semibold',
                        metal.change7d >= 0 ? 'text-green-400' : 'text-red-400'
                      )}
                    >
                      {metal.change7d >= 0 ? '+' : ''}
                      {metal.change7d.toFixed(2)}%
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right font-mono font-semibold tabular-nums">
                  {metal.isMockData ? '-' : formatMarketCap(metal.marketCap)}
                </TableCell>
                <TableCell className="text-right text-muted-foreground text-sm">
                  {formatSupply(metal.supply)}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  <div>
                    <div className="text-sm">{formatAthPrice(metal.athPrice, metal.priceUnit)}</div>
                    {metal.percentFromAth !== undefined && (
                      <div className={cn(
                        'text-xs font-semibold',
                        metal.percentFromAth >= -5 ? 'text-green-400' : 'text-muted-foreground/60'
                      )}>
                        {metal.percentFromAth.toFixed(1)}%
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="w-[100px] h-[40px]">
                    {metal.isMockData ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground text-xs">-</div>
                    ) : (
                      <MiniChart data={metal.sparklineData} isPositive={metal.change7d >= 0} />
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredAndSortedMetals.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mx-auto mb-4">
            <Star className="h-6 w-6 text-muted-foreground/50" />
          </div>
          <p className="font-medium">No metals found</p>
          <p className="text-sm mt-1">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}
