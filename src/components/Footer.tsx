import React from 'react';
import { Sparkles, ShieldCheck, Cpu, Heart, Activity } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0F0F0F] border-t border-white/10 text-slate-400 text-xs font-sans">
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-8 py-10 px-4 sm:px-6 lg:px-8">
        
        {/* Brand info */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded-sm flex items-center justify-center text-white font-bold text-xs">
              N
            </div>
            <span className="font-extrabold text-base text-white tracking-tighter">
              NEURAL<span className="text-indigo-400">.MARKET</span>
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed font-mono">
            High-density AI marketplace & provider router. Monitoring 800+ entities with real-time latency SLAs.
          </p>
          <div className="flex items-center gap-2 text-[10px] text-green-400 font-mono pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_#10b981]"></span>
            System Status: 100% Operational (99.98% SLA)
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <h4 className="font-bold text-white uppercase text-[10px] tracking-widest font-mono">Market Segments</h4>
          <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
            <li className="hover:text-indigo-400 cursor-pointer transition-colors">Language Models (LLM)</li>
            <li className="hover:text-indigo-400 cursor-pointer transition-colors">Image Synthesis</li>
            <li className="hover:text-indigo-400 cursor-pointer transition-colors">Audio & Voice Synthesis</li>
            <li className="hover:text-indigo-400 cursor-pointer transition-colors">Code Intelligence</li>
            <li className="hover:text-indigo-400 cursor-pointer transition-colors">Document Intelligence</li>
          </ul>
        </div>

        {/* Ecosystem */}
        <div className="space-y-2">
          <h4 className="font-bold text-white uppercase text-[10px] tracking-widest font-mono">Infrastructure</h4>
          <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
            <li className="hover:text-indigo-400 cursor-pointer transition-colors">Universal AI Router</li>
            <li className="hover:text-indigo-400 cursor-pointer transition-colors">High-Yield Prompt Library</li>
            <li className="hover:text-indigo-400 cursor-pointer transition-colors">Performance Leaderboard</li>
            <li className="hover:text-indigo-400 cursor-pointer transition-colors">Submit Entity API</li>
            <li className="hover:text-indigo-400 cursor-pointer transition-colors">Comparison Matrix</li>
          </ul>
        </div>

        {/* Developer & Legal */}
        <div className="space-y-2">
          <h4 className="font-bold text-white uppercase text-[10px] tracking-widest font-mono">Enterprise Node</h4>
          <ul className="space-y-1.5 text-xs font-mono">
            <li className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-green-400" /> Edge Security Architecture
            </li>
            <li className="flex items-center gap-1.5 text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" /> Multi-Provider Failover Router
            </li>
            <li className="text-slate-500 pt-1 text-[11px]">
              Engineered with Team Market AI & Cloud Run.
            </li>
          </ul>
        </div>

      </div>

      {/* Ticker Footer Bar */}
      <div className="h-8 bg-indigo-600 flex items-center px-4 overflow-hidden text-white font-mono border-t border-white/10">
        <div className="flex whitespace-nowrap gap-12 text-[10px] font-bold uppercase tracking-widest animate-marquee">
          <div className="flex items-center gap-2"><span className="opacity-70">TOP MOVER:</span> FLUX.1 (+15.4%)</div>
          <div className="flex items-center gap-2"><span className="opacity-70">MARKET INDEX:</span> 14,892.4 <span className="text-green-300">↑ +2.4%</span></div>
          <div className="flex items-center gap-2"><span className="opacity-70">TOP PIPELINE:</span> ENTERPRISE AI ROUTER (+22.1%)</div>
          <div className="flex items-center gap-2"><span className="opacity-70">UPTIME:</span> 99.98% SLA</div>
        </div>
      </div>
    </footer>
  );
};
