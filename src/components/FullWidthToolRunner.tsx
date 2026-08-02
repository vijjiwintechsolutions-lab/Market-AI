import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Zap, 
  RefreshCw, 
  Star, 
  UploadCloud, 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  Volume2, 
  FileText, 
  Globe, 
  X, 
  Paperclip, 
  Wand2, 
  Link as LinkIcon,
  Image as ImageIcon
} from 'lucide-react';
import { AITool, ExecutionHistoryItem } from '../types';
import { ToolCard } from './ToolCard';
import { apiService } from '../services/apiService';
import { AIProcessingState } from './AIProcessingState';
import { AIVideoPlayer } from './AIVideoPlayer';
import { ValidationToast } from './ValidationToast';
import { PresetSelector } from './PresetSelector';
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
  const isAudioTool = tool.outputType === 'audio' || tool.category?.toLowerCase().includes('audio') || tool.category?.toLowerCase().includes('voice');

  const defaultFormat = isImageTool ? 'PNG Image (.png)' : isVideoTool ? 'MP4 Video (.mp4)' : isAudioTool ? 'MP3 Audio (.mp3)' : 'Markdown (.md)';

  const [inputValues, setInputValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    tool.inputs.forEach((param) => {
      initial[param.id] = param.defaultValue !== undefined ? param.defaultValue : '';
    });
    initial['outputFormat'] = defaultFormat;
    initial['quality'] = '8K Ultra HD / Studio';
    return initial;
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [outputResult, setOutputResult] = useState<string | null>(null);
  const [audioUrlResult, setAudioUrlResult] = useState<string | null>(null);
  const [imageUrlResult, setImageUrlResult] = useState<string | null>(null);
  const [videoUrlResult, setVideoUrlResult] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [validationToast, setValidationToast] = useState<{ type: 'error' | 'warning'; title: string; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initial: Record<string, any> = {};
    tool.inputs.forEach((param) => {
      initial[param.id] = param.defaultValue !== undefined ? param.defaultValue : '';
    });
    initial['outputFormat'] = defaultFormat;
    initial['quality'] = '8K Ultra HD / Studio';
    setInputValues(initial);
    setOutputResult(null);
    setImageUrlResult(null);
    setAudioUrlResult(null);
    setVideoUrlResult(null);
    setErrorMsg(null);
    setUploadedFile(null);
    setFilePreview(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tool.id, defaultFormat]);

  const handleInputChange = (id: string, value: any) => {
    setInputValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleEnhanceUserPrompt = (paramId: string) => {
    const currentText = inputValues[paramId] || '';
    if (!currentText.trim()) return;
    const enhanced = `Ultra-realistic 8k masterpiece of ${currentText}, highly detailed flawless faces, correct human anatomy, vibrant studio lighting, crisp focus`;
    handleInputChange(paramId, enhanced);
  };

  const processFile = (file: File) => {
    const valRes = validateUploadedFile(file, tool);
    if (!valRes.valid) {
      setValidationToast({ type: 'error', title: 'File Validation Error', message: valRes.error || 'Invalid file format or size limit.' });
      return;
    }
    setValidationToast(null);
    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = () => {
      const resStr = reader.result as string;
      setFilePreview(resStr);
      handleInputChange('filePreview', resStr);
    };
    reader.readAsDataURL(file);
  };

  const clearUploadedFile = () => {
    setUploadedFile(null);
    setFilePreview(null);
    handleInputChange('filePreview', null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExecute = async () => {
    const execValidation = validateToolExecution(tool, inputValues, uploadedFile);
    if (!execValidation.valid) {
      setValidationToast({ type: 'error', title: 'Missing Field', message: execValidation.errors.join(' | ') });
      return;
    }

    setValidationToast(null);
    setIsRunning(true);
    setErrorMsg(null);
    setOutputResult(null);
    setImageUrlResult(null);
    setAudioUrlResult(null);
    setVideoUrlResult(null);
    setProgressPercent(10);
    setElapsedSec(0);
    const startTime = Date.now();

    const progressInterval = setInterval(() => setProgressPercent((prev) => (prev < 90 ? prev + 3 : prev)), 200);
    const timerInterval = setInterval(() => setElapsedSec((prev) => parseFloat((prev + 0.1).toFixed(1))), 100);

    try {
      setCurrentStep('Step 1/3: Validating payload & attachment...');
      await new Promise((r) => setTimeout(r, 200));
      setCurrentStep('Step 2/3: Executing AI inference engine...');

      const res = await apiService.executeTool({ tool, inputValues, filePreview });
      const elapsed = Date.now() - startTime;
      setExecutionTime(res.executionTimeMs || elapsed);

      if (res.success) {
        setProgressPercent(100);
        const rawOutput = res.output;

        if (isVideoTool || res.videoUrl) {
          setVideoUrlResult(res.videoUrl || String(rawOutput));
          setOutputResult(res.textOutput || 'Video synthesized successfully.');
        } else if (isImageTool || res.imageUrl) {
          setImageUrlResult(res.imageUrl || String(rawOutput));
          setOutputResult(res.textOutput || 'Image generated successfully.');
        } else if (isAudioTool || res.audioUrl) {
          setAudioUrlResult(res.audioUrl || String(rawOutput));
          setOutputResult(res.textOutput || 'Audio generated successfully.');
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
        setErrorMsg(res.error || 'Execution failed. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Server connection error.');
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

  const relatedTools = useMemo(() => {
    return allTools.filter((t) => t.category === tool.category && t.id !== tool.id).slice(0, 6);
  }, [allTools, tool]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] pb-12 font-sans font-mono">
      {/* Header */}
      <div className="bg-[#151517] border-b border-white/10 sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
        </button>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20 text-[10px]">
            Auto Prompt Enhancer & Universal Downloader Active
          </span>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Banner */}
        <div className="bg-[#151517] border border-white/10 rounded-lg p-5 flex flex-col md:flex-row justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">{tool.category}</span>
            <h1 className="text-2xl font-extrabold text-white mt-1">{tool.name}</h1>
            <p className="text-xs text-slate-300 mt-1">{tool.description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => onToggleFavorite(tool.id)} className={`px-3 py-2 rounded text-xs font-bold border ${favoriteIds.includes(tool.id) ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-white/5 text-slate-300 border-white/10'}`}>
              {favoriteIds.includes(tool.id) ? 'Saved' : 'Save Tool'}
            </button>
          </div>
        </div>

        {/* Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Inputs Panel (Left) */}
          <div className="lg:col-span-5 bg-[#151517] border border-white/10 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold uppercase text-indigo-400 flex items-center gap-1.5"><Sliders className="w-4 h-4" /> Parameters</span>
            </div>

            {validationToast && <ValidationToast type={validationToast.type} title={validationToast.title} message={validationToast.message} onDismiss={() => setValidationToast(null)} />}

            {tool.inputs.map((param) => (
              <div key={param.id} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">{param.name} {param.required && <span className="text-rose-400">*</span>}</label>
                  {(param.type === 'textarea' || param.type === 'text') && (
                    <button onClick={() => handleEnhanceUserPrompt(param.id)} className="text-[10px] bg-indigo-600/30 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/40 flex items-center gap-1 cursor-pointer">
                      <Wand2 className="w-3 h-3 text-indigo-400" /> Magic Enhance
                    </button>
                  )}
                </div>

                {param.type === 'textarea' || param.type === 'text' ? (
                  <textarea
                    rows={4}
                    value={inputValues[param.id] || ''}
                    onChange={(e) => handleInputChange(param.id, e.target.value)}
                    placeholder={`Enter details for ${param.name}...`}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                ) : param.type === 'select' ? (
                  <select value={inputValues[param.id] || param.options?.[0]} onChange={(e) => handleInputChange(param.id, e.target.value)} className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white focus:border-indigo-500 font-mono">
                    {param.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : null}
              </div>
            ))}

            {/* LIVE DRAG & DROP FILE ATTACHMENT */}
            <div className="pt-3 border-t border-white/10 space-y-3">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                <span className="flex items-center gap-1.5 text-indigo-400"><Paperclip className="w-3.5 h-3.5" /> Source File / Reference Media</span>
                <span className="text-[10px] text-slate-500">Max 50MB</span>
              </div>

              {!uploadedFile ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]); }}
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-white/20 hover:border-indigo-500 bg-[#0A0A0A] rounded-lg p-3 text-center cursor-pointer transition-colors"
                >
                  <UploadCloud className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-300 font-medium">Click to browse or Drag & Drop File</p>
                  <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} className="hidden" />
                </div>
              ) : (
                <div className="p-2.5 bg-[#0A0A0A] border border-indigo-500/40 rounded flex items-center justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="text-xs text-white truncate">{uploadedFile.name}</span>
                  </div>
                  <button onClick={clearUploadedFile} className="p-1 hover:bg-rose-500/20 text-rose-400 rounded"><X className="w-4 h-4" /></button>
                </div>
              )}

              {/* LIVE WEB LINK URL */}
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-400 flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-indigo-400" /> Web Link / Source URL (Optional)</label>
                <input type="url" value={inputValues.sourceUrl || ''} onChange={(e) => handleInputChange('sourceUrl', e.target.value)} placeholder="https://example.com/asset..." className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-white/10 rounded text-xs text-slate-200 focus:border-indigo-500" />
              </div>

              {/* TARGET DOWNLOAD FORMAT & QUALITY */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400">Target Output Format</label>
                  <select value={inputValues.outputFormat || defaultFormat} onChange={(e) => handleInputChange('outputFormat', e.target.value)} className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-white/10 rounded text-xs text-slate-200 font-mono">
                    {isImageTool ? ['PNG Image (.png)', 'JPG Image (.jpg)', 'WEBP (.webp)'] : isVideoTool ? ['MP4 Video (.mp4)', 'WEBM (.webm)', 'GIF (.gif)'] : isAudioTool ? ['MP3 Audio (.mp3)', 'WAV (.wav)'] : ['Markdown (.md)', 'JSON (.json)', 'Plain Text (.txt)'].map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400">Render Quality</label>
                  <select value={inputValues.quality || '8K Ultra HD / Studio'} onChange={(e) => handleInputChange('quality', e.target.value)} className="w-full px-2.5 py-1.5 bg-[#0A0A0A] border border-white/10 rounded text-xs text-slate-200 font-mono">
                    <option value="8K Ultra HD / Studio">8K Ultra HD / Studio</option>
                    <option value="4K High Precision">4K High Precision</option>
                    <option value="Balanced Standard">Balanced Standard</option>
                  </select>
                </div>
              </div>
            </div>

            <button onClick={handleExecute} disabled={isRunning} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase rounded flex items-center justify-center gap-2 cursor-pointer mt-4">
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRunning ? 'Processing AI Request...' : 'Execute AI Tool'}</span>
            </button>

            {errorMsg && <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded text-xs text-rose-300 flex items-center gap-2"><AlertCircle className="w-4 h-4 text-rose-400 shrink-0" /><span>{errorMsg}</span></div>}
          </div>

          {/* Output Panel (Right) */}
          <div className="lg:col-span-7 bg-[#151517] border border-white/10 rounded-lg p-5 min-h-[500px] flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Live Generated Output</span>
                {executionTime && <span className="text-green-400 text-[11px] bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 font-bold">{executionTime}ms</span>}
              </div>

              {!outputResult && !imageUrlResult && !audioUrlResult && !videoUrlResult && !isRunning && (
                <div className="text-center py-24 text-slate-500 space-y-2 border border-dashed border-white/10 rounded-lg bg-[#0A0A0A]/40">
                  <FileText className="w-10 h-10 mx-auto opacity-30 text-slate-400" />
                  <p className="text-xs font-bold text-slate-300 uppercase">Awaiting Execution Input</p>
                  <p className="text-[11px]">Configure parameters on the left and tap "Execute AI Tool".</p>
                </div>
              )}

              {isRunning && <AIProcessingState tool={tool} currentStep={currentStep} progressPercent={progressPercent} elapsedSec={elapsedSec} uploadedFile={uploadedFile} inputValues={inputValues} />}

              {/* LIVE IMAGE OUTPUT */}
              {imageUrlResult && !isRunning && (
                <div className="space-y-3">
                  <div className="rounded border border-white/10 bg-[#0A0A0A] p-2 flex items-center justify-center min-h-[320px]">
                    <img src={imageUrlResult} alt="Generated Artwork" className="w-full h-auto max-h-[440px] object-contain rounded" />
                  </div>
                  <button onClick={() => handleDirectDownloadMedia(imageUrlResult, `${tool.id}-masterpiece.png`)} disabled={isDownloading} className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase rounded flex items-center justify-center gap-2 cursor-pointer">
                    {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span>Direct Download Ultra-HD Image</span>
                  </button>
                </div>
              )}

              {/* LIVE VIDEO OUTPUT PLAYER */}
              {videoUrlResult && !isRunning && (
                <AIVideoPlayer videoUrl={videoUrlResult} promptText={inputValues.prompt || tool.name} durationSec={15} toolName={tool.name} onDownload={() => handleDirectDownloadMedia(videoUrlResult, `${tool.id}-video.mp4`)} />
              )}

              {/* LIVE AUDIO PLAYER */}
              {audioUrlResult && !isRunning && (
                <div className="space-y-3 p-4 bg-[#0A0A0A] border border-white/10 rounded text-center">
                  <Volume2 className="w-8 h-8 text-indigo-400 mx-auto" />
                  <audio controls src={audioUrlResult} className="w-full" autoPlay />
                  <button onClick={() => handleDirectDownloadMedia(audioUrlResult, `${tool.id}-audio.mp3`)} className="w-full py-2 px-4 bg-indigo-600 text-white font-bold text-xs uppercase rounded flex items-center justify-center gap-2 cursor-pointer">
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

              {/* LIVE STREAM ENDPOINT CARD */}
              <div className="p-3 bg-[#0A0A0A] border border-indigo-500/30 rounded text-xs space-y-2 mt-4">
                <div className="flex items-center justify-between text-[10px] font-bold text-indigo-400 uppercase">
                  <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> Live API Endpoint Link</span>
                  <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">CONNECTED</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="text" readOnly value={videoUrlResult || imageUrlResult || audioUrlResult || `${window.location.origin}${apiService.getEndpointForTool(tool)}`} className="w-full bg-[#151517] border border-white/10 rounded px-2.5 py-1.5 text-xs text-slate-300 font-mono truncate focus:outline-none" />
                  <button onClick={() => { navigator.clipboard.writeText(videoUrlResult || imageUrlResult || audioUrlResult || `${window.location.origin}${apiService.getEndpointForTool(tool)}`); setCopiedLink(true); setTimeout(() => setCopiedLink(false), 2000); }} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded text-xs shrink-0 cursor-pointer">
                    {copiedLink ? 'Copied!' : 'Copy Link'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Alternatives */}
        <div className="pt-8 border-t border-white/10 space-y-4">
          <h2 className="text-lg font-bold text-white">Related AI Tools in "{tool.category}"</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTools.map((relTool) => (
              <ToolCard key={relTool.id} tool={relTool} isFavorite={favoriteIds.includes(relTool.id)} isCompared={comparedTools.some((t) => t.id === relTool.id)} onToggleFavorite={onToggleFavorite} onToggleCompare={onToggleCompare} onRunTool={onSelectTool} onSelectTag={onSelectTag} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
