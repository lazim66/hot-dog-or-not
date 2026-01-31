'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Share, Check } from '@phosphor-icons/react';
import { AnalyzeResponse } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AnalysisDetailModalProps {
  analysis: AnalyzeResponse;
}

export function AnalysisDetailModal({ analysis }: AnalysisDetailModalProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const shareUrl = `${appUrl}/share/${analysis.id}`;

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

  return (
    <div className="flex flex-col h-full">
      {/* Header with Share Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h2 className="text-xl lg:text-2xl font-semibold tracking-tight">Analysis Details</h2>
          <p className="text-xs lg:text-sm text-muted-foreground mt-1">
            {new Date(analysis.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <Button
          onClick={handleShare}
          variant="default"
          size="default"
          className="gap-2 self-start sm:self-auto"
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
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 flex-1 overflow-hidden">
        {/* Left Column - Image */}
        <div className="flex flex-col">
          <div className="relative bg-muted rounded-xl overflow-hidden border-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={analysis.imageUrl}
              alt="Analyzed image"
              className="w-full h-full object-contain max-h-[300px] lg:max-h-[550px]"
            />
            
            {/* Verdict Badge */}
            <div className="absolute top-4 left-4">
              <Badge 
                className={cn(
                  'flex items-center gap-1.5 px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-semibold shadow-lg',
                  analysis.isHotDog 
                    ? 'bg-green-600 hover:bg-green-600 text-white' 
                    : 'bg-red-600 hover:bg-red-600 text-white'
                )}
              >
                {analysis.isHotDog ? (
                  <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4" weight="bold" />
                ) : (
                  <XCircle className="w-3 h-3 lg:w-4 lg:h-4" weight="bold" />
                )}
                {analysis.isHotDog ? 'Hot Dog' : 'Not Hot Dog'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="flex flex-col gap-4 lg:gap-6 overflow-y-auto pr-1 lg:pr-2">
          {/* Confidence */}
          <div className="space-y-2 lg:space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold">Confidence</h4>
              <span className="text-xl lg:text-2xl font-bold">{analysis.confidence.toFixed(1)}%</span>
            </div>
            <Progress value={analysis.confidence} className="h-2 lg:h-2.5" />
          </div>

          <Separator className="my-1 lg:my-2" />

          {/* Reasoning */}
          <div className="space-y-2 lg:space-y-3">
            <h4 className="text-sm font-semibold">Analysis</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {analysis.reasoning}
            </p>
          </div>

          {/* Additional Details */}
          {(analysis.hotDogCount > 1 || analysis.detectedItems.length > 0) && (
            <>
              <Separator className="my-1 lg:my-2" />
              <div className="space-y-3 lg:space-y-4">
                {analysis.hotDogCount > 1 && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-foreground">Count:</span>
                    <span className="font-medium">{analysis.hotDogCount} detected</span>
                  </div>
                )}
                
                {analysis.detectedItems.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Detected Items</h4>
                    <div className="flex flex-wrap gap-1.5 lg:gap-2">
                      {analysis.detectedItems.map((item, index) => (
                        <Badge key={index} variant="outline" className="text-xs lg:text-sm py-1">
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
    </div>
  );
}
