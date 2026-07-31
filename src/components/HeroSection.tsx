import React from 'react';
import { 
  Sparkles, 
  Activity, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Users, 
  Search, 
  Layers, 
  TrendingUp, 
  SlidersHorizontal 
} from 'lucide-react';
import { CATEGORIES_LIST } from '../data/toolsData';
import { ToolCategory } from '../types';

interface HeroSectionProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  pricingFilter: string;
  setPricingFilter: (p: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  totalFilteredCount: number;
  onSelectTag?: (tag: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  pricingFilter,
  setPricingFilter,
  sortBy,
  setSortBy,
  totalFilteredCount,
  onSelectTag,
}) => {
  const popularTags = [
    'Chat', 'SEO', 'Resume', 'Image', 'Avatar', 'Video', 'Cinema', 'Voice', 'Audio', 
    'PDF', 'Document', 'Code', 'Dev', 'Business', 'Analytics', 'Marketing', 'Automation'
  ];
  return (
    <div className="relative overflow-hidden bg-[#0A0A0A] text-[#E0E0E0] border-b border-white/10 pt-6 pb-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="w-full relative z-10 space-y-6">
        
        {/* Top Header & Tag line */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-white/5">
          <div>
            <div className="inline-flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-indigo-400 mb-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              Neural Market Intelligence Platform
            </div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-white">
              AI Tools & High-Speed Execution Matrix
            </h1>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter 800+ AI entities..."
              className="w-full pl-9 pr-20 py-1.5 bg-[#151517] text-white placeholder-slate-500 text-xs rounded border border-white/10 focus:border-indigo-500/80 focus:outline-none font-mono"
            />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-indigo-400 font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
              {totalFilteredCount} Tools
            </span>
          </div>
        </div>

        {/* Top High Density Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-[#151517] border border-white/5 p-3 rounded-lg flex flex-col justify-between">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Market Index</div>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono flex items-center gap-1.5">
              14,892.4
              <span className="text-xs text-green-400 font-normal">+2.4%</span>
            </div>
          </div>

          <div className="bg-[#151517] border border-white/5 p-3 rounded-lg flex flex-col justify-between">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Active AI Tools</div>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono">
              842 <span className="text-xs text-slate-400 font-normal">entities</span>
            </div>
          </div>

          <div className="bg-[#151517] border border-white/5 p-3 rounded-lg flex flex-col justify-between">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Network Latency</div>
            <div className="text-xl sm:text-2xl font-bold text-green-400 font-mono flex items-center gap-1">
              <Zap className="w-4 h-4 fill-green-400" /> 145ms
            </div>
          </div>

          <div className="bg-[#151517] border border-white/5 p-3 rounded-lg flex flex-col justify-between">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Router Performance</div>
            <div className="text-xl sm:text-2xl font-bold text-indigo-400 font-mono">
              98.2% <span className="text-xs text-green-400 font-normal">SLA</span>
            </div>
          </div>
        </div>

        {/* Category Pills & Filters */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mr-1 shrink-0 font-mono">
              Categories:
            </span>
            {CATEGORIES_LIST.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-500 font-bold shadow'
                      : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Live Tags Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none font-mono">
            <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400 mr-1 shrink-0">
              Live Tags:
            </span>
            {popularTags.map((tag) => {
              const q = searchQuery.toLowerCase().replace(/^#/, '');
              const isTagActive = q === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  onClick={() => onSelectTag ? onSelectTag(tag) : setSearchQuery(tag)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap transition-all border cursor-pointer ${
                    isTagActive
                      ? 'bg-indigo-600 text-white border-indigo-400 font-bold shadow'
                      : 'bg-indigo-950/40 text-indigo-300 border-indigo-500/25 hover:bg-indigo-600/80 hover:text-white'
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>

          {/* Pricing & Sorting Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-white/5">
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-slate-500 uppercase tracking-wider font-bold">Tier:</span>
              {['All', 'Free', 'Freemium', 'Paid'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPricingFilter(p)}
                  className={`px-2 py-0.5 rounded font-medium transition-colors ${
                    pricingFilter === p
                      ? 'bg-white/10 text-indigo-300 border border-white/10 font-bold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="text-slate-500 uppercase tracking-wider font-bold">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#151517] text-slate-200 border border-white/10 rounded px-2 py-1 focus:outline-none focus:border-indigo-500 cursor-pointer text-xs font-mono"
              >
                <option value="featured">Featured Benchmarks</option>
                <option value="rating">Highest User Rating</option>
                <option value="latency">Fastest Response Time</option>
                <option value="runs">Most Daily Runs</option>
                <option value="name">Entity Name (A-Z)</option>
              </select>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
