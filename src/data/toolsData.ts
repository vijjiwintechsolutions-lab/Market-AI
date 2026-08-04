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

// SMALLPDF-STYLE PROFESSIONAL PDF SUITE
const PDF_SUITE_TOOLS: AITool[] = [
  // --- ORGANIZE PDF ---
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    category: 'PDF & Document Tools',
    subcategory: 'Organize',
    provider: 'DocuCore Local',
    modelUsed: 'pdf-lib',
    rating: 4.9,
    reviewCount: 8400,
    latencyMs: 15,
    pricing: 'Free',
    badge: 'Essential',
    description: 'Combine multiple PDFs into one unified document instantly.',
    inputs: [], // Requires only file upload
    outputType: 'text'
  },
  {
    id: 'split-pdf',
    name: 'Split PDF',
    category: 'PDF & Document Tools',
    subcategory: 'Organize',
    provider: 'DocuCore Local',
    modelUsed: 'pdf-lib',
    rating: 4.8,
    reviewCount: 5200,
    latencyMs: 12,
    pricing: 'Free',
    description: 'Extract pages from your PDF or save each page as a separate PDF.',
    inputs: [
      { id: 'splitPages', name: 'Pages to Extract (e.g. 1-5, 8)', type: 'text', required: true, defaultValue: '1-3' }
    ],
    outputType: 'text'
  },
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
      { id: 'pagesToRemove', name: 'Pages to Delete (e.g. 2, 4)', type: 'text', required: true, defaultValue: '' }
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

  // --- CONVERT FROM/TO PDF ---
  {
    id: 'pdf-to-word',
    name: 'PDF to Word Converter',
    category: 'PDF & Document Tools',
    subcategory: 'Convert',
    provider: 'FormatCore Engine',
    modelUsed: 'doc-convert-v1',
    rating: 4.9,
    reviewCount: 9500,
    latencyMs: 45,
    pricing: 'Free',
    badge: 'Popular',
    description: 'Convert PDFs to editable Microsoft Word documents.',
    inputs: [],
    outputType: 'text'
  },
  {
    id: 'word-to-pdf',
    name: 'Word to PDF Converter',
    category: 'PDF & Document Tools',
    subcategory: 'Convert',
    provider: 'FormatCore Engine',
    modelUsed: 'doc-convert-v1',
    rating: 4.9,
    reviewCount: 7800,
    latencyMs: 35,
    pricing: 'Free',
    description: 'Convert Microsoft Word documents to universally readable PDFs.',
    inputs: [],
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
    id: 'pdf-ocr',
    name: 'PDF OCR (Text Extractor)',
    category: 'PDF & Document Tools',
    subcategory: 'Convert',
    provider: 'VisionAI Engine',
    modelUsed: 'tesseract-wasm',
    rating: 4.8,
    reviewCount: 3200,
    latencyMs: 120,
    pricing: 'Free',
    badge: 'AI Powered',
    description: 'Convert scanned, non-searchable PDFs into searchable and selectable text documents.',
    inputs: [
      { id: 'language', name: 'Document Language', type: 'select', options: ['English', 'Spanish', 'French', 'Hindi', 'Telugu'], defaultValue: 'English' }
    ],
    outputType: 'text'
  },

  // --- COMPRESS & EDIT ---
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
    badge: 'Top Tool',
    description: 'Reduce the file size of your PDF without losing quality.',
    inputs: [
      { id: 'compressionLevel', name: 'Compression Level', type: 'select', options: ['Basic Compression (Medium size, High Quality)', 'Strong Compression (Smallest size, Good Quality)'], defaultValue: 'Basic Compression (Medium size, High Quality)' }
    ],
    outputType: 'text'
  },
  {
    id: 'watermark-pdf',
    name: 'Watermark PDF',
    category: 'PDF & Document Tools',
    subcategory: 'Edit',
    provider: 'DocuCore Local',
    modelUsed: 'pdf-lib',
    rating: 4.7,
    reviewCount: 2200,
    latencyMs: 15,
    pricing: 'Free',
    description: 'Stamp an image or text over your PDF in seconds.',
    inputs: [
      { id: 'watermarkText', name: 'Watermark Text', type: 'text', required: true, defaultValue: 'CONFIDENTIAL' },
      { id: 'watermarkPosition', name: 'Position', type: 'select', options: ['Center', 'Top Right', 'Bottom Left', 'Diagonal'], defaultValue: 'Diagonal' }
    ],
    outputType: 'text'
  },
  {
    id: 'number-pages',
    name: 'Number Pages',
    category: 'PDF & Document Tools',
    subcategory: 'Edit',
    provider: 'DocuCore Local',
    modelUsed: 'pdf-lib',
    rating: 4.6,
    reviewCount: 1500,
    latencyMs: 10,
    pricing: 'Free',
    description: 'Insert page numbers in PDF documents with ease.',
    inputs: [
      { id: 'pagePosition', name: 'Number Position', type: 'select', options: ['Bottom Center', 'Bottom Right', 'Top Right'], defaultValue: 'Bottom Center' }
    ],
    outputType: 'text'
  },

  // --- SECURITY & SIGN ---
  {
    id: 'protect-pdf',
    name: 'Protect PDF',
    category: 'PDF & Document Tools',
    subcategory: 'Security',
    provider: 'SecuCore Engine',
    modelUsed: 'pdf-encrypt',
    rating: 4.9,
    reviewCount: 4100,
    latencyMs: 25,
    pricing: 'Free',
    badge: 'Secure',
    description: 'Add a password and encrypt your PDF file to keep it private.',
    inputs: [
      { id: 'pdfPassword', name: 'Set Secure Password', type: 'text', required: true, defaultValue: '' }
    ],
    outputType: 'text'
  },
  {
    id: 'unlock-pdf',
    name: 'Unlock PDF',
    category: 'PDF & Document Tools',
    subcategory: 'Security',
    provider: 'SecuCore Engine',
    modelUsed: 'pdf-decrypt',
    rating: 4.8,
    reviewCount: 3800,
    latencyMs: 20,
    pricing: 'Free',
    description: 'Remove password, encryption, and permission from your PDF.',
    inputs: [
      { id: 'knownPassword', name: 'Original Password (If known)', type: 'text', required: false, defaultValue: '' }
    ],
    outputType: 'text'
  },
  {
    id: 'sign-pdf',
    name: 'Sign PDF (eSign)',
    category: 'PDF & Document Tools',
    subcategory: 'Sign',
    provider: 'SignCore Engine',
    modelUsed: 'digital-sign',
    rating: 4.9,
    reviewCount: 6700,
    latencyMs: 30,
    pricing: 'Free',
    badge: 'Business',
    description: 'Create an electronic signature and sign your documents securely.',
    inputs: [
      { id: 'signatureName', name: 'Type Full Name to Sign', type: 'text', required: true, defaultValue: 'John Doe' }
    ],
    outputType: 'text'
  },

  // --- AI PDF ASSISTANTS ---
  {
    id: 'ai-pdf-summarizer',
    name: 'AI PDF Summarizer',
    category: 'PDF & Document Tools',
    subcategory: 'AI PDF',
    provider: 'Gemini Document AI',
    modelUsed: 'gemini-2.5-flash',
    rating: 5.0,
    reviewCount: 11200,
    latencyMs: 850,
    pricing: 'Free',
    badge: 'Smart AI',
    description: 'Summarize long PDF documents instantly using advanced AI.',
    inputs: [
      { id: 'summaryLength', name: 'Summary Length', type: 'select', options: ['Short (Key Bullet Points)', 'Detailed (Comprehensive Overview)'], defaultValue: 'Short (Key Bullet Points)' }
    ],
    outputType: 'text'
  },
  {
    id: 'chat-with-pdf',
    name: 'Chat with PDF',
    category: 'PDF & Document Tools',
    subcategory: 'AI PDF',
    provider: 'Gemini Document AI',
    modelUsed: 'gemini-2.5-flash',
    rating: 4.9,
    reviewCount: 8900,
    latencyMs: 600,
    pricing: 'Free',
    description: 'Ask questions and extract specific information directly from your PDF.',
    inputs: [
      { id: 'prompt', name: 'Ask a question about this document', type: 'textarea', required: true, defaultValue: 'What are the main conclusions of this document?' }
    ],
    outputType: 'text'
  }
];

// Combine PDF suite with a function that generates other utility tools
function buildFullCatalog(): AITool[] {
  const catalog: AITool[] = [...PDF_SUITE_TOOLS];
  
  // You can keep your existing logic here for the other 700+ tools
  // (Like the Calculators, Video tools, etc. from the previous code)
  
  return catalog;
}

export const INITIAL_TOOLS: AITool[] = buildFullCatalog();
export const TOOLS_DATA = INITIAL_TOOLS;
