'use client';

import { useEffect, useState } from 'react';
import { AnalysisCard } from '@/components/analysis-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AnalyzeResponse } from '@/types';
import { getSessionId } from '@/lib/utils';
import { ClockCounterClockwise, ArrowRight } from '@phosphor-icons/react';
import Link from 'next/link';

interface HistoryStripProps {
  onAnalysisClick?: (analysis: AnalyzeResponse) => void;
  limit?: number;
}

export function HistoryStrip({ onAnalysisClick, limit = 10 }: HistoryStripProps) {
  const [analyses, setAnalyses] = useState<AnalyzeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const sessionId = getSessionId();
        if (!sessionId) {
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/analyses?sessionId=${sessionId}&limit=${limit}`);
        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }

        const data = await response.json();
        setAnalyses(data.analyses || []);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError(err instanceof Error ? err.message : 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [limit]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ClockCounterClockwise className="w-5 h-5" weight="duotone" />
            Recent Analyses
          </h3>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-64">
              <Skeleton className="aspect-video rounded-t-lg" />
              <Skeleton className="h-20 rounded-b-lg mt-[-1px]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return null; // Silently fail - history is not critical
  }

  if (analyses.length === 0) {
    return null; // Don't show if no history
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ClockCounterClockwise className="w-5 h-5" weight="duotone" />
          Recent Analyses
        </h3>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/history">
            View All
            <ArrowRight className="w-4 h-4 ml-2" weight="duotone" />
          </Link>
        </Button>
      </div>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-4 pb-4">
          {analyses.map((analysis) => (
            <div key={analysis.id} className="flex-shrink-0 w-64">
              <AnalysisCard
                analysis={analysis}
                onClick={() => onAnalysisClick?.(analysis)}
              />
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
