import { z } from 'zod';

export const HotDogCategory = z.enum([
  'HOT_DOG',           // Definitive hot dog
  'HOT_DOG_ADJACENT',  // Sausage, bratwurst, corn dog, etc.
  'NOT_HOT_DOG',       // Definitely not a hot dog
  'ARTISTIC_HOT_DOG',  // Drawing, costume, logo, etc.
]);

export const HotDogAnalysisSchema = z.object({
  isHotDog: z.boolean()
    .describe('True if the image contains a real hot dog'),
  
  confidence: z.number().min(0).max(100)
    .describe('Confidence score from 0-100'),
  
  category: HotDogCategory
    .describe('Classification category'),
  
  hotDogCount: z.number().min(0)
    .describe('Number of hot dogs detected in the image'),
  
  style: z.string().nullable()
    .describe('Regional hot dog style if identifiable (Chicago, New York, Sonoran, etc.)'),
  
  reasoning: z.string()
    .describe('Brief explanation of the analysis decision'),
  
  detectedItems: z.array(z.string())
    .describe('List of items detected in the image'),
});

export type HotDogAnalysis = z.infer<typeof HotDogAnalysisSchema>;
export type HotDogCategoryType = z.infer<typeof HotDogCategory>;
