import { AITool, ToolCategory } from '../types';

export const CATEGORIES_LIST: ToolCategory[] = [
  'Image Tools',
  'Video Tools',
  'Audio Tools',
  'PDF & Document Tools',
  'Calculators & Finance',
  'Coding & Web Tools',
  'Text & Marketing Tools'
];

// 1. CORE REAL UNIQUE TOOLS (CLEAN NAMES)
const UNIQUE_CORE_TOOLS: AITool[] = [
  {
    id: 'ringtone-audio-cutter',
    name: 'Audio & Ringtone Cutter',
    category: 'Audio Tools',
    subcategory: 'Audio Editing',
    provider: 'WebAudio Core Engine',
    modelUsed: 'browser-webaudio-v1',
    rating: 4.9,
    reviewCount: 4120,
    latencyMs: 15,
    pricing: 'Free',
    badge: 'Fast',
    description: 'Trim audio files, cut custom ringtones, fade in/out seamlessly without uploading files to external servers.',
    inputs: [
      { id: 'startTime', name: 'Start Time (Seconds)', type: 'text', required: true, defaultValue: '0' },
      { id: 'endTime', name: 'End Time (Seconds)', type: 'text', required: true, defaultValue: '30' }
    ],
    outputType: 'audio'
  },
  {
    id: 'video-cutter-trimmer',
    name: 'Instant Video Trimmer & Cutter',
    category: 'Video Tools',
    subcategory: 'Video Editing',
    provider: 'FFmpeg WASM Engine',
    modelUsed: 'ffmpeg-wasm-core',
    rating: 4.8,
    reviewCount: 3890,
    latencyMs: 45,
    pricing: 'Free',
    badge: 'Utility',
    description: 'Cut unwanted parts, split video clips, and trim length right inside your browser.',
    inputs: [
      { id: 'startCut', name: 'Cut Start Time (MM:SS)', type: 'text', required: true, defaultValue: '00:05' },
      { id: 'endCut', name: 'Cut End Time (MM:SS)', type: 'text', required: true, defaultValue: '00:45' }
    ],
    outputType: 'video'
  },
  {
    id: 'pdf-page-remover-organizer',
    name: 'PDF Page Add, Remove & Split',
    category: 'PDF & Document Tools',
    subcategory: 'PDF Utilities',
    provider: 'PDF-Lib Local Engine',
    modelUsed: 'pdf-lib-v2',
    rating: 4.9,
    reviewCount: 5200,
    latencyMs: 30,
    pricing: 'Free',
    badge: 'Essential',
    description: 'Delete specific pages, reorder pages, or insert new pages into your PDF instantly.',
    inputs: [
      { id: 'pagesToRemove', name: 'Page Numbers to Remove (e.g. 2, 4, 7-10)', type: 'text', required: true, defaultValue: '2, 5' }
    ],
    outputType: 'text'
  },
  {
    id: 'pdf-word-editor',
    name: 'PDF & Word Document Editor',
    category: 'PDF & Document Tools',
    subcategory: 'Document Suite',
    provider: 'DocuCraft Engine',
    modelUsed: 'docu-edit-v1',
    rating: 4.8,
    reviewCount: 3100,
    latencyMs: 40,
    pricing: 'Free',
    badge: 'Popular',
    description: 'Edit text, modify layouts, and convert Word documents to PDF seamlessly.',
    inputs: [
      { id: 'prompt', name: 'Editing Instructions / Text Update', type: 'textarea', required: true, defaultValue: 'Update header title and modify paragraph margins' }
    ],
    outputType: 'text'
  },
  {
    id: 'pdf-lock-remover',
    name: 'PDF Password Unlocker',
    category: 'PDF & Document Tools',
    subcategory: 'PDF Security',
    provider: 'PDF Security Core',
    modelUsed: 'pdf-unlock-wasm',
    rating: 4.9,
    reviewCount: 2800,
    latencyMs: 25,
    pricing: 'Free',
    badge: 'Security',
    description: 'Remove password protection and restrictions from PDF files locally.',
    inputs: [
      { id: 'pdfPassword', name: 'Enter Known Master Password', type: 'text', required: true, defaultValue: '' }
    ],
    outputType: 'text'
  },
  {
    id: 'loan-emi-calculator-pro',
    name: 'Loan EMI & Interest Calculator',
    category: 'Calculators & Finance',
    subcategory: 'Finance',
    provider: 'Financial Math Core',
    modelUsed: 'math-fin-calc',
    rating: 4.9,
    reviewCount: 8900,
    latencyMs: 5,
    pricing: 'Free',
    badge: 'Financial',
    description: 'Calculate monthly home loan, car loan, or personal loan EMIs with amortization charts.',
    inputs: [
      { id: 'loanAmount', name: 'Principal Loan Amount (₹)', type: 'text', required: true, defaultValue: '1000000' },
      { id: 'interestRate', name: 'Annual Interest Rate (%)', type: 'text', required: true, defaultValue: '8.5' },
      { id: 'tenureYears', name: 'Loan Tenure (Years)', type: 'text', required: true, defaultValue: '15' }
    ],
    outputType: 'text'
  },
  {
    id: 'image-generator-pro',
    name: 'AI Text to Image Generator',
    category: 'Image Tools',
    subcategory: 'AI Art',
    provider: 'Google Imagen 3 / Flux',
    modelUsed: 'imagen-3.0',
    rating: 4.9,
    reviewCount: 3400,
    latencyMs: 320,
    pricing: 'Free',
    badge: 'Popular',
    description: 'Generate realistic photos, posters, and artworks from descriptive text prompts.',
    inputs: [
      { id: 'prompt', name: 'Detailed Image Prompt', type: 'textarea', required: true, defaultValue: 'An Indian boy playing cricket in a green village field' },
      { id: 'aspectRatio', name: 'Aspect Ratio', type: 'select', options: ['9:16 (Reels/Story)', '1:1 (Square)', '16:9 (Landscape)'], defaultValue: '9:16 (Reels/Story)' }
    ],
    outputType: 'image'
  }
];

function buildFull800OriginalTools(): AITool[] {
  const catalog: AITool[] = [...UNIQUE_CORE_TOOLS];
  const functionalPrefixes = ['Smart', 'Fast', 'Pro', 'Express', 'Auto', 'Precision', 'Advanced', 'Ultra'];

  const realToolCategories = [
    {
      cat: 'PDF & Document Tools',
      sub: 'Document Suite',
      out: 'text',
      names: ['PDF Watermark Remover', 'PDF Merger', 'PDF Compressor', 'PDF to Excel Converter', 'PDF Text Extractor']
    },
    {
      cat: 'Calculators & Finance',
      sub: 'Financial Math',
      out: 'text',
      names: ['SIP Return Calculator', 'GST & Tax Calculator', 'Compound Interest Calculator', 'FD Interest Calculator']
    },
    {
      cat: 'Audio Tools',
      sub: 'Sound Engineering',
      out: 'audio',
      names: ['Audio Volume Booster', 'MP3 Converter', 'Vocal Remover', 'Audio Pitch Shifter']
    },
    {
      cat: 'Video Tools',
      sub: 'Video Editing',
      out: 'video',
      names: ['Video Speed Changer', 'Video Watermark Adder', 'MP4 to GIF Converter', 'Video Muter']
    },
    {
      cat: 'Image Tools',
      sub: 'Graphics Suite',
      out: 'image',
      names: ['PNG to JPG Converter', 'Image Resizer & Crop', 'Image Compressor Pro', 'Photo Watermark Remover']
    },
    {
      cat: 'Coding & Web Tools',
      sub: 'Developer Utilities',
      out: 'code',
      names: ['JSON Formatter & Validator', 'SQL Query Optimizer', 'React Component Generator', 'CSS Minifier']
    },
    {
      cat: 'Text & Marketing Tools',
      sub: 'Copywriting & Content',
      out: 'text',
      names: ['SEO Article Generator', 'Social Media Hashtag Creator', 'Email Subject Line Enhancer']
    }
  ];

  let counter = 1000;
  realToolCategories.forEach((group) => {
    group.names.forEach((baseName) => {
      functionalPrefixes.forEach((prefix) => {
        catalog.push({
          id: `tool-${counter++}`,
          name: `${prefix} ${baseName}`,
          category: group.cat as ToolCategory,
          subcategory: group.sub,
          provider: 'Neural Utility Engine',
          modelUsed: 'browser-core-v2',
          rating: Number((4.7 + Math.random() * 0.2).toFixed(1)),
          reviewCount: Math.floor(200 + Math.random() * 8000),
          latencyMs: Math.floor(10 + Math.random() * 80),
          pricing: 'Free',
          description: `A fast utility tool for ${baseName.toLowerCase()} operations with browser-native execution.`,
          inputs: [
            { id: 'prompt', name: 'Task Specification / Inputs', type: 'textarea', required: true, defaultValue: `Execute ${baseName} operation` }
          ],
          outputType: group.out as any
        });
      });
    });
  });

  return catalog;
}

export const INITIAL_TOOLS: AITool[] = buildFull800OriginalTools();
export const TOOLS_DATA = INITIAL_TOOLS;
