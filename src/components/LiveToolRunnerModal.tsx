import React, { useState, useRef } from 'react';
import { FileDetectionTooltipCard } from './FileDetectionTooltipCard';
import { 
  X, 
  Play, 
  Pause,
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
  Image as ImageIcon,
  Code2,
  FileText,
  Video,
  Globe,
  Paperclip,
  Languages,
  File,
  Trash2,
  Link as LinkIcon,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { AITool, ExecutionHistoryItem } from '../types';
import { apiService } from '../services/apiService';
import { AIProcessingState } from './AIProcessingState';
import { AIVideoPlayer } from './AIVideoPlayer';
import { ValidationToast } from './ValidationToast';
import { PresetSelector } from './PresetSelector';
import { LatencyToastAlert } from './LatencyToastAlert';
import { LatencySettingsModal } from './LatencySettingsModal';
import { ParamFileInput } from './ParamFileInput';
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

  // Form input state initialized from tool inputs default values
  const [inputValues, setInputValues] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    tool.inputs.forEach((param) => {
      initial[param.id] = param.defaultValue !== undefined ? param.defaultValue : '';
    });
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
  const [copiedLink, setCopiedLink] = useState(false);
  const [videoDuration, setVideoDuration] = useState<number>(15);
  const [isPanning, setIsPanning] = useState(false);
  const [videoMode, setVideoMode] = useState<'pan' | 'mp4'>('mp4');
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
      console.error('Download trigger error:', err);
    } finally {
      setTimeout(() => setIsDownloading(false), 1200);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (id: string, value: any) => {
    setInputValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleApplyPreset = (presetValues: Record<string, any>, presetTitle: string) => {
    setInputValues((prev) => ({
      ...prev,
      ...presetValues
    }));
    setValidationToast({
      type: 'warning',
      title: 'Preset Loaded',
      message: `Populated fields with pre-configured example prompt: "${presetTitle}".`
    });
    setErrorMsg(null);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const processFile = (file: File) => {
    if (!tool) return;

    // Validate file type & size constraints against tool limits
    const valRes = validateUploadedFile(file, tool);
    if (!valRes.valid) {
      setValidationToast({
        type: 'error',
        title: 'Unsupported File Format or Size Limit',
        message: valRes.error || 'The uploaded file format is not supported by this tool.',
      });
      setErrorMsg(valRes.error || 'Unsupported file format');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setValidationToast(null);
    setErrorMsg(null);
    setUploadedFile(file);

    // Read Data URL for all media/document attachments
    const dataUrlReader = new FileReader();
    dataUrlReader.onload = () => {
      const resultStr = dataUrlReader.result as string;
      setFilePreview(resultStr);
      handleInputChange('filePreview', resultStr);
      handleInputChange('file', resultStr);

      // Satisfy any required text fields if empty when uploading a document/PDF
      if (!inputValues.documentText) {
        handleInputChange('documentText', `[PDF/Document Attached: ${file.name}]`);
      }
      if (!inputValues.prompt) {
        handleInputChange('prompt', `Analyze attached document: ${file.name}`);
      }
    };
    dataUrlReader.readAsDataURL(file);

    // Also read text content for text-based files
    if (
      file.type.startsWith('text/') ||
      file.name.endsWith('.txt') ||
      file.name.endsWith('.csv') ||
      file.name.endsWith('.json') ||
      file.name.endsWith('.md') ||
      file.name.endsWith('.ts') ||
      file.name.endsWith('.js') ||
      file.name.endsWith('.py') ||
      file.name.endsWith('.html') ||
      file.name.endsWith('.css')
    ) {
      const textReader = new FileReader();
      textReader.onload = () => {
        const textContent = textReader.result as string;
        handleInputChange('documentText', textContent);
      };
      textReader.readAsText(file);
    }
  };

  const clearUploadedFile = () => {
    setUploadedFile(null);
    setFilePreview(null);
    setValidationToast(null);
    handleInputChange('filePreview', null);
    handleInputChange('documentText', null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Run AI Tool Request
  const handleExecute = async () => {
    if (!tool) return;

    // Check validation constraints before launching API execution
    const execValidation = validateToolExecution(tool, inputValues, uploadedFile);
    if (!execValidation.valid) {
      setValidationToast({
        type: 'error',
        title: 'Input Constraint Validation Failed',
        message: 'Please resolve required parameter constraints before executing live API inference.',
        details: execValidation.errors,
      });
      setErrorMsg(execValidation.errors.join(' • '));
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
      setCurrentStep('Step 1/4: Validating input parameters & payload...');
      await new Promise((r) => setTimeout(r, 200));

      setCurrentStep('Step 2/4: Routing request through high-speed AI Cloud Gateway...');
      await new Promise((r) => setTimeout(r, 300));

      setCurrentStep('Step 3/4: Executing AI model & generating output via Gemini API...');

      const isVideoTool =
        tool.outputType === 'video' ||
        tool.category === 'Video AI' ||
        tool.id.toLowerCase().includes('video') ||
        (tool.modelUsed && tool.modelUsed.toLowerCase().includes('veo')) ||
        (tool.subcategory && tool.subcategory.toLowerCase().includes('video')) ||
        (tool.name && tool.name.toLowerCase().includes('video')) ||
        (tool.tags && tool.tags.some((t: string) => t.toLowerCase().includes('video')));

      // Delegate AI execution request to centralized apiService
      const res = await apiService.executeTool({
        tool,
        inputValues,
        filePreview,
      });

      setCurrentStep('Step 4/4: Formatting and delivering output payload...');
      await new Promise((r) => setTimeout(r, 200));

      const elapsed = Date.now() - startTime;
      const executionMs = res.executionTimeMs || elapsed;
      setExecutionTime(executionMs);

      // Latency Threshold Monitoring for Power Users
      const latSettings = getLatencySettings();
      if (latSettings.enabled && executionMs > latSettings.thresholdMs) {
        const providerName = res.provider || tool.provider || 'AI Provider Router';
        setLatencyToast({
          provider: providerName,
          toolName: tool.name,
          latencyMs: executionMs,
          thresholdMs: latSettings.thresholdMs,
        });

        if (latSettings.browserNotifications) {
          showNativeBrowserNotification(
            '⚡ High Provider Latency Warning',
            `${tool.name} via ${providerName} took ${executionMs}ms (exceeding your ${latSettings.thresholdMs}ms limit).`
          );
        }
      } else {
        setLatencyToast(null);
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
          const poster = res.frameUrl || (typeof res.output === 'string' && res.output.startsWith('http') ? res.output : `https://image.pollinations.ai/prompt/${encodeURIComponent(promptStr)}?width=1280&height=720&model=flux&nologo=true`);
          setVideoPosterUrl(poster);
          setImageUrlResult(null);
          setVideoMode('mp4');
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

        // Save History
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
        setErrorMsg(res.error || 'Execution failed. Please try again.');
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

  const handleRatingSubmit = (score: number) => {
    setUserRating(score);
    setRatingSubmitted(true);
  };

  // Tool-specific supported file format specs
  const getToolSupportedFileFormats = (t: typeof tool) => {
    const cat = (t.category || '').toLowerCase();
    const outType = t.outputType;

    if (cat.includes('image') || outType === 'image') {
      return {
        badge: 'JPG, PNG, WEBP, HEIC, RAW',
        note: 'Supports Image Files (JPG, PNG, WEBP, HEIC, JPEG, RAW)',
        accept: 'image/*,.jpg,.jpeg,.png,.webp,.heic,.raw',
      };
    }
    if (cat.includes('video') || outType === 'video') {
      return {
        badge: 'MP4, WEBM, MOV, AVI, PNG, JPG',
        note: 'Supports Video Clips (MP4, WEBM, MOV) & Reference Images (PNG, JPG)',
        accept: 'video/*,image/*,.mp4,.webm,.mov,.avi,.png,.jpg',
      };
    }
    if (cat.includes('audio') || cat.includes('voice') || outType === 'audio') {
      return {
        badge: 'MP3, WAV, M4A, OGG, FLAC',
        note: 'Supports Audio Files (MP3, WAV, M4A, OGG, FLAC)',
        accept: 'audio/*,.mp3,.wav,.m4a,.ogg,.flac',
      };
    }
    if (cat.includes('document') || cat.includes('pdf') || cat.includes('ocr')) {
      return {
        badge: 'PDF, DOCX, TXT, CSV, JSON',
        note: 'Supports Documents (PDF, DOCX, TXT, CSV, JSON, MD)',
        accept: '.pdf,.docx,.doc,.txt,.csv,.json,.md',
      };
    }
    if (cat.includes('coding') || cat.includes('dev') || cat.includes('code')) {
      return {
        badge: 'JS, TS, PY, JSON, HTML, ZIP',
        note: 'Supports Code Files (JS, TS, PY, HTML, CSS, JSON, TXT, ZIP)',
        accept: '.js,.ts,.tsx,.jsx,.py,.html,.css,.json,.txt,.zip',
      };
    }
    return {
      badge: 'PDF, DOCX, TXT, PNG, MP3, MP4',
      note: 'Supports Documents, Images, Audio & Video files',
      accept: '.pdf,.docx,.doc,.txt,.csv,.json,.md,.png,.jpg,.jpeg,.webp,.mp3,.wav,.mp4',
    };
  };

  // Tool-specific output formats
  const getOutputFormatOptions = (t: typeof tool) => {
    const cat = (t.category || '').toLowerCase();
    const outType = t.outputType;

    if (cat.includes('image') || outType === 'image') {
      return [
        { label: 'PNG Image (.png)', value: 'PNG Image' },
        { label: 'JPG Photo (.jpg)', value: 'JPG Image' },
        { label: 'JPEG High Quality (.jpeg)', value: 'JPEG Image' },
        { label: 'WEBP Web Format (.webp)', value: 'WEBP Image' },
        { label: 'RAW Master (.raw)', value: 'RAW Image' },
      ];
    }
    if (cat.includes('video') || outType === 'video') {
      return [
        { label: 'MP4 Video (.mp4)', value: 'MP4 Video' },
        { label: 'WEBM Video (.webm)', value: 'WEBM Video' },
        { label: 'MOV QuickTime (.mov)', value: 'MOV Video' },
        { label: 'AVI Clip (.avi)', value: 'AVI Video' },
        { label: 'GIF Animation (.gif)', value: 'GIF Animation' },
      ];
    }
    if (cat.includes('audio') || cat.includes('voice') || outType === 'audio') {
      return [
        { label: 'MP3 Audio (.mp3)', value: 'MP3 Audio' },
        { label: 'WAV Lossless (.wav)', value: 'WAV Audio' },
        { label: 'AAC Compressed (.aac)', value: 'AAC Audio' },
        { label: 'OGG Vorbis (.ogg)', value: 'OGG Audio' },
        { label: 'FLAC Studio (.flac)', value: 'FLAC Audio' },
      ];
    }
    if (cat.includes('coding') || cat.includes('dev') || cat.includes('code')) {
      return [
        { label: 'Executable Code / HTML', value: 'Code / HTML' },
        { label: 'JSON Object (.json)', value: 'Structured JSON' },
        { label: 'Markdown Document (.md)', value: 'Markdown Document' },
        { label: 'Plain Text (.txt)', value: 'Clean Plain Text' },
      ];
    }
    return [
      { label: 'Markdown (.md)', value: 'Markdown Document' },
      { label: 'Plain Text (.txt)', value: 'Clean Plain Text' },
      { label: 'JSON Object (.json)', value: 'Structured JSON' },
      { label: 'PDF Document (.pdf)', value: 'PDF Document' },
    ];
  };

  const supportedFormats = getToolSupportedFileFormats(tool);
  const outputFormatOptions = getOutputFormatOptions(tool);
  const isImageTool = tool.outputType === 'image' || tool.category?.toLowerCase().includes('image');
  const isVideoTool = tool.outputType === 'video' || tool.category?.toLowerCase().includes('video');
  const isAudioTool = tool.outputType === 'audio' || tool.category?.toLowerCase().includes('audio') || tool.category?.toLowerCase().includes('voice');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-auto text-white flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white">{tool.name}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono font-semibold">
                  Live Runner
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Subcategory: <span className="text-slate-200 font-medium">{tool.subcategory}</span> • Latency Target: <span className="text-emerald-400 font-mono font-bold">{tool.latencyMs}ms</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLatencySettingsOpen(true)}
              className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Power User Latency Alert Settings"
            >
              <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="hidden sm:inline">Latency Settings</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body Grid: Inputs on Left, Output on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-800 overflow-y-auto flex-1">
          
          {/* LEFT: Inputs Form */}
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 border-b border-slate-800/80 pb-2 gap-2 flex-wrap">
              <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
                <Sliders className="w-4 h-4 shrink-0" /> Tool Inputs & Parameters
              </span>
              <div className="flex items-center gap-2">
                <PresetSelector tool={tool} onApplyPreset={handleApplyPreset} />
                <span className="text-slate-500 font-mono text-[10px]">
                  {tool.inputs.length} parameters
                </span>
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
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                  />
                )}

                {param.type === 'textarea' && (
                  <textarea
                    rows={4}
                    value={inputValues[param.id] || ''}
                    onChange={(e) => handleInputChange(param.id, e.target.value)}
                    placeholder={param.description || `Enter prompt / content for ${param.name}...`}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none font-sans"
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

                {param.type === 'slider' && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-400 font-mono">
                      <span>Min: {param.min}</span>
                      <span className="text-emerald-400 font-bold">{inputValues[param.id]}</span>
                      <span>Max: {param.max}</span>
                    </div>
                    <input
                      type="range"
                      min={param.min}
                      max={param.max}
                      step={param.step || 0.1}
                      value={inputValues[param.id] || param.defaultValue}
                      onChange={(e) => handleInputChange(param.id, parseFloat(e.target.value))}
                      className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                )}

                {param.type === 'file' && (
                  <ParamFileInput
                    param={param}
                    value={inputValues[param.id]}
                    fileName={inputValues[`${param.id}_name`]}
                    onChange={(dataUrl, name) => {
                      handleInputChange(param.id, dataUrl);
                      if (name) {
                        handleInputChange(`${param.id}_name`, name);
                        if (dataUrl && dataUrl.startsWith('data:image/')) {
                          setFilePreview(dataUrl);
                        }
                      } else {
                        handleInputChange(`${param.id}_name`, null);
                      }
                    }}
                  />
                )}
              </div>
            ))}

            {/* Universal Media, Document File & Source Link Attachment Panel */}
            <div className="pt-3 border-t border-slate-800 space-y-3 font-mono">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <Paperclip className="w-3.5 h-3.5" /> Source File / Document / Media Attachment
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{supportedFormats.badge}</span>
              </div>

              {!uploadedFile ? (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-800 hover:border-emerald-500/60 bg-slate-950/60 rounded-xl p-3 text-center cursor-pointer transition-colors group"
                >
                  <UploadCloud className="w-5 h-5 text-emerald-400 mx-auto mb-1 group-hover:scale-110 transition-transform" />
                  <p className="text-xs text-slate-300 font-medium">
                    Click to browse or Drag & Drop file
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {supportedFormats.note}
                  </p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                    className="hidden"
                    accept={supportedFormats.accept}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="p-2.5 bg-slate-950 border border-emerald-500/40 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      {filePreview && filePreview.startsWith('data:image/') ? (
                        <img src={filePreview} alt="Thumbnail" className="w-9 h-9 object-cover rounded-lg border border-slate-800 shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-emerald-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-xs text-white font-medium truncate">{uploadedFile.name}</p>
                        <p className="text-[10px] text-emerald-400">{formatFileSize(uploadedFile.size)} • {uploadedFile.type || 'Document/Media'}</p>
                      </div>
                    </div>
                    <button
                      onClick={clearUploadedFile}
                      title="Remove Attachment"
                      className="p-1.5 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <FileDetectionTooltipCard file={uploadedFile} currentToolCategory={tool.category} />
                </div>
              )}

              {/* Source Web Link URL */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-400" />
                  Link from Web URL / Document Address (Optional)
                </label>
                <input
                  type="url"
                  value={inputValues.sourceUrl || ''}
                  onChange={(e) => handleInputChange('sourceUrl', e.target.value)}
                  placeholder="https://example.com/document.pdf or web address..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Output Format & Language Options */}
              <div className={`grid ${isImageTool ? 'grid-cols-1' : 'grid-cols-2'} gap-2 pt-1`}>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400">Output Format</label>
                  <select
                    value={inputValues.outputFormat || outputFormatOptions[0].value}
                    onChange={(e) => handleInputChange('outputFormat', e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:border-emerald-500 focus:outline-none cursor-pointer"
                  >
                    {outputFormatOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                {!isImageTool && (
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-slate-400">
                      {isVideoTool ? 'Subtitle & Audio Language' : isAudioTool ? 'Voice & Audio Language' : 'Output Language'}
                    </label>
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
                      <option value="Auto-detect">Auto-detect Source</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Execute Button */}
            <button
              onClick={handleExecute}
              disabled={isRunning}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-slate-950 font-extrabold text-sm rounded-xl shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Processing Request...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Execute AI Tool</span>
                </>
              )}
            </button>

            {/* Progress Step Indicator */}
            {isRunning && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-medium">
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>{currentStep}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-indigo-500 animate-pulse w-3/4"></div>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* RIGHT: Output Result Panel */}
          <div className="p-5 flex flex-col justify-between bg-slate-950/40">
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
                <div className="text-center py-16 text-slate-500 space-y-3 border-2 border-dashed border-slate-800/80 rounded-2xl">
                  <FileText className="w-10 h-10 mx-auto opacity-40 text-slate-400" />
                  <p className="text-sm font-medium">No output generated yet.</p>
                  <p className="text-xs max-w-xs mx-auto">Fill in the input fields on the left and click "Execute AI Tool" to see real results!</p>
                </div>
              )}

              {/* VISUAL PROCESSING STATE (PROGRESS BAR & SPINNER) WHEN RUNNING */}
              {isRunning && (
                <AIProcessingState
                  tool={tool}
                  currentStep={currentStep}
                  progressPercent={progressPercent}
                  elapsedSec={elapsedSec}
                  uploadedFile={uploadedFile}
                  inputValues={inputValues}
                  formatFileSize={formatFileSize}
                />
              )}

              {/* VIDEO OUTPUT WITH GENUINE MP4 SYNTHESIS & PROMPT MOTION ENGINE */}
              {videoUrlResult && (
                <AIVideoPlayer
                  videoUrl={videoMp4Url || videoUrlResult || '/api/video-stream'}
                  posterUrl={videoPosterUrl || imageUrlResult || undefined}
                  promptText={inputValues.prompt || 'Cinematic AI Video Motion Synthesis'}
                  durationSec={videoDuration || 15}
                  toolName={tool.name}
                  onDownload={() => handleDirectDownloadMedia(videoMp4Url || videoUrlResult, `${tool.id}-video-${Date.now()}.mp4`)}
                />
              )}

              {/* IMAGE OUTPUT */}
              {imageUrlResult && (
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden border border-slate-800 shadow-2xl p-2 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:12px_12px] bg-slate-950">
                    <img src={imageUrlResult} alt="Generated AI Artwork" referrerPolicy="no-referrer" className="w-full h-auto max-h-[350px] object-contain mx-auto rounded-lg shadow" />
                  </div>
                  <button
                    onClick={() => handleDirectDownloadMedia(imageUrlResult, `${tool.id}-image-${Date.now()}.png`)}
                    disabled={isDownloading}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-colors w-full cursor-pointer"
                  >
                    {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span>Direct Download High-Res Image (PNG)</span>
                  </button>
                </div>
              )}

              {/* AUDIO OUTPUT */}
              {audioUrlResult && (
                <div className="space-y-3 p-4 bg-slate-900 border border-slate-800 rounded-xl text-center">
                  <Volume2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <p className="text-xs text-slate-300 font-medium">Synthesized Voice Audio</p>
                  <audio controls src={audioUrlResult} className="w-full" autoPlay />
                  <button
                    onClick={() => handleDirectDownloadMedia(audioUrlResult, `${tool.id}-speech-${Date.now()}.${audioUrlResult.startsWith('data:audio/wav') ? 'wav' : 'mp3'}`)}
                    disabled={isDownloading}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition-colors w-full cursor-pointer"
                  >
                    {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    <span>Direct Download Audio File</span>
                  </button>
                </div>
              )}

              {/* TEXT / MARKDOWN / CODE OUTPUT */}
              {outputResult && (
                <div className="space-y-3">
                  <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-200 font-mono whitespace-pre-wrap max-h-[360px] overflow-y-auto leading-relaxed shadow-inner">
                    {outputResult}
                  </div>
                </div>
              )}

              {/* CONNECT LIVE LINK & DIRECT STREAM ENDPOINT CARD - ALWAYS VISIBLE */}
              <div className="p-3 bg-slate-950 border border-indigo-500/40 rounded-xl space-y-2 font-mono text-xs mt-3 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Globe className="w-3.5 h-3.5 text-indigo-400" />
                    Connect Live API Link / Stream Endpoint
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    LIVE CONNECTED
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 flex items-center gap-2 min-w-0">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      readOnly
                      value={
                        videoUrlResult
                          ? `${window.location.origin}${videoUrlResult}`
                          : imageUrlResult
                          ? imageUrlResult
                          : audioUrlResult
                          ? audioUrlResult
                          : `${window.location.origin}${apiService.getEndpointForTool(tool)}`
                      }
                      className="w-full bg-transparent text-slate-200 text-xs font-mono truncate focus:outline-none select-all"
                    />
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        const urlToCopy = videoUrlResult
                          ? `${window.location.origin}${videoUrlResult}`
                          : imageUrlResult || audioUrlResult || `${window.location.origin}${apiService.getEndpointForTool(tool)}`;
                        navigator.clipboard.writeText(urlToCopy);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                      }}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copied!' : 'Copy Live Link'}</span>
                    </button>

                    <a
                      href={
                        videoUrlResult
                          ? videoUrlResult
                          : imageUrlResult || audioUrlResult || apiService.getEndpointForTool(tool)
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Open Direct</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* User Rating Box */}
            <div className="mt-6 pt-4 border-t border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Rate this tool execution:</span>
                {ratingSubmitted ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Rating recorded!
                  </span>
                ) : (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRatingSubmit(star)}
                        className="p-1 hover:scale-125 transition-transform text-slate-600 hover:text-amber-400 cursor-pointer"
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
        onTriggerTestToast={(testThreshold) => {
          setLatencyToast({
            provider: tool.provider || 'Google Gemini 1.5 Flash',
            toolName: tool.name,
            latencyMs: testThreshold + 850,
            thresholdMs: testThreshold,
          });
          setIsLatencySettingsOpen(false);
        }}
      />

    </div>
  );
};
