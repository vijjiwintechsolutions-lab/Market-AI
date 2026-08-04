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
  const isCalc = tool.category?.toLowerCase().includes('calc') || tool.category?.toLowerCase().includes('finance');

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
  } else {
    formatOptions = ['Plain Text (.txt)', 'Markdown (.md)', 'JSON (.json)'];
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
  const [videoPosterUrl, setVideoPosterUrl] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

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
    setVideoPosterUrl(null);
    setUploadedFile(null);
    setPreviewUrl(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (window.history && window.history.pushState) {
      window.history.pushState({}, '', `/tools/${tool.id}`);
    }
  }, [tool.id]);

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
      const elapsed = Date.now() - startTime;
      setExecutionTime(res.executionTimeMs || elapsed);
      
      if (res.success) {
        setProgressPercent(100);
        if (isVideo || res.videoUrl) {
          setVideoUrlResult(res.videoUrl || null);
          setVideoPosterUrl(res.frameUrl || null);
        } else if (isImage || res.imageUrl) {
          setImageUrlResult(res.imageUrl || null);
        } else if (isAudio || res.audioUrl) {
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
    } catch (err) {
      console.error(err);
    } finally {
      clearInterval(progressInt); clearInterval(timerInt); setIsRunning(false);
    }
  };

  const handleDirectDownloadMedia = async (mediaUrl: string | null) => {
    if (!mediaUrl) return;
    setIsDownloading(true);
    const selectedFormat = inputValues['outputFormat'] || '';
    let ext = 'png';
    if (selectedFormat.includes('.jpg')) ext = 'jpg';
    else if (selectedFormat.includes('.webp')) ext = 'webp';
    else if (selectedFormat.includes('.mp4')) ext = 'mp4';
    else if (selectedFormat.includes('.webm')) ext = 'webm';
    else if (selectedFormat.includes('.mp3')) ext = 'mp3';
    else if (selectedFormat.includes('.wav')) ext = 'wav';
    else if (selectedFormat.includes('.pdf')) ext = 'pdf';
    else if (selectedFormat.includes('.csv')) ext = 'csv';
    else if (selectedFormat.includes('.txt')) ext = 'txt';

    const filename = `${tool.id}-generated.${ext}`;
    try {
      const res = await fetch(mediaUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl; link.download = filename;
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      const link = document.createElement('a');
      link.href = mediaUrl; link.target = '_blank'; link.download = filename;
      document.body.appendChild(link); link.click(); document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] pb-12 font-mono">
      {/* HEADER */}
      <div className="bg-[#151517] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
        </button>
        <span className="text-[10px] text-slate-400 font-bold hidden sm:block">Route: /tools/{tool.id}</span>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* TOOL INFO BANNER */}
        <div className="bg-[#151517] border border-white/10 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">{tool.category}</span>
            <h1 className="text-2xl font-extrabold text-white mt-1">{tool.name}</h1>
            <p className="text-xs text-slate-300 mt-1">{tool.description}</p>
          </div>
          <button onClick={() => onToggleFavorite(tool.id)} className={`px-3 py-2 rounded text-xs font-bold border whitespace-nowrap ${favoriteIds.includes(tool.id) ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-white/5 text-slate-300 border-white/10'}`}>
            {favoriteIds.includes(tool.id) ? 'Saved to Library' : 'Save Tool'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* INPUT PARAMETERS (LEFT) */}
          <div className="lg:col-span-5 bg-[#151517] border border-white/10 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold uppercase text-indigo-400 flex items-center gap-1.5"><Sliders className="w-4 h-4" /> Parameters</span>
            </div>

            {/* DYNAMIC FIELDS */}
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

            {/* DYNAMIC FILE UPLOAD */}
            {showUpload && (
              <div className="pt-3 border-t border-white/10 space-y-2">
                <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1"><Paperclip className="w-3.5 h-3.5 text-indigo-400" /> {uploadLabel}</span>
                {!uploadedFile ? (
                  <div onClick={() => fileInputRef.current?.click()} className="border border-dashed border-white/20 hover:border-indigo-500 bg-[#0A0A0A] rounded p-3 text-center cursor-pointer transition-colors">
                    <UploadCloud className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
                    <p className="text-xs text-slate-300">Click to browse or Drag & Drop File</p>
                    <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && setUploadedFile(e.target.files[0])} className="hidden" />
                  </div>
                ) : (
                  <div className="p-2 bg-[#0A0A0A] border border-indigo-500/40 rounded flex items-center justify-between text-xs">
                    <span className="truncate text-white max-w-[200px]">{uploadedFile.name}</span>
                    <button onClick={() => setUploadedFile(null)} className="text-rose-400 p-1 hover:bg-rose-500/20 rounded"><X className="w-4 h-4" /></button>
                  </div>
                )}
              </div>
            )}

            {/* FORMAT & QUALITY DROPDOWNS */}
            <div className={`grid ${showQuality ? 'grid-cols-2' : 'grid-cols-1'} gap-2 pt-3 border-t border-white/10`}>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 block">Output Format</label>
                <select value={inputValues['outputFormat']} onChange={(e) => handleInputChange('outputFormat', e.target.value)} className="w-full px-2 py-1.5 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white focus:border-indigo-500">
                  {formatOptions.map((fmt) => <option key={fmt} value={fmt}>{fmt}</option>)}
                </select>
              </div>
              {showQuality && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 block">Quality Preset</label>
                  <select value={inputValues['quality']} onChange={(e) => handleInputChange('quality', e.target.value)} className="w-full px-2 py-1.5 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white focus:border-indigo-500">
                    {qualityOptions.map((q) => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
              )}
            </div>

            <button onClick={handleExecute} disabled={isRunning} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase rounded flex items-center justify-center gap-2 mt-4 transition-colors">
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRunning ? 'Processing Request...' : 'Execute Tool'}</span>
            </button>
          </div>

          {/* GENERATED OUTPUT & LIVE PREVIEW (RIGHT) */}
          <div className="lg:col-span-7 bg-[#151517] border border-white/10 rounded-lg p-5 min-h-[500px] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                {uploadedFile && !outputResult && !imageUrlResult ? <Eye className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />} 
                {uploadedFile && !outputResult && !imageUrlResult ? 'Live File Preview' : 'Live Output'}
              </span>
              {executionTime && <span className="text-green-400 text-[11px] bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20 font-bold">{executionTime}ms</span>}
            </div>

            {/* PREVIEW PANEL BEFORE EXECUTION */}
            {!isRunning && !outputResult && !imageUrlResult && !videoUrlResult && uploadedFile && (
              <div className="flex-1 w-full bg-[#0A0A0A] border border-white/10 rounded-xl overflow-hidden flex flex-col items-center justify-center p-8 text-center shadow-inner">
                {uploadedFile.type.startsWith('image/') && previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="max-w-full max-h-[350px] object-contain rounded shadow-lg" />
                ) : (
                  <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto border border-indigo-500/20 shadow-lg">
                      <Paperclip className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg truncate max-w-sm mx-auto">{uploadedFile.name}</h3>
                      <p className="text-slate-400 text-xs mt-1 font-bold">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Uploaded & Ready
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-500 max-w-xs mx-auto">
                      Provide parameters on the left and click "Execute Tool" to process this file.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* RUNNING STATE */}
            {isRunning && (
              <AIProcessingState 
                tool={tool} 
                currentStep="Processing Request..." 
                progressPercent={progressPercent} 
                elapsedSec={elapsedSec} 
                inputValues={inputValues} 
                uploadedFile={uploadedFile} 
              />
            )}

            {/* POST EXECUTION OUTPUTS */}
            {imageUrlResult && !isRunning && (
              <div className="space-y-3 w-full">
                <img src={imageUrlResult} alt="Generated Output" className="w-full h-auto max-h-[440px] object-contain rounded shadow-lg" />
                <button onClick={() => handleDirectDownloadMedia(imageUrlResult)} disabled={isDownloading} className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase rounded shadow flex items-center justify-center gap-2 cursor-pointer transition-colors">
                  {isDownloading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  <span>{isDownloading ? 'Downloading...' : `Download ${inputValues['outputFormat'] || 'Media'}`}</span>
                </button>
              </div>
            )}

            {videoUrlResult && !isRunning && (
              <AIVideoPlayer videoUrl={videoUrlResult} posterUrl={videoPosterUrl || undefined} promptText={inputValues.prompt || tool.name} durationSec={15} toolName={tool.name} onDownload={() => handleDirectDownloadMedia(videoUrlResult)} />
            )}

            {audioUrlResult && !isRunning && (
              <div className="space-y-3 p-4 bg-[#0A0A0A] border border-white/10 rounded text-center">
                <Volume2 className="w-8 h-8 text-indigo-400 mx-auto" />
                <audio controls src={audioUrlResult} className="w-full" autoPlay />
                <button onClick={() => handleDirectDownloadMedia(audioUrlResult)} className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase rounded flex items-center justify-center gap-2 cursor-pointer transition-colors">
                  <Download className="w-4 h-4" /> Download Audio
                </button>
              </div>
            )}

            {/* CLEAN TEXT/DOCUMENT OUTPUT */}
            {outputResult && !imageUrlResult && !videoUrlResult && !audioUrlResult && !isRunning && (
              <div className="space-y-4 w-full h-full flex flex-col">
                <div className="flex-1 bg-[#0A0A0A] border border-emerald-500/30 rounded-lg p-6 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed shadow-lg shadow-emerald-500/5 overflow-y-auto max-h-[380px]">
                  {outputResult}
                </div>
                {(isPDF || isCalc || isImage || isVideo || isAudio) ? (
                  <button className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs uppercase rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all">
                    <Download className="w-4 h-4" /> Download Processed File
                  </button>
                ) : (
                  <button onClick={() => { navigator.clipboard.writeText(outputResult); setCopied(true); setTimeout(() => setCopied(false), 2000); }} className="w-full py-2 bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold rounded border border-white/10 flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />} <span>{copied ? 'Copied!' : 'Copy Result'}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
