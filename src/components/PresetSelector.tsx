import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ChevronDown, Wand2, Check, BookmarkPlus, Zap } from 'lucide-react';
import { AITool } from '../types';
import { getPresetsForTool, ToolPreset } from '../data/toolPresets';

interface PresetSelectorProps {
  tool: AITool;
  onApplyPreset: (presetValues: Record<string, any>, presetTitle: string) => void;
  compact?: boolean;
}

export const PresetSelector: React.FC<PresetSelectorProps> = ({
  tool,
  onApplyPreset,
  compact = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [loadedPresetName, setLoadedPresetName] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const presets = getPresetsForTool(tool);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPreset = (preset: ToolPreset) => {
    setActivePresetId(preset.id);
    setLoadedPresetName(preset.title);
    onApplyPreset(preset.values, preset.title);
    setIsOpen(false);

    // Reset indicator highlight after 3 seconds
    setTimeout(() => {
      setLoadedPresetName(null);
    }, 3500);
  };

  if (!presets || presets.length === 0) return null;

  return (
    <div className="relative inline-block text-left font-mono" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 rounded font-bold transition-all cursor-pointer shadow-sm ${
          compact
            ? 'px-2 py-0.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px]'
            : 'px-2.5 py-1 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 hover:from-indigo-800/80 hover:to-purple-800/80 text-indigo-200 border border-indigo-500/40 text-xs shadow-indigo-950/50'
        }`}
        title="Load pre-configured example prompts and parameters for this tool"
      >
        <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse shrink-0" />
        <span>{loadedPresetName ? `Preset: ${loadedPresetName}` : 'Load Preset Example'}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 text-indigo-400 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-72 sm:w-80 bg-[#12131A] border border-indigo-500/40 rounded-xl shadow-2xl z-50 overflow-hidden animate-fadeIn backdrop-blur-xl">
          {/* Header */}
          <div className="px-3.5 py-2.5 bg-indigo-950/40 border-b border-indigo-500/20 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300 uppercase tracking-wider">
              <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Example Prompts</span>
            </div>
            <span className="text-[10px] text-slate-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
              {presets.length} presets
            </span>
          </div>

          {/* Preset Options List */}
          <div className="max-h-64 overflow-y-auto p-1.5 space-y-1 divide-y divide-white/5">
            {presets.map((preset) => {
              const isSelected = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`w-full text-left p-2.5 rounded-lg transition-all flex items-start gap-2.5 cursor-pointer group ${
                    isSelected
                      ? 'bg-indigo-600/20 border border-indigo-500/40 text-white'
                      : 'hover:bg-white/5 text-slate-200'
                  }`}
                >
                  <div className="p-1 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0 mt-0.5 group-hover:bg-indigo-500/20">
                    <BookmarkPlus className="w-3.5 h-3.5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h6 className="text-xs font-bold text-slate-100 group-hover:text-indigo-300 truncate">
                        {preset.title}
                      </h6>
                      {preset.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30 shrink-0">
                          {preset.badge}
                        </span>
                      )}
                    </div>
                    {preset.description && (
                      <p className="text-[10px] text-slate-400 font-sans mt-0.5 line-clamp-2 leading-relaxed">
                        {preset.description}
                      </p>
                    )}
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="p-2 bg-slate-950/80 border-t border-white/5 text-[10px] text-slate-500 text-center font-sans">
            Selecting a preset populates input fields automatically
          </div>
        </div>
      )}
    </div>
  );
};
