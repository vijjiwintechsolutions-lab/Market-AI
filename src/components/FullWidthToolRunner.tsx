import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Play, Sparkles, Copy, Check, Download, RefreshCw, Sliders, UploadCloud, X, Paperclip, Volume2, Eye
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
}

export const FullWidthToolRunner: React.FC<FullWidthToolRunnerProps> = ({
  tool, onBack, onSaveHistory, favoriteIds, onToggleFavorite,
}) => {
  const isImage = tool.outputType === 'image' || tool.category?.toLowerCase().includes('image');
  const isVideo = tool.outputType === 'video' || tool.category?.toLowerCase().includes('video');
  const isAudio = tool.outputType === 'audio' || tool.category?.toLowerCase().includes('audio') || tool.category?.toLowerCase().includes('voice');
  const isPDF = tool.category?.toLowerCase().includes('pdf') || tool.category?.toLowerCase().includes('document');
  const isCalc = tool.category?.toLowerCase().includes('calculator') || tool.category?.toLowerCase().includes('finance');

  let formatOptions = ['Plain Text (.txt)'];
  let qualityOptions = ['Standard Fast'];
  let showQuality = false;
  let showUpload = true;
  let uploadLabel = 'Source File / Reference Media';

  if (isImage) {
    formatOptions = ['JPG Photo (.jpg)', 'PNG Image (.png)', 'WEBP Format (.webp)'];
    qualityOptions = ['Standard Fast', '4K High Precision', '8K Ultra HD / Studio'];
    showQuality = true;
    uploadLabel = 'Upload Source Image (Optional)';
  } else if (isVideo) {
    formatOptions = ['MP4 Video (.mp4)', 'WEBM Video (.webm)', 'GIF Animation (.gif)'];
    qualityOptions = ['720p Standard', '1080p Full HD', '4K Cinematic'];
    showQuality = true;
    uploadLabel = 'Upload Source Video (Optional)';
  } else if (isAudio) {
    formatOptions = ['MP3 Audio (.mp3)', 'WAV Audio (.wav)'];
    qualityOptions = ['128kbps Standard', '192kbps High Quality', '320kbps Studio'];
    showQuality = true;
    uploadLabel = 'Upload Audio File (Optional)';
  } else if (isPDF) {
    formatOptions = ['PDF Document (.pdf)'];
    showQuality = false;
    uploadLabel = 'Upload PDF Document (Required)';
  } else if (isCalc) {
    formatOptions = ['Plain Text (.txt)', 'CSV Data (.csv)'];
    showQuality = false;
    showUpload = false;
  }

  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [outputResult, setOutputResult] = useState<string | null>(null);
  const [imageUrlResult, setImageUrlResult] = useState<string | null>(null);
  const [videoUrlResult, setVideoUrlResult] = useState<string | null>(null);
  const [audioUrlResult, setAudioUrlResult] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initial: Record<string, any> = {};
    tool.inputs.forEach((p) => { initial[p.id] = p.defaultValue || ''; });
    initial['outputFormat'] = formatOptions[0];
    initial['quality'] = qualityOptions[0];
    setInputValues(initial);
    setOutputResult(null);
    setImageUrlResult(null);
    setVideoUrlResult(null);
    setAudioUrlResult(null);
    setUploadedFile(null);
    setPreviewUrl(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tool.id]);

  // Generate real-time preview URL for uploaded files
  useEffect(() => {
    if (uploadedFile) {
      const url = URL.createObjectURL(uploadedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [uploadedFile]);

  const handleInputChange = (id: string, value: any) => setInputValues((prev) => ({ ...prev, [id]: value }));

  const handleExecute = async () => {
    setIsRunning(true);
    setOutputResult(null); setImageUrlResult(null); setVideoUrlResult(null); setAudioUrlResult(null);
    setProgressPercent(10); setElapsedSec(0);
    const startTime = Date.now();
    const progressInt = setInterval(() => setProgressPercent((p) => (p < 95 ? p + 5 : p)), 100);
    const timerInt = setInterval(() => setElapsedSec((p) => parseFloat((p + 0.1).toFixed(1))), 100);

    try {
      const res = await apiService.executeTool({ tool, inputValues });
      setExecutionTime(res.executionTimeMs || Date.now() - startTime);
      if (res.success) {
        setProgressPercent(100);
        if (isVideo || res.videoUrl) setVideoUrlResult(res.videoUrl || null);
        else if (isImage || res.imageUrl) setImageUrlResult(res.imageUrl || null);
        else if (isAudio || res.audioUrl) setAudioUrlResult(res.audioUrl || null);
        else setOutputResult(res.textOutput || String(res.output || ''));
      }
    } catch (err) {
      console.error(err);
    } finally {
      clearInterval(progressInt); clearInterval(timerInt); setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] pb-12 font-mono">
      <div className="bg-[#151517] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
        </button>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <div className="bg-[#151517] border border-white/10 rounded-lg p-5 flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">{tool.category}</span>
            <h1 className="text-2xl font-extrabold text-white mt-1">{tool.name}</h1>
            <p className="text-xs text-slate-300 mt-1">{tool.description}</p>
          </div>
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
                  <textarea rows={param.type === 'textarea' ? 3 : 1} value={inputValues[param.id] || ''} onChange={(e) => handleInputChange(param.id, e.target.value)} className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white focus:border-indigo-500 focus:outline-none" />
                ) : param.type === 'select' ? (
                  <select value={inputValues[param.id] || param.options?.[0]} onChange={(e) => handleInputChange(param.id, e.target.value)} className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white focus:border-indigo-500 font-mono">
                    {param.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : null}
              </div>
            ))}

            {showUpload && (
              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1"><Paperclip className="w-3.5 h-3.5 text-indigo-400" /> {uploadLabel}</span>
                {!uploadedFile ? (
                  <div onClick={() => fileInputRef.current?.click()} className="border border-dashed border-white/20 hover:border-indigo-500 bg-[#0A0A0A] rounded p-3 text-center cursor-pointer">
                    <UploadCloud className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                    <p className="text-xs text-slate-300">Click to browse or Drag & Drop File</p>
                    <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && setUploadedFile(e.target.files[0])} className="hidden" />
                  </div>
                ) : (
                  <div className="p-2 bg-[#0A0A0A] border border-indigo-500/40 rounded flex items-center justify-between text-xs">
                    <span className="truncate text-white">{uploadedFile.name}</span>
                    <button onClick={() => setUploadedFile(null)} className="text-rose-400 p-1 hover:bg-rose-500/20"><X className="w-4 h-4" /></button>
                  </div>
                )}
              </div>
            )}

            <div className={`grid ${showQuality ? 'grid-cols-2' : 'grid-cols-1'} gap-2 pt-3 border-t border-white/10`}>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block">Download Format</label>
                <select value={inputValues['outputFormat']} onChange={(e) => handleInputChange('outputFormat', e.target.value)} className="w-full px-2 py-1.5 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white">
                  {formatOptions.map((fmt) => <option key={fmt} value={fmt}>{fmt}</option>)}
                </select>
              </div>
              {showQuality && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block">Quality</label>
                  <select value={inputValues['quality']} onChange={(e) => handleInputChange('quality', e.target.value)} className="w-full px-2 py-1.5 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white">
                    {qualityOptions.map((q) => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
              )}
            </div>

            <button onClick={handleExecute} disabled={isRunning} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase rounded flex items-center justify-center gap-2 mt-4">
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRunning ? 'Processing Request...' : 'Execute Tool'}</span>
            </button>
          </div>

          {/* GENERATED OUTPUT & LIVE PREVIEW (RIGHT) */}
          <div className="lg:col-span-7 bg-[#151517] border border-white/10 rounded-lg p-5 min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                {previewUrl && !outputResult && !imageUrlResult ? <Eye className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />} 
                {previewUrl && !outputResult && !imageUrlResult ? 'Live File Preview' : 'Live Output'}
              </span>
            </div>

            {/* LIVE DOCUMENT/IMAGE PREVIEW BEFORE EXECUTION */}
            {!isRunning && !outputResult && !imageUrlResult && !videoUrlResult && previewUrl && (
              <div className="flex-1 w-full bg-[#0A0A0A] border border-white/10 rounded overflow-hidden flex items-center justify-center">
                {uploadedFile?.type === 'application/pdf' ? (
                  <object data={previewUrl} type="application/pdf" className="w-full h-full min-h-[450px]">
                    <p className="text-slate-400 text-xs p-4">Unable to display PDF preview. Please download to view.</p>
                  </object>
                ) : uploadedFile?.type.startsWith('image/') ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-auto max-h-[450px] object-contain" />
                ) : (
                  <span className="text-slate-400 text-xs p-4">Preview not available for this file type.</span>
                )}
              </div>
            )}

            {/* RESULTS AFTER EXECUTION */}
            {isRunning && <AIProcessingState tool={tool} currentStep="Generating Process..." progressPercent={progressPercent} elapsedSec={elapsedSec} />}

            {imageUrlResult && !isRunning && (
              <div className="space-y-3 w-full">
                <img src={imageUrlResult} alt="Generated Output" className="w-full h-auto max-h-[440px] object-contain rounded" />
              </div>
            )}
            
            {/* CLEAN TEXT/PDF OUTPUT WITHOUT CONSOLE LOG */}
            {outputResult && !imageUrlResult && !videoUrlResult && !isRunning && (
              <div className="space-y-3 w-full">
                <div className="bg-[#0A0A0A] border border-emerald-500/30 rounded p-5 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed shadow-lg shadow-emerald-500/5">
                  {outputResult}
                </div>
                <button className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase rounded flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" /> Download Processed File
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
