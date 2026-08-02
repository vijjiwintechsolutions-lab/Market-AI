import React, { useState, useMemo } from 'react';
import { INITIAL_TOOLS, CATEGORIES_LIST } from './data/toolsData';
import { AITool, ExecutionHistoryItem, ToolCategory } from './types';
import { FullWidthToolRunner } from './components/FullWidthToolRunner';
import { ToolCard } from './components/ToolCard';
import { RealWalletModal } from './components/RealWalletModal';
import { Sparkles, Search, Zap, Layers, CreditCard } from 'lucide-react';

export default function App() {
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [comparedTools, setComparedTools] = useState<AITool[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(100);
  const [isWalletOpen, setIsWalletOpen] = useState<boolean>(false);
  const [executionHistory, setExecutionHistory] = useState<ExecutionHistoryItem[]>([]);

  const filteredTools = useMemo(() => {
    return INITIAL_TOOLS.filter((tool) => {
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      const matchesSearch =
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

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
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] font-sans">
      {/* Header Navigation */}
      <header className="bg-[#151517] border-b border-white/10 sticky top-0 z-40 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div
            onClick={() => setSelectedTool(null)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-extrabold text-white font-mono tracking-tight">NEURAL MARKET</span>
              <span className="text-[10px] text-indigo-400 font-mono block -mt-1 font-bold">v4.0 Enterprise AI</span>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono">
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

      {/* Main Body Routing */}
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 font-sans">
          {/* Hero Banner */}
          <div className="bg-[#151517] border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-6 text-center max-w-4xl mx-auto">
            <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 text-xs font-mono font-bold rounded-full uppercase tracking-wider">
              High-Speed Multi-Model Inference Engine
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Enterprise AI Marketplace & Tools
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Generate ultra-realistic family portraits, festival ad banners, viral dance trend videos, baby photoshoots, and complete websites in all languages.
            </p>

            {/* Search Input */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 800+ AI tools (e.g. 'Family Studio', 'Banner Maker', 'Dance Trend')..."
                className="w-full pl-12 pr-4 py-3.5 bg-[#0A0A0A] border border-white/15 rounded-xl text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none font-mono shadow-inner"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-lg font-bold border shrink-0 cursor-pointer transition-all ${
                selectedCategory === 'All'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg'
                  : 'bg-[#151517] text-slate-400 border-white/10 hover:bg-white/5'
              }`}
            >
              All Tools ({INITIAL_TOOLS.length})
            </button>
            {CATEGORIES_LIST.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-bold border shrink-0 cursor-pointer transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg'
                    : 'bg-[#151517] text-slate-400 border-white/10 hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      )}

      {/* Real Wallet Checkout Modal */}
      <RealWalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        currentBalance={walletBalance}
        onBalanceUpdated={(newBal) => setWalletBalance(newBal)}
      />
    </div>
  );
}
