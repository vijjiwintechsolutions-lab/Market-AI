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
  tier?: string;       // e.g. 'Tier 1'
  credits?: number;    // e.g. 1
  payPerTask?: string; // e.g. '₹2'
}

export interface ToolTierPricing {
  toolType: string;
  tier: string;
  credits: number;
  payPerTask: string;
  description?: string;
}

export const OFFICIAL_TIER_PRICING: ToolTierPricing[] = [
  { toolType: 'AI Chat', tier: 'Tier 1', credits: 1, payPerTask: '₹2', description: 'Quick Q&A, conversational queries & basic assistant' },
  { toolType: 'AI Translator', tier: 'Tier 1', credits: 1, payPerTask: '₹2', description: 'Multi-language text translation & localization' },
  { toolType: 'AI Grammar', tier: 'Tier 1', credits: 1, payPerTask: '₹2', description: 'Spell checking, syntax polishing & tone adjustment' },
  { toolType: 'AI Writer', tier: 'Tier 2', credits: 2, payPerTask: '₹5', description: 'Articles, blogs, copywriting & creative text generation' },
  { toolType: 'AI Resume', tier: 'Tier 2', credits: 2, payPerTask: '₹5', description: 'ATS optimization, resume building & cover letters' },
  { toolType: 'AI Coding', tier: 'Tier 2', credits: 2, payPerTask: '₹5', description: 'Code generation, debugging, refactoring & SQL' },
  { toolType: 'AI Image', tier: 'Tier 3', credits: 5, payPerTask: '₹10', description: 'High-res image generation, photo editing & avatars' },
  { toolType: 'AI Logo', tier: 'Tier 3', credits: 5, payPerTask: '₹10', description: 'Brand logos, vector graphics & marketing assets' },
  { toolType: 'AI Voice', tier: 'Tier 4', credits: 10, payPerTask: '₹20', description: 'Natural text-to-speech, voice cloning & audio FX' },
  { toolType: 'AI Music', tier: 'Tier 4', credits: 10, payPerTask: '₹20', description: 'AI song composition, background tracks & beats' },
  { toolType: 'AI Video', tier: 'Tier 5', credits: 20, payPerTask: '₹40', description: 'Video synthesis, motion generation & cinematic FX' },
  { toolType: 'AI Agent', tier: 'Tier 6', credits: 50, payPerTask: '₹99', description: 'Autonomous multi-step agents, web research & workflows' },
];

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
