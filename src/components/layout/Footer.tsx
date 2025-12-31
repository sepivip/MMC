import { getVersionInfo } from '@/lib/version';

export function Footer() {
  const versionInfo = getVersionInfo();

  return (
    <footer className="border-t border-border mt-16">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            MetalMarketCap - Market data for precious and industrial metals
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-mono">
              {versionInfo.fullVersion}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">
              Build: {versionInfo.buildDate}
            </span>
            <a
              href="https://github.com/sepivip/MMC"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
