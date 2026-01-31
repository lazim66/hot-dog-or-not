'use client';

import { useState, useEffect, useRef } from 'react';
import { UploadZone } from '@/components/upload-zone';
import { AnalysisResult } from '@/components/analysis-result';
import { SampleImages } from '@/components/sample-images';
import { HistoryStrip } from '@/components/history-strip';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getSessionId } from '@/lib/utils';
import { AnalyzeResponse } from '@/types';
import { toast } from 'sonner';
import { ArrowCounterClockwise, Keyboard } from '@phosphor-icons/react';

export default function Page() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle image selection from file upload
  const handleImageSelect = async (file: File) => {
    try {
      const base64 = await fileToBase64(file);
      setSelectedImage(base64);
      setResult(null);
      await analyzeImage(base64);
    } catch (error) {
      console.error('Error reading file:', error);
      toast.error('Failed to read image file');
    }
  };

  // Handle sample image selection
  const handleSampleSelect = async (imageUrl: string) => {
    try {
      // Fetch the sample image and convert to base64
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'sample.jpg', { type: blob.type });
      await handleImageSelect(file);
    } catch (error) {
      console.error('Error loading sample:', error);
      toast.error('Failed to load sample image');
    }
  };

  // Analyze image
  const analyzeImage = async (base64Image: string) => {
    setAnalyzing(true);
    setResult(null);

    try {
      const sessionId = getSessionId();
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          sessionId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Analysis failed');
      }

      const data: AnalyzeResponse = await response.json();
      setResult(data);
      
      // Show success toast
      if (data.isHotDog) {
        toast.success('Hot dog detected!', {
          description: `${data.confidence.toFixed(1)}% confidence`,
        });
      } else {
        toast.info('Not a hot dog', {
          description: `${data.confidence.toFixed(1)}% confidence`,
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Analysis failed', {
        description: error instanceof Error ? error.message : 'Please try again',
      });
    } finally {
      setAnalyzing(false);
    }
  };

  // Reset state
  const reset = () => {
    setSelectedImage(null);
    setResult(null);
    setAnalyzing(false);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape - Reset
      if (e.key === 'Escape') {
        reset();
      }
      
      // Cmd/Ctrl + O - Open file picker
      if ((e.metaKey || e.ctrlKey) && e.key === 'o') {
        e.preventDefault();
        fileInputRef.current?.click();
      }
      
      // ? - Show shortcuts
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        setShowShortcuts(!showShortcuts);
      }
    };

    // Paste from clipboard
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            await handleImageSelect(file);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('paste', handlePaste);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('paste', handlePaste);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showShortcuts]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Hot Dog or Not</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Enterprise Edition - Powered by AI
              </p>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowShortcuts(!showShortcuts)}
            >
              <Keyboard className="w-4 h-4 mr-2" weight="duotone" />
              Shortcuts
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Result or Upload Zone */}
          {result ? (
            <div className="space-y-4">
              <AnalysisResult result={result} imageUrl={selectedImage || undefined} />
              
              <div className="flex justify-center">
                <Button
                  onClick={reset}
                  variant="outline"
                  size="lg"
                >
                  <ArrowCounterClockwise className="w-4 h-4 mr-2" weight="duotone" />
                  Analyze Another
                </Button>
              </div>
            </div>
          ) : analyzing ? (
            <div className="space-y-4">
              <Skeleton className="w-full aspect-video rounded-lg" />
              <div className="text-center space-y-2">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Analyzing image...</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  This may take a few seconds
                </p>
              </div>
            </div>
          ) : (
            <>
              <UploadZone
                onImageSelect={handleImageSelect}
                disabled={analyzing}
              />
              
              <SampleImages
                onSampleSelect={handleSampleSelect}
                disabled={analyzing}
              />
            </>
          )}

          {/* History Strip - Show when not analyzing */}
          {!analyzing && (
            <HistoryStrip
              onAnalysisClick={(analysis) => {
                setResult(analysis);
                setSelectedImage(analysis.imageUrl);
              }}
              limit={10}
            />
          )}

          {/* Keyboard Shortcuts */}
          {showShortcuts && (
            <div className="mt-8 p-6 border rounded-lg bg-card">
              <h3 className="font-semibold mb-4">Keyboard Shortcuts</h3>
              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Open file picker</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + O
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Paste from clipboard</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + V
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Reset/Clear</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">Esc</kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Show shortcuts</span>
                  <kbd className="px-2 py-1 bg-muted rounded text-xs font-mono">?</kbd>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2026 Hot Dog or Not - Enterprise Edition. All rights reserved.</p>
          <p className="mt-2">
            Powered by OpenAI GPT-4o Vision & Supabase
          </p>
        </div>
      </footer>

      {/* Hidden file input for keyboard shortcut */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageSelect(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}
