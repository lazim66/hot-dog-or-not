'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle } from '@phosphor-icons/react';
import { AnalyzeResponse } from '@/types';
import { cn } from '@/lib/utils';

interface AnalysisResultProps {
  result: AnalyzeResponse;
  imageUrl?: string;
}

export function AnalysisResult({ result, imageUrl }: AnalysisResultProps) {
  useEffect(() => {
    // Trigger confetti for hot dog detections
    if (result.isHotDog) {
      const duration = 2000;
      const end = Date.now() + duration;

      const interval = setInterval(() => {
        if (Date.now() > end) {
          clearInterval(interval);
          return;
        }

        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FF6B6B', '#FFD93D', '#6BCB77']
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FF6B6B', '#FFD93D', '#6BCB77']
        });
      }, 50);

      return () => clearInterval(interval);
    }
  }, [result.isHotDog]);

  const getCategoryLabel = (category: string) => {
    return category.replace(/_/g, ' ');
  };

  return (
    <div className="space-y-6">
      {/* Image */}
      {imageUrl && (
        <Card className="overflow-hidden">
          <div className="relative aspect-video bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Analyzed image"
              className="w-full h-full object-contain"
            />
          </div>
        </Card>
      )}

      {/* Verdict Card */}
      <Card>
        <CardContent className="pt-12 pb-8">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="flex items-center justify-center">
              {result.isHotDog ? (
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-500" weight="duotone" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center">
                  <XCircle className="w-12 h-12 text-red-500" weight="duotone" />
                </div>
              )}
            </div>
            
            {/* Verdict Text */}
            <div>
              <h2 className={cn(
                'text-5xl font-bold tracking-tight',
                result.isHotDog ? 'text-green-600' : 'text-red-600'
              )}>
                {result.isHotDog ? 'HOT DOG' : 'NOT HOT DOG'}
              </h2>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Card */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Confidence */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Confidence</span>
              <span className="text-2xl font-bold">{result.confidence.toFixed(1)}%</span>
            </div>
            <Progress value={result.confidence} className="h-2" />
          </div>

          <Separator />

          {/* Category */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Classification</h4>
            <p className="text-sm text-muted-foreground">{getCategoryLabel(result.category)}</p>
          </div>

          <Separator />

          {/* Reasoning */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Analysis</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {result.reasoning}
            </p>
          </div>

          {/* Style - only show if not null */}
          {result.style && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Style</h4>
                <Badge variant="secondary">{result.style}</Badge>
              </div>
            </>
          )}

          {/* Hot Dog Count */}
          {result.hotDogCount > 1 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Count</h4>
                <p className="text-sm text-muted-foreground">
                  {result.hotDogCount} hot dogs detected
                </p>
              </div>
            </>
          )}

          {/* Detected Items */}
          {result.detectedItems.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Detected Items</h4>
                <div className="flex flex-wrap gap-2">
                  {result.detectedItems.map((item, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
