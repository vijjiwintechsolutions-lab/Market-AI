import React, { useState, useMemo } from 'react';
import { INITIAL_TOOLS, CATEGORIES_LIST } from './data/toolsData';
import { AITool, ExecutionHistoryItem } from './types';
import { FullWidthToolRunner } from './components/FullWidthToolRunner';
import { ToolCard } from './components/ToolCard';
import { RealWalletModal } from './components/RealWalletModal';
import { 
  Sparkles, 
  Search, 
  Zap, 
  CreditCard, 
  Grid, 
  Layers, 
  Bookmark, 
  History, 
  SlidersHorizontal,
  Compass,
  Star
} from 'lucide-react';

export default function App() {
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [comparedTools, setComparedTools] = useState<AITool[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(100);
  const [isWalletOpen, setIsWalletOpen] = useState<boolean>(false);
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);
  const [, setExecutionHistory] = useState<ExecutionHistoryItem[]>([]);

  const filteredTools = useMemo(() => {
    return INITIAL_TOOLS.filter((tool) => {
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSaved = !showSavedOnly || favoriteIds.includes(tool.id);
      return matchesCategory && matchesSearch && matchesSaved;
    });
  }, [selectedCategory, searchQuery, showSavedOnly, favoriteIds]);

  const handleToggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleCompare = (tool: AITool) => {
    setComparedTools((prev) =>
      prev.some((t) => t.id === tool.id)
        ? prev.filter((t) => t.id !== tool.id)
        : [...prev, tool]
    );
  };

  const handleSaveHistory = (item: ExecutionHistoryItem) => {
    setExecutionHistory((prev) => [item, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] font-sans flex flex-col">
      {/* GLOBAL HEADER */}
      <header className="bg-[#151517] border-b border-white/10 sticky top-0 z-40 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div
            onClick={() => {
              setSelectedTool(null);
              setShowSavedOnly(false);
            }}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="p-2 bg-indigo-600 rounded-xl shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-extrabold text-white font-mono tracking-tight">NEURAL MARKET</span>
              <span className="text-[10px] text-indigo-400 font-mono block -mt-1 font-bold">v4.0 Enterprise AI</span>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono">
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                showSavedOnly
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${showSavedOnly ? 'fill-rose-300' : ''}`} />
              <span className="hidden sm:inline">Saved ({favoriteIds.length})</span>
            </button>

            <button
              onClick={() => setIsWalletOpen(true)}
              className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Wallet: {walletBalance} Crs</span>
              <CreditCard className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      {/* WORKSPACE ROUTER */}
      {selectedTool ? (
        <FullWidthToolRunner
          tool={selectedTool}
          allTools={INITIAL_TOOLS}
          onBack={() => setSelectedTool(null)}
          onSelectTool={(t) => setSelectedTool(t)}
          onSaveHistory={handleSaveHistory}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
          comparedTools={comparedTools}
          onToggleCompare={handleToggleCompare}
        />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* SIDEBAR NAVIGATION */}
          <aside className="lg:col-span-3 bg-[#151517] border border-white/10 rounded-2xl p-5 space-y-6 sticky top-20 shadow-xl">
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                <Compass className="w-4 h-4" /> AI Categories
              </h2>
              <div className="mt-3 space-y-1 font-mono text-xs">
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setShowSavedOnly(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg font-bold flex items-center justify-between cursor-pointer transition-colors ${
                    selectedCategory === 'All' && !showSavedOnly
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span>All Tools</span>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded">{INITIAL_TOOLS.length}</span>
                </button>

                {CATEGORIES_LIST.map((cat) => {
                  const count = INITIAL_TOOLS.filter((t) => t.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setShowSavedOnly(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg font-bold flex items-center justify-between cursor-pointer transition-colors ${
                        selectedCategory === cat && !showSavedOnly
                          ? 'bg-indigo-600 text-white shadow'
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{cat}</span>
                      <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded shrink-0">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Total Active AI Tools:</span>
                <strong className="text-white">{INITIAL_TOOLS.length}</strong>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Platform SLA:</span>
                <strong className="text-green-400">99.9% Uptime</strong>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="lg:col-span-9 space-y-6">
            {/* HERO BANNER & SEARCH */}
            <div className="bg-[#151517] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-[11px] font-mono font-bold rounded-full uppercase">
                  Enterprise AI Engine
                </span>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono font-bold rounded-full uppercase">
                  Multi-Language Ready
                </span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  AI Generation & Creation Hub
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Generate realistic family photo shoots, festival ad banners, viral dance trends, baby photos, and complete websites in any language.
                </p>
              </div>

              {/* SEARCH INPUT */}
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tools (e.g., 'Family Studio', 'Banner Generator', 'Dance Reel')..."
                  className="w-full pl-12 pr-4 py-3 bg-[#0A0A0A] border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none font-mono shadow-inner"
                />
              </div>
            </div>

            {/* RESULTS HEADER */}
            <div className="flex items-center justify-between font-mono text-xs pt-2">
              <span className="text-slate-400">
                Showing <strong className="text-white">{filteredTools.length}</strong> AI Tools
              </span>
              <span className="text-indigo-400 font-bold">Category: {selectedCategory}</span>
            </div>

            {/* TOOLS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFavorite={favoriteIds.includes(tool.id)}
                  isCompared={comparedTools.some((t) => t.id === tool.id)}
                  onToggleFavorite={handleToggleFavorite}
                  onToggleCompare={handleToggleCompare}
                  onRunTool={(t) => setSelectedTool(t)}
                />
              ))}
            </div>
          </main>
        </div>
      )}

      {/* REAL WALLET MODAL */}
      <RealWalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        currentBalance={walletBalance}
        onBalanceUpdated={(newBal) => setWalletBalance(newBal)}
      />
    </div>
  );
}
