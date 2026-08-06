// =====================================================================
// MARKET1 UNIVERSAL VALIDATION ENGINE (MUTE)
// Automatically validates inputs, files, auth, credits, and SUBSCRIPTIONS.
// =====================================================================

import { MuteToolConfig } from '../types/mute';
import { auth } from '../config/firebase';
import { UniversalWalletEngine } from './walletEngine';
import { UniversalSubscriptionEngine } from './subscriptionEngine';

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

export const UniversalValidationEngine = {
  async validate(tool: MuteToolConfig, inputValues: Record<string, any>, files: File[]): Promise<ValidationResult> {
    const currentUser = auth.currentUser;
    const requiresUpload = !tool.accepts.includes('prompt') || tool.accepts.length > 1;

    // 🚀 1. SUBSCRIPTION & DAILY LIMITS CHECK
    const userLimits = await UniversalSubscriptionEngine.getUserLimits(currentUser?.uid || null);
    
    if (currentUser) {
      const withinDailyLimit = await UniversalSubscriptionEngine.checkDailyLimit(currentUser.uid);
      if (!withinDailyLimit && !tool.validation?.requireWalletCredits) {
        return { isValid: false, errorMessage: `Daily Free Limit Reached (5/5). Please upgrade to PRO for unlimited access.` };
      }
    } else if (!tool.validation?.requireAuthentication && tool.engine !== 'browser') {
        // Force login for server/AI tools after 1 try or strictly require login
        return { isValid: false, errorMessage: `Please Sign In to execute high-performance cloud tools.` };
    }

    // 🚀 2. VALIDATE REQUIRED INPUTS
    for (const opt of tool.options) {
      if (opt.required) {
        const val = inputValues[opt.id];
        if (val === undefined || val === null || val === '') {
          return { isValid: false, errorMessage: `The field "${opt.label}" is required.` };
        }
      }
    }

    // 🚀 3. VALIDATE FILE UPLOADS (Using Subscription Limits)
    if (requiresUpload) {
      if (files.length === 0) return { isValid: false, errorMessage: `Please upload at least one valid file (${tool.accepts.join(', ').toUpperCase()}).` };

      const maxFiles = tool.validation?.maxFiles || 1;
      if (files.length > maxFiles) return { isValid: false, errorMessage: `Maximum ${maxFiles} file(s) allowed. You uploaded ${files.length}.` };

      // Use the smaller of either the Tool's max limit OR the User's Subscription limit
      const maxMB = Math.min(tool.validation?.maxFileSizeMB || 10, userLimits.maxFileSizeMB);
      const maxBytes = maxMB * 1024 * 1024;

      for (const file of files) {
        const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
        const acceptsRegex = tool.accepts.map(ext => ext === 'jpg' ? 'jpe?g' : ext).join('|');
        const isValidExt = new RegExp(`^(${acceptsRegex})$`, 'i').test(fileExt);

        if (!isValidExt) return { isValid: false, errorMessage: `Invalid file type: ${file.name}. Accepted formats: ${tool.accepts.join(', ').toUpperCase()}.` };
        if (file.size > maxBytes) return { isValid: false, errorMessage: `File "${file.name}" exceeds your tier limit of ${maxMB}MB. Please Upgrade to PRO.` };
      }
    }

    // 🚀 4. VALIDATE AUTHENTICATION & WALLET CREDITS
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
