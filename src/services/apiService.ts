import { AITool } from '../types';
import { processBackgroundRemoval } from '../utils/backgroundRemover';

export interface ToolExecutionParams {
  tool: AITool;
  inputValues: Record<string, any>;
  filePreview?: string | null;
}

export interface ToolExecutionResponse {
  success: boolean;
  output: any;
  textOutput?: string;
  videoUrl?: string;
  frameUrl?: string;
  imageUrl?: string;
  audioUrl?: string;
  durationSec?: number;
  executionTimeMs: number;
  provider?: string;
  modelUsed?: string;
  error?: string;
}

export interface HealthCheckResponse {
  status: string;
  app: string;
  version: string;
  timestamp: string;
  hasApiKey: boolean;
}

class APIService {
  /**
   * Helper to determine the target backend AI endpoint based on tool properties.
   */
  public getEndpointForTool(tool: AITool): string {
    const isVideoTool =
      tool.outputType === 'video' ||
      tool.category === 'Video AI' ||
      tool.id.toLowerCase().includes('video') ||
      (tool.modelUsed && tool.modelUsed.toLowerCase().includes('veo')) ||
      (tool.subcategory && tool.subcategory.toLowerCase().includes('video')) ||
      (tool.name && tool.name.toLowerCase().includes('video')) ||
      (tool.tags && tool.tags.some((t: string) => t.toLowerCase().includes('video')));

    if (isVideoTool) return '/api/ai/video';
    if (tool.outputType === 'image' || tool.category === 'Image AI') return '/api/ai/image';
    if (tool.outputType === 'audio' || tool.category === 'Audio & Voice') return '/api/ai/audio';
    if (tool.category === 'PDF & Documents') return '/api/ai/analyze';
    return tool.apiRoute || '/api/ai/text';
  }

  /**
   * Extract the main prompt string from various possible input fields.
   */
  public extractPrompt(inputValues: Record<string, any>, defaultDescription?: string): string {
    return (
      inputValues.prompt ||
      inputValues.topic ||
      inputValues.text ||
      inputValues.businessIdea ||
      inputValues.question ||
      inputValues.jobTitle ||
      inputValues.query ||
      inputValues.userMessage ||
      inputValues.description ||
      Object.values(inputValues).find((v) => typeof v === 'string' && String(v).trim() !== '') ||
      defaultDescription ||
      'Default query'
    );
  }

  /**
   * Execute an AI Tool call via backend Gemini model APIs.
   */
  public async executeTool({ tool, inputValues, filePreview }: ToolExecutionParams): Promise<ToolExecutionResponse> {
    const startTime = Date.now();

    // Check if this is the AI Background Remover tool
    const isBgRemover =
      tool.id === 'image-bg-remover' ||
      tool.name.toLowerCase().includes('background remover') ||
      tool.tags?.includes('Background Removal');

    if (isBgRemover) {
      const imageSource = filePreview || inputValues.filePreview || inputValues.image || inputValues.file;
      if (imageSource) {
        const bgType = inputValues.bgType || inputValues.newBackground || 'Transparent PNG';
        try {
          const bgResult = await processBackgroundRemoval(imageSource, bgType);
          if (bgResult.success && bgResult.imageUrl) {
            return {
              success: true,
              output: bgResult.imageUrl,
              imageUrl: bgResult.imageUrl,
              textOutput: `✨ AI Background Removal Complete! Subject cleanly isolated onto target background: "${bgType}".`,
              executionTimeMs: Date.now() - startTime,
              provider: 'HuggingFace / RMBG-1.4 Neural Vision Engine',
              modelUsed: 'briaai/RMBG-1.4',
            };
          }
        } catch (err: any) {
          console.warn('[APIService] Client-side AI background removal error, falling back to server route:', err);
        }
      }
    }

    const endpoint = this.getEndpointForTool(tool);
    const prompt = this.extractPrompt(inputValues, tool.description);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          toolId: tool.id,
          prompt,
          systemInstruction: inputValues.systemInstruction,
          modelUsed: tool.modelUsed,
          aspectRatio: inputValues.aspectRatio,
          voiceName: inputValues.voiceName,
          documentText: inputValues.documentText,
          sourceUrl: inputValues.sourceUrl || inputValues.linkUrl || inputValues.url,
          outputFormat: inputValues.outputFormat,
          language: inputValues.language,
          question: inputValues.question || prompt,
          filePreview: filePreview || inputValues.filePreview || undefined,
          inputs: inputValues,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server returned HTTP ${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      const elapsed = Date.now() - startTime;

      return {
        success: Boolean(data.success),
        output: data.output,
        textOutput: data.textOutput,
        videoUrl: data.videoUrl,
        frameUrl: data.frameUrl,
        imageUrl: data.imageUrl,
        audioUrl: data.audioUrl,
        durationSec: data.durationSec,
        executionTimeMs: data.executionTimeMs || elapsed,
        provider: data.provider || tool.provider,
        modelUsed: data.modelUsed || tool.modelUsed,
        error: data.error,
      };
    } catch (error: any) {
      console.error(`[APIService] Error executing tool ${tool.id}:`, error);
      return {
        success: false,
        output: null,
        executionTimeMs: Date.now() - startTime,
        error: error.message || 'Failed to communicate with AI backend service',
      };
    }
  }

  /**
   * Health Check endpoint to verify backend status & GEMINI_API_KEY presence
   */
  public async checkHealth(): Promise<HealthCheckResponse | null> {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        return await res.json();
      }
      return null;
    } catch (err) {
      console.warn('[APIService] Health check failed:', err);
      return null;
    }
  }
}

export const apiService = new APIService();
export default apiService;
