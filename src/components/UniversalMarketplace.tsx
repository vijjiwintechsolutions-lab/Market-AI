// =====================================================================
// MARKET1 UNIVERSAL MARKETPLACE (MUTE)
// Dynamically renders, searches, and filters all tools from the Registry.
// =====================================================================

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, LayoutGrid, Zap, Cpu, Sparkles, ArrowRight } from 'lucide-react';
import { MuteToolConfig } from '../types/mute';

interface UniversalMarketplaceProps {
  tools: MuteToolConfig[];
}

export const UniversalMarketplace: React.FC<UniversalMarketplaceProps> = ({ tools }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // 🚀 DYNAMIC CATEGORY GENERATOR (No Hardcoding!)
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(tools.map(t => t.category)));
    return ['All', ...uniqueCategories.sort()];
  }, [tools]);

  // 🚀 DYNAMIC SEARCH & FILTER ENGINE
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        tool.name.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower) ||
        tool.seoKeywords.some(keyword => keyword.toLowerCase().includes(searchLower));
      
      return matchesCategory && matchesSearch;
    });
  }, [tools, searchQuery, activeCategory]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] font-mono pb-20">
      
      {/* --------------------------------------------------------- */}
      {/* 1. HERO & SEARCH SECTION */}
      {/* --------------------------------------------------------- */}
      <div className="w-full bg-[#151517] border-b border-white/10 pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-extrabold uppercase tracking-widest mb-4">
          <Sparkles className="w-3 h-3" /> Powered by MUTE Engine
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          One Platform. <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Every Tool.</span>
        </h1>
        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
          Access {tools.length}+ enterprise-grade tools for PDF, AI, Images, Video, and Development. 
          Processed securely in your browser or our high-speed cloud.
        </p>

        <div className="max-w-2xl mx-auto relative mt-8">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-4 bg-[#0A0A0A] border border-white/20 rounded-2xl text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-sans"
            placeholder="Search for tools (e.g., 'Compress PDF', 'AI Image')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --------------------------------------------------------- */}
        {/* 2. DYNAMIC SIDEBAR (CATEGORIES) */}
        {/* --------------------------------------------------------- */}
        <div className="lg:col-span-3 space-y-2">
          <div className="flex items-center gap-2 mb-4 px-2">
            <LayoutGrid className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">Categories</h3>
          </div>
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`flex-shrink-0 text-left px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  activeCategory === category 
                    ? 'bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-900/20' 
                    : 'bg-[#151517] border border-white/5 text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* 3. DYNAMIC TOOL GRID */}
        {/* --------------------------------------------------------- */}
        <div className="lg:col-span-9">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-white">{activeCategory === 'All' ? 'All Tools' : activeCategory}</h2>
            <span className="text-xs font-bold text-slate-400">{filteredTools.length} tools found</span>
          </div>

          {filteredTools.length === 0 ? (
            <div className="w-full bg-[#151517] border border-white/5 rounded-2xl p-12 text-center">
              <Search className="w-10 h-10 text-slate-500 mx-auto mb-3 opacity-50" />
              <h3 className="text-white font-bold">No tools found</h3>
              <p className="text-slate-400 text-xs mt-1">Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredTools.map((tool) => (
                <Link key={tool.id} href={`/tools/${tool.id}`} className="group block">
                  <div className="h-full bg-[#151517] border border-white/10 hover:border-emerald-500/50 rounded-xl p-5 transition-all hover:shadow-xl hover:shadow-emerald-900/10 flex flex-col justify-between cursor-pointer">
                    
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded border ${
                          tool.engine === 'ai' ? 'bg-purple-600/20 text-purple-300 border-purple-500/30' : 
                          tool.engine === 'browser' ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30' :
                          'bg-blue-600/20 text-blue-300 border-blue-500/30'
                        }`}>
                          {tool.engine} Engine
                        </span>
                        {tool.engine === 'browser' ? <Cpu className="w-4 h-4 text-emerald-500/50" /> : <Zap className="w-4 h-4 text-blue-500/50" />}
                      </div>
                      
                      <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors mb-2">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-sans line-clamp-2">
                        {tool.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500">{tool.category}</span>
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
