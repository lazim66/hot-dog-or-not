import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response('Missing id parameter', { status: 400 });
    }

    // Fetch analysis
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return new Response('Analysis not found', { status: 404 });
    }

    const isHotDog = data.is_hot_dog;
    const confidence = data.confidence;
    const title = isHotDog ? 'HOT DOG' : 'NOT HOT DOG';
    const emoji = isHotDog ? '🌭' : '❌';
    const bgColor = isHotDog ? '#16a34a' : '#dc2626';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bgColor,
            backgroundImage: 'linear-gradient(to bottom right, ' + bgColor + ', ' + (isHotDog ? '#15803d' : '#b91c1c') + ')',
          }}
        >
          {/* Emoji */}
          <div
            style={{
              fontSize: 180,
              marginBottom: 40,
            }}
          >
            {emoji}
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 96,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              marginBottom: 20,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </div>

          {/* Confidence */}
          <div
            style={{
              fontSize: 48,
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
            }}
          >
            {confidence.toFixed(1)}% confident
          </div>

          {/* Branding */}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              fontSize: 32,
              color: 'rgba(255, 255, 255, 0.8)',
              fontWeight: '600',
            }}
          >
            Hot Dog or Not
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('OG Image error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
