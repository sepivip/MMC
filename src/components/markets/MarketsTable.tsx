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
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

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

  const getCategoryColor = (category: MetalCategory) => {
    switch (category) {
      case 'precious':
        return 'bg-primary/20 text-primary border-primary/30';
      case 'industrial':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'battery':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
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
          className="sm:max-w-xs"
        />
        <Select
          value={categoryFilter}
          onValueChange={(value) => setCategoryFilter(value as MetalCategory | 'all')}
        >
          <SelectTrigger className="sm:w-[180px]">
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
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-card">
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead
                className="cursor-pointer hover:text-foreground"
                onClick={() => handleSort('rank')}
              >
                #
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-foreground min-w-[200px]"
                onClick={() => handleSort('name')}
              >
                Metal
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-foreground text-right"
                onClick={() => handleSort('price')}
              >
                Price
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-foreground text-right"
                onClick={() => handleSort('change24h')}
              >
                24h %
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-foreground text-right"
                onClick={() => handleSort('change7d')}
              >
                7d %
              </TableHead>
              <TableHead
                className="cursor-pointer hover:text-foreground text-right"
                onClick={() => handleSort('marketCap')}
              >
                Market Cap
              </TableHead>
              <TableHead className="text-right">Supply</TableHead>
              <TableHead className="w-[120px]">Last 7 Days</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedMetals.map((metal) => (
              <TableRow
                key={metal.id}
                className="cursor-pointer hover:bg-accent/50"
                onClick={() => onMetalClick(metal.id)}
              >
                <TableCell>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onWatchlistToggle(metal.id);
                    }}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Star
                      className={cn('h-4 w-4', metal.isWatchlisted && 'fill-primary text-primary')}
                    />
                  </button>
                </TableCell>
                <TableCell className="font-medium">{metal.rank}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="font-semibold">{metal.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2">
                        {metal.symbol}
                        <Badge variant="outline" className={cn('text-xs', getCategoryColor(metal.category))}>
                          {metal.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatPrice(metal.price, metal.priceUnit)}
                </TableCell>
                <TableCell className="text-right font-mono">
                  <span
                    className={cn(
                      metal.change24h >= 0 ? 'text-green-500' : 'text-red-500'
                    )}
                  >
                    {metal.change24h >= 0 ? '+' : ''}
                    {metal.change24h.toFixed(2)}%
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono">
                  <span
                    className={cn(
                      metal.change7d >= 0 ? 'text-green-500' : 'text-red-500'
                    )}
                  >
                    {metal.change7d >= 0 ? '+' : ''}
                    {metal.change7d.toFixed(2)}%
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono">
                  {formatMarketCap(metal.marketCap)}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formatSupply(metal.supply)}
                </TableCell>
                <TableCell>
                  <MiniChart data={metal.sparklineData} isPositive={metal.change7d >= 0} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredAndSortedMetals.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No metals found matching your criteria.
        </div>
      )}
    </div>
  );
}
