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

// Base featured tools directly matching user screenshots and requirements
const FEATURED_TOOLS: AITool[] = [
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
    description: 'Generate stunning South Indian family portraits, couple photo shoots, traditional attire poses without writing complex prompts.',
    inputs: [
      {
        id: 'prompt',
        name: 'Family / Couple Style Prompt',
        type: 'textarea',
        required: true,
        defaultValue: 'Indian family portrait with parents and toddler in traditional saree and dhoti, smiling indoors',
        description: 'Describe the family pose, festival theme or style...'
      },
      {
        id: 'aspectRatio',
        name: 'Aspect Ratio',
        type: 'select',
        options: ['1:1 (Square)', '9:16 (Story/Reel)', '16:9 (Landscape)'],
        defaultValue: '9:16 (Story/Reel)'
      }
    ],
    outputType: 'image'
  },
  {
    id: 'regional-ad-banner-maker',
    name: 'Festival & Ad Banner Generator',
    category: 'Image AI',
    subcategory: 'Marketing & Ads',
    provider: 'AdGraphic AI',
    modelUsed: 'flux-ad-designer',
    rating: 4.8,
    reviewCount: 2120,
    latencyMs: 420,
    pricing: 'Free / 1 Credit',
    badge: 'Hot',
    description: 'Create high-converting Aadi Shopping, Diwali, Rakhi, Festival Mega Expo posters and business banners instantly.',
    inputs: [
      {
        id: 'prompt',
        name: 'Business Ad / Banner Topic',
        type: 'textarea',
        required: true,
        defaultValue: 'Aadi Shopping Thiruvizha Mega Expo Banner with discount offers and golden traditional decor',
        description: 'Enter your offer title, store name, or event details...'
      }
    ],
    outputType: 'image'
  },
  {
    id: 'ai-dance-trend-meme-maker',
    name: 'AI Dance Trend & Meme Video Studio',
    category: 'Video AI',
    subcategory: 'Social Media & Motion',
    provider: 'Wan Motion Router',
    modelUsed: 'wan-2.2-dance',
    rating: 4.7,
    reviewCount: 950,
    latencyMs: 1200,
    pricing: 'Free / 2 Credits',
    badge: 'Trending',
    description: 'Transform photos into viral dancing reels, meme videos, and motion trends automatically.',
    inputs: [
      {
        id: 'prompt',
        name: 'Dance / Motion Action',
        type: 'textarea',
        required: true,
        defaultValue: 'A young man doing energetic viral Instagram dance trend step in a modern mall hall',
        description: 'Specify the dance style or motion...'
      }
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
      {
        id: 'prompt',
        name: 'Baby / Kid Photoshoot Concept',
        type: 'textarea',
        required: true,
        defaultValue: 'Cute South Indian baby girl dancing in yellow dress in green rice field, natural lighting',
        description: 'Describe dress, background, and smile...'
      }
    ],
    outputType: 'image'
  },
  {
    id: 'ai-website-landing-page-builder',
    name: 'AI Website Builder & Design Studio',
    category: 'Coding & Dev',
    subcategory: 'Web Design',
    provider: 'SiteCraft AI',
    modelUsed: 'gpt-4o-web-architect',
    rating: 4.9,
    reviewCount: 3100,
    latencyMs: 600,
    pricing: 'Competitive / 2 Credits',
    badge: 'Enterprise',
    description: 'Generate full responsive Play School, Business, E-commerce websites with Tailwind CSS, HTML, and copy at competitive prices.',
    inputs: [
      {
        id: 'prompt',
        name: 'Website Name & Business Type',
        type: 'textarea',
        required: true,
        defaultValue: 'Professional Play School Website for Little Stars with enrollment forms, services, and colorful kids theme',
        description: 'Enter business name, services offered, and contact info...'
      }
    ],
    outputType: 'code'
  },
  {
    id: 'multilingual-video-ads-maker',
    name: 'All-Language Video Ad Creator',
    category: 'Video AI',
    subcategory: 'Commercial Ads',
    provider: 'Veo Commercial Mesh',
    modelUsed: 'veo-ad-multilingual',
    rating: 4.8,
    reviewCount: 1680,
    latencyMs: 1100,
    pricing: 'Free / 2 Credits',
    badge: 'Multi-Lang',
    description: 'Create high-converting promotional video ads in Telugu, Tamil, Hindi, English, and all regional languages.',
    inputs: [
      {
        id: 'prompt',
        name: 'Ad Promo Script / Product Idea',
        type: 'textarea',
        required: true,
        defaultValue: 'Promotional video ad for a local clothing store with Aadi discount sales and family models',
        description: 'Specify product name, target language, and discounts...'
      }
    ],
    outputType: 'video'
  },
  {
    id: 'pixel-studio-express',
    name: 'Pixel Studio Express (Text to Image)',
    category: 'Image AI',
    subcategory: 'Photorealism',
    provider: 'FLUX.1 Ultra',
    modelUsed: 'flux-1-schnell',
    rating: 4.9,
    reviewCount: 4200,
    latencyMs: 320,
    pricing: 'Free / 1 Credit',
    badge: 'Ultra HD',
    description: 'Generate hyper-realistic 8K images with clean human anatomy, vivid lighting, and crisp background details.',
    inputs: [
      {
        id: 'prompt',
        name: 'Prompt Description',
        type: 'textarea',
        required: true,
        defaultValue: 'A young Indian boy playing cricket with friends in a sunny green ground',
        description: 'Describe what you want to create...'
      }
    ],
    outputType: 'image'
  },
  {
    id: 'ai-video-clip-animator',
    name: 'AI Video & Clip Animator',
    category: 'Video AI',
    subcategory: 'Video Generation',
    provider: 'Wan 2.2 Open-Source Router',
    modelUsed: 'wan-2.2-open-source',
    rating: 4.8,
    reviewCount: 2890,
    latencyMs: 950,
    pricing: 'Free / 2 Credits',
    badge: 'HD Motion',
    description: 'Synthesize cinematic motion scenes and smooth full-HD video clips from simple prompts.',
    inputs: [
      {
        id: 'prompt',
        name: 'Video Motion Prompt',
        type: 'textarea',
        required: true,
        defaultValue: 'Cinematic video of young boys playing cricket in natural sunlight',
        description: 'Describe the scene motion...'
      }
    ],
    outputType: 'video'
  }
];

// Helper to generate a massive realistic catalog of 800+ AI tools across categories
function buildFull800ToolCatalog(): AITool[] {
  const tools: AITool[] = [...FEATURED_TOOLS];

  const categoryConfigs: { cat: ToolCategory; prefix: string; count: number; outType: 'image' | 'video' | 'audio' | 'code' | 'text' }[] = [
    { cat: 'Image AI', prefix: 'Photo, Banner, Portrait & Design', count: 180, outType: 'image' },
    { cat: 'Video AI', prefix: 'Reel, Ad Video, Motion & Dance', count: 140, outType: 'video' },
    { cat: 'Audio & Voice', prefix: 'Voiceover, TTS, Dubbing & Audio', count: 120, outType: 'audio' },
    { cat: 'Coding & Dev', prefix: 'Website, App, API & Code Builder', count: 110, outType: 'code' },
    { cat: 'PDF & Documents', prefix: 'Document, OCR, PDF & Report Summarizer', count: 90, outType: 'text' },
    { cat: 'Text & Copywriting', prefix: 'SEO Prompt, Article & Ad Copy Writer', count: 90, outType: 'text' },
    { cat: 'Marketing & Ads', prefix: 'Social Ad, Poster & Commercial Designer', count: 90, outType: 'image' },
  ];

  let globalIdCounter = 1;

  categoryConfigs.forEach((cfg) => {
    for (let i = 1; i <= cfg.count; i++) {
      const toolId = `cat-tool-${cfg.cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${i}`;
      tools.push({
        id: toolId,
        name: `${cfg.prefix} Tool #${i}`,
        category: cfg.cat,
        subcategory: `${cfg.cat} Suite`,
        provider: `Neural Engine v${(i % 5) + 1}.0`,
        modelUsed: `ai-model-${(i % 8) + 1}`,
        rating: Number((4.5 + (i % 5) * 0.1).toFixed(1)),
        reviewCount: 200 + i * 12,
        latencyMs: 250 + (i % 30) * 10,
        pricing: i % 2 === 0 ? 'Free / 1 Credit' : 'Free / 2 Credits',
        badge: i % 10 === 0 ? 'Featured' : i % 7 === 0 ? 'Pro' : undefined,
        description: `High performance AI tool for ${cfg.prefix.toLowerCase()} execution with regional language auto-enhancing.`,
        inputs: [
          {
            id: 'prompt',
            name: 'Prompt / Input Text',
            type: 'textarea',
            required: true,
            defaultValue: `Execute ${cfg.prefix} action with detailed specifications in any language`,
            description: 'Enter your custom requirements...'
          }
        ],
        outputType: cfg.outType
      });
      globalIdCounter++;
    }
  });

  return tools;
}

export const INITIAL_TOOLS: AITool[] = buildFull800ToolCatalog();
export const TOOLS_DATA = INITIAL_TOOLS;
