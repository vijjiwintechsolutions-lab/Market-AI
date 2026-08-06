// =====================================================================
// MARKET1 UNIVERSAL TOOL ENGINE (MUTE) - CORE SCHEMA
// Configure Once. Generate Everything.
// =====================================================================

export type EngineType = 'browser' | 'backend' | 'ai' | 'hybrid';

export type ToolCategory = 
  | 'PDF & Documents' 
  | 'Image & Graphics' 
  | 'Video & Animation' 
  | 'Audio & Music' 
  | 'Calculators & Finance' 
  | 'Coding & Web' 
  | 'Text & Marketing';

export type InputFormat = 'pdf' | 'jpg' | 'png' | 'webp' | 'mp4' | 'mp3' | 'txt' | 'csv' | 'json' | 'prompt' | 'none';
export type OutputFormat = InputFormat | 'docx' | 'xlsx' | 'svg' | 'webm';

// Defines the dynamic UI controls a tool requires
export interface ToolOption {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'slider' | 'switch' | 'textarea';
  defaultValue: string | number | boolean;
  options?: string[]; // For 'select' type
  min?: number;       // For 'slider' or 'number'
  max?: number;
  step?: number;
  required?: boolean;
}

export interface ValidationRules {
  maxFileSizeMB?: number;
  maxFiles?: number;
  requireAuthentication?: boolean;
  requireWalletCredits?: number;
}

export interface AIConfiguration {
  primaryProvider: 'openrouter' | 'fal.ai' | 'huggingface' | 'replicate' | 'none';
  fallbackProvider?: 'openrouter' | 'fal.ai' | 'huggingface' | 'replicate' | 'none';
  modelId: string;
  fallbackModelId?: string;
}

export interface MuteToolConfig {
  // 1. Tool Metadata
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  seoKeywords: string[];
  
  // 2. Engine & Processor
  engine: EngineType;
  processor: string; // e.g., 'pdf-lib', 'ffmpeg.wasm', 'sharp', 'flux-schnell'
  
  // 3. I/O Configurations
  accepts: InputFormat[];
  outputs: OutputFormat[];
  
  // 4. Dynamic UI Options
  options: ToolOption[];
  
  // 5. Validation Rules
  validation: ValidationRules;

  // 6. Capabilities (Flags for Universal Engines)
  capabilities: {
    hasPreview: boolean;
    hasDownload: boolean;
    hasHistory: boolean;
    allowMultipleUploads: boolean;
  };

  // 7. AI Specifics (Optional)
  aiConfig?: AIConfiguration;
}
