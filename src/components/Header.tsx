// =====================================================================
// MARKET1 HEADER COMPONENT
// =====================================================================

'use client';

import React from 'react';
import { Cpu, PlusCircle, Wallet, Zap, Shield, BarChart2, User } from 'lucide-react';

export interface HeaderProps {
  onOpenSubmit?: () => void;
  onOpenWallet?: () => void;
  onOpenPricing?: () => void;
  onOpenAuth?: () => void;
  onOpenCompare?: () => void;
  onOpenLatency?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSubmit,
  onOpenWallet,
  onOpenPricing,
  onOpenAuth,
  onOpenCompare,
  onOpenLatency,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-md px-4 lg:px-8 py-3.5 flex items-center justify-between font-mono">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-lg tracking-wider">
          <Cpu className="w-6 h-6 text-emerald-400 animate-pulse" />
          <span>MARKET1<span className="text-white">_OS</span></span>
        </div>
        <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 uppercase font-bold tracking-widest">
          v3.0 Engine
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 text-xs">
        {onOpenSubmit && (
          <button 
            onClick={onOpenSubmit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 transition-all font-semibold cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden md:inline">Submit Tool</span>
          </button>
        )}

        {onOpenCompare && (
          <button 
            onClick={onOpenCompare}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
          >
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            <span>Compare</span>
          </button>
        )}

        {onOpenLatency && (
          <button 
            onClick={onOpenLatency}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Latency</span>
          </button>
        )}

        {onOpenPricing && (
          <button 
            onClick={onOpenPricing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
          >
            <Shield className="w-4 h-4 text-purple-400" />
            <span>Pricing</span>
          </button>
        )}

        {onOpenWallet && (
          <button 
            onClick={onOpenWallet}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
          >
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span>Wallet</span>
          </button>
        )}

        {onOpenAuth && (
          <button 
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-md shadow-emerald-950 cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
