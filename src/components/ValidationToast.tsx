import React, { useEffect } from 'react';
import { AlertTriangle, XCircle, X, ShieldAlert, CheckCircle } from 'lucide-react';

interface ValidationToastProps {
  type: 'error' | 'warning' | 'success';
  title?: string;
  message: string;
  details?: string[];
  onDismiss: () => void;
  autoDismissMs?: number;
}

export const ValidationToast: React.FC<ValidationToastProps> = ({
  type,
  title = 'Validation Alert',
  message,
  details,
  onDismiss,
  autoDismissMs = 8000
}) => {
  useEffect(() => {
    if (autoDismissMs > 0) {
      const timer = setTimeout(() => {
        onDismiss();
      }, autoDismissMs);
      return () => clearTimeout(timer);
    }
  }, [autoDismissMs, onDismiss]);

  const bgStyles =
    type === 'error'
      ? 'bg-rose-950/90 border-rose-500/50 text-rose-200'
      : type === 'warning'
      ? 'bg-amber-950/90 border-amber-500/50 text-amber-200'
      : 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200';

  const iconColor =
    type === 'error' ? 'text-rose-400' : type === 'warning' ? 'text-amber-400' : 'text-emerald-400';

  return (
    <div className={`p-4 rounded-xl border ${bgStyles} shadow-2xl space-y-2 font-mono text-xs animate-fadeIn relative overflow-hidden my-3`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className={`p-1.5 rounded-lg bg-black/40 border border-white/10 shrink-0 ${iconColor}`}>
            {type === 'error' ? (
              <XCircle className="w-5 h-5" />
            ) : type === 'warning' ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
          </div>
          <div>
            <h5 className="font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <ShieldAlert className={`w-3.5 h-3.5 ${iconColor}`} />
              {title}
            </h5>
            <p className="mt-1 leading-relaxed text-slate-100 font-sans text-xs">{message}</p>

            {details && details.length > 0 && (
              <ul className="mt-2 space-y-1 font-mono text-[11px] list-disc list-inside text-rose-300/90 bg-black/30 p-2 rounded border border-white/5">
                {details.map((detail, idx) => (
                  <li key={idx}>{detail}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-white p-1 hover:bg-white/10 rounded transition-colors shrink-0 cursor-pointer"
          title="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
