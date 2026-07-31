import { AITool, ToolCategory } from '../types';

export interface ToolPreset {
  id: string;
  title: string;
  description: string;
  values: Record<string, any>;
  badge?: string;
}

// Map of specific tool IDs to pre-configured example prompts
export const TOOL_SPECIFIC_PRESETS: Record<string, ToolPreset[]> = {
  'ai-chat-pro': [
    {
      id: 'chat-quantum',
      title: 'Quantum Computing Explained',
      description: 'Simple real-world analogy for 10-year-olds',
      badge: 'POPULAR',
      values: {
        prompt: 'Explain quantum computing in simple terms for a 10-year-old using a fun real-world maze analogy.',
        systemInstruction: 'You are a friendly, enthusiastic science communicator.',
        creativity: 0.7
      }
    },
    {
      id: 'chat-exec-summary',
      title: 'Executive Meeting Summary',
      description: 'Format raw meeting notes into action items',
      badge: 'BUSINESS',
      values: {
        prompt: 'Transform these raw notes into an executive summary:\n- Discussed Q3 roadmap delays due to API refactoring\n- Sarah handling frontend fix by Friday\n- Budget approved for 2 new cloud servers\n- Next sync on Tuesday 10am',
        systemInstruction: 'You are an executive assistant focusing on clarity and structured bullet points.',
        creativity: 0.3
      }
    },
    {
      id: 'chat-saas-pitch',
      title: 'SaaS Product Elevator Pitch',
      description: 'Compelling 30-second value proposition',
      badge: 'CREATIVE',
      values: {
        prompt: 'Craft a high-converting 30-second elevator pitch for an AI-powered automated code documentation tool targeting tech leads.',
        systemInstruction: 'You are a top-tier Y Combinator startup mentor.',
        creativity: 0.8
      }
    }
  ],

  'article-generator': [
    {
      id: 'article-renewable',
      title: 'Future of Clean Energy 2026',
      description: 'Comprehensive SEO breakdown with statistics & trends',
      badge: 'TECH',
      values: {
        topic: 'The Future of Renewable Energy & Grid Modernization in 2026',
        tone: 'Informative',
        wordCount: '500-1000 words'
      }
    },
    {
      id: 'article-remote-work',
      title: 'Remote Work Productivity Hacks',
      description: 'Actionable guide for async teams',
      badge: 'GUIDE',
      values: {
        topic: '10 Proven Asynchronous Communication Habits for Remote Engineering Teams',
        tone: 'Professional',
        wordCount: '500-1000 words'
      }
    },
    {
      id: 'article-finance',
      title: 'Beginner Guide to Index Funds',
      description: 'Clear financial literacy breakdown',
      badge: 'FINANCE',
      values: {
        topic: 'A Practical Guide to Index Fund Investing for Beginners',
        tone: 'Academic',
        wordCount: '1000+ words'
      }
    }
  ],

  'resume-builder-ai': [
    {
      id: 'resume-fullstack',
      title: 'Senior Full-Stack Engineer',
      description: 'Optimized for high-growth tech startups & FAANG',
      badge: 'ENGINEERING',
      values: {
        jobTitle: 'Senior Full Stack Engineer',
        experience: '5+ years experience building React, Node.js, and Distributed Systems. Reduced database latency by 45% using Redis caching. Led a team of 4 engineers on cloud migrations.',
        targetJobDesc: 'Looking for Senior Engineer with expertise in Next.js, TypeScript, PostgreSQL, and AWS Cloud architecture.'
      }
    },
    {
      id: 'resume-pm',
      title: 'Lead Product Manager',
      description: 'Metrics-driven resume bullets for AI products',
      badge: 'PRODUCT',
      values: {
        jobTitle: 'Principal Product Manager - AI & Platform',
        experience: 'Spearheaded launch of generative AI assistant used by 100k daily active users. Increased user retention by 28% in 6 months.',
        targetJobDesc: 'Seeking Lead Product Manager to own roadmap, user research, and cross-functional execution for consumer AI tools.'
      }
    }
  ],

  'text-to-image-ai': [
    {
      id: 'img-cyberpunk',
      title: 'Cyberpunk Tokyo Rain Street',
      description: 'Photorealistic 8K neon reflections',
      badge: '8K PHOTO',
      values: {
        prompt: 'A cinematic wide-angle photograph of a rain-slicked Tokyo alleyway at night, vibrant neon signs reflecting in puddles, atmospheric fog, photorealistic 8k resolution, Leica 35mm lens depth of field.',
        style: 'Photorealistic',
        aspectRatio: '16:9'
      }
    },
    {
      id: 'img-isometric-logo',
      title: '3D Isometric Tech Workspace',
      description: 'Vibrant 3D digital art style',
      badge: '3D ART',
      values: {
        prompt: 'Cute 3D isometric render of a cozy developer workspace with floating glowing hologram screens, miniature potted plants, warm lighting, Blender 3D style.',
        style: '3D Render',
        aspectRatio: '1:1'
      }
    },
    {
      id: 'img-minimal-logo',
      title: 'Minimalist Vector Tech Logo',
      description: 'Modern geometric brand logo icon',
      badge: 'DESIGN',
      values: {
        prompt: 'Vector logo design of an abstract origami hummingbird, minimalist geometric lines, gradient purple and emerald colors, clean white background, vector icon.',
        style: 'Vector Logo',
        aspectRatio: '1:1'
      }
    }
  ],

  'ai-video-veo2': [
    {
      id: 'video-drone-mountains',
      title: 'Cinematic Mountain Drone Flyover',
      description: 'High-speed FPV over snowy peaks',
      badge: 'CINEMATIC',
      values: {
        prompt: 'Cinematic FPV drone footage gliding smoothly through a narrow snow-covered mountain canyon at golden hour sunset, lens flare, 4k ultra-detailed.',
        durationSec: 5,
        resolution: '1080p Full HD',
        cameraMotion: 'FPV Flythrough'
      }
    },
    {
      id: 'video-coffee-pour',
      title: 'Slow Motion Macro Espresso',
      description: 'Rich crema and steam close-up',
      badge: 'MACRO',
      values: {
        prompt: 'Ultra slow-motion close-up macro shot of dark espresso pouring smoothly into a glass cup, swirl of thick crema, rising warm steam, cinematic soft lighting.',
        durationSec: 5,
        resolution: '1080p Full HD',
        cameraMotion: 'Static Close-up'
      }
    }
  ],

  'tts-voice-pro': [
    {
      id: 'tts-documentary',
      title: 'Documentary Narration',
      description: 'Deep, authoritative storytelling voice',
      badge: 'NARRATION',
      values: {
        text: 'Deep beneath the ocean surface lies an unexplored world of bioluminescent creatures, thriving in eternal darkness.',
        voice: 'Deep Male Narration',
        speed: 1.0,
        pitch: 'Normal'
      }
    },
    {
      id: 'tts-podcast',
      title: 'Upbeat Tech Podcast Intro',
      description: 'Energetic commercial voiceover',
      badge: 'PODCAST',
      values: {
        text: 'Welcome back to Future Tech Daily! Today we are diving into groundbreaking AI breakthroughs that are changing how we write code.',
        voice: 'Upbeat Female Commercial',
        speed: 1.1,
        pitch: 'Normal'
      }
    }
  ],

  'pdf-doc-summarizer': [
    {
      id: 'doc-exec-brief',
      title: 'Executive Brief & Key Takeaways',
      description: 'Extract top 5 strategic highlights',
      badge: 'SUMMARY',
      values: {
        documentText: 'Insert or attach document text to extract key executive takeaways, risks, and financial impacts.',
        summaryLength: 'Executive Brief (3-5 bullets)',
        focusArea: 'Key Decisions & Action Items'
      }
    },
    {
      id: 'doc-risk-analysis',
      title: 'Legal Contract Risk Review',
      description: 'Highlight liability & termination clauses',
      badge: 'LEGAL',
      values: {
        documentText: 'Analyze contract text for non-compete limits, payment terms, liability caps, and termination notice periods.',
        summaryLength: 'Detailed Breakdown',
        focusArea: 'Risk & Compliance Highlights'
      }
    }
  ],

  'code-refactor-ai': [
    {
      id: 'code-react-nav',
      title: 'React + Tailwind Responsive Navbar',
      description: 'Includes mobile drawer and dark mode',
      badge: 'REACT',
      values: {
        code: 'Create a fully responsive React TypeScript navigation bar with Tailwind CSS, supporting dropdown menus, mobile hamburger toggle, and dark mode toggle button.',
        targetLanguage: 'TypeScript / React',
        action: 'Generate Component'
      }
    },
    {
      id: 'code-express-api',
      title: 'Express JWT Auth Endpoint',
      description: 'Production-ready authentication route',
      badge: 'BACKEND',
      values: {
        code: 'Write an Express.js POST /api/login authentication endpoint in TypeScript with bcrypt password verification, JWT token issuance, and input validation error handling.',
        targetLanguage: 'TypeScript / Node.js',
        action: 'Write API Route'
      }
    }
  ]
};

// Generic fallback presets based on tool category
export const CATEGORY_PRESETS: Record<ToolCategory, ToolPreset[]> = {
  'Text & Writing': [
    {
      id: 'cat-text-brainstorm',
      title: 'Brainstorm 10 Innovative Ideas',
      description: 'Generate creative solutions with pros & cons',
      badge: 'BRAINSTORM',
      values: {
        prompt: 'Brainstorm 10 creative product features for an AI app store platform that increase user engagement.',
        topic: 'Innovative AI App Platform Features',
        systemInstruction: 'Provide structured bullet points with brief impact assessments.'
      }
    },
    {
      id: 'cat-text-simplify',
      title: 'Simplify Technical Jargon',
      description: 'Rewrite complex concepts for general audience',
      badge: 'REWRITE',
      values: {
        prompt: 'Rewrite the following technical passage into clear, accessible language suitable for non-technical stakeholders:',
        topic: 'API Rate Limiting & Microservice Architecture'
      }
    }
  ],

  'Image AI': [
    {
      id: 'cat-img-photoreal',
      title: 'High-Detail Photorealistic Portrait',
      description: 'Studio lighting photography prompt',
      badge: 'PORTRAIT',
      values: {
        prompt: 'A high-resolution studio portrait of a passionate software architect working at a wooden desk with glowing code monitors in the background, soft warm lighting, 85mm lens f/1.8.',
        style: 'Photorealistic',
        aspectRatio: '16:9'
      }
    },
    {
      id: 'cat-img-fantasy',
      title: 'Epic Fantasy Landscape Art',
      description: 'Atmospheric digital concept art',
      badge: 'CONCEPT ART',
      values: {
        prompt: 'An epic digital matte painting of an ancient celestial observatory floating on clouds, glowing runes, golden hour light, highly detailed concept art.',
        style: 'Digital Art',
        aspectRatio: '16:9'
      }
    }
  ],

  'Video AI': [
    {
      id: 'cat-vid-cinematic',
      title: 'Cinematic Sunset Horizon',
      description: 'Smooth camera motion landscape video',
      badge: 'CINEMATIC',
      values: {
        prompt: 'A stunning slow pan camera shot across a tranquil tropical beach at sunset, gentle waves reflecting orange light, coconut palms swaying in wind.',
        durationSec: 5,
        resolution: '1080p Full HD'
      }
    }
  ],

  'Audio & Voice': [
    {
      id: 'cat-aud-narration',
      title: 'Professional Voiceover Brief',
      description: 'Clear narration audio prompt',
      badge: 'VOICEOVER',
      values: {
        text: 'In a world driven by constant innovation, simple and intuitive design remains our most powerful tool for connection.',
        voice: 'Natural Professional Male'
      }
    }
  ],

  'PDF & Documents': [
    {
      id: 'cat-pdf-extract',
      title: 'Document Key Points Extraction',
      description: 'Extract action items and key figures',
      badge: 'SUMMARY',
      values: {
        documentText: 'Paste document text here to extract key decisions, action items, deadlines, and financial metrics.',
        summaryLength: 'Standard Summary'
      }
    }
  ],

  'Coding & Dev': [
    {
      id: 'cat-code-optimize',
      title: 'Optimize Code Performance & Async',
      description: 'Refactor code for speed & safety',
      badge: 'REFACTOR',
      values: {
        code: '// Paste your code here to optimize performance, fix memory leaks, and add error handling.',
        action: 'Refactor Code'
      }
    }
  ],

  'Business & Marketing': [
    {
      id: 'cat-biz-outreach',
      title: 'Cold Email Outreach Sequence',
      description: 'Personalized B2B email template',
      badge: 'OUTREACH',
      values: {
        prompt: 'Draft a 3-step high-converting cold email outreach sequence for selling B2B software to VP of Engineering.',
        topic: 'B2B Software Sales Sequence'
      }
    }
  ],

  'SEO & Copywriting': [
    {
      id: 'cat-seo-meta',
      title: 'SEO Meta Title & Description Pack',
      description: 'High CTR titles & descriptions',
      badge: 'SEO',
      values: {
        topic: 'AI Code Generator Tools Comparison',
        prompt: 'Generate 5 catchy SEO meta titles (under 60 chars) and meta descriptions (under 155 chars) targeting developers.'
      }
    }
  ],

  'Education & Study': [
    {
      id: 'cat-edu-quiz',
      title: 'Generate 5 Multiple-Choice Study Questions',
      description: 'Test knowledge with explanations',
      badge: 'STUDY',
      values: {
        prompt: 'Create 5 multiple-choice questions with answer explanations on the topic of Machine Learning Neural Networks.'
      }
    }
  ],

  'Utilities & Convert': [
    {
      id: 'cat-util-json',
      title: 'Format & Clean Unstructured Data',
      description: 'Convert raw text to clean JSON schema',
      badge: 'DATA',
      values: {
        prompt: 'Convert the following unorganized product notes into a clean, valid JSON array of objects.'
      }
    }
  ],

  'Design & Web AI': [
    {
      id: 'cat-web-landing',
      title: 'SaaS Hero Section Copy & Layout',
      description: 'Headline, subhead & CTA buttons',
      badge: 'COPYWRITING',
      values: {
        prompt: 'Write high-converting headline, subheadline, and primary CTA button text for an AI Developer Platform.'
      }
    }
  ],

  'Data & Analytics': [
    {
      id: 'cat-data-chart',
      title: 'Data Trends & Insight Summary',
      description: 'Summarize key metrics and anomalies',
      badge: 'ANALYTICS',
      values: {
        prompt: 'Analyze these quarterly revenue figures and identify top growth drivers, risks, and projections.'
      }
    }
  ]
};

/**
 * Returns a list of presets for a given tool based on tool ID, category, or default inputs.
 */
export function getPresetsForTool(tool: AITool): ToolPreset[] {
  // 1. Check specific tool ID match first
  if (TOOL_SPECIFIC_PRESETS[tool.id] && TOOL_SPECIFIC_PRESETS[tool.id].length > 0) {
    return TOOL_SPECIFIC_PRESETS[tool.id];
  }

  // 2. Check tool category presets
  if (CATEGORY_PRESETS[tool.category] && CATEGORY_PRESETS[tool.category].length > 0) {
    return CATEGORY_PRESETS[tool.category];
  }

  // 3. Fallback generic presets based on tool inputs
  const genericPresets: ToolPreset[] = [
    {
      id: `gen-${tool.id}-1`,
      title: `Sample ${tool.name} Input`,
      description: 'Default example configuration',
      badge: 'DEFAULT',
      values: tool.inputs.reduce((acc, input) => {
        acc[input.id] = input.defaultValue || (input.type === 'textarea' ? `Example prompt for ${tool.name}` : '');
        return acc;
      }, {} as Record<string, any>)
    }
  ];

  return genericPresets;
}
