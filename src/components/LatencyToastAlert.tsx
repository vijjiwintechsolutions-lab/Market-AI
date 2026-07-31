import React, { useEffect } from 'react';
import { Zap, AlertTriangle, Sliders, X, ArrowRight, Gauge, Cpu } from 'lucide-react';

interface LatencyToastAlertProps {
  provider: string;
  toolName: string;
  latencyMs: number;
  thresholdMs: number;
  onDismiss: () => void;
  onOpenSettings: () => void;
  autoDismissMs?: number;
}

export const LatencyToastAlert: React.FC<LatencyToastAlertProps> = ({
  provider,
  toolName,
  latencyMs,
  thresholdMs,
  onDismiss,
  onOpenSettings,
  autoDismissMs = 12000,
}) => {
  useEffect(() => {
    if (autoDismissMs > 0) {
      const timer = setTimeout(() => {
        onDismiss();
      }, autoDismissMs);
      return () => clearTimeout(timer);
    }
  }, [autoDismissMs, onDismiss]);

  const excessMs = Math.max(0, latencyMs - thresholdMs);
  const percentageOver = Math.round((excessMs / thresholdMs) * 100);

  return (
    <div className="p-4 rounded-xl border border-amber-500/50 bg-gradient-to-r from-amber-950/95 via-slate-900/95 to-slate-950 shadow-2xl space-y-3 font-mono text-xs animate-fadeIn relative overflow-hidden my-3 text-amber-100 backdrop-blur-xl">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 animate-pulse" />

      <div className="flex items-start justify-between gap-3 pt-1">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0 mt-0.5">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>

          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold uppercase tracking-wider text-[11px] text-amber-300 flex items-center gap-1 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                High Provider Latency Alert
              </span>
              <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                Threshold: {thresholdMs}ms
              </span>
            </div>

            <p className="text-slate-200 font-sans text-xs leading-relaxed">
              Execution for <strong className="text-white">{toolName}</strong> via <strong className="text-indigo-300">{provider}</strong> took{' '}
              <strong className="text-amber-300">{latencyMs.toLocaleString()} ms</strong>, exceeding your target threshold of{' '}
              <strong className="text-slate-300">{thresholdMs.toLocaleString()} ms</strong> by <span className="text-rose-400 font-bold">+{excessMs} ms ({percentageOver}%)</span>.
            </p>

            <div className="p-2 rounded bg-black/40 border border-white/5 text-[11px] text-slate-300 font-mono flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-amber-200/90 truncate">
                <Gauge className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">Tip: Auto-router rebalancing or switching providers can lower latency.</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-white p-1 hover:bg-white/10 rounded-lg transition-colors shrink-0 cursor-pointer"
          title="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Footer Action Bar */}
      <div className="pt-1 flex items-center justify-between border-t border-white/10 gap-2">
        <button
          type="button"
          onClick={onOpenSettings}
          className="text-[11px] font-bold text-indigo-300 hover:text-indigo-200 flex items-center gap-1.5 hover:underline transition-all cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5 text-indigo-400" />
          <span>Configure Latency Notification Settings</span>
        </button>

        <button
          type="button"
          onClick={onDismiss}
          className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold rounded border border-amber-500/40 text-[10px] transition-colors cursor-pointer"
        >
          Acknowledge
        </button>
      </div>
    </div>
  );
};
