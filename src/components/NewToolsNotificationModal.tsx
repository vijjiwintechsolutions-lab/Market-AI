import React from 'react';
import {
  Bell,
  X,
  Sparkles,
  Zap,
  ArrowRight,
  Flame,
  CheckCheck,
  Calendar,
  Layers,
} from 'lucide-react';
import { AITool } from '../types';

export interface NewToolNotification {
  id: string;
  toolId: string;
  title: string;
  description: string;
  category: string;
  addedDate: string;
  isNew: boolean;
  credits: number;
}

export const NEW_TOOLS_NOTIFICATIONS: NewToolNotification[] = [
  {
    id: 'notif-veo-video',
    toolId: 'veo-video-generator',
    title: 'Google Veo Video Synth Launched!',
    description: 'Create cinematic 1080p 60FPS video content from text or image prompts in seconds.',
    category: 'Video & Animation',
    addedDate: 'Today',
    isNew: true,
    credits: 5,
  },
  {
    id: 'notif-gemini-chat',
    toolId: 'ai-chat-pro',
    title: 'Gemini 3.6 Flash Studio Upgrade',
    description: 'Ultra-fast multi-turn reasoning with instant streaming and system instruction customization.',
    category: 'Text & Writing',
    addedDate: 'Today',
    isNew: true,
    credits: 1,
  },
  {
    id: 'notif-autonomous-agent',
    toolId: 'autonomous-agent-executor',
    title: 'Multi-Agent Task Runner Released',
    description: 'Deploy autonomous agent swarms to execute web scraping, data research, and automated synthesis.',
    category: 'Autonomous Agents',
    addedDate: 'Yesterday',
    isNew: true,
    credits: 8,
  },
  {
    id: 'notif-speech-synth',
    toolId: 'voice-speech-synthesizer',
    title: 'Gemini Voice & Speech Cloner',
    description: 'High-fidelity prebuilt voice synthesis for podcasts, video voiceovers, and dynamic dialogs.',
    category: 'Audio & Voice',
    addedDate: '2 days ago',
    isNew: false,
    credits: 2,
  },
  {
    id: 'notif-flux-image',
    toolId: 'flux-image-studio',
    title: 'Flux Pro Image & Avatar Engine',
    description: 'Generate photorealistic images and custom avatar styles with granular prompt controls.',
    category: 'Image & Design',
    addedDate: '3 days ago',
    isNew: false,
    credits: 2,
  },
];

interface NewToolsNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  allTools: AITool[];
  onSelectTool: (tool: AITool) => void;
  unreadCount: number;
  onMarkAllRead: () => void;
}

export const NewToolsNotificationModal: React.FC<NewToolsNotificationModalProps> = ({
  isOpen,
  onClose,
  allTools,
  onSelectTool,
  unreadCount,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-[#0E0E14] border border-white/15 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* HEADER */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-[#13131A] to-indigo-950/80 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-inner relative">
              <Bell className="w-5 h-5 text-amber-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 text-white font-extrabold text-[9px] rounded-full flex items-center justify-center border border-[#0E0E14]">
                  {unreadCount}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                New Tools & Updates
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Latest flagship AI tools added to Market1 AI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-mono rounded-lg border border-white/10 flex items-center gap-1 transition-all cursor-pointer"
                title="Mark all notifications as read"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Mark Read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer border border-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* NOTIFICATIONS LIST */}
        <div className="p-5 overflow-y-auto space-y-3.5 divide-y divide-white/5">
          {NEW_TOOLS_NOTIFICATIONS.map((item) => {
            const matchedTool = allTools.find(
              (t) => t.id === item.toolId || t.slug === item.toolId
            );

            return (
              <div
                key={item.id}
                className={`pt-3.5 first:pt-0 flex flex-col gap-2.5 p-3.5 rounded-xl transition-all border ${
                  item.isNew
                    ? 'bg-indigo-950/20 border-indigo-500/30'
                    : 'bg-[#13131C]/60 border-white/5'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {item.isNew && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-bold font-mono uppercase tracking-wider flex items-center gap-1">
                        <Flame className="w-2.5 h-2.5 text-amber-400" /> NEW
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded bg-white/5 text-slate-300 text-[10px] font-mono font-semibold">
                      {item.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {item.addedDate}
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-white tracking-wide">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 font-mono">
                  <span className="text-[10px] text-amber-300 font-bold flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" /> {item.credits} Credits / Task
                  </span>

                  <button
                    onClick={() => {
                      if (matchedTool) {
                        onSelectTool(matchedTool);
                      } else {
                        // Default fallback tool launcher
                        const fallbackTool = allTools[0];
                        if (fallbackTool) onSelectTool(fallbackTool);
                      }
                      onClose();
                    }}
                    className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow"
                  >
                    <span>Launch Tool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="p-4 bg-[#0A0A0D] border-t border-white/10 text-xs font-mono text-slate-400 flex items-center justify-between">
          <span>Market1 AI Tool Release Feed</span>
          <span className="text-emerald-400 font-bold">Auto-Updated Daily</span>
        </div>
      </div>
    </div>
  );
};
