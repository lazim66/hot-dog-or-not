import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get analyses for this session
    const { data: analyses, error: analysesError, count } = await supabase
      .from('analyses')
      .select('*', { count: 'exact' })
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (analysesError) {
      console.error('Database error:', analysesError);
      return NextResponse.json(
        { error: 'Failed to fetch analyses' },
        { status: 500 }
      );
    }

    // Transform to match API response type
    const transformedAnalyses = (analyses || []).map(analysis => ({
      id: analysis.id,
      imageUrl: analysis.image_url,
      isHotDog: analysis.is_hot_dog,
      confidence: analysis.confidence,
      category: analysis.category,
      hotDogCount: analysis.hot_dog_count,
      style: analysis.style,
      reasoning: analysis.reasoning,
      detectedItems: analysis.detected_items,
      createdAt: analysis.created_at,
    }));

    return NextResponse.json({
      analyses: transformedAnalyses,
      total: count || 0,
    });

  } catch (error) {
    console.error('Analyses fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analyses', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
