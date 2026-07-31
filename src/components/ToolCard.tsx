import React from 'react';
import { 
  Star, 
  Zap, 
  Heart, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  ArrowUpRight,
  MessageSquareText,
  FileText,
  Award,
  UserCheck,
  Maximize2,
  Mic,
  Volume2,
  FileSearch,
  ScanText,
  Code2,
  Database,
  TrendingUp,
  Share2,
  Video,
  GraduationCap,
  Wand2,
  Layers,
  Check
} from 'lucide-react';
import { AITool } from '../types';

interface ToolCardProps {
  tool: AITool;
  onRunTool: (tool: AITool) => void;
  isFavorite: boolean;
  onToggleFavorite: (toolId: string) => void;
  isCompared: boolean;
  onToggleCompare: (tool: AITool) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  tool,
  onRunTool,
  isFavorite,
  onToggleFavorite,
  isCompared,
  onToggleCompare,
}) => {
  // Map string icon names to Lucide icon components
  const renderIcon = (iconName: string, className = 'w-5 h-5 text-indigo-400') => {
    const props = { className };
    switch (iconName) {
      case 'MessageSquareText': return <MessageSquareText {...props} />;
      case 'FileText': return <FileText {...props} />;
      case 'Award': return <Award {...props} />;
      case 'UserCheck': return <UserCheck {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'Layers': return <Layers {...props} />;
      case 'Maximize2': return <Maximize2 {...props} />;
      case 'Mic': return <Mic {...props} />;
      case 'Volume2': return <Volume2 {...props} />;
      case 'FileSearch': return <FileSearch {...props} />;
      case 'ScanText': return <ScanText {...props} />;
      case 'Code2': return <Code2 {...props} />;
      case 'Database': return <Database {...props} />;
      case 'TrendingUp': return <TrendingUp {...props} />;
      case 'Share2': return <Share2 {...props} />;
      case 'Video': return <Video {...props} />;
      case 'GraduationCap': return <GraduationCap {...props} />;
      case 'Wand2': return <Wand2 {...props} />;
      default: return <Sparkles {...props} />;
    }
  };

  const getLatencyColor = (latencyMs: number) => {
    if (latencyMs < 200) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (latencyMs < 500) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
  };

  const getToolThumbnail = (t: AITool): string => {
    if (t.imageUrl) return t.imageUrl;

    const id = t.id.toLowerCase();
    const cat = t.category.toLowerCase();
    const sub = t.subcategory.toLowerCase();

    if (id.includes('chat') || sub.includes('chat') || sub.includes('assistant')) {
      return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';
    }
    if (id.includes('article') || id.includes('blog') || sub.includes('article') || sub.includes('blog') || sub.includes('humanizer')) {
      return 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80';
    }
    if (id.includes('resume') || sub.includes('resume') || sub.includes('career')) {
      return 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80';
    }
    if (id.includes('avatar') || sub.includes('avatar') || sub.includes('text to image') || cat.includes('image')) {
      return 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80';
    }
    if (id.includes('background') || sub.includes('background') || sub.includes('remover')) {
      return 'https://images.unsplash.com/photo-1542744094-3a31b272c490?auto=format&fit=crop&w=600&q=80';
    }
    if (id.includes('upscal') || id.includes('enhan') || sub.includes('upscaler') || sub.includes('enhanc')) {
      return 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80';
    }
    if (id.includes('voice') || id.includes('tts') || sub.includes('voice') || sub.includes('speech')) {
      return 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80';
    }
    if (cat.includes('audio') || sub.includes('audio') || sub.includes('music') || sub.includes('sound')) {
      return 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80';
    }
    if (cat.includes('video') || sub.includes('video') || sub.includes('cinema') || sub.includes('subtitle')) {
      return 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=600&q=80';
    }
    if (cat.includes('pdf') || cat.includes('document') || sub.includes('pdf') || sub.includes('summarizer')) {
      return 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=600&q=80';
    }
    if (cat.includes('code') || sub.includes('code') || sub.includes('dev') || sub.includes('refactor') || sub.includes('sql')) {
      return 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80';
    }
    if (cat.includes('business') || cat.includes('marketing') || cat.includes('seo') || sub.includes('seo') || sub.includes('growth')) {
      return 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80';
    }
    if (cat.includes('design') || sub.includes('design') || sub.includes('web') || sub.includes('ui')) {
      return 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=600&q=80';
    }
    if (cat.includes('education') || sub.includes('study') || sub.includes('academic') || sub.includes('tutor')) {
      return 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80';
    }
    if (cat.includes('data') || sub.includes('analytics') || sub.includes('data')) {
      return 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80';
    }

    return 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80';
  };

  const thumbnailUrl = getToolThumbnail(tool);

  // Determine category banner theme & live backend endpoint
  const getCategoryBanner = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('image')) {
      return {
        gradient: 'from-purple-900/60 via-indigo-950/80 to-[#0A0A0E]',
        border: 'border-purple-500/30 group-hover:border-purple-400/60',
        badgeColor: 'text-purple-300 bg-purple-500/10 border-purple-500/30',
        endpoint: '/api/ai/image',
        accentColor: '#a855f7',
        animationClass: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/20 via-indigo-600/10 to-transparent'
      };
    }
    if (cat.includes('video')) {
      return {
        gradient: 'from-rose-900/60 via-indigo-950/80 to-[#0A0A0E]',
        border: 'border-rose-500/30 group-hover:border-rose-400/60',
        badgeColor: 'text-rose-300 bg-rose-500/10 border-rose-500/30',
        endpoint: '/api/ai/video',
        accentColor: '#f43f5e',
        animationClass: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-600/20 via-indigo-600/10 to-transparent'
      };
    }
    if (cat.includes('audio') || cat.includes('voice')) {
      return {
        gradient: 'from-amber-900/60 via-indigo-950/80 to-[#0A0A0E]',
        border: 'border-amber-500/30 group-hover:border-amber-400/60',
        badgeColor: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
        endpoint: '/api/ai/audio',
        accentColor: '#f59e0b',
        animationClass: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-600/20 via-indigo-600/10 to-transparent'
      };
    }
    if (cat.includes('document') || cat.includes('pdf')) {
      return {
        gradient: 'from-blue-900/60 via-indigo-950/80 to-[#0A0A0E]',
        border: 'border-blue-500/30 group-hover:border-blue-400/60',
        badgeColor: 'text-blue-300 bg-blue-500/10 border-blue-500/30',
        endpoint: '/api/ai/analyze',
        accentColor: '#3b82f6',
        animationClass: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-indigo-600/10 to-transparent'
      };
    }
    return {
      gradient: 'from-indigo-900/60 via-slate-950/80 to-[#0A0A0E]',
      border: 'border-indigo-500/30 group-hover:border-indigo-400/60',
      badgeColor: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/30',
      endpoint: '/api/ai/text',
      accentColor: '#6366f1',
      animationClass: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-600/20 via-slate-800/10 to-transparent'
    };
  };

  const banner = getCategoryBanner(tool.category);

  return (
    <div className="group relative bg-[#0F0F13] border border-white/10 hover:border-indigo-500/50 rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-0.5">
      
      {/* REAL TILE THUMBNAIL HEADER */}
      <div className="relative h-36 w-full bg-slate-950 border-b border-white/10 overflow-hidden group">
        {/* Real Thumbnail Background Image */}
        <img
          src={thumbnailUrl}
          alt={tool.name}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500 opacity-75 group-hover:opacity-90"
          loading="lazy"
        />
        
        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F13] via-[#0F0F13]/40 to-black/30"></div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex flex-col justify-between p-3">
          {/* Top Row: Subcategory Badge & Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            <span className="px-2 py-0.5 bg-black/70 backdrop-blur-md border border-white/15 rounded text-[10px] font-mono text-indigo-200 font-bold tracking-wide shadow-md flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {tool.subcategory}
            </span>

            <div className="flex items-center gap-1">
              {tool.badge && (
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border shadow-md backdrop-blur-md ${
                  tool.badge === 'HOT' ? 'bg-rose-500/80 text-white border-rose-400' :
                  tool.badge === 'POPULAR' ? 'bg-amber-500/80 text-white border-amber-400' :
                  'bg-emerald-500/80 text-white border-emerald-400'
                }`}>
                  {tool.badge}
                </span>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(tool.id);
                }}
                className={`p-1.5 rounded-lg backdrop-blur-md border transition-all ${
                  isFavorite
                    ? 'bg-rose-500/80 text-white border-rose-400 shadow'
                    : 'bg-black/60 text-slate-200 border-white/20 hover:text-rose-400 hover:bg-black/80'
                }`}
                title={isFavorite ? 'Remove from Saved' : 'Save Tool'}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white text-white' : ''}`} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCompare(tool);
                }}
                className={`px-2 py-1 rounded-lg backdrop-blur-md border text-[10px] font-mono font-bold flex items-center gap-1 transition-all ${
                  isCompared
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow'
                    : 'bg-black/60 text-slate-200 border-white/20 hover:text-white hover:bg-black/80'
                }`}
                title="Compare tool"
              >
                {isCompared ? <Check className="w-3 h-3 text-white" /> : <span>VS</span>}
              </button>
            </div>
          </div>

          {/* Bottom Row: Icon & Tool Category */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-black/80 backdrop-blur-md border border-white/25 flex items-center justify-center p-2 shadow-lg group-hover:border-indigo-400/80 transition-colors">
              {renderIcon(tool.iconName, 'w-5 h-5 text-indigo-300')}
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-300 font-bold uppercase tracking-wider bg-black/60 px-1.5 py-0.5 rounded border border-white/10">
                {tool.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CARD BODY */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        
        <div className="space-y-2">
          {/* Title & Category Line */}
          <div>
            <h3 className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors line-clamp-1">
              {tool.name}
            </h3>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              {tool.category} • <span className="text-slate-300">{tool.subcategory}</span>
            </p>
          </div>

          {/* Short Description */}
          <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed">
            {tool.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 pt-1">
            {tool.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5 font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* BOTTOM METRICS & LAUNCH CTA */}
        <div className="pt-3 border-t border-white/5 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{tool.rating}</span>
              <span className="text-slate-500 font-normal">({tool.reviewCount})</span>
            </div>

            <div className={`px-2 py-0.5 rounded border text-[10px] font-bold flex items-center gap-1 ${getLatencyColor(tool.latencyMs)}`}>
              <Zap className="w-3 h-3" />
              <span>{tool.latencyMs}ms</span>
            </div>

            <div className="text-slate-400 text-[10px] font-semibold">
              {tool.pricing}
            </div>
          </div>

          {/* Primary CTA Button */}
          <button
            onClick={() => onRunTool(tool)}
            className="w-full py-2.5 px-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs rounded-lg shadow-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer uppercase tracking-wider font-mono group-hover:shadow-indigo-500/25"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Launch Tool</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>

    </div>
  );
};
