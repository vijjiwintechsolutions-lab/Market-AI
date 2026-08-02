import React from 'react';
import { Star, Zap, Bookmark, ArrowRight, Sparkles, Image as ImageIcon, Video, Code, Volume2, FileText } from 'lucide-react';
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
  const safePricing = tool.pricing || 'Free';

  const renderThumbnailIcon = () => {
    if (tool.outputType === 'image' || safeCategory === 'Image AI') return <ImageIcon className="w-6 h-6 text-indigo-400 animate-pulse" />;
    if (tool.outputType === 'video' || safeCategory === 'Video AI') return <Video className="w-6 h-6 text-emerald-400 animate-bounce" />;
    if (tool.outputType === 'code' || safeCategory === 'Coding & Dev') return <Code className="w-6 h-6 text-amber-400" />;
    if (tool.outputType === 'audio') return <Volume2 className="w-6 h-6 text-cyan-400" />;
    return <FileText className="w-6 h-6 text-rose-400" />;
  };

  return (
    <div className="bg-[#151517] border border-white/10 hover:border-indigo-500/60 rounded-xl overflow-hidden shadow-xl flex flex-col justify-between transition-all group relative font-mono">
      {/* ANIMATED THUMBNAIL BANNER TILE */}
      <div className="h-28 bg-gradient-to-r from-indigo-950 via-[#121218] to-slate-900 border-b border-white/10 p-3.5 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-indigo-600/10 rounded-full blur-xl group-hover:bg-indigo-600/30 transition-all" />
        
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-black/50 border border-white/10 rounded-lg backdrop-blur">
              {renderThumbnailIcon()}
            </div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-600/40 text-indigo-200 border border-indigo-500/50">
              {safeCategory}
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(tool.id);
            }}
            className={`p-1.5 rounded transition-colors z-10 cursor-pointer ${
              isFavorite ? 'bg-rose-500/20 text-rose-400' : 'text-slate-500 hover:text-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-rose-400' : ''}`} />
          </button>
        </div>

        {/* Dynamic Badge Tag */}
        <div className="flex items-center justify-between z-10">
          <span className="text-[10px] text-slate-400 font-bold truncate max-w-[180px]">
            {safeSubcategory}
          </span>
          {tool.badge && (
            <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 fill-amber-300" /> {tool.badge}
            </span>
          )}
        </div>
      </div>

      {/* CARD CONTENT */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors tracking-tight line-clamp-1">
            {safeName}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {safeDescription}
          </p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400" /> {tool.rating || 4.8}
          </span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <Zap className="w-3 h-3 fill-emerald-400" /> {safePricing}
          </span>
        </div>

        {/* ACTION BUTTON */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
          <button
            onClick={() => onToggleCompare(tool)}
            className={`px-2.5 py-1.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
              isCompared ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            VS
          </button>
          <button
            onClick={() => onRunTool(tool)}
            className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded shadow flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Run Tool</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
