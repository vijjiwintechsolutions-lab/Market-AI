import { AITool, ToolCategory, PricingType } from '../types';

export const CATEGORIES_LIST = [
  'All Categories',
  'Text & Writing',
  'Image AI',
  'Video AI',
  'Audio & Voice',
  'PDF & Documents',
  'Coding & Dev',
  'Business & Marketing',
  'SEO & Copywriting',
  'Education & Study',
  'Utilities & Convert',
  'Design & Web AI',
  'Data & Analytics'
] as const;

export const INITIAL_TOOLS: AITool[] = [
  // --- USER RECENTLY REQUESTED SPECIALIZED TOOLS ---
  {
    id: 'ai-family-portrait-studio',
    name: 'AI Family & Romance Studio',
    slug: 'ai-family-portrait-studio',
    category: 'Image AI',
    subcategory: 'Portraits & Lifestyle',
    description: 'Generate stunning South Indian family portraits, couple photo shoots, and traditional attire poses without writing complex prompts.',
    longDescription: 'Specialized studio tool for creating realistic South Indian family portraits, festival attire poses, and romantic couple shots.',
    iconName: 'Sparkles',
    rating: 4.9,
    reviewCount: 1840,
    latencyMs: 380,
    uptimePercent: 99.9,
    pricing: 'Free',
    badge: 'HOT',
    provider: 'Neural Family Engine',
    modelUsed: 'flux-1-portrait-hd',
    tags: ['Family', 'Couple', 'Portrait', 'Saree', 'Festival'],
    inputs: [
      {
        id: 'prompt',
        name: 'Family / Couple Style Prompt',
        type: 'textarea',
        required: true,
        defaultValue: 'Indian family portrait with parents and toddler in traditional saree and dhoti, smiling indoors'
      },
      {
        id: 'aspectRatio',
        name: 'Aspect Ratio',
        type: 'select',
        options: ['1:1 (Square)', '9:16 (Story/Reel)', '16:9 (Landscape)'],
        defaultValue: '9:16 (Story/Reel)'
      }
    ],
    supportedFormats: ['PNG', 'JPG', 'WEBP'],
    outputType: 'image',
    featured: true,
    runsToday: 18200,
    apiRoute: '/api/ai/image'
  },
  {
    id: 'regional-ad-banner-maker',
    name: 'Festival & Ad Banner Generator',
    slug: 'regional-ad-banner-maker',
    category: 'Business & Marketing',
    subcategory: 'Marketing & Ads',
    description: 'Create high-converting Aadi Shopping, Diwali, Rakhi, Festival Mega Expo posters and business banners instantly.',
    longDescription: 'Ad banner creator tailored for regional business promotions, festive shopping expos, and custom sale posters.',
    iconName: 'Sparkles',
    rating: 4.8,
    reviewCount: 2120,
    latencyMs: 420,
    uptimePercent: 99.9,
    pricing: 'Free',
    badge: 'HOT',
    provider: 'AdGraphic AI',
    modelUsed: 'flux-ad-designer',
    tags: ['Ads', 'Banner', 'Festival', 'Poster', 'Shopping'],
    inputs: [
      {
        id: 'prompt',
        name: 'Business Ad / Banner Topic',
        type: 'textarea',
        required: true,
        defaultValue: 'Aadi Shopping Thiruvizha Mega Expo Banner with discount offers and golden traditional decor'
      }
    ],
    supportedFormats: ['PNG', 'JPG'],
    outputType: 'image',
    featured: true,
    runsToday: 24100,
    apiRoute: '/api/ai/image'
  },
  {
    id: 'ai-dance-trend-meme-maker',
    name: 'AI Dance Trend & Meme Video Studio',
    slug: 'ai-dance-trend-meme-maker',
    category: 'Video AI',
    subcategory: 'Social Media Motion',
    description: 'Transform photos into viral dancing reels, meme videos, and motion trends automatically.',
    longDescription: 'Synthesize motion trends, viral reels, and energetic dance clips from user photos.',
    iconName: 'Video',
    rating: 4.7,
    reviewCount: 950,
    latencyMs: 1200,
    uptimePercent: 99.8,
    pricing: 'Freemium',
    badge: 'NEW',
    provider: 'Wan Motion Router',
    modelUsed: 'wan-2.2-dance',
    tags: ['Reel', 'Dance', 'Motion', 'Meme', 'TikTok'],
    inputs: [
      {
        id: 'prompt',
        name: 'Dance / Motion Action',
        type: 'textarea',
        required: true,
        defaultValue: 'A young man doing energetic viral Instagram dance trend step in a modern mall hall'
      }
    ],
    supportedFormats: ['MP4', 'WEBM'],
    outputType: 'video',
    featured: true,
    runsToday: 12900,
    apiRoute: '/api/ai/video'
  },
  {
    id: 'ai-baby-kids-generator',
    name: 'AI Baby & Kids Photo Generator',
    slug: 'ai-baby-kids-generator',
    category: 'Image AI',
    subcategory: 'Kids & Portraits',
    description: 'Create adorable baby photoshoots, kids festival wear, Hariyali Teej, and Rakhi sibling photos in seconds.',
    longDescription: 'Generate cute baby photos, children festival attire shoots, and sibling portraits.',
    iconName: 'Sparkles',
    rating: 4.9,
    reviewCount: 1420,
    latencyMs: 350,
    uptimePercent: 99.9,
    pricing: 'Free',
    badge: 'POPULAR',
    provider: 'BabyGenie AI',
    modelUsed: 'flux-kids-studio',
    tags: ['Baby', 'Kids', 'Cute', 'Rakhi', 'Festival'],
    inputs: [
      {
        id: 'prompt',
        name: 'Baby / Kid Photoshoot Concept',
        type: 'textarea',
        required: true,
        defaultValue: 'Cute South Indian baby girl dancing in yellow dress in green rice field, natural lighting'
      }
    ],
    supportedFormats: ['PNG', 'JPG'],
    outputType: 'image',
    featured: true,
    runsToday: 15400,
    apiRoute: '/api/ai/image'
  },
  {
    id: 'ai-website-landing-page-builder',
    name: 'AI Website Builder & Design Studio',
    slug: 'ai-website-landing-page-builder',
    category: 'Coding & Dev',
    subcategory: 'Web Design',
    description: 'Generate full responsive Play School, Business, E-commerce websites with Tailwind CSS, HTML, and copy at competitive prices.',
    longDescription: 'AI Web Architect generating complete HTML, CSS, and React website layouts.',
    iconName: 'Code2',
    rating: 4.9,
    reviewCount: 3100,
    latencyMs: 600,
    uptimePercent: 99.9,
    pricing: 'Free',
    badge: 'VERIFIED',
    provider: 'SiteCraft AI',
    modelUsed: 'gpt-4o-web-architect',
    tags: ['Website', 'Tailwind', 'HTML', 'Landing Page', 'Design'],
    inputs: [
      {
        id: 'prompt',
        name: 'Website Name & Business Type',
        type: 'textarea',
        required: true,
        defaultValue: 'Professional Play School Website for Little Stars with enrollment forms, services, and colorful kids theme'
      }
    ],
    supportedFormats: ['HTML', 'Code', 'Markdown'],
    outputType: 'code',
    featured: true,
    runsToday: 21000,
    apiRoute: '/api/ai/text'
  },

  // --- CORE MARKETPLACE TOOLS ---
  {
    id: 'ai-chat-pro',
    name: 'Gemini AI Chat & Assistant',
    slug: 'ai-chat-pro',
    category: 'Text & Writing',
    subcategory: 'AI Chat',
    description: 'Ultra-fast multi-turn conversational AI powered by Gemini 3.6 Flash for Q&A, brainstorming, and complex reasoning.',
    iconName: 'MessageSquareText',
    rating: 4.95,
    reviewCount: 3840,
    latencyMs: 145,
    uptimePercent: 99.98,
    pricing: 'Free',
    badge: 'HOT',
    provider: 'Google Gemini',
    modelUsed: 'gemini-3.6-flash',
    tags: ['Chat', 'Q&A', 'Brainstorming', 'Assistant'],
    inputs: [
      { id: 'prompt', name: 'User Message', type: 'textarea', required: true, defaultValue: 'Explain quantum computing in simple terms.' }
    ],
    supportedFormats: ['Text', 'Markdown'],
    outputType: 'markdown',
    featured: true,
    runsToday: 28490,
    apiRoute: '/api/ai/text'
  },
  {
    id: 'text-to-image-ai',
    name: 'AI Image & Avatar Generator',
    slug: 'text-to-image-ai',
    category: 'Image AI',
    subcategory: 'Text to Image',
    description: 'Generates custom artwork, avatars, face swaps, and edited images following your prompt changes.',
    iconName: 'Sparkles',
    rating: 4.92,
    reviewCount: 5410,
    latencyMs: 820,
    uptimePercent: 99.9,
    pricing: 'Free',
    badge: 'HOT',
    provider: 'Google Gemini Vision',
    modelUsed: 'gemini-3.1-flash-lite-image',
    tags: ['Text to Image', 'Avatar', 'Photo Editing'],
    inputs: [
      { id: 'prompt', name: 'Prompt Description', type: 'textarea', required: true, defaultValue: 'Futuristic neon cyberpunk city at rain' }
    ],
    supportedFormats: ['PNG', 'JPG'],
    outputType: 'image',
    featured: true,
    runsToday: 34100,
    apiRoute: '/api/ai/image'
  },
  {
    id: 'ai-code-generator',
    name: 'Full Stack AI Code Generator & Fixer',
    slug: 'ai-code-generator',
    category: 'Coding & Dev',
    subcategory: 'AI Coding',
    description: 'Generates clean, typed, modular code snippets in React, Node, Python, SQL, and Flutter.',
    iconName: 'Code2',
    rating: 4.96,
    reviewCount: 6120,
    latencyMs: 180,
    uptimePercent: 99.99,
    pricing: 'Free',
    badge: 'HOT',
    provider: 'Google Gemini Pro',
    modelUsed: 'gemini-3.1-pro-preview',
    tags: ['Code', 'Developer', 'TypeScript', 'Python'],
    inputs: [
      { id: 'prompt', name: 'Coding Request', type: 'textarea', required: true, defaultValue: 'Write a React hook for local storage' }
    ],
    supportedFormats: ['Code', 'Markdown'],
    outputType: 'code',
    featured: true,
    runsToday: 41200,
    apiRoute: '/api/ai/text'
  }
];

export const TOOLS_DATA = INITIAL_TOOLS;
