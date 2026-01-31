'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, Palette, ForkKnife } from '@phosphor-icons/react';
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'HOT_DOG':
        return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'HOT_DOG_ADJACENT':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'ARTISTIC_HOT_DOG':
        return 'bg-purple-500/10 text-purple-700 border-purple-500/20';
      case 'NOT_HOT_DOG':
        return 'bg-red-500/10 text-red-700 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.replace(/_/g, ' ');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'HOT_DOG':
        return <ForkKnife className="w-4 h-4" weight="duotone" />;
      case 'HOT_DOG_ADJACENT':
        return <ForkKnife className="w-4 h-4" weight="duotone" />;
      case 'ARTISTIC_HOT_DOG':
        return <Palette className="w-4 h-4" weight="duotone" />;
      default:
        return null;
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-8 space-y-6">
        {/* Image Preview */}
        {imageUrl && (
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Analyzed image"
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Verdict */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            {result.isHotDog ? (
              <CheckCircle className="w-12 h-12 text-green-500" weight="duotone" />
            ) : (
              <XCircle className="w-12 h-12 text-red-500" weight="duotone" />
            )}
          </div>
          
          <h2 className={cn(
            'text-4xl font-bold',
            result.isHotDog ? 'text-green-600' : 'text-red-600'
          )}>
            {result.isHotDog ? '🌭 HOT DOG' : '❌ NOT HOT DOG'}
          </h2>

          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className={getCategoryColor(result.category)}>
              {getCategoryIcon(result.category)}
              <span className="ml-1.5">{getCategoryLabel(result.category)}</span>
            </Badge>
            {result.hotDogCount > 1 && (
              <Badge variant="outline">
                {result.hotDogCount} hot dogs detected
              </Badge>
            )}
          </div>
        </div>

        <Separator />

        {/* Confidence */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Confidence</span>
            <span className="text-muted-foreground">{result.confidence.toFixed(1)}%</span>
          </div>
          <Progress value={result.confidence} className="h-2" />
        </div>

        {/* Style */}
        {result.style && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Style</h4>
            <Badge variant="secondary">{result.style}</Badge>
          </div>
        )}

        {/* Reasoning */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Analysis</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {result.reasoning}
          </p>
        </div>

        {/* Detected Items */}
        {result.detectedItems.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Detected Items</h4>
            <div className="flex flex-wrap gap-2">
              {result.detectedItems.map((item, index) => (
                <Badge key={index} variant="outline">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
