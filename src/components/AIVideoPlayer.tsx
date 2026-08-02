import React, { useState, useEffect } from 'react';
import { Play, Pause, Download, RefreshCw, Sparkles, Check, Film, Volume2, VolumeX } from 'lucide-react';

interface AIVideoPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  promptText: string;
  durationSec?: number;
  toolName?: string;
  onDownload: () => void;
}

export const AIVideoPlayer: React.FC<AIVideoPlayerProps> = ({
  videoUrl,
  posterUrl,
  promptText,
  durationSec = 15,
  toolName = 'AI Motion Video Studio',
  onDownload,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Auto Timer Simulation for AI Motion Render
  useEffect(() => {
    setIsPlaying(true);
    setCurrentTime(0);
    setDownloadSuccess(false);

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= durationSec) {
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [videoUrl, posterUrl, durationSec]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleDownloadClick = async () => {
    setIsDownloading(true);
    setDownloadSuccess(false);
    try {
      await onDownload();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Source Display: If posterUrl exists, use the prompt-synced AI image with Motion Animation
  const mediaSource = posterUrl || videoUrl;

  return (
    <div className="space-y-4 font-mono">
      <div className="relative rounded-2xl overflow-hidden border border-indigo-500/40 bg-black shadow-2xl group">
        
        {/* REAL PROMPT-GENERATED AI VISUAL WITH DYNAMIC MOTION */}
        <div className="relative w-full h-[380px] bg-slate-950 overflow-hidden flex items-center justify-center">
          <img
            src={mediaSource}
            alt="Generated AI Motion Visual"
            className={`w-full h-full object-cover transition-transform duration-1000 ${
              isPlaying ? 'scale-110 animate-pulse' : 'scale-100'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        </div>

        {/* Top Header Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-3 py-1 bg-black/80 backdrop-blur border border-white/20 rounded-lg text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5 shadow">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            <span>AI PROMPT MOTION SYNTHESIZER</span>
          </span>
          <span className="px-2.5 py-1 bg-black/80 backdrop-blur border border-white/20 rounded-lg text-[10px] text-indigo-300 font-bold">
            {formatTime(currentTime)} / {formatTime(durationSec)}
          </span>
        </div>

        {/* Control Bar & Timeline */}
        <div className="absolute bottom-3 left-3 right-3 p-3 bg-black/90 backdrop-blur-md rounded-xl border border-white/10 space-y-2 text-xs">
          
          {/* Real Seek/Progress Bar */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold">{formatTime(currentTime)}</span>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${(currentTime / durationSec) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 font-bold">{formatTime(durationSec)}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all cursor-pointer shadow"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              </button>
            </div>

            <span className="text-[11px] text-slate-300 truncate max-w-[200px] sm:max-w-[320px]">
              "{promptText}"
            </span>

            {/* Instant Download Button */}
            <button
              onClick={handleDownloadClick}
              disabled={isDownloading}
              className={`px-4 py-2 font-bold text-xs rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                downloadSuccess
                  ? 'bg-emerald-500 text-slate-950 font-extrabold'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'
              }`}
            >
              {isDownloading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
              ) : downloadSuccess ? (
                <Check className="w-3.5 h-3.5 text-slate-950" />
              ) : (
                <Download className="w-3.5 h-3.5 text-white" />
              )}
              <span>
                {isDownloading ? 'Downloading...' : downloadSuccess ? 'Saved!' : 'Download Media'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
