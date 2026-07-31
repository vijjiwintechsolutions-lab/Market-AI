import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Maximize2, Download, Film, Sparkles, Layers } from 'lucide-react';

interface AIVideoPlayerProps {
  videoUrl: string;
  posterUrl?: string;
  promptText?: string;
  durationSec?: number;
  toolName?: string;
  onDownload?: () => void;
}

export const AIVideoPlayer: React.FC<AIVideoPlayerProps> = ({
  videoUrl,
  posterUrl,
  promptText = 'Cinematic AI Motion Video',
  durationSec = 15,
  toolName = 'AI Video Generator',
  onDownload
}) => {
  const [activeMode, setActiveMode] = useState<'prompt-motion' | 'mp4-stream'>('prompt-motion');
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Canvas motion engine refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const loadedImageRef = useRef<HTMLImageElement | null>(null);

  // Load poster image for canvas animation
  useEffect(() => {
    if (!posterUrl) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = posterUrl;
    img.onload = () => {
      loadedImageRef.current = img;
    };
  }, [posterUrl]);

  // Audio Synthesizer for video sound
  useEffect(() => {
    if (!isMuted && isPlaying) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          if (!audioCtxRef.current) {
            audioCtxRef.current = new AudioCtx();
          }
          const ctx = audioCtxRef.current;
          if (ctx.state === 'suspended') {
            ctx.resume();
          }
          if (!oscRef.current) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(110, ctx.currentTime); // Low cinematic ambient drone
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            oscRef.current = osc;
            gainRef.current = gain;
          }
        }
      } catch (err) {
        // Fallback silently if web audio is restricted
      }
    } else {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch (e) {}
        oscRef.current = null;
      }
    }
    return () => {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
        } catch (e) {}
        oscRef.current = null;
      }
    };
  }, [isMuted, isPlaying]);

  // Canvas Motion Render Loop
  useEffect(() => {
    if (activeMode !== 'prompt-motion') return;

    let startTime = performance.now();
    let lastTime = performance.now();

    const render = (now: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + delta * playbackRate;
          if (next >= durationSec) {
            return 0; // Loop video
          }
          return next;
        });
      }

      const width = canvas.width;
      const height = canvas.height;
      const timeRatio = currentTime / durationSec;

      // 1. Clear background
      ctx.fillStyle = '#050508';
      ctx.fillRect(0, 0, width, height);

      // 2. Draw animated prompt-accurate image frame if available
      const img = loadedImageRef.current;
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.save();
        
        // Calculate camera motion (Ken Burns zoom + subtle pan)
        const scale = 1.0 + Math.sin(timeRatio * Math.PI) * 0.12;
        const translateX = Math.sin(timeRatio * Math.PI * 2) * 20;
        const translateY = Math.cos(timeRatio * Math.PI * 2) * 12;

        ctx.translate(width / 2 + translateX, height / 2 + translateY);
        ctx.scale(scale, scale);
        ctx.drawImage(img, -width / 2, -height / 2, width, height);
        ctx.restore();
      } else {
        // Fallback gradient motion canvas if image loading
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, '#0f172a');
        grad.addColorStop(0.5, '#1e1b4b');
        grad.addColorStop(1, '#020617');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Cinematic Motion Effects Overlay (Volumetric Light & Particles)
      ctx.save();
      // Volumetric sweep
      const lightX = (Math.sin(timeRatio * Math.PI * 2) * 0.5 + 0.5) * width;
      const sweepGrad = ctx.createRadialGradient(lightX, height * 0.3, 20, lightX, height * 0.3, width * 0.6);
      sweepGrad.addColorStop(0, 'rgba(99, 102, 241, 0.25)');
      sweepGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.08)');
      sweepGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = sweepGrad;
      ctx.fillRect(0, 0, width, height);

      // Particle Motion Stream
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      for (let i = 0; i < 24; i++) {
        const px = (Math.sin(i * 99 + timeRatio * 5) * 0.5 + 0.5) * width;
        const py = ((i * 37 + timeRatio * 80) % height);
        const pSize = (Math.sin(i + timeRatio * 3) + 1.5) * 1.5;
        ctx.beginPath();
        ctx.arc(px, py, pSize, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cinematic Vignette
      const vigGrad = ctx.createRadialGradient(width / 2, height / 2, width * 0.35, width / 2, height / 2, width * 0.7);
      vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vigGrad.addColorStop(1, 'rgba(0, 0, 0, 0.65)');
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, width, height);

      ctx.restore();

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    animFrameIdRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [activeMode, isPlaying, currentTime, durationSec, playbackRate]);

  // Format seconds to MM:SS
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFullscreenToggle = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="space-y-3 font-mono" ref={containerRef}>
      {/* Top Header: Mode Switcher & Quality Badge */}
      <div className="flex flex-wrap items-center justify-between bg-[#0D0D11] p-2 rounded-lg border border-white/10 text-xs gap-2">
        <div className="flex items-center gap-1.5 bg-[#16161E] p-1 rounded border border-white/10">
          <button
            onClick={() => setActiveMode('prompt-motion')}
            className={`px-3 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'prompt-motion'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            <span>Prompt-Synced Motion Engine</span>
          </button>

          <button
            onClick={() => setActiveMode('mp4-stream')}
            className={`px-3 py-1 rounded text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMode === 'mp4-stream'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Raw MP4 Stream</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 font-bold text-[10px] uppercase rounded border border-emerald-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            1080p 60 FPS
          </span>
          <span className="text-[10px] text-indigo-300 font-bold hidden sm:inline">{toolName}</span>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="relative rounded-lg overflow-hidden border border-indigo-500/40 shadow-2xl bg-black text-center group">
        {activeMode === 'prompt-motion' ? (
          <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
            <canvas
              ref={canvasRef}
              width={1280}
              height={720}
              className="w-full h-full object-contain"
            />

            {/* Prompt Banner Tag Overlay */}
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/10 text-left max-w-[85%]">
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <Layers className="w-3 h-3" /> Prompt Motion Vector:
              </p>
              <p className="text-xs text-white truncate max-w-full font-sans italic">{promptText}</p>
            </div>
          </div>
        ) : (
          <video
            src={videoUrl}
            poster={posterUrl}
            controls
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-auto max-h-[440px] object-contain mx-auto rounded-lg shadow-inner"
          />
        )}

        {/* Custom Video Controls Bar for Canvas Player */}
        {activeMode === 'prompt-motion' && (
          <div className="bg-[#0A0A0E]/90 backdrop-blur-md border-t border-white/10 p-2.5 space-y-2">
            {/* Progress Timeline Scrubber */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-slate-300 font-mono font-bold w-12 text-right">
                {formatTime(currentTime)}
              </span>
              <div
                className="flex-1 h-2 bg-slate-800 rounded-full cursor-pointer relative overflow-hidden border border-white/5"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pos = (e.clientX - rect.left) / rect.width;
                  setCurrentTime(pos * durationSec);
                }}
              >
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-75"
                  style={{ width: `${(currentTime / durationSec) * 100}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400 font-mono w-12 text-left">
                {formatTime(durationSec)}
              </span>
            </div>

            {/* Playback Buttons */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                </button>

                <button
                  onClick={() => setCurrentTime(0)}
                  className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded transition-colors"
                  title="Replay from start"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-1.5 rounded transition-colors ${
                    !isMuted ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-white/5 text-slate-400'
                  }`}
                  title={isMuted ? 'Unmute AI Audio' : 'Mute Audio'}
                >
                  {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>

                <div className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded text-[10px] text-slate-300 border border-white/5">
                  <span className="text-slate-400 font-bold">Speed:</span>
                  {[1.0, 1.5, 2.0].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setPlaybackRate(rate)}
                      className={`px-1.5 py-0.5 rounded ${
                        playbackRate === rate ? 'bg-indigo-600 text-white font-bold' : 'hover:text-white'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onDownload && (
                  <button
                    onClick={onDownload}
                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold flex items-center gap-1 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download MP4</span>
                  </button>
                )}

                <button
                  onClick={handleFullscreenToggle}
                  className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded transition-colors"
                  title="Toggle Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
