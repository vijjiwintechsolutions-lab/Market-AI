import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Download, RefreshCw, Volume2, VolumeX, Sparkles, Check } from 'lucide-react';

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
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(durationSec);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    setIsPlaying(true);
    setCurrentTime(0);
    setDownloadSuccess(false);
  }, [videoUrl]);

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

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        setTotalDuration(videoRef.current.duration);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const formatTime = (timeInSec: number) => {
    const mins = Math.floor(timeInSec / 60);
    const secs = Math.floor(timeInSec % 60);
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
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

  return (
    <div className="space-y-4 font-mono">
      {/* Video Container Frame */}
      <div className="relative rounded-2xl overflow-hidden border border-indigo-500/40 bg-black shadow-2xl group">
        {posterUrl && (
          <img
            src={posterUrl}
            alt="Prompt Motion Visual"
            className="w-full h-auto max-h-[420px] object-cover opacity-90 transition-transform duration-500"
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
          onTimeUpdate={handleTimeUpdate}
          className={`w-full h-auto max-h-[420px] object-contain ${posterUrl ? 'absolute inset-0 opacity-40 hover:opacity-90' : ''}`}
        />

        {/* Top Header Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="px-3 py-1 bg-black/80 backdrop-blur border border-white/20 rounded-lg text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5 shadow">
            <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>PROMPT SYNCED MOTION ENGINE</span>
          </span>
          <span className="px-2.5 py-1 bg-black/80 backdrop-blur border border-white/20 rounded-lg text-[10px] text-indigo-300 font-bold">
            {formatTime(currentTime)} / {formatTime(totalDuration)}
          </span>
        </div>

        {/* Video Control Bar */}
        <div className="absolute bottom-3 left-3 right-3 p-3 bg-black/90 backdrop-blur-md rounded-xl border border-white/10 space-y-2 text-xs">
          {/* Timeline Seek Bar */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-bold font-mono">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={totalDuration || 15}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-slate-800 accent-indigo-500 rounded cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 font-bold font-mono">{formatTime(totalDuration)}</span>
          </div>

          <div className="flex items-center justify-between gap-3">
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

            {/* Instant Responsive Download Button */}
            <button
              onClick={handleDownloadClick}
              disabled={isDownloading}
              className={`px-4 py-2 font-bold text-xs rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
                downloadSuccess
                  ? 'bg-emerald-500 text-slate-950 font-extrabold'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
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
                {isDownloading ? 'Downloading...' : downloadSuccess ? 'Saved!' : 'Download MP4'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
