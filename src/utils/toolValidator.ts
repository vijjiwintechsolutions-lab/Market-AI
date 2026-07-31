import { AITool, ToolInputParam } from '../types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateUploadedFile(file: File, tool: AITool): { valid: boolean; error?: string } {
  // 1. Max File Size Limit (50MB)
  const MAX_SIZE_BYTES = 50 * 1024 * 1024;
  if (file.size > MAX_SIZE_BYTES) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `File size limit exceeded: "${file.name}" is ${sizeMb} MB. Maximum allowed size is 50 MB.`
    };
  }

  // Extract file extension and MIME type
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const mimeType = file.type.toLowerCase();

  // 2. Check tool input parameter 'accept' constraint if defined
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

  // 3. Tool Category Specific Checks
  if (tool.category === 'Image AI') {
    const isImage = mimeType.startsWith('image/') || ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext);
    if (!isImage) {
      return {
        valid: false,
        error: `Unsupported file for Image AI: "${file.name}" is not an image file. Please upload PNG, JPG, WEBP, or SVG.`
      };
    }
  } else if (tool.category === 'Audio & Voice') {
    const isAudio = mimeType.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'aac', 'm4a', 'flac'].includes(ext);
    if (!isAudio) {
      return {
        valid: false,
        error: `Unsupported audio format: "${file.name}" is not an audio file. Supported formats: MP3, WAV, AAC, M4A, OGG.`
      };
    }
  } else if (tool.category === 'PDF & Documents') {
    const isDoc = mimeType.startsWith('text/') || mimeType.includes('pdf') || mimeType.includes('word') || ['pdf', 'docx', 'doc', 'txt', 'csv', 'json', 'md', 'rtf'].includes(ext);
    if (!isDoc) {
      return {
        valid: false,
        error: `Unsupported document format: "${file.name}". Supported formats: PDF, DOCX, TXT, CSV, JSON, MD.`
      };
    }
  }

  // 4. Check tool supportedFormats array if present
  if (tool.supportedFormats && tool.supportedFormats.length > 0) {
    const supportedUpper = tool.supportedFormats.map((f) => f.toUpperCase().replace('.', ''));
    const extUpper = ext.toUpperCase();
    const isMimeMatch = tool.supportedFormats.some((f) => mimeType.includes(f.toLowerCase()));

    // Document formats check: if tool is in PDF & Documents category or has a file input accepting documents/PDFs
    const isDocFile = ['PDF', 'DOCX', 'DOC', 'TXT', 'CSV', 'JSON', 'MD', 'RTF'].includes(extUpper);
    const isDocTool =
      tool.category === 'PDF & Documents' ||
      tool.inputs?.some((i) => i.type === 'file' && (!i.accept || i.accept.includes('pdf') || i.accept.includes('doc') || i.accept === '*/*'));

    if (!supportedUpper.includes(extUpper) && !isMimeMatch && !(isDocTool && isDocFile)) {
      // Allow general fallback if mime matches broad media category
      const broadAllowed =
        (tool.supportedFormats.some((f) => ['PNG', 'JPG', 'IMAGE'].includes(f.toUpperCase())) && mimeType.startsWith('image/')) ||
        (tool.supportedFormats.some((f) => ['MP3', 'WAV', 'AUDIO'].includes(f.toUpperCase())) && mimeType.startsWith('audio/')) ||
        (tool.supportedFormats.some((f) => ['MP4', 'VIDEO'].includes(f.toUpperCase())) && mimeType.startsWith('video/')) ||
        (tool.supportedFormats.some((f) => ['PDF', 'DOCX', 'TXT', 'MARKDOWN', 'TEXT', 'JSON', 'DOCUMENT'].includes(f.toUpperCase())) &&
          (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.startsWith('text/')));

      if (!broadAllowed) {
        return {
          valid: false,
          error: `Format ".${ext}" is not in supported list for "${tool.name}". Allowed formats: ${tool.supportedFormats.join(', ')}`,
        };
      }
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

  // Check required tool input parameters
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

  // Validate URL field if provided
  if (inputValues.sourceUrl && typeof inputValues.sourceUrl === 'string' && inputValues.sourceUrl.trim() !== '') {
    const url = inputValues.sourceUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      errors.push('Source Web URL must start with http:// or https://');
    }
  }

  // Validate File if uploaded
  if (uploadedFile) {
    const fileRes = validateUploadedFile(uploadedFile, tool);
    if (!fileRes.valid && fileRes.error) {
      errors.push(fileRes.error);
    }
  }

  // General check: if tool requires prompt or input and everything is completely blank
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
