import { AIPromptItem, ProviderStatus } from '../types';

export const PROMPTS_DATA: AIPromptItem[] = [
  {
    id: 'p1',
    title: 'Master Photorealistic Cyberpunk Portrait',
    category: 'Image AI',
    promptText: 'A hyper-realistic 8k cinematic photo of a cyberpunk street warrior in neon Tokyo, volumetric fog, dramatic rim lighting, intricate jacket details, shot on 35mm lens f/1.4.',
    recommendedToolId: 'text-to-image-ai',
    tags: ['Cyberpunk', 'Portrait', 'Realistic'],
    likes: 1240
  },
  {
    id: 'p2',
    title: 'Clean React Custom Hook Generator',
    category: 'Coding & Dev',
    promptText: 'Write a TypeScript custom React hook `useLocalStorage` with generic type parameter, error handling, SSR safety check, and automatic state sync.',
    recommendedToolId: 'ai-code-generator',
    tags: ['React', 'TypeScript', 'Hooks'],
    likes: 980
  },
  {
    id: 'p3',
    title: 'High-Converting SaaS Landing Page Copy',
    category: 'Business & Marketing',
    promptText: 'Write a complete SaaS landing page structure including Hero Headline, Sub-headline, 3 Key Features with benefits, Social Proof quotes, FAQ, and Call To Action.',
    recommendedToolId: 'social-ad-copywriter',
    tags: ['SaaS', 'Copywriting', 'Landing Page'],
    likes: 850
  },
  {
    id: 'p4',
    title: 'PDF Executive Summary Extractor',
    category: 'PDF & Documents',
    promptText: 'Analyze the provided document text and extract: 1. Main Objective, 2. Key Metrics & Financials, 3. Critical Risks, 4. Immediate Action Items.',
    recommendedToolId: 'pdf-document-chat',
    tags: ['Executive', 'PDF', 'Summary'],
    likes: 1100
  },
  {
    id: 'p5',
    title: 'Natural Conversational Humanizer',
    category: 'Text & Writing',
    promptText: 'Rewrite the following text to sound completely organic, human, engaging, with natural sentence length variations and clear flow.',
    recommendedToolId: 'text-humanizer',
    tags: ['Humanize', 'Writing', 'Flow'],
    likes: 1420
  }
];

export const PROVIDERS_STATUS_DATA: ProviderStatus[] = [
  {
    id: 'prov-gemini',
    name: 'Google Gemini AI',
    status: 'Healthy',
    latencyMs: 145,
    successRate: 99.98,
    modelsAvailable: 12,
    queueTimeSec: 0.1,
    tier: 'Free Tier',
    lastPing: 'Just now'
  },
  {
    id: 'prov-groq',
    name: 'Groq LPU Accelerator',
    status: 'Healthy',
    latencyMs: 180,
    successRate: 99.92,
    modelsAvailable: 6,
    queueTimeSec: 0.2,
    tier: 'Commercial',
    lastPing: '1s ago'
  },
  {
    id: 'prov-huggingface',
    name: 'HuggingFace Inference',
    status: 'Healthy',
    latencyMs: 380,
    successRate: 99.85,
    modelsAvailable: 45,
    queueTimeSec: 0.4,
    tier: 'Free Tier',
    lastPing: '2s ago'
  },
  {
    id: 'prov-openrouter',
    name: 'OpenRouter Unified API',
    status: 'Healthy',
    latencyMs: 210,
    successRate: 99.88,
    modelsAvailable: 120,
    queueTimeSec: 0.2,
    tier: 'Hybrid',
    lastPing: 'Just now'
  },
  {
    id: 'prov-cloudflare',
    name: 'Cloudflare Workers AI',
    status: 'Healthy',
    latencyMs: 165,
    successRate: 99.95,
    modelsAvailable: 18,
    queueTimeSec: 0.1,
    tier: 'Free Tier',
    lastPing: '1s ago'
  },
  {
    id: 'prov-pollinations',
    name: 'Pollinations Open AI',
    status: 'Healthy',
    latencyMs: 420,
    successRate: 99.75,
    modelsAvailable: 8,
    queueTimeSec: 0.5,
    tier: 'Free Tier',
    lastPing: '3s ago'
  }
];
