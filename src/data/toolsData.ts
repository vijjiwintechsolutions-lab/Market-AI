import { AITool, ToolCategory, PricingType } from '../types';

// Hand-crafted featured flagship tools with detailed custom inputs
const FEATURED_TOOLS: AITool[] = [
  // --- TEXT & WRITING ---
  {
    id: 'ai-chat-pro',
    name: 'Gemini AI Chat & Assistant',
    slug: 'ai-chat-pro',
    category: 'Text & Writing',
    subcategory: 'AI Chat',
    description: 'Ultra-fast multi-turn conversational AI powered by Gemini 3.6 Flash for Q&A, brainstorming, and complex reasoning.',
    longDescription: 'Conversational assistant with deep reasoning, instant streaming capabilities, custom system instructions, and real-time response generation.',
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
      { id: 'prompt', name: 'User Message', type: 'textarea', required: true, defaultValue: 'Explain quantum computing in simple terms for a 10-year-old with a real-world analogy.' },
      { id: 'systemInstruction', name: 'System Role', type: 'text', defaultValue: 'You are a friendly, concise AI assistant.' },
      { id: 'creativity', name: 'Creativity (Temperature)', type: 'slider', min: 0.1, max: 1.0, step: 0.1, defaultValue: 0.7 }
    ],
    supportedFormats: ['Text', 'Markdown'],
    outputType: 'markdown',
    featured: true,
    runsToday: 28490,
    apiRoute: '/api/ai/text'
  },
  {
    id: 'article-generator',
    name: 'SEO Article & Blog Writer',
    slug: 'article-generator',
    category: 'Text & Writing',
    subcategory: 'Article Generator',
    description: 'Generates fully structured, SEO-optimized articles with titles, headings, intro, body, FAQs, and conclusions.',
    iconName: 'FileText',
    rating: 4.88,
    reviewCount: 2190,
    latencyMs: 310,
    uptimePercent: 99.9,
    pricing: 'Freemium',
    badge: 'POPULAR',
    provider: 'Groq / Llama-3',
    modelUsed: 'llama-3.3-70b',
    tags: ['SEO', 'Blogging', 'Articles', 'Content Creation'],
    inputs: [
      { id: 'topic', name: 'Article Topic / Keyword', type: 'text', required: true, defaultValue: 'The Future of Renewable Energy in 2030' },
      { id: 'tone', name: 'Writing Tone', type: 'select', options: ['Professional', 'Informative', 'Casual', 'Persuasive', 'Academic'], defaultValue: 'Informative' },
      { id: 'wordCount', name: 'Target Word Count', type: 'select', options: ['300-500 words', '500-1000 words', '1000+ words'], defaultValue: '500-1000 words' }
    ],
    supportedFormats: ['Markdown', 'HTML', 'TXT'],
    outputType: 'markdown',
    featured: true,
    runsToday: 14200,
    apiRoute: '/api/ai/text'
  },
  {
    id: 'resume-builder-ai',
    name: 'ATS Resume Builder & Optimizer',
    slug: 'resume-builder-ai',
    category: 'Text & Writing',
    subcategory: 'Resume & Career',
    description: 'Tailors your resume summary, work bullets, and skill sections to pass ATS resume scanners with high match scores.',
    iconName: 'Award',
    rating: 4.95,
    reviewCount: 1820,
    latencyMs: 220,
    uptimePercent: 99.95,
    pricing: 'Free',
    badge: 'VERIFIED',
    provider: 'Google Gemini',
    modelUsed: 'gemini-3.6-flash',
    tags: ['Resume', 'Career', 'ATS', 'Job Search'],
    inputs: [
      { id: 'jobTitle', name: 'Target Job Title', type: 'text', required: true, defaultValue: 'Senior Full Stack Software Engineer' },
      { id: 'experience', name: 'Your Core Skills & Experience', type: 'textarea', required: true, defaultValue: 'React, Node.js, TypeScript, PostgreSQL, 5 years experience scaling web apps' },
      { id: 'targetJobDesc', name: 'Job Description (Optional)', type: 'textarea', defaultValue: 'Looking for engineer proficient in Next.js, Cloud deployment, and REST API design.' }
    ],
    supportedFormats: ['Markdown', 'PDF ready'],
    outputType: 'markdown',
    featured: true,
    runsToday: 9810,
    apiRoute: '/api/ai/text'
  },

  // --- IMAGE AI & AVATAR ---
  {
    id: 'text-to-image-ai',
    name: 'AI Image & Avatar Generator',
    slug: 'text-to-image-ai',
    category: 'Image AI',
    subcategory: 'Text to Image',
    description: 'Generates custom artwork, avatars, face swaps, and edited images following your uploaded user photo, sample reference, and prompt changes.',
    iconName: 'Sparkles',
    rating: 4.92,
    reviewCount: 5410,
    latencyMs: 820,
    uptimePercent: 99.9,
    pricing: 'Free',
    badge: 'HOT',
    provider: 'Google Gemini Vision',
    modelUsed: 'gemini-3.1-flash-lite-image',
    tags: ['Text to Image', 'Avatar', 'Photo Editing', 'Style Transfer'],
    inputs: [
      { id: 'prompt', name: 'Requested Changes & Prompt Modifications', type: 'textarea', required: true, defaultValue: 'Combine uploaded user face with sample image style: futuristic neon cyberpunk suit, dramatic studio lighting, 8k render.' },
      { id: 'userImage', name: 'Upload Your Photo / User Image', type: 'file', accept: 'image/*' },
      { id: 'sampleImage', name: 'Upload Sample / Style Reference Image', type: 'file', accept: 'image/*' },
      { id: 'aspectRatio', name: 'Aspect Ratio', type: 'select', options: ['1:1', '16:9', '9:16', '4:3', '3:4'], defaultValue: '1:1' },
      { id: 'style', name: 'Visual Style', type: 'select', options: ['Photorealistic', 'Cinematic 3D', 'Cyberpunk', 'Anime/Manga', 'Watercolor', 'Minimal Logo'], defaultValue: 'Photorealistic' }
    ],
    supportedFormats: ['PNG', 'WEBP', 'JPG'],
    outputType: 'image',
    featured: true,
    runsToday: 34100,
    apiRoute: '/api/ai/image'
  },
  {
    id: 'ai-avatar-creator',
    name: 'AI Avatar & Character Style Maker',
    slug: 'ai-avatar-creator',
    category: 'Image AI',
    subcategory: 'Anime & Character Art',
    description: 'Upload your face image and a sample character reference to transform yourself into custom 3D avatars, anime portraits, and superheroes.',
    iconName: 'Sparkles',
    rating: 4.95,
    reviewCount: 4890,
    latencyMs: 750,
    uptimePercent: 99.92,
    pricing: 'Free',
    badge: 'HOT',
    provider: 'Google Gemini Vision',
    modelUsed: 'gemini-3.6-flash',
    tags: ['Avatar', 'Face Swap', 'Character', 'Style Transfer'],
    inputs: [
      { id: 'prompt', name: 'Avatar Style & Prompt Modifications', type: 'textarea', required: true, defaultValue: 'Transform user face into a 3D Pixar character wearing royal armor, matching the sample image art style.' },
      { id: 'userImage', name: 'Upload Your Photo / User Image', type: 'file', required: true, accept: 'image/*' },
      { id: 'sampleImage', name: 'Upload Sample / Reference Avatar Image', type: 'file', accept: 'image/*' },
      { id: 'aspectRatio', name: 'Aspect Ratio', type: 'select', options: ['1:1', '9:16', '16:9'], defaultValue: '1:1' },
      { id: 'style', name: 'Avatar Render Style', type: 'select', options: ['3D Pixar', 'Anime / Manga', 'Cyberpunk Hero', 'Oil Painting', 'Photorealistic Portrait'], defaultValue: '3D Pixar' }
    ],
    supportedFormats: ['PNG', 'WEBP', 'JPG'],
    outputType: 'image',
    featured: true,
    runsToday: 29800,
    apiRoute: '/api/ai/image'
  },
  {
    id: 'image-bg-remover',
    name: 'AI Background Remover & Eraser',
    slug: 'image-bg-remover',
    category: 'Image AI',
    subcategory: 'Image Editor',
    description: 'Automatically detects subjects and removes backgrounds with hair-level edge precision in milliseconds.',
    iconName: 'Layers',
    rating: 4.88,
    reviewCount: 3120,
    latencyMs: 450,
    uptimePercent: 99.95,
    pricing: 'Free',
    badge: 'VERIFIED',
    provider: 'HuggingFace / RMBG',
    modelUsed: 'briaai/RMBG-1.4',
    tags: ['Background Removal', 'Editing', 'Product Photos', 'PNG'],
    inputs: [
      { id: 'image', name: 'Upload Image', type: 'file', required: true, accept: 'image/*' },
      { id: 'userImage', name: 'Upload Subject Photo (Optional)', type: 'file', accept: 'image/*' },
      { id: 'sampleImage', name: 'Upload New Background Sample (Optional)', type: 'file', accept: 'image/*' },
      { id: 'bgType', name: 'New Background Option', type: 'select', options: ['Transparent PNG', 'Clean White', 'Studio Dark', 'Gradient Soft', 'Sample Image BG'], defaultValue: 'Transparent PNG' }
    ],
    supportedFormats: ['PNG', 'WEBP'],
    outputType: 'image',
    featured: true,
    runsToday: 21000,
    apiRoute: '/api/ai/image'
  },

  // --- AUDIO & VOICE ---
  {
    id: 'ai-text-to-speech',
    name: 'AI Voice & Speech Synthesizer',
    slug: 'ai-text-to-speech',
    category: 'Audio & Voice',
    subcategory: 'Text to Speech',
    description: 'Converts written text into natural human speech with emotional voice options (Kore, Zephyr, Puck, Charon).',
    iconName: 'Mic',
    rating: 4.89,
    reviewCount: 2750,
    latencyMs: 410,
    uptimePercent: 99.9,
    pricing: 'Free',
    badge: 'HOT',
    provider: 'Google Gemini TTS',
    modelUsed: 'gemini-3.1-flash-tts-preview',
    tags: ['Voice', 'Text to Speech', 'Audiobook', 'Podcast'],
    inputs: [
      { id: 'prompt', name: 'Text to Speak', type: 'textarea', required: true, defaultValue: 'Welcome to Market1 AI! The world\'s largest AI tool marketplace featuring real-time latency tracking and live studio capabilities.' },
      { id: 'voiceName', name: 'Select Voice Actor', type: 'select', options: ['Kore (Friendly Female)', 'Zephyr (Warm Male)', 'Puck (Upbeat Male)', 'Charon (Deep Male)', 'Fenrir (Calm Male)'], defaultValue: 'Kore (Friendly Female)' }
    ],
    supportedFormats: ['MP3', 'WAV'],
    outputType: 'audio',
    featured: true,
    runsToday: 18900,
    apiRoute: '/api/ai/audio'
  },

  // --- PDF & DOCUMENTS ---
  {
    id: 'pdf-document-chat',
    name: 'AI PDF Summarizer & Doc Q&A',
    slug: 'pdf-document-chat',
    category: 'PDF & Documents',
    subcategory: 'Document AI',
    description: 'Upload any PDF, document, or contract to extract key insights, answer queries, and draft executive summaries.',
    iconName: 'FileSearch',
    rating: 4.93,
    reviewCount: 4210,
    latencyMs: 280,
    uptimePercent: 99.95,
    pricing: 'Free',
    badge: 'HOT',
    provider: 'Google Gemini',
    modelUsed: 'gemini-3.6-flash',
    tags: ['PDF', 'Document AI', 'Summary', 'Contracts'],
    inputs: [
      { id: 'documentText', name: 'Paste Document Text or Upload PDF', type: 'textarea', required: true, defaultValue: 'MASTER SERVICE AGREEMENT\nSection 1: The Provider agrees to deliver cloud orchestration tools with 99.9% uptime SLA.\nSection 2: Payment terms shall be net 30 days from invoice issuance.\nSection 3: Termination requires 30 days prior written notice.' },
      { id: 'question', name: 'Question or Action', type: 'text', defaultValue: 'Summarize key obligations, payment terms, and termination clauses.' }
    ],
    supportedFormats: ['PDF', 'DOCX', 'TXT'],
    outputType: 'markdown',
    featured: true,
    runsToday: 26300,
    apiRoute: '/api/ai/analyze'
  },

  // --- CODING & DEV ---
  {
    id: 'ai-code-generator',
    name: 'Full Stack AI Code Generator & Fixer',
    slug: 'ai-code-generator',
    category: 'Coding & Dev',
    subcategory: 'AI Coding',
    description: 'Generates clean, typed, modular code snippets in React, Node, Python, SQL, Flutter, Docker, and Rust with bug fixes.',
    iconName: 'Code2',
    rating: 4.96,
    reviewCount: 6120,
    latencyMs: 180,
    uptimePercent: 99.99,
    pricing: 'Free',
    badge: 'HOT',
    provider: 'Google Gemini Pro',
    modelUsed: 'gemini-3.1-pro-preview',
    tags: ['Code', 'Developer', 'TypeScript', 'Python', 'Bug Fix'],
    inputs: [
      { id: 'prompt', name: 'Coding Request / Bug Description', type: 'textarea', required: true, defaultValue: 'Write a TypeScript custom React hook `useDebounce` with full type safety and automatic cleanup.' },
      { id: 'language', name: 'Programming Language', type: 'select', options: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'Rust', 'Go', 'HTML/CSS', 'Docker'], defaultValue: 'TypeScript' }
    ],
    supportedFormats: ['Code', 'Markdown'],
    outputType: 'code',
    featured: true,
    runsToday: 41200,
    apiRoute: '/api/ai/text'
  },

  // --- VIDEO AI ---
  {
    id: 'text-to-video-ai',
    name: 'AI Video & Clip Animator',
    slug: 'text-to-video-ai',
    category: 'Video AI',
    subcategory: 'Text to Video',
    description: 'Upload any video clip, animation, or character image and specify your prompt changes to synthesize transformed AI videos.',
    iconName: 'Video',
    rating: 4.88,
    reviewCount: 2680,
    latencyMs: 1400,
    uptimePercent: 99.6,
    pricing: 'Freemium',
    badge: 'HOT',
    provider: 'Google Veo',
    modelUsed: 'gemini-2.5-flash',
    tags: ['Video', 'Animation', 'Clip Modifier', 'Character Motion'],
    inputs: [
      { id: 'prompt', name: 'Video Modification & Animation Prompt Changes', type: 'textarea', required: true, defaultValue: 'Animate uploaded character clip walking through a bioluminescent glowing forest at sunset, 60 FPS cinematic motion.' },
      { id: 'videoFile', name: 'Upload Sample Video / Animation Clip', type: 'file', accept: 'video/*,image/*' },
      { id: 'sampleImage', name: 'Upload Character / Style Reference Image', type: 'file', accept: 'image/*' },
      { id: 'resolution', name: 'Resolution Quality', type: 'select', options: ['1080p Full HD', '720p HD'], defaultValue: '1080p Full HD' },
      { id: 'aspectRatio', name: 'Aspect Ratio', type: 'select', options: ['16:9 (Landscape)', '9:16 (Portrait)', '1:1 (Square)'], defaultValue: '16:9 (Landscape)' }
    ],
    supportedFormats: ['MP4', 'WEBM'],
    outputType: 'video',
    featured: true,
    runsToday: 18400,
    apiRoute: '/api/ai/video'
  },
  {
    id: 'video-to-video-ai',
    name: 'AI Video-to-Video & Character Modifier',
    slug: 'video-to-video-ai',
    category: 'Video AI',
    subcategory: 'Image to Motion AI',
    description: 'Upload video clips or animation characters along with style references to re-render characters and backgrounds with prompt choices.',
    iconName: 'Video',
    rating: 4.93,
    reviewCount: 3120,
    latencyMs: 1250,
    uptimePercent: 99.8,
    pricing: 'Free',
    badge: 'NEW',
    provider: 'Google Veo Engine',
    modelUsed: 'gemini-2.5-flash',
    tags: ['Video to Video', 'Animation', 'Character Swap', 'VFX'],
    inputs: [
      { id: 'prompt', name: 'Describe Changes & Style Modifications', type: 'textarea', required: true, defaultValue: 'Transform input animation clip into a 3D Pixar rendering style with volumetric lighting and natural camera movement.' },
      { id: 'videoFile', name: 'Upload Input Video Clip / Character Animation', type: 'file', required: true, accept: 'video/*,image/*' },
      { id: 'sampleImage', name: 'Upload Sample Style Reference (Optional)', type: 'file', accept: 'image/*' },
      { id: 'aspectRatio', name: 'Aspect Ratio', type: 'select', options: ['16:9 (Landscape)', '9:16 (Portrait)', '1:1 (Square)'], defaultValue: '16:9 (Landscape)' }
    ],
    supportedFormats: ['MP4', 'WEBM'],
    outputType: 'video',
    featured: true,
    runsToday: 15200,
    apiRoute: '/api/ai/video'
  },

  // --- UTILITIES & CONVERT ---
  {
    id: 'universal-prompt-optimizer',
    name: 'AI Prompt Optimizer & Enhancer',
    slug: 'universal-prompt-optimizer',
    category: 'Utilities & Convert',
    subcategory: 'Prompt Tools',
    description: 'Takes weak, simple prompts and turns them into highly detailed, master-class prompts for Midjourney, Gemini, ChatGPT, or SDXL.',
    iconName: 'Wand2',
    rating: 4.94,
    reviewCount: 3100,
    latencyMs: 150,
    uptimePercent: 99.98,
    pricing: 'Free',
    badge: 'POPULAR',
    provider: 'Google Gemini',
    modelUsed: 'gemini-3.6-flash',
    tags: ['Prompting', 'Optimizer', 'Midjourney', 'ChatGPT'],
    inputs: [
      { id: 'prompt', name: 'Your Simple Prompt', type: 'textarea', required: true, defaultValue: 'A photo of a dog in space' },
      { id: 'targetAI', name: 'Target AI Model', type: 'select', options: ['Midjourney / Image AI', 'Gemini / ChatGPT Text', 'Claude 3.5 Sonnet', 'Stable Diffusion'], defaultValue: 'Midjourney / Image AI' }
    ],
    supportedFormats: ['Text'],
    outputType: 'text',
    featured: true,
    runsToday: 23100,
    apiRoute: '/api/ai/text'
  }
];

// Definition of 12 Categories with their Subcategories and Vendor/Model options
interface CategorySpec {
  category: ToolCategory;
  outputType: 'text' | 'markdown' | 'image' | 'video' | 'audio' | 'code' | 'json';
  apiRoute: string;
  iconName: string;
  subcategories: {
    name: string;
    prefixNames: string[];
    suffixNames: string[];
  }[];
  providers: { provider: string; model: string }[];
  tags: string[];
}

const CATEGORY_SPECS: CategorySpec[] = [
  {
    category: 'Text & Writing',
    outputType: 'markdown',
    apiRoute: '/api/ai/text',
    iconName: 'FileText',
    tags: ['AI Chat', 'Writing', 'Drafting', 'Content', 'Creative', 'Editing'],
    providers: [
      { provider: 'Google Gemini', model: 'gemini-3.6-flash' },
      { provider: 'Anthropic', model: 'claude-3.5-sonnet' },
      { provider: 'OpenAI', model: 'gpt-4o' },
      { provider: 'Groq', model: 'llama-3.3-70b' },
      { provider: 'DeepSeek', model: 'deepseek-v3' },
      { provider: 'Mistral AI', model: 'mistral-large' },
      { provider: 'Cohere', model: 'command-r-plus' }
    ],
    subcategories: [
      { name: 'AI Chat & Assistants', prefixNames: ['Omni', 'Nova', 'Aura', 'Nexus', 'Zenith', 'Echo', 'Vortex'], suffixNames: ['Chatbot', 'Copilot', 'Assistant', 'Brain', 'Reasoner', 'Oracle', 'Agent'] },
      { name: 'Article & Blog Generators', prefixNames: ['Post', 'Blog', 'Article', 'Editorial', 'Scribe', 'Publish', 'Journal'], suffixNames: ['Forge', 'Engine', 'Crafter', 'Studio', 'Writer', 'Composer', 'Architect'] },
      { name: 'Paraphrasing & Humanizers', prefixNames: ['Text', 'Tone', 'Prose', 'Human', 'Flow', 'Style', 'Refine'], suffixNames: ['Transformer', 'Paraphraser', 'Polisher', 'Humanizer', 'Enhancer', 'Smooth', 'Remix'] },
      { name: 'Email & Communication', prefixNames: ['Mail', 'Outreach', 'Inbox', 'Draft', 'Reply', 'Pitch', 'Message'], suffixNames: ['Automator', 'Craft', 'Genius', 'Express', 'Wizard', 'Pulse', 'Dispatcher'] },
      { name: 'Creative Writing & Fiction', prefixNames: ['Story', 'Novel', 'Lore', 'Script', 'Verse', 'Poet', 'Fiction'], suffixNames: ['Weaver', 'Teller', 'Creator', 'Ink', 'Mythos', 'Canvas', 'Realm'] },
      { name: 'Technical & Academic Writing', prefixNames: ['Thesis', 'Paper', 'Manual', 'Doc', 'Research', 'Tech', 'Scholar'], suffixNames: ['Synthesizer', 'Draft', 'Scholar', 'Formatter', 'Logic', 'Structure', 'Compiler'] },
      { name: 'Translation & Multi-language', prefixNames: ['Polyglot', 'Lingua', 'Translate', 'Babel', 'Dialect', 'Global', 'Lingo'], suffixNames: ['Bridge', 'Sync', 'Pro', 'Translate', 'Flow', 'Connect', 'Core'] }
    ]
  },
  {
    category: 'Image AI',
    outputType: 'image',
    apiRoute: '/api/ai/image',
    iconName: 'Sparkles',
    tags: ['Image Gen', 'Art', 'Design', 'Upscale', 'Editing', 'Avatar'],
    providers: [
      { provider: 'Google Gemini', model: 'gemini-3.1-flash-lite-image' },
      { provider: 'Midjourney', model: 'midjourney-v6.1' },
      { provider: 'Black Forest Labs', model: 'flux.1-schnell' },
      { provider: 'Stability AI', model: 'sdxl-turbo' },
      { provider: 'Pollinations', model: 'pollinations-flux' },
      { provider: 'Playground', model: 'playground-v2.5' },
      { provider: 'Ideogram', model: 'ideogram-v2' }
    ],
    subcategories: [
      { name: 'Text to Image Generators', prefixNames: ['Pixel', 'Canvas', 'Dream', 'Vision', 'Chroma', 'Aether', 'Spectra'], suffixNames: ['Diffusion', 'Generator', 'Forge', 'Studio', 'Painter', 'Artist', 'Render'] },
      { name: 'Image Editors & Background Erasers', prefixNames: ['Cutout', 'Erase', 'Mask', 'Retouch', 'BG', 'Layer', 'Object'], suffixNames: ['Wizard', 'Remover', 'Cleaner', 'Studio', 'Pro', 'X', 'Magic'] },
      { name: 'Upscalers & Restorers', prefixNames: ['Sharp', '4K', 'Clarity', 'Restore', 'Res', 'Super', 'Detail'], suffixNames: ['Upscaler', 'Enhancer', 'Fixer', 'HD', 'Ultra', 'Magnifier', 'Master'] },
      { name: 'Logo & Vector Designers', prefixNames: ['Logo', 'Vector', 'Brand', 'Symbol', 'Icon', 'Mark', 'Emblem'], suffixNames: ['Craft', 'Forge', 'Studio', 'Vector', 'Maker', 'Designer', 'Suite'] },
      { name: 'Product & E-Commerce Photos', prefixNames: ['Product', 'Studio', 'Showcase', 'Catalog', 'Merch', 'Mockup', 'Display'], suffixNames: ['Pro', 'Studio', 'AI', 'Shine', 'Render', 'Photographer', 'Stage'] },
      { name: 'Anime & Character Art', prefixNames: ['Anime', 'Manga', 'Waifu', 'Toon', 'Chibi', 'Character', 'Avatar'], suffixNames: ['Diffusion', 'Realm', 'Studio', 'Maker', 'Forge', 'Art', 'Gen'] },
      { name: 'Interior & Architectural Render', prefixNames: ['Spatial', 'Room', 'Interior', 'Architect', 'Deco', 'Structure', 'Floor'], suffixNames: ['Visualizer', 'Designer', 'Render', 'Studio', 'AI', 'Planner', 'Vision'] }
    ]
  },
  {
    category: 'Video AI',
    outputType: 'video',
    apiRoute: '/api/ai/video',
    iconName: 'Video',
    tags: ['Video Gen', 'Animation', 'Reels', 'Avatars', 'Captions', 'Motion'],
    providers: [
      { provider: 'Google Veo', model: 'gemini-2.5-flash' },
      { provider: 'Runway ML', model: 'gen-3-alpha' },
      { provider: 'Luma Labs', model: 'dream-machine-1.5' },
      { provider: 'Sora AI', model: 'sora-v1-turbo' },
      { provider: 'Pika', model: 'pika-2.0' },
      { provider: 'Kling AI', model: 'kling-v1.5' },
      { provider: 'HeyGen', model: 'heygen-avatar-v3' }
    ],
    subcategories: [
      { name: 'Text to Video Generators', prefixNames: ['Cine', 'Motion', 'Frame', 'Reel', 'Clip', 'Vision', 'Sequence'], suffixNames: ['Studio', 'Generator', 'Crafter', 'FX', 'Flow', 'Engine', 'Maker'] },
      { name: 'Image to Motion AI', prefixNames: ['Animate', 'Live', 'Motion', 'Pan', 'Kinetic', 'Flow', 'Depth'], suffixNames: ['Animator', 'Engine', 'Master', 'Studio', 'FX', 'Magician', 'Render'] },
      { name: 'AI Avatars & Talking Heads', prefixNames: ['Avatar', 'Persona', 'Speaker', 'Lipsync', 'Presenter', 'Actor', 'Virtual'], suffixNames: ['Host', 'Studio', 'Actor', 'Pro', 'Talker', 'Sync', 'Voice'] },
      { name: 'Shorts & Reel Creators', prefixNames: ['Shorts', 'Reel', 'Viral', 'TikTok', 'Sniper', 'Clip', 'Trend'], suffixNames: ['Factory', 'Maker', 'Cutter', 'Boost', 'Studio', 'Pro', 'Gen'] },
      { name: 'Captions & Video Editing', prefixNames: ['Sub', 'Caption', 'Cut', 'Split', 'B-Roll', 'Transcribe', 'Edit'], suffixNames: ['Pro', 'Editor', 'Magic', 'Sync', 'Wizard', 'Flow', 'AI'] },
      { name: '3D & VFX Motion AI', prefixNames: ['VFX', 'Cyber', '3D', 'NeRF', 'Particle', 'Sim', 'Render'], suffixNames: ['Lab', 'Forge', 'Studio', 'Engine', 'FX', 'Matrix', 'Master'] }
    ]
  },
  {
    category: 'Audio & Voice',
    outputType: 'audio',
    apiRoute: '/api/ai/audio',
    iconName: 'Mic',
    tags: ['Speech', 'Voice', 'Music', 'Audio', 'Sound Effects', 'Podcast'],
    providers: [
      { provider: 'Google Gemini TTS', model: 'gemini-3.1-flash-tts' },
      { provider: 'ElevenLabs', model: 'eleven-multilingual-v2' },
      { provider: 'Suno AI', model: 'suno-v4' },
      { provider: 'Udio AI', model: 'udio-v1.5' },
      { provider: 'Whisper', model: 'whisper-large-v3' },
      { provider: 'Demucs', model: 'demucs-v4' }
    ],
    subcategories: [
      { name: 'Text to Speech & Voices', prefixNames: ['Vocal', 'Voice', 'Speech', 'Sonic', 'Audio', 'Echo', 'Speak'], suffixNames: ['Synthesizer', 'Studio', 'Pro', 'Actor', 'Craft', 'Engine', 'Gen'] },
      { name: 'AI Music & Song Composers', prefixNames: ['Symphony', 'Song', 'Melody', 'Beat', 'Track', 'Sound', 'Harmony'], suffixNames: ['Composer', 'Maker', 'Forge', 'Studio', 'Craft', 'Band', 'AI'] },
      { name: 'Voice Cloning & Changers', prefixNames: ['Clone', 'Persona', 'Mimic', 'Voice', 'Identity', 'Aura', 'Morph'], suffixNames: ['Cloner', 'Studio', 'Morpher', 'Pro', 'AI', 'Match', 'Craft'] },
      { name: 'Audio Cleaners & Noise Remover', prefixNames: ['Clean', 'Silence', 'Acoustic', 'DeNoise', 'Isolate', 'Pure', 'Vocal'], suffixNames: ['Fixer', 'Remover', 'Studio', 'Master', 'Filter', 'Pro', 'Duo'] },
      { name: 'Audio Transcription & Captions', prefixNames: ['Whisper', 'Transcribe', 'AudioToText', 'Scribe', 'Listener', 'Dictate', 'VoiceNotes'], suffixNames: ['Engine', 'Pro', 'Writer', 'Parser', 'Studio', 'Fast', 'AI'] }
    ]
  },
  {
    category: 'PDF & Documents',
    outputType: 'markdown',
    apiRoute: '/api/ai/analyze',
    iconName: 'FileSearch',
    tags: ['PDF', 'OCR', 'Contracts', 'Invoices', 'Documents', 'Search'],
    providers: [
      { provider: 'Google Gemini Vision', model: 'gemini-3.6-flash' },
      { provider: 'Unstructured', model: 'unstructured-v2' },
      { provider: 'LlamaIndex', model: 'llama-parse-v1' },
      { provider: 'Amazon', model: 'textract-ai' },
      { provider: 'Adobe', model: 'acrobat-ai-engine' }
    ],
    subcategories: [
      { name: 'PDF Chat & Q&A', prefixNames: ['Doc', 'PDF', 'Reader', 'Insight', 'Paper', 'Contract', 'File'], suffixNames: ['Chat', 'Mind', 'Insight', 'Brain', 'Assistant', 'Oracle', 'Reader'] },
      { name: 'OCR & Receipt Readers', prefixNames: ['Scan', 'OCR', 'Receipt', 'Invoice', 'Textractor', 'Lens', 'Vision'], suffixNames: ['Extractor', 'Parser', 'Scanner', 'Reader', 'Pro', 'Studio', 'AI'] },
      { name: 'Contract & Legal AI', prefixNames: ['Legal', 'Clause', 'Contract', 'Risk', 'Policy', 'Terms', 'Audit'], suffixNames: ['Analyzer', 'Auditor', 'Guard', 'Checker', 'Advisor', 'Suite', 'Pro'] },
      { name: 'Academic & Paper Research', prefixNames: ['Scholar', 'Thesis', 'Research', 'Lit', 'Journal', 'Cite', 'Paper'], suffixNames: ['Synthesizer', 'Explorer', 'Summarizer', 'Graph', 'Finder', 'Core', 'AI'] }
    ]
  },
  {
    category: 'Coding & Dev',
    outputType: 'code',
    apiRoute: '/api/ai/text',
    iconName: 'Code2',
    tags: ['Code', 'Developer', 'TypeScript', 'SQL', 'Refactor', 'API'],
    providers: [
      { provider: 'Google Gemini Pro', model: 'gemini-3.1-pro-preview' },
      { provider: 'Anthropic', model: 'claude-3.5-sonnet' },
      { provider: 'Cursor', model: 'cursor-deep-code' },
      { provider: 'Replit', model: 'replit-agent-v2' },
      { provider: 'DeepSeek', model: 'deepseek-coder-v2' },
      { provider: 'GitHub', model: 'copilot-x' }
    ],
    subcategories: [
      { name: 'Full Stack Code Generators', prefixNames: ['Code', 'Stack', 'Dev', 'Syntax', 'Script', 'Logic', 'Architect'], suffixNames: ['Generator', 'Forge', 'Copilot', 'Studio', 'Crafter', 'Builder', 'AI'] },
      { name: 'SQL & Database Assistants', prefixNames: ['SQL', 'Query', 'Postgres', 'Schema', 'DB', 'Data', 'Relational'], suffixNames: ['Architect', 'Optimizer', 'Writer', 'Builder', 'Studio', 'Pro', 'Gen'] },
      { name: 'Bug Fixers & Refactoring', prefixNames: ['Bug', 'Refactor', 'Fixer', 'CleanCode', 'Debug', 'Lint', 'Audit'], suffixNames: ['Doctor', 'Analyzer', 'Fixer', 'Engine', 'Master', 'Studio', 'AI'] },
      { name: 'API & Regex Generators', prefixNames: ['API', 'Regex', 'Endpoint', 'Swagger', 'Route', 'Pattern', 'Schema'], suffixNames: ['Builder', 'Maker', 'Generator', 'Craft', 'Studio', 'Pro', 'Tool'] },
      { name: 'DevOps & CI/CD Config', prefixNames: ['Docker', 'K8s', 'DevOps', 'Terraform', 'CI/CD', 'Cloud', 'Deploy'], suffixNames: ['Architect', 'Generator', 'Script', 'Assistant', 'Master', 'Pro', 'Gen'] }
    ]
  },
  {
    category: 'Business & Marketing',
    outputType: 'markdown',
    apiRoute: '/api/ai/text',
    iconName: 'BarChart3',
    tags: ['Business', 'Marketing', 'Pitch Deck', 'Sales', 'Strategy', 'CRM'],
    providers: [
      { provider: 'Google Gemini', model: 'gemini-3.6-flash' },
      { provider: 'Jasper AI', model: 'jasper-campaign-v3' },
      { provider: 'Copy.ai', model: 'copyai-enterprise' },
      { provider: 'HubSpot', model: 'breeze-ai' },
      { provider: 'Gong AI', model: 'gong-revenue-intelligence' }
    ],
    subcategories: [
      { name: 'Startup Pitch & Business Plans', prefixNames: ['Pitch', 'Venture', 'Startup', 'Plan', 'Deck', 'Founder', 'Valuation'], suffixNames: ['Crafter', 'Builder', 'Architect', 'Forge', 'Studio', 'AI', 'Pro'] },
      { name: 'Social Ads & Campaign Copy', prefixNames: ['Ad', 'Campaign', 'Convert', 'Funnel', 'Social', 'Outreach', 'Promo'], suffixNames: ['Copywriter', 'Engine', 'Genius', 'Master', 'Studio', 'Boost', 'AI'] },
      { name: 'Cold Email & CRM Automation', prefixNames: ['Cold', 'Outreach', 'Lead', 'Prospect', 'CRM', 'Email', 'Sequence'], suffixNames: ['Personalizer', 'Engine', 'Pro', 'Dispatcher', 'Craft', 'AI', 'Master'] },
      { name: 'Competitor Intelligence', prefixNames: ['Market', 'Competitor', 'Intel', 'Bench', 'Trend', 'Insight', 'Scope'], suffixNames: ['Radar', 'Analyzer', 'Spy', 'Tracker', 'Studio', 'Pro', 'AI'] }
    ]
  },
  {
    category: 'SEO & Copywriting',
    outputType: 'markdown',
    apiRoute: '/api/ai/text',
    iconName: 'TrendingUp',
    tags: ['SEO', 'Keywords', 'Copywriting', 'Content', 'Rankings', 'SERP'],
    providers: [
      { provider: 'SurferSEO', model: 'surfer-content-ai' },
      { provider: 'Semrush AI', model: 'semrush-copilot' },
      { provider: 'Ahrefs', model: 'ahrefs-keyword-ai' },
      { provider: 'Google Gemini', model: 'gemini-3.6-flash' },
      { provider: 'Frase', model: 'frase-seo-v2' }
    ],
    subcategories: [
      { name: 'SEO Keyword & Clustering', prefixNames: ['Keyword', 'Cluster', 'SERP', 'Rank', 'SEO', 'Search', 'Niche'], suffixNames: ['Finder', 'Architect', 'Master', 'Analyzer', 'Studio', 'Pro', 'AI'] },
      { name: 'Meta Tag & Title Optimization', prefixNames: ['Meta', 'Title', 'Snippet', 'Headline', 'CTR', 'Tag', 'Schema'], suffixNames: ['Optimizer', 'Craft', 'Generator', 'Forge', 'Studio', 'Pro', 'AI'] },
      { name: 'E-Commerce & Product Copy', prefixNames: ['Amazon', 'Shopify', 'Merch', 'Listing', 'Store', 'Ecom', 'Product'], suffixNames: ['Writer', 'Optimizer', 'Generator', 'Craft', 'Studio', 'Pro', 'AI'] }
    ]
  },
  {
    category: 'Education & Study',
    outputType: 'markdown',
    apiRoute: '/api/ai/text',
    iconName: 'CheckSquare',
    tags: ['Study', 'Quiz', 'Flashcards', 'Tutor', 'Homework', 'Math'],
    providers: [
      { provider: 'Google Gemini', model: 'gemini-3.6-flash' },
      { provider: 'NotebookLM', model: 'notebooklm-pro' },
      { provider: 'Wolfram Alpha', model: 'wolfram-ai-solver' },
      { provider: 'Khan Academy', model: 'khanmigo-ai' }
    ],
    subcategories: [
      { name: 'Quiz & Flashcard Creators', prefixNames: ['Quiz', 'Flashcard', 'Test', 'Study', 'Exam', 'Mem', 'Recall'], suffixNames: ['Forge', 'Generator', 'Maker', 'Studio', 'Craft', 'Pro', 'AI'] },
      { name: 'Math & Science Solvers', prefixNames: ['Math', 'Calculus', 'Physics', 'Chem', 'Formula', 'Equate', 'Solve'], suffixNames: ['Solver', 'Explainer', 'Wizard', 'Pro', 'Studio', 'AI', 'Engine'] },
      { name: 'Language & Essay Tutors', prefixNames: ['Tutor', 'Essay', 'Grammar', 'Lingo', 'Spanish', 'French', 'Fluency'], suffixNames: ['Coach', 'Master', 'Assistant', 'Studio', 'Pro', 'AI', 'Guide'] }
    ]
  },
  {
    category: 'Utilities & Convert',
    outputType: 'text',
    apiRoute: '/api/ai/text',
    iconName: 'Zap',
    tags: ['Prompts', 'Converters', 'Scraping', 'Workflows', 'Automation'],
    providers: [
      { provider: 'Google Gemini', model: 'gemini-3.6-flash' },
      { provider: 'Zapier AI', model: 'zapier-central' },
      { provider: 'Make.com', model: 'make-ai-agent' },
      { provider: 'Firecrawl', model: 'firecrawl-v1' }
    ],
    subcategories: [
      { name: 'Prompt Enhancers & Optimizers', prefixNames: ['Prompt', 'Magic', 'Wand', 'Super', 'Eng', 'Crafter', 'Meta'], suffixNames: ['Optimizer', 'Enhancer', 'Forge', 'Studio', 'Master', 'Pro', 'AI'] },
      { name: 'Web Scraping & Extraction AI', prefixNames: ['Scrape', 'Crawler', 'Extractor', 'Web', 'Page', 'DOM', 'Parse'], suffixNames: ['Agent', 'Bot', 'Studio', 'Pro', 'Wizard', 'AI', 'Engine'] },
      { name: 'File & Format Converters', prefixNames: ['Convert', 'Format', 'JSON', 'CSV', 'SVG', 'Transform', 'Data'], suffixNames: ['Master', 'Converter', 'Studio', 'Pro', 'Engine', 'AI', 'Tool'] }
    ]
  },
  {
    category: 'Design & Web AI',
    outputType: 'code',
    apiRoute: '/api/ai/text',
    iconName: 'Gamepad2',
    tags: ['UI/UX', 'Figma', 'Wireframes', 'Websites', 'Color', 'Tailwind'],
    providers: [
      { provider: 'Google Gemini', model: 'gemini-3.6-flash' },
      { provider: 'v0.dev', model: 'v0-ui-architect' },
      { provider: 'Relume', model: 'relume-site-builder' },
      { provider: 'Framer AI', model: 'framer-ai-v2' }
    ],
    subcategories: [
      { name: 'UI/UX & Wireframe Generators', prefixNames: ['UI', 'UX', 'Wireframe', 'Layout', 'Component', 'Screen', 'App'], suffixNames: ['Architect', 'Generator', 'Studio', 'Forge', 'Pro', 'AI', 'Builder'] },
      { name: 'Color Palette & Brand Kits', prefixNames: ['Color', 'Palette', 'Theme', 'Brand', 'DesignSystem', 'Font', 'Token'], suffixNames: ['Crafter', 'Generator', 'Studio', 'Forge', 'Pro', 'AI', 'Master'] },
      { name: 'Website Builders & Component AI', prefixNames: ['Site', 'Web', 'Landing', 'Tailwind', 'React', 'Figma', 'Style'], suffixNames: ['Builder', 'Generator', 'Studio', 'Forge', 'Pro', 'AI', 'Architect'] }
    ]
  },
  {
    category: 'Data & Analytics',
    outputType: 'json',
    apiRoute: '/api/ai/text',
    iconName: 'Search',
    tags: ['Data', 'Analytics', 'Charts', 'Forecast', 'Sentiment', 'BI'],
    providers: [
      { provider: 'Google Gemini', model: 'gemini-3.6-flash' },
      { provider: 'Julius AI', model: 'julius-analyst-v2' },
      { provider: 'Tableau AI', model: 'tableau-einstein' },
      { provider: 'PowerBI AI', model: 'powerbi-copilot' }
    ],
    subcategories: [
      { name: 'Data Visualizers & Chart AI', prefixNames: ['Chart', 'Graph', 'Vis', 'Data', 'Plot', 'Dashboard', 'Metrics'], suffixNames: ['Maker', 'Generator', 'Studio', 'Forge', 'Pro', 'AI', 'Architect'] },
      { name: 'Financial Forecasting & Models', prefixNames: ['Finance', 'Forecast', 'Predict', 'Stock', 'Revenue', 'Cohort', 'Churn'], suffixNames: ['Modeler', 'Engine', 'Studio', 'Pro', 'AI', 'Wizard', 'Master'] },
      { name: 'Sentiment & Survey Analytics', prefixNames: ['Sentiment', 'Survey', 'Feedback', 'Review', 'Voice', 'NPS', 'Text'], suffixNames: ['Analyzer', 'Engine', 'Studio', 'Pro', 'AI', 'Insight', 'Master'] }
    ]
  }
];

const BRAND_MODIFIERS = [
  'Studio', 'Pro', 'Engine', 'Express', 'Prime', 'Core', 'Flow', 'Max',
  'Hub', 'Lab', 'Nexus', 'Suite', 'Craft', 'Master', 'Central', 'Ultra',
  'Omni', 'Lite', 'Plus', 'Boost', 'Sync', 'Forge', 'Apex', 'Pulse'
];

// Helper to generate catalog items for a given category spec to hit total target
function generateCatalogForCategory(spec: CategorySpec, countNeeded: number): AITool[] {
  const generated: AITool[] = [];
  const usedNames = new Set<string>(FEATURED_TOOLS.map((t) => t.name.toLowerCase()));

  let subIndex = 0;
  for (let i = 0; i < countNeeded; i++) {
    const sub = spec.subcategories[subIndex % spec.subcategories.length];
    subIndex++;

    const prefix = sub.prefixNames[i % sub.prefixNames.length];
    const suffix = sub.suffixNames[(i + 3) % sub.suffixNames.length];
    const vendorObj = spec.providers[i % spec.providers.length];

    const baseName = `${prefix} ${suffix}`;
    let name = baseName;

    let modIndex = 0;
    while (usedNames.has(name.toLowerCase())) {
      const modifier = BRAND_MODIFIERS[modIndex % BRAND_MODIFIERS.length];
      name = `${baseName} ${modifier}`;
      modIndex++;
    }
    usedNames.add(name.toLowerCase());

    const slug = `${spec.category.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    const id = slug;

    const rating = parseFloat((4.6 + (i * 0.013) % 0.39).toFixed(2));
    const reviewCount = 100 + ((i * 123) % 4500);
    const latencyMs = 90 + ((i * 47) % 850);
    const uptimePercent = parseFloat((99.7 + (i * 0.005) % 0.29).toFixed(2));
    const runsToday = 800 + ((i * 380) % 35000);

    const pricings: PricingType[] = ['Free', 'Freemium', 'Paid', 'Open Source'];
    const pricing = pricings[i % pricings.length];

    const badges: ('HOT' | 'POPULAR' | 'NEW' | 'VERIFIED' | 'PRO' | undefined)[] = [
      'HOT', 'POPULAR', 'NEW', 'VERIFIED', 'PRO', undefined, undefined
    ];
    const badge = badges[i % badges.length];

    // Generate category-specific inputs with rich options
    let inputs: any[] = [];

    if (spec.category === 'PDF & Documents') {
      inputs = [
        {
          id: 'prompt',
          name: `${sub.name} Query / Task Requirement`,
          type: 'textarea',
          required: true,
          defaultValue: `Execute OCR, text extraction, and executive summary for ${name}.`
        },
        {
          id: 'file',
          name: 'Upload Document / PDF File',
          type: 'file',
          accept: '.pdf,.docx,.doc,.txt,.csv'
        },
        {
          id: 'sourceUrl',
          name: 'Source Link / Web Document URL (Optional)',
          type: 'text',
          description: 'https://example.com/document.pdf'
        },
        {
          id: 'mode',
          name: 'Execution Mode',
          type: 'select',
          options: ['High Accuracy OCR', 'Balanced Speed & Summary', 'Ultra Fast Stream'],
          defaultValue: 'High Accuracy OCR'
        }
      ];
    } else if (spec.category === 'Image AI') {
      inputs = [
        {
          id: 'prompt',
          name: 'Requested Changes & Prompt Modifications',
          type: 'textarea',
          required: true,
          defaultValue: `Apply requested prompt choices and modifications for ${name}: transform background, subject features, lighting, and style.`
        },
        {
          id: 'userImage',
          name: 'Upload Your Photo / User Image',
          type: 'file',
          accept: 'image/*'
        },
        {
          id: 'sampleImage',
          name: 'Upload Sample / Reference Style Image',
          type: 'file',
          accept: 'image/*'
        },
        {
          id: 'aspectRatio',
          name: 'Aspect Ratio',
          type: 'select',
          options: ['1:1 (Square)', '16:9 (Landscape)', '9:16 (Portrait)', '4:3 (Standard)'],
          defaultValue: '1:1 (Square)'
        },
        {
          id: 'style',
          name: 'Visual Style',
          type: 'select',
          options: ['Photorealistic', 'Cinematic 3D', 'Cyberpunk', 'Anime/Manga', 'Vector Logo', 'Watercolor'],
          defaultValue: 'Photorealistic'
        }
      ];
    } else if (spec.category === 'Video AI') {
      inputs = [
        {
          id: 'prompt',
          name: 'Video Modification & Animation Prompt Changes',
          type: 'textarea',
          required: true,
          defaultValue: `Synthesize fluid motion clip for ${name} applying user video modifications and reference style choices.`
        },
        {
          id: 'videoFile',
          name: 'Upload Sample Video Clip / Animation',
          type: 'file',
          accept: 'video/*,image/*'
        },
        {
          id: 'sampleImage',
          name: 'Upload Character / Reference Style Image',
          type: 'file',
          accept: 'image/*'
        },
        {
          id: 'aspectRatio',
          name: 'Aspect Ratio',
          type: 'select',
          options: ['16:9 (Landscape)', '9:16 (Portrait)', '1:1 (Square)'],
          defaultValue: '16:9 (Landscape)'
        },
        {
          id: 'resolution',
          name: 'Resolution Quality',
          type: 'select',
          options: ['1080p Full HD', '720p HD'],
          defaultValue: '1080p Full HD'
        }
      ];
    } else if (spec.category === 'Audio & Voice') {
      inputs = [
        {
          id: 'prompt',
          name: 'Text to Synthesize / Speech Prompt',
          type: 'textarea',
          required: true,
          defaultValue: `Welcome to ${name}! High fidelity neural speech voice synthesis.`
        },
        {
          id: 'file',
          name: 'Upload Audio Sample (For Speech-to-Text / Vocals)',
          type: 'file',
          accept: 'audio/*'
        },
        {
          id: 'voiceName',
          name: 'Voice Actor / Accent',
          type: 'select',
          options: ['Kore (Friendly Female)', 'Zephyr (Warm Male)', 'Puck (Upbeat Male)', 'Charon (Deep Male)'],
          defaultValue: 'Kore (Friendly Female)'
        }
      ];
    } else if (spec.category === 'Coding & Dev') {
      inputs = [
        {
          id: 'prompt',
          name: 'Coding Request / Bug Description',
          type: 'textarea',
          required: true,
          defaultValue: `Write optimized ${name} code with type declarations and clean documentation.`
        },
        {
          id: 'file',
          name: 'Upload Source Code / Config File',
          type: 'file',
          accept: '.ts,.js,.py,.sql,.html,.css,.json,.dockerfile'
        },
        {
          id: 'language',
          name: 'Target Language',
          type: 'select',
          options: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'Rust', 'Go', 'HTML/CSS', 'Docker'],
          defaultValue: 'TypeScript'
        }
      ];
    } else if (spec.category === 'Data & Analytics' || spec.category === 'Utilities & Convert') {
      inputs = [
        {
          id: 'prompt',
          name: `${sub.name} Requirement / Query`,
          type: 'textarea',
          required: true,
          defaultValue: `Execute ${name} data transform and analysis.`
        },
        {
          id: 'file',
          name: 'Upload Data File (CSV, JSON, PDF, TXT)',
          type: 'file',
          accept: '.csv,.json,.xlsx,.pdf,.txt'
        },
        {
          id: 'sourceUrl',
          name: 'Source Web Link / API Endpoint (Optional)',
          type: 'text',
          description: 'https://api.example.com/data.json'
        },
        {
          id: 'outputFormat',
          name: 'Target Output Format',
          type: 'select',
          options: ['Structured JSON', 'Markdown Table', 'Clean Plain Text', 'CSV / Code'],
          defaultValue: 'Structured JSON'
        }
      ];
    } else {
      inputs = [
        {
          id: 'prompt',
          name: `${sub.name} Input / Requirement`,
          type: 'textarea',
          required: true,
          defaultValue: `Execute ${name} task for target domain with optimal parameters.`
        },
        {
          id: 'file',
          name: 'Upload Reference Document / Image (Optional)',
          type: 'file',
          accept: '.pdf,.docx,.txt,.csv,.png,.jpg'
        },
        {
          id: 'sourceUrl',
          name: 'Source Web Link / URL (Optional)',
          type: 'text',
          description: 'https://example.com/article'
        },
        {
          id: 'mode',
          name: 'Execution Mode',
          type: 'select',
          options: ['High Accuracy / Precision', 'Balanced Speed & Quality', 'Ultra Fast Response'],
          defaultValue: 'Balanced Speed & Quality'
        }
      ];
    }

    generated.push({
      id,
      name,
      slug,
      category: spec.category,
      subcategory: sub.name,
      description: `Professional-grade ${sub.name.toLowerCase()} tool offering high accuracy, low latency, and modular API execution.`,
      longDescription: `Advanced AI component within ${spec.category} engineered for enterprise scalability, real-time performance tracking, and seamless API router integration.`,
      iconName: spec.iconName,
      rating,
      reviewCount,
      latencyMs,
      uptimePercent,
      pricing,
      badge,
      provider: vendorObj.provider,
      modelUsed: vendorObj.model,
      tags: [spec.category, sub.name, vendorObj.provider, ...spec.tags.slice(0, 2)],
      inputs,
      supportedFormats:
        spec.category === 'PDF & Documents'
          ? ['PDF', 'DOCX', 'TXT', 'CSV', 'JSON', 'Markdown']
          : spec.category === 'Image AI' || spec.outputType === 'image'
          ? ['PNG', 'JPG', 'WEBP', 'SVG']
          : spec.category === 'Audio & Voice' || spec.outputType === 'audio'
          ? ['MP3', 'WAV', 'M4A', 'OGG']
          : spec.category === 'Video AI' || spec.outputType === 'video'
          ? ['MP4', 'WEBM', 'GIF']
          : spec.category === 'Coding & Dev' || spec.outputType === 'code'
          ? ['TS', 'JS', 'PY', 'SQL', 'JSON', 'Markdown']
          : spec.category === 'Data & Analytics' || spec.outputType === 'json'
          ? ['JSON', 'CSV', 'Markdown', 'Excel', 'TXT']
          : spec.category === 'Design & Web AI'
          ? ['HTML', 'CSS', 'React JSX', 'JSON', 'SVG']
          : spec.category === 'Education & Study'
          ? ['Markdown', 'TXT', 'PDF', 'JSON']
          : spec.category === 'Business & Marketing' || spec.category === 'SEO & Copywriting' || spec.category === 'Text & Writing'
          ? ['Markdown', 'TXT', 'PDF', 'JSON', 'HTML']
          : spec.category === 'Utilities & Convert'
          ? ['JSON', 'CSV', 'TXT', 'YAML', 'Markdown']
          : ['Markdown', 'TXT', 'JSON', 'PDF'],
      outputType: spec.outputType,
      featured: false,
      runsToday,
      apiRoute: spec.apiRoute
    });
  }

  return generated;
}

export function getToolTierInfo(tool: {
  category?: string;
  subcategory?: string;
  name?: string;
  outputType?: string;
}): { tier: string; credits: number; payPerTask: string } {
  const cat = (tool.category || '').toLowerCase();
  const sub = (tool.subcategory || '').toLowerCase();
  const name = (tool.name || '').toLowerCase();
  const out = (tool.outputType || '').toLowerCase();

  // Tier 6: AI Agent (50 credits, ₹99)
  if (name.includes('agent') || sub.includes('agent') || cat.includes('agent') || name.includes('autonomous') || sub.includes('automation')) {
    return { tier: 'Tier 6', credits: 50, payPerTask: '₹99' };
  }

  // Tier 5: AI Video (20 credits, ₹40)
  if (out === 'video' || cat.includes('video') || sub.includes('video') || name.includes('video') || name.includes('cinema') || sub.includes('animation')) {
    return { tier: 'Tier 5', credits: 20, payPerTask: '₹40' };
  }

  // Tier 4: AI Voice & AI Music (10 credits, ₹20)
  if (out === 'audio' || cat.includes('audio') || sub.includes('audio') || sub.includes('voice') || name.includes('voice') || name.includes('speech') || sub.includes('music') || name.includes('music') || name.includes('song')) {
    return { tier: 'Tier 4', credits: 10, payPerTask: '₹20' };
  }

  // Tier 3: AI Image & AI Logo (5 credits, ₹10)
  if (out === 'image' || cat.includes('image') || sub.includes('image') || name.includes('image') || sub.includes('logo') || name.includes('logo') || name.includes('avatar') || sub.includes('design')) {
    return { tier: 'Tier 3', credits: 5, payPerTask: '₹10' };
  }

  // Tier 2: AI Writer, AI Resume, AI Coding (2 credits, ₹5)
  if (out === 'code' || cat.includes('coding') || sub.includes('code') || sub.includes('dev') || name.includes('resume') || sub.includes('resume') || sub.includes('article') || sub.includes('writer') || name.includes('writer') || name.includes('blog') || cat.includes('seo') || cat.includes('copywriting')) {
    return { tier: 'Tier 2', credits: 2, payPerTask: '₹5' };
  }

  // Tier 1: AI Chat, AI Translator, AI Grammar (1 credit, ₹2)
  return { tier: 'Tier 1', credits: 1, payPerTask: '₹2' };
}

// Build total dataset of 800+ tools
function buildFullToolsList(): AITool[] {
  const tools: AITool[] = [...FEATURED_TOOLS];

  // Target total = 840 tools (~70 tools per category across 12 categories)
  const targetPerCategory = 70;

  CATEGORY_SPECS.forEach((spec) => {
    const existingCount = tools.filter((t) => t.category === spec.category).length;
    const needed = Math.max(0, targetPerCategory - existingCount);
    const newTools = generateCatalogForCategory(spec, needed);
    tools.push(...newTools);
  });

  // Enrich all tools with official Tier, Credits, and Pay/Task pricing
  return tools.map((t) => {
    const tierInfo = getToolTierInfo(t);
    return {
      ...t,
      tier: t.tier || tierInfo.tier,
      credits: t.credits || tierInfo.credits,
      payPerTask: t.payPerTask || tierInfo.payPerTask,
    };
  });
}

export const TOOLS_DATA: AITool[] = buildFullToolsList();

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
