'use client';

import { useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Kbd } from '@/components/ui/kbd';
import { UploadSimple, Camera, Image } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface UploadZoneProps {
  onImageSelect: (file: File) => void;
  disabled?: boolean;
}

export function UploadZone({ onImageSelect, disabled = false }: UploadZoneProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0 && !disabled) {
      onImageSelect(acceptedFiles[0]);
    }
  }, [onImageSelect, disabled]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
    },
    multiple: false,
    disabled,
    noClick: true, // We'll handle clicks manually
  });

  const handleCameraClick = () => {
    if (!disabled) {
      cameraInputRef.current?.click();
    }
  };

  const handleFileClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && !disabled) {
      onImageSelect(file);
    }
    // Reset input
    event.target.value = '';
  };

  return (
    <Card
      {...getRootProps()}
      className={cn(
        'border-2 border-dashed transition-all duration-200',
        isDragActive && 'border-primary bg-primary/5',
        disabled && 'opacity-50 cursor-not-allowed',
        !disabled && 'hover:border-primary/50'
      )}
    >
      <div className="p-6 sm:p-12 flex flex-col items-center justify-center gap-4 sm:gap-6 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <UploadSimple className="w-8 h-8 text-primary" weight="duotone" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            {isDragActive ? 'Drop your image here' : 'Upload an image to analyze'}
          </h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop, or choose from options below
          </p>
        </div>

        <div className="flex gap-3 flex-wrap justify-center">
          <Button
            type="button"
            variant="default"
            onClick={handleFileClick}
            disabled={disabled}
            className="gap-2"
          >
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image className="w-4 h-4" weight="duotone" />
            <span>Choose File</span>
            <div className="hidden sm:flex items-center gap-1">
              <Kbd>{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</Kbd>
              <span className="text-xs text-muted-foreground">+</span>
              <Kbd>O</Kbd>
            </div>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleCameraClick}
            disabled={disabled}
          >
            <Camera className="w-4 h-4 mr-2" weight="duotone" />
            Take Photo
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
          <span>Supports: PNG, JPG, WEBP, GIF</span>
          <span className="text-muted-foreground/50 hidden sm:inline">|</span>
          <div className="flex items-center gap-1.5 hidden sm:flex">
            <span>Paste:</span>
            <Kbd>{typeof navigator !== 'undefined' && navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'}</Kbd>
            <span className="text-xs text-muted-foreground">+</span>
            <Kbd>V</Kbd>
          </div>
        </div>

        {/* Hidden inputs */}
        <input {...getInputProps()} />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled}
        />
      </div>
    </Card>
  );
}
