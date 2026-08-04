import { AITool, ToolCategory } from '../types';

export const CATEGORIES_LIST: ToolCategory[] = [
  'PDF & Document Tools',
  'Image Tools (AI & Utility)',
  'Video Tools (AI & Utility)',
  'Audio Tools (AI & Utility)',
  'Calculators & Finance',
  'Coding & Web Tools',
  'Text & Marketing Tools'
];

// CORE HAND-CRAFTED TOOLS WITH SPECIALIZED LOGIC
const CORE_TOOLS: AITool[] = [
  {
    id: 'delete-pdf-pages',
    name: 'Delete PDF Pages',
    category: 'PDF & Document Tools',
    subcategory: 'Organize',
    provider: 'DocuCore Local',
    modelUsed: 'pdf-lib',
    rating: 4.9,
    reviewCount: 3100,
    latencyMs: 10,
    pricing: 'Free',
    description: 'Remove one or multiple pages from your PDF document easily.',
    inputs: [
      { id: 'pagesToRemove', name: 'Pages to Delete (e.g. 2, 4)', type: 'text', required: true, defaultValue: '2' }
    ],
    outputType: 'text'
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    category: 'PDF & Document Tools',
    subcategory: 'Organize',
    provider: 'DocuCore Local',
    modelUsed: 'pdf-lib',
    rating: 4.7,
    reviewCount: 1900,
    latencyMs: 10,
    pricing: 'Free',
    description: 'Rotate one or all pages in your PDF document.',
    inputs: [
      { id: 'rotationAngle', name: 'Rotation Angle', type: 'select', options: ['90° Clockwise', '90° Counter-Clockwise', '180° Flip'], defaultValue: '90° Clockwise' }
    ],
    outputType: 'text'
  },
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG',
    category: 'PDF & Document Tools',
    subcategory: 'Convert',
    provider: 'FormatCore Engine',
    modelUsed: 'img-convert-v1',
    rating: 4.8,
    reviewCount: 4600,
    latencyMs: 20,
    pricing: 'Free',
    description: 'Extract images from your PDF or convert each page to a JPG file.',
    inputs: [
      { id: 'imageQuality', name: 'Image Quality', type: 'select', options: ['High Quality (300dpi)', 'Standard (72dpi)'], defaultValue: 'High Quality (300dpi)' }
    ],
    outputType: 'text'
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF',
    category: 'PDF & Document Tools',
    subcategory: 'Optimize',
    provider: 'OptimizeCore',
    modelUsed: 'pdf-compressor',
    rating: 5.0,
    reviewCount: 12400,
    latencyMs: 50,
    pricing: 'Free',
    description: 'Reduce the file size of your PDF without losing quality.',
    inputs: [
      { id: 'compressionLevel', name: 'Compression Level', type: 'select', options: ['Basic Compression', 'Strong Compression'], defaultValue: 'Basic Compression' }
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
    category: 'Image Tools (AI & Utility)',
    subcategory: 'AI Art',
    provider: 'Google Imagen 3 / Flux',
    modelUsed: 'imagen-3.0',
    rating: 4.9,
    reviewCount: 3400,
    latencyMs: 320,
    pricing: 'Free',
    description: 'Generate realistic photos, posters, and artworks from descriptive text prompts.',
    inputs: [
      { id: 'prompt', name: 'Detailed Image Prompt', type: 'textarea', required: true, defaultValue: 'An Indian boy playing cricket in a green village field' },
      { id: 'aspectRatio', name: 'Aspect Ratio', type: 'select', options: ['9:16 (Reels/Story)', '1:1 (Square)', '16:9 (Landscape)'], defaultValue: '9:16 (Reels/Story)' }
    ],
    outputType: 'image'
  }
];

// PROGRAMMATIC GENERATOR FOR 800+ DYNAMIC TOOLS ACROSS ALL SEGMENTS
function generate800PlusTools(): AITool[] {
  const catalog: AITool[] = [...CORE_TOOLS];

  const categorySpecs = [
    { cat: 'PDF & Document Tools', subs: ['Merge PDF', 'Split PDF', 'PDF to Word', 'Word to PDF', 'PDF Watermark', 'Page Numbers', 'Unlock PDF', 'Protect PDF', 'OCR Text Extractor'], output: 'text', count: 120 },
    { cat: 'Image Tools (AI & Utility)', subs: ['Background Remover', 'Image Upscaler 8K', 'Photo Enhancer', 'Object Removal', 'Vector Tracing', 'Colorizer', 'Face Swapper', 'Avatar Creator'], output: 'image', count: 140 },
    { cat: 'Video Tools (AI & Utility)', subs: ['Video Trimmer', 'MP4 to GIF', 'Subtitle Generator', 'Video Upscaler 4K', 'Noise Reduction', 'Video Speed Changer', 'Watermark Remover'], output: 'video', count: 120 },
    { cat: 'Audio Tools (AI & Utility)', subs: ['Text to Speech AI', 'Voice Isolator', 'Audio Cutter', 'Vocal Remover', 'Noise Suppressor', 'Audio Converter MP3/WAV', 'Podcast Enhancer'], output: 'audio', count: 110 },
    { cat: 'Calculators & Finance', subs: ['GST Calculator', 'SIP Return Calculator', 'Income Tax Calculator', 'Crypto Profit Calc', 'Compound Interest Calc', 'FD Calculator', 'Rent Vs Buy Calc'], output: 'text', count: 110 },
    { cat: 'Coding & Web Tools', subs: ['JSON Formatter', 'CSS Gradient Generator', 'Regex Tester', 'SQL Query Optimizer', 'HTML to React Converter', 'API Mock Generator', 'TypeScript Generator'], output: 'text', count: 110 },
    { cat: 'Text & Marketing Tools', subs: ['SEO Title Generator', 'YouTube Tag Generator', 'AI Blog Writer', 'Grammar Checker', 'Email Copywriter', 'Hashtag Generator', 'Text Summarizer'], output: 'text', count: 110 }
  ];

  categorySpecs.forEach((spec) => {
    for (let i = 1; i <= spec.count; i++) {
      const subName = spec.subs[(i - 1) % spec.subs.length];
      const toolId = `${spec.cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${i}`;

      if (catalog.some(t => t.id === toolId)) continue;

      catalog.push({
        id: toolId,
        name: `${subName} Pro #${i}`,
        category: spec.cat as ToolCategory,
        subcategory: subName,
        provider: 'NeuralMarket Core Engine',
        modelUsed: `neural-engine-v${(i % 4) + 1}.0`,
        rating: Number((4.6 + (i % 5) * 0.08).toFixed(1)),
        reviewCount: 1500 + i * 20,
        latencyMs: 12 + (i % 40),
        pricing: i % 3 === 0 ? 'Freemium' : 'Free',
        description: `High-speed professional ${subName.toLowerCase()} tool designed for automated ${spec.cat.toLowerCase()} workflows.`,
        inputs: [
          { id: 'prompt', name: 'Input Source / Prompt / Instructions', type: 'textarea', required: true, defaultValue: `Perform ${subName} processing` },
          { id: 'qualityMode', name: 'Quality Mode', type: 'select', options: ['Ultra High Precision', 'Fast Execution', 'Standard Balance'], defaultValue: 'Ultra High Precision' }
        ],
        outputType: spec.output as any
      });
    }
  });

  return catalog;
}

export const INITIAL_TOOLS: AITool[] = generate800PlusTools();
export const TOOLS_DATA = INITIAL_TOOLS;
