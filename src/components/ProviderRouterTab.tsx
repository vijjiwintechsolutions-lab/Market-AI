import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Activity, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw, 
  ArrowRightLeft, 
  Server, 
  Clock,
  Sliders
} from 'lucide-react';
import { ProviderStatus } from '../types';
import { PROVIDERS_STATUS_DATA } from '../data/promptsData';
import { getLatencySettings } from '../utils/latencySettings';

interface ProviderRouterTabProps {
  onOpenLatencySettings?: () => void;
}

export const ProviderRouterTab: React.FC<ProviderRouterTabProps> = ({ onOpenLatencySettings }) => {
  const [providers, setProviders] = useState<ProviderStatus[]>(PROVIDERS_STATUS_DATA);
  const [isPinging, setIsPinging] = useState(false);
  const [lastPingTime, setLastPingTime] = useState<string>('Just now');
  const [currentThreshold, setCurrentThreshold] = useState<number>(() => getLatencySettings().thresholdMs);

  useEffect(() => {
    const handleSettingsChange = () => {
      setCurrentThreshold(getLatencySettings().thresholdMs);
    };
    window.addEventListener('latency-settings-changed', handleSettingsChange);
    return () => window.removeEventListener('latency-settings-changed', handleSettingsChange);
  }, []);

  const fetchProviderStatus = async () => {
    setIsPinging(true);
    try {
      const res = await fetch('/api/providers/status');
      if (res.ok) {
        const data = await res.json();
        setProviders(data);
        setLastPingTime(new Date().toLocaleTimeString());
      }
    } catch (e) {
      console.warn('Failed to refresh providers:', e);
    } finally {
      setIsPinging(false);
    }
  };

  useEffect(() => {
    fetchProviderStatus();
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white font-sans">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" /> Live AI Provider Router
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Real-Time Network Latency & Provider Health
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Market1 AI automatically routes requests to the fastest, healthiest available model provider with instant failover retry logic.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchProviderStatus}
            disabled={isPinging}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg flex items-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isPinging ? 'animate-spin' : ''}`} />
            <span>Ping All Providers</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">6 / 6 Online</p>
            <p className="text-xs text-slate-400">All Providers Operational</p>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">145ms</p>
            <p className="text-xs text-slate-400">Average Global Latency</p>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-white">99.98%</p>
            <p className="text-xs text-slate-400">Success Rate SLA</p>
          </div>
        </div>
      </div>

      {/* Power User Latency Settings Banner */}
      <div className="bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-white text-sm">Power User Runtime Latency Alerts</h4>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30 font-bold uppercase">
                Active Threshold: {currentThreshold}ms
              </span>
            </div>
            <p className="text-xs text-slate-300 font-sans">
              Triggers a browser toast alert whenever your selected provider response latency exceeds your defined target during tool executions.
            </p>
          </div>
        </div>

        {onOpenLatencySettings && (
          <button
            onClick={onOpenLatencySettings}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow flex items-center gap-2 transition-all cursor-pointer shrink-0 font-mono"
          >
            <Sliders className="w-3.5 h-3.5 text-indigo-300" />
            <span>Configure Latency Settings</span>
          </button>
        )}
      </div>

      {/* Provider Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm font-semibold text-slate-300">
          <span>Active Provider Status Table</span>
          <span className="text-xs text-slate-500 font-mono">Last refreshed: {lastPingTime}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {providers.map((prov) => (
            <div
              key={prov.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 space-y-4 transition-all"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">{prov.name}</h3>
                  <span className="text-xs text-slate-400">{prov.tier}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {prov.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-500 block">Latency</span>
                  <span className="text-emerald-400 font-mono font-bold text-sm flex items-center gap-1 mt-0.5">
                    <Zap className="w-3.5 h-3.5" /> {prov.latencyMs}ms
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">Success Rate</span>
                  <span className="text-slate-200 font-mono font-bold text-sm mt-0.5 block">
                    {prov.successRate}%
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">Available Models</span>
                  <span className="text-slate-200 font-mono font-bold text-sm mt-0.5 block">
                    {prov.modelsAvailable} Models
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">Queue Time</span>
                  <span className="text-slate-200 font-mono font-bold text-sm mt-0.5 block">
                    {prov.queueTimeSec}s
                  </span>
                </div>
              </div>

              {/* Progress bar representing latency score */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Performance Score</span>
                  <span className="text-slate-300 font-mono">Optimal</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-indigo-500 rounded-full"
                    style={{ width: `${Math.max(20, 100 - prov.latencyMs / 6)}%` }}
                  ></div>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Failover Strategy Architecture Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-bold text-lg text-white flex items-center gap-2">
          <ArrowRightLeft className="w-5 h-5 text-emerald-400" />
          Universal Failover Routing Logic
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <p className="font-bold text-emerald-400">1. Health Check</p>
            <p className="text-slate-400">Pings providers every 10s to verify API latency & HTTP availability.</p>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <p className="font-bold text-indigo-400">2. Smart Model Match</p>
            <p className="text-slate-400">Selects model based on task complexity, format, and user parameters.</p>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <p className="font-bold text-amber-400">3. Auto Failover</p>
            <p className="text-slate-400">If Primary fails or exceeds rate limit, automatically switches to secondary provider.</p>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
            <p className="font-bold text-teal-400">4. Output Delivery</p>
            <p className="text-slate-400">Validates JSON/media output integrity before rendering to user interface.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
