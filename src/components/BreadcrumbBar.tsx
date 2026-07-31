import React from 'react';
import { 
  ChevronRight, 
  Home, 
  Layers, 
  Cpu, 
  BookOpen, 
  History, 
  Tag, 
  X, 
  Search, 
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { AITool } from '../types';

interface BreadcrumbBarProps {
  activeTab: 'marketplace' | 'providers' | 'prompts' | 'history';
  setActiveTab: (tab: 'marketplace' | 'providers' | 'prompts' | 'history') => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  activeToolRunner: AITool | null;
  setActiveToolRunner: (tool: AITool | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const BreadcrumbBar: React.FC<BreadcrumbBarProps> = ({
  activeTab,
  setActiveTab,
  selectedCategory,
  setSelectedCategory,
  activeToolRunner,
  setActiveToolRunner,
  searchQuery,
  setSearchQuery,
}) => {
  const handleHomeClick = () => {
    setActiveToolRunner(null);
    setActiveTab('marketplace');
    setSelectedCategory('All Categories');
    setSearchQuery('');
  };

  const handleCategoryClick = (categoryName: string) => {
    setActiveToolRunner(null);
    setActiveTab('marketplace');
    setSelectedCategory(categoryName);
  };

  const tabLabels: Record<string, { label: string; icon: React.ReactNode }> = {
    marketplace: { label: 'Marketplace', icon: <Home className="w-3.5 h-3.5" /> },
    history: { label: 'Dashboard & History', icon: <History className="w-3.5 h-3.5" /> },
  };

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="w-full bg-[#090A0F]/90 border-b border-white/10 px-4 sm:px-6 lg:px-8 py-2.5 backdrop-blur-md sticky top-16 z-30 font-mono text-xs text-slate-400 select-none shadow-sm transition-all"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        
        {/* Breadcrumb Path Segments */}
        <ol className="flex items-center flex-wrap gap-1.5 sm:gap-2">
          
          {/* Root Home / Marketplace */}
          <li className="flex items-center">
            <button
              onClick={handleHomeClick}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all cursor-pointer ${
                activeTab === 'marketplace' && !activeToolRunner && selectedCategory === 'All Categories' && !searchQuery
                  ? 'text-indigo-400 font-bold bg-indigo-500/10 border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
              title="Return to Marketplace Home"
            >
              <Home className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Marketplace</span>
            </button>
          </li>

          {/* Tab Level (If not marketplace or if runner is active) */}
          {activeTab !== 'marketplace' && (
            <>
              <li className="text-slate-600">
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li className="flex items-center">
                <span className="flex items-center gap-1.5 px-2 py-1 bg-indigo-500/10 text-indigo-300 font-bold border border-indigo-500/20 rounded-md">
                  {tabLabels[activeTab]?.icon}
                  <span>{tabLabels[activeTab]?.label}</span>
                </span>
              </li>
            </>
          )}

          {/* Active Tool Runner Path */}
          {activeToolRunner ? (
            <>
              {/* Category Segment */}
              <li className="text-slate-600">
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li className="flex items-center">
                <button
                  onClick={() => handleCategoryClick(activeToolRunner.category)}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-slate-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  title={`View all tools in ${activeToolRunner.category}`}
                >
                  <Tag className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{activeToolRunner.category}</span>
                </button>
              </li>

              {/* Tool Name Segment */}
              <li className="text-slate-600">
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li className="flex items-center">
                <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold rounded-md shadow-sm">
                  <Sparkles className="w-3 h-3 text-emerald-400 shrink-0 animate-pulse" />
                  <span className="truncate max-w-[180px] sm:max-w-[280px]">{activeToolRunner.name}</span>
                </span>
              </li>
            </>
          ) : activeTab === 'marketplace' ? (
            <>
              {/* Category Segment in Marketplace */}
              {selectedCategory !== 'All Categories' && (
                <>
                  <li className="text-slate-600">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </li>
                  <li className="flex items-center">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-bold rounded-md">
                      <Tag className="w-3 h-3 text-indigo-400 shrink-0" />
                      <span>{selectedCategory}</span>
                      <button
                        onClick={() => setSelectedCategory('All Categories')}
                        className="ml-1 text-slate-400 hover:text-white hover:bg-white/20 rounded p-0.5 transition-colors cursor-pointer"
                        title="Clear category filter"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </li>
                </>
              )}

              {/* Search Query Filter Segment */}
              {searchQuery && (
                <>
                  <li className="text-slate-600">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </li>
                  <li className="flex items-center">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-500/15 border border-purple-500/30 text-purple-300 font-bold rounded-md">
                      <Search className="w-3 h-3 text-purple-400 shrink-0" />
                      <span className="truncate max-w-[150px]">"{searchQuery}"</span>
                      <button
                        onClick={() => setSearchQuery('')}
                        className="ml-1 text-slate-400 hover:text-white hover:bg-white/20 rounded p-0.5 transition-colors cursor-pointer"
                        title="Clear search query"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </li>
                </>
              )}
            </>
          ) : null}
        </ol>

        {/* Quick Action Button on Right Side */}
        {activeToolRunner && (
          <button
            onClick={() => setActiveToolRunner(null)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-bold rounded-md border border-slate-700 transition-colors text-[11px] cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3 text-indigo-400" />
            <span>Exit Runner</span>
          </button>
        )}
      </div>
    </nav>
  );
};
