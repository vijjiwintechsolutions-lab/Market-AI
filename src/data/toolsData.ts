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

// 🚀 ALL CORE PDF TOOLS WITH THEIR EXACT OPTIONS & INPUTS
const HANDCRAFTED_TOOLS: AITool[] = [
  {
    id: 'pdf-to-jpg', name: 'PDF to JPG Converter', category: 'PDF & Document Tools', subcategory: 'Convert',
    provider: 'FormatCore Engine', rating: 4.9, reviewCount: 14200, latencyMs: 15, pricing: 'Free',
    description: 'Convert PDF pages into high-resolution JPG or PNG images instantly.',
    inputs: [{ id: 'outputFormat', name: 'Convert to', type: 'select', options: ['JPG Image (*.jpg)', 'PNG Image (*.png)'], defaultValue: 'JPG Image (*.jpg)' }],
    outputType: 'image'
  },
  {
    id: 'pdf-to-word', name: 'PDF to Word Converter', category: 'PDF & Document Tools', subcategory: 'Convert',
    provider: 'DocuCore Engine', rating: 4.9, reviewCount: 18900, latencyMs: 25, pricing: 'Free',
    description: 'Convert PDF documents to editable Microsoft Word files seamlessly.',
    inputs: [{ id: 'outputFormat', name: 'Convert to', type: 'select', options: ['Word Document (.doc)', 'Word Document (.docx)'], defaultValue: 'Word Document (.doc)' }],
    outputType: 'text'
  },
  {
    id: 'merge-pdf', name: 'Merge PDF Documents', category: 'PDF & Document Tools', subcategory: 'Organize',
    provider: 'DocuCore Engine', rating: 4.9, reviewCount: 22100, latencyMs: 12, pricing: 'Free',
    description: 'Combine multiple PDF files into one unified document.',
    inputs: [], // Merge tool takes multiple files, no extra inputs needed
    outputType: 'text'
  },
  {
    id: 'split-pdf', name: 'Split PDF Pages', category: 'PDF & Document Tools', subcategory: 'Organize',
    provider: 'DocuCore Engine', rating: 4.8, reviewCount: 12100, latencyMs: 15, pricing: 'Free',
    description: 'Extract specific pages from a PDF to create a new document.',
    inputs: [{ id: 'pageRange', name: 'Page Range (e.g., 1-5 or 2,4,6)', type: 'text', required: true, defaultValue: '1-2' }],
    outputType: 'text'
  },
  {
    id: 'compress-pdf', name: 'Compress PDF File Size', category: 'PDF & Document Tools', subcategory: 'Optimize',
    provider: 'OptimizeCore Engine', rating: 5.0, reviewCount: 19400, latencyMs: 40, pricing: 'Free',
    description: 'Reduce PDF file size without sacrificing visual document quality.',
    inputs: [
      { id: 'targetSizeKb', name: 'Target Size (in KB)', type: 'text', required: true, defaultValue: '500' },
      { id: 'compressionLevel', name: 'Compression Level', type: 'select', options: ['Basic Compression (-40%)', 'Extreme Compression (-70%)'], defaultValue: 'Basic Compression (-40%)' }
    ],
    outputType: 'text'
  },
  {
    id: 'rotate-pdf', name: 'Rotate PDF Pages', category: 'PDF & Document Tools', subcategory: 'Organize',
    provider: 'DocuCore Engine', rating: 4.8, reviewCount: 8900, latencyMs: 10, pricing: 'Free',
    description: 'Rotate PDF pages clockwise or counter-clockwise easily.',
    inputs: [{ id: 'rotationAngle', name: 'Rotation Angle', type: 'select', options: ['90° Clockwise', '90° Counter-Clockwise', '180° Flip'], defaultValue: '90° Clockwise' }],
    outputType: 'text'
  },
  {
    id: 'delete-pdf-pages', name: 'Delete PDF Pages', category: 'PDF & Document Tools', subcategory: 'Organize',
    provider: 'DocuCore Engine', rating: 4.8, reviewCount: 6700, latencyMs: 10, pricing: 'Free',
    description: 'Selectively remove unwanted pages from your PDF document.',
    inputs: [{ id: 'pagesToRemove', name: 'Pages to Remove (e.g. 2, 4)', type: 'text', required: true, defaultValue: '2' }],
    outputType: 'text'
  },
  {
    id: 'add-pdf-watermark', name: 'Add PDF Watermark', category: 'PDF & Document Tools', subcategory: 'Security',
    provider: 'DocuCore Engine', rating: 4.7, reviewCount: 5200, latencyMs: 18, pricing: 'Free',
    description: 'Add a custom text watermark to all pages of your PDF.',
    inputs: [{ id: 'watermarkText', name: 'Watermark Text', type: 'text', required: true, defaultValue: 'CONFIDENTIAL' }],
    outputType: 'text'
  },
  
  // NON-PDF TOOLS
  {
    id: 'loan-emi-calculator-pro', name: 'Loan EMI & Interest Calculator', category: 'Calculators & Finance', subcategory: 'Finance',
    provider: 'Financial Math Engine', rating: 4.9, reviewCount: 15400, latencyMs: 5, pricing: 'Free',
    description: 'Calculate monthly loan EMI, interest breakdown, and payment ratios.',
    inputs: [
      { id: 'loanAmount', name: 'Principal Loan Amount (₹)', type: 'text', required: true, defaultValue: '1000000' },
      { id: 'interestRate', name: 'Annual Interest Rate (%)', type: 'text', required: true, defaultValue: '8.5' },
      { id: 'tenureYears', name: 'Loan Tenure (Years)', type: 'text', required: true, defaultValue: '15' }
    ],
    outputType: 'text'
  },
  {
    id: 'image-generator-pro', name: 'AI Text to Image Generator', category: 'Image Tools (AI & Utility)', subcategory: 'AI Art',
    provider: 'Flux / Imagen Core', rating: 4.9, reviewCount: 28400, latencyMs: 320, pricing: 'Free',
    description: 'Generate realistic photos, posters, and digital artwork from text prompts.',
    inputs: [
      { id: 'prompt', name: 'Detailed Image Prompt', type: 'textarea', required: true, defaultValue: 'An Indian boy playing cricket in a green village field' }
    ],
    outputType: 'image'
  }
];

// 🚀 DYNAMIC GENERATOR FOR REST OF THE TOOLS
function generateCleanToolCatalog(): AITool[] {
  const catalog: AITool[] = [...HANDCRAFTED_TOOLS];
  const existingNames = new Set<string>(catalog.map(t => t.id));

  const categoryToolDefinitions = [
    { cat: 'PDF & Document Tools', bases: ['PDF to Excel', 'Excel to PDF', 'PDF to PowerPoint', 'PowerPoint to PDF', 'PDF Password Protect', 'Unlock PDF Password', 'PDF OCR Extractor'] },
    { cat: 'Image Tools (AI & Utility)', bases: ['Background Remover', 'Image Upscaler 8K', 'Photo Enhancer', 'AI Avatar Generator', 'Vector Tracing Converter'] },
    { cat: 'Video Tools (AI & Utility)', bases: ['Video Trimmer & Cutter', 'MP4 to GIF Converter', 'Auto Subtitle Generator', 'Video Upscaler 4K', 'Background Noise Reducer'] },
    { cat: 'Audio Tools (AI & Utility)', bases: ['AI Text to Speech Voiceover', 'Voice Isolator & Vocal Remover', 'Audio Cutter & Joiner'] },
    { cat: 'Calculators & Finance', bases: ['SIP Return Calculator', 'GST Tax Calculator', 'Income Tax Slab Calculator', 'Crypto Profit Calculator'] },
    { cat: 'Coding & Web Tools', bases: ['JSON Formatter & Validator', 'CSS Gradient Generator', 'Regex Expression Tester', 'SQL Query Optimizer'] },
    { cat: 'Text & Marketing Tools', bases: ['AI Blog Article Writer', 'Grammar & Spell Checker', 'Instagram Hashtag Generator'] }
  ];

  categoryToolDefinitions.forEach((spec) => {
    spec.bases.forEach((baseName) => {
      const cleanId = baseName.toLowerCase().replace(/[^a-z0-9]/g, '-');
      if (!existingNames.has(cleanId)) {
        existingNames.add(cleanId);
        catalog.push({
          id: cleanId, name: baseName, category: spec.cat as ToolCategory, subcategory: baseName.split(' ')[0],
          provider: 'NeuralMarket Engine', rating: 4.8, reviewCount: 2100 + (catalog.length * 15), latencyMs: 20, pricing: 'Free',
          description: `Professional high-speed ${baseName.toLowerCase()} designed for automated workflows.`,
          inputs: [{ id: 'prompt', name: 'Input Instructions', type: 'textarea', required: true, defaultValue: `Process ${baseName}` }],
          outputType: spec.cat.includes('Image') ? 'image' : spec.cat.includes('Video') ? 'video' : spec.cat.includes('Audio') ? 'audio' : 'text'
        });
      }
    });
  });

  return catalog;
}

export const INITIAL_TOOLS: AITool[] = generateCleanToolCatalog();
export const TOOLS_DATA = INITIAL_TOOLS;
