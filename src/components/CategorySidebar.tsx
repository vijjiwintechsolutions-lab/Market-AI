import React from 'react';
import { 
  Layers, 
  FileText, 
  Image as ImageIcon, 
  Volume2, 
  Video, 
  Code2, 
  Database, 
  CheckSquare, 
  TrendingUp, 
  Search, 
  Gamepad2, 
  BarChart3,
  Sparkles,
  ChevronRight,
  SlidersHorizontal,
  Zap
} from 'lucide-react';
import { CATEGORIES_LIST } from '../data/toolsData';
import { AITool } from '../types';

interface CategorySidebarProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  toolsList: AITool[];
  pricingFilter: string;
  setPricingFilter: (p: string) => void;
  favoriteCount: number;
  onSelectTag?: (tag: string) => void;
  searchQuery?: string;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  selectedCategory,
  setSelectedCategory,
  toolsList,
  pricingFilter,
  setPricingFilter,
  favoriteCount,
  onSelectTag,
  searchQuery = '',
}) => {
  // Extract top popular tags from toolsList
  const allTags = React.useMemo(() => {
    const counts: Record<string, number> = {};
    toolsList.forEach((t) => {
      t.tags?.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 16)
      .map(([tag]) => tag);
  }, [toolsList]);
  // Compute count of tools per category
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {
      'All Categories': toolsList.length,
    };
    toolsList.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, [toolsList]);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'All Categories':
        return <Layers className="w-3.5 h-3.5 text-indigo-400" />;
      case 'Text & Writing':
        return <FileText className="w-3.5 h-3.5 text-blue-400" />;
      case 'Image AI':
        return <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Video AI':
        return <Video className="w-3.5 h-3.5 text-rose-400" />;
      case 'Audio & Voice':
        return <Volume2 className="w-3.5 h-3.5 text-amber-400" />;
      case 'PDF & Documents':
        return <Database className="w-3.5 h-3.5 text-purple-400" />;
      case 'Coding & Dev':
        return <Code2 className="w-3.5 h-3.5 text-teal-400" />;
      case 'Business & Marketing':
        return <BarChart3 className="w-3.5 h-3.5 text-yellow-400" />;
      case 'SEO & Copywriting':
        return <TrendingUp className="w-3.5 h-3.5 text-green-400" />;
      case 'Education & Study':
        return <CheckSquare className="w-3.5 h-3.5 text-indigo-400" />;
      case 'Utilities & Convert':
        return <Zap className="w-3.5 h-3.5 text-sky-400" />;
      case 'Design & Web AI':
        return <Gamepad2 className="w-3.5 h-3.5 text-fuchsia-400" />;
      case 'Data & Analytics':
        return <Search className="w-3.5 h-3.5 text-orange-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-4 font-sans">
      
      {/* Category List Box */}
      <div className="bg-[#151517] border border-white/10 rounded-lg p-3 space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-white/10 px-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            Market Segments
          </div>
          <span className="text-[10px] text-slate-500 font-mono bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
            {toolsList.length} entities
          </span>
        </div>

        <div className="space-y-0.5">
          {CATEGORIES_LIST.map((cat) => {
            const isActive = selectedCategory === cat;
            const count = categoryCounts[cat] || 0;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/90 text-white font-bold border border-indigo-500 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {getCategoryIcon(cat)}
                  <span className="truncate">{cat}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      isActive
                        ? 'bg-white/20 text-white font-bold'
                        : 'bg-white/5 text-slate-500'
                    }`}
                  >
                    {count}
                  </span>
                  {isActive && <ChevronRight className="w-3 h-3 text-indigo-200" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pricing Filter Card */}
      <div className="bg-[#151517] border border-white/10 rounded-lg p-3 space-y-2">
        <div className="flex items-center gap-1.5 pb-2 border-b border-white/10 text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
          Access Tier
        </div>
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          {['All', 'Free', 'Freemium', 'Paid'].map((tier) => (
            <button
              key={tier}
              onClick={() => setPricingFilter(tier)}
              className={`px-2 py-1.5 rounded text-xs font-mono font-medium text-center transition-all cursor-pointer border ${
                pricingFilter === tier
                  ? 'bg-indigo-600 text-white border-indigo-500 font-bold'
                  : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Popular Tags Live Filter Card */}
      {allTags.length > 0 && (
        <div className="bg-[#151517] border border-white/10 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-[11px] font-bold text-indigo-400 uppercase tracking-wider font-mono">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Popular Live Tags
            </span>
          </div>
          <div className="flex flex-wrap gap-1 pt-1 font-mono">
            {allTags.map((tag) => {
              const currentQ = searchQuery.toLowerCase().replace(/^#/, '');
              const isSelected = currentQ === tag.toLowerCase();
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onSelectTag?.(tag)}
                  className={`text-[10px] px-2 py-0.5 rounded transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-400 font-bold shadow'
                      : 'bg-indigo-500/10 text-indigo-300 hover:bg-indigo-600 hover:text-white border-indigo-500/20'
                  }`}
                  title={`Filter tools by #${tag}`}
                >
                  #{tag}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SLA Metric Card */}
      <div className="bg-[#151517] border border-white/10 rounded-lg p-3 text-xs space-y-2">
        <div className="flex items-center gap-2 text-green-400 font-mono font-bold text-[11px]">
          <Zap className="w-3.5 h-3.5 fill-green-400" />
          <span>Real-time Health SLA</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
          Auto failover enabled across Google Gemini, Groq, Pollinations & HuggingFace endpoints.
        </p>
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-white/5">
          <span>Saved Favorites:</span>
          <span className="text-indigo-400 font-bold">{favoriteCount}</span>
        </div>
      </div>

    </aside>
  );
};
