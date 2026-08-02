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
      { id: 'prompt', name: 'Business Ad / Banner Topic', type: 'textarea', required: true, defaultValue: 'Aadi Shopping Thiruvizha Mega Expo Banner with discount offers' },
      { id: 'aspectRatio', name: 'Poster Layout', type: 'select', options: ['9:16 (Mobile Story)', '1:1 (Square Post)', '16:9 (Banner)'], defaultValue: '9:16 (Mobile Story)' }
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
      { id: 'prompt', name: 'Dance / Motion Action', type: 'textarea', required: true, defaultValue: 'A young man doing energetic viral Instagram dance step' },
      { id: 'aspectRatio', name: 'Video Aspect Ratio', type: 'select', options: ['9:16 (Reels/Shorts)', '16:9 (YouTube)', '1:1 (Square)'], defaultValue: '9:16 (Reels/Shorts)' },
      { id: 'durationSec', name: 'Video Duration', type: 'select', options: ['15 Seconds', '30 Seconds'], defaultValue: '15 Seconds' }
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
      { id: 'prompt', name: 'Baby / Kid Photoshoot Concept', type: 'textarea', required: true, defaultValue: 'Cute South Indian baby girl dancing in yellow dress in green rice field' },
      { id: 'aspectRatio', name: 'Aspect Ratio', type: 'select', options: ['9:16 (Reels)', '1:1 (Square)', '4:5 (Portrait)'], defaultValue: '9:16 (Reels)' }
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
      { id: 'prompt', name: 'Website Name & Business Type', type: 'textarea', required: true, defaultValue: 'Professional Play School Website for Little Stars with enrollment forms' },
      { id: 'themeStyle', name: 'Design Theme', type: 'select', options: ['Colorful Playful (Kids/School)', 'Corporate Modern', 'E-commerce Storefront'], defaultValue: 'Colorful Playful (Kids/School)' }
    ],
    outputType: 'code'
  }
];

function buildFull800Tools(): AITool[] {
  const catalog: AITool[] = [...CUSTOM_FEATURED_TOOLS];

  const categories = [
    { 
      name: 'Image AI', 
      outType: 'image', 
      modules: ['Photo Editor', 'Portrait Studio', 'Banner Maker', 'Logo Generator', 'BG Eraser', '4K Upscaler'],
      inputs: [
        { id: 'prompt', name: 'Image Prompt / Description', type: 'textarea', required: true, defaultValue: 'Masterpiece photo with realistic lighting' },
        { id: 'aspectRatio', name: 'Aspect Ratio', type: 'select', options: ['1:1 (Square)', '16:9 (Landscape)', '9:16 (Portrait)'], defaultValue: '1:1 (Square)' }
      ]
    },
    { 
      name: 'Video AI', 
      outType: 'video', 
      modules: ['Reel Generator', 'Dance Motion', 'Shorts Maker', 'Ad Creator', 'Character FX'],
      inputs: [
        { id: 'prompt', name: 'Video Script / Motion Idea', type: 'textarea', required: true, defaultValue: 'Cinematic video scene with smooth camera motion' },
        { id: 'aspectRatio', name: 'Video Aspect Ratio', type: 'select', options: ['16:9 (YouTube)', '9:16 (Reels/Shorts)', '1:1 (Square)'], defaultValue: '16:9 (YouTube)' },
        { id: 'durationSec', name: 'Video Length', type: 'select', options: ['15 Seconds', '30 Seconds'], defaultValue: '15 Seconds' }
      ]
    },
    { 
      name: 'Audio & Voice', 
      outType: 'audio', 
      modules: ['Voice Synthesizer', 'TTS Generator', 'Song Composer', 'Audio Cleaner'],
      inputs: [
        { id: 'prompt', name: 'Text to Speak / Script', type: 'textarea', required: true, defaultValue: 'Welcome to Neural Market AI speech synthesizer' },
        { id: 'voiceName', name: 'Voice Actor', type: 'select', options: ['Kore (Friendly Female)', 'Zephyr (Warm Male)', 'Puck (Upbeat Male)'], defaultValue: 'Kore (Friendly Female)' }
      ]
    },
    { 
      name: 'Coding & Dev', 
      outType: 'code', 
      modules: ['Web Builder', 'React Architect', 'SQL Query Maker', 'API Generator'],
      inputs: [
        { id: 'prompt', name: 'Code Requirement', type: 'textarea', required: true, defaultValue: 'Write clean typed React component' },
        { id: 'language', name: 'Language', type: 'select', options: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'HTML/Tailwind'], defaultValue: 'TypeScript' }
      ]
    },
    { 
      name: 'PDF & Documents', 
      outType: 'text', 
      modules: ['PDF Summarizer', 'OCR Reader', 'Legal Audit', 'Research Assistant'],
      inputs: [
        { id: 'prompt', name: 'Document Analysis Task', type: 'textarea', required: true, defaultValue: 'Extract executive summary and key points' }
      ]
    },
    { 
      name: 'Text & Copywriting', 
      outType: 'text', 
      modules: ['SEO Writer', 'Article Generator', 'Humanizer Pro', 'Prompt Enhancer'],
      inputs: [
        { id: 'prompt', name: 'Topic / Content Idea', type: 'textarea', required: true, defaultValue: 'Write an informative SEO article' }
      ]
    },
    { 
      name: 'Marketing & Ads', 
      outType: 'image', 
      modules: ['Ad Poster Maker', 'Social Media Flyer', 'E-commerce Display'],
      inputs: [
        { id: 'prompt', name: 'Ad Campaign Topic', type: 'textarea', required: true, defaultValue: 'Promotional discount banner for shopping sale' },
        { id: 'aspectRatio', name: 'Poster Ratio', type: 'select', options: ['9:16 (Story)', '1:1 (Square)', '16:9 (Banner)'], defaultValue: '9:16 (Story)' }
      ]
    }
  ];

  let idCounter = 1000;

  categories.forEach((cat) => {
    for (let i = 1; i <= 115; i++) {
      const moduleName = cat.modules[i % cat.modules.length];
      catalog.push({
        id: `tool-${idCounter++}`,
        name: `${moduleName} Module #${i}`,
        category: cat.name as ToolCategory,
        subcategory: `${cat.name} Suite`,
        provider: 'Neural AI Suite',
        modelUsed: `neural-model-v${(i % 4) + 1}`,
        rating: Number((4.6 + (i % 4) * 0.1).toFixed(1)),
        reviewCount: 300 + i * 20,
        latencyMs: 250 + i * 5,
        pricing: i % 2 === 0 ? 'Free / 1 Credit' : 'Free / 2 Credits',
        description: `High-speed AI tool for ${moduleName.toLowerCase()} tasks with custom parameters and live API stream links.`,
        inputs: cat.inputs,
        outputType: cat.outType as any
      });
    }
  });

  return catalog;
}

export const INITIAL_TOOLS: AITool[] = buildFull800Tools();
export const TOOLS_DATA = INITIAL_TOOLS;
