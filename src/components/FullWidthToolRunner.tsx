import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Play, Sparkles, Check, Download, RefreshCw, Sliders, UploadCloud, X, Paperclip, FileText, Video, Music, Image as ImageIcon, Code, Calculator
} from 'lucide-react';
import { AITool, ExecutionHistoryItem } from '../types';
import { apiService } from '../services/apiService';
import { AIProcessingState } from './AIProcessingState';

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
  tool, onBack, onSaveHistory, onSelectTool, allTools
}) => {
  // 1. INTELLIGENT CATEGORY & TYPE DETECTION FOR ALL 800+ TOOLS
  const cat = (tool.category || '').toLowerCase();
  const outType = (tool.outputType || '').toLowerCase();

  const isPDF = cat.includes('pdf') || cat.includes('document');
  const isImage = outType === 'image' || cat.includes('image');
  const isVideo = outType === 'video' || cat.includes('video');
  const isAudio = outType === 'audio' || cat.includes('audio') || cat.includes('voice');
  const isCalc = cat.includes('calc') || cat.includes('finance');
  const isCode = cat.includes('code') || cat.includes('web');

  // 2. UNIVERSAL FORMATS & LABELS GENERATOR
  let formatOptions = ['Plain Text (.txt)', 'Markdown (.md)', 'JSON (.json)'];
  let uploadLabel = 'Source File / Reference Media';
  let showUpload = true;

  if (isPDF) {
    formatOptions = tool.id === 'pdf-to-jpg' ? ['JPG Image (.jpg)', 'PNG Image (.png)', 'TIFF (.tiff)'] : ['PDF Document (.pdf)'];
    uploadLabel = 'Upload Source PDF Document';
  } else if (isImage) {
    formatOptions = ['JPG Photo (.jpg)', 'PNG Image (.png)', 'WEBP Format (.webp)'];
    uploadLabel = 'Upload Source Image / Reference';
  } else if (isVideo) {
    formatOptions = ['MP4 Video (.mp4)', 'WEBM Video (.webm)', 'GIF Animation (.gif)'];
    uploadLabel = 'Upload Source Video Clip';
  } else if (isAudio) {
    formatOptions = ['MP3 Audio (.mp3)', 'WAV Audio (.wav)'];
    uploadLabel = 'Upload Source Audio File';
  } else if (isCalc || isCode) {
    showUpload = false;
    formatOptions = isCode ? ['Source Code (.js/.py/.ts)', 'Markdown (.md)'] : ['CSV Data (.csv)', 'Financial Report (.txt)'];
  }

  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [outputResult, setOutputResult] = useState<string | null>(null);
  const [fileDownloadUrl, setFileDownloadUrl] = useState<string | null>(null);
  const [mediaResultUrl, setMediaResultUrl] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [elapsedSec, setElapsedSec] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initial: Record<string, any> = {};
    tool.inputs.forEach((p) => { initial[p.id] = p.defaultValue || ''; });
    initial['outputFormat'] = formatOptions[0];
    setInputValues(initial);
    setOutputResult(null); setFileDownloadUrl(null); setMediaResultUrl(null);
    setUploadedFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (window.history && window.history.pushState) {
      window.history.pushState({}, '', `/tools/${tool.id}`);
    }
  }, [tool.id]);

  const handleInputChange = (id: string, value: any) => setInputValues((prev) => ({ ...prev, [id]: value }));

  // 3. UNIVERSAL LIVE EXECUTION ENGINE WITH ADOBE/SMALLPDF STYLE PROGRESS
  const handleExecute = async () => {
    if ((isPDF || isVideo || isAudio || isImage) && showUpload && !uploadedFile && tool.inputs.length === 0) {
      alert("Please upload a source file to execute this tool!");
      return;
    }

    setIsRunning(true);
    setOutputResult(null); setFileDownloadUrl(null); setMediaResultUrl(null);
    setProgressPercent(0); setElapsedSec(0);
    const startTime = Date.now();

    const progressInt = setInterval(() => {
      setProgressPercent((p) => (p < 94 ? p + Math.floor(Math.random() * 10) + 4 : p));
    }, 100);
    const timerInt = setInterval(() => setElapsedSec((p) => parseFloat((p + 0.1).toFixed(1))), 100);

    try {
      const res = await apiService.executeTool({ tool, inputValues, file: uploadedFile });
      clearInterval(progressInt);
      setProgressPercent(100);
      
      const elapsed = Date.now() - startTime;
      setExecutionTime(res.executionTimeMs || elapsed);
      
      setTimeout(() => {
        if (res.success) {
          if (res.fileUrl) setFileDownloadUrl(res.fileUrl);
          if (res.imageUrl || res.videoUrl || res.audioUrl) {
            setMediaResultUrl(res.imageUrl || res.videoUrl || res.audioUrl || null);
          }
          setOutputResult(res.textOutput || String(res.output || 'Task Completed Successfully'));

          onSaveHistory({
            id: `hist-${Date.now()}`, toolId: tool.id, toolName: tool.name,
            prompt: apiService.extractPrompt(inputValues, tool.name),
            output: String(res.output).substring(0, 300), timestamp: new Date().toLocaleTimeString(),
            executionTimeMs: res.executionTimeMs || elapsed, outputType: tool.outputType,
          });
        }
        setIsRunning(false);
      }, 350);

    } catch (err) {
      clearInterval(progressInt);
      setIsRunning(false);
    } finally {
      clearInterval(timerInt);
    }
  };

  // 4. UNIVERSAL DIRECT BLOB DOWNLOAD HANDLER
  const handleDirectDownload = async () => {
    const targetUrl = fileDownloadUrl || mediaResultUrl;
    if (!targetUrl) return;
    setIsDownloading(true);

    const formatChoice = inputValues['outputFormat'] || 'TXT';
    let ext = 'txt';
    if (formatChoice.includes('JPG') || isImage) ext = 'jpg';
    else if (formatChoice.includes('PNG')) ext = 'png';
    else if (formatChoice.includes('MP4') || isVideo) ext = 'mp4';
    else if (formatChoice.includes('MP3') || isAudio) ext = 'mp3';
    else if (isPDF) ext = 'pdf';
    else if (formatChoice.includes('JSON')) ext = 'json';

    const filename = `${tool.id}-output.${ext}`;

    try {
      const response = await fetch(targetUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      const link = document.createElement('a');
      link.href = targetUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  const relatedTools = allTools.filter(t => t.id !== tool.id && t.category === tool.category).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] pb-12 font-mono">
      <div className="bg-[#151517] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
        </button>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        <div className="bg-[#151517] border border-white/10 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">{tool.category}</span>
            <h1 className="text-2xl font-extrabold text-white mt-1">{tool.name}</h1>
            <p className="text-xs text-slate-300 mt-1">{tool.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT DYNAMIC SETTINGS */}
          <div className="lg:col-span-4 bg-[#151517] border border-white/10 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold uppercase text-indigo-400 flex items-center gap-1.5"><Sliders className="w-4 h-4" /> Tool Parameters</span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 block">Output Format:</label>
              <select value={inputValues['outputFormat']} onChange={(e) => handleInputChange('outputFormat', e.target.value)} className="w-full px-3 py-2.5 bg-[#0A0A0A] border border-white/20 rounded text-xs text-white focus:border-indigo-500 font-bold">
                {formatOptions.map((fmt) => <option key={fmt} value={fmt}>{fmt}</option>)}
              </select>
            </div>

            {tool.inputs.map((param) => (
              <div key={param.id} className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 block">{param.name}</label>
                {param.type === 'textarea' || param.type === 'text' ? (
                  <textarea rows={2} value={inputValues[param.id] || ''} onChange={(e) => handleInputChange(param.id, e.target.value)} className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white focus:border-indigo-500" />
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
                  <div onClick={() => fileInputRef.current?.click()} className="border border-dashed border-indigo-500/40 hover:border-indigo-500 bg-[#0A0A0A] rounded-lg p-4 text-center cursor-pointer transition-all">
                    <UploadCloud className="w-6 h-6 text-indigo-400 mx-auto mb-1" />
                    <p className="text-xs text-slate-200 font-bold">Choose file or drag & drop</p>
                    <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && setUploadedFile(e.target.files[0])} className="hidden" />
                  </div>
                ) : (
                  <div className="p-2.5 bg-[#0A0A0A] border border-indigo-500/50 rounded flex items-center justify-between text-xs">
                    <span className="truncate text-white font-bold">{uploadedFile.name}</span>
                    <button onClick={() => setUploadedFile(null)} className="text-rose-400 p-1 hover:bg-rose-500/20 rounded cursor-pointer"><X className="w-4 h-4" /></button>
                  </div>
                )}
              </div>
            )}

            <button onClick={handleExecute} disabled={isRunning} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase rounded-xl flex items-center justify-center gap-2 mt-4 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer">
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRunning ? 'Processing...' : 'Execute Tool'}</span>
            </button>
          </div>

          {/* RIGHT LIVE PREVIEW & WORKSPACE */}
          <div className="lg:col-span-8 bg-[#151517] border border-white/10 rounded-lg p-6 min-h-[620px] flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-5">
                <span className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Live Workspace & Preview
                </span>
                {executionTime && <span className="text-emerald-400 text-[11px] bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 font-bold">{executionTime}ms</span>}
              </div>

              {!isRunning && !outputResult && (
                <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl flex flex-col items-center justify-center p-12 text-center min-h-[440px]">
                  <Sparkles className="w-16 h-16 text-indigo-400 mx-auto mb-3 animate-pulse" />
                  <h3 className="text-white font-bold text-base">{tool.name}</h3>
                  <p className="text-slate-400 text-xs mt-1">Configure parameters on the left and execute.</p>
                </div>
              )}

              {/* LIVE CIRCULAR PROGRESS BAR */}
              {isRunning && (
                <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-10 flex flex-col items-center justify-center min-h-[440px] space-y-6">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-600 rounded-full animate-spin border-t-transparent"></div>
                    <span className="text-white font-extrabold text-sm">{progressPercent}%</span>
                  </div>
                  <div className="w-full max-w-md space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>Executing AI / Core Logic...</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 transition-all duration-150" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUCCESS OUTPUT & PREVIEW */}
              {outputResult && !isRunning && (
                <div className="space-y-4 w-full flex flex-col items-center justify-center bg-[#0A0A0A] border border-emerald-500/30 rounded-xl p-6 min-h-[440px] shadow-2xl">
                  {mediaResultUrl && isImage ? (
                    <img src={mediaResultUrl} alt="Result" className="max-h-[340px] w-auto object-contain rounded-lg border border-white/10 shadow-xl" />
                  ) : (
                    <div className="w-full max-h-[300px] overflow-y-auto bg-black/50 p-4 rounded-lg border border-white/10 text-xs text-slate-200 whitespace-pre-wrap font-mono">
                      {outputResult}
                    </div>
                  )}

                  <button onClick={handleDirectDownload} disabled={isDownloading} className="w-full max-w-md py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs uppercase rounded-xl flex items-center justify-center gap-3 cursor-pointer shadow-xl transition-all">
                    {isDownloading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                    <span>{isDownloading ? 'Downloading...' : 'Download Output File'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* RELATED TOOLS SECTION */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <h4 className="text-[11px] font-extrabold uppercase text-slate-400 mb-3 tracking-wider">Give other tools a try. It's free.</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {relatedTools.map((t) => (
                  <button key={t.id} onClick={() => onSelectTool(t)} className="p-3 bg-white/5 hover:bg-indigo-600/10 border border-white/10 hover:border-indigo-500/40 rounded-xl text-left transition-all group cursor-pointer flex flex-col justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-indigo-400 truncate">{t.name}</span>
                    <span className="text-[10px] text-slate-400 mt-2 block">Free tool &rarr;</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
