'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SampleImagesProps {
  onSampleSelect: (imageUrl: string) => void;
  disabled?: boolean;
}

// Placeholder sample images - replace with actual hot dog images
const SAMPLE_IMAGES = [
  {
    url: '/samples/hot-dog-1.jpg',
    label: 'Classic Hot Dog',
    isHotDog: true,
  },
  {
    url: '/samples/hot-dog-2.jpg',
    label: 'Chicago Style',
    isHotDog: true,
  },
  {
    url: '/samples/not-hot-dog-1.jpg',
    label: 'Sandwich',
    isHotDog: false,
  },
  {
    url: '/samples/not-hot-dog-2.jpg',
    label: 'Burger',
    isHotDog: false,
  },
];

export function SampleImages({ onSampleSelect, disabled = false }: SampleImagesProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-sm font-medium text-muted-foreground">
          Try these samples
        </h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {SAMPLE_IMAGES.map((sample, index) => (
          <button
            key={index}
            onClick={() => !disabled && onSampleSelect(sample.url)}
            disabled={disabled}
            className={cn(
              'group relative transition-all',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Card className="overflow-hidden border-2 transition-all hover:border-primary hover:shadow-md">
              <div className="aspect-square bg-muted relative flex items-center justify-center">
                {/* Placeholder - will be replaced with actual images */}
                <div className="text-center p-4">
                  <div className="text-4xl mb-2">
                    {sample.isHotDog ? '🌭' : '🍔'}
                  </div>
                  <p className="text-xs font-medium text-muted-foreground">
                    {sample.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    (Add image)
                  </p>
                </div>
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    Analyze
                  </span>
                </div>
              </div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
