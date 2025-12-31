'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MobileNav } from './MobileNav';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Markets' },
    { href: '/news', label: 'News' },
    { href: '/alerts', label: 'Alerts' },
    { href: '/watchlist', label: 'Watchlist' },
  ];

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50" role="banner">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="block">
              <h1 className="text-2xl font-bold tracking-tight">
                Metal<span className="text-primary">Market</span>Cap
              </h1>
              <p className="text-sm text-muted-foreground hidden sm:block">
                Real-time precious & industrial metal market data
              </p>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6" role="navigation" aria-label="Main navigation">
              {navItems.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'text-sm font-medium transition-colors',
                      isActive
                        ? 'text-foreground font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
