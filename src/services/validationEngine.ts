// =====================================================================
// MARKET1 UNIVERSAL VALIDATION ENGINE (MUTE)
// Automatically validates inputs, files, auth, and credits.
// =====================================================================

import { MuteToolConfig } from '../types/mute';
import { auth } from '../config/firebase';
import { UniversalWalletEngine } from './walletEngine';

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const UniversalValidationEngine = {
  async validate(tool: MuteToolConfig, inputValues: Record<string, any>, files: File[]): Promise<ValidationResult> {
    const requiresUpload = !tool.accepts.includes('prompt') || tool.accepts.length > 1;

    // 1. VALIDATE REQUIRED INPUTS
    for (const opt of tool.options) {
      if (opt.required) {
        const val = inputValues[opt.id];
        if (val === undefined || val === null || val === '') {
          return { isValid: false, errorMessage: `The field "${opt.label}" is required.` };
        }
      }
    }

    // 2. VALIDATE FILE UPLOADS
    if (requiresUpload) {
      if (files.length === 0) return { isValid: false, errorMessage: `Please upload at least one valid file (${tool.accepts.join(', ').toUpperCase()}).` };

      const maxFiles = tool.validation?.maxFiles || 1;
      if (files.length > maxFiles) return { isValid: false, errorMessage: `Maximum ${maxFiles} file(s) allowed. You uploaded ${files.length}.` };

      const maxMB = tool.validation?.maxFileSizeMB || 10;
      const maxBytes = maxMB * 1024 * 1024;

      for (const file of files) {
        const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
        const acceptsRegex = tool.accepts.map(ext => ext === 'jpg' ? 'jpe?g' : ext).join('|');
        const isValidExt = new RegExp(`^(${acceptsRegex})$`, 'i').test(fileExt);

        if (!isValidExt) return { isValid: false, errorMessage: `Invalid file type: ${file.name}. Accepted formats: ${tool.accepts.join(', ').toUpperCase()}.` };
        if (file.size > maxBytes) return { isValid: false, errorMessage: `File "${file.name}" is too large. Maximum size is ${maxMB}MB.` };
      }
    }

    // 3. VALIDATE AUTHENTICATION & WALLET CREDITS
    const currentUser = auth.currentUser;

    if (tool.validation?.requireAuthentication && !currentUser) {
      return { isValid: false, errorMessage: 'Authentication Required: You must be logged in to use this enterprise tool.' };
    }

    const requiredCredits = tool.validation?.requireWalletCredits || 0;
    if (requiredCredits > 0) {
      if (!currentUser) return { isValid: false, errorMessage: `Authentication Required: This AI tool costs ${requiredCredits} credits.` };
      
      const hasCredits = await UniversalWalletEngine.hasEnoughCredits(currentUser.uid, requiredCredits);
      if (!hasCredits) {
        return { isValid: false, errorMessage: `Insufficient Funds: This tool requires ${requiredCredits} credits. Please top up your wallet.` };
      }
    }

    return { isValid: true };
  }
};
