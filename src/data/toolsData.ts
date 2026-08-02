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

const CUSTOM_FEATURED_TOOLS: AITool[] = [
  {
    id: 'ai-family-portrait-studio',
    name: 'AI Family & Romance Studio',
    category: 'Image AI',
    subcategory: 'Portraits & Lifestyle',
    provider: 'Neural Family Engine',
    modelUsed: 'flux-1-portrait-hd',
    rating: 4.9,
    reviewCount: 1840,
    latencyMs: 380,
    pricing: 'Free / 1 Credit',
    badge: 'Popular',
    description: 'Generate stunning South Indian family portraits, couple photo shoots, and traditional attire poses without writing complex prompts.',
    inputs: [
      { id: 'prompt', name: 'Family / Couple Style Prompt', type: 'textarea', required: true, defaultValue: 'Indian family portrait in traditional saree and dhoti smiling indoors' },
      { id: 'aspectRatio', name: 'Aspect Ratio', type: 'select', options: ['1:1 (Square)', '9:16 (Story/Reel)', '16:9 (Landscape)'], defaultValue: '9:16 (Story/Reel)' }
    ],
    outputType: 'image'
  },
  {
    id: 'regional-ad-banner-maker',
    name: 'Festival & Ad Banner Generator',
    category: 'Marketing & Ads',
    subcategory: 'Banners & Posters',
    provider: 'AdGraphic AI',
    modelUsed: 'flux-ad-designer',
    rating: 4.8,
    reviewCount: 2120,
    latencyMs: 420,
    pricing: 'Free / 1 Credit',
    badge: 'Hot',
    description: 'Create high-converting Aadi Shopping, Diwali, Rakhi, Festival Mega Expo posters and business banners instantly.',
    inputs: [
      { id: 'prompt', name: 'Business Ad / Banner Topic', type: 'textarea', required: true, defaultValue: 'Aadi Shopping Thiruvizha Mega Expo Banner with discount offers' }
    ],
    outputType: 'image'
  },
  {
    id: 'ai-dance-trend-meme-maker',
    name: 'AI Dance Trend & Meme Video Studio',
    category: 'Video AI',
    subcategory: 'Social Media Motion',
    provider: 'Wan Motion Router',
    modelUsed: 'wan-2.2-dance',
    rating: 4.7,
    reviewCount: 950,
    latencyMs: 1200,
    pricing: 'Free / 2 Credits',
    badge: 'Trending',
    description: 'Transform photos into viral dancing reels, meme videos, and motion trends automatically.',
    inputs: [
      { id: 'prompt', name: 'Dance / Motion Action', type: 'textarea', required: true, defaultValue: 'A young man doing energetic viral Instagram dance step' }
    ],
    outputType: 'video'
  },
  {
    id: 'ai-baby-kids-generator',
    name: 'AI Baby & Kids Photo Generator',
    category: 'Image AI',
    subcategory: 'Kids & Portraits',
    provider: 'BabyGenie AI',
    modelUsed: 'flux-kids-studio',
    rating: 4.9,
    reviewCount: 1420,
    latencyMs: 350,
    pricing: 'Free / 1 Credit',
    badge: 'New',
    description: 'Create adorable baby photoshoots, kids festival wear, Hariyali Teej, Rakhi sibling photos in seconds.',
    inputs: [
      { id: 'prompt', name: 'Baby / Kid Photoshoot Concept', type: 'textarea', required: true, defaultValue: 'Cute South Indian baby girl dancing in yellow dress in green rice field' }
    ],
    outputType: 'image'
  },
  {
    id: 'ai-website-landing-page-builder',
    name: 'AI Website Builder & Design Studio',
    category: 'Coding & Dev',
    subcategory: 'Web Architecture',
    provider: 'SiteCraft AI',
    modelUsed: 'gpt-4o-web-architect',
    rating: 4.9,
    reviewCount: 3100,
    latencyMs: 600,
    pricing: 'Competitive / 2 Credits',
    badge: 'Enterprise',
    description: 'Generate full responsive Play School, Business, E-commerce websites with Tailwind CSS, HTML, and copy at competitive prices.',
    inputs: [
      { id: 'prompt', name: 'Website Name & Business Type', type: 'textarea', required: true, defaultValue: 'Professional Play School Website for Little Stars with enrollment forms' }
    ],
    outputType: 'code'
  }
];

function buildFull800Tools(): AITool[] {
  const catalog: AITool[] = [...CUSTOM_FEATURED_TOOLS];

  const categories = [
    { name: 'Image AI', outType: 'image', modules: ['Photo Editor', 'Portrait Studio', 'Banner Maker', 'Logo Generator', 'BG Eraser', '4K Upscaler'] },
    { name: 'Video AI', outType: 'video', modules: ['Reel Generator', 'Dance Motion', 'Shorts Maker', 'Ad Creator', 'Character FX'] },
    { name: 'Audio & Voice', outType: 'audio', modules: ['Voice Synthesizer', 'TTS Generator', 'Song Composer', 'Audio Cleaner'] },
    { name: 'Coding & Dev', outType: 'code', modules: ['Web Builder', 'React Architect', 'SQL Query Maker', 'API Generator'] },
    { name: 'PDF & Documents', outType: 'text', modules: ['PDF Summarizer', 'OCR Reader', 'Legal Audit', 'Research Assistant'] },
    { name: 'Text & Copywriting', outType: 'text', modules: ['SEO Writer', 'Article Generator', 'Humanizer Pro', 'Prompt Enhancer'] },
    { name: 'Marketing & Ads', outType: 'image', modules: ['Ad Poster Maker', 'Social Media Flyer', 'E-commerce Display'] }
  ];

  let idCounter = 1000;

  categories.forEach((cat) => {
    for (let i = 1; i <= 120; i++) {
      const moduleName = cat.modules[i % cat.modules.length];
      catalog.push({
        id: `tool-${idCounter++}`,
        name: `${moduleName} Module #${i}`,
        category: cat.name as ToolCategory,
        subcategory: `${cat.name} Workflow`,
        provider: 'Neural AI Suite',
        modelUsed: `neural-model-v${(i % 4) + 1}`,
        rating: Number((4.6 + (i % 4) * 0.1).toFixed(1)),
        reviewCount: 300 + i * 20,
        latencyMs: 250 + i * 5,
        pricing: i % 2 === 0 ? 'Free / 1 Credit' : 'Free / 2 Credits',
        description: `High-speed AI tool for ${moduleName.toLowerCase()} tasks with custom parameters and live API stream links.`,
        inputs: [
          { id: 'prompt', name: 'Input Command / Query', type: 'textarea', required: true, defaultValue: `Execute ${moduleName} task` }
        ],
        outputType: cat.outType as any
      });
    }
  });

  return catalog;
}

export const INITIAL_TOOLS: AITool[] = buildFull800Tools();
export const TOOLS_DATA = INITIAL_TOOLS;
