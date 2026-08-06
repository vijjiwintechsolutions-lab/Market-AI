// =====================================================================
// MARKET1 TOOL CONFIGURATION REGISTRY (MUTE)
// Configure Once. Generate Everything. Build Once. Scale Forever.
// =====================================================================

import { MuteToolConfig, ToolCategory } from '../types/mute';

const HANDCRAFTED_TOOLS: MuteToolConfig[] = [
  {
    id: 'merge-pdf',
    name: 'Merge PDF Documents',
    category: 'PDF & Documents',
    description: 'Combine multiple PDF files into one unified document securely in your browser.',
    seoKeywords: ['merge pdf', 'combine pdf', 'join pdf files'],
    engine: 'browser',
    processor: 'pdf-lib',
    accepts: ['pdf'],
    outputs: ['pdf'],
    options: [],
    validation: { maxFileSizeMB: 50, maxFiles: 20 },
    capabilities: { hasPreview: true, hasDownload: true, hasHistory: true, allowMultipleUploads: true }
  },
  {
    id: 'image-compressor',
    name: 'Smart Image Compressor',
    category: 'Image & Graphics',
    description: 'Reduce image file size by up to 80% without losing visual quality.',
    seoKeywords: ['compress image', 'reduce image size', 'optimize jpg'],
    engine: 'backend',
    processor: 'sharp',
    accepts: ['jpg', 'png', 'webp'],
    outputs: ['jpg', 'webp'],
    options: [
      { id: 'quality', label: 'Quality (%)', type: 'slider', min: 10, max: 100, step: 1, defaultValue: 80 }
    ],
    validation: { maxFileSizeMB: 25, maxFiles: 10 },
    capabilities: { hasPreview: true, hasDownload: true, hasHistory: true, allowMultipleUploads: true }
  },
  {
    id: 'ai-image-generator',
    name: 'AI Text to Image',
    category: 'Image & Graphics',
    description: 'Generate stunning, hyper-realistic images using advanced AI models.',
    seoKeywords: ['ai image generator', 'text to image', 'flux ai'],
    engine: 'ai',
    processor: 'fal.ai',
    accepts: ['prompt'],
    outputs: ['jpg', 'png'],
    options: [
      { id: 'prompt', label: 'Detailed Prompt', type: 'textarea', defaultValue: 'A futuristic cyberpunk city', required: true },
      { id: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ['1:1', '16:9', '9:16'], defaultValue: '16:9' }
    ],
    validation: { requireAuthentication: false, requireWalletCredits: 0 },
    capabilities: { hasPreview: true, hasDownload: true, hasHistory: true, allowMultipleUploads: false },
    aiConfig: { primaryProvider: 'fal.ai', fallbackProvider: 'openrouter', modelId: 'flux/schnell' }
  }
];

function generatePlatformCatalog(): MuteToolConfig[] {
  return [...HANDCRAFTED_TOOLS];
}

export const TOOL_REGISTRY: MuteToolConfig[] = generatePlatformCatalog();

export const getToolConfig = (toolId: string): MuteToolConfig | undefined => {
  return TOOL_REGISTRY.find(tool => tool.id === toolId);
};
