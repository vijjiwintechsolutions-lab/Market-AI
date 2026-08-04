import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Play, Sparkles, Check, Download, RefreshCw, Sliders, UploadCloud, X, Paperclip, FileText, Edit3, Minimize2, Merge, Layers
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
  tool, onBack, onSaveHistory, favoriteIds, onToggleFavorite, onSelectTool, allTools
}) => {
  const isImage = tool.outputType === 'image' || tool.category?.toLowerCase().includes('image');
  const isPDF = tool.category?.toLowerCase().includes('pdf') || tool.category?.toLowerCase().includes('document');

  // 🚀 ADOBE-STYLE DYNAMIC FORMATS (JPG, PNG, TIFF)
  let formatOptions = ['JPG (*.jpg, *.jpeg)', 'PNG (*.png)', 'TIFF (*.tiff)'];
  if (!isPDF && !isImage) formatOptions = ['Plain Text (.txt)', 'PDF Document (.pdf)'];

  const [inputValues, setInputValues] = useState<Record<string, any>>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [outputResult, setOutputResult] = useState<string | null>(null);
  const [fileDownloadUrl, setFileDownloadUrl] = useState<string | null>(null);
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
    setOutputResult(null); setFileDownloadUrl(null);
    setUploadedFile(null); setPreviewUrl(null);
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

  // 🚀 ADOBE-STYLE LIVE EXECUTION WITH PROGRESS BAR ANIMATION
  const handleExecute = async () => {
    if (isPDF && !uploadedFile) {
      alert("Please upload a PDF file first to convert!");
      return;
    }

    setIsRunning(true);
    setOutputResult(null); setFileDownloadUrl(null);
    setProgressPercent(0); setElapsedSec(0);
    const startTime = Date.now();

    // Smooth Live Progress Bar Simulator (Like Adobe Acrobat 0% to 100%)
    const progressInt = setInterval(() => {
      setProgressPercent((p) => (p < 92 ? p + Math.floor(Math.random() * 12) + 5 : p));
    }, 120);
    const timerInt = setInterval(() => setElapsedSec((p) => parseFloat((p + 0.1).toFixed(1))), 100);

    try {
      const res = await apiService.executeTool({ tool, inputValues, file: uploadedFile });
      clearInterval(progressInt);
      setProgressPercent(100); // 100% Complete!
      
      const elapsed = Date.now() - startTime;
      setExecutionTime(res.executionTimeMs || elapsed);
      
      setTimeout(() => {
        if (res.success) {
          if (res.fileUrl) setFileDownloadUrl(res.fileUrl);
          setOutputResult(res.textOutput || "File Ready!");

          onSaveHistory({
            id: `hist-${Date.now()}`, toolId: tool.id, toolName: tool.name,
            prompt: apiService.extractPrompt(inputValues, tool.name),
            output: String(res.output).substring(0, 300), timestamp: new Date().toLocaleTimeString(),
            executionTimeMs: res.executionTimeMs || elapsed, outputType: tool.outputType,
          });
        }
        setIsRunning(false);
      }, 400);

    } catch (err) {
      clearInterval(progressInt);
      setIsRunning(false);
    } finally {
      clearInterval(timerInt);
    }
  };

  // 🚀 DIRECT BLOB DOWNLOAD (No new tabs, exact extension)
  const handleDirectDownloadFile = async () => {
    if (!fileDownloadUrl && !previewUrl) return;
    setIsDownloading(true);

    const formatChoice = inputValues['outputFormat'] || 'JPG';
    let ext = 'jpg';
    if (formatChoice.includes('PNG')) ext = 'png';
    else if (formatChoice.includes('TIFF')) ext = 'tiff';
    else if (formatChoice.includes('Text')) ext = 'txt';
    else if (isPDF) ext = 'pdf';

    const filename = `${tool.id}-output.${ext}`;
    const targetUrl = fileDownloadUrl || previewUrl;

    try {
      const response = await fetch(targetUrl!);
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
      link.href = targetUrl!;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  };

  // Related Tools Finder (Like Adobe's "Give other tools a try")
  const relatedTools = allTools.filter(t => t.id !== tool.id && t.category === tool.category).slice(0, 4);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E0E0E0] pb-12 font-mono">
      <div className="bg-[#151517] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Marketplace
        </button>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* BANNER */}
        <div className="bg-[#151517] border border-white/10 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-red-600/30 text-red-300 border border-red-500/40">Adobe Acrobat Style Engine</span>
            <h1 className="text-2xl font-extrabold text-white mt-1">{tool.name}</h1>
            <p className="text-xs text-slate-300 mt-1">{tool.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: PARAMETERS & FORMATS (ADOBE STYLE) */}
          <div className="lg:col-span-4 bg-[#151517] border border-white/10 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold uppercase text-red-400 flex items-center gap-1.5"><Sliders className="w-4 h-4" /> Conversion Settings</span>
            </div>

            {/* FORMAT DROPDOWN */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 block">Convert to:</label>
              <select value={inputValues['outputFormat']} onChange={(e) => handleInputChange('outputFormat', e.target.value)} className="w-full px-3 py-2.5 bg-[#0A0A0A] border border-white/20 rounded text-xs text-white focus:border-red-500 font-bold">
                {formatOptions.map((fmt) => <option key={fmt} value={fmt}>{fmt}</option>)}
              </select>
            </div>

            {tool.inputs.map((param) => (
              <div key={param.id} className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 block">{param.name}</label>
                {param.type === 'textarea' || param.type === 'text' ? (
                  <textarea rows={2} value={inputValues[param.id] || ''} onChange={(e) => handleInputChange(param.id, e.target.value)} className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white focus:border-red-500" />
                ) : param.type === 'select' ? (
                  <select value={inputValues[param.id] || param.options?.[0]} onChange={(e) => handleInputChange(param.id, e.target.value)} className="w-full px-3 py-2 bg-[#0A0A0A] border border-white/10 rounded text-xs text-white focus:border-red-500 font-mono">
                    {param.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                ) : null}
              </div>
            ))}

            {/* FILE UPLOAD BOX */}
            <div className="pt-3 border-t border-white/10 space-y-2">
              <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1"><Paperclip className="w-3.5 h-3.5 text-red-400" /> Upload Source PDF</span>
              {!uploadedFile ? (
                <div onClick={() => fileInputRef.current?.click()} className="border border-dashed border-red-500/40 hover:border-red-500 bg-[#0A0A0A] rounded-lg p-4 text-center cursor-pointer transition-all">
                  <UploadCloud className="w-6 h-6 text-red-500 mx-auto mb-1" />
                  <p className="text-xs text-slate-200 font-bold">Choose a file or drag & drop here</p>
                  <input type="file" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && setUploadedFile(e.target.files[0])} className="hidden" />
                </div>
              ) : (
                <div className="p-2.5 bg-[#0A0A0A] border border-red-500/50 rounded flex items-center justify-between text-xs">
                  <span className="truncate text-white font-bold">{uploadedFile.name}</span>
                  <button onClick={() => setUploadedFile(null)} className="text-rose-400 p-1 hover:bg-rose-500/20 rounded"><X className="w-4 h-4" /></button>
                </div>
              )}
            </div>

            {/* EXECUTE / CONVERT BUTTON */}
            <button onClick={handleExecute} disabled={isRunning} className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase rounded-xl flex items-center justify-center gap-2 mt-4 shadow-lg shadow-red-600/20 transition-all cursor-pointer">
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRunning ? 'Converting File...' : `Convert to ${inputValues['outputFormat']?.split(' ')[0] || 'JPG'}`}</span>
            </button>
          </div>

          {/* RIGHT: LIVE PREVIEW & ADOBE STYLE OUTPUT PANEL */}
          <div className="lg:col-span-8 bg-[#151517] border border-white/10 rounded-lg p-6 min-h-[620px] flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-5">
                <span className="text-xs font-bold uppercase text-red-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Live Acrobat Workspace & Preview
                </span>
                {executionTime && <span className="text-emerald-400 text-[11px] bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 font-bold">{executionTime}ms</span>}
              </div>

              {/* 1. INITIAL UPLOAD STATE */}
              {!isRunning && !outputResult && uploadedFile && (
                <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl flex flex-col items-center justify-center p-12 text-center min-h-[440px]">
                  <FileText className="w-16 h-16 text-red-500 mx-auto mb-3 animate-bounce" />
                  <h3 className="text-white font-bold text-base">{uploadedFile.name}</h3>
                  <p className="text-slate-400 text-xs mt-1">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • File Ready for Conversion</p>
                  <p className="text-[11px] text-red-400 mt-4 bg-red-500/10 px-4 py-1.5 rounded-full border border-red-500/20 font-bold">Click "Convert" to process instantly</p>
                </div>
              )}

              {/* 2. LIVE ADOBE STYLE PROGRESS BAR (0% - 100%) */}
              {isRunning && (
                <div className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl p-10 flex flex-col items-center justify-center min-h-[440px] space-y-6">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-red-500/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-red-600 rounded-full animate-spin border-t-transparent"></div>
                    <span className="text-white font-extrabold text-sm">{progressPercent}%</span>
                  </div>
                  <div className="w-full max-w-md space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>Converting Document...</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-red-600 transition-all duration-150" style={{ width: `${progressPercent}%` }}></div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">Securing output format and rendering layout...</p>
                </div>
              )}

              {/* 3. SUCCESS PREVIEW & DOWNLOAD PANE */}
              {outputResult && !isRunning && (
                <div className="space-y-4 w-full flex flex-col items-center justify-center bg-[#0A0A0A] border border-red-500/30 rounded-xl p-6 min-h-[400px] shadow-2xl">
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/40">
                    <Check className="w-6 h-6" />
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="text-white font-extrabold text-lg">Your file is ready!</h3>
                    <p className="text-slate-400 text-xs">Successfully processed via Adobe-Style Neural Engine.</p>
                  </div>

                  {/* ADOBE STYLE BIG DOWNLOAD BUTTON */}
                  <button onClick={handleDirectDownloadFile} disabled={isDownloading} className="w-full max-w-md py-4 px-6 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase rounded-xl flex items-center justify-center gap-3 cursor-pointer shadow-xl shadow-red-600/30 transition-all">
                    {isDownloading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                    <span>{isDownloading ? 'Downloading File...' : `Download ${inputValues['outputFormat']?.split(' ')[0] || 'JPG'}`}</span>
                  </button>
                </div>
              )}
            </div>

            {/* 🚀 ADOBE STYLE "GIVE OTHER TOOLS A TRY" (RELATED TOOLS) */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <h4 className="text-[11px] font-extrabold uppercase text-slate-400 mb-3 tracking-wider">Give other tools a try. It's free.</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {relatedTools.map((t) => (
                  <button key={t.id} onClick={() => onSelectTool(t)} className="p-3 bg-white/5 hover:bg-red-600/10 border border-white/10 hover:border-red-500/40 rounded-xl text-left transition-all group cursor-pointer flex flex-col justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-red-400 truncate">{t.name}</span>
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
