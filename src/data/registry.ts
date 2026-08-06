import { MuteToolConfig } from '../types/mute';

// =====================================================================
// MARKET1 TOOL CONFIGURATION REGISTRY
// No logic here. Only configurations.
// =====================================================================

export const TOOL_REGISTRY: MuteToolConfig[] = [
  
  // ---------------------------------------------------------
  // 1. BROWSER TOOL: PDF Splitter (Runs entirely locally)
  // ---------------------------------------------------------
  {
    id: 'split-pdf',
    name: 'Split PDF Pages',
    category: 'PDF & Documents',
    description: 'Extract specific pages from your PDF securely in your browser.',
    seoKeywords: ['split pdf', 'extract pdf pages', 'cut pdf'],
    engine: 'browser',
    processor: 'pdf-lib', // Engine router knows to use client-side pdf-lib
    accepts: ['pdf'],
    outputs: ['pdf'],
    options: [
      { id: 'pageRange', label: 'Pages to Extract (e.g. 1-3)', type: 'text', defaultValue: '1', required: true }
    ],
    validation: { maxFileSizeMB: 100, maxFiles: 1 },
    capabilities: { hasPreview: true, hasDownload: true, hasHistory: true, allowMultipleUploads: false }
  },

  // ---------------------------------------------------------
  // 2. AI TOOL: Image Generator (Routes to fal.ai)
  // ---------------------------------------------------------
  {
    id: 'ai-image-generator',
    name: 'AI Text to Image',
    category: 'Image & Graphics',
    description: 'Generate stunning, hyper-realistic images using advanced AI models.',
    seoKeywords: ['ai image generator', 'text to image', 'flux ai'],
    engine: 'ai',
    processor: 'fal.ai', // Engine router knows to hit AI Gateway
    accepts: ['prompt'], // Text input only, no file upload
    outputs: ['jpg', 'png', 'webp'],
    options: [
      { id: 'prompt', label: 'Detailed Prompt', type: 'textarea', defaultValue: 'A futuristic cyberpunk city', required: true },
      { id: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ['1:1', '16:9', '9:16'], defaultValue: '16:9' }
    ],
    validation: { requireAuthentication: true, requireWalletCredits: 5 },
    capabilities: { hasPreview: true, hasDownload: true, hasHistory: true, allowMultipleUploads: false },
    aiConfig: {
      primaryProvider: 'fal.ai',
      fallbackProvider: 'openrouter',
      modelId: 'flux/schnell',
      fallbackModelId: 'stable-diffusion-xl'
    }
  },

  // ---------------------------------------------------------
  // 3. BACKEND TOOL: Image Compressor (Routes to Node/Sharp)
  // ---------------------------------------------------------
  {
    id: 'image-compressor',
    name: 'Smart Image Compressor',
    category: 'Image & Graphics',
    description: 'Reduce image file size by up to 80% without losing visual quality.',
    seoKeywords: ['compress image', 'reduce image size', 'optimize jpg'],
    engine: 'backend',
    processor: 'sharp', // Engine router knows to hit Next.js Backend API
    accepts: ['jpg', 'png', 'webp'],
    outputs: ['jpg', 'webp'],
    options: [
      { id: 'quality', label: 'Compression Quality (%)', type: 'slider', min: 10, max: 100, step: 1, defaultValue: 80 }
    ],
    validation: { maxFileSizeMB: 25, maxFiles: 10 },
    capabilities: { hasPreview: true, hasDownload: true, hasHistory: true, allowMultipleUploads: true }
  }
];

// Helper function for the Router to easily fetch configurations
export const getToolConfig = (toolId: string): MuteToolConfig | undefined => {
  return TOOL_REGISTRY.find(tool => tool.id === toolId);
};
