import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { AnalysisResult } from '@/components/analysis-result';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import { AnalyzeResponse } from '@/types';

interface SharePageProps {
  params: Promise<{ id: string }>;
}

async function getAnalysis(id: string): Promise<AnalyzeResponse | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    imageUrl: data.image_url,
    isHotDog: data.is_hot_dog,
    confidence: data.confidence,
    category: data.category,
    hotDogCount: data.hot_dog_count,
    style: data.style,
    reasoning: data.reasoning,
    detectedItems: data.detected_items || [],
    createdAt: data.created_at,
  };
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { id } = await params;
  const analysis = await getAnalysis(id);

  if (!analysis) {
    return {
      title: 'Analysis Not Found',
      description: 'The requested hot dog analysis could not be found.',
    };
  }

  const title = analysis.isHotDog ? '🌭 Hot Dog!' : '❌ Not Hot Dog';
  const description = analysis.reasoning;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: `${appUrl}/api/og?id=${id}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${appUrl}/api/og?id=${id}`],
    },
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const { id } = await params;
  const analysis = await getAnalysis(id);

  if (!analysis) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
        <div className="bg-background/80 backdrop-blur-xl border rounded-full shadow-lg px-6 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold tracking-tight">Hot Dog or Not</h1>
            
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" weight="duotone" />
                Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <AnalysisResult result={analysis} imageUrl={analysis.imageUrl} />
        </div>
      </main>

      {/* Floating CTA */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-full max-w-sm px-4">
        <div className="bg-background/90 backdrop-blur-xl border rounded-full px-4 py-3 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium truncate">Try it yourself!</p>
            <Button size="sm" asChild className="gap-2 shrink-0">
              <Link href="/">
                Analyze
                <ArrowLeft className="w-4 h-4 rotate-180" weight="bold" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
