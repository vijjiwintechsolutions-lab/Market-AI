import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Copy, 
  Check, 
  Play, 
  ThumbsUp, 
  Search, 
  Tag 
} from 'lucide-react';
import { AIPromptItem, AITool } from '../types';
import { PROMPTS_DATA } from '../data/promptsData';

interface PromptLibraryTabProps {
  onRunPromptInTool: (prompt: AIPromptItem) => void;
}

export const PromptLibraryTab: React.FC<PromptLibraryTabProps> = ({ onRunPromptInTool }) => {
  const [prompts, setPrompts] = useState<AIPromptItem[]>(PROMPTS_DATA);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Text & Writing', 'Image AI', 'Coding & Dev', 'PDF & Documents', 'Business & Marketing'];

  const filtered = prompts.filter((p) => {
    const matchesCat = selectedCat === 'All' || p.category === selectedCat;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.promptText.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLike = (id: string) => {
    setPrompts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-white font-sans">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" /> Curated Prompt Repository
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Master AI Prompt Library
        </h2>
        <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
          Copy high-yield, battle-tested prompts or launch them directly inside Market1 AI tools with a single click.
        </p>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prompts by title, keywords, or tags..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCat(c)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCat === c
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Prompts Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 flex flex-col justify-between space-y-4 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-bold text-white text-base">{item.title}</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                  {item.category}
                </span>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-mono leading-relaxed relative group">
                {item.promptText}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 bg-slate-950 text-slate-400 border border-slate-800 rounded-md">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
              <button
                onClick={() => handleLike(item.id)}
                className="flex items-center gap-1.5 text-slate-400 hover:text-amber-400 transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{item.likes} Likes</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(item.id, item.promptText)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl border border-slate-700 flex items-center gap-1 transition-colors"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === item.id ? 'Copied!' : 'Copy'}</span>
                </button>

                <button
                  onClick={() => onRunPromptInTool(item)}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-md flex items-center gap-1 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>Run in Tool</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
