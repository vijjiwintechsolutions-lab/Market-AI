import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Search, 
  Heart, 
  PlusCircle, 
  Activity, 
  BookOpen, 
  Cpu, 
  Moon, 
  Sun, 
  Grid, 
  History,
  SlidersHorizontal,
  Flame
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'marketplace' | 'providers' | 'prompts' | 'history';
  setActiveTab: (tab: 'marketplace' | 'providers' | 'prompts' | 'history') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  favoritesCount: number;
  openSubmitModal: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  totalToolsCount: number;
  openLatencySettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  favoritesCount,
  openSubmitModal,
  isDarkMode,
  setIsDarkMode,
  totalToolsCount,
  openLatencySettings,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Global Keyboard Shortcut: Cmd/Ctrl + K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.select();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#0F0F0F]/95 backdrop-blur-md border-b border-white/10 text-[#E0E0E0] transition-colors font-sans">
      {/* Top Ticker Bar */}
      <div className="bg-indigo-600/90 text-[11px] py-1 px-4 text-center font-bold tracking-wider uppercase flex items-center justify-between overflow-hidden border-b border-white/10 text-white">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#10b981] animate-pulse"></span>
          <span className="text-white font-mono">NEURAL.MARKET ROUTER ACTIVE</span>
        </div>
        <div className="hidden sm:flex items-center gap-6 font-mono text-[10px] text-indigo-100">
          <span>HIGH-SPEED INFERENCE ENGINE</span>
          <span>ENTERPRISE AI MARKETPLACE</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <span className="bg-white/20 px-2 py-0.5 rounded text-white">99.98% UPTIME</span>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('marketplace')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-7 h-7 bg-indigo-600 rounded-sm flex items-center justify-center text-white font-bold text-xs tracking-tighter shadow-md group-hover:bg-indigo-500 transition-colors">
              <div className="w-3.5 h-3.5 bg-white/20 rounded-xs flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tighter text-white">
                  NEURAL<span className="text-indigo-400">.MARKET</span>
                </span>
                <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-white/10 text-indigo-300 border border-white/10 font-bold">
                  v3.0
                </span>
              </div>
            </div>
          </div>

          {/* Quick Search Input */}
          <div className="hidden md:flex flex-1 max-w-md relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 800+ AI tools (e.g. 'Code', 'PDF')..."
              className="w-full pl-9 pr-14 py-1.5 bg-white/5 hover:bg-white/10 focus:bg-[#151517] text-white placeholder-slate-500 text-xs rounded border border-white/10 focus:border-indigo-500/80 focus:outline-none transition-all font-mono"
            />
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  searchInputRef.current?.focus();
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 hover:text-white uppercase font-mono cursor-pointer"
              >
                Clear
              </button>
            ) : (
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono text-slate-400 bg-white/10 rounded border border-white/10 pointer-events-none">
                <span className="text-[10px]">⌘</span>K
              </kbd>
            )}
          </div>

          {/* Main Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-1.5">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'marketplace'
                  ? 'bg-white/10 text-indigo-300 border border-white/10 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tools</span>
              <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] bg-white/10 text-slate-300 font-mono">
                {totalToolsCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('prompts')}
              className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeTab === 'prompts'
                  ? 'bg-white/10 text-indigo-300 border border-white/10 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Prompts</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 relative transition-all ${
                activeTab === 'history'
                  ? 'bg-white/10 text-indigo-300 border border-white/10 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <History className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden sm:inline">Saved</span>
              {favoritesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-500/20 text-rose-300 font-bold font-mono">
                  {favoritesCount}
                </span>
              )}
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={openSubmitModal}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded shadow flex items-center gap-1.5 transition-all active:scale-95 uppercase tracking-wider"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Submit Tool</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
