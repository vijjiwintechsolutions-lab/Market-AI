import React from 'react';
import { 
  Loader2, 
  Cpu, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Globe, 
  Zap, 
  Layers, 
  ShieldCheck,
  FileCode
} from 'lucide-react';
import { AITool } from '../types';

interface AIProcessingStateProps {
  tool: AITool;
  currentStep: string;
  progressPercent: number;
  elapsedSec: number;
  uploadedFile: File | null;
  inputValues: Record<string, any>;
  formatFileSize?: (bytes: number) => string;
}

export const AIProcessingState: React.FC<AIProcessingStateProps> = ({
  tool,
  currentStep,
  progressPercent,
  elapsedSec,
  uploadedFile,
  inputValues,
  formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}) => {
  const promptText = inputValues.prompt || inputValues.text || inputValues.documentText || '';
  const promptCharLength = typeof promptText === 'string' ? promptText.length : 0;
  const sourceUrl = inputValues.sourceUrl;

  return (
    <div className="p-6 bg-[#0D0D11] border border-indigo-500/40 rounded-2xl space-y-5 font-mono shadow-2xl relative overflow-hidden animate-fadeIn my-auto">
      {/* Background Animated Gradient Orbs */}
      <div className="absolute -right-24 -top-24 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -left-24 -bottom-24 w-64 h-64 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Top Engine Banner */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 pb-3 gap-2">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center shrink-0">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-inner">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                Gemini API Neural Pipeline
              </h4>
              <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-300 text-[10px] rounded-md border border-emerald-500/30 font-bold">
                HIGH SPEED PIPELINE ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 font-sans">{currentStep || 'Processing request via Gemini API...'}</p>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 text-sm font-black text-indigo-400">
            <Zap className="w-4 h-4 fill-indigo-400 animate-bounce" />
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <p className="text-[10px] text-slate-500 font-bold uppercase">{elapsedSec.toFixed(1)}s elapsed</p>
        </div>
      </div>

      {/* Main Animated Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full h-3 bg-slate-950 border border-slate-800 rounded-full overflow-hidden p-0.5 relative shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-indigo-600 via-purple-500 to-emerald-400 rounded-full transition-all duration-300 relative shadow-lg"
            style={{ width: `${Math.min(100, Math.max(6, progressPercent))}%` }}
          >
            {/* Shimmer light sweep */}
            <div className="absolute inset-0 bg-white/25 animate-pulse rounded-full" />
          </div>
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          <span>Payload Ingest</span>
          <span className="text-indigo-400 animate-pulse">Inference Processing</span>
          <span>Output Stream</span>
        </div>
      </div>

      {/* Payload Attachment Detail Card (When Files or Large Inputs are Present) */}
      {(uploadedFile || promptCharLength > 0 || sourceUrl) && (
        <div className="p-3 bg-slate-950/90 border border-slate-800 rounded-xl flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3 min-w-0">
            {uploadedFile ? (
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
            ) : sourceUrl ? (
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                <Globe className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
            )}

            <div className="min-w-0">
              <p className="text-xs text-slate-200 font-bold truncate">
                {uploadedFile 
                  ? `File: ${uploadedFile.name}` 
                  : sourceUrl 
                  ? `Source Address: ${sourceUrl}` 
                  : `Prompt Payload (${promptCharLength} chars)`
                }
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {uploadedFile 
                  ? `${formatFileSize(uploadedFile.size)} • Multimodal Vision & OCR Extracted` 
                  : sourceUrl 
                  ? 'Connecting live endpoint & scraping payload'
                  : 'Token embeddings optimized for Gemini high-speed inference'
                }
              </p>
            </div>
          </div>

          <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] rounded-lg border border-emerald-500/20 font-bold shrink-0 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Context Active
          </span>
        </div>
      )}

      {/* Pipeline 4-Stage Step Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
        <div className={`p-2.5 rounded-xl border flex items-center gap-1.5 transition-colors ${
          progressPercent >= 15 ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200' : 'bg-slate-950/60 border-slate-800 text-slate-500'
        }`}>
          {progressPercent >= 25 ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400 shrink-0" />
          )}
          <span className="truncate font-semibold">1. Validate</span>
        </div>

        <div className={`p-2.5 rounded-xl border flex items-center gap-1.5 transition-colors ${
          progressPercent >= 30 ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200' : 'bg-slate-950/60 border-slate-800 text-slate-500'
        }`}>
          {progressPercent >= 55 ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : progressPercent >= 25 ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400 shrink-0" />
          ) : (
            <span className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0" />
          )}
          <span className="truncate font-semibold">2. Parse & OCR</span>
        </div>

        <div className={`p-2.5 rounded-xl border flex items-center gap-1.5 transition-colors ${
          progressPercent >= 55 ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200' : 'bg-slate-950/60 border-slate-800 text-slate-500'
        }`}>
          {progressPercent >= 88 ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : progressPercent >= 55 ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400 shrink-0" />
          ) : (
            <span className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0" />
          )}
          <span className="truncate font-semibold">3. AI Inference</span>
        </div>

        <div className={`p-2.5 rounded-xl border flex items-center gap-1.5 transition-colors ${
          progressPercent >= 88 ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-200' : 'bg-slate-950/60 border-slate-800 text-slate-500'
        }`}>
          {progressPercent >= 99 ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          ) : progressPercent >= 88 ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400 shrink-0" />
          ) : (
            <span className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0" />
          )}
          <span className="truncate font-semibold">4. Deliver Output</span>
        </div>
      </div>
    </div>
  );
};
