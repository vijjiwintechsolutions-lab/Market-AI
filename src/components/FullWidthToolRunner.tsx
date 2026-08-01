import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FileDetectionTooltipCard } from './FileDetectionTooltipCard';
import { 
  ArrowLeft, 
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
  X, 
  Paperclip, 
  Activity,
  Wand2,
  Languages
} from 'lucide-react';
import { AITool, ExecutionHistoryItem } from '../types';
import { ToolCard } from './ToolCard';
import { apiService } from '../services/apiService';
import { AIProcessingState } from './AIProcessingState';
import { AIVideoPlayer } from './AIVideoPlayer';
import { ValidationToast } from './ValidationToast';
import { PresetSelector } from './PresetSelector';
import { LatencyToastAlert } from './LatencyToastAlert';
import { LatencySettingsModal } from './LatencySettingsModal';
import { getLatencySettings, showNativeBrowserNotification } from '../utils/latencySettings';
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
}

const compressImageBase64 = (dataUrl: string, maxWidth = 1200, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    if (!dataUrl.startsWith('data:image/')) return resolve(dataUrl);
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(dataUrl);

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl);
  });
};

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
}) => {
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
    return {
      availableFormats: ['Markdown (.md)', 'Plain Text (.txt)', 'Structured JSON (.json)', 'HTML Document (.html)'],
      defaultFormat: 'Markdown (.md)',
    };
  }, [tool]);

  const [inputValues, setInputValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    tool.inputs.forEach((param) => {
      initial[param.id] = param.defaultValue !== undefined ? param.defaultValue : '';
    });
    initial['outputFormat'] = defaultFormat;
    initial['promptLanguage'] = 'Auto-Detect / Any Language';
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

  useEffect(() => {
    const initial: Record<string, any> = {};
    tool.inputs.forEach((param) => {
      initial[param.id] = param.defaultValue !== undefined ? param.defaultValue : '';
    });
    initial['outputFormat'] = defaultFormat;
    initial['promptLanguage'] = 'Auto-Detect / Any Language';
    setInputValues(initial);
    setOutputResult(null);
    setImageUrlResult(null);
    setAudioUrlResult(null);
    setVideoUrlResult(null);
    setVideoPosterUrl(null);
    setErrorMsg(null);
    setExecutionTime(null);
    setUploadedFile(null);
    setFilePreview(null);
    setUserRating(0);
    setRatingSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tool.id, defaultFormat]);

  const handleInputChange = (id: string, value: any) => {
    setInputValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleApplyPreset = (presetValues: Record<string, any>, presetTitle: string) => {
    setInputValues((prev) => ({ ...prev, ...presetValues }));
    setValidationToast({
      type: 'warning',
      title: 'Preset Loaded',
      message: `Loaded: "${presetTitle}".`,
    });
    setErrorMsg(null);
  };

  // Auto Prompt Magic Enhancer button for user
  const handleEnhanceUserPrompt = (paramId: string) => {
    const currentText = inputValues[paramId] || '';
    if (!currentText.trim()) return;

    const enhanced = `High-resolution realistic scene of ${currentText}, clear face, sharp eyes, detailed clothes and equipment, natural lighting, crowd background, 8k quality`;
    handleInputChange(paramId, enhanced);

    setValidationToast({
      type: 'warning',
      title: 'Auto Prompt Magic Applied',
      message: 'Expanded simple input with high-detail AI generation parameters.',
    });
  };

  const processFile = async (file: File) => {
    const valRes = validateUploadedFile(file, tool);
    if (!valRes.valid) {
      setValidationToast({
        type: 'error',
        title: 'File Limit Exceeded',
        message: valRes.error || 'The uploaded file exceeds size limits.',
      });
      setErrorMsg(valRes.error || 'File size limit exceeded');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setValidationToast(null);
    setErrorMsg(null);
    setUploadedFile(file);

    const dataUrlReader = new FileReader();
    dataUrlReader.onload = async () => {
      let resultStr = dataUrlReader.result as string;

      if (file.type.startsWith('image/')) {
        resultStr = await compressImageBase64(resultStr, 1200, 0.7);
      }

      setFilePreview(resultStr);
      handleInputChange('filePreview', resultStr);
      handleInputChange('file', resultStr);
    };
    dataUrlReader.readAsDataURL(file);
  };

  const handleExecute = async () => {
    const execValidation = validateToolExecution(tool, inputValues, uploadedFile);
    if (!execValidation.valid) {
      setValidationToast({
        type: 'error',
        title: 'Input Validation Failed',
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
    const promptSummary = apiService.extractPrompt(inputValues, tool.name);

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
      setCurrentStep('Step 1/4: Validating prompt & language...');
      await new Promise((r) => setTimeout(r, 200));
      setCurrentStep('Step 2/4: Applying AI Auto-Enhance Engine...');
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

      setCurrentStep('Step 4/4: Delivering final output...');
      await new Promise((r) => setTimeout(r, 200));
      const elapsed = Date.now() - startTime;
      const executionMs = res.executionTimeMs || elapsed;
      setExecutionTime(executionMs);

      if (res.success) {
        setProgressPercent(100);
        const rawOutput = res.output;
        const textFormatted = typeof rawOutput === 'object' ? JSON.stringify(rawOutput, null, 2) : String(rawOutput || '');

        if (isVideoTool || tool.outputType === 'video' || res.videoUrl) {
          const videoSrc = res.videoUrl || (typeof rawOutput === 'string' && rawOutput.startsWith('/') ? rawOutput : '/api/video-stream');
          setVideoUrlResult(videoSrc);
          setVideoMp4Url(videoSrc);
          const poster = res.frameUrl || `https://image.pollinations.ai/prompt/${encodeURIComponent(promptSummary)}?width=1280&height=720&model=flux&nologo=true`;
          setVideoPosterUrl(poster);
          setImageUrlResult(null);
          setAudioUrlResult(null);
          setVideoDuration(res.durationSec || 15);
          setOutputResult(res.textOutput || `Video generated successfully (${res.durationSec || 15}s duration).`);
        } else if (tool.outputType === 'image' || tool.category === 'Image AI') {
          setImageUrlResult(res.imageUrl || (typeof rawOutput === 'string' ? rawOutput : ''));
          setVideoUrlResult(null);
          setAudioUrlResult(null);
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
      setErrorMsg(err.message || 'Server connection error');
    } finally {
      clearInterval(progressInterval);
      clearInterval(timerInterval);
      setIsRunning(false);
      setCurrentStep('');
    }
  };

  const handleDirectDownloadMedia = async (mediaUrl: string | null, defaultFileName: string) => {
    if (!mediaUrl) return;
    setIsDownloading(true);
    try {
      const response = await fetch(mediaUrl, { mode: 'cors' });
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = defaultFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      const link = document.createElement('a');
      link.href = mediaUrl;
      link.target = '_blank';
      link.download = defaultFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] pb-12 font-sans">
      {/* Top Bar */}
      <div className="bg-[#151517] border-b border-white/10 sticky top-0 z-30 px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-bold rounded cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Marketplace</span>
        </button>
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-bold border border-indigo-500/20 text-[10px]">
            Auto Prompt Enhancer Active
          </span>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 space-y-8">
        {/* Banner */}
        <div className="bg-[#151517] border border-white/10 rounded-lg p-5 flex flex-col md:flex-row justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">
              {tool.category}
            </span>
            <h1 className="text-2xl font-extrabold text-white mt-1">{tool.name}</h1>
            <p className="text-xs text-slate-300">{tool.description}</p>
          </div>
        </div>

        {/* Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Prompt Bar & Parameters */}
          <div className="lg:col-span-5 bg-[#151517] border border-white/10 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono font-bold uppercase text-indigo-400 flex items-center gap-1.5">
                <Sliders className="w-4 h-4" /> Multilingual Smart Prompt Bar
              </span>
              <PresetSelector tool={tool} onApplyPreset={handleApplyPreset} />
            </div>

            {/* Prompt Input with Language Selector */}
            {tool.inputs.map((param) => (
              <div key={param.id} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 font-mono flex items-center gap-1">
                    {param.name} {param.required && <span className="text-rose-400">*</span>}
                  </label>
                  {(param.type === 'textarea' || param.type === 'text') && (
                    <button
                      onClick={() => handleEnhanceUserPrompt(param.id)}
                      className="text-[10px] bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 font-mono px-2 py-0.5 rounded border border-indigo-500/40 flex items-center gap-1 cursor-pointer"
                    >
                      <Wand2 className="w-3 h-3 text-indigo-400" />
                      <span>Auto Magic Enhance</span>
                    </button>
                  )}
                </div>

                {param.type === 'textarea' || param.type === 'text' ? (
                  <div className="space-y-2">
                    <textarea
                      rows={4}
                      value={inputValues[param.id] || ''}
                      onChange={(e) => handleInputChange(param.id, e.target.value)}
                      placeholder={`Type in ANY language (e.g., Telugu, Hindi, English, "indian boy playing cricket with friends")...`}
                      className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none font-mono leading-relaxed"
                    />
                    
                    {/* Prompt Bar Language Dropdown */}
                    <div className="flex items-center justify-between bg-[#0A0A0A] p-2 rounded border border-white/5 text-[11px] font-mono">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Languages className="w-3.5 h-3.5 text-indigo-400" /> Input Language:
                      </span>
                      <select
                        value={inputValues.promptLanguage || 'Auto-Detect / Any Language'}
                        onChange={(e) => handleInputChange('promptLanguage', e.target.value)}
                        className="bg-transparent text-indigo-300 font-bold focus:outline-none cursor-pointer"
                      >
                        <option value="Auto-Detect / Any Language" className="bg-[#0A0A0A] text-white">Auto-Detect / Any Language</option>
                        <option value="Telugu / తెలుగు" className="bg-[#0A0A0A] text-white">Telugu / తెలుగు</option>
                        <option value="Telugu English / తెల్గీష్" className="bg-[#0A0A0A] text-white">Telugu English / Telgish</option>
                        <option value="Hindi / हिंदी" className="bg-[#0A0A0A] text-white">Hindi / हिंदी</option>
                        <option value="Tamil / தமிழ்" className="bg-[#0A0A0A] text-white">Tamil / தமிழ்</option>
                        <option value="English" className="bg-[#0A0A0A] text-white">English</option>
                        <option value="Spanish / Español" className="bg-[#0A0A0A] text-white">Spanish / Español</option>
                      </select>
                    </div>
                  </div>
                ) : param.type === 'select' ? (
                  <select
                    value={inputValues[param.id] || param.options?.[0]}
                    onChange={(e) => handleInputChange(param.id, e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white focus:border-indigo-500 font-mono cursor-pointer"
                  >
                    {param.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : null}
              </div>
            ))}

            {/* Execute CTA */}
            <button
              onClick={handleExecute}
              disabled={isRunning}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded shadow flex items-center justify-center gap-2 transition-all cursor-pointer font-mono"
            >
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRunning ? 'Processing AI Magic...' : 'Execute AI Tool'}</span>
            </button>
          </div>

          {/* RIGHT: Live Feed */}
          <div className="lg:col-span-7 bg-[#151517] border border-white/10 rounded-lg p-5 flex flex-col justify-between min-h-[500px] h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-mono font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Live Ultra-HD Generated Output
                </span>
                {executionTime && <span className="text-green-400 font-mono text-[11px] bg-green-500/10 px-2 py-0.5 rounded">{executionTime}ms</span>}
              </div>

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

              {imageUrlResult && (
                <div className="space-y-3">
                  <div className="rounded border border-white/10 bg-[#0A0A0A] p-2 flex items-center justify-center min-h-[300px]">
                    <img src={imageUrlResult} alt="Generated AI Artwork" className="w-full h-auto max-h-[420px] object-contain rounded" />
                  </div>
                  <button
                    onClick={() => handleDirectDownloadMedia(imageUrlResult, `${tool.id}-masterpiece.png`)}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono uppercase tracking-wider rounded shadow flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" /> Direct Download Ultra-HD Image
                  </button>
                </div>
              )}

              {outputResult && !imageUrlResult && (
                <div className="bg-[#0A0A0A] border border-white/10 rounded p-4 text-xs font-mono whitespace-pre-wrap leading-relaxed">
                  {outputResult}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
