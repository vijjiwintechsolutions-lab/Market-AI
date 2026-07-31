/**
 * Client-Side File Detection Utility
 * Identifies the mime-type & structure of an uploaded file and provides automated
 * tooltip suggestions for the optimal AI tool category.
 */

export interface FileDetectionResult {
  mimeType: string;
  fileExtension: string;
  detectedFormat: string;
  category: 'PDF & Documents' | 'Image AI' | 'Audio & Voice' | 'Video AI' | 'Coding & Dev' | 'General AI';
  categoryColor: string;
  recommendationReason: string;
  suggestedActionTooltip: string;
  suggestedToolsKeywords: string[];
  isMatchForCurrentTool: boolean;
  formattedFileSize: string;
}

/**
 * Formats bytes to human-readable string
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Detects MIME type, extension, and optimal AI tool category for any uploaded file.
 */
export function detectFileTypeAndCategory(
  file: File,
  currentToolCategory?: string
): FileDetectionResult {
  const name = file.name || '';
  const ext = name.split('.').pop()?.toLowerCase() || '';
  const rawMime = file.type || '';
  const formattedSize = formatBytes(file.size);

  let mimeType = rawMime;
  let detectedFormat = ext.toUpperCase() + ' File';
  let category: FileDetectionResult['category'] = 'General AI';
  let categoryColor = 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
  let recommendationReason = 'General file attachment ready for AI analysis.';
  let suggestedActionTooltip = 'This file can be processed by multi-modal AI models.';
  let suggestedToolsKeywords = ['Analysis', 'Multi-modal'];

  // PDF & Document formats
  if (
    ext === 'pdf' ||
    rawMime.includes('pdf') ||
    ext === 'docx' ||
    ext === 'doc' ||
    ext === 'txt' ||
    ext === 'rtf' ||
    ext === 'csv' ||
    ext === 'xlsx' ||
    ext === 'pptx' ||
    ext === 'epub' ||
    ext === 'md' ||
    rawMime.includes('document') ||
    rawMime.includes('spreadsheet') ||
    rawMime.includes('presentation')
  ) {
    category = 'PDF & Documents';
    categoryColor = 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    if (ext === 'pdf' || rawMime.includes('pdf')) {
      mimeType = 'application/pdf';
      detectedFormat = 'Adobe PDF Document (.pdf)';
      recommendationReason = 'Optimal for OCR Text Extraction, Document Q&A Chat, and Executive Summarization.';
      suggestedActionTooltip = 'Best matched with PDF & Documents tools like Paper Chat 61 or OCR Extractor.';
      suggestedToolsKeywords = ['PDF Chat', 'OCR', 'Summarizer', 'Document AI'];
    } else if (ext === 'docx' || ext === 'doc') {
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
      detectedFormat = 'Microsoft Word Document (.docx)';
      recommendationReason = 'Optimal for Document Formatting, Essay Proofreading, and Content Rephrasing.';
      suggestedActionTooltip = 'Best matched with Document AI tools.';
      suggestedToolsKeywords = ['Doc Parser', 'Proofreader', 'Summarizer'];
    } else if (ext === 'csv' || ext === 'xlsx') {
      mimeType = ext === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      detectedFormat = `Data Spreadsheet (.${ext})`;
      recommendationReason = 'Optimal for Data Analysis, CSV Insights, and Spreadsheet Charting.';
      suggestedActionTooltip = 'Best matched with Data & Document AI tools.';
      suggestedToolsKeywords = ['Data Analyzer', 'CSV Assistant', 'Chart Generator'];
    } else {
      mimeType = rawMime || 'text/plain';
      detectedFormat = `Text Document (.${ext})`;
      recommendationReason = 'Optimal for Text Extraction, Translation, and Summarization.';
      suggestedActionTooltip = 'Best matched with PDF & Documents tools.';
      suggestedToolsKeywords = ['Text Analyzer', 'Summarizer'];
    }
  }
  // Image AI formats
  else if (
    ext === 'png' ||
    ext === 'jpg' ||
    ext === 'jpeg' ||
    ext === 'webp' ||
    ext === 'svg' ||
    ext === 'gif' ||
    ext === 'bmp' ||
    ext === 'heic' ||
    rawMime.startsWith('image/')
  ) {
    category = 'Image AI';
    categoryColor = 'text-purple-400 bg-purple-500/10 border-purple-500/30';
    mimeType = rawMime || `image/${ext}`;
    detectedFormat = `Raster/Vector Image (${ext.toUpperCase()})`;
    recommendationReason = 'Optimal for AI Background Removal, Subject Isolation, Upscaling, and Image Editing.';
    suggestedActionTooltip = 'Best matched with Image AI tools like AI Background Remover & Eraser or Super-Resolution.';
    suggestedToolsKeywords = ['Background Remover', 'Upscaler', 'Image Generator', 'Vision AI'];
  }
  // Audio & Voice formats
  else if (
    ext === 'mp3' ||
    ext === 'wav' ||
    ext === 'm4a' ||
    ext === 'ogg' ||
    ext === 'aac' ||
    ext === 'flac' ||
    rawMime.startsWith('audio/')
  ) {
    category = 'Audio & Voice';
    categoryColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    mimeType = rawMime || `audio/${ext}`;
    detectedFormat = `Audio Recording (${ext.toUpperCase()})`;
    recommendationReason = 'Optimal for Speech-to-Text Transcription, Voice Cloning, and Noise Removal.';
    suggestedActionTooltip = 'Best matched with Audio & Voice AI tools like Whisper Speech Transcriber.';
    suggestedToolsKeywords = ['Transcriber', 'Voice AI', 'Audio Noise Eraser'];
  }
  // Video AI formats
  else if (
    ext === 'mp4' ||
    ext === 'webm' ||
    ext === 'mov' ||
    ext === 'avi' ||
    ext === 'mkv' ||
    rawMime.startsWith('video/')
  ) {
    category = 'Video AI';
    categoryColor = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    mimeType = rawMime || `video/${ext}`;
    detectedFormat = `Video Stream (${ext.toUpperCase()})`;
    recommendationReason = 'Optimal for Video Summarization, AI Subtitle Generation, and Frame Interpolation.';
    suggestedActionTooltip = 'Best matched with Video AI tools.';
    suggestedToolsKeywords = ['Video Summarizer', 'Subtitles', 'Motion AI'];
  }
  // Coding & Dev formats
  else if (
    ext === 'ts' ||
    ext === 'js' ||
    ext === 'tsx' ||
    ext === 'jsx' ||
    ext === 'py' ||
    ext === 'java' ||
    ext === 'cpp' ||
    ext === 'c' ||
    ext === 'cs' ||
    ext === 'go' ||
    ext === 'rs' ||
    ext === 'html' ||
    ext === 'css' ||
    ext === 'sql' ||
    ext === 'json'
  ) {
    category = 'Coding & Dev';
    categoryColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    mimeType = rawMime || 'text/plain';
    detectedFormat = `Source Code File (.${ext})`;
    recommendationReason = 'Optimal for Code Refactoring, Bug Auditing, and Automated Unit Testing.';
    suggestedActionTooltip = 'Best matched with Coding & Dev AI tools like Code Refactor & Optimizer.';
    suggestedToolsKeywords = ['Code Auditor', 'Refactoring', 'Unit Test Generator'];
  }

  const isMatchForCurrentTool = currentToolCategory
    ? currentToolCategory.toLowerCase() === category.toLowerCase()
    : true;

  return {
    mimeType,
    fileExtension: ext,
    detectedFormat,
    category,
    categoryColor,
    recommendationReason,
    suggestedActionTooltip,
    suggestedToolsKeywords,
    isMatchForCurrentTool,
    formattedFileSize: formattedSize,
  };
}
