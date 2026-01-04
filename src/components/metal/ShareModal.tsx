'use client';

import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Metal } from '@/types/metal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShareCard } from './ShareCard';
import { Download, Copy, Check, RectangleHorizontal, Square, Share2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ShareModalProps {
  metal: Metal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareModal({ metal, open, onOpenChange }: ShareModalProps) {
  const [format, setFormat] = useState<'landscape' | 'square'>('landscape');
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const generateImage = async (): Promise<string | null> => {
    if (!cardRef.current) return null;

    try {
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
      });
      return dataUrl;
    } catch (error) {
      console.error('Failed to generate image:', error);
      return null;
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const dataUrl = await generateImage();
      if (dataUrl) {
        const link = document.createElement('a');
        link.download = `${metal.symbol.toLowerCase()}-price-${format}.png`;
        link.href = dataUrl;
        link.click();
        toast.success('Image downloaded successfully');
      }
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download image');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopy = async () => {
    setIsCopying(true);
    try {
      const dataUrl = await generateImage();
      if (dataUrl) {
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopied(true);
        toast.success('Image copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Copy failed:', error);
      toast.error('Failed to copy image');
    } finally {
      setIsCopying(false);
    }
  };

  const formatOptions = [
    {
      id: 'landscape' as const,
      label: 'Landscape',
      sublabel: '1200x630',
      icon: RectangleHorizontal,
      description: 'Ideal for Twitter, LinkedIn, Facebook',
    },
    {
      id: 'square' as const,
      label: 'Square',
      sublabel: '1080x1080',
      icon: Square,
      description: 'Ideal for Instagram, Discord',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-fit sm:max-w-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Share2 className="h-5 w-5 text-primary" aria-hidden="true" />
            Share {metal.name} Data
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create a beautiful shareable image for social media
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Format Selection */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
              Select Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              {formatOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = format === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setFormat(option.id)}
                    className={cn(
                      'flex items-start gap-3 p-3 rounded-lg border-2 text-left',
                      'transition-all duration-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-border/50 hover:border-border hover:bg-accent/30'
                    )}
                    aria-pressed={isSelected}
                  >
                    <div className={cn(
                      'p-2 rounded-md transition-colors',
                      isSelected ? 'bg-primary/15 text-primary' : 'bg-muted/50 text-muted-foreground'
                    )}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          'font-medium text-sm',
                          isSelected ? 'text-foreground' : 'text-foreground/80'
                        )}>
                          {option.label}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground/70">
                          {option.sublabel}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {option.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
              Preview
            </label>
            <div className={cn(
              'border border-border/50 rounded-xl p-4',
              'bg-gradient-to-br from-muted/30 to-muted/10',
              'overflow-auto max-h-[420px]',
              'scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent'
            )}>
              <div className="flex justify-center">
                <div className="shadow-2xl shadow-black/30 rounded-xl overflow-hidden">
                  <ShareCard ref={cardRef} metal={metal} format={format} />
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleDownload}
              disabled={isDownloading || isCopying}
              className="flex-1 gap-2 h-10"
              size="default"
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Download className="h-4 w-4" aria-hidden="true" />
              )}
              {isDownloading ? 'Generating...' : 'Download PNG'}
            </Button>
            <Button
              variant="outline"
              onClick={handleCopy}
              disabled={isCopying || isDownloading}
              className={cn(
                'gap-2 h-10 min-w-[120px]',
                'transition-colors duration-200',
                copied && 'text-green-400 border-green-400/50 bg-green-500/10'
              )}
            >
              {isCopying ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : copied ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" aria-hidden="true" />
              )}
              {isCopying ? 'Copying...' : copied ? 'Copied!' : 'Copy Image'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
