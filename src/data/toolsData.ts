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

const SPECIALIZED_IMAGE_TOOLS = [
  { name: 'South Indian Couple & Romance Studio', desc: 'Create traditional saree & dhoti couple portraits with authentic jewelry & rustic backgrounds.' },
  { name: 'Aadi Shopping & Festival Banner Maker', desc: 'Design high-converting retail expo banners, discount posters, and festive flyers.' },
  { name: 'AI Baby & Toddler Photoshoot Generator', desc: 'Adorable baby photoshoots with cute outfits, rice field backgrounds, and festive themes.' },
  { name: 'YouTube HD Thumbnail & Title Enhancer', desc: 'Eye-catching 4K YouTube thumbnails with bold text overlays and high CTR layouts.' },
  { name: 'AI Background Remover & Object Eraser', desc: 'Instant clean background cutout for e-commerce products, models, and studio shots.' },
  { name: '8K Realism Photo Upscaler & Detailer', desc: 'Upscale low-resolution photos into crystal clear studio 8K resolution images.' },
  { name: 'Traditional Family Reunion Portrait', desc: 'Multi-generational South Indian family portraits with silk clothing and warm lighting.' },
  { name: 'AI Passport & Professional Headshot Creator', desc: 'Transform casual selfies into professional LinkedIn headshots and passport photos.' },
  { name: 'E-commerce Product Photography Studio', desc: 'Generate realistic studio background reflections and lighting for product marketing.' },
  { name: 'Logo & Brand Identity Vector Generator', desc: 'Create minimalist modern vector logos and business brand assets instantly.' }
];

const SPECIALIZED_VIDEO_TOOLS = [
  { name: 'Viral Reel Dance Trend Video Studio', desc: 'Convert character photos into energetic dancing reels with trending motion dynamics.' },
  { name: 'Multi-Language Commercial Video Ad Creator', desc: 'Generate promo video ads in Telugu, Tamil, Hindi, and English with voiceover.' },
  { name: 'Text-to-Cinematic 4K Scene Motion Generator', desc: 'Synthesize smooth 60fps cinematic video clips from simple text prompts.' },
  { name: 'AI Meme & Short Clip Generator', desc: 'Create viral social media meme videos with animated faces and dynamic captions.' },
  { name: 'Product Motion Demo & Showcase Builder', desc: 'Animate product photos with 3D camera sweeps and dramatic lighting for ads.' }
];

const SPECIALIZED_DEV_TOOLS = [
  { name: 'AI Play School & Business Website Builder', desc: 'Generate full responsive HTML & Tailwind CSS websites with colorful themes & forms.' },
  { name: 'E-commerce Storefront UI Code Generator', desc: 'Create clean React/Tailwind code for product catalogs, cart, and payment flows.' },
  { name: 'Landing Page Lead Generation Studio', desc: 'High-converting sales landing page design with hero sections and CTA buttons.' }
];

function generateAccurateCatalog(): AITool[] {
  const catalog: AITool[] = [];

  // 1. Featured Image Tools
  SPECIALIZED_IMAGE_TOOLS.forEach((item, idx) => {
    catalog.push({
      id: `img-tool-${idx + 1}`,
      name: item.name,
      category: 'Image AI',
      subcategory: 'Photo & Graphic Studio',
      provider: 'Neural Image Mesh',
      modelUsed: 'flux-1-schnell',
      rating: Number((4.7 + (idx % 3) * 0.1).toFixed(1)),
      reviewCount: 1200 + idx * 80,
      latencyMs: 320 + idx * 10,
      pricing: 'Free / 1 Credit',
      badge: idx < 3 ? 'Popular' : 'Ultra HD',
      description: item.desc,
      inputs: [
        { id: 'prompt', name: 'Design Description / Topic', type: 'textarea', required: true, defaultValue: item.name }
      ],
      outputType: 'image'
    });
  });

  // 2. Featured Video Tools
  SPECIALIZED_VIDEO_TOOLS.forEach((item, idx) => {
    catalog.push({
      id: `vid-tool-${idx + 1}`,
      name: item.name,
      category: 'Video AI',
      subcategory: 'Reels & Commercial Motion',
      provider: 'Wan Motion Router',
      modelUsed: 'wan-2.2-dance',
      rating: Number((4.8 + (idx % 2) * 0.1).toFixed(1)),
      reviewCount: 980 + idx * 60,
      latencyMs: 950 + idx * 20,
      pricing: 'Free / 2 Credits',
      badge: 'Trending',
      description: item.desc,
      inputs: [
        { id: 'prompt', name: 'Video Script / Motion Idea', type: 'textarea', required: true, defaultValue: item.name }
      ],
      outputType: 'video'
    });
  });

  // 3. Featured Dev & Web Tools
  SPECIALIZED_DEV_TOOLS.forEach((item, idx) => {
    catalog.push({
      id: `dev-tool-${idx + 1}`,
      name: item.name,
      category: 'Coding & Dev',
      subcategory: 'Web Design Studio',
      provider: 'SiteCraft AI',
      modelUsed: 'gpt-4o-web-architect',
      rating: 4.9,
      reviewCount: 1540 + idx * 90,
      latencyMs: 600,
      pricing: 'Competitive / 2 Credits',
      badge: 'Enterprise',
      description: item.desc,
      inputs: [
        { id: 'prompt', name: 'Website Requirements & Business Info', type: 'textarea', required: true, defaultValue: item.name }
      ],
      outputType: 'code'
    });
  });

  // Expand remaining categories with accurate domain titles
  const categories: ToolCategory[] = ['Audio & Voice', 'PDF & Documents', 'Text & Copywriting', 'Marketing & Ads'];
  categories.forEach((cat) => {
    for (let i = 1; i <= 15; i++) {
      catalog.push({
        id: `cat-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${i}`,
        name: `${cat} Specialist - Module #${i}`,
        category: cat,
        subcategory: `${cat} Workflow`,
        provider: 'Neural AI Suite',
        modelUsed: 'standard-engine',
        rating: 4.7,
        reviewCount: 300 + i * 15,
        latencyMs: 300 + i * 5,
        pricing: 'Free / 1 Credit',
        description: `Dedicated ${cat} AI processing tool optimized for high accuracy and fast execution.`,
        inputs: [
          { id: 'prompt', name: 'Input Query', type: 'textarea', required: true, defaultValue: `${cat} task execution` }
        ],
        outputType: cat === 'Audio & Voice' ? 'audio' : 'text'
      });
    }
  });

  return catalog;
}

export const INITIAL_TOOLS: AITool[] = generateAccurateCatalog();
export const TOOLS_DATA = INITIAL_TOOLS;
