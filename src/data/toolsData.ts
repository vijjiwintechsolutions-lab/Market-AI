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

const PDF_SUITE_TOOLS: AITool[] = [
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
      { id: 'imageQuality', name: 'Image Quality', type: 'select', options: ['Standard (72dpi)', 'High Quality (300dpi)'], defaultValue: 'High Quality (300dpi)' }
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

function buildFullCatalog(): AITool[] {
  return [...PDF_SUITE_TOOLS];
}

export const INITIAL_TOOLS: AITool[] = buildFullCatalog();
export const TOOLS_DATA = INITIAL_TOOLS;
