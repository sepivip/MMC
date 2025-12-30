'use client';

import { Metal } from '@/types/metal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AboutMetalProps {
  metal: Metal;
}

export function AboutMetal({ metal }: AboutMetalProps) {
  if (!metal.description) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">About {metal.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {metal.description}
        </p>
      </CardContent>
    </Card>
  );
}
