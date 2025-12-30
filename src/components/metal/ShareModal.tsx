'use client';

import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
import { Metal } from '@/types/metal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShareCard } from './ShareCard';
import { Download, Copy, Check, RectangleHorizontal, Square } from 'lucide-react';
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle>Share Market Data</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Customize your card and export it for social media.
          </p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Format Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">FORMAT</label>
            <div className="flex gap-2">
              <Button
                variant={format === 'landscape' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFormat('landscape')}
                className="gap-2"
              >
                <RectangleHorizontal className="h-4 w-4" />
                Landscape
              </Button>
              <Button
                variant={format === 'square' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFormat('square')}
                className="gap-2"
              >
                <Square className="h-4 w-4" />
                Square
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className="border border-border rounded-lg p-4 bg-muted/50 overflow-auto max-h-[500px]">
            <div className="flex justify-center">
              <ShareCard ref={cardRef} metal={metal} format={format} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex-1 gap-2"
            >
              <Download className="h-4 w-4" />
              {isDownloading ? 'Downloading...' : 'Download PNG'}
            </Button>
            <Button
              variant="outline"
              onClick={handleCopy}
              disabled={isCopying}
              className={cn('gap-2', copied && 'text-green-500')}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
