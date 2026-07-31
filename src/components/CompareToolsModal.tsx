import React from 'react';
import { X, Star, Zap, ShieldCheck, Check, Play, Cpu, ArrowUpRight } from 'lucide-react';
import { AITool } from '../types';

interface CompareToolsModalProps {
  comparedTools: AITool[];
  onRemoveTool: (toolId: string) => void;
  onClearAll: () => void;
  onClose: () => void;
  onRunTool: (tool: AITool) => void;
}

export const CompareToolsModal: React.FC<CompareToolsModalProps> = ({
  comparedTools,
  onRemoveTool,
  onClearAll,
  onClose,
  onRunTool,
}) => {
  if (comparedTools.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto text-white p-6 space-y-6 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
              Side-by-Side AI Tool Comparison Matrix
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Comparing {comparedTools.length} selected AI tools on latency, ratings, parameters, and providers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium hover:underline"
            >
              Clear Comparison
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="p-3 w-40 font-semibold bg-slate-950/60">Feature</th>
                {comparedTools.map((t) => (
                  <th key={t.id} className="p-3 font-bold text-white min-w-[220px] relative">
                    <div className="flex items-center justify-between">
                      <span className="text-base text-emerald-400 line-clamp-1">{t.name}</span>
                      <button
                        onClick={() => onRemoveTool(t.id)}
                        className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-[11px] font-normal text-slate-400 block">{t.category}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {/* Category & Subcategory */}
              <tr>
                <td className="p-3 font-semibold text-slate-400 bg-slate-950/40">Category</td>
                {comparedTools.map((t) => (
                  <td key={t.id} className="p-3 text-slate-200">{t.category} ({t.subcategory})</td>
                ))}
              </tr>

              {/* User Rating */}
              <tr>
                <td className="p-3 font-semibold text-slate-400 bg-slate-950/40">User Rating</td>
                {comparedTools.map((t) => (
                  <td key={t.id} className="p-3">
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-4 h-4 fill-amber-400" />
                      <span>{t.rating}</span>
                      <span className="text-slate-500 font-normal">({t.reviewCount} reviews)</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Real-time Latency */}
              <tr>
                <td className="p-3 font-semibold text-slate-400 bg-slate-950/40">Latency SLA</td>
                {comparedTools.map((t) => (
                  <td key={t.id} className="p-3 font-mono font-bold text-emerald-400 flex items-center gap-1">
                    <Zap className="w-4 h-4" /> {t.latencyMs}ms
                  </td>
                ))}
              </tr>

              {/* Uptime Guarantee */}
              <tr>
                <td className="p-3 font-semibold text-slate-400 bg-slate-950/40">Network Uptime</td>
                {comparedTools.map((t) => (
                  <td key={t.id} className="p-3 text-teal-400 font-mono font-semibold">
                    {t.uptimePercent}%
                  </td>
                ))}
              </tr>

              {/* High Speed Routing Node */}
              <tr>
                <td className="p-3 font-semibold text-slate-400 bg-slate-950/40">Execution Node</td>
                {comparedTools.map((t) => (
                  <td key={t.id} className="p-3 text-slate-200 font-mono text-xs">
                    Verified Gateway <span className="text-emerald-400 font-bold">({t.latencyMs}ms SLA)</span>
                  </td>
                ))}
              </tr>

              {/* Pricing Tier */}
              <tr>
                <td className="p-3 font-semibold text-slate-400 bg-slate-950/40">Pricing Model</td>
                {comparedTools.map((t) => (
                  <td key={t.id} className="p-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold">
                      {t.pricing}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Supported Output Formats */}
              <tr>
                <td className="p-3 font-semibold text-slate-400 bg-slate-950/40">Output Type</td>
                {comparedTools.map((t) => (
                  <td key={t.id} className="p-3 text-slate-200 capitalize font-mono">
                    {t.outputType} ({t.supportedFormats.join(', ')})
                  </td>
                ))}
              </tr>

              {/* Run Tool Button */}
              <tr>
                <td className="p-3 font-semibold text-slate-400 bg-slate-950/40">Action</td>
                {comparedTools.map((t) => (
                  <td key={t.id} className="p-3">
                    <button
                      onClick={() => {
                        onClose();
                        onRunTool(t);
                      }}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Launch Tool</span>
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
