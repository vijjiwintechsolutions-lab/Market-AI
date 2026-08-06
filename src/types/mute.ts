// =====================================================================
// MARKET1 MUTE TYPE DEFINITIONS
// =====================================================================

export type ToolCategory = 
  | 'PDF & Document Tools'
  | 'Image Tools (AI & Utility)'
  | 'Video Tools (AI & Utility)'
  | 'Audio Tools (AI & Utility)'
  | 'Calculators & Finance'
  | 'Coding & Web Tools'
  | 'Text & Marketing Tools'
  | 'PDF & Documents'
  | 'Image & Graphics'
  | 'AI & Text'
  | 'Video & Audio'
  | 'Coding & Web';

export type EngineType = 'browser' | 'backend' | 'ai' | 'hybrid';

export interface ToolOption {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'slider';
  defaultValue?: any;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
}

export interface ToolValidation {
  maxFileSizeMB?: number;
  maxFiles?: number;
  requireAuthentication?: boolean;
  requireWalletCredits?: number;
}

export interface ToolCapabilities {
  hasPreview: boolean;
  hasDownload: boolean;
  hasHistory: boolean;
  allowMultipleUploads: boolean;
}

export interface AIConfig {
  primaryProvider: string;
  fallbackProvider?: string;
  modelId: string;
}

export interface MuteToolConfig {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  seoKeywords: string[];
  engine: EngineType;
  processor: string;
  accepts: string[];
  outputs: string[];
  options: ToolOption[];
  validation?: ToolValidation;
  capabilities: ToolCapabilities;
  aiConfig?: AIConfig;
}
