'use client';

import { Card } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

interface SampleImagesProps {
  onSampleSelect: (imageUrl: string) => void;
  disabled?: boolean;
}

const SAMPLE_IMAGES = [
  {
    url: '/samples/hot-dog-combi.jpg',
    label: 'Classic Hot Dog',
    isHotDog: true,
  },
  {
    url: '/samples/hot-dog-creamy.jpg',
    label: 'Creamy Hot Dog',
    isHotDog: true,
  },
  {
    url: '/samples/burger.jpg',
    label: 'Burger',
    isHotDog: false,
  },
  {
    url: '/samples/sandwich.jpg',
    label: 'Sandwich',
    isHotDog: false,
  },
  {
    url: '/samples/food-platter.jpeg',
    label: 'Food Platter',
    isHotDog: false,
  },
];

export function SampleImages({ onSampleSelect, disabled = false }: SampleImagesProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-base font-semibold text-muted-foreground">
          Try these samples
        </h3>
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {SAMPLE_IMAGES.map((sample, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4">
              <button
                onClick={() => !disabled && onSampleSelect(sample.url)}
                disabled={disabled}
                className={cn(
                  'group relative transition-all w-full',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              >
                <Card className="overflow-hidden border-2 transition-all hover:border-primary hover:shadow-lg">
                  <div className="aspect-square bg-muted relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={sample.url}
                      alt={sample.label}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <span className="text-white text-sm font-semibold">
                        {sample.label}
                      </span>
                      <span className="text-white/80 text-xs">
                        Click to analyze
                      </span>
                    </div>
                  </div>
                </Card>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-12" />
        <CarouselNext className="-right-12" />
      </Carousel>
    </div>
  );
}
