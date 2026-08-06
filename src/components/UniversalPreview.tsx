// =====================================================================
// MARKET1 UNIVERSAL PREVIEW ENGINE (MUTE)
// Automatically paints the correct workspace based on the tool's output.
// =====================================================================

import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, Code, FileText, Music, Video, Copy } from 'lucide-react';
import { MuteToolConfig } from '../types/mute';

interface UniversalPreviewProps {
  tool: MuteToolConfig;
  isRunning: boolean;
  progressPercent: number;
  textOutput: string | null;
  mediaOutputUrl: string | null;
}

// Internal Markdown/Text Formatter
function renderCleanFormattedText(text: string) {
  if (!text) return null;
  return (
    <div className="space-y-2 font-sans text-xs text-slate-200">
      {text.split('\n').map((line, idx) => {
        const trimmed = line.trim();
        if (trimmed === '---') return <hr key={idx} className="border-white/10 my-3" />;
        
        const formatInline = (str: string) => str.split(/(\*\*.*?\*\*)/g).map((part, i) => 
          part.startsWith('**') ? <strong key={i} className="font-extrabold text-white">{part.slice(2, -2)}</strong> : part
        );

        if (trimmed.startsWith('#')) return <div key={idx} className="text-sm font-extrabold text-emerald-400 mt-3 mb-2 flex items-center gap-2 border-b border-white/5 pb-1">{formatInline(trimmed.replace(/^#+\s*/, ''))}</div>;
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) return <div key={idx} className="flex items-start gap-2 pl-2 py-0.5"><span className="text-emerald-400 font-bold">•</span><div>{formatInline(trimmed.replace(/^[-*]\s*/, ''))}</div></div>;
        if (!trimmed) return <div key={idx} className="h-1" />;
        return <div key={idx} className="text-slate-300 py-0.5">{formatInline(line)}</div>;
      })}
    </div>
  );
}

export const UniversalPreview: React.FC<UniversalPreviewProps> = ({ tool, isRunning, progressPercent, textOutput, mediaOutputUrl }) => {
  const [copied, setCopied] = useState(false);

  const hasOutput = textOutput || mediaOutputUrl;
  const isImageOutput = tool.outputs.some(out => ['jpg', 'png', 'webp', 'svg'].includes(out));
  const isAudioOutput = tool.outputs.some(out => ['mp3', 'wav'].includes(out));
  const isVideoOutput = tool.outputs.some(out => ['mp4', 'webm'].includes(out));
  const isCodeOutput = tool.outputs.some(out => ['json', 'html', 'css'].includes(out));

  const handleCopy = () => {
    if (!textOutput) return;
    const cleanText = textOutput.replace(/^#+\s*/gm, '').replace(/\*\*/g, '').replace(/^[-*]\s*/gm, '• ').replace(/^---$/gm, '');
    navigator.clipboard.writeText(cleanText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full min-h-[560px]">
      <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3 bg-[#0A0A0A] p-2 rounded-lg border border-white/5">
        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5"/> Universal Workspace</span>
      </div>

      {/* STATE 1: IDLE */}
      {!isRunning && !hasOutput && (
        <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl flex flex-col items-center justify-center flex-grow p-12 text-center">
          {isImageOutput ? <ImageIcon className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-50 animate-pulse"/> : 
           isVideoOutput ? <Video className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-50 animate-pulse"/> :
           isAudioOutput ? <Music className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-50 animate-pulse"/> :
           isCodeOutput ? <Code className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-50 animate-pulse"/> :
           <FileText className="w-12 h-12 text-emerald-500 mx-auto mb-3 opacity-50 animate-pulse"/>}
          <h3 className="text-white font-bold text-sm">System Ready</h3>
          <p className="text-slate-400 text-xs mt-1">Configure parameters on the left and execute the engine.</p>
        </div>
      )}

      {/* STATE 2: PROCESSING (RUNNING) */}
      {isRunning && (
        <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl flex flex-col items-center justify-center flex-grow p-8 space-y-5">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-emerald-600 rounded-full animate-spin border-t-transparent"></div>
            <span className="text-white font-extrabold text-xs">{progressPercent}%</span>
          </div>
          <div className="w-full max-w-xs space-y-1.5">
            <div className="flex justify-between text-xs font-bold text-slate-300 uppercase tracking-wider"><span>Executing Routine</span><span>{progressPercent}%</span></div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 transition-all duration-150" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>
      )}

      {/* STATE 3: OUTPUT (MEDIA) */}
      {mediaOutputUrl && !isRunning && (
        <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center flex-grow">
          {isVideoOutput ? (
            <video src={mediaOutputUrl} controls className="max-h-[380px] w-full rounded-lg border border-white/10 shadow-2xl" />
          ) : isAudioOutput ? (
            <audio src={mediaOutputUrl} controls className="w-full max-w-md my-auto" />
          ) : (
            <img src={mediaOutputUrl} alt="Output Result" className="max-h-[380px] w-auto object-contain rounded-lg border border-white/10 shadow-2xl" />
          )}
        </div>
      )}

      {/* STATE 4: OUTPUT (TEXT/REPORT) */}
      {textOutput && !isRunning && (
        <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-5 flex-grow overflow-y-auto relative">
          <button onClick={handleCopy} className="absolute top-3 right-3 px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-[10px] font-bold text-slate-300 flex items-center gap-1 transition-colors">
            <Copy className="w-3 h-3"/> {copied ? 'Copied!' : 'Copy'}
          </button>
          {renderCleanFormattedText(textOutput)}
        </div>
      )}
    </div>
  );
};
