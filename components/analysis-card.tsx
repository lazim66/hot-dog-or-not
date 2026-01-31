'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AnalyzeResponse } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle } from '@phosphor-icons/react';

interface AnalysisCardProps {
  analysis: AnalyzeResponse;
  onClick?: () => void;
}

export function AnalysisCard({ analysis, onClick }: AnalysisCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
      Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      'day'
    );
  };

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all hover:shadow-md',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      {/* Image Thumbnail */}
      <div className="relative aspect-square bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={analysis.imageUrl}
          alt={analysis.isHotDog ? 'Hot dog' : 'Not hot dog'}
          className="w-full h-full object-cover"
        />
        
        {/* Result Badge Overlay */}
        <div className="absolute top-2 right-2">
          <Badge
            variant={analysis.isHotDog ? 'default' : 'secondary'}
            className={cn(
              'font-semibold shadow-lg',
              analysis.isHotDog ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
            )}
          >
            {analysis.isHotDog ? (
              <CheckCircle className="w-3 h-3 mr-1" weight="bold" />
            ) : (
              <XCircle className="w-3 h-3 mr-1" weight="bold" />
            )}
            {analysis.isHotDog ? 'Hot Dog' : 'Not Hot Dog'}
          </Badge>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            {analysis.confidence.toFixed(0)}% confident
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDate(analysis.createdAt)}
          </span>
        </div>

        {analysis.style && (
          <Badge variant="outline" className="text-xs">
            {analysis.style}
          </Badge>
        )}
      </div>
    </Card>
  );
}
