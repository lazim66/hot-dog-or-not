'use client';

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Share, Check } from '@phosphor-icons/react';
import { AnalyzeResponse } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AnalysisResultProps {
  result: AnalyzeResponse;
  imageUrl?: string;
  showShare?: boolean;
}

export function AnalysisResult({ result, imageUrl, showShare = false }: AnalysisResultProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const shareUrl = `${appUrl}/share/${result.id}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy link');
    }
  };
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

  return (
    <Card className="overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 p-4 lg:p-6">
        {/* Left: Image with Verdict Badge */}
        {imageUrl && (
          <div className="relative bg-muted rounded-lg overflow-hidden flex items-center justify-center" style={{ minHeight: '250px', maxHeight: '400px' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Analyzed image"
              className="w-full h-full object-contain"
              style={{ maxHeight: '400px' }}
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
        )}

        {/* Right: Details Panel */}
        <div className="flex flex-col space-y-4 lg:space-y-6">
          {/* Header with Share Button */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h3 className="text-base lg:text-lg font-semibold">Analysis Results</h3>
              <p className="text-xs lg:text-sm text-muted-foreground mt-1">
                AI-powered detection complete
              </p>
            </div>
            {showShare && (
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="gap-2 self-start"
                disabled={copied}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" weight="bold" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share className="w-4 h-4" weight="duotone" />
                    Share
                  </>
                )}
              </Button>
            )}
          </div>

          <Separator />

          {/* Confidence */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Confidence</h4>
              <span className="text-xl lg:text-2xl font-bold">{result.confidence.toFixed(1)}%</span>
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
        </div>
      </div>
    </Card>
  );
}
