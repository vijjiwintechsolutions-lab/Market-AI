import React, { useState, useRef, useMemo } from 'react';
import { FileDetectionTooltipCard } from './FileDetectionTooltipCard';
import { 
  X, 
  Play, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Zap, 
  Clock, 
  RefreshCw, 
  Star, 
  UploadCloud, 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  Volume2, 
  FileText, 
  Globe, 
  Paperclip, 
  Activity 
} from 'lucide-react';
import { AITool, ExecutionHistoryItem } from '../types';
import { apiService } from '../services/apiService';
import { AIProcessingState } from './AIProcessingState';
import { AIVideoPlayer } from './AIVideoPlayer';
import { ValidationToast } from './ValidationToast';
import { PresetSelector } from './PresetSelector';
import { LatencyToastAlert } from './LatencyToastAlert';
import { LatencySettingsModal } from './LatencySettingsModal';
import { getLatencySettings, showNativeBrowserNotification } from '../utils/latencySettings';
import { validateUploadedFile, validateToolExecution } from '../utils/toolValidator';

interface LiveToolRunnerModalProps {
  tool: AITool | null;
  onClose: () => void;
  onSaveHistory: (item: ExecutionHistoryItem) => void;
}

export const LiveToolRunnerModal: React.FC<LiveToolRunnerModalProps> = ({
  tool,
  onClose,
  onSaveHistory,
}) => {
  if (!tool) return null;

  // Compute tool-specific formats
  const { availableFormats, defaultFormat } = useMemo(() => {
    const cat = tool.category;
    const outType = tool.outputType;

    if (cat === 'Image AI' || outType === 'image') {
      return {
        availableFormats: ['PNG Image (.png)', 'JPG Image (.jpg)', 'WebP Image (.webp)', 'SVG Vector (.svg)'],
        defaultFormat: 'PNG Image (.png)',
      };
    }
    if (cat === 'Video AI' || outType === 'video') {
      return {
        availableFormats: ['MP4 Video (.mp4)', 'WebM Video (.webm)', 'GIF Animation (.gif)'],
        defaultFormat: 'MP4 Video (.mp4)',
      };
    }
    if (cat === 'Audio & Voice' || outType === 'audio') {
      return {
        availableFormats: ['MP3 Audio (.mp3)', 'WAV Audio (.wav)', 'AAC Audio (.aac)', 'OGG Audio (.ogg)'],
        defaultFormat: 'MP3 Audio (.mp3)',
      };
    }
    if (cat === 'Coding & Dev' || outType === 'code') {
      return {
        availableFormats: ['TypeScript (.ts)', 'JavaScript (.js)', 'Python (.py)', 'JSON Object (.json)', 'Markdown (.md)'],
        defaultFormat: 'TypeScript (.ts)',
      };
    }
    if (cat === 'PDF & Documents') {
      return {
        availableFormats: ['Markdown (.md)', 'Plain Text (.txt)', 'PDF Document (.pdf)', 'JSON Data (.json)'],
        defaultFormat: 'Markdown (.md)',
      };
    }
    return {
      availableFormats: ['Markdown (.md)', 'Plain Text (.txt)', 'Structured JSON (.json)', 'HTML Document (.html)'],
      defaultFormat: 'Markdown (.md)',
    };
  }, [tool]);

  // Form input state
  const [inputValues, setInputValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    tool.inputs.forEach((param) => {
      initial[param.id] = param.defaultValue !== undefined ? param.defaultValue : '';
    });
    initial['outputFormat'] = defaultFormat;
    initial['language'] = 'English';
    return initial;
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  // Execution States
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [outputResult, setOutputResult] = useState<string | null>(null);
  const [audioUrlResult, setAudioUrlResult] = useState<string | null>(null);
  const [imageUrlResult, setImageUrlResult] = useState<string | null>(null);
  const [videoUrlResult, setVideoUrlResult] = useState<string | null>(null);
  const [videoMp4Url, setVideoMp4Url] = useState<string | null>(null);
  const [videoPosterUrl, setVideoPosterUrl] = useState<string | null>(null);
  const [videoDuration, setVideoDuration] = useState<number>(15);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [validationToast, setValidationToast] = useState<{
    type: 'error' | 'warning';
    title: string;
    message: string;
    details?: string[];
  } | null>(null);
  const [latencyToast, setLatencyToast] = useState<{
    provider: string;
    toolName: string;
    latencyMs: number;
    thresholdMs: number;
  } | null>(null);
  const [isLatencySettingsOpen, setIsLatencySettingsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userRating, setUserRating] = useState<number>(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (id: string, value: any) => {
    setInputValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleApplyPreset = (presetValues: Record<string, any>, presetTitle: string) => {
    setInputValues((prev) => ({
      ...prev,
      ...presetValues,
    }));
    setValidationToast({
      type: 'warning',
      title: 'Preset Loaded',
      message: `Loaded example: "${presetTitle}".`,
    });
    setErrorMsg(null);
  };

  const processFile = (file: File) => {
    const valRes = validateUploadedFile(file, tool);
    if (!valRes.valid) {
      setValidationToast({
        type: 'error',
        title: 'Unsupported File Format',
        message: valRes.error || 'File format not supported.',
      });
      setErrorMsg(valRes.error || 'Unsupported file format');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setValidationToast(null);
    setErrorMsg(null);
    setUploadedFile(file);

    const dataUrlReader = new FileReader();
    dataUrlReader.onload = () => {
      const resultStr = dataUrlReader.result as string;
      setFilePreview(resultStr);
      handleInputChange('filePreview', resultStr);
      handleInputChange('file', resultStr);
      if (!inputValues.documentText) {
        handleInputChange('documentText', `[File Attached: ${file.name}]`);
      }
      if (!inputValues.prompt) {
        handleInputChange('prompt', `Analyze attached file: ${file.name}`);
      }
    };
    dataUrlReader.readAsDataURL(file);
  };

  const clearUploadedFile = () => {
    setUploadedFile(null);
    setFilePreview(null);
    setValidationToast(null);
    handleInputChange('filePreview', null);
    handleInputChange('documentText', null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleExecute = async () => {
    const execValidation = validateToolExecution(tool, inputValues, uploadedFile);
    if (!execValidation.valid) {
      setValidationToast({
        type: 'error',
        title: 'Validation Failed',
        message: 'Please complete all required fields.',
        details: execValidation.errors,
      });
      setErrorMsg(execValidation.errors.join(' | '));
      return;
    }
    setValidationToast(null);
    setIsRunning(true);
    setErrorMsg(null);
    setOutputResult(null);
    setImageUrlResult(null);
    setAudioUrlResult(null);
    setVideoUrlResult(null);
    setExecutionTime(null);
    setProgressPercent(8);
    setElapsedSec(0);
    const startTime = Date.now();

    const progressInterval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev < 30) return prev + 3;
        if (prev < 65) return prev + 2;
        if (prev < 90) return prev + 1;
        if (prev < 98) return prev + 0.3;
        return prev;
      });
    }, 200);

    const timerInterval = setInterval(() => {
      setElapsedSec((prev) => parseFloat((prev + 0.1).toFixed(1)));
    }, 100);

    try {
      setCurrentStep('Step 1/4: Validating input payload...');
      await new Promise((r) => setTimeout(r, 200));
      setCurrentStep('Step 2/4: Routing request to Neural AI Provider...');
      await new Promise((r) => setTimeout(r, 300));
      setCurrentStep('Step 3/4: Executing AI Model Inference Engine...');

      const isVideoTool =
        tool.outputType === 'video' ||
        tool.category === 'Video AI' ||
        tool.id.toLowerCase().includes('video');

      const res = await apiService.executeTool({
        tool,
        inputValues,
        filePreview,
      });

      setCurrentStep('Step 4/4: Delivering output stream...');
      await new Promise((r) => setTimeout(r, 200));
      const elapsed = Date.now() - startTime;
      const executionMs = res.executionTimeMs || elapsed;
      setExecutionTime(executionMs);

      const latSettings = getLatencySettings();
      if (latSettings.enabled && executionMs > latSettings.thresholdMs) {
        setLatencyToast({
          provider: res.provider || tool.provider || 'AI Provider Router',
          toolName: tool.name,
          latencyMs: executionMs,
          thresholdMs: latSettings.thresholdMs,
        });
      }

      if (res.success) {
        setProgressPercent(100);
        const rawOutput = res.output;
        const textFormatted = typeof rawOutput === 'object' ? JSON.stringify(rawOutput, null, 2) : String(rawOutput || '');

        if (isVideoTool || tool.outputType === 'video' || res.videoUrl) {
          const videoSrc = res.videoUrl || (typeof rawOutput === 'string' && rawOutput.startsWith('/') ? rawOutput : '/api/video-stream');
          setVideoUrlResult(videoSrc);
          setVideoMp4Url(videoSrc);
          const promptStr = apiService.extractPrompt(inputValues, tool.description);
          const poster = res.frameUrl || `https://image.pollinations.ai/prompt/${encodeURIComponent(promptStr)}?width=1280&height=720&model=flux&nologo=true`;
          setVideoPosterUrl(poster);
          setImageUrlResult(null);
          setVideoDuration(res.durationSec || 15);
          setOutputResult(res.textOutput || `Video generated successfully (${res.durationSec || 15}s duration).`);
        } else if (tool.outputType === 'image' || tool.category === 'Image AI') {
          setImageUrlResult(res.imageUrl || (typeof rawOutput === 'string' ? rawOutput : ''));
          setVideoUrlResult(null);
          setOutputResult(res.textOutput || 'Image generated successfully.');
        } else if (tool.outputType === 'audio' || tool.category === 'Audio & Voice') {
          const audioSrc = res.audioUrl || (typeof rawOutput === 'string' ? rawOutput : '');
          setAudioUrlResult(audioSrc || null);
          setVideoUrlResult(null);
          setImageUrlResult(null);
          setOutputResult(res.textOutput || 'Audio synthesized successfully.');
        } else {
          setVideoUrlResult(null);
          setImageUrlResult(null);
          setAudioUrlResult(null);
          setOutputResult(res.textOutput ? `${res.textOutput}\n\n${textFormatted}` : textFormatted);
        }

        const promptSummary = apiService.extractPrompt(inputValues, tool.name);
        onSaveHistory({
          id: `hist-${Date.now()}`,
          toolId: tool.id,
          toolName: tool.name,
          prompt: String(promptSummary).substring(0, 150),
          output: textFormatted.substring(0, 300),
          timestamp: new Date().toLocaleTimeString(),
          executionTimeMs: res.executionTimeMs || elapsed,
          outputType: tool.outputType,
          outputUrl: typeof rawOutput === 'string' && (rawOutput.startsWith('http') || rawOutput.startsWith('data:') || rawOutput.startsWith('/api')) ? rawOutput : undefined,
        });
      } else {
        setErrorMsg(res.error || 'Execution failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Server communication error');
    } finally {
      clearInterval(progressInterval);
      clearInterval(timerInterval);
      setIsRunning(false);
      setCurrentStep('');
    }
  };

  const handleCopyOutput = () => {
    if (outputResult) {
      navigator.clipboard.writeText(outputResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDirectDownloadMedia = async (mediaUrl: string | null, defaultFileName: string) => {
    if (!mediaUrl) return;
    setIsDownloading(true);
    try {
      const downloadProxyUrl = `/api/download?url=${encodeURIComponent(mediaUrl)}&filename=${encodeURIComponent(defaultFileName)}`;
      const link = document.createElement('a');
      link.href = downloadProxyUrl;
      link.download = defaultFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setTimeout(() => setIsDownloading(false), 1200);
    }
  };

  const handleDownloadTextOutput = (text: string, extension = 'txt') => {
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tool.id}-output-${Date.now()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto text-white flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white">{tool.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono font-semibold">
                  Live Studio
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Provider: <span className="text-slate-200 font-medium">{tool.provider}</span> | Model: <span className="text-slate-200 font-mono">{tool.modelUsed}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLatencySettingsOpen(true)}
              className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline">Latency Settings</span>
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 overflow-y-auto flex-1 items-start">
          {/* LEFT: Inputs */}
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 border-b border-slate-800/80 pb-2 gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                <Sliders className="w-4 h-4 shrink-0" /> Parameters & Inputs
              </span>
              <div className="flex items-center gap-2">
                <PresetSelector tool={tool} onApplyPreset={handleApplyPreset} />
              </div>
            </div>

            {latencyToast && (
              <LatencyToastAlert
                provider={latencyToast.provider}
                toolName={latencyToast.toolName}
                latencyMs={latencyToast.latencyMs}
                thresholdMs={latencyToast.thresholdMs}
                onDismiss={() => setLatencyToast(null)}
                onOpenSettings={() => setIsLatencySettingsOpen(true)}
              />
            )}
            {validationToast && (
              <ValidationToast
                type={validationToast.type}
                title={validationToast.title}
                message={validationToast.message}
                details={validationToast.details}
                onDismiss={() => setValidationToast(null)}
              />
            )}

            {tool.inputs.map((param, idx) => (
              <div key={param.id} className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <label className="block text-xs font-semibold text-slate-200 font-mono">
                    {param.name} {param.required && <span className="text-rose-400">*</span>}
                  </label>
                  {(param.type === 'textarea' || (param.type === 'text' && idx === 0)) && (
                    <PresetSelector tool={tool} onApplyPreset={handleApplyPreset} compact={true} />
                  )}
                </div>

                {param.type === 'text' && (
                  <input
                    type="text"
                    value={inputValues[param.id] || ''}
                    onChange={(e) => handleInputChange(param.id, e.target.value)}
                    placeholder={param.description || `Enter ${param.name}...`}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                  />
                )}
                {param.type === 'textarea' && (
                  <textarea
                    rows={4}
                    value={inputValues[param.id] || ''}
                    onChange={(e) => handleInputChange(param.id, e.target.value)}
                    placeholder={param.description || `Enter prompt / content for ${param.name}...`}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:border-emerald-500 focus:outline-none font-sans"
                  />
                )}
                {param.type === 'select' && (
                  <select
                    value={inputValues[param.id] || param.options?.[0]}
                    onChange={(e) => handleInputChange(param.id, e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 focus:border-emerald-500 focus:outline-none cursor-pointer"
                  >
                    {param.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}

            {/* File & URL */}
            <div className="pt-3 border-t border-slate-800 space-y-3 font-mono">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Paperclip className="w-3.5 h-3.5" /> Source Attachment
                </span>
              </div>

              {!uploadedFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-800 hover:border-emerald-500/60 bg-slate-950/60 rounded-xl p-3 text-center cursor-pointer transition-colors"
                >
                  <UploadCloud className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                  <p className="text-xs text-slate-300 font-medium">Click to browse or Drag & Drop</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                    className="hidden"
                    accept="*/*"
                  />
                </div>
              ) : (
                <div className="p-2.5 bg-slate-950 border border-emerald-500/40 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs text-white truncate">{uploadedFile.name}</span>
                  </div>
                  <button onClick={clearUploadedFile} className="p-1 hover:bg-rose-500/20 text-rose-400 rounded-lg">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Format & Language Selection */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400">Output Format</label>
                  <select
                    value={inputValues.outputFormat || defaultFormat}
                    onChange={(e) => handleInputChange('outputFormat', e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:border-emerald-500 focus:outline-none cursor-pointer"
                  >
                    {availableFormats.map((fmt) => (
                      <option key={fmt} value={fmt}>
                        {fmt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400">Language</label>
                  <select
                    value={inputValues.language || 'English'}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:border-emerald-500 focus:outline-none cursor-pointer"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                    <option value="Japanese">Japanese</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Auto-detect">Auto-detect</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleExecute}
              disabled={isRunning}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Execute AI Tool</span>
                </>
              )}
            </button>
          </div>

          {/* RIGHT: Fixed & Stable Output Panel */}
          <div className="p-5 flex flex-col justify-between bg-slate-950/40 min-h-[480px] h-full">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300 border-b border-slate-800/80 pb-2 mb-4">
                <span className="flex items-center gap-1.5 text-indigo-400">
                  <Sparkles className="w-4 h-4" /> Live Generated Output
                </span>
                {executionTime && (
                  <span className="text-emerald-400 font-mono text-[11px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> {executionTime}ms
                  </span>
                )}
              </div>

              {!outputResult && !imageUrlResult && !audioUrlResult && !videoUrlResult && !isRunning && (
                <div className="text-center py-20 text-slate-500 space-y-3 border-2 border-dashed border-slate-800/80 rounded-2xl my-auto font-mono">
                  <FileText className="w-10 h-10 mx-auto opacity-40 text-slate-400" />
                  <p className="text-sm font-medium">No output generated yet.</p>
                  <p className="text-xs max-w-xs mx-auto">Fill parameters on the left and click "Execute AI Tool".</p>
                </div>
              )}

              {isRunning && (
                <AIProcessingState
                  tool={tool}
                  currentStep={currentStep}
                  progressPercent={progressPercent}
                  elapsedSec={elapsedSec}
                  uploadedFile={uploadedFile}
                  inputValues={inputValues}
                />
              )}

              {videoUrlResult && (
                <AIVideoPlayer
                  videoUrl={videoMp4Url || videoUrlResult || '/api/video-stream'}
                  posterUrl={videoPosterUrl || imageUrlResult || undefined}
                  promptText={inputValues.prompt || 'Cinematic AI Video Synthesis'}
                  durationSec={videoDuration || 15}
                  toolName={tool.name}
                  onDownload={() => handleDirectDownloadMedia(videoMp4Url || videoUrlResult, `${tool.id}-video.mp4`)}
                />
              )}

              {imageUrlResult && (
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-2xl p-2 bg-[#0A0A0A] min-h-[260px] flex items-center justify-center">
                    <img src={imageUrlResult} alt="Generated AI Artwork" className="w-full h-auto max-h-[350px] object-contain mx-auto rounded-lg" />
                  </div>
                  <button
                    onClick={() => handleDirectDownloadMedia(imageUrlResult, `${tool.id}-image.png`)}
                    disabled={isDownloading}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-colors w-full cursor-pointer"
                  >
                    {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span>Direct Download High-Res Image</span>
                  </button>
                </div>
              )}

              {audioUrlResult && (
                <div className="space-y-3 p-4 bg-slate-900 border border-slate-800 rounded-xl text-center">
                  <Volume2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <audio controls src={audioUrlResult} className="w-full" autoPlay />
                  <button
                    onClick={() => handleDirectDownloadMedia(audioUrlResult, `${tool.id}-audio.mp3`)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl w-full cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Download Audio File
                  </button>
                </div>
              )}

              {outputResult && (
                <div className="space-y-3">
                  <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 font-mono whitespace-pre-wrap max-h-[320px] min-h-[180px] overflow-y-auto leading-relaxed shadow-inner">
                    {outputResult}
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <button
                      onClick={handleCopyOutput}
                      className="flex-1 py-2.5 px-3 bg-slate-800 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1.5"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied!' : 'Copy Result'}</span>
                    </button>
                    <button
                      onClick={() => handleDownloadTextOutput(outputResult, 'txt')}
                      className="flex-1 py-2.5 px-3 bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download (.txt)</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Rate tool execution:</span>
                {ratingSubmitted ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Rating recorded!
                  </span>
                ) : (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => {
                          setUserRating(star);
                          setRatingSubmitted(true);
                        }}
                        className="p-1 text-slate-600 hover:text-amber-400 cursor-pointer"
                      >
                        <Star className={`w-4 h-4 ${userRating >= star ? 'fill-amber-400 text-amber-400' : ''}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <LatencySettingsModal
        isOpen={isLatencySettingsOpen}
        onClose={() => setIsLatencySettingsOpen(false)}
      />
    </div>
  );
};
