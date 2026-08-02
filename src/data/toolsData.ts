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

export const INITIAL_TOOLS: AITool[] = [
  // --- NEW FEATURED PORTRAIT & AD TOOLS ---
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
      },
      {
        id: 'style',
        name: 'Visual Theme',
        type: 'select',
        options: ['Photorealistic Studio', 'Festive Silk & Gold', 'Outdoor Village Rustic', 'Modern Casual'],
        defaultValue: 'Photorealistic Studio'
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
      },
      {
        id: 'aspectRatio',
        name: 'Poster Layout',
        type: 'select',
        options: ['9:16 (Mobile Story)', '1:1 (Instagram Post)', '16:9 (FB/Web Banner)'],
        defaultValue: '9:16 (Mobile Story)'
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
      },
      {
        id: 'duration',
        name: 'Video Length',
        type: 'select',
        options: ['15 Seconds', '30 Seconds'],
        defaultValue: '15 Seconds'
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
      },
      {
        id: 'aspectRatio',
        name: 'Ratio',
        type: 'select',
        options: ['9:16 (Reels/Status)', '1:1 (Square)', '4:5 (Portrait)'],
        defaultValue: '9:16 (Reels/Status)'
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
      },
      {
        id: 'themeStyle',
        name: 'Design Style',
        type: 'select',
        options: ['Colorful Playful (Schools/Kids)', 'Corporate Professional', 'E-commerce Storefront', 'Minimal Portfolio'],
        defaultValue: 'Colorful Playful (Schools/Kids)'
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
      },
      {
        id: 'language',
        name: 'Target Ad Language',
        type: 'select',
        options: ['Telugu / తెలుగు', 'Tamil / தமிழ்', 'Hindi / हिंदी', 'English', 'Malayalam / മലയാളം', 'Kannada / ಕನ್ನಡ'],
        defaultValue: 'Telugu / తెలుగు'
      }
    ],
    outputType: 'video'
  },

  // --- EXISTING CORE MARKETPLACE TOOLS ---
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
      },
      {
        id: 'aspectRatio',
        name: 'Aspect Ratio',
        type: 'select',
        options: ['1:1 (Square)', '16:9 (Landscape)', '9:16 (Portrait)'],
        defaultValue: '1:1 (Square)'
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

// Alias export to satisfy App.tsx import
export const TOOLS_DATA = INITIAL_TOOLS;
