export type ToolCategory =
  | 'Text & Writing'
  | 'Image AI'
  | 'Video AI'
  | 'Audio & Voice'
  | 'PDF & Documents'
  | 'Coding & Dev'
  | 'Business & Marketing'
  | 'SEO & Copywriting'
  | 'Education & Study'
  | 'Utilities & Convert'
  | 'Design & Web AI'
  | 'Data & Analytics';

export type PricingType = 'Free' | 'Freemium' | 'Paid' | 'Open Source';

export interface ToolInputParam {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'select' | 'file' | 'slider' | 'boolean';
  description?: string;
  required?: boolean;
  defaultValue?: any;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  accept?: string; // file mime types
}

export interface AITool {
  id: string;
  name: string;
  slug: string;
  category: ToolCategory;
  subcategory: string;
  description: string;
  longDescription?: string;
  iconName: string; // Lucide icon name or image
  rating: number; // e.g. 4.9
  reviewCount: number;
  latencyMs: number; // e.g. 180ms
  uptimePercent: number; // e.g. 99.9
  pricing: PricingType;
  badge?: 'HOT' | 'POPULAR' | 'NEW' | 'VERIFIED' | 'PRO';
  provider: string; // e.g. "Google Gemini", "Groq", "HuggingFace", "Pollinations"
  modelUsed: string; // e.g. "gemini-3.6-flash"
  tags: string[];
  inputs: ToolInputParam[];
  supportedFormats: string[];
  outputType: 'text' | 'markdown' | 'image' | 'video' | 'audio' | 'code' | 'json';
  featured?: boolean;
  runsToday: number;
  apiRoute: string;
  imageUrl?: string;
}

export interface ProviderStatus {
  id: string;
  name: string;
  status: 'Healthy' | 'Degraded' | 'Offline';
  latencyMs: number;
  successRate: number; // e.g. 99.8
  modelsAvailable: number;
  queueTimeSec: number;
  tier: 'Free Tier' | 'Commercial' | 'Hybrid';
  lastPing: string;
}

export interface ToolReview {
  id: string;
  toolId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  date: string;
  comment: string;
  verifiedUser: boolean;
}

export interface ExecutionHistoryItem {
  id: string;
  toolId: string;
  toolName: string;
  prompt: string;
  output: string;
  timestamp: string;
  executionTimeMs: number;
  outputType: string;
  outputUrl?: string;
  ratingGiven?: number;
}

export interface AIPromptItem {
  id: string;
  title: string;
  category: ToolCategory;
  promptText: string;
  recommendedToolId: string;
  tags: string[];
  likes: number;
}
