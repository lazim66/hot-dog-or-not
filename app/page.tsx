'use client';

import { useState, useEffect, useRef } from 'react';
import { UploadZone } from '@/components/upload-zone';
import { AnalysisResult } from '@/components/analysis-result';
import { SampleImages } from '@/components/sample-images';
import { HistoryStrip } from '@/components/history-strip';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Kbd } from '@/components/ui/kbd';
import { getSessionId } from '@/lib/utils';
import { AnalyzeResponse } from '@/types';
import { toast } from 'sonner';
import { ArrowCounterClockwise } from '@phosphor-icons/react';
import Link from 'next/link';

export default function Page() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<AnalyzeResponse | null>(null);
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
      {/* Floating Header */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
        <div className="bg-background/80 backdrop-blur-xl border rounded-full shadow-lg px-6 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <h1 className="text-xl font-bold tracking-tight">Hot Dog or Not</h1>
            </Link>
            
            <button
              onClick={() => setShowShortcuts(true)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="hidden sm:inline">Press</span>
              <Kbd>?</Kbd>
              <span className="hidden sm:inline">for shortcuts</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Result or Upload Zone */}
          {result ? (
            <AnalysisResult 
              result={result} 
              imageUrl={selectedImage || undefined} 
              onAnalyzeAnother={reset}
              showAnalyzeAnother={true}
            />
          ) : analyzing ? (
            <div className="space-y-6">
              <Card className="overflow-hidden max-w-2xl mx-auto">
                <div className="relative bg-muted rounded-lg overflow-hidden" style={{ maxHeight: '500px' }}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" 
                       style={{
                         backgroundSize: '200% 100%',
                         animation: 'shimmer 2s infinite'
                       }} 
                  />
                  {selectedImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedImage}
                      alt="Analyzing"
                      className="w-full h-full object-contain opacity-50"
                      style={{ maxHeight: '500px' }}
                    />
                  )}
                </div>
              </Card>
              <Card>
                <CardContent className="py-8">
                  <div className="text-center space-y-4">
                    <div className="flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Analyzing Image</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        This may take a few seconds...
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                setSelectedHistoryItem(analysis);
              }}
              limit={10}
            />
          )}

        </div>
      </main>

      {/* Shortcuts Dialog */}
      <Dialog open={showShortcuts} onOpenChange={setShowShortcuts}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Open file picker</span>
              <div className="flex gap-1">
                <Kbd>{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</Kbd>
                <Kbd>O</Kbd>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Paste from clipboard</span>
              <div className="flex gap-1">
                <Kbd>{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</Kbd>
                <Kbd>V</Kbd>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Reset/Clear</span>
              <Kbd>Esc</Kbd>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Show shortcuts</span>
              <Kbd>?</Kbd>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* History Item Dialog */}
      <Dialog open={selectedHistoryItem !== null} onOpenChange={(open) => !open && setSelectedHistoryItem(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col p-0">
          {selectedHistoryItem && (
            <>
              <DialogHeader className="px-6 pt-6 pb-2 flex-shrink-0">
                <DialogTitle>Analysis Details</DialogTitle>
              </DialogHeader>
              <div className="overflow-y-auto px-6 pb-6">
                <AnalysisResult result={selectedHistoryItem} imageUrl={selectedHistoryItem.imageUrl} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

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
