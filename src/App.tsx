import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { BreadcrumbBar } from './components/BreadcrumbBar';
import { HeroSection } from './components/HeroSection';
import { CategorySidebar } from './components/CategorySidebar';
import { ToolCard } from './components/ToolCard';
import { FullWidthToolRunner } from './components/FullWidthToolRunner';
import { ProviderRouterTab } from './components/ProviderRouterTab';
import { PromptLibraryTab } from './components/PromptLibraryTab';
import { UserDashboardTab } from './components/UserDashboardTab';
import { CompareToolsModal } from './components/CompareToolsModal';
import { SubmitToolModal } from './components/SubmitToolModal';
import { LatencySettingsModal } from './components/LatencySettingsModal';
import { RealWalletModal } from './components/RealWalletModal';
import { Footer } from './components/Footer';
import { AITool, ExecutionHistoryItem, AIPromptItem } from './types';
import { TOOLS_DATA } from './data/toolsData';
import { Sparkles, Grid, List, FolderKanban } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'marketplace' | 'prompts' | 'history'>('marketplace');
  const [toolsList, setToolsList] = useState<AITool[]>(TOOLS_DATA);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pricingFilter, setPricingFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');

  const [activeToolRunner, setActiveToolRunner] = useState<AITool | null>(null);
  const [walletBalance, setWalletBalance] = useState<number>(100);
  const [isWalletOpen, setIsWalletOpen] = useState<boolean>(false);

  const [favoriteIds, setFavoritesIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('market1_favorites');
      return saved ? JSON.parse(saved) : ['ai-family-portrait-studio', 'regional-ad-banner-maker'];
    } catch (e) {
      return ['ai-family-portrait-studio', 'regional-ad-banner-maker'];
    }
  });

  const [historyItems, setHistoryItems] = useState<ExecutionHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('market1_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [comparedTools, setComparedTools] = useState<AITool[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isLatencySettingsOpen, setIsLatencySettingsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'categories'>('grid');
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem('market1_favorites', JSON.stringify(favoriteIds));
    } catch (e) {}
  }, [favoriteIds]);

  useEffect(() => {
    try {
      localStorage.setItem('market1_history', JSON.stringify(historyItems));
    } catch (e) {}
  }, [historyItems]);

  const toggleFavorite = (toolId: string) => {
    setFavoritesIds((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  };

  const toggleCompare = (tool: AITool) => {
    setComparedTools((prev) => {
      const exists = prev.some((t) => t.id === tool.id);
      if (exists) return prev.filter((t) => t.id !== tool.id);
      if (prev.length >= 3) {
        alert('You can compare a maximum of 3 AI tools.');
        return prev;
      }
      return [...prev, tool];
    });
  };

  const handleSaveHistory = (newItem: ExecutionHistoryItem) => {
    setHistoryItems((prev) => [newItem, ...prev]);
  };

  const handleNewToolSubmit = (newTool: AITool) => {
    setToolsList((prev) => [newTool, ...prev]);
  };

  const handleRunPromptInTool = (promptItem: AIPromptItem) => {
    const target = toolsList.find((t) => t.id === promptItem.recommendedToolId) || toolsList[0];
    const updatedTool = {
      ...target,
      inputs: target.inputs.map((inp) =>
        inp.id === 'prompt' || inp.type === 'textarea' ? { ...inp, defaultValue: promptItem.promptText } : inp
      ),
    };
    setActiveToolRunner(updatedTool);
  };

  const handleSelectTag = (tag: string) => {
    const cleanTag = tag.replace(/^#/, '');
    setSearchQuery(cleanTag);
    if (activeToolRunner) setActiveToolRunner(null);
    if (activeTab !== 'marketplace') setActiveTab('marketplace');
  };

  const filteredTools = useMemo(() => {
    return toolsList.filter((tool) => {
      const matchesCategory = selectedCategory === 'All Categories' || tool.category === selectedCategory;
      const matchesPricing = pricingFilter === 'All' || tool.pricing.toLowerCase() === pricingFilter.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const cleanQ = q.startsWith('#') ? q.slice(1) : q;
      const matchesSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.name.toLowerCase().includes(cleanQ) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.subcategory.toLowerCase().includes(q) ||
        (tool.tags && tool.tags.some((tag) => tag.toLowerCase().includes(q) || tag.toLowerCase().includes(cleanQ)));
      return matchesCategory && matchesPricing && matchesSearch;
    });
  }, [toolsList, selectedCategory, searchQuery, pricingFilter]);

  const favoritesList = useMemo(() => {
    return toolsList.filter((t) => favoriteIds.includes(t.id));
  }, [toolsList, favoriteIds]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        favoritesCount={favoriteIds.length}
        openSubmitModal={() => setIsSubmitModalOpen(true)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        totalToolsCount={toolsList.length}
        openLatencySettings={() => setIsLatencySettingsOpen(true)}
      />

      {/* Breadcrumb Bar */}
      <BreadcrumbBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        activeToolRunner={activeToolRunner}
        setActiveToolRunner={setActiveToolRunner}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {activeToolRunner ? (
          <FullWidthToolRunner
            tool={activeToolRunner}
            allTools={toolsList}
            onBack={() => setActiveToolRunner(null)}
            onSelectTool={(t) => setActiveToolRunner(t)}
            onSaveHistory={handleSaveHistory}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
            comparedTools={comparedTools}
            onToggleCompare={toggleCompare}
            onSelectTag={handleSelectTag}
          />
        ) : (
          <>
            {activeTab === 'marketplace' && (
              <div>
                <HeroSection
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  pricingFilter={pricingFilter}
                  setPricingFilter={setPricingFilter}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  totalFilteredCount={filteredTools.length}
                  onSelectTag={handleSelectTag}
                />

                <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Category Sidebar */}
                    <CategorySidebar
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                      toolsList={toolsList}
                      pricingFilter={pricingFilter}
                      setPricingFilter={setPricingFilter}
                      favoriteCount={favoriteIds.length}
                      onSelectTag={handleSelectTag}
                      searchQuery={searchQuery}
                    />

                    {/* Right Tools Grid */}
                    <div className="flex-1 min-w-0 space-y-4">
                      <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/10 pb-3">
                        <span className="font-bold text-white uppercase font-mono">
                          Showing {filteredTools.length} AI Tools
                        </span>
                        <div className="flex items-center bg-[#151517] border border-white/10 rounded p-0.5 font-mono">
                          <button
                            onClick={() => setViewMode('grid')}
                            className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                              viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400'
                            }`}
                          >
                            <Grid className="w-3.5 h-3.5 inline mr-1" /> Grid
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTools.map((tool) => (
                          <ToolCard
                            key={tool.id}
                            tool={tool}
                            onRunTool={(t) => setActiveToolRunner(t)}
                            isFavorite={favoriteIds.includes(tool.id)}
                            onToggleFavorite={toggleFavorite}
                            isCompared={comparedTools.some((c) => c.id === tool.id)}
                            onToggleCompare={toggleCompare}
                            onSelectTag={handleSelectTag}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'prompts' && (
              <PromptLibraryTab onRunPromptInTool={handleRunPromptInTool} />
            )}

            {activeTab === 'history' && (
              <UserDashboardTab
                favorites={favoritesList}
                history={historyItems}
                onRunTool={(t) => setActiveToolRunner(t)}
                onRemoveFavorite={toggleFavorite}
                onClearHistory={() => setHistoryItems([])}
              />
            )}
          </>
        )}
      </main>

      {/* Compare Modal */}
      {isCompareOpen && (
        <CompareToolsModal
          comparedTools={comparedTools}
          onRemoveTool={(id) => setComparedTools((prev) => prev.filter((t) => t.id !== id))}
          onClearAll={() => setComparedTools([])}
          onClose={() => setIsCompareOpen(false)}
          onRunTool={(t) => setActiveToolRunner(t)}
        />
      )}

      {/* Submit Tool Modal */}
      <SubmitToolModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitSuccess={handleNewToolSubmit}
      />

      {/* Latency Modal */}
      <LatencySettingsModal
        isOpen={isLatencySettingsOpen}
        onClose={() => setIsLatencySettingsOpen(false)}
      />

      {/* Real Wallet Checkout Modal */}
      <RealWalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
        currentBalance={walletBalance}
        onBalanceUpdated={(newBal) => setWalletBalance(newBal)}
      />

      <Footer />
    </div>
  );
}
