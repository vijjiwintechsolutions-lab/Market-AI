import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Sparkles, 
  Download, 
  RefreshCw, 
  Sliders, 
  Wand2,
  Image as ImageIcon
} from 'lucide-react';
import { AITool, ExecutionHistoryItem } from '../types';
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
}

export const FullWidthToolRunner: React.FC<FullWidthToolRunnerProps> = ({
  tool,
  onBack,
  onSaveHistory,
}) => {
  const defaultFormat = 'PNG Image (.png)';

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
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [validationToast, setValidationToast] = useState<{
    type: 'error' | 'warning';
    title: string;
    message: string;
  } | null>(null);

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
    setImageLoadError(false);
    setIsImageLoading(false);
    setExecutionTime(null);
  }, [tool.id, defaultFormat]);

  const handleInputChange = (id: string, value: any) => {
    setInputValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleEnhanceUserPrompt = (paramId: string) => {
    const currentText = inputValues[paramId] || '';
    if (!currentText.trim()) return;

    const enhanced = `Ultra-realistic 8k masterpiece photo of ${currentText}, bright vivid lighting, high detailed artwork, clear photorealistic scene`;
    handleInputChange(paramId, enhanced);
  };

  const handleExecute = async () => {
    const execValidation = validateToolExecution(tool, inputValues, uploadedFile);
    if (!execValidation.valid) {
      setValidationToast({
        type: 'error',
        title: 'Input Required',
        message: 'Please fill in all required fields.',
      });
      return;
    }
    setValidationToast(null);
    setIsRunning(true);
    setImageLoadError(false);
    setIsImageLoading(true);
    setOutputResult(null);
    setImageUrlResult(null);
    setVideoUrlResult(null);
    setProgressPercent(10);
    setElapsedSec(0);
    const startTime = Date.now();

    const progressInterval = setInterval(() => {
      setProgressPercent((prev) => (prev < 90 ? prev + 4 : prev));
    }, 200);

    const timerInterval = setInterval(() => {
      setElapsedSec((prev) => parseFloat((prev + 0.1).toFixed(1)));
    }, 100);

    try {
      setCurrentStep('Generating Ultra-HD Render...');
      const res = await apiService.executeTool({
        tool,
        inputValues,
        filePreview,
      });

      const elapsed = Date.now() - startTime;
      setExecutionTime(res.executionTimeMs || elapsed);

      if (res.success) {
        setProgressPercent(100);
        const rawOutput = res.output;

        if (tool.outputType === 'video' || tool.category === 'Video AI') {
          setVideoUrlResult(res.videoUrl || String(rawOutput));
        } else if (tool.outputType === 'image' || tool.category === 'Image AI') {
          const imgUrl = res.imageUrl || String(rawOutput);
          setImageUrlResult(imgUrl);
        } else {
          setOutputResult(typeof rawOutput === 'object' ? JSON.stringify(rawOutput, null, 2) : String(rawOutput));
        }

        onSaveHistory({
          id: `hist-${Date.now()}`,
          toolId: tool.id,
          toolName: tool.name,
          prompt: String(inputValues.prompt || tool.name),
          output: String(rawOutput).substring(0, 300),
          timestamp: new Date().toLocaleTimeString(),
          executionTimeMs: res.executionTimeMs || elapsed,
          outputType: tool.outputType,
        });
      } else {
        setImageLoadError(true);
      }
    } catch (err: any) {
      setImageLoadError(true);
    } finally {
      clearInterval(progressInterval);
      clearInterval(timerInterval);
      setIsRunning(false);
    }
  };

  const handleDirectDownloadMedia = (mediaUrl: string | null) => {
    if (!mediaUrl) return;
    const link = document.createElement('a');
    link.href = mediaUrl;
    link.target = '_blank';
    link.download = `${tool.id}-output.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReloadImage = () => {
    if (!imageUrlResult) return;
    setImageLoadError(false);
    setIsImageLoading(true);
    const freshSeed = Math.floor(Math.random() * 999999);
    const updatedUrl = imageUrlResult.includes('seed=')
      ? imageUrlResult.replace(/seed=\d+/, `seed=${freshSeed}`)
      : `${imageUrlResult}&seed=${freshSeed}`;
    setImageUrlResult(updatedUrl);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] pb-12 font-sans font-mono">
      {/* Top Header */}
      <div className="bg-[#151517] border-b border-white/10 sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
        </button>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <div className="bg-[#151517] border border-white/10 rounded-lg p-5 flex flex-col md:flex-row justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">{tool.category}</span>
            <h1 className="text-2xl font-extrabold text-white mt-1">{tool.name}</h1>
            <p className="text-xs text-slate-300">{tool.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Inputs */}
          <div className="lg:col-span-5 bg-[#151517] border border-white/10 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold uppercase text-indigo-400 flex items-center gap-1.5"><Sliders className="w-4 h-4" /> Parameters</span>
            </div>

            {tool.inputs.map((param) => (
              <div key={param.id} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">{param.name}</label>
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
                    className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white focus:border-indigo-500 focus:outline-none"
                  />
                ) : null}
              </div>
            ))}

            <button onClick={handleExecute} disabled={isRunning} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase rounded flex items-center justify-center gap-2 cursor-pointer">
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRunning ? 'Processing AI Request...' : 'Execute AI Tool'}</span>
            </button>
          </div>

          {/* Live Preview Panel */}
          <div className="lg:col-span-7 bg-[#151517] border border-white/10 rounded-lg p-5 flex flex-col justify-between min-h-[500px]">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> Live Generated Output</span>
                {executionTime && <span className="text-green-400 text-[11px] bg-green-500/10 px-2 py-0.5 rounded">{executionTime}ms</span>}
              </div>

              {isRunning && (
                <AIProcessingState tool={tool} currentStep={currentStep} progressPercent={progressPercent} elapsedSec={elapsedSec} uploadedFile={uploadedFile} inputValues={inputValues} />
              )}

              {/* Ultra HD Image Output Box */}
              {imageUrlResult && !isRunning && (
                <div className="space-y-3">
                  <div className="rounded border border-white/10 bg-[#0A0A0A] p-2 flex items-center justify-center min-h-[340px] relative overflow-hidden">
                    {isImageLoading && !imageLoadError && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#0A0A0A]/90 z-10 space-y-2 flex-col">
                        <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                        <span className="text-xs text-indigo-300">Rendering High-Res Artwork...</span>
                      </div>
                    )}

                    {!imageLoadError ? (
                      <img
                        src={imageUrlResult}
                        alt="Generated AI Artwork"
                        onLoad={() => setIsImageLoading(false)}
                        onError={() => {
                          setIsImageLoading(false);
                          setImageLoadError(true);
                        }}
                        className="w-full h-auto max-h-[440px] object-contain rounded"
                      />
                    ) : (
                      <div className="text-center p-6 space-y-3">
                        <ImageIcon className="w-10 h-10 text-rose-400 mx-auto opacity-60" />
                        <p className="text-xs text-rose-300 font-bold">Image render blocked. Retry fresh seed.</p>
                        <button onClick={handleReloadImage} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded flex items-center gap-2 mx-auto cursor-pointer">
                          <RefreshCw className="w-3.5 h-3.5" /> Retry Image Render
                        </button>
                      </div>
                    )}
                  </div>

                  <button onClick={() => handleDirectDownloadMedia(imageUrlResult)} disabled={imageLoadError} className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase rounded shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                    <Download className="w-4 h-4" /> Direct Download Ultra-HD Image
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
