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
import { PricingTiersModal } from './components/PricingTiersModal';
import { AuthModal } from './components/AuthModal';
import { AIConsultantWidget } from './components/AIConsultantWidget';
import { NewToolsNotificationModal } from './components/NewToolsNotificationModal';
import { Footer } from './components/Footer';

import {
  auth,
  onAuthStateChanged,
  User,
  db,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
} from './lib/firebase';
import { AITool, ExecutionHistoryItem, AIPromptItem } from './types';
import { TOOLS_DATA } from './data/toolsData';
import { Sparkles, Layers, SlidersHorizontal, Check, Zap, ArrowRight, Grid, List, FolderKanban, ChevronLeft, ChevronRight } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'marketplace' | 'providers' | 'prompts' | 'history'>('marketplace');

  // Tools Registry State
  const [toolsList, setToolsList] = useState<AITool[]>(TOOLS_DATA);

  // Filters & Search State
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pricingFilter, setPricingFilter] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');

  // Interactive Runner Modal
  const [activeToolRunner, setActiveToolRunner] = useState<AITool | null>(null);

  // Favorites & History (with LocalStorage)
  const [favoriteIds, setFavoritesIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('market1_favorites');
      return saved ? JSON.parse(saved) : ['ai-chat-pro', 'text-to-image-ai'];
    } catch (e) {
      return ['ai-chat-pro', 'text-to-image-ai'];
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

  // Tool Comparison Matrix State
  const [comparedTools, setComparedTools] = useState<AITool[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Submit Modal
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // Power User Latency Settings Modal
  const [isLatencySettingsOpen, setIsLatencySettingsOpen] = useState(false);

  // Auth State & Firestore Sync
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          // Sync User Profile & Credits from Firestore
          const userRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            if (data.credits !== undefined) {
              setUserCredits(data.credits);
            }
          } else {
            // Initialize User Document in Firestore
            await setDoc(userRef, {
              email: user.email,
              displayName: user.displayName || '',
              credits: 100,
              createdAt: new Date().toISOString(),
            });
          }
        } catch (e) {
          console.warn('Firestore user sync warning:', e);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch Community Tools from Firestore on Mount
  useEffect(() => {
    async function loadCommunityTools() {
      try {
        const toolsSnap = await getDocs(collection(db, 'community_tools'));
        const communityTools: AITool[] = [];
        toolsSnap.forEach((docSnap) => {
          communityTools.push(docSnap.data() as AITool);
        });
        if (communityTools.length > 0) {
          setToolsList((prev) => {
            const existingIds = new Set(prev.map((t) => t.id));
            const fresh = communityTools.filter((t) => !existingIds.has(t.id));
            return [...fresh, ...prev];
          });
        }
      } catch (e) {
        console.warn('Firestore community tools sync warning:', e);
      }
    }
    loadCommunityTools();
  }, []);

  // Handle URL deep linking (e.g. ?tool=ai-chat-pro)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const toolIdParam = params.get('tool') || params.get('toolId');
      if (toolIdParam && toolsList.length > 0) {
        const found = toolsList.find(
          (t) => t.id.toLowerCase() === toolIdParam.toLowerCase()
        );
        if (found) {
          setActiveToolRunner(found);
          setActiveTab('marketplace');
        }
      }
    } catch (e) {
      console.warn('Deep link parsing error:', e);
    }
  }, [toolsList]);

  // Pricing Tiers & Credit Management
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [userCredits, setUserCredits] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('market1_user_credits');
      return saved ? parseInt(saved, 10) : 100;
    } catch (e) {
      return 100;
    }
  });

  // New Tools Notification State
  const [isNewToolsModalOpen, setIsNewToolsModalOpen] = useState(false);
  const [unreadNewToolsCount, setUnreadNewToolsCount] = useState<number>(3);

  // Sync user credits to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('market1_user_credits', userCredits.toString());
    } catch (e) {}
  }, [userCredits]);

  const handleTopUpCredits = async (amount: number) => {
    setUserCredits((prev) => {
      const updated = prev + amount;
      if (currentUser) {
        setDoc(doc(db, 'users', currentUser.uid), { credits: updated }, { merge: true }).catch(
          (err) => console.warn('Failed to update credits in Firestore:', err)
        );
      }
      return updated;
    });
  };

  // View Mode: Tile View Grid vs High Density Table vs Category Sections
  const [viewMode, setViewMode] = useState<'table' | 'grid' | 'categories'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(24);

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, pricingFilter, sortBy]);

  // Sync favorites & history to localStorage
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

  // Toggle Favorite
  const toggleFavorite = (toolId: string) => {
    setFavoritesIds((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  };

  // Toggle Compare Tool
  const toggleCompare = (tool: AITool) => {
    setComparedTools((prev) => {
      const exists = prev.some((t) => t.id === tool.id);
      if (exists) {
        return prev.filter((t) => t.id !== tool.id);
      } else {
        if (prev.length >= 3) {
          alert('You can compare a maximum of 3 AI tools side-by-side.');
          return prev;
        }
        return [...prev, tool];
      }
    });
  };

  // Handle Save History from Runner
  const handleSaveHistory = (newItem: ExecutionHistoryItem) => {
    setHistoryItems((prev) => [newItem, ...prev]);
  };

  // Submit new tool handler
  const handleNewToolSubmit = async (newTool: AITool) => {
    setToolsList((prev) => [newTool, ...prev]);
    try {
      await setDoc(doc(db, 'community_tools', newTool.id), newTool);
    } catch (e) {
      console.warn('Failed to save tool to Firestore:', e);
    }
  };

  // Launch prompt inside recommended tool
  const handleRunPromptInTool = (promptItem: AIPromptItem) => {
    const target = toolsList.find((t) => t.id === promptItem.recommendedToolId) || toolsList[0];
    // Override default prompt input
    const updatedTool = {
      ...target,
      inputs: target.inputs.map((inp) =>
        inp.id === 'prompt' || inp.type === 'textarea' ? { ...inp, defaultValue: promptItem.promptText } : inp
      ),
    };
    setActiveToolRunner(updatedTool);
  };

  // Live Tag Selection Handler
  const handleSelectTag = (tag: string) => {
    const cleanTag = tag.replace(/^#/, '');
    setSearchQuery(cleanTag);
    if (activeToolRunner) {
      setActiveToolRunner(null);
    }
    if (activeTab !== 'marketplace') {
      setActiveTab('marketplace');
    }
    window.scrollTo({ top: 320, behavior: 'smooth' });
  };

  // Filtered Tools Computation
  const filteredTools = useMemo(() => {
    return toolsList.filter((tool) => {
      const matchesCategory =
        selectedCategory === 'All Categories' || tool.category === selectedCategory;

      const matchesPricing =
        pricingFilter === 'All' || tool.pricing.toLowerCase() === pricingFilter.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const cleanQ = q.startsWith('#') ? q.slice(1) : q;
      const matchesSearch =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.name.toLowerCase().includes(cleanQ) ||
        tool.description.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(cleanQ) ||
        tool.category.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(cleanQ) ||
        tool.subcategory.toLowerCase().includes(q) ||
        tool.subcategory.toLowerCase().includes(cleanQ) ||
        tool.provider.toLowerCase().includes(q) ||
        tool.provider.toLowerCase().includes(cleanQ) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(q) || tag.toLowerCase().includes(cleanQ));

      return matchesCategory && matchesPricing && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'latency') return a.latencyMs - b.latencyMs;
      if (sortBy === 'runs') return b.runsToday - a.runsToday;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      // default: featured
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.rating - a.rating;
    });
  }, [toolsList, selectedCategory, searchQuery, pricingFilter, sortBy]);

  // Grouped by Category for Category-wise view
  const groupedByCategory = useMemo(() => {
    const map: Record<string, AITool[]> = {};
    filteredTools.forEach((tool) => {
      if (!map[tool.category]) map[tool.category] = [];
      map[tool.category].push(tool);
    });
    return map;
  }, [filteredTools]);

  // Paginated tools for Table/Grid views
  const totalPages = useMemo(() => {
    if (pageSize === 0) return 1;
    return Math.ceil(filteredTools.length / pageSize) || 1;
  }, [filteredTools, pageSize]);

  const paginatedTools = useMemo(() => {
    if (pageSize === 0) return filteredTools;
    const start = (currentPage - 1) * pageSize;
    return filteredTools.slice(start, start + pageSize);
  }, [filteredTools, currentPage, pageSize]);

  const favoritesList = useMemo(() => {
    return toolsList.filter((t) => favoriteIds.includes(t.id));
  }, [toolsList, favoriteIds]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Global Header */}
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
        openPricingModal={() => setIsPricingModalOpen(true)}
        userCredits={userCredits}
        currentUser={currentUser}
        openAuthModal={() => setIsAuthModalOpen(true)}
        openNewToolsModal={() => setIsNewToolsModalOpen(true)}
        unreadNewToolsCount={unreadNewToolsCount}
      />

      {/* Breadcrumb Navigation Bar */}
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
        
        {/* FULL WIDTH TOOL RUNNER WORKSPACE (when a tool is selected) */}
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
            {/* TAB 1: AI TOOLS MARKETPLACE */}
            {activeTab === 'marketplace' && (
              <div>
                {/* Hero & Filter Section */}
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

                {/* Compared Tools Floating Sticky Bar */}
                {comparedTools.length > 0 && (
                  <div className="fixed bottom-6 right-6 z-40 bg-[#151517] border border-indigo-500/50 p-3 rounded-lg shadow-2xl flex items-center gap-3 animate-slide-up font-mono">
                    <div className="flex items-center gap-2 text-xs text-indigo-300 font-bold">
                      <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                      <span>Comparing {comparedTools.length} tools</span>
                    </div>
                    <button
                      onClick={() => setIsCompareOpen(true)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded shadow transition-colors cursor-pointer"
                    >
                      View Matrix →
                    </button>
                  </div>
                )}

                {/* Main Content with Category Sidebar & Tools Table/Grid */}
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

                    {/* Right Tools Matrix Container */}
                    <div className="flex-1 min-w-0 space-y-4">
                      
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white uppercase font-mono tracking-wider text-[11px]">
                            Showing {filteredTools.length} AI Entities
                            {selectedCategory !== 'All Categories' && ` [${selectedCategory}]`}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="hidden md:inline font-mono text-green-400 text-[11px] flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_#10b981]"></span>
                            All Nodes Operational
                          </span>

                          {/* View Mode Toggle */}
                          <div className="flex items-center bg-[#151517] border border-white/10 rounded p-0.5">
                            <button
                              onClick={() => setViewMode('table')}
                              className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold flex items-center gap-1 transition-all ${
                                viewMode === 'table'
                                  ? 'bg-indigo-600 text-white shadow'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              <List className="w-3.5 h-3.5" /> Dense Table
                            </button>
                            <button
                              onClick={() => setViewMode('grid')}
                              className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold flex items-center gap-1 transition-all ${
                                viewMode === 'grid'
                                  ? 'bg-indigo-600 text-white shadow'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              <Grid className="w-3.5 h-3.5" /> Grid Cards
                            </button>
                            <button
                              onClick={() => setViewMode('categories')}
                              className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold flex items-center gap-1 transition-all ${
                                viewMode === 'categories'
                                  ? 'bg-indigo-600 text-white shadow'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              <FolderKanban className="w-3.5 h-3.5" /> Category Sections
                            </button>
                          </div>
                        </div>
                      </div>

                      {filteredTools.length === 0 ? (
                        <div className="text-center py-16 bg-[#151517] border border-white/5 rounded-lg space-y-3 font-mono">
                          <Sparkles className="w-10 h-10 text-slate-600 mx-auto" />
                          <h3 className="text-base font-bold text-white">No AI entities match your search parameters</h3>
                          <p className="text-xs text-slate-400 max-w-sm mx-auto">
                            Try clearing search queries, adjusting pricing filters, or selecting 'All Categories'.
                          </p>
                          <button
                            onClick={() => {
                              setSelectedCategory('All Categories');
                              setSearchQuery('');
                              setPricingFilter('All');
                            }}
                            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold rounded text-white transition-colors uppercase tracking-wider"
                          >
                            Reset Filters
                          </button>
                        </div>
                      ) : viewMode === 'categories' ? (
                        /* CATEGORY-WISE GROUPED VIEW */
                        <div className="space-y-8 font-sans">
                          {(Object.entries(groupedByCategory) as [string, AITool[]][]).map(([catName, categoryTools]) => (
                            <div key={catName} className="space-y-3 bg-[#121214] border border-white/10 p-4 rounded-xl">
                              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]"></div>
                                  <h3 className="text-base font-bold text-white tracking-tight">{catName}</h3>
                                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                    {categoryTools.length} Tools
                                  </span>
                                </div>
                                <button
                                  onClick={() => setSelectedCategory(catName)}
                                  className="text-xs font-mono font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors cursor-pointer"
                                >
                                  View All Category Tools →
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-2.5">
                                {categoryTools.slice(0, 8).map((tool) => (
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

                              {categoryTools.length > 8 && (
                                <div className="pt-2 text-center">
                                  <button
                                    onClick={() => setSelectedCategory(catName)}
                                    className="px-4 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer"
                                  >
                                    + Show remaining {categoryTools.length - 8} tools in {catName}
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : viewMode === 'table' ? (
                        /* HIGH DENSITY MATRIX TABLE VIEW */
                        <div className="space-y-4">
                          <div className="bg-[#151517] border border-white/5 rounded-lg overflow-hidden font-sans">
                            <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 border-b border-white/10 text-[10px] uppercase font-bold text-slate-500 tracking-wider font-mono bg-[#0A0A0A]/50">
                              <div className="col-span-4">AI Entity</div>
                              <div className="col-span-2">Category</div>
                              <div className="col-span-2">Real-time Perf</div>
                              <div className="col-span-1 text-center">Rating</div>
                              <div className="col-span-2">Cost Tier</div>
                              <div className="col-span-1 text-right">Action</div>
                            </div>

                            <div className="divide-y divide-white/5">
                              {paginatedTools.map((tool) => (
                                <div
                                  key={tool.id}
                                  className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 px-4 py-3.5 items-center hover:bg-white/[0.02] transition-colors"
                                >
                                  {/* Entity Info */}
                                  <div className="md:col-span-4 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center font-bold text-indigo-400 text-xs shrink-0 font-mono">
                                      {tool.name.slice(0, 2).toUpperCase()}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-white truncate group-hover:text-indigo-300">
                                          {tool.name}
                                        </span>
                                        {tool.badge && (
                                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono uppercase">
                                            {tool.badge}
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-[11px] text-slate-400 truncate font-sans flex items-center gap-2 flex-wrap">
                                        <span>{tool.subcategory}</span>
                                        <span className="text-slate-600">•</span>
                                        {tool.tags.slice(0, 2).map((t) => (
                                          <button
                                            key={t}
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleSelectTag(t);
                                            }}
                                            className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/10 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/20 font-mono transition-colors cursor-pointer"
                                            title={`Filter by #${t}`}
                                          >
                                            #{t}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Category */}
                                  <div className="md:col-span-2 text-xs text-slate-300 font-medium">
                                    {tool.category}
                                  </div>

                                  {/* Perf Bar & Latency */}
                                  <div className="md:col-span-2">
                                    <div className="flex items-center gap-2">
                                      <div className="flex items-end gap-0.5 h-4">
                                        <div className="w-1 h-2 bg-green-500/40 rounded-t-xs"></div>
                                        <div className="w-1 h-3 bg-green-500/60 rounded-t-xs"></div>
                                        <div className="w-1 h-4 bg-green-500 rounded-t-xs"></div>
                                        <div className="w-1 h-2.5 bg-green-500/40 rounded-t-xs"></div>
                                      </div>
                                      <span className="text-[11px] font-mono text-green-400 font-bold">
                                        {tool.latencyMs}ms
                                      </span>
                                    </div>
                                  </div>

                                  {/* Rating */}
                                  <div className="md:col-span-1 text-left md:text-center font-mono text-xs text-indigo-400 font-bold">
                                    ⭐ {tool.rating}
                                  </div>

                                  {/* Cost Tier */}
                                  <div className="md:col-span-2 flex items-center gap-1.5">
                                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300 font-semibold">
                                      {tool.pricing}
                                    </span>
                                  </div>

                                  {/* Actions */}
                                  <div className="md:col-span-1 flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => setActiveToolRunner(tool)}
                                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] rounded transition-all uppercase tracking-wider font-mono cursor-pointer"
                                    >
                                      Run
                                    </button>
                                  </div>

                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* GRID CARDS VIEW */
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-2.5">
                            {paginatedTools.map((tool) => (
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
                      )}

                      {/* PAGINATION BAR FOR TABLE & GRID VIEWS */}
                      {viewMode !== 'categories' && filteredTools.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#151517] border border-white/10 p-3.5 rounded-xl text-xs font-mono text-slate-400 shadow-lg">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">Page {currentPage} of {totalPages}</span>
                            <span className="text-slate-600">•</span>
                            <span>
                              Showing {pageSize === 0 ? 1 : Math.min((currentPage - 1) * pageSize + 1, filteredTools.length)}–
                              {pageSize === 0 ? filteredTools.length : Math.min(currentPage * pageSize, filteredTools.length)} of {filteredTools.length} AI Tools
                            </span>
                          </div>

                          <div className="flex items-center gap-3 flex-wrap">
                            {/* Page size selector */}
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <span className="text-slate-500">Per Page:</span>
                              <select
                                value={pageSize}
                                onChange={(e) => {
                                  setPageSize(Number(e.target.value));
                                  setCurrentPage(1);
                                }}
                                className="bg-[#0A0A0A] text-white border border-white/10 rounded-lg px-2.5 py-1 text-xs font-mono focus:outline-none focus:border-indigo-500 cursor-pointer"
                              >
                                <option value={12}>12</option>
                                <option value={24}>24</option>
                                <option value={48}>48</option>
                                <option value={96}>96</option>
                                <option value={0}>All ({filteredTools.length})</option>
                              </select>
                            </div>

                            {/* Pagination Navigation Buttons & Page Numbers */}
                            <div className="flex items-center gap-1">
                              <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer font-medium flex items-center gap-1"
                              >
                                <ChevronLeft className="w-4 h-4" /> Prev
                              </button>
                              
                              {/* Page Number Buttons */}
                              <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                  let pageNum = i + 1;
                                  if (totalPages > 5 && currentPage > 3) {
                                    pageNum = currentPage - 2 + i;
                                    if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                                  }
                                  return (
                                    <button
                                      key={pageNum}
                                      onClick={() => setCurrentPage(pageNum)}
                                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                        currentPage === pageNum
                                          ? 'bg-indigo-600 text-white shadow'
                                          : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                                      }`}
                                    >
                                      {pageNum}
                                    </button>
                                  );
                                })}
                              </div>

                              <button
                                disabled={currentPage >= totalPages}
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer font-medium flex items-center gap-1"
                              >
                                Next <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PROMPT LIBRARY */}
            {activeTab === 'prompts' && (
              <PromptLibraryTab onRunPromptInTool={handleRunPromptInTool} />
            )}

            {/* TAB 4: SAVED FAVORITES & HISTORY */}
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

      {/* Comparison Matrix Modal */}
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

      {/* Power User Latency Settings Modal */}
      <LatencySettingsModal
        isOpen={isLatencySettingsOpen}
        onClose={() => setIsLatencySettingsOpen(false)}
      />

      {/* Tool Credit & Pricing Tiers Modal */}
      <PricingTiersModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        userCredits={userCredits}
        onTopUpCredits={handleTopUpCredits}
      />

      {/* Multi-Platform Firebase Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        userCredits={userCredits}
      />

      {/* New Tools Notification Modal */}
      <NewToolsNotificationModal
        isOpen={isNewToolsModalOpen}
        onClose={() => setIsNewToolsModalOpen(false)}
        allTools={toolsList}
        onSelectTool={(tool) => {
          setActiveToolRunner(tool);
          setActiveTab('marketplace');
        }}
        unreadCount={unreadNewToolsCount}
        onMarkAllRead={() => setUnreadNewToolsCount(0)}
      />

      {/* Floating Interactive AI Consultant Chat Widget */}
      <AIConsultantWidget
        allTools={toolsList}
        onSelectTool={(tool) => {
          setActiveToolRunner(tool);
          setActiveTab('marketplace');
        }}
      />

      {/* Universal Footer */}
      <Footer />

    </div>
  );
}
