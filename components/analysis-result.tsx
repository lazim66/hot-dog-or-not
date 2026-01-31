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
      {/* Image with Verdict Overlay */}
      {imageUrl && (
        <Card className="overflow-hidden">
          <div className="relative w-full max-w-2xl mx-auto">
            {/* Image with max height constraint */}
            <div className="relative bg-muted rounded-lg overflow-hidden" style={{ maxHeight: '500px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Analyzed image"
                className="w-full h-full object-contain"
                style={{ maxHeight: '500px' }}
              />
              
              {/* Single Clean Verdict Badge */}
              <div className="absolute top-4 left-4">
                <Badge 
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold shadow-lg',
                    result.isHotDog 
                      ? 'bg-green-600 hover:bg-green-600 text-white' 
                      : 'bg-red-600 hover:bg-red-600 text-white'
                  )}
                >
                  {result.isHotDog ? (
                    <CheckCircle className="w-4 h-4" weight="bold" />
                  ) : (
                    <XCircle className="w-4 h-4" weight="bold" />
                  )}
                  {result.isHotDog ? 'Hot Dog' : 'Not Hot Dog'}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Details Card */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          {/* Confidence */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Confidence</h4>
              <span className="text-xl font-bold">{result.confidence.toFixed(1)}%</span>
            </div>
            <Progress value={result.confidence} className="h-2" />
          </div>

          <Separator />

          {/* Reasoning */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Analysis</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {result.reasoning}
            </p>
          </div>

          {/* Additional Details */}
          {(result.hotDogCount > 1 || result.detectedItems.length > 0) && (
            <>
              <Separator />
              <div className="space-y-3">
                {result.hotDogCount > 1 && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-foreground">Count:</span>
                    <span className="font-medium">{result.hotDogCount} detected</span>
                  </div>
                )}
                
                {result.detectedItems.length > 0 && (
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-semibold">Detected Items</h4>
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
