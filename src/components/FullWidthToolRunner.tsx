import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  RefreshCw, 
  Sliders, 
  UploadCloud, 
  FileText, 
  Globe, 
  X, 
  Paperclip, 
  Wand2, 
  Volume2, 
  AlertCircle 
} from 'lucide-react';
import { AITool, ExecutionHistoryItem } from '../types';
import { apiService } from '../services/apiService';
import { AIProcessingState } from './AIProcessingState';
import { AIVideoPlayer } from './AIVideoPlayer';

interface FullWidthToolRunnerProps {
  tool: AITool;
  allTools: AITool[];
  onBack: () => void;
  onSelectTool: (tool: AITool) => void;
  onSaveHistory: (item: ExecutionHistoryItem) => void;
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
  comparedTools: AITool[];
  onToggleCompare: (tool: AITool) => void;
  onSelectTag?: (tag: string) => void;
}

export const FullWidthToolRunner: React.FC<FullWidthToolRunnerProps> = ({
  tool,
  onBack,
  onSaveHistory,
  favoriteIds,
  onToggleFavorite,
}) => {
  const isImageTool = tool.outputType === 'image' || tool.category?.toLowerCase().includes('image');
  const isVideoTool = tool.outputType === 'video' || tool.category?.toLowerCase().includes('video');
  const isAudioTool = tool.outputType === 'audio' || tool.category?.toLowerCase().includes('audio') || tool.category?.toLowerCase().includes('voice');

  const [inputValues, setInputValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    tool.inputs.forEach((param) => {
      initial[param.id] = param.defaultValue !== undefined ? param.defaultValue : '';
    });
    return initial;
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [outputResult, setOutputResult] = useState<string | null>(null);
  const [imageUrlResult, setImageUrlResult] = useState<string | null>(null);
  const [videoUrlResult, setVideoUrlResult] = useState<string | null>(null);
  const [audioUrlResult, setAudioUrlResult] = useState<string | null>(null);
  const [videoPosterUrl, setVideoPosterUrl] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initial: Record<string, any> = {};
    tool.inputs.forEach((param) => {
      initial[param.id] = param.defaultValue !== undefined ? param.defaultValue : '';
    });
    setInputValues(initial);
    setOutputResult(null);
    setImageUrlResult(null);
    setVideoUrlResult(null);
    setAudioUrlResult(null);
    setVideoPosterUrl(null);
    setUploadedFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tool.id]);

  const handleInputChange = (id: string, value: any) => {
    setInputValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleExecute = async () => {
    setIsRunning(true);
    setOutputResult(null);
    setImageUrlResult(null);
    setVideoUrlResult(null);
    setAudioUrlResult(null);
    setProgressPercent(10);
    setElapsedSec(0);
    const startTime = Date.now();

    const progressInterval = setInterval(() => setProgressPercent((prev) => (prev < 95 ? prev + 5 : prev)), 100);
    const timerInterval = setInterval(() => setElapsedSec((prev) => parseFloat((prev + 0.1).toFixed(1))), 100);

    try {
      const res = await apiService.executeTool({ tool, inputValues });
      const elapsed = Date.now() - startTime;
      setExecutionTime(res.executionTimeMs || elapsed);

      if (res.success) {
        setProgressPercent(100);
        if (isVideoTool || res.videoUrl) {
          setVideoUrlResult(res.videoUrl || null);
          setVideoPosterUrl(res.frameUrl || null);
        } else if (isImageTool || res.imageUrl) {
          setImageUrlResult(res.imageUrl || null);
        } else if (isAudioTool || res.audioUrl) {
          setAudioUrlResult(res.audioUrl || null);
        } else {
          setOutputResult(res.textOutput || String(res.output || ''));
        }

        onSaveHistory({
          id: `hist-${Date.now()}`,
          toolId: tool.id,
          toolName: tool.name,
          prompt: apiService.extractPrompt(inputValues, tool.name),
          output: String(res.output).substring(0, 300),
          timestamp: new Date().toLocaleTimeString(),
          executionTimeMs: res.executionTimeMs || elapsed,
          outputType: tool.outputType,
        });
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      clearInterval(progressInterval);
      clearInterval(timerInterval);
      setIsRunning(false);
    }
  };

  const handleDirectDownloadMedia = async (mediaUrl: string | null, filename: string) => {
    if (!mediaUrl) return;
    setIsDownloading(true);
    try {
      const res = await fetch(mediaUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      const link = document.createElement('a');
      link.href = mediaUrl;
      link.target = '_blank';
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] pb-12 font-mono">
      <div className="bg-[#151517] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
        </button>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <div className="bg-[#151517] border border-white/10 rounded-lg p-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">{tool.category}</span>
            <h1 className="text-2xl font-extrabold text-white mt-1">{tool.name}</h1>
            <p className="text-xs text-slate-300 mt-1">{tool.description}</p>
          </div>
          <button onClick={() => onToggleFavorite(tool.id)} className={`px-3 py-2 rounded text-xs font-bold border ${favoriteIds.includes(tool.id) ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-white/5 text-slate-300 border-white/10'}`}>
            {favoriteIds.includes(tool.id) ? 'Saved' : 'Save Tool'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* INPUT PARAMETERS (LEFT) */}
          <div className="lg:col-span-5 bg-[#151517] border border-white/10 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold uppercase text-indigo-400 flex items-center gap-1.5"><Sliders className="w-4 h-4" /> Parameters</span>
            </div>

            {tool.inputs.map((param) => (
              <div key={param.id} className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 block">{param.name}</label>
                {param.type === 'textarea' || param.type === 'text' ? (
                  <textarea
                    rows={3}
                    value={inputValues[param.id] || ''}
                    onChange={(e) => handleInputChange(param.id, e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                ) : param.type === 'select' ? (
                  <select
                    value={inputValues[param.id] || param.options?.[0]}
                    onChange={(e) => handleInputChange(param.id, e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white focus:border-indigo-500 font-mono cursor-pointer"
                  >
                    {param.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : null}
              </div>
            ))}

            {/* DRAG & DROP FILE ATTACHMENT */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <span className="text-[11px] font-bold text-slate-300 block flex items-center gap-1"><Paperclip className="w-3.5 h-3.5 text-indigo-400" /> Source File / Reference Media</span>
              {!uploadedFile ? (
                <div onClick={() => fileInputRef.current?.click()} className="border border-dashed border-white/20 hover:border-indigo-500 bg-[#0A0A0A] rounded p-3 text-center cursor-pointer">
                  <UploadCloud className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-300">Click to browse or Drag & Drop File</p>
                  <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && setUploadedFile(e.target.files[0])} className="hidden" />
                </div>
              ) : (
                <div className="p-2 bg-[#0A0A0A] border border-indigo-500/40 rounded flex items-center justify-between text-xs">
                  <span className="truncate text-white">{uploadedFile.name}</span>
                  <button onClick={() => setUploadedFile(null)} className="text-rose-400 p-1"><X className="w-4 h-4" /></button>
                </div>
              )}
            </div>

            <button onClick={handleExecute} disabled={isRunning} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase rounded flex items-center justify-center gap-2 cursor-pointer mt-4">
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRunning ? 'Synthesizing Request...' : 'Execute AI Tool'}</span>
            </button>
          </div>

          {/* GENERATED OUTPUT (RIGHT) */}
          <div className="lg:col-span-7 bg-[#151517] border border-white/10 rounded-lg p-5 min-h-[500px] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Live Generated Output</span>
                {executionTime && <span className="text-green-400 text-[11px] bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 font-bold">{executionTime}ms</span>}
              </div>

              {isRunning && <AIProcessingState tool={tool} currentStep="Generating Live AI Stream..." progressPercent={progressPercent} elapsedSec={elapsedSec} uploadedFile={uploadedFile} inputValues={inputValues} />}

              {/* IMAGE OUTPUT */}
              {imageUrlResult && !isRunning && (
                <div className="space-y-3">
                  <div className="rounded border border-white/10 bg-[#0A0A0A] p-2 flex items-center justify-center min-h-[320px]">
                    <img src={imageUrlResult} alt="Generated Artwork" className="w-full h-auto max-h-[440px] object-contain rounded" />
                  </div>
                  <button onClick={() => handleDirectDownloadMedia(imageUrlResult, `${tool.id}-artwork.png`)} disabled={isDownloading} className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase rounded shadow flex items-center justify-center gap-2 cursor-pointer">
                    {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span>{isDownloading ? 'Downloading...' : 'Direct Download Ultra-HD Image'}</span>
                  </button>
                </div>
              )}

              {/* VIDEO OUTPUT */}
              {videoUrlResult && !isRunning && (
                <AIVideoPlayer
                  videoUrl={videoUrlResult}
                  posterUrl={videoPosterUrl || undefined}
                  promptText={inputValues.prompt || tool.name}
                  durationSec={15}
                  toolName={tool.name}
                  onDownload={() => handleDirectDownloadMedia(videoUrlResult, `${tool.id}-motion-video.mp4`)}
                />
              )}

              {/* AUDIO OUTPUT */}
              {audioUrlResult && !isRunning && (
                <div className="space-y-3 p-4 bg-[#0A0A0A] border border-white/10 rounded text-center">
                  <Volume2 className="w-8 h-8 text-indigo-400 mx-auto" />
                  <audio controls src={audioUrlResult} className="w-full" autoPlay />
                  <button onClick={() => handleDirectDownloadMedia(audioUrlResult, `${tool.id}-audio.mp3`)} className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase rounded flex items-center justify-center gap-2 cursor-pointer">
                    <Download className="w-4 h-4" /> Direct Download Audio MP3
                  </button>
                </div>
              )}

              {/* TEXT OUTPUT */}
              {outputResult && !imageUrlResult && !videoUrlResult && !audioUrlResult && !isRunning && (
                <div className="space-y-3">
                  <div className="bg-[#0A0A0A] border border-white/10 rounded p-4 text-xs text-slate-200 whitespace-pre-wrap max-h-[380px] overflow-y-auto leading-relaxed">{outputResult}</div>
                  <button onClick={() => { navigator.clipboard.writeText(outputResult); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="w-full py-2 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold rounded border border-white/10 flex items-center justify-center gap-2 cursor-pointer">
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />} <span>{copied ? 'Copied!' : 'Copy Result'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
