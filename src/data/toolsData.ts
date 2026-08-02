import { AITool, ToolCategory } from '../types';

export const CATEGORIES_LIST: ToolCategory[] = [
  'Image AI',
  'Video AI',
  'Audio & Voice',
  'Coding & Dev',
  'PDF & Documents',
  'Text & Copywriting',
  'Marketing & Ads',
];

// Base Custom Tools
const FEATURED_TOOLS: AITool[] = [
  {
    id: 'ai-family-portrait-studio',
    name: 'AI Family & Romance Studio',
    slug: 'ai-family-portrait-studio',
    category: 'Image AI',
    subcategory: 'Portraits & Lifestyle',
    description: 'Generate stunning South Indian family portraits, couple photo shoots, and traditional attire poses without writing complex prompts.',
    iconName: 'Sparkles',
    rating: 4.9,
    reviewCount: 1840,
    latencyMs: 380,
    uptimePercent: 99.9,
    pricing: 'Free / 1 Credit',
    badge: 'POPULAR',
    provider: 'Neural Family Engine',
    modelUsed: 'flux-1-portrait-hd',
    tags: ['Family', 'Couple', 'Portrait'],
    inputs: [
      { id: 'prompt', name: 'Family / Couple Style Prompt', type: 'textarea', required: true, defaultValue: 'Indian family portrait in traditional saree and dhoti' }
    ],
    supportedFormats: ['PNG', 'JPG'],
    outputType: 'image',
    featured: true,
    runsToday: 18200,
    apiRoute: '/api/ai/image'
  },
  {
    id: 'regional-ad-banner-maker',
    name: 'Festival & Ad Banner Generator',
    slug: 'regional-ad-banner-maker',
    category: 'Marketing & Ads',
    subcategory: 'Banners & Posters',
    description: 'Create high-converting Aadi Shopping, Diwali, Rakhi, Festival Mega Expo posters and business banners instantly.',
    iconName: 'Sparkles',
    rating: 4.8,
    reviewCount: 2120,
    latencyMs: 420,
    uptimePercent: 99.9,
    pricing: 'Free / 1 Credit',
    badge: 'HOT',
    provider: 'AdGraphic AI',
    modelUsed: 'flux-ad-designer',
    tags: ['Ads', 'Banner', 'Festival'],
    inputs: [
      { id: 'prompt', name: 'Business Ad / Banner Topic', type: 'textarea', required: true, defaultValue: 'Aadi Shopping Thiruvizha Mega Expo Banner' }
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
    iconName: 'Video',
    rating: 4.7,
    reviewCount: 950,
    latencyMs: 1200,
    uptimePercent: 99.8,
    pricing: 'Freemium',
    badge: 'TRENDING',
    provider: 'Wan Motion Router',
    modelUsed: 'wan-2.2-dance',
    tags: ['Reel', 'Dance', 'Motion'],
    inputs: [
      { id: 'prompt', name: 'Dance / Motion Action', type: 'textarea', required: true, defaultValue: 'A young man doing energetic viral Instagram dance' }
    ],
    supportedFormats: ['MP4'],
    outputType: 'video',
    featured: true,
    runsToday: 12900,
    apiRoute: '/api/ai/video'
  }
];

// Helper to expand catalog to 800+ Realistic Tools
function buildFull800ToolCatalog(): AITool[] {
  const tools: AITool[] = [...FEATURED_TOOLS];

  const categories = [
    { name: 'Image AI', type: 'image', prefixes: ['Photo Editor', 'Graphic Designer', 'Logo Maker', 'BG Remover'] },
    { name: 'Video AI', type: 'video', prefixes: ['Reel Maker', 'Motion Tracker', 'Caption Gen', 'Promo Video'] },
    { name: 'Audio & Voice', type: 'audio', prefixes: ['Voiceover', 'TTS Engine', 'Beat Maker', 'Podcast Editor'] },
    { name: 'Coding & Dev', type: 'code', prefixes: ['Code Refactor', 'API Builder', 'React Gen', 'SQL Optimizer'] },
    { name: 'PDF & Documents', type: 'text', prefixes: ['PDF Reader', 'Doc Summarizer', 'OCR Scan', 'Contract Chat'] },
    { name: 'Marketing & Ads', type: 'text', prefixes: ['SEO Writer', 'Ad Copy', 'Email Outreach', 'Blog Maker'] },
  ];

  let idCounter = 100;

  categories.forEach((cat) => {
    // Generate ~140 tools per category to reach 800+ total
    for (let i = 1; i <= 140; i++) {
      const randomPrefix = cat.prefixes[Math.floor(Math.random() * cat.prefixes.length)];
      tools.push({
        id: `auto-tool-${idCounter++}`,
        name: `${randomPrefix} AI Pro v${Math.floor(Math.random() * 5) + 1}.${i}`,
        slug: `auto-tool-${idCounter}`,
        category: cat.name as ToolCategory,
        subcategory: `${cat.name} Suite`,
        description: `Professional AI tool for ${randomPrefix.toLowerCase()} tasks with high accuracy and low latency.`,
        iconName: 'Sparkles',
        rating: Number((4.5 + Math.random() * 0.4).toFixed(1)),
        reviewCount: Math.floor(Math.random() * 2000) + 100,
        latencyMs: Math.floor(Math.random() * 800) + 200,
        uptimePercent: 99.9,
        pricing: i % 3 === 0 ? 'Freemium' : 'Free',
        provider: 'Neural Cloud Node',
        modelUsed: 'enterprise-model-v2',
        tags: [cat.name.split(' ')[0], 'AI', 'Professional'],
        inputs: [
          { id: 'prompt', name: 'Input Command', type: 'textarea', required: true, defaultValue: `Generate output for ${randomPrefix}` }
        ],
        supportedFormats: cat.type === 'image' ? ['PNG'] : cat.type === 'video' ? ['MP4'] : ['TXT'],
        outputType: cat.type as any,
        featured: false,
        runsToday: Math.floor(Math.random() * 5000),
        apiRoute: `/api/ai/${cat.type === 'code' ? 'text' : cat.type}`
      });
    }
  });

  return tools;
}

export const INITIAL_TOOLS: AITool[] = buildFull800ToolCatalog();
export const TOOLS_DATA = INITIAL_TOOLS;
