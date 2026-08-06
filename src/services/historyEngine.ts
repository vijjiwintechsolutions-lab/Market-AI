// =====================================================================
// MARKET1 UNIVERSAL HISTORY ENGINE (MUTE)
// Automatically logs all tool executions for the user's dashboard.
// =====================================================================

import { MuteToolConfig } from '../types/mute';

export interface HistoryRecord {
  id: string;
  toolId: string;
  toolName: string;
  engine: string;
  processor: string;
  timestamp: string;
  executionTimeMs: number;
  status: 'success' | 'error';
  inputs: Record<string, any>;
  outputType: string;
}

export const UniversalHistoryEngine = {
  async logExecution(
    tool: MuteToolConfig, 
    status: 'success' | 'error', 
    executionTimeMs: number, 
    inputValues: Record<string, any>
  ): Promise<void> {
    
    if (!tool.capabilities.hasHistory) return;

    const record: HistoryRecord = {
      id: `hist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      toolId: tool.id,
      toolName: tool.name,
      engine: tool.engine,
      processor: tool.processor,
      timestamp: new Date().toISOString(),
      executionTimeMs,
      status,
      // We sanitize inputs to avoid storing massive base64 strings or raw files in history
      inputs: this.sanitizeInputs(inputValues),
      outputType: inputValues['outputFormat'] || tool.outputs[0] || 'unknown'
    };

    try {
      // 🚀 PRODUCTION READY HOOK: Replace with Firestore
      // await addDoc(collection(db, 'users', userId, 'history'), record);

      // Local Fallback for immediate working state
      const existing = JSON.parse(localStorage.getItem('market1_history') || '[]');
      const updated = [record, ...existing].slice(0, 100); // Keep last 100 locally
      localStorage.setItem('market1_history', JSON.stringify(updated));

      console.log(`[MUTE History Engine] Logged ${status} for ${tool.id}`);
    } catch (error) {
      console.error('[MUTE History Engine] Failed to log execution:', error);
    }
  },

  sanitizeInputs(inputs: Record<string, any>): Record<string, any> {
    const safeInputs: Record<string, any> = {};
    for (const [key, value] of Object.entries(inputs)) {
      // Don't log massive text prompts over 1000 chars or file objects
      if (typeof value === 'string' && value.length > 1000) {
        safeInputs[key] = value.substring(0, 1000) + '... [truncated]';
      } else if (value instanceof File || value instanceof Blob) {
        safeInputs[key] = '[File Object]';
      } else {
        safeInputs[key] = value;
      }
    }
    return safeInputs;
  },

  async getUserHistory(): Promise<HistoryRecord[]> {
    // 🚀 PRODUCTION READY HOOK: Fetch from Firestore
    return JSON.parse(localStorage.getItem('market1_history') || '[]');
  }
};
