import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center px-4">
      <Card className="max-w-md w-full border-2">
        <CardContent className="py-12">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <MagnifyingGlass className="w-8 h-8 text-muted-foreground" weight="duotone" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Analysis Not Found</h1>
              <p className="text-muted-foreground">
                The analysis you&apos;re looking for doesn&apos;t exist or has been removed.
              </p>
            </div>

            <Button size="lg" asChild>
              <Link href="/">
                Go Home
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
