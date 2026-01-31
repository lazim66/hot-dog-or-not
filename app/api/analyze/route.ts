import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { HotDogAnalysisSchema } from '@/lib/ai/schema';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { image, sessionId } = await request.json();

    if (!image || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields: image and sessionId' },
        { status: 400 }
      );
    }

    // Extract base64 data and content type
    const base64Match = image.match(/^data:image\/(.*);base64,(.*)$/);
    if (!base64Match) {
      return NextResponse.json(
        { error: 'Invalid image format. Expected base64 encoded image.' },
        { status: 400 }
      );
    }

    const [, imageType, base64Data] = base64Match;

    // AI Analysis
    const result = await generateObject({
      model: openai('gpt-4o'),
      schema: HotDogAnalysisSchema,
      messages: [{
        role: 'user',
        content: [
          { 
            type: 'text', 
            text: `Analyze this image and determine if it contains a hot dog. Consider:
            
- Is this a real hot dog (sausage in a bun)?
- If not a traditional hot dog, is it hot dog adjacent (corn dog, sausage, bratwurst)?
- Is it an artistic representation (drawing, costume, logo)?
- How many hot dogs are present?
- What regional style is it (Chicago, New York, Coney Island, etc.)?
- What other items are in the image?

Provide a confidence score (0-100) and clear reasoning for your decision.` 
          },
          { 
            type: 'image', 
            image: base64Data
          }
        ]
      }]
    });

    const analysis = result.object;

    // Upload image to Supabase Storage
    const supabase = await createClient();
    const timestamp = Date.now();
    const fileName = `${sessionId}/${timestamp}.${imageType}`;
    
    const imageBuffer = Buffer.from(base64Data, 'base64');
    
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(fileName, imageBuffer, {
        contentType: `image/${imageType}`,
        cacheControl: '3600',
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload image' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(fileName);

    // Save analysis to database
    const { data: dbData, error: dbError } = await supabase
      .from('analyses')
      .insert({
        image_url: publicUrl,
        image_path: fileName,
        is_hot_dog: analysis.isHotDog,
        confidence: analysis.confidence,
        category: analysis.category,
        hot_dog_count: analysis.hotDogCount,
        style: analysis.style,
        reasoning: analysis.reasoning,
        detected_items: analysis.detectedItems,
        session_id: sessionId,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save analysis' },
        { status: 500 }
      );
    }

    // Return response
    return NextResponse.json({
      id: dbData.id,
      imageUrl: dbData.image_url,
      isHotDog: dbData.is_hot_dog,
      confidence: dbData.confidence,
      category: dbData.category,
      hotDogCount: dbData.hot_dog_count,
      style: dbData.style,
      reasoning: dbData.reasoning,
      detectedItems: dbData.detected_items,
      createdAt: dbData.created_at,
    });

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
