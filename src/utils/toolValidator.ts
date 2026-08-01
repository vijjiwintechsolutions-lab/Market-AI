import { AITool } from '../types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateUploadedFile(file: File, tool: AITool): { valid: boolean; error?: string } {
  // Vercel Serverless Function Payload Limit is 4.5MB.
  // We limit uploads to 3.5MB to ensure safe Base64 transmission.
  const MAX_SIZE_BYTES = 3.5 * 1024 * 1024;
  if (file.size > MAX_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Payload Limit Warning: File size "${file.name}" is ${sizeMb} MB. Maximum allowed size for live server processing is 3.5 MB to prevent payload errors.`
    };
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const mimeType = file.type.toLowerCase();

  const fileParam = tool.inputs?.find((p) => p.type === 'file' && p.accept);
  if (fileParam && fileParam.accept && fileParam.accept !== '*/*') {
    const acceptTokens = fileParam.accept.split(',').map((s) => s.trim().toLowerCase());
    let isAccepted = false;
    for (const token of acceptTokens) {
      if (token.startsWith('.')) {
        if (`.${ext}` === token) isAccepted = true;
      } else if (token.endsWith('/*')) {
        const prefix = token.replace('/*', '');
        if (mimeType.startsWith(prefix)) isAccepted = true;
      } else if (token === mimeType) {
        isAccepted = true;
      }
    }
    if (!isAccepted) {
      return {
        valid: false,
        error: `Invalid file format for ${fileParam.name}: ".${ext}" is not accepted. Required formats: ${fileParam.accept}`
      };
    }
  }

  return { valid: true };
}

export function validateToolExecution(
  tool: AITool,
  inputValues: Record<string, any>,
  uploadedFile: File | null
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (tool.inputs && tool.inputs.length > 0) {
    for (const param of tool.inputs) {
      if (param.required) {
        const val = inputValues[param.id];
        if (param.type === 'file') {
          if (!uploadedFile && (!val || val === '')) {
            errors.push(`Required file parameter "${param.name}" is missing.`);
          }
        } else if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '')) {
          errors.push(`Required field "${param.name}" cannot be empty.`);
        }
      }
    }
  }

  if (inputValues.sourceUrl && typeof inputValues.sourceUrl === 'string' && inputValues.sourceUrl.trim() !== '') {
    const url = inputValues.sourceUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      errors.push('Source Web URL must start with http:// or https://');
    }
  }

  if (uploadedFile) {
    const fileRes = validateUploadedFile(uploadedFile, tool);
    if (!fileRes.valid && fileRes.error) {
      errors.push(fileRes.error);
    }
  }

  const hasTextIn = Object.values(inputValues).some((v) => typeof v === 'string' && v.trim() !== '');
  if (!uploadedFile && !hasTextIn && tool.inputs?.some((i) => i.type === 'text' || i.type === 'textarea')) {
    errors.push('Please enter a prompt or text input before executing.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
