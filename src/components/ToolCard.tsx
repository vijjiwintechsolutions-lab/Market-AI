import React from 'react';
import { Star, Zap, Bookmark, ArrowRight } from 'lucide-react';
import { AITool } from '../types';

interface ToolCardProps {
  tool: AITool;
  isFavorite: boolean;
  isCompared: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (tool: AITool) => void;
  onRunTool: (tool: AITool) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  isFavorite,
  isCompared,
  onToggleFavorite,
  onToggleCompare,
  onRunTool,
}) => {
  const safeName = tool.name || 'AI Tool';
  const safeDescription = tool.description || 'Enterprise AI Tool Execution Engine';
  const safeCategory = tool.category || 'General AI';
  const safeSubcategory = tool.subcategory || 'General';
  const safeProvider = tool.provider || 'Neural Engine';
  const safeModelUsed = tool.modelUsed || 'standard-model';
  const safePricing = tool.pricing || 'Free';

  return (
    <div className="bg-[#151517] border border-white/10 hover:border-indigo-500/50 rounded-xl p-5 shadow-xl flex flex-col justify-between transition-all group relative overflow-hidden font-mono">
      <div className="space-y-3">
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">
              {(safeCategory || '').slice(0, 20)}
            </span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/10">
              {(safeSubcategory || '').slice(0, 20)}
            </span>
            {tool.badge && (
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {(tool.badge || '').slice(0, 15)}
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(tool.id);
            }}
            className={`p-1.5 rounded transition-colors cursor-pointer ${
              isFavorite ? 'bg-rose-500/20 text-rose-400' : 'text-slate-500 hover:text-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-rose-400' : ''}`} />
          </button>
        </div>

        {/* Title and Description */}
        <div>
          <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors tracking-tight">
            {(safeName || '').slice(0, 50)}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {(safeDescription || '').slice(0, 140)}
          </p>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
          <span className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400" /> {tool.rating || 4.8}
          </span>
          <span className="truncate">Provider: <strong className="text-slate-200">{(safeProvider || '').slice(0, 15)}</strong></span>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-xs text-green-400 font-bold">
          <Zap className="w-3.5 h-3.5 fill-green-400" />
          <span>{safePricing}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleCompare(tool)}
            className={`px-2.5 py-1.5 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
              isCompared ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            VS
          </button>
          <button
            onClick={() => onRunTool(tool)}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded shadow flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Run Tool</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
