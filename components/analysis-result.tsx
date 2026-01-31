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
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            {/* Icon */}
            <div className="flex items-center justify-center">
              {result.isHotDog ? (
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-9 h-9 text-green-500" weight="duotone" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
                  <XCircle className="w-9 h-9 text-red-500" weight="duotone" />
                </div>
              )}
            </div>
            
            {/* Verdict Text */}
            <h2 className={cn(
              'text-3xl font-bold tracking-tight',
              result.isHotDog ? 'text-green-600' : 'text-red-600'
            )}>
              {result.isHotDog ? 'HOT DOG' : 'NOT HOT DOG'}
            </h2>
          </div>
        </CardContent>
      </Card>

      {/* Details Card */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Confidence */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Confidence</span>
              <span className="text-xl font-bold">{result.confidence.toFixed(1)}%</span>
            </div>
            <Progress value={result.confidence} className="h-2" />
          </div>

          <Separator />

          {/* Reasoning with integrated classification */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Analysis</h4>
              <Badge variant="secondary" className="text-xs">{getCategoryLabel(result.category)}</Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {result.reasoning}
            </p>
          </div>

          {/* Additional Details - compact row */}
          {(result.style || result.hotDogCount > 1 || result.detectedItems.length > 0) && (
            <>
              <Separator />
              <div className="space-y-3">
                {result.style && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Style:</span>
                    <Badge variant="secondary" className="text-xs">{result.style}</Badge>
                  </div>
                )}
                
                {result.hotDogCount > 1 && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Count:</span>
                    <span className="font-medium">{result.hotDogCount} detected</span>
                  </div>
                )}
                
                {result.detectedItems.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-sm text-muted-foreground">Detected Items:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {result.detectedItems.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
