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
  Languages,
  Image as ImageIcon
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
import { getLatencySettings } from '../utils/latencySettings';
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
    return {
      availableFormats: ['Markdown (.md)', 'Plain Text (.txt)', 'Structured JSON (.json)'],
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
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);
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
    setImageLoadError(false);
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

  const handleEnhanceUserPrompt = (paramId: string) => {
    const currentText = inputValues[paramId] || '';
    if (!currentText.trim()) return;

    const enhanced = `Ultra-realistic 8k masterpiece photo of ${currentText}, bright vibrant lighting, highly detailed poster artwork, clear text and festival decor, professional design`;
    handleInputChange(paramId, enhanced);

    setValidationToast({
      type: 'warning',
      title: 'Auto Magic Enhance Applied',
      message: 'Expanded prompt with high quality parameters.',
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
    setUploadedFile(file);

    const dataUrlReader = new FileReader();
    dataUrlReader.onload = async () => {
      const resultStr = dataUrlReader.result as string;
      setFilePreview(resultStr);
      handleInputChange('filePreview', resultStr);
    };
    dataUrlReader.readAsDataURL(file);
  };

  const handleExecute = async () => {
    const execValidation = validateToolExecution(tool, inputValues, uploadedFile);
    if (!execValidation.valid) {
      setValidationToast({
        type: 'error',
        title: 'Input Validation Failed',
        message: 'Please complete required fields.',
        details: execValidation.errors,
      });
      setErrorMsg(execValidation.errors.join(' | '));
      return;
    }
    setValidationToast(null);
    setIsRunning(true);
    setErrorMsg(null);
    setImageLoadError(false);
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
      setProgressPercent((prev) => (prev < 95 ? prev + 3 : prev));
    }, 200);

    const timerInterval = setInterval(() => {
      setElapsedSec((prev) => parseFloat((prev + 0.1).toFixed(1)));
    }, 100);

    try {
      setCurrentStep('Step 1/4: Processing prompt & parameters...');
      await new Promise((r) => setTimeout(r, 200));
      setCurrentStep('Step 2/4: Applying AI Enhancer Engine...');
      await new Promise((r) => setTimeout(r, 300));
      setCurrentStep('Step 3/4: Executing Model Inference...');

      const isVideoTool = tool.outputType === 'video' || tool.category === 'Video AI';

      const res = await apiService.executeTool({
        tool,
        inputValues,
        filePreview,
      });

      setCurrentStep('Step 4/4: Delivering output...');
      await new Promise((r) => setTimeout(r, 200));
      const elapsed = Date.now() - startTime;
      setExecutionTime(res.executionTimeMs || elapsed);

      if (res.success) {
        setProgressPercent(100);
        const rawOutput = res.output;

        if (isVideoTool || tool.outputType === 'video' || res.videoUrl) {
          const videoSrc = res.videoUrl || (typeof rawOutput === 'string' && rawOutput.startsWith('/') ? rawOutput : '/api/video-stream');
          setVideoUrlResult(videoSrc);
          setVideoMp4Url(videoSrc);
          setVideoPosterUrl(res.frameUrl || `https://image.pollinations.ai/prompt/${encodeURIComponent(promptSummary)}?width=1280&height=720&model=flux&nologo=true`);
          setOutputResult(res.textOutput || 'Video generated successfully.');
        } else if (tool.outputType === 'image' || tool.category === 'Image AI') {
          const imgUrl = res.imageUrl || (typeof rawOutput === 'string' ? rawOutput : '');
          setImageUrlResult(imgUrl);
          setOutputResult(res.textOutput || 'Image generated successfully.');
        } else {
          setOutputResult(typeof rawOutput === 'object' ? JSON.stringify(rawOutput, null, 2) : String(rawOutput || ''));
        }

        onSaveHistory({
          id: `hist-${Date.now()}`,
          toolId: tool.id,
          toolName: tool.name,
          prompt: String(promptSummary).substring(0, 150),
          output: String(rawOutput).substring(0, 300),
          timestamp: new Date().toLocaleTimeString(),
          executionTimeMs: res.executionTimeMs || elapsed,
          outputType: tool.outputType,
        });
      } else {
        setErrorMsg(res.error || 'Execution failed.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Server execution error');
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

  const handleReloadImage = () => {
    if (!imageUrlResult) return;
    setImageLoadError(false);
    const freshSeed = Math.floor(Math.random() * 999999);
    const updatedUrl = imageUrlResult.includes('seed=')
      ? imageUrlResult.replace(/seed=\d+/, `seed=${freshSeed}`)
      : `${imageUrlResult}&seed=${freshSeed}`;
    setImageUrlResult(updatedUrl);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] pb-12 font-sans">
      {/* Header */}
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
        <div className="bg-[#151517] border border-white/10 rounded-lg p-5 flex flex-col md:flex-row justify-between gap-4 font-mono">
          <div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">
              {tool.category}
            </span>
            <h1 className="text-2xl font-extrabold text-white mt-1">{tool.name}</h1>
            <p className="text-xs text-slate-300">{tool.description}</p>
          </div>
        </div>

        {/* Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Inputs */}
          <div className="lg:col-span-5 bg-[#151517] border border-white/10 rounded-lg p-5 space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold uppercase text-indigo-400 flex items-center gap-1.5">
                <Sliders className="w-4 h-4" /> Parameters
              </span>
              <PresetSelector tool={tool} onApplyPreset={handleApplyPreset} />
            </div>

            {tool.inputs.map((param) => (
              <div key={param.id} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">
                    {param.name} {param.required && <span className="text-rose-400">*</span>}
                  </label>
                  {(param.type === 'textarea' || param.type === 'text') && (
                    <button
                      onClick={() => handleEnhanceUserPrompt(param.id)}
                      className="text-[10px] bg-indigo-600/30 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/40 flex items-center gap-1 cursor-pointer"
                    >
                      <Wand2 className="w-3 h-3 text-indigo-400" />
                      <span>Auto Magic Enhance</span>
                    </button>
                  )}
                </div>

                {param.type === 'textarea' || param.type === 'text' ? (
                  <textarea
                    rows={4}
                    value={inputValues[param.id] || ''}
                    onChange={(e) => handleInputChange(param.id, e.target.value)}
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                ) : null}
              </div>
            ))}

            <button
              onClick={handleExecute}
              disabled={isRunning}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded shadow flex items-center justify-center gap-2 cursor-pointer"
            >
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRunning ? 'Generating...' : 'Execute AI Tool'}</span>
            </button>
          </div>

          {/* Right Live Preview Output */}
          <div className="lg:col-span-7 bg-[#151517] border border-white/10 rounded-lg p-5 flex flex-col justify-between min-h-[520px] h-full font-mono">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Live Ultra-HD Generated Output
                </span>
                {executionTime && <span className="text-green-400 text-[11px] bg-green-500/10 px-2 py-0.5 rounded">{executionTime}ms</span>}
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

              {/* Image Output Panel */}
              {imageUrlResult && !isRunning && (
                <div className="space-y-3">
                  <div className="rounded border border-white/10 bg-[#0A0A0A] p-2 flex items-center justify-center min-h-[320px] relative">
                    {!imageLoadError ? (
                      <img
                        src={imageUrlResult}
                        alt="Generated AI Artwork"
                        onError={() => setImageLoadError(true)}
                        className="w-full h-auto max-h-[440px] object-contain rounded"
                      />
                    ) : (
                      <div className="text-center p-6 space-y-3">
                        <ImageIcon className="w-10 h-10 text-rose-400 mx-auto opacity-60" />
                        <p className="text-xs text-rose-300 font-bold">Image render blocked or timed out.</p>
                        <button
                          onClick={handleReloadImage}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded flex items-center gap-2 mx-auto cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Retry Image Render</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDirectDownloadMedia(imageUrlResult, `${tool.id}-artwork.png`)}
                    disabled={isDownloading || imageLoadError}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>Direct Download Ultra-HD Image</span>
                  </button>
                </div>
              )}

              {/* Video Output */}
              {videoUrlResult && !imageUrlResult && !isRunning && (
                <AIVideoPlayer
                  videoUrl={videoMp4Url || videoUrlResult || '/api/video-stream'}
                  posterUrl={videoPosterUrl || undefined}
                  promptText={inputValues.prompt || 'Cinematic AI Video Motion Synthesis'}
                  durationSec={videoDuration || 15}
                  toolName={tool.name}
                  onDownload={() => handleDirectDownloadMedia(videoMp4Url || videoUrlResult, `${tool.id}-video.mp4`)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
