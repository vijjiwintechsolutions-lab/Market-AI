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

// 🚀 CORE HAND-CRAFTED REAL-WORLD TOOLS
const HANDCRAFTED_TOOLS: AITool[] = [
  {
    id: 'pdf-to-jpg',
    name: 'PDF to JPG Converter',
    category: 'PDF & Document Tools',
    subcategory: 'Convert',
    provider: 'Adobe-Style Engine',
    modelUsed: 'pdf-js-v3',
    rating: 4.9,
    reviewCount: 14200,
    latencyMs: 15,
    pricing: 'Free',
    description: 'Convert PDF pages into high-resolution JPG or PNG images instantly.',
    inputs: [
      { id: 'imageQuality', name: 'Image Quality (DPI)', type: 'select', options: ['High Quality (300dpi)', 'Standard (150dpi)', 'Web (72dpi)'], defaultValue: 'High Quality (300dpi)' }
    ],
    outputType: 'image'
  },
  {
    id: 'pdf-to-word',
    name: 'PDF to Word Converter',
    category: 'PDF & Document Tools',
    subcategory: 'Convert',
    provider: 'DocuCore Engine',
    modelUsed: 'pdf-word-v2',
    rating: 4.9,
    reviewCount: 18900,
    latencyMs: 25,
    pricing: 'Free',
    description: 'Convert PDF documents to editable Microsoft Word files seamlessly.',
    inputs: [
      { id: 'outputFormat', name: 'Convert to', type: 'select', options: ['Word Document (.doc)', 'Word Document (.docx)'], defaultValue: 'Word Document (.doc)' }
    ],
    outputType: 'text'
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF Documents',
    category: 'PDF & Document Tools',
    subcategory: 'Organize',
    provider: 'DocuCore Engine',
    modelUsed: 'pdf-lib-v1',
    rating: 4.9,
    reviewCount: 22100,
    latencyMs: 12,
    pricing: 'Free',
    description: 'Combine multiple PDF files into one unified document.',
    inputs: [],
    outputType: 'text'
  },
  {
    id: 'compress-pdf',
    name: 'Compress PDF File Size',
    category: 'PDF & Document Tools',
    subcategory: 'Optimize',
    provider: 'OptimizeCore Engine',
    modelUsed: 'pdf-compressor',
    rating: 5.0,
    reviewCount: 19400,
    latencyMs: 40,
    pricing: 'Free',
    description: 'Reduce PDF file size without sacrificing visual document quality.',
    inputs: [
      { id: 'targetSizeKb', name: 'Target Size (in KB)', type: 'text', required: true, defaultValue: '500' },
      { id: 'compressionLevel', name: 'Compression Level', type: 'select', options: ['Basic Compression (-40%)', 'Extreme Compression (-70%)'], defaultValue: 'Basic Compression (-40%)' }
    ],
    outputType: 'text'
  },
  {
    id: 'rotate-pdf',
    name: 'Rotate PDF Pages',
    category: 'PDF & Document Tools',
    subcategory: 'Organize',
    provider: 'DocuCore Engine',
    modelUsed: 'pdf-lib-v1',
    rating: 4.8,
    reviewCount: 8900,
    latencyMs: 10,
    pricing: 'Free',
    description: 'Rotate PDF pages clockwise or counter-clockwise easily.',
    inputs: [
      { id: 'rotationAngle', name: 'Rotation Angle', type: 'select', options: ['90° Clockwise', '90° Counter-Clockwise', '180° Flip'], defaultValue: '90° Clockwise' }
    ],
    outputType: 'text'
  },
  {
    id: 'delete-pdf-pages',
    name: 'Delete PDF Pages',
    category: 'PDF & Document Tools',
    subcategory: 'Organize',
    provider: 'DocuCore Engine',
    modelUsed: 'pdf-lib-v1',
    rating: 4.8,
    reviewCount: 6700,
    latencyMs: 10,
    pricing: 'Free',
    description: 'Selectively remove unwanted pages from your PDF document.',
    inputs: [
      { id: 'pagesToRemove', name: 'Pages to Remove (e.g. 2, 4)', type: 'text', required: true, defaultValue: '2' }
    ],
    outputType: 'text'
  },
  {
    id: 'loan-emi-calculator-pro',
    name: 'Loan EMI & Interest Calculator',
    category: 'Calculators & Finance',
    subcategory: 'Finance',
    provider: 'Financial Math Engine',
    modelUsed: 'fin-math-v2',
    rating: 4.9,
    reviewCount: 15400,
    latencyMs: 5,
    pricing: 'Free',
    description: 'Calculate monthly loan EMI, interest breakdown, and payment ratios.',
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
    reviewCount: 28400,
    latencyMs: 320,
    pricing: 'Free',
    description: 'Generate realistic photos, posters, and digital artwork from text prompts.',
    inputs: [
      { id: 'prompt', name: 'Detailed Image Prompt', type: 'textarea', required: true, defaultValue: 'An Indian boy playing cricket in a green village field' },
      { id: 'aspectRatio', name: 'Aspect Ratio', type: 'select', options: ['9:16 (Reels/Story)', '1:1 (Square)', '16:9 (Landscape)'], defaultValue: '9:16 (Reels/Story)' }
    ],
    outputType: 'image'
  },
  {
    id: 'youtube-seo-tag-generator',
    name: 'YouTube SEO Tags & Title Generator',
    category: 'Text & Marketing Tools',
    subcategory: 'YouTube Growth',
    provider: 'SEO Marketing Engine',
    modelUsed: 'seo-rank-v3',
    rating: 4.9,
    reviewCount: 19800,
    latencyMs: 150,
    pricing: 'Free',
    description: 'Generate high-ranking YouTube video titles, tags, and descriptions.',
    inputs: [
      { id: 'videoTopic', name: 'Video Title / Topic', type: 'text', required: true, defaultValue: 'Village Nature India Rain Thunderstorm' },
      { id: 'targetAudience', name: 'Audience Focus', type: 'select', options: ['Global Organic', 'Indian Nature Lovers', 'Relaxation / ASMR'], defaultValue: 'Indian Nature Lovers' }
    ],
    outputType: 'text'
  }
];

// 🚀 DYNAMIC GENERATOR
function generateCleanToolCatalog(): AITool[] {
  const catalog: AITool[] = [...HANDCRAFTED_TOOLS];
  const existingNames = new Set<string>(catalog.map(t => t.name.toLowerCase()));
  const descriptors = ['Smart', 'Batch', 'AI', 'Instant', 'Precision', 'Vector', 'Fast', 'HD', 'Cloud', 'Interactive', 'Automated', 'Custom'];

  const categoryToolDefinitions = [
    { cat: 'PDF & Document Tools', bases: ['Split PDF by Page Range', 'PDF Watermark Remover', 'Add PDF Watermark', 'PDF Page Numberer', 'PDF Password Protect', 'Unlock PDF Password'] },
    { cat: 'Image Tools (AI & Utility)', bases: ['Background Remover', 'Image Upscaler 8K', 'Photo Enhancer', 'AI Avatar Generator', 'Vector Tracing Converter'] },
    { cat: 'Video Tools (AI & Utility)', bases: ['Video Trimmer & Cutter', 'MP4 to GIF Converter', 'Auto Subtitle Generator', 'Video Upscaler 4K', 'Background Noise Reducer'] },
    { cat: 'Audio Tools (AI & Utility)', bases: ['AI Text to Speech Voiceover', 'Voice Isolator & Vocal Remover', 'Audio Cutter & Joiner', 'Background Noise Suppressor'] },
    { cat: 'Calculators & Finance', bases: ['SIP Return Calculator', 'GST Tax Calculator', 'Income Tax Slab Calculator', 'Crypto Profit Calculator'] },
    { cat: 'Coding & Web Tools', bases: ['JSON Formatter & Validator', 'CSS Gradient Code Generator', 'Regex Expression Tester', 'SQL Query Optimizer'] },
    { cat: 'Text & Marketing Tools', bases: ['AI Blog Article Writer', 'Grammar & Spell Checker', 'Email Copywriter Studio', 'Instagram Hashtag Generator'] }
  ];

  categoryToolDefinitions.forEach((spec) => {
    spec.bases.forEach((baseName) => {
      descriptors.forEach((prefix) => {
        const fullToolName = `${prefix} ${baseName}`;
        const cleanId = fullToolName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        if (!existingNames.has(fullToolName.toLowerCase())) {
          existingNames.add(fullToolName.toLowerCase());
          catalog.push({
            id: cleanId, name: fullToolName, category: spec.cat as ToolCategory, subcategory: baseName.split(' ')[0],
            provider: 'NeuralMarket Engine', modelUsed: `neural-v2.0`, rating: Number((4.7 + (catalog.length % 3) * 0.1).toFixed(1)),
            reviewCount: 2100 + (catalog.length * 15), latencyMs: 15 + (catalog.length % 20), pricing: 'Free',
            description: `Professional high-speed ${baseName.toLowerCase()} designed for automated workflows.`,
            inputs: [{ id: 'prompt', name: 'Input Source / Parameters', type: 'textarea', required: true, defaultValue: `Perform ${baseName}` }],
            outputType: spec.cat.includes('Image') ? 'image' : spec.cat.includes('Video') ? 'video' : spec.cat.includes('Audio') ? 'audio' : 'text'
          });
        }
      });
    });
  });

  return catalog;
}

export const INITIAL_TOOLS: AITool[] = generateCleanToolCatalog();
export const TOOLS_DATA = INITIAL_TOOLS;
