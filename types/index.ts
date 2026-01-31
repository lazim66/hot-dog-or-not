import { HotDogCategoryType } from '@/lib/ai/schema';

export interface Analysis {
  id: string;
  image_url: string;
  image_path: string;
  is_hot_dog: boolean;
  confidence: number;
  category: HotDogCategoryType;
  hot_dog_count: number;
  style: string | null;
  reasoning: string;
  detected_items: string[];
  session_id: string;
  created_at: string;
}

export interface AnalyzeRequest {
  image: string; // Base64 encoded image
  sessionId: string;
}

export interface AnalyzeResponse {
  id: string;
  imageUrl: string;
  isHotDog: boolean;
  confidence: number;
  category: HotDogCategoryType;
  hotDogCount: number;
  style: string | null;
  reasoning: string;
  detectedItems: string[];
  createdAt: string;
}
