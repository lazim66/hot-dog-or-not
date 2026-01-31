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
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(diffDays, 'day');
  };

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all hover:shadow-lg border-2',
        onClick && 'cursor-pointer hover:border-primary'
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
            className={cn(
              'flex items-center gap-1 text-xs font-semibold shadow-lg',
              analysis.isHotDog 
                ? 'bg-green-600 hover:bg-green-600 text-white' 
                : 'bg-red-600 hover:bg-red-600 text-white'
            )}
          >
            {analysis.isHotDog ? (
              <CheckCircle className="w-3 h-3" weight="bold" />
            ) : (
              <XCircle className="w-3 h-3" weight="bold" />
            )}
            {analysis.isHotDog ? 'Hot Dog' : 'Not Hot Dog'}
          </Badge>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            {analysis.confidence.toFixed(0)}% confident
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDate(analysis.createdAt)}
          </span>
        </div>
      </div>
    </Card>
  );
}
