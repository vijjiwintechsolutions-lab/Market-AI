import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  Link as LinkIcon,
  ImageIcon,
  AlertCircle
} from 'lucide-react';
import { AITool, ExecutionHistoryItem } from '../types';
import { apiService } from '../services/apiService';
import { AIProcessingState } from './AIProcessingState';
import { AIVideoPlayer } from './AIVideoPlayer';
import { validateUploadedFile, validateToolExecution } from '../utils/toolValidator';

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
  allTools,
  onBack,
  onSelectTool,
  onSaveHistory,
  favoriteIds,
  onToggleFavorite,
  comparedTools,
  onToggleCompare,
  onSelectTag,
}) => {
  const isImageTool = tool.outputType === 'image' || tool.category?.toLowerCase().includes('image');
  const isVideoTool = tool.outputType === 'video' || tool.category?.toLowerCase().includes('video');
  const defaultFormat = isImageTool ? 'PNG Image (.png)' : isVideoTool ? 'MP4 Video (.mp4)' : 'Markdown (.md)';

  const [inputValues, setInputValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    tool.inputs.forEach((param) => {
      initial[param.id] = param.defaultValue !== undefined ? param.defaultValue : '';
    });
    initial['outputFormat'] = defaultFormat;
    return initial;
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [outputResult, setOutputResult] = useState<string | null>(null);
  const [imageUrlResult, setImageUrlResult] = useState<string | null>(null);
  const [videoUrlResult, setVideoUrlResult] = useState<string | null>(null);
  const [videoPosterUrl, setVideoPosterUrl] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initial: Record<string, any> = {};
    tool.inputs.forEach((param) => {
      initial[param.id] = param.defaultValue !== undefined ? param.defaultValue : '';
    });
    initial['outputFormat'] = defaultFormat;
    setInputValues(initial);
    setOutputResult(null);
    setImageUrlResult(null);
    setVideoUrlResult(null);
    setVideoPosterUrl(null);
    setErrorMsg(null);
    setUploadedFile(null);
    setFilePreview(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tool.id, defaultFormat]);

  const handleInputChange = (id: string, value: any) => {
    setInputValues((prev) => ({ ...prev, [id]: value }));
  };

  const processFile = (file: File) => {
    const valRes = validateUploadedFile(file, tool);
    if (!valRes.valid) return;
    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      const resStr = reader.result as string;
      setFilePreview(resStr);
      handleInputChange('filePreview', resStr);
    };
    reader.readAsDataURL(file);
  };

  const handleExecute = async () => {
    setIsRunning(true);
    setErrorMsg(null);
    setOutputResult(null);
    setImageUrlResult(null);
    setVideoUrlResult(null);
    setVideoPosterUrl(null);
    setProgressPercent(10);
    setElapsedSec(0);
    const startTime = Date.now();

    const progressInterval = setInterval(() => setProgressPercent((prev) => (prev < 90 ? prev + 3 : prev)), 200);
    const timerInterval = setInterval(() => setElapsedSec((prev) => parseFloat((prev + 0.1).toFixed(1))), 100);

    try {
      setCurrentStep('Step 1/3: Validating parameters...');
      await new Promise((r) => setTimeout(r, 200));
      setCurrentStep('Step 2/3: Executing prompt-matched neural model...');

      const res = await apiService.executeTool({ tool, inputValues, filePreview });
      const elapsed = Date.now() - startTime;
      setExecutionTime(res.executionTimeMs || elapsed);

      if (res.success) {
        setProgressPercent(100);
        const rawOutput = res.output;

        if (isVideoTool || res.videoUrl) {
          setVideoUrlResult(res.videoUrl || String(rawOutput));
          setVideoPosterUrl(res.frameUrl || undefined);
          setOutputResult(res.textOutput || 'Video synthesized successfully.');
        } else if (isImageTool || res.imageUrl) {
          setImageUrlResult(res.imageUrl || String(rawOutput));
          setOutputResult(res.textOutput || 'Image generated successfully.');
        } else {
          setOutputResult(typeof rawOutput === 'object' ? JSON.stringify(rawOutput, null, 2) : String(rawOutput || ''));
        }

        onSaveHistory({
          id: `hist-${Date.now()}`,
          toolId: tool.id,
          toolName: tool.name,
          prompt: apiService.extractPrompt(inputValues, tool.name),
          output: String(rawOutput).substring(0, 300),
          timestamp: new Date().toLocaleTimeString(),
          executionTimeMs: res.executionTimeMs || elapsed,
          outputType: tool.outputType,
        });
      } else {
        setErrorMsg(res.error || 'Execution failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Server connection error.');
    } finally {
      clearInterval(progressInterval);
      clearInterval(timerInterval);
      setIsRunning(false);
    }
  };

  // 🔥 DIRECT DEVICE DOWNLOAD (Fixed 'finally' Syntax) 🔥
  const handleDirectDownloadMedia = async (mediaUrl: string | null, filename: string) => {
    if (!mediaUrl) return;
    setIsDownloading(true);
    try {
      const proxyUrl = `/api/download?url=${encodeURIComponent(mediaUrl)}&filename=${encodeURIComponent(filename)}`;
      const res = await fetch(proxyUrl);
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
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] pb-12 font-sans font-mono">
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
          </div>
          <button onClick={() => onToggleFavorite(tool.id)} className={`px-3 py-2 rounded text-xs font-bold border ${favoriteIds.includes(tool.id) ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-white/5 text-slate-300 border-white/10'}`}>
            {favoriteIds.includes(tool.id) ? 'Saved' : 'Save Tool'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Inputs */}
          <div className="lg:col-span-5 bg-[#151517] border border-white/10 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold uppercase text-indigo-400 flex items-center gap-1.5"><Sliders className="w-4 h-4" /> Parameters</span>
            </div>

            {tool.inputs.map((param) => (
              <div key={param.id} className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200">{param.name}</label>
                {param.type === 'textarea' || param.type === 'text' ? (
                  <textarea
                    rows={4}
                    value={inputValues[param.id] || ''}
                    onChange={(e) => handleInputChange(param.id, e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                ) : null}
              </div>
            ))}

            <button onClick={handleExecute} disabled={isRunning} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase rounded flex items-center justify-center gap-2 cursor-pointer mt-4">
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRunning ? 'Synthesizing Neural Stream...' : 'Execute AI Tool'}</span>
            </button>
          </div>

          {/* Output Panel */}
          <div className="lg:col-span-7 bg-[#151517] border border-white/10 rounded-lg p-5 min-h-[500px]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Live Generated Output</span>
              {executionTime && <span className="text-green-400 text-[11px] bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 font-bold">{executionTime}ms</span>}
            </div>

            {isRunning && <AIProcessingState tool={tool} currentStep={currentStep} progressPercent={progressPercent} elapsedSec={elapsedSec} uploadedFile={uploadedFile} inputValues={inputValues} />}

            {/* LIVE IMAGE OUTPUT */}
            {imageUrlResult && !isRunning && (
              <div className="space-y-3">
                <div className="rounded border border-white/10 bg-[#0A0A0A] p-2 flex items-center justify-center min-h-[320px]">
                  <img src={imageUrlResult} alt="Generated Artwork" className="w-full h-auto max-h-[440px] object-contain rounded" />
                </div>
                <button onClick={() => handleDirectDownloadMedia(imageUrlResult, `${tool.id}-masterpiece.png`)} disabled={isDownloading} className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase rounded shadow flex items-center justify-center gap-2 cursor-pointer">
                  {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span>{isDownloading ? 'Downloading...' : 'Direct Download Ultra-HD Image'}</span>
                </button>
              </div>
            )}

            {/* LIVE PROMPT-MATCHED VIDEO PLAYER */}
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
          </div>
        </div>
      </div>
    </div>
  );
};
