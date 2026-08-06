// =====================================================================
// MARKET1 UNIVERSAL MARKETPLACE (MUTE)
// Displays the interactive tool grid with real-time search and filters.
// =====================================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TOOL_REGISTRY } from '../data/registry';
import { Search, Sparkles, Star, ArrowRight, Zap } from 'lucide-react';

interface UniversalMarketplaceProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  favoriteIds: string[];
  setFavoriteIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export const UniversalMarketplace: React.FC<UniversalMarketplaceProps> = ({
  searchQuery,
  setSearchQuery,
  favoriteIds,
  setFavoriteIds,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'PDF & Documents', 'Image & Graphics', 'AI & Text'];

  const filteredTools = TOOL_REGISTRY.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavoriteIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Hero Header */}
      <div className="bg-[#151517] border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Zap className="w-48 h-48 text-emerald-400" />
        </div>
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-bold text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" /> MUTE Architecture Engine v3.0
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Universal AI & Tool <span className="text-emerald-400">Execution Matrix</span>
          </h1>
          <p className="text-slate-400 text-sm font-sans">
            Deploy, configure, and run high-performance enterprise tools instantly from a single unified engine.
          </p>
          
          {/* Search Bar */}
          <div className="relative pt-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools (e.g., PDF, Image, SEO, AI)..."
              className="w-full bg-[#0A0A0A] border border-white/20 rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
              selectedCategory === cat 
                ? 'bg-emerald-600 text-slate-950 border-emerald-500 shadow-lg shadow-emerald-900/20' 
                : 'bg-[#151517] text-slate-400 border-white/10 hover:border-white/20 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map(tool => {
          const isFav = favoriteIds.includes(tool.id);
          return (
            <Link 
              key={tool.id} 
              href={`/tools/${tool.id}`}
              className="group bg-[#151517] border border-white/10 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-emerald-950/20 relative"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border ${
                    tool.engine === 'ai' ? 'bg-purple-600/20 text-purple-300 border-purple-500/30' :
                    tool.engine === 'browser' ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30' :
                    'bg-blue-600/20 text-blue-300 border-blue-500/30'
                  }`}>
                    {tool.engine.toUpperCase()} ENGINE
                  </span>
                  <button 
                    onClick={(e) => toggleFavorite(tool.id, e)}
                    className={`p-2 rounded-lg border transition-colors ${
                      isFav ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' : 'bg-white/5 text-slate-500 border-white/10 hover:text-white'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                  </button>
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-slate-400 text-xs font-sans mt-1.5 line-clamp-2">
                    {tool.description}
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase">
                  {tool.category}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                  Launch Tool <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
