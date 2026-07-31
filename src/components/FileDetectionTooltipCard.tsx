import React, { useState } from 'react';
import { detectFileTypeAndCategory, FileDetectionResult } from '../utils/fileTypeDetector';
import { FileCheck, Sparkles, Info, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface FileDetectionTooltipCardProps {
  file: File;
  currentToolCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export const FileDetectionTooltipCard: React.FC<FileDetectionTooltipCardProps> = ({
  file,
  currentToolCategory,
  onSelectCategory,
}) => {
  const [showTooltipInfo, setShowTooltipInfo] = useState(false);
  const detection: FileDetectionResult = detectFileTypeAndCategory(file, currentToolCategory);

  return (
    <div className="mt-2.5 p-3 bg-[#0D0E12] border border-white/10 rounded-lg space-y-2.5 font-mono shadow-xl transition-all">
      {/* Header: Detected Format & MIME Type */}
      <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
        <div className="flex items-center gap-1.5 min-w-0">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 animate-pulse" />
          <span className="font-bold text-slate-200 truncate">{detection.detectedFormat}</span>
          <span className="text-[10px] text-slate-500 shrink-0">({detection.formattedFileSize})</span>
        </div>
        <span className="px-2 py-0.5 text-[10px] bg-slate-900 text-slate-400 border border-slate-800 rounded">
          {detection.mimeType}
        </span>
      </div>

      {/* Suggested Category Badge & Tooltip Trigger */}
      <div className="p-2 bg-slate-950/80 border border-white/5 rounded-md flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400 font-medium">Recommended AI Category:</span>
          <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${detection.categoryColor}`}>
            {detection.category}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowTooltipInfo(!showTooltipInfo)}
          className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
          title="Click to view automated AI tool matching suggestions"
        >
          <Info className="w-3 h-3" />
          <span>{showTooltipInfo ? 'Hide Suggestion' : 'Why this tool?'}</span>
        </button>
      </div>

      {/* Match Status Banner */}
      <div className="flex items-center gap-1.5 text-[11px]">
        {detection.isMatchForCurrentTool ? (
          <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 w-full">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span className="font-medium text-[10px]">
              Perfect Match! Uploaded file fits this tool's category ({detection.category}).
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-1.5 text-amber-300 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 w-full flex-wrap">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span className="font-medium text-[10px]">
                Suggested Category: <strong className="underline">{detection.category}</strong>
              </span>
            </div>
            {onSelectCategory && (
              <button
                type="button"
                onClick={() => onSelectCategory(detection.category)}
                className="text-[9px] px-1.5 py-0.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold rounded border border-amber-500/30 cursor-pointer"
              >
                Filter {detection.category} Tools
              </button>
            )}
          </div>
        )}
      </div>

      {/* Detailed Automated Suggestion / Tooltip Box */}
      {(showTooltipInfo || !detection.isMatchForCurrentTool) && (
        <div className="p-2.5 bg-indigo-950/40 border border-indigo-500/30 rounded text-[10px] text-indigo-200 space-y-1.5 animate-fadeIn">
          <p className="leading-relaxed">
            <strong className="text-white">AI Assistant Suggestion:</strong> {detection.recommendationReason}
          </p>
          <p className="text-slate-400 italic text-[9.5px]">{detection.suggestedActionTooltip}</p>

          <div className="pt-1 flex items-center gap-1 flex-wrap">
            <span className="text-[9px] text-slate-400">Key AI Capabilities:</span>
            {detection.suggestedToolsKeywords.map((kw) => (
              <span
                key={kw}
                className="px-1.5 py-0.2 text-[9px] bg-white/5 text-indigo-300 rounded border border-white/10"
              >
                #{kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
