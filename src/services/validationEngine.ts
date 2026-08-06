// =====================================================================
// MARKET1 UNIVERSAL VALIDATION ENGINE (MUTE)
// Automatically validates all inputs, files, auth, and credits.
// =====================================================================

import { MuteToolConfig } from '../types/mute';

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const UniversalValidationEngine = {
  validate(tool: MuteToolConfig, inputValues: Record<string, any>, files: File[]): ValidationResult {
    const requiresUpload = !tool.accepts.includes('prompt') || tool.accepts.length > 1;

    // ---------------------------------------------------------
    // 1. VALIDATE REQUIRED INPUTS (Options & Prompts)
    // ---------------------------------------------------------
    for (const opt of tool.options) {
      if (opt.required) {
        const val = inputValues[opt.id];
        if (val === undefined || val === null || val === '') {
          return { isValid: false, errorMessage: `The field "${opt.label}" is required.` };
        }
      }
    }

    // ---------------------------------------------------------
    // 2. VALIDATE FILE UPLOADS (Extension, Size, Count)
    // ---------------------------------------------------------
    if (requiresUpload) {
      if (files.length === 0) {
        return { isValid: false, errorMessage: `Please upload at least one valid file (${tool.accepts.join(', ').toUpperCase()}).` };
      }

      const maxFiles = tool.validation?.maxFiles || 1;
      if (files.length > maxFiles) {
        return { isValid: false, errorMessage: `Maximum ${maxFiles} file(s) allowed. You uploaded ${files.length}.` };
      }

      const maxMB = tool.validation?.maxFileSizeMB || 10; // Default 10MB fallback
      const maxBytes = maxMB * 1024 * 1024;

      for (const file of files) {
        // Validate Extension
        const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
        // Map common extensions (e.g., jpg also covers jpeg)
        const acceptsRegex = tool.accepts.map(ext => ext === 'jpg' ? 'jpe?g' : ext).join('|');
        const isValidExt = new RegExp(`^(${acceptsRegex})$`, 'i').test(fileExt);

        if (!isValidExt) {
          return { isValid: false, errorMessage: `Invalid file type: ${file.name}. Accepted formats: ${tool.accepts.join(', ').toUpperCase()}.` };
        }

        // Validate File Size
        if (file.size > maxBytes) {
          return { isValid: false, errorMessage: `File "${file.name}" is too large. Maximum size is ${maxMB}MB.` };
        }
      }
    }

    // ---------------------------------------------------------
    // 3. VALIDATE AUTHENTICATION & WALLET (Future-Proofing)
    // ---------------------------------------------------------
    if (tool.validation?.requireAuthentication) {
      // TODO: Implement Firebase Auth Check
      // const user = auth.currentUser;
      // if (!user) return { isValid: false, errorMessage: 'You must be logged in to use this AI Tool.' };
    }

    if (tool.validation?.requireWalletCredits) {
      // TODO: Implement Wallet Credit Check
      // const balance = await getWalletBalance();
      // if (balance < tool.validation.requireWalletCredits) return { isValid: false, errorMessage: `Insufficient credits. This tool requires ${tool.validation.requireWalletCredits} credits.` };
    }

    return { isValid: true };
  }
};
