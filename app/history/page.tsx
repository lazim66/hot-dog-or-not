'use client';

import { useEffect, useState } from 'react';
import { AnalysisCard } from '@/components/analysis-card';
import { StatsChart } from '@/components/stats-chart';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { AnalyzeResponse } from '@/types';
import { getSessionId } from '@/lib/utils';
import { ClockCounterClockwise, ArrowLeft, ChartBar } from '@phosphor-icons/react';
import Link from 'next/link';

const ITEMS_PER_PAGE = 12;

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<AnalyzeResponse[]>([]);
  const [allAnalyses, setAllAnalyses] = useState<AnalyzeResponse[]>([]); // For stats
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Fetch all analyses for stats (once)
  useEffect(() => {
    const fetchAllAnalyses = async () => {
      try {
        const sessionId = getSessionId();
        if (!sessionId) return;

        const response = await fetch(`/api/analyses?sessionId=${sessionId}&limit=1000`);
        if (response.ok) {
          const data = await response.json();
          setAllAnalyses(data.analyses || []);
        }
      } catch (err) {
        console.error('Error fetching all analyses for stats:', err);
      }
    };

    fetchAllAnalyses();
  }, []);

  // Fetch paginated analyses
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const sessionId = getSessionId();
        if (!sessionId) {
          setLoading(false);
          return;
        }

        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        const response = await fetch(
          `/api/analyses?sessionId=${sessionId}&limit=${ITEMS_PER_PAGE}&offset=${offset}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch history');
        }

        const data = await response.json();
        setAnalyses(data.analyses || []);
        setTotal(data.total || 0);
      } catch (err) {
        console.error('Error fetching history:', err);
        setError(err instanceof Error ? err.message : 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentPage]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Floating Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
        <div className="bg-background/80 backdrop-blur-xl border rounded-full shadow-lg px-6 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight">Analysis History</h1>
            
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" weight="duotone" />
                Back
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-7xl mx-auto space-y-8">
          <Tabs defaultValue="history" className="w-full">
            <TabsList>
              <TabsTrigger value="history">
                <ClockCounterClockwise className="w-4 h-4 mr-2" weight="duotone" />
                History
              </TabsTrigger>
              <TabsTrigger value="statistics">
                <ChartBar className="w-4 h-4 mr-2" weight="duotone" />
                Statistics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="history" className="mt-6">
              {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-video rounded-t-lg" />
                  <Skeleton className="h-20 rounded-b-lg" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{error}</p>
            </div>
          ) : analyses.length === 0 ? (
            <div className="text-center py-12">
              <ClockCounterClockwise className="w-16 h-16 mx-auto text-muted-foreground mb-4" weight="duotone" />
              <h3 className="text-lg font-semibold mb-2">No analyses yet</h3>
              <p className="text-muted-foreground mb-6">
                Start analyzing images to build your history
              </p>
              <Button asChild>
                <Link href="/">Analyze an Image</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Grid of analyses */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {analyses.map((analysis) => (
                  <AnalysisCard
                    key={analysis.id}
                    analysis={analysis}
                    onClick={() => {
                      // Could open a dialog or navigate to detail page
                      window.location.href = `/share/${analysis.id}`;
                    }}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>

                      {[...Array(totalPages)].map((_, i) => {
                        const pageNum = i + 1;
                        // Show first page, last page, current page, and pages around current
                        const shouldShow =
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          Math.abs(pageNum - currentPage) <= 1;

                        if (!shouldShow) {
                          // Show ellipsis
                          if (pageNum === 2 && currentPage > 3) {
                            return (
                              <PaginationItem key={i}>
                                <span className="px-4">...</span>
                              </PaginationItem>
                            );
                          }
                          if (pageNum === totalPages - 1 && currentPage < totalPages - 2) {
                            return (
                              <PaginationItem key={i}>
                                <span className="px-4">...</span>
                              </PaginationItem>
                            );
                          }
                          return null;
                        }

                        return (
                          <PaginationItem key={i}>
                            <PaginationLink
                              onClick={() => setCurrentPage(pageNum)}
                              isActive={currentPage === pageNum}
                              className="cursor-pointer"
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      })}

                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
            </TabsContent>

            <TabsContent value="statistics" className="mt-6">
              <StatsChart analyses={allAnalyses} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
