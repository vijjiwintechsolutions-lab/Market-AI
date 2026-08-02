import React, { useState, useRef } from 'react';
import { Play, Pause, Download, RefreshCw, Volume2, VolumeX, Maximize, RotateCcw, Check, Sparkles, Video } from 'lucide-react';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setSavedSuccess] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleDownloadClick = async () => {
    setIsDownloading(true);
    setSavedSuccess(false);

    try {
      // Direct Download Execution
      await onDownload();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Video download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-4 font-mono">
      {/* Dynamic Video Render Box */}
      <div className="relative rounded-2xl overflow-hidden border border-indigo-500/40 bg-black shadow-2xl group">
        {posterUrl && (
          <img
            src={posterUrl}
            alt="Prompt Motion Visual"
            className="w-full h-auto max-h-[420px] object-cover opacity-90 group-hover:scale-102 transition-transform duration-500"
          />
        )}

        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className={`w-full h-auto max-h-[420px] object-contain ${posterUrl ? 'absolute inset-0 opacity-40 hover:opacity-90' : ''}`}
        />

        {/* Prompt Overlay Header */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-3 py-1 bg-black/80 backdrop-blur border border-white/20 rounded-lg text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5 shadow">
            <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>Prompt Motion Synced: 60 FPS</span>
          </span>
          <span className="px-2.5 py-1 bg-black/80 backdrop-blur border border-white/20 rounded-lg text-[10px] text-indigo-300 font-bold">
            {durationSec}s HD Render
          </span>
        </div>

        {/* Custom Interactive Player Controls */}
        <div className="absolute bottom-3 left-3 right-3 p-2 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all cursor-pointer shadow"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>
            <button
              onClick={toggleMute}
              className="p-2 bg-white/10 hover:bg-white/20 text-slate-300 rounded-lg transition-all cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          <span className="text-[11px] text-slate-300 truncate max-w-[200px] sm:max-w-[320px]">
            "{promptText}"
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadClick}
              disabled={isDownloading}
              className={`px-3.5 py-1.5 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                downloadSuccess
                  ? 'bg-emerald-500 text-slate-950 font-extrabold'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
              }`}
            >
              {isDownloading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : downloadSuccess ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span>
                {isDownloading ? 'Downloading...' : downloadSuccess ? 'Saved to Device!' : 'Download MP4'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
