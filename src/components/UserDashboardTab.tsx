import React, { useState } from 'react';
import { 
  History, 
  Heart, 
  Sparkles, 
  Trash2, 
  Download, 
  Copy, 
  Check, 
  Play, 
  Zap, 
  Clock, 
  Star 
} from 'lucide-react';
import { AITool, ExecutionHistoryItem } from '../types';

interface UserDashboardTabProps {
  favorites: AITool[];
  history: ExecutionHistoryItem[];
  onRunTool: (tool: AITool) => void;
  onRemoveFavorite: (toolId: string) => void;
  onClearHistory: () => void;
}

export const UserDashboardTab: React.FC<UserDashboardTabProps> = ({
  favorites,
  history,
  onRunTool,
  onRemoveFavorite,
  onClearHistory,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'favorites' | 'history'>('favorites');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white font-sans">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
            <History className="w-3.5 h-3.5" /> User Workspace & Saved Favorites
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>Firebase Cloud Storage Enabled</span>
          </div>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Saved Tools & Real-Time Execution History
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
          Access your favorited AI tools, previous generation logs, download links, and execution timing details.
        </p>

        {/* Sub-tab Toggles */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => setActiveSubTab('favorites')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'favorites'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-md'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4 fill-rose-400 text-rose-400" />
            <span>Saved Tools ({favorites.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'history'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-md'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4 text-teal-400" />
            <span>Execution History ({history.length})</span>
          </button>
        </div>
      </div>

      {/* Sub-tab 1: SAVED FAVORITES */}
      {activeSubTab === 'favorites' && (
        <div className="space-y-4">
          {favorites.length === 0 ? (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 space-y-3">
              <Heart className="w-10 h-10 mx-auto opacity-30 text-rose-400" />
              <p className="text-base font-semibold">No favorited tools yet.</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click the heart icon on any tool card in the marketplace to save it here for instant access!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map((tool) => (
                <div
                  key={tool.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-white text-base">{tool.name}</h3>
                      <button
                        onClick={() => onRemoveFavorite(tool.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                        title="Remove from favorites"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{tool.description}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <span>{tool.subcategory}</span> • <span className="text-emerald-400 font-bold">{tool.latencyMs}ms</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onRunTool(tool)}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" /> Launch Tool Live
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sub-tab 2: EXECUTION HISTORY LOG */}
      {activeSubTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">
              Showing recent execution logs saved in your session
            </span>
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs text-rose-400 hover:underline font-semibold flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear History Log
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 space-y-3">
              <Clock className="w-10 h-10 mx-auto opacity-30 text-teal-400" />
              <p className="text-base font-semibold">No history logs recorded yet.</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Run any AI tool in the live studio playground to generate output history logs here!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-emerald-400">{item.toolName}</span>
                      <span className="text-slate-500 font-mono">• {item.timestamp}</span>
                    </div>
                    <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> {item.executionTimeMs}ms
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Prompt:</span>
                    <p className="text-xs text-slate-200 font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      {item.prompt}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Generated Output:</span>
                    
                    {item.outputUrl ? (
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                        <a
                          href={item.outputUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-emerald-400 underline font-mono break-all flex items-center gap-1"
                        >
                          <Download className="w-3.5 h-3.5" /> Open / Download Asset
                        </a>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800 whitespace-pre-wrap max-h-40 overflow-y-auto">
                        {item.output}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleCopy(item.id, item.output)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
                    >
                      {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === item.id ? 'Copied!' : 'Copy Output'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
